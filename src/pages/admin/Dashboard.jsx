import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StatCard from '../../components/admin/StatCard';
import { Package, UtensilsCrossed, DollarSign, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 500),
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['admin-meals'],
    queryFn: () => base44.entities.Meal.list('-orders_count', 100),
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'تم التوصيل').length;
  const uniqueCooks = [...new Set(meals.map(m => m.cook_name))].length;

  // Top meals for chart
  const topMeals = [...meals]
    .sort((a, b) => (b.orders_count || 0) - (a.orders_count || 0))
    .slice(0, 6)
    .map(m => ({ name: m.meal_name?.substring(0, 15), orders: m.orders_count || 0 }));

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">نظرة عامة</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="إجمالي الطلبات"
          value={totalOrders}
          delay={0}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="الإيرادات (د.أ)"
          value={totalRevenue.toFixed(1)}
          color="bg-emerald-100 text-emerald-600"
          delay={0.1}
        />
        <StatCard
          icon={<UtensilsCrossed className="h-5 w-5" />}
          label="الوجبات"
          value={meals.length}
          color="bg-amber-100 text-amber-600"
          delay={0.2}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="الطباخات"
          value={uniqueCooks}
          color="bg-violet-100 text-violet-600"
          delay={0.3}
        />
      </div>

      {/* Chart */}
      {topMeals.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm mb-8">
          <h2 className="font-bold mb-4">الأكثر طلباً</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topMeals}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(25, 100%, 50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
        <h2 className="font-bold mb-4">آخر الطلبات</h2>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">لا توجد طلبات بعد</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="font-medium text-sm">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{order.items?.map(i => i.meal_name).join(', ')}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-primary">{order.total?.toFixed(2)} د.أ</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'تم التوصيل' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'في الطريق' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'قيد التحضير' ? 'bg-amber-100 text-amber-700' :
                    'bg-muted text-muted-foreground'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}