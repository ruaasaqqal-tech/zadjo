import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';

export default function KitchenCard({ kitchen, index = 0 }) {
  const slug = encodeURIComponent(kitchen.cook_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="flex-shrink-0 w-44 md:w-52"
    >
      <Link to={`/kitchen/${slug}`} className="block group">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/60 dark:border-orange-800/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="relative aspect-square overflow-hidden">
            {kitchen.image ? (
              <img
                src={kitchen.image}
                alt={kitchen.cook_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50">
                <span className="text-5xl">🍲</span>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full p-1.5">
              <ChefHat className="h-3.5 w-3.5 text-orange-500" />
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-sm text-foreground leading-tight mb-0.5">{kitchen.cook_name}</h3>
            {kitchen.specialty && (
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">{kitchen.specialty}</p>
            )}
            {kitchen.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{kitchen.description}</p>
            )}
            <div className="flex items-center gap-1 text-primary">
              <span className="text-xs font-medium">تصفح القائمة</span>
              <ArrowLeft className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}