import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    base44.entities.Order.list().then(orders => {
      const found = orders.find(o => o.id === orderId);
      if (found) setOrder(found);
    });
  }, [orderId]);

  const handleTrackOrder = () => {
    navigate(`/track-order-live/${orderId}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-emerald-600" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-center mb-2"
      >
        {t('orderConfirmed')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-center mb-6"
      >
        شكراً لك! سنبدأ في تحضير طلبك الآن
      </motion.p>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-card rounded-2xl p-6 border border-border/50 mb-6 space-y-4"
        >
          <div className="flex justify-between items-center pb-4 border-b border-border/50">
            <span className="text-sm text-muted-foreground">معرف الطلب</span>
            <span className="font-bold text-lg text-primary">{order.id.slice(0, 8)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">المبلغ الإجمالي</span>
            <span className="text-2xl font-bold text-primary">{order.total?.toFixed(2)} د.أ</span>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">وقت التوصيل المتوقع</p>
              <p className="text-blue-700">30-45 دقيقة</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{item.meal_name} × {item.quantity}</span>
                <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-muted-foreground">العنوان</p>
              <p className="font-medium">{order.address}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="w-full space-y-3">
        <Button onClick={handleTrackOrder} className="w-full h-12 rounded-2xl text-base font-bold bg-primary hover:bg-orange-700 text-white shadow-lg">
          تتبع طلبك 📍
        </Button>
        <Button onClick={() => navigate('/menu')} variant="outline" className="w-full h-12 rounded-2xl border-primary text-primary hover:bg-orange-50">
          استمر في التسوق
        </Button>
      </div>
    </div>
  );
}