import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const STATUSES = ['الكل', 'تم الطلب', 'قيد التحضير', 'في الطريق', 'تم التوصيل', 'ملغي'];
const STATUS_FLOW = ['تم الطلب', 'قيد التحضير', 'في الطريق', 'تم التوصيل'];

const STATUS_CONFIG = {
  'تم الطلب': { icon: Package, color: 'bg-blue-100 text-blue-700' },
  'قيد التحضير': { icon: Clock, color: 'bg-amber-100 text-amber-700' },
  'في الطريق': { icon: Truck, color: 'bg-violet-100 text-violet-700' },
  'تم التوصيل': { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' },
  'ملغي': { icon: XCircle, color: 'bg-red-100 text-red-700' },
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('الكل');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 200),
  });

  const filtered = filter === 'الكل' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (orderId, newStatus) => {
    await base44.entities.Order.update(orderId, { status: newStatus });
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
  };

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx >= 0 && idx < STATUS_FLOW.length - 1) return STATUS_FLOW[idx + 1];
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <span className="text-sm text-muted-foreground">{filtered.length} طلب</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {s}
            {s !== 'الكل' && (
              <span className="mr-1 text-xs">({orders.filter(o => o.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['تم الطلب'];
            const Icon = config.icon;
            const nextStatus = getNextStatus(order.status);

            return (
              <div key={order.id} className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{order.customer_name}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${config.color}`}>
                        <Icon className="h-3 w-3" />
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.phone} • {order.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.created_date ? new Date(order.created_date).toLocaleString('ar-JO') : ''}
                    </p>
                  </div>
                  <span className="text-lg font-extrabold text-primary">{order.total?.toFixed(2)} د.أ</span>
                </div>

                <div className="bg-muted/50 rounded-xl p-3 mb-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-0.5">
                      <span>{item.meal_name} × {item.quantity}</span>
                      <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
                    </div>
                  ))}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 border-t border-border/50 mt-1 pt-1">
                      <span>خصم {order.coupon_code && `(${order.coupon_code})`}</span>
                      <span>-{order.discount?.toFixed(2)} د.أ</span>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <p className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-2 mb-3">📝 {order.notes}</p>
                )}

                <div className="flex gap-2">
                  {nextStatus && (
                    <Button size="sm" className="rounded-xl gap-1" onClick={() => updateStatus(order.id, nextStatus)}>
                      نقل إلى: {nextStatus}
                    </Button>
                  )}
                  {order.status !== 'ملغي' && order.status !== 'تم التوصيل' && (
                    <Button size="sm" variant="outline" className="rounded-xl text-destructive" onClick={() => updateStatus(order.id, 'ملغي')}>
                      إلغاء
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}