import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import BottomTabs from './BottomTabs';
import { getRootTab, setTabPath } from '@/lib/tabMemory';

export default function Layout() {
  const location = useLocation();

  // Remember the last path visited per tab root
  useEffect(() => {
    const root = getRootTab(location.pathname);
    if (root) setTabPath(root, location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-cairo">
      <Header />
      <main className="flex-1 overflow-x-hidden" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomTabs />
    </div>
  );
}