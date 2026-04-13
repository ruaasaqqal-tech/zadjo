import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToCartWithKitchenCheck, clearCart } from '@/lib/cartStore';
import { toast } from 'sonner';

export default function MealDetailModal({ meal, kitchenName, onClose, onConflict }) {
  const addons = [
    meal.addon_1_name ? { name: meal.addon_1_name, price: meal.addon_1_price || 0 } : null,
    meal.addon_2_name ? { name: meal.addon_2_name, price: meal.addon_2_price || 0 } : null,
    meal.addon_3_name ? { name: meal.addon_3_name, price: meal.addon_3_price || 0 } : null,
  ].filter(Boolean);

  const [selected, setSelected] = useState([]);

  const toggleAddon = (idx) => {
    setSelected(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const selectedAddons = selected.map(i => addons[i]);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = (meal.price || 0) + addonsTotal;

  const handleAdd = () => {
    const enrichedMeal = {
      ...meal,
      price: total,
      addons_label: selectedAddons.map(a => a.name).join('، '),
    };
    const result = addToCartWithKitchenCheck(enrichedMeal, kitchenName);
    if (result.conflict) {
      onConflict(enrichedMeal, result.currentKitchen);
    } else {
      toast.success(`تمت إضافة ${meal.meal_name} إلى السلة`);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-card w-full md:max-w-md rounded-t-3xl md:rounded-2xl overflow-hidden border border-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
            alt={meal.meal_name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 left-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>
          {meal.category && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {meal.category}
            </span>
          )}
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* Meal Info */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1">{meal.meal_name}</h2>
            {meal.description && (
              <p className="text-sm text-muted-foreground mb-2">{meal.description}</p>
            )}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-primary">{meal.price} <span className="text-sm font-medium">د.أ</span></span>
              {meal.prep_time && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {meal.prep_time} دقيقة
                </span>
              )}
            </div>
          </div>

          {/* Add-ons */}
          {addons.length > 0 && (
            <div className="mb-5">
              <h3 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">إضافات اختيارية</h3>
              <div className="space-y-2">
                {addons.map((addon, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      selected.includes(idx)
                        ? 'border-primary bg-accent/50'
                        : 'border-border bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(idx)}
                        onChange={() => toggleAddon(idx)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">{addon.name}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">+{addon.price} د.أ</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Total + Add to Cart */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">المجموع</p>
              <p className="text-xl font-extrabold text-primary">{total.toFixed(2)} د.أ</p>
            </div>
            <Button onClick={handleAdd} className="rounded-2xl px-6 gap-2 h-11">
              <ShoppingCart className="h-4 w-4" />
              أضف للسلة
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}