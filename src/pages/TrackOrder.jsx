import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Package, Clock, Truck, CheckCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const STATUS_STEPS = [
  { key: 'تم الطلب', label: 'تم الطلب', icon: Package },
  { key: 'قيد التحضير', label: 'قيد التحضير', icon: Clock },
  { key: 'في الطريق', label: 'في الطريق', icon: Truck },
  { key: 'تم التوصيل', label: 'تم التوصيل', icon: CheckCircle },
];

export default function TrackOrder() {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: () => base44.entities.Order.filter({ created_by: user?.email }, '-created_date', 1),
    enabled: !!user?.email,
  });

  const order = orders[0] || null;
  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order?.status);

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">تتبع طلبك</h1>

      {isLoading && (
        <div className="text-center text-muted-foreground py-12">جاري التحميل...</div>
      )}

      {!isLoading && !order && (
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

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-5"
        >
          {order.kitchen_name && (
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-1">
              <span className="text-lg">🏠</span>
              <div>
                <p className="text-xs text-muted-foreground">طلبك من</p>
                <p className="text-sm font-bold text-orange-700 dark:text-orange-400">{order.kitchen_name}</p>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-primary">{order.total?.toFixed(2)} د.أ</span>
          </div>

          {/* Status tracker */}
          <div>
            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;
              return (
                <div key={step.key} className="flex items-center gap-4 mb-4 last:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="mr-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">الحالة الحالية</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Items */}
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-sm mb-3">تفاصيل الطلب</h4>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5">
                <span>{item.meal_name} × {item.quantity}</span>
                <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">العنوان</span>
              <span className="text-right max-w-[60%]">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">الدفع</span>
              <span>نقداً عند الاستلام</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">الخصم</span>
                <span className="text-green-600">- {order.discount?.toFixed(2)} د.أ</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}