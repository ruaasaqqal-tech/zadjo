import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Package, DollarSign, ChefHat, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COMMISSION_RATE = 0.10; // 10%

export default function AdminReports() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['reports-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 1000),
  });

  const delivered = orders.filter(o => o.status === 'تم التوصيل');
  const totalRevenue = delivered.reduce((s, o) => s + (o.total || 0), 0);
  const totalCommission = totalRevenue * COMMISSION_RATE;
  const totalKitchenEarnings = totalRevenue - totalCommission;

  // Daily orders for the last 7 days
  const today = new Date();
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('ar-JO', { weekday: 'short', month: 'numeric', day: 'numeric' });
    const dayOrders = delivered.filter(o => {
      const od = new Date(o.created_date);
      return od.toDateString() === d.toDateString();
    });
    return {
      day: label,
      orders: dayOrders.length,
      revenue: parseFloat(dayOrders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)),
    };
  });

  // Per-kitchen breakdown
  const kitchenMap = {};
  delivered.forEach(o => {
    const k = o.kitchen_name || 'غير محدد';
    if (!kitchenMap[k]) kitchenMap[k] = { name: k, orders: 0, revenue: 0 };
    kitchenMap[k].orders++;
    kitchenMap[k].revenue += o.total || 0;
  });
  const kitchenData = Object.values(kitchenMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map(k => ({
      ...k,
      commission: parseFloat((k.revenue * COMMISSION_RATE).toFixed(2)),
      earnings: parseFloat((k.revenue * (1 - COMMISSION_RATE)).toFixed(2)),
      revenue: parseFloat(k.revenue.toFixed(2)),
    }));

  const PIE_COLORS = ['#6A1B9A', '#8E24AA', '#AB47BC', '#CE93D8', '#E1BEE7'];

  if (isLoading) return <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">التقارير اليومية</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-primary flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted-foreground">الطلبات المكتملة</span>
          </div>
          <p className="text-3xl font-black text-primary">{delivered.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted-foreground">إجمالي الإيرادات</span>
          </div>
          <p className="text-3xl font-black text-emerald-600">{totalRevenue.toFixed(2)} <span className="text-base font-normal">د.أ</span></p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted-foreground">عمولة المنصة (10%)</span>
          </div>
          <p className="text-3xl font-black text-amber-600">{totalCommission.toFixed(2)} <span className="text-base font-normal">د.أ</span></p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted-foreground">أرباح المطابخ</span>
          </div>
          <p className="text-3xl font-black text-violet-600">{totalKitchenEarnings.toFixed(2)} <span className="text-base font-normal">د.أ</span></p>
        </div>
      </div>

      {/* Daily chart */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
        <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> المبيعات - آخر 7 أيام</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, name) => [name === 'revenue' ? `${v} د.أ` : v, name === 'revenue' ? 'الإيراد' : 'الطلبات']} />
            <Bar dataKey="revenue" fill="#6A1B9A" radius={[6, 6, 0, 0]} name="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Kitchen breakdown */}
      {kitchenData.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
          <h2 className="font-bold mb-4">تفاصيل المطابخ والعمولات</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-xs">
                    <th className="text-right py-2 font-medium">المطبخ</th>
                    <th className="text-right py-2 font-medium">الطلبات</th>
                    <th className="text-right py-2 font-medium">الإيراد</th>
                    <th className="text-right py-2 font-medium">العمولة (10%)</th>
                    <th className="text-right py-2 font-medium">صافي الأرباح</th>
                  </tr>
                </thead>
                <tbody>
                  {kitchenData.map((k, i) => (
                    <tr key={k.name} className="border-b border-border/30 last:border-0">
                      <td className="py-2.5 font-medium">{k.name}</td>
                      <td className="py-2.5 text-primary font-bold">{k.orders}</td>
                      <td className="py-2.5">{k.revenue} د.أ</td>
                      <td className="py-2.5 text-amber-600">{k.commission} د.أ</td>
                      <td className="py-2.5 text-emerald-600 font-bold">{k.earnings} د.أ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {kitchenData.length >= 2 && (
              <div className="w-full lg:w-64 flex-shrink-0">
                <PieChart width={240} height={200}>
                  <Pie data={kitchenData} cx={120} cy={100} innerRadius={50} outerRadius={90} dataKey="revenue" nameKey="name">
                    {kitchenData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} د.أ`, 'الإيراد']} />
                </PieChart>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}