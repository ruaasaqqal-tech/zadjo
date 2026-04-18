import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Phone, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { useCallback } from 'react';

const STATUS_CONFIG = {
  'تم الطلب': { step: 1, label: '✅ تم قبول الطلب', color: 'bg-green-100 text-green-700' },
  'قيد التحضير': { step: 2, label: '🍽️ قيد التحضير', color: 'bg-blue-100 text-blue-700' },
  'في الطريق': { step: 3, label: '🚗 بالطريق إليك', color: 'bg-purple-100 text-purple-700' },
  'تم التوصيل': { step: 4, label: '🎉 تم التوصيل', color: 'bg-emerald-100 text-emerald-700' },
};

export default function TrackOrderLive() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const orders = await base44.entities.Order.list();
      const found = orders.find(o => o.id === orderId);
      if (found) setOrder(found);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order:', err);
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.Order.subscribe((event) => {
      if (event.id === orderId && event.type === 'update') {
        setOrder(event.data);
      }
    });
    return () => unsubscribe();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">الطلب غير موجود</p>
      </div>
    );
  }

  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['تم الطلب'];

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">تتبع الطلب</h1>
      </div>

      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 mb-6 ${config.color}`}
      >
        <p className="text-lg font-bold">{config.label}</p>
      </motion.div>

      {/* Status Timeline */}
      <div className="mb-8 space-y-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg], idx) => {
          const isActive = cfg.step <= config.step;
          const isCurrent = status === order.status;

          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                isCurrent
                  ? 'border-primary bg-primary/5'
                  : isActive
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-muted bg-muted/30'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {cfg.step}
              </div>
              <span className={isActive ? 'font-bold' : 'text-muted-foreground'}>{cfg.label}</span>
              {isCurrent && <Loader2 className="h-4 w-4 animate-spin ml-auto text-primary" />}
            </motion.div>
          );
        })}
      </div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-5 border border-border/50 mb-6 space-y-4"
      >
        <div className="flex justify-between items-center pb-3 border-b border-border/50">
          <span className="text-sm text-muted-foreground">معرف الطلب</span>
          <span className="font-bold">{order.id.slice(0, 8)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">المبلغ الإجمالي</span>
          <span className="text-lg font-bold text-primary">{order.total?.toFixed(2)} د.أ</span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-muted-foreground">عنوان التوصيل</p>
            <p className="font-medium">{order.address}</p>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">العناصر</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-0.5">
                <span>{item.meal_name} × {item.quantity}</span>
                <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Kitchen Location */}
      {order.kitchen_location_url && order.status !== 'تم الطلب' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border border-border/50 mb-6"
        >
          <h3 className="font-bold mb-3">موقع المطبخ</h3>
          <a
            href={order.kitchen_location_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            <MapPin className="h-4 w-4" />
            فتح على Google Maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>
      )}

      {/* Driver Info (if available) */}
      {order.status === 'في الطريق' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border border-border/50 mb-6"
        >
          <h3 className="font-bold mb-3">معلومات المندوب</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">👨‍💼</div>
              <div>
                <p className="text-sm text-muted-foreground">اسم المندوب</p>
                <p className="font-medium">قريباً</p>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl gap-2" disabled>
              <Phone className="h-4 w-4" />
              الاتصال بالمندوب
            </Button>
          </div>
        </motion.div>
      )}

      {/* Map Placeholder */}
      {order.status !== 'تم الطلب' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full h-64 bg-muted rounded-2xl border border-border/50 flex items-center justify-center mb-6"
        >
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">خريطة التوصيل</p>
            <p className="text-xs text-muted-foreground mt-1">قريباً</p>
          </div>
        </motion.div>
      )}

      <Button onClick={() => navigate('/track-order')} className="w-full rounded-2xl bg-primary hover:bg-secondary text-white shadow-lg transition-colors">
        إلى قائمة الطلبات
      </Button>
    </div>
  );
}