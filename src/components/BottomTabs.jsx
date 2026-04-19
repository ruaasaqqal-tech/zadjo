import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, MapPin } from 'lucide-react';
import { getCart, getCartCount } from '@/lib/cartStore';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';

export default function BottomTabs() {
  const { pathname } = useLocation();
  const { t } = useLang();
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const count = getCartCount(cart);

  const TABS = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/menu', label: t('menu'), icon: UtensilsCrossed },
    { path: '/cart', label: t('cart'), icon: ShoppingCart },
    { path: '/track-order', label: t('trackOrder'), icon: MapPin },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', minHeight: '64px' }}>
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 select-none transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {path === '/cart' && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}