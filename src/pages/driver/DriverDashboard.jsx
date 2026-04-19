import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Package, Clock, Truck, CheckCircle, Navigation, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  'تم الطلب':     { icon: Package,       color: 'bg-blue-100 text-blue-700',     step: 1 },
  'قيد التحضير':  { icon: Clock,         color: 'bg-amber-100 text-amber-700',   step: 2 },
  'في الطريق':    { icon: Truck,         color: 'bg-violet-100 text-violet-700', step: 3 },
  'تم التوصيل':   { icon: CheckCircle,   color: 'bg-emerald-100 text-emerald-700', step: 4 },
};

const STATUS_FLOW = ['تم الطلب', 'قيد التحضير', 'في الطريق', 'تم التوصيل'];

// Active = orders driver cares about
const ACTIVE_STATUSES = ['تم الطلب', 'قيد التحضير', 'في الطريق'];

export default function DriverDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDone, setShowDone] = useState(false);
  const initialLoadDone = useRef(false);

  const fetchOrders = async () => {
    const data = await base44.entities.Order.list('-created_date', 100);
    setOrders(data);
    setLoading(false);
    initialLoadDone.current = true;
  };

  useEffect(() => {
    fetchOrders();

    const unsub = base44.entities.Order.subscribe((event) => {
      if (event.type === 'create') {
        setOrders(prev => {
          if (prev.find(o => o.id === event.id)) return prev;
          const o = event.data;
          if (initialLoadDone.current) {
            toast.success(`🔔 طلب جديد من ${o?.customer_name}`, { duration: 8000 });
          }
          return [o, ...prev];
        });
      } else if (event.type === 'update') {
        setOrders(prev => prev.map(o => o.id === event.id ? { ...o, ...event.data } : o));
      } else if (event.type === 'delete') {
        setOrders(prev => prev.filter(o => o.id !== event.id));
      }
    });

    return () => unsub();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await base44.entities.Order.update(orderId, { status: newStatus });
    toast.success(`تم تحديث الحالة إلى: ${newStatus}`);
  };

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const openKitchenLocation = (order) => {
    if (order.kitchen_location_url) {
      window.open(order.kitchen_location_url, '_blank');
    } else {
      toast.error('لا يوجد رابط موقع لهذا المطبخ');
    }
  };

  const openCustomerLocation = (order) => {
    const query = encodeURIComponent(order.address || '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status));
  const doneOrders = orders.filter(o => o.status === 'تم التوصيل');

  return (
    <div className="min-h-screen bg-gray-50 pb-10" dir="rtl">
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-12 pb-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">🚗 لوحة السائق</h1>
            <p className="text-white/70 text-xs mt-0.5">Zad JO — Driver Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOrders} className="p-2 rounded-full bg-white/10 active:bg-white/20">
              <RefreshCw className="h-4 w-4" />
            </button>
            <div className="bg-white/20 rounded-2xl px-3 py-1.5 text-sm font-bold">
              {activeOrders.length} نشط
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="font-medium">لا توجد طلبات نشطة</p>
          </div>
        ) : (
          <AnimatePresence>
            {activeOrders.map((order) => {
              const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['تم الطلب'];
              const Icon = config.icon;
              const nextStatus = getNextStatus(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                >
                  {/* Status Bar */}
                  <div className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold ${config.color}`}>
                    <Icon className="h-4 w-4" />
                    {order.status}
                    <span className="mr-auto text-xs opacity-70">
                      {order.created_date ? new Date(order.created_date).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Customer Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-black text-lg">{order.customer_name}</h3>
                        <a
                          href={`tel:${order.phone}`}
                          className="flex items-center gap-1.5 text-blue-600 text-sm font-medium mt-0.5"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {order.phone}
                        </a>
                      </div>
                      <div className="text-left">
                        <span className="text-2xl font-black text-primary">{order.total?.toFixed(2)}</span>
                        <p className="text-xs text-muted-foreground">د.أ — كاش</p>
                      </div>
                    </div>

                    {/* Kitchen Name */}
                    {order.kitchen_name && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm">
                        🍽️ <span className="font-bold">{order.kitchen_name}</span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{item.meal_name} × {item.quantity}</span>
                          <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <p className="text-xs bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-yellow-800">
                        📝 {order.notes}
                      </p>
                    )}

                    {/* Navigation Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Kitchen Location */}
                      <button
                        onClick={() => openKitchenLocation(order)}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors ${
                          order.kitchen_location_url
                            ? 'bg-primary text-white active:bg-secondary'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!order.kitchen_location_url}
                      >
                        <MapPin className="h-4 w-4" />
                        موقع المطبخ
                        <ExternalLink className="h-3 w-3" />
                      </button>

                      {/* Customer Location */}
                      <button
                        onClick={() => openCustomerLocation(order)}
                        className="flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-xl py-3 text-sm font-bold active:bg-emerald-600 transition-colors"
                      >
                        <Navigation className="h-4 w-4" />
                        موقع الزبون
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Status Update Button */}
                    {nextStatus && (
                      <button
                        onClick={() => updateStatus(order.id, nextStatus)}
                        className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm active:bg-gray-700 transition-colors"
                      >
                        ✅ نقل إلى: {nextStatus}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Completed Orders Toggle */}
        {doneOrders.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowDone(!showDone)}
              className="w-full text-center text-sm text-muted-foreground py-3 border border-dashed border-border rounded-2xl"
            >
              {showDone ? '▲ إخفاء' : '▼ عرض'} الطلبات المكتملة ({doneOrders.length})
            </button>

            <AnimatePresence>
              {showDone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 space-y-3"
                >
                  {doneOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-100 opacity-70">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.address}</p>
                        </div>
                        <span className="text-emerald-600 font-bold">{order.total?.toFixed(2)} د.أ ✓</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}