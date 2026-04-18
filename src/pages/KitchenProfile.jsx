import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import { ChefHat, AlertTriangle, MapPin, Truck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCart, addToCartWithKitchenCheck } from '@/lib/cartStore';
import MealDetailModal from '@/components/MealDetailModal';
import { toast } from 'sonner';
import { useState } from 'react';
import useUserLocation from '@/hooks/useUserLocation';
import { calcDistance, calcDeliveryFee, MAX_DELIVERY_KM, buildWhatsAppURL } from '@/lib/locationUtils';

export default function KitchenProfile() {
  const { cookName } = useParams();
  const decodedName = decodeURIComponent(cookName);
  const [conflictMeal, setConflictMeal] = useState(null);
  const [conflictKitchen, setConflictKitchen] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { location: userLoc } = useUserLocation();

  const { data: kitchens = [] } = useQuery({
    queryKey: ['kitchen-profile', decodedName],
    queryFn: () => base44.entities.Kitchen.filter({ cook_name: decodedName }),
  });
  const kitchen = kitchens[0];

  const kitchenId = kitchen?.id;
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['kitchen-meals', decodedName, kitchenId],
    queryFn: async () => {
      if (kitchenId) {
        const byId = await base44.entities.Meal.filter({ kitchen_id: kitchenId, available: true });
        if (byId.length > 0) return byId;
      }
      return base44.entities.Meal.filter({ cook_name: decodedName, available: true });
    },
    enabled: kitchen !== undefined,
  });

  const distance = userLoc && kitchen?.latitude && kitchen?.longitude
    ? calcDistance(userLoc.lat, userLoc.lng, kitchen.latitude, kitchen.longitude)
    : null;
  const outOfRange = distance !== null && distance > MAX_DELIVERY_KM;
  const deliveryFee = calcDeliveryFee(distance);

  const handleConflict = (meal, currentKitchen) => {
    setConflictMeal(meal);
    setConflictKitchen(currentKitchen);
  };

  const handleClearAndAdd = () => {
    clearCart();
    addToCartWithKitchenCheck(conflictMeal, decodedName);
    toast.success(`تمت إضافة ${conflictMeal.meal_name} إلى السلة`);
    setConflictMeal(null);
    setConflictKitchen('');
    setSelectedMeal(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Kitchen Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/20 dark:to-secondary/20 border border-primary/20 dark:border-primary/40 rounded-2xl overflow-hidden mb-4">
        {kitchen?.image && (
          <div className="h-44 overflow-hidden">
            <img src={kitchen.image} alt={decodedName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-primary/10 dark:bg-primary/30 p-2 rounded-full">
              <ChefHat className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{decodedName}</h1>
          </div>
          {kitchen?.specialty && (
            <p className="text-sm font-medium text-primary mb-1">{kitchen.specialty}</p>
          )}
          {kitchen?.description && (
            <p className="text-sm text-muted-foreground mb-3">{kitchen.description}</p>
          )}

          {/* Distance & delivery info */}
          <div className="flex flex-wrap gap-2 mt-2">
            {distance !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                outOfRange ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              }`}>
                <MapPin className="h-3.5 w-3.5" />
                يبعد عنك {distance.toFixed(1)} كم
              </div>
            )}
            {!outOfRange && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-primary/30">
                <Truck className="h-3.5 w-3.5" />
                رسوم التوصيل: {deliveryFee.toFixed(2)} د.أ
              </div>
            )}
          </div>

          {outOfRange && (
            <div className="mt-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400 font-medium">
              ⚠️ هذا المطعم خارج نطاق التوصيل (أكثر من {MAX_DELIVERY_KM} كم)
            </div>
          )}
        </div>
      </div>

      {/* Conflict Dialog */}
      <AnimatePresence>
        {selectedMeal && (
          <MealDetailModal
            meal={selectedMeal}
            kitchenName={decodedName}
            onClose={() => setSelectedMeal(null)}
            onConflict={handleConflict}
          />
        )}
        {conflictMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border"
            >
              <div className="flex items-center gap-2 mb-3 text-primary">
              <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold">تنبيه</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">يمكنك الطلب من مطبخ واحد في كل مرة.</p>
              <p className="text-sm mb-5">
                السلة تحتوي على طلبات من <span className="font-bold text-primary">{conflictKitchen}</span>. هل تريد تفريغ السلة والطلب من <span className="font-bold text-primary">{decodedName}</span>؟
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setConflictMeal(null)}>إلغاء</Button>
                <Button className="flex-1 rounded-xl" onClick={handleClearAndAdd}>تفريغ وإضافة</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meals */}
      <h2 className="text-lg font-bold mb-4">
        {isLoading ? 'جاري التحميل...' : `${meals.length} وجبة متاحة`}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">لا توجد وجبات متاحة حالياً</div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal, i) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-primary/10 overflow-hidden flex items-center gap-4 p-3 shadow-md cursor-pointer hover:border-primary hover:shadow-lg transition-all"
              onClick={() => setSelectedMeal(meal)}
            >
              <img
                src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                alt={meal.meal_name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-0.5">{meal.meal_name}</h3>
                {meal.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{meal.description}</p>
                )}
                {meal.rating > 0 && (
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-xs font-bold">{meal.rating.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-base font-extrabold text-primary">{meal.price} <span className="text-xs font-medium">د.أ</span></span>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl h-8 gap-1 px-3 text-primary border-primary"
                  onClick={(e) => { e.stopPropagation(); window.open(buildWhatsAppURL(kitchen?.phone, meal.meal_name), '_blank'); }}
                >
                  <span className="text-sm">💬</span>
                  <span className="text-xs">واتساب</span>
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl h-8 gap-1 px-3"
                  onClick={(e) => { e.stopPropagation(); setSelectedMeal(meal); }}
                  disabled={outOfRange}
                >
                  <span className="text-xs">أضف</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}