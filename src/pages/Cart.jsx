import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartKitchen } from '@/lib/cartStore';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const [cart, setCart] = useState(getCart());
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const subtotal = getCartTotal(cart);
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const coupons = await base44.entities.Coupon.filter({ code: couponCode.trim().toUpperCase(), active: true });
    if (coupons.length === 0) {
      toast.error('كود الخصم غير صالح');
      setDiscount(0);
      setDiscountInfo(null);
      return;
    }
    const coupon = coupons[0];
    if (coupon.min_order && subtotal < coupon.min_order) {
      toast.error(`الحد الأدنى للطلب ${coupon.min_order} د.أ`);
      return;
    }
    const d = coupon.discount_type === 'percentage'
      ? subtotal * (coupon.discount_value / 100)
      : coupon.discount_value;
    setDiscount(d);
    setDiscountInfo(coupon);
    toast.success(`تم تطبيق الخصم: ${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : coupon.discount_value + ' د.أ'}`);
  };

  const handleSubmit = async () => {
    if (!form.customer_name || !form.phone || !form.address) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }
    setSubmitting(true);
    const kitchenName = getCartKitchen(cart);
    const order = await base44.entities.Order.create({
      customer_name: form.customer_name,
      phone: form.phone,
      address: form.address,
      notes: form.notes,
      kitchen_name: kitchenName || '',
      items: cart.map(item => ({
        meal_id: item.meal_id,
        meal_name: item.meal_name,
        cook_name: item.cook_name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      discount,
      total,
      coupon_code: discountInfo?.code || '',
      status: 'تم الطلب',
    });

    if (discountInfo) {
      await base44.entities.Coupon.update(discountInfo.id, { usage_count: (discountInfo.usage_count || 0) + 1 });
    }

    // Update orders_count for each meal
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
    toast.success('تم إرسال طلبك بنجاح!');
    navigate(`/order-success/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">السلة فارغة</h2>
        <p className="text-muted-foreground mb-6">ابدأ بإضافة وجباتك المفضلة</p>
        <Link to="/menu">
          <Button className="rounded-2xl px-8">تصفح القائمة</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/menu" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowRight className="h-4 w-4" />
        متابعة التسوق
      </Link>

      <h1 className="text-2xl font-bold mb-6">سلة المشتريات</h1>

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
        <Label className="text-sm font-medium mb-2 block">كود خصم</Label>
        <div className="flex gap-2">
          <Input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="أدخل كود الخصم"
            className="rounded-xl"
          />
          <Button onClick={applyCoupon} variant="outline" className="rounded-xl px-6">تطبيق</Button>
        </div>
      </div>

      {/* Order Form */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6 space-y-4">
        <h2 className="font-bold text-lg">بيانات التوصيل</h2>
        <div>
          <Label>الاسم *</Label>
          <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="rounded-xl mt-1" placeholder="اسمك الكامل" />
        </div>
        <div>
          <Label>رقم الهاتف *</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl mt-1" placeholder="07xxxxxxxx" dir="ltr" />
        </div>
        <div>
          <Label>العنوان *</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl mt-1" placeholder="العنوان بالتفصيل" />
        </div>
        <div>
          <Label>ملاحظات</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-xl mt-1" placeholder="أي ملاحظات إضافية..." />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span>{subtotal.toFixed(2)} د.أ</span></div>
          {discount > 0 && <div className="flex justify-between text-emerald-600"><span>الخصم</span><span>-{discount.toFixed(2)} د.أ</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">التوصيل</span><span className="text-emerald-600">مجاني</span></div>
          <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
            <span>المجموع</span>
            <span className="text-primary">{total.toFixed(2)} د.أ</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          💰 الدفع نقداً عند الاستلام
        </p>
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full h-14 rounded-2xl text-lg font-bold">
        {submitting ? 'جاري إرسال الطلب...' : `تأكيد الطلب — ${total.toFixed(2)} د.أ`}
      </Button>
    </div>
  );
}