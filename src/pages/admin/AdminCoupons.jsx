import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileSelect from '@/components/MobileSelect';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { code: '', discount_type: 'percentage', discount_value: '', active: true, min_order: '' };

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => base44.entities.Coupon.list('-created_date', 50),
  });

  const handleOpen = (coupon = null) => {
    if (coupon) {
      setEditing(coupon);
      setForm({ ...coupon, discount_value: String(coupon.discount_value), min_order: String(coupon.min_order || '') });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discount_value) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }
    const data = { ...form, code: form.code.toUpperCase(), discount_value: Number(form.discount_value), min_order: Number(form.min_order) || 0 };
    if (editing) {
      await base44.entities.Coupon.update(editing.id, data);
      toast.success('تم تحديث الكوبون');
    } else {
      await base44.entities.Coupon.create(data);
      toast.success('تم إنشاء الكوبون');
    }
    queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    await base44.entities.Coupon.delete(id);
    queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    toast.success('تم حذف الكوبون');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة الكوبونات</h1>
        <Button onClick={() => handleOpen()} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          إضافة كوبون
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">لا توجد كوبونات</p>
          <p className="text-sm">أنشئ أول كوبون خصم</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map(coupon => (
            <div key={coupon.id} className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold font-mono">{coupon.code}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${coupon.active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    {coupon.active ? 'فعال' : 'معطل'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `${coupon.discount_value} د.أ`}
                  {coupon.min_order > 0 && ` • حد أدنى ${coupon.min_order} د.أ`}
                  {coupon.usage_count > 0 && ` • ${coupon.usage_count} استخدام`}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpen(coupon)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(coupon.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>كود الخصم *</Label>
              <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="rounded-xl mt-1 font-mono" dir="ltr" placeholder="zadjo10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>نوع الخصم</Label>
                <MobileSelect
                  value={form.discount_type}
                  onValueChange={v => setForm({ ...form, discount_type: v })}
                  placeholder="نوع الخصم"
                  className="mt-1"
                  options={[
                    { value: 'percentage', label: 'نسبة مئوية' },
                    { value: 'fixed', label: 'مبلغ ثابت' },
                  ]}
                />
              </div>
              <div>
                <Label>القيمة *</Label>
                <Input type="number" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} className="rounded-xl mt-1" dir="ltr" />
              </div>
            </div>
            <div>
              <Label>الحد الأدنى للطلب (د.أ)</Label>
              <Input type="number" value={form.min_order} onChange={e => setForm({ ...form, min_order: e.target.value })} className="rounded-xl mt-1" dir="ltr" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
              <Label>فعال</Label>
            </div>
            <Button onClick={handleSave} className="w-full rounded-xl h-11">
              {editing ? 'حفظ التعديلات' : 'إنشاء الكوبون'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}