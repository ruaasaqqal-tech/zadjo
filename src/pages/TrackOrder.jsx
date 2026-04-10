import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_STEPS = [
  { key: 'تم الطلب', label: 'تم الطلب', icon: Package },
  { key: 'قيد التحضير', label: 'قيد التحضير', icon: Clock },
  { key: 'في الطريق', label: 'في الطريق', icon: Truck },
  { key: 'تم التوصيل', label: 'تم التوصيل', icon: CheckCircle },
];

export default function TrackOrder() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialId = urlParams.get('id') || '';
  const [orderId, setOrderId] = useState(initialId);
  const [searchId, setSearchId] = useState(initialId);

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['order-track', searchId],
    queryFn: async () => {
      if (!searchId) return null;
      const orders = await base44.entities.Order.filter({ id: searchId });
      return orders[0] || null;
    },
    enabled: !!searchId,
  });

  const handleSearch = () => {
    setSearchId(orderId.trim());
    refetch();
  };

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order?.status);

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">تتبع طلبك</h1>

      <div className="flex gap-2 mb-8">
        <Input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="أدخل رقم الطلب"
          className="rounded-xl"
          dir="ltr"
        />
        <Button onClick={handleSearch} className="rounded-xl px-6">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground py-8">جاري البحث...</div>
      )}

      {searchId && !isLoading && !order && (
        <div className="text-center text-muted-foreground py-8">
          <p className="text-lg mb-2">لم يتم العثور على الطلب</p>
          <p className="text-sm">تأكد من رقم الطلب وحاول مجدداً</p>
        </div>
      )}

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold">طلب #{order.id?.slice(0, 8)}</h3>
              <p className="text-xs text-muted-foreground">{order.customer_name}</p>
            </div>
            <span className="text-lg font-bold text-primary">{order.total?.toFixed(2)} د.أ</span>
          </div>

          {/* Status tracker */}
          <div className="relative mb-6">
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
            <h4 className="font-medium text-sm mb-2">تفاصيل الطلب</h4>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{item.meal_name} × {item.quantity}</span>
                <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-3 pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">العنوان</span><span>{order.address}</span></div>
            <div className="flex justify-between mt-1"><span className="text-muted-foreground">الدفع</span><span>نقداً عند الاستلام</span></div>
          </div>
        </motion.div>
      )}
    </div>
  );
}