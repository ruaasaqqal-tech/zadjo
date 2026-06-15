import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Package, Clock, Truck, CheckCircle, XCircle, ChefHat, LogOut, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  'تم الطلب':    { icon: Package,     color: 'bg-purple-100 text-purple-700' },
  'قيد التحضير': { icon: Clock,       color: 'bg-amber-100 text-amber-700' },
  'في الطريق':   { icon: Truck,       color: 'bg-violet-100 text-violet-700' },
  'تم التوصيل':  { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' },
  'ملغي':        { icon: XCircle,     color: 'bg-red-100 text-red-700' },
};

const STATUS_FLOW = ['تم الطلب', 'قيد التحضير', 'في الطريق', 'تم التوصيل'];

export default function KitchenPortal() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('orders'); // 'orders' | 'meals'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const session = (() => {
    try { return JSON.parse(localStorage.getItem('kitchen_session')); } catch { return null; }
  })();

  useEffect(() => {
    if (!session?.name) { navigate('/kitchen-login'); return; }
  }, []);

  // Load kitchen orders (only this kitchen)
  useEffect(() => {
    if (!session?.name) return;
    base44.entities.Order.filter({ kitchen_name: session.name }).then(data => {
      setOrders(data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      setLoadingOrders(false);
    });
    const unsub = base44.entities.Order.subscribe(event => {
      if (event.type === 'create' && event.data?.kitchen_name === session.name) {
        toast.success(`🔔 طلب جديد! ${event.data.customer_name} - ${event.data.total?.toFixed(2)} د.أ`);
        setOrders(prev => [event.data, ...prev]);
      } else if (event.type === 'update') {
        setOrders(prev => prev.map(o => o.id === event.id ? { ...o, ...event.data } : o));
      }
    });
    return () => unsub();
  }, [session?.name]);

  const { data: meals = [] } = useQuery({
    queryKey: ['kitchen-meals', session?.name],
    queryFn: () => base44.entities.Meal.filter({ cook_name: session.name }),
    enabled: !!session?.name,
  });

  const { data: kitchenData = [] } = useQuery({
    queryKey: ['kitchen-info', session?.name],
    queryFn: () => base44.entities.Kitchen.filter({ cook_name: session.name }),
    enabled: !!session?.name,
  });
  const kitchen = kitchenData[0];

  const updateStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await base44.entities.Order.update(orderId, { status: newStatus });
  };

  const toggleMeal = async (meal) => {
    await base44.entities.Meal.update(meal.id, { available: !meal.available });
    qc.invalidateQueries({ queryKey: ['kitchen-meals', session?.name] });
    toast.success(meal.available ? 'تم إخفاء الوجبة' : 'تم تفعيل الوجبة');
  };

  const toggleKitchen = async () => {
    if (!kitchen) return;
    await base44.entities.Kitchen.update(kitchen.id, { active: !kitchen.active });
    qc.invalidateQueries({ queryKey: ['kitchen-info', session?.name] });
    toast.success(kitchen.active ? 'تم إغلاق المطبخ' : 'تم فتح المطبخ');
  };

  const logout = () => {
    localStorage.removeItem('kitchen_session');
    navigate('/kitchen-login');
  };

  const getNext = (s) => { const i = STATUS_FLOW.indexOf(s); return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null; };

  if (!session?.name) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur border-b border-border/50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">{session.name}</p>
            <p className="text-[10px] text-muted-foreground">Zad JO - لوحة المطبخ</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {kitchen && (
            <div className="flex items-center gap-2 text-xs">
              <span className={kitchen.active ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>
                {kitchen.active ? 'مفتوح' : 'مغلق'}
              </span>
              <Switch checked={!!kitchen.active} onCheckedChange={toggleKitchen} />
            </div>
          )}
          <button onClick={logout} className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        {[{ id: 'orders', label: 'الطلبات', icon: Package }, { id: 'meals', label: 'الوجبات', icon: UtensilsCrossed }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              tab === t.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
            }`}>
            <t.icon className="h-4 w-4" /> {t.label}
            {t.id === 'orders' && orders.filter(o => o.status === 'تم الطلب').length > 0 && (
              <span className="bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {orders.filter(o => o.status === 'تم الطلب').length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {loadingOrders ? (
              <p className="text-center py-8 text-muted-foreground">جاري التحميل...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>لا توجد طلبات بعد</p>
              </div>
            ) : orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['تم الطلب'];
              const Icon = cfg.icon;
              const next = getNext(order.status);
              return (
                <div key={order.id} className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{order.customer_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                          <Icon className="h-3 w-3" />{order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                      <p className="text-xs text-muted-foreground">{order.created_date ? new Date(order.created_date).toLocaleString('ar-JO') : ''}</p>
                    </div>
                    <span className="text-lg font-extrabold text-primary">{order.total?.toFixed(2)} د.أ</span>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 mb-3 space-y-1">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.meal_name} × {item.quantity}</span>
                        <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} د.أ</span>
                      </div>
                    ))}
                  </div>
                  {order.notes && <p className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-2 mb-3">📝 {order.notes}</p>}
                  <div className="flex gap-2">
                    {next && (
                      <Button size="sm" className="rounded-xl" onClick={() => updateStatus(order.id, next)}>
                        نقل إلى: {next}
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

        {/* Meals Tab */}
        {tab === 'meals' && (
          <div className="space-y-3">
            {meals.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>لا توجد وجبات بعد</p>
                <p className="text-xs mt-1">أضف وجبات من لوحة الإدارة</p>
              </div>
            ) : meals.map(meal => (
              <div key={meal.id} className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-4">
                {meal.image ? (
                  <img src={meal.image} alt={meal.meal_name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-2xl">🍽️</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{meal.meal_name}</h3>
                  <p className="text-xs text-muted-foreground">{meal.category}</p>
                  <p className="text-sm font-bold text-primary">{meal.price} د.أ</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs ${meal.available ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                    {meal.available ? 'متاح' : 'مخفي'}
                  </span>
                  <Switch checked={!!meal.available} onCheckedChange={() => toggleMeal(meal)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}