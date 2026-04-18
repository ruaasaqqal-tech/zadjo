import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartKitchen } from '@/lib/cartStore';
import { calcDistance, calcDeliveryFee } from '@/lib/locationUtils';
import useUserLocation from '@/hooks/useUserLocation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import LocationPicker from '@/components/LocationPicker';

export default function Cart() {
  const { t, lang } = useLang();
  const [cart, setCart] = useState(getCart());
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [form, setForm] = useState({ address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [customerCoords, setCustomerCoords] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { location: userLoc } = useUserLocation();

  const kitchenName = getCartKitchen(cart);
  const { data: kitchens = [] } = useQuery({
    queryKey: ['kitchen-for-cart', kitchenName],
    queryFn: () => kitchenName ? base44.entities.Kitchen.filter({ cook_name: kitchenName }) : Promise.resolve([]),
    enabled: !!kitchenName,
  });
  const kitchen = kitchens[0];

  const deliveryFee = 0.5; // Fixed delivery fee

  // Auto-detect customer GPS on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomerCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {},
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const subtotal = getCartTotal(cart);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const applyCoupon = async () => {
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;
    if (discountInfo && discountInfo.code === trimmed) {
      toast.error(t('couponAlreadyApplied'));
      return;
    }
    const allCoupons = await base44.entities.Coupon.list();
    const coupon = allCoupons.find(
      c => c.code?.trim().toUpperCase() === trimmed && c.active !== false
    );
    if (!coupon) {
      toast.error(t('couponInvalid'));
      setDiscount(0);
      setDiscountInfo(null);
      return;
    }
    if (coupon.min_order && subtotal < coupon.min_order) {
      toast.error(`${t('couponMinOrder')} ${coupon.min_order} د.أ`);
      return;
    }
    const d = coupon.discount_type === 'percentage'
      ? subtotal * (coupon.discount_value / 100)
      : coupon.discount_value;
    setDiscount(d);
    setDiscountInfo(coupon);
    toast.success(`✅ ${t('couponApplied')}: ${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : coupon.discount_value + ' د.أ'}`);
  };

  

  const handleSubmit = async () => {
    if (!form.address && !customerCoords) {
      toast.error(t('addressRequired'));
      return;
    }
    const customerName = user?.full_name || 'عميل';
    const customerPhone = user?.phone || '';

    if (!customerPhone) {
      toast.error(t('phoneRequired'));
      return;
    }

    setSubmitting(true);
     const kitchenName = getCartKitchen(cart);
     const order = await base44.entities.Order.create({
       customer_name: customerName,
       phone: customerPhone,
       address: form.address || 'عنوان غير محدد',
       notes: form.notes,
       kitchen_name: kitchenName || '',
       kitchen_location_url: kitchen?.location_url || '',
       items: cart.map(item => ({
         meal_id: item.meal_id,
         meal_name: item.meal_name,
         cook_name: item.cook_name,
         price: item.price,
         quantity: item.quantity,
         addons_label: item.addons_label || '',
       })),
       subtotal,
       discount,
       delivery_fee: deliveryFee,
       total,
       coupon_code: discountInfo?.code || '',
       status: 'تم الطلب',
     });

    if (discountInfo) {
      await base44.entities.Coupon.update(discountInfo.id, { usage_count: (discountInfo.usage_count || 0) + 1 });
    }

    for (const item of cart) {
      try {
        const meals = await base44.entities.Meal.filter({ id: item.meal_id });
        if (meals[0]) {
          await base44.entities.Meal.update(item.meal_id, { orders_count: (meals[0].orders_count || 0) + item.quantity });
        }
      } catch (e) { /* ignore */ }
    }

    clearCart();
    setSubmitting(false);
    toast.success(t('orderConfirmed'));
    navigate(`/order-confirmation/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('cartEmpty')}</h2>
        <p className="text-muted-foreground mb-6">{t('cartEmptyDesc')}</p>
        <Link to="/menu">
          <Button className="rounded-2xl px-8">{t('browseMenu')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <Link to="/menu" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowRight className="h-4 w-4" />
        {t('continueShopping')}
      </Link>

      <h1 className="text-2xl font-bold mb-6">{t('cartTitle')}</h1>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.meal_id}
              layout
              exit={{ opacity: 0, x: 50 }}
              className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-4"
            >
              <img
                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                alt={item.meal_name}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{item.meal_name}</h3>
                <p className="text-xs text-muted-foreground">{item.cook_name}</p>
                <p className="text-sm font-bold text-primary mt-1">{item.price} د.أ</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.meal_id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.meal_id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.meal_id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Coupon */}
      <div className="bg-card rounded-2xl p-4 border border-border/50 mb-6">
        <Label className="text-sm font-medium mb-2 block">{t('discountCode')}</Label>
        <div className="flex gap-2">
          <Input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder={t('enterCoupon')}
            className="rounded-xl"
          />
          <Button onClick={applyCoupon} variant="outline" className="rounded-xl px-6">{t('apply')}</Button>
        </div>
      </div>

      {/* Order Form */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6 space-y-4">
        <h2 className="font-bold text-lg">{t('deliveryInfo')}</h2>
        {user && (
          <div className="bg-muted/40 rounded-xl px-4 py-3 text-sm">
            <p className="font-medium">{user.full_name}</p>
            {user.phone && <p className="text-muted-foreground">{user.phone}</p>}
          </div>
        )}

        {/* Map-based location picker */}
        <div>
          <Label className="mb-2 block">📍 {t('address')} *</Label>
          <LocationPicker
            coords={customerCoords}
            onCoordsChange={({ lat, lng, address }) => {
              if (lat && lng) setCustomerCoords({ lat, lng });
              setForm(f => ({ ...f, address }));
            }}
          />
          {form.address && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">📌 {form.address}</p>
          )}
        </div>

        <div>
          <Label>{t('notes')}</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-xl mt-1" placeholder={t('notesPlaceholder')} />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t('subtotal')}</span><span>{subtotal.toFixed(2)} د.أ</span></div>
          {discount > 0 && <div className="flex justify-between text-emerald-600"><span>{t('discount')}</span><span>-{discount.toFixed(2)} د.أ</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">{t('delivery')}</span><span className="text-primary font-medium">{deliveryFee.toFixed(2)} د.أ</span></div>
          <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
            <span>{t('total')}</span>
            <span className="text-primary">{total.toFixed(2)} د.أ</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          💰 {t('cashOnDelivery')}
        </p>
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-secondary text-white shadow-lg transition-colors">
        {submitting ? t('sendingOrder') : `${t('confirmOrder')} — ${total.toFixed(2)} د.أ`}
      </Button>
    </div>
  );
}