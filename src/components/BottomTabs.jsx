import { useNavigate, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, MapPin } from 'lucide-react';
import { getCart, getCartCount } from '@/lib/cartStore';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { getRootTab, getTabPath, TAB_ROOTS } from '@/lib/tabMemory';

export default function BottomTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLang();
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const count = getCartCount(cart);

  const TABS = [
    { root: '/', label: t('home'), icon: Home },
    { root: '/menu', label: t('menu'), icon: UtensilsCrossed },
    { root: '/cart', label: t('cart'), icon: ShoppingCart },
    { root: '/track-order', label: t('trackOrder'), icon: MapPin },
  ];

  const handleTabPress = (root) => {
    const currentRoot = getRootTab(pathname) ?? pathname;
    if (currentRoot === root) {
      // Already on this tab — reset to root
      navigate(root, { replace: true });
    } else {
      // Navigate to the last remembered path for this tab
      navigate(getTabPath(root), { replace: false });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border flex flex-col"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex w-full">
        {TABS.map(({ root, label, icon: Icon }) => {
          const active = pathname === root || (root !== '/' && pathname.startsWith(root));
          return (
            <button
              key={root}
              onClick={() => handleTabPress(root)}
              className={`flex-1 flex flex-col items-center justify-center h-16 gap-0.5 select-none transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {root === '/cart' && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}