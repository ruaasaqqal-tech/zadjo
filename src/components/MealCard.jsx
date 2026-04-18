import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/cartStore';
import { buildWhatsAppURL } from '@/lib/locationUtils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useLang, getMealName, getMealDescription } from '@/lib/i18n';

const BADGE_STYLES = {
  'عرض اليوم': 'bg-accent text-accent-foreground font-bold',
  'الأكثر طلباً': 'bg-primary text-primary-foreground font-bold',
  'جديد': 'bg-primary text-primary-foreground font-bold',
};

const BADGE_LABELS_EN = {
  'عرض اليوم': "Today's Deal",
  'الأكثر طلباً': 'Most Ordered',
  'جديد': 'New',
};

export default function MealCard({ meal, index = 0 }) {
  const { lang, t } = useLang();
  const displayName = getMealName(meal, lang);
  const displayDesc = getMealDescription(meal, lang);
  const displayCookName = lang === 'en' && meal.cook_name_en ? meal.cook_name_en : meal.cook_name;
  const badgeLabel = lang === 'en' ? (BADGE_LABELS_EN[meal.badge] || meal.badge) : meal.badge;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(meal);
    toast.success(`${t('addedToCart')}: ${displayName}`);
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(buildWhatsAppURL(meal.phone, meal.meal_name), '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/meal/${meal.id}`} className="block group">
        <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-primary/10">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {meal.badge && BADGE_STYLES[meal.badge] && (
              <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${BADGE_STYLES[meal.badge]}`}>
                {badgeLabel}
              </span>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground font-medium">{displayCookName}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <span className="text-xs font-bold">{meal.rating?.toFixed(1) || '—'}</span>
              </div>
            </div>
            <h3 className="font-bold text-foreground mb-1 leading-tight">{displayName}</h3>
            {displayDesc && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{displayDesc}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-primary">{meal.price} <span className="text-xs font-medium">د.أ</span></span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-xl" onClick={handleWhatsApp}>
                  <span className="text-sm">💬</span>
                </Button>
                <Button size="sm" className="h-8 rounded-xl gap-1 px-3 bg-primary hover:bg-secondary text-white font-medium shadow-sm" onClick={handleAddToCart}>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span className="text-xs">{t('addToCart')}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}