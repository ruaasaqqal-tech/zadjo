import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

export default function ReviewModal({ order, onClose, onDone }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { toast.error('يرجى اختيار تقييم'); return; }
    setSubmitting(true);
    await base44.entities.Review.create({
      kitchen_id: order.kitchen_id || '',
      kitchen_name: order.kitchen_name || '',
      order_id: order.id,
      rating,
      comment,
      reviewer_name: user?.full_name || 'مجهول',
    });
    toast.success('شكراً على تقييمك!');
    onDone();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">قيّم طلبك</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">من {order.kitchen_name}</p>

        <div className="flex gap-2 justify-center mb-5">
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(i)}
            >
              <Star className={`h-9 w-9 transition-colors ${
                i <= (hovered || rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
              }`} />
            </button>
          ))}
        </div>

        <Textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="اكتب تعليقك هنا... (اختياري)"
          className="rounded-xl mb-4"
          rows={3}
        />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>إلغاء</Button>
          <Button className="flex-1 rounded-xl" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '...' : 'إرسال التقييم'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}