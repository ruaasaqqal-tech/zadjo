import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export default function OrderTrackerChat() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Start conversation on first open
  useEffect(() => {
    if (open && !conversationId) {
      base44.agents.createConversation({
        agent_name: 'order_tracker',
        metadata: { name: 'تتبع الطلب' }
      }).then(conv => {
        setConversationId(conv.id);
        setMessages(conv.messages || []);
      });
    }
  }, [open, conversationId]);

  // Subscribe to streaming updates
  useEffect(() => {
    if (!conversationId) return;
    const unsub = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsub();
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending || !conversationId) return;
    setInput('');
    setSending(true);
    const conv = await base44.agents.getConversation(conversationId);
    await base44.agents.addMessage(conv, { role: 'user', content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const isTyping = messages.length > 0 && messages[messages.length - 1]?.role === 'user';

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-4 z-40 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-secondary transition-colors md:bottom-6"
        style={{ userSelect: 'none' }}
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto bg-card border border-border rounded-t-3xl shadow-2xl flex flex-col"
            style={{ height: '70vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border rounded-t-3xl bg-primary text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-bold text-sm">مساعد تتبع الطلبات</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <Bot className="h-10 w-10 mx-auto mb-2 text-primary/40" />
                  <p>مرحباً! اسألني عن حالة طلبك 🚀</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {msg.role === 'assistant'
                      ? <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">{msg.content}</ReactMarkdown>
                      : <p>{msg.content}</p>
                    }
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="اسأل عن طلبك..."
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none"
                dir="rtl"
              />
              <Button size="icon" onClick={sendMessage} disabled={sending || !input.trim()} className="rounded-xl">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}