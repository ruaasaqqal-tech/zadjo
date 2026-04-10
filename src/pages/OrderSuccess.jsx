import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto px-4 py-20 text-center"
    >
      <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">تم إرسال طلبك بنجاح! 🎉</h1>
      <p className="text-muted-foreground mb-2">رقم الطلب: <span className="font-mono font-bold">{orderId?.slice(0, 8)}</span></p>
      <p className="text-sm text-muted-foreground mb-8">سنتواصل معك قريباً لتأكيد الطلب. الدفع نقداً عند الاستلام.</p>

      <div className="flex flex-col gap-3">
        <Link to={`/track-order?id=${orderId}`}>
          <Button className="w-full rounded-2xl h-12">تتبع طلبك</Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="w-full rounded-2xl h-12">العودة للرئيسية</Button>
        </Link>
      </div>
    </motion.div>
  );
}