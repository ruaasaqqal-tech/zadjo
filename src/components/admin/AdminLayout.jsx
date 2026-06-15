import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Package, Tag, ArrowRight, ChefHat, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/admin/meals', label: 'الوجبات', icon: UtensilsCrossed },
  { path: '/admin/orders', label: 'الطلبات', icon: Package },
  { path: '/admin/coupons', label: 'كوبونات', icon: Tag },
  { path: '/admin/kitchens', label: 'المطابخ', icon: ChefHat },
  { path: '/admin/reports', label: 'التقارير', icon: TrendingUp },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Top bar */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🍲</span>
            <h1 className="font-bold text-lg">لوحة التحكم</h1>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            العودة للموقع
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="hidden md:block w-56 border-l border-border bg-card min-h-[calc(100vh-3.5rem)] sticky top-14 p-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-2 py-2">
          <div className="flex justify-around">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}