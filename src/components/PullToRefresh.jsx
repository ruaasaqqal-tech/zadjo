import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [progress, setProgress] = useState(0);
  const startY = useRef(null);
  const THRESHOLD = 70;

  const onTouchStart = (e) => {
    if (window.scrollY === 0) startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setProgress(Math.min(delta, THRESHOLD));
      setPulling(true);
    }
  };

  const onTouchEnd = async () => {
    if (progress >= THRESHOLD) {
      await onRefresh();
    }
    setPulling(false);
    setProgress(0);
    startY.current = null;
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {pulling && (
        <div className="flex justify-center py-2">
          <motion.div animate={{ rotate: progress >= THRESHOLD ? 360 : progress * (360 / THRESHOLD) }}>
            <RefreshCw className={`h-5 w-5 ${progress >= THRESHOLD ? 'text-primary' : 'text-muted-foreground'}`} />
          </motion.div>
        </div>
      )}
      {children}
    </div>
  );
}