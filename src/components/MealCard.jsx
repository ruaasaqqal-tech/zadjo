import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/cartStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const BADGE_STYLES = {
  'عرض اليوم': 'bg-primary text-primary-foreground',
  'الأكثر طلباً': 'bg-amber-500 text-white',
  'جديد': 'bg-emerald-500 text-white',
};

export default function MealCard({ meal, index = 0 }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(meal);
    toast.success(`تمت إضافة ${meal.meal_name} إلى السلة`);
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = `مرحبا، بدي أطلب: ${meal.meal_name}%0Aالسعر: ${meal.price} دينار%0Aالدفع: كاش عند الاستلام%0Aمن تطبيق لقمة بيت`;
    window.open(`https://wa.me/962776241441?text=${msg}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/meal/${meal.id}`} className="block group">
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
              alt={meal.meal_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {meal.badge && BADGE_STYLES[meal.badge] && (
              <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${BADGE_STYLES[meal.badge]}`}>
                {meal.badge}
              </span>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground font-medium">{meal.cook_name}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold">{meal.rating?.toFixed(1) || '—'}</span>
              </div>
            </div>
            <h3 className="font-bold text-foreground mb-1 leading-tight">{meal.meal_name}</h3>
            {meal.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{meal.description}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-primary">{meal.price} <span className="text-xs font-medium">د.أ</span></span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-xl" onClick={handleWhatsApp}>
                  <span className="text-sm">💬</span>
                </Button>
                <Button size="sm" className="h-8 rounded-xl gap-1 px-3" onClick={handleAddToCart}>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span className="text-xs">أضف</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}