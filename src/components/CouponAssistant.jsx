import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CouponAssistant({ cartTotal, onApplyCoupon }) {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = async () => {
    setOpen(true);
    if (conversationId) return;
    const conv = await base44.agents.createConversation({
      agent_name: 'coupon_assistant',
      metadata: { name: 'مساعد الكوبونات' },
    });
    setConversationId(conv.id);
    // Send initial context
    const initMsg = `مجموع السلة الحالي: ${cartTotal?.toFixed(2)} د.أ. ساعدني في إيجاد أفضل كوبون خصم.`;
    setSending(true);
    const updatedConv = await base44.agents.addMessage(conv, { role: 'user', content: initMsg });
    setMessages(updatedConv.messages || []);
    setSending(false);
    const unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsub();
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    const conv = await base44.agents.getConversation(conversationId);
    const updated = await base44.agents.addMessage(conv, { role: 'user', content: text });
    setMessages(updated.messages || []);
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Extract coupon code from assistant message and allow applying
  const extractCoupon = (text) => {
    const match = text?.match(/\b([A-Z0-9]{4,20})\b/);
    return match?.[1] || null;
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={startConversation}
        className="fixed bottom-24 left-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl flex items-center justify-center text-white"
        style={{ bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bg-card border border-border/60 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
            style={{
              bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
              left: 16,
              right: 16,
              maxWidth: 420,
              margin: '0 auto',
              height: 480,
            }}
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-bold text-sm">مساعد الكوبونات - Zad JO</span>
              </div>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.filter(m => m.role !== 'system' && !m.tool_calls?.length).map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-white'
                  }`}>
                    {msg.role === 'user'
                      ? <p>{msg.content}</p>
                      : <ReactMarkdown className="prose prose-sm prose-invert text-white text-xs">{msg.content}</ReactMarkdown>
                    }
                    {msg.role === 'assistant' && extractCoupon(msg.content) && onApplyCoupon && (
                      <button
                        onClick={() => { onApplyCoupon(extractCoupon(msg.content)); setOpen(false); }}
                        className="mt-2 w-full bg-white/20 hover:bg-white/30 rounded-xl py-1.5 text-xs font-bold text-white transition-colors"
                      >
                        ✅ تطبيق الكوبون: {extractCoupon(msg.content)}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-end">
                  <div className="bg-primary/20 rounded-2xl px-4 py-2 text-xs text-primary animate-pulse">يفكر...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-border/50 flex-shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالة..."
                className="flex-1 text-sm bg-muted rounded-xl px-3 py-2 outline-none border border-border focus:border-primary"
                disabled={sending}
              />
              <Button size="icon" className="h-9 w-9 rounded-xl flex-shrink-0" onClick={sendMessage} disabled={sending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}