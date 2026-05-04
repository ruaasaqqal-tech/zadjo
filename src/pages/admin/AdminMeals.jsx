import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileSelect from '@/components/MobileSelect';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['منسف', 'مقلوبة', 'معجنات', 'أكل يومي', 'حلويات', 'مشروبات'];
const BADGES = ['', 'عرض اليوم', 'الأكثر طلباً', 'جديد'];

const emptyMeal = { meal_name: '', cook_name: '', kitchen_id: '', description: '', price: '', image: '', category: 'أكل يومي', rating: 4.5, badge: '', available: true };

export default function AdminMeals() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMeal);

  const { data: kitchens = [] } = useQuery({
    queryKey: ['admin-kitchens-list'],
    queryFn: () => base44.entities.Kitchen.list('-created_date', 100),
  });

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['admin-meals'],
    queryFn: () => base44.entities.Meal.list('-created_date', 100),
  });

  const handleOpen = (meal = null) => {
    if (meal) {
      setEditing(meal);
      setForm({ ...meal, price: String(meal.price), kitchen_id: meal.kitchen_id || '' });
    } else {
      setEditing(null);
      setForm(emptyMeal);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.meal_name || !form.price) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }
    // auto-fill cook_name from kitchen if not set
    let cookName = form.cook_name;
    if (!cookName && form.kitchen_id) {
      const k = kitchens.find(k => k.id === form.kitchen_id);
      if (k) cookName = k.cook_name;
    }
    const data = { ...form, cook_name: cookName, price: Number(form.price), rating: Number(form.rating) || 0 };
    if (editing) {
      await base44.entities.Meal.update(editing.id, data);
      toast.success('تم تحديث الوجبة');
    } else {
      await base44.entities.Meal.create(data);
      toast.success('تم إضافة الوجبة');
    }
    queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوجبة؟')) return;
    await base44.entities.Meal.delete(id);
    queryClient.invalidateQueries({ queryKey: ['admin-meals'] });
    toast.success('تم حذف الوجبة');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, image: file_url }));
    toast.success('تم رفع الصورة');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الوجبات</h1>
        <Button onClick={() => handleOpen()} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          إضافة وجبة
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
      ) : meals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">لا توجد وجبات</p>
          <p className="text-sm">ابدأ بإضافة أول وجبة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map(meal => (
            <div key={meal.id} className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-4">
              <img
                src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                alt={meal.meal_name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm truncate">{meal.meal_name}</h3>
                  {meal.badge && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{meal.badge}</span>}
                  {!meal.available && <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">غير متاح</span>}
                </div>
                <p className="text-xs text-muted-foreground">{meal.cook_name} • {meal.category}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{meal.rating?.toFixed(1)}</span>
              </div>
              <span className="font-bold text-primary">{meal.price} د.أ</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpen(meal)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(meal.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'تعديل الوجبة' : 'إضافة وجبة جديدة'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>اسم الوجبة *</Label>
              <Input value={form.meal_name} onChange={e => setForm({ ...form, meal_name: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>المطبخ *</Label>
              <MobileSelect
                value={form.kitchen_id}
                onValueChange={v => {
                  const k = kitchens.find(k => k.id === v);
                  setForm({ ...form, kitchen_id: v, cook_name: k ? k.cook_name : form.cook_name });
                }}
                placeholder="اختر مطبخاً"
                className="mt-1"
                options={kitchens.map(k => ({ value: k.id, label: k.cook_name }))}
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>السعر (د.أ) *</Label>
                <Input type="number" step="0.1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-xl mt-1" dir="ltr" />
              </div>
              <div>
                <Label>التقييم</Label>
                <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="rounded-xl mt-1" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>التصنيف</Label>
                <MobileSelect
                  value={form.category}
                  onValueChange={v => setForm({ ...form, category: v })}
                  placeholder="التصنيف"
                  className="mt-1"
                  options={CATEGORIES.map(c => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <Label>شارة</Label>
                <MobileSelect
                  value={form.badge}
                  onValueChange={v => setForm({ ...form, badge: v })}
                  placeholder="بدون"
                  className="mt-1"
                  options={BADGES.map(b => ({ value: b, label: b || 'بدون' }))}
                />
              </div>
            </div>
            <div>
              <Label>صورة</Label>
              <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="رابط الصورة" className="rounded-xl mt-1" dir="ltr" />
              <div className="mt-2">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
              </div>
              {form.image && <img src={form.image} className="w-20 h-20 rounded-xl object-cover mt-2" alt="preview" />}
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.available} onCheckedChange={v => setForm({ ...form, available: v })} />
              <Label>متاحة</Label>
            </div>
            <Button onClick={handleSave} className="w-full rounded-xl h-11">
              {editing ? 'حفظ التعديلات' : 'إضافة الوجبة'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}