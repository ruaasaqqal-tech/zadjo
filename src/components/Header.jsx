import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCart, getCartCount } from '@/lib/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [cart, setCart] = useState(getCart());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const count = getCartCount(cart);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍲</span>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">لقمة بيت</h1>
            <p className="text-[10px] text-muted-foreground leading-none">أكل بيتي طازج</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">الرئيسية</Link>
          <Link to="/menu" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">القائمة</Link>
          <Link to="/track-order" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">تتبع طلبك</Link>
        </nav>

        <div className="flex items-center gap-3">
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
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">الرئيسية</Link>
              <Link to="/menu" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">القائمة</Link>
              <Link to="/track-order" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">تتبع طلبك</Link>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 hover:text-primary transition-colors">لوحة التحكم</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}