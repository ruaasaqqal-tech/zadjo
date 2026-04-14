import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Package, Clock, Truck, CheckCircle, ShoppingBag, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ReviewModal from '@/components/ReviewModal';

const STATUS_STEPS = [
  { key: 'تم الطلب', label: 'تم الطلب', icon: Package },
  { key: 'قيد التحضير', label: 'قيد التحضير', icon: Clock },
  { key: 'في الطريق', label: 'في الطريق', icon: Truck },
  { key: 'تم التوصيل', label: 'تم التوصيل', icon: CheckCircle },
];

function CancelCountdown({ order, onCancel }) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(order.created_date).getTime()) / 1000);
    return Math.max(0, 300 - elapsed);
  });

  useEffect(() => {
    const t = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(order.created_date).getTime()) / 1000);
      setSecondsLeft(Math.max(0, 300 - elapsed));
    }, 1000);
    return () => clearInterval(t);
  }, [order.created_date]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  if (secondsLeft <= 0) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-xl text-destructive border-destructive/40 gap-1"
      onClick={onCancel}
    >
      إلغاء ({mm}:{ss})
    </Button>
  );
}

export default function TrackOrder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('reviewed_orders') || '[]'); } catch { return []; }
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: () => base44.entities.Order.filter({ created_by: user?.email }, '-created_date', 20),
    enabled: !!user?.email,
    refetchInterval: 15000,
  });

  const handleCancel = async (order) => {
    if (!order) return;
    const elapsed = Date.now() - new Date(order.created_date).getTime();
    if (elapsed >= 300000) {
      toast.error('انتهت مدة الإلغاء (5 دقائق)');
      return;
    }
    await base44.entities.Order.update(order.id, { status: 'ملغي' });
    queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    toast.success('تم إلغاء الطلب');
  };

  const handleReviewDone = (orderId) => {
    const updated = [...reviewedIds, orderId];
    setReviewedIds(updated);
    localStorage.setItem('reviewed_orders', JSON.stringify(updated));
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">طلباتي</h1>

      {isLoading && (
        <div className="text-center text-muted-foreground py-12">جاري التحميل...</div>
      )}

      {!isLoading && orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">لا يوجد لديك طلبات حالياً</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">اطلب وجبتك المفضلة الآن!</p>
          <Link to="/menu">
            <Button className="rounded-2xl px-8">تصفح القائمة</Button>
          </Link>
        </motion.div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
          const canCancel = order.status === 'تم الطلب' && (Date.now() - new Date(order.created_date).getTime()) < 300000;
          const isDelivered = order.status === 'تم التوصيل';
          const alreadyReviewed = reviewedIds.includes(order.id);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  {order.kitchen_name && (
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">🏠 {order.kitchen_name}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.created_date ? new Date(order.created_date).toLocaleString('ar-JO') : ''}
                  </p>
                </div>
                <span className="text-lg font-extrabold text-primary">{order.total?.toFixed(2)} د.أ</span>
              </div>

              {/* Status tracker */}
              {order.status !== 'ملغي' ? (
                <div className="flex items-center gap-1">
                  {STATUS_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i <= currentStepIdx;
                    const isCurrent = i === currentStepIdx;
                    return (
                      <div key={step.key} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground/40'
                        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${i < currentStepIdx ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">ملغي</span>
              )}

              {/* Items */}
              <div className="bg-muted/40 rounded-xl p-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-0.5">
                    <span>{item.meal_name} × {item.quantity}</span>
                    <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">📍 {order.address}</div>

              {/* Actions */}
              <div className="flex gap-2">
                {canCancel && (
                  <CancelCountdown order={order} onCancel={() => handleCancel(order)} />
                )}
                {isDelivered && !alreadyReviewed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-1 text-amber-600 border-amber-300"
                    onClick={() => setReviewOrder(order)}
                  >
                    <Star className="h-3.5 w-3.5" />
                    قيّم الطلب
                  </Button>
                )}
                {isDelivered && alreadyReviewed && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                    تم التقييم
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {reviewOrder && (
          <ReviewModal
            order={reviewOrder}
            onClose={() => setReviewOrder(null)}
            onDone={() => handleReviewDone(reviewOrder.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}