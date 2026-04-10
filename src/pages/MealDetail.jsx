import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, ArrowRight, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { addToCart } from '@/lib/cartStore';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MealDetail() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);

  const { data: meal, isLoading } = useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      const meals = await base44.entities.Meal.filter({ id });
      return meals[0];
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">الوجبة غير موجودة</p>
        <Link to="/" className="text-primary mt-4 inline-block">العودة للرئيسية</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(meal);
    toast.success(`تمت إضافة ${qty} × ${meal.meal_name} إلى السلة`);
  };

  const handleWhatsApp = () => {
    const msg = `مرحبا، بدي أطلب: ${meal.meal_name} (${qty} حبة)%0Aالسعر: ${(meal.price * qty).toFixed(2)} دينار%0Aالدفع: كاش عند الاستلام%0Aمن تطبيق لقمة بيت`;
    window.open(`https://wa.me/962776241441?text=${msg}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-6"
    >
      <Link to="/menu" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowRight className="h-4 w-4" />
        العودة للقائمة
      </Link>

      <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50">
        <div className="relative aspect-video">
          <img
            src={meal.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'}
            alt={meal.meal_name}
            className="w-full h-full object-cover"
          />
          {meal.badge && (
            <span className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold">
              {meal.badge}
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">{meal.cook_name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{meal.category}</span>
            <div className="flex items-center gap-1 mr-auto">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold">{meal.rating?.toFixed(1) || '—'}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-3">{meal.meal_name}</h1>
          {meal.description && (
            <p className="text-muted-foreground leading-relaxed mb-6">{meal.description}</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold text-primary">{meal.price} <span className="text-base font-medium">د.أ</span></span>
            {meal.orders_count > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {meal.orders_count} طلب
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">الكمية:</span>
            <div className="flex items-center gap-3 bg-muted rounded-xl px-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-8 text-center">{qty}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(qty + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">المجموع: {(meal.price * qty).toFixed(2)} د.أ</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAddToCart} className="flex-1 h-12 rounded-2xl text-base font-bold gap-2">
              <ShoppingCart className="h-5 w-5" />
              أضف للسلة
            </Button>
            <Button onClick={handleWhatsApp} variant="outline" className="h-12 rounded-2xl px-6 text-base font-bold gap-2">
              💬 اطلب واتساب
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}