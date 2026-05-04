import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, ArrowRight, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCart, getCartCount } from '@/lib/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n';

export default function Header() {
  const { t, lang, switchLang } = useLang();
  const [cart, setCart] = useState(getCart());
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isRoot = location.pathname === '/';
  const isChildScreen = ['/meal/', '/kitchen/', '/track-order-live/', '/order-confirmation/', '/order-success/'].some(p => location.pathname.startsWith(p));

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const count = getCartCount(cart);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {isChildScreen ? (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-11 h-11 -mr-2 text-muted-foreground hover:text-foreground select-none transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : null}
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-xl font-bold text-white">Z</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">Zad JO</h1>
            <p className="text-[10px] text-accent font-bold leading-none">Premium</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('home')}</Link>
          <Link to="/menu" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('menu')}</Link>
          <Link to="/track-order" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{t('trackYourOrder')}</Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => switchLang(lang === 'ar' ? 'en' : 'ar')}
            className="hidden md:flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border border-border hover:bg-muted transition-colors select-none"
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
          <Link to="/profile" className="hidden md:flex">
            <Button variant="ghost" size="icon"><UserCircle className="h-5 w-5" /></Button>
          </Link>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-card"
          >
            <nav className="flex flex-col p-4 gap-3">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">{t('home')}</Link>
              <Link to="/menu" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">{t('menu')}</Link>
              <Link to="/track-order" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">{t('trackYourOrder')}</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">{t('myAccount')}</Link>
              <button
                onClick={() => { switchLang(lang === 'ar' ? 'en' : 'ar'); setMenuOpen(false); }}
                className="text-sm font-bold py-2 text-start hover:text-primary transition-colors select-none"
              >
                {lang === 'ar' ? '🌐 English' : '🌐 العربية'}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}