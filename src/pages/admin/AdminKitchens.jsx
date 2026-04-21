import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, ChefHat, MapPin, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY = { cook_name: '', description: '', image: '', specialty: '', phone: '', location_url: '', latitude: '', longitude: '', password: '', active: true };

function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function AdminKitchens() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { data: kitchens = [], isLoading } = useQuery({
    queryKey: ['kitchens-admin'],
    queryFn: () => base44.entities.Kitchen.list('-created_date', 50),
  });

  const openNew = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (k) => { setForm({ ...k, location_url: k.location_url ?? '' }); setEditing(k.id); setOpen(true); };

  const handleSave = async () => {
    if (!form.cook_name.trim()) { toast.error('اسم المطبخ مطلوب'); return; }
    const data = {
      ...form,
      latitude: form.latitude !== '' ? parseFloat(form.latitude) : null,
      longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
    };
    if (editing) {
      await base44.entities.Kitchen.update(editing, data);
      toast.success('تم التحديث');
    } else {
      await base44.entities.Kitchen.create(data);
      toast.success('تم إضافة المطبخ');
    }
    queryClient.invalidateQueries({ queryKey: ['kitchens-admin'] });
    queryClient.invalidateQueries({ queryKey: ['kitchens'] });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.Kitchen.delete(id);
    toast.success('تم الحذف');
    queryClient.invalidateQueries({ queryKey: ['kitchens-admin'] });
    queryClient.invalidateQueries({ queryKey: ['kitchens'] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة المطابخ</h1>
        <Button className="rounded-xl gap-2" onClick={openNew}>
          <Plus className="h-4 w-4" /> إضافة مطبخ
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
      ) : kitchens.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>لا توجد مطابخ بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kitchens.map(k => (
            <div key={k.id} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-4 items-center shadow-sm">
              {k.image ? (
                <img src={k.image} alt={k.cook_name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍲</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h3 className="font-bold truncate">{k.cook_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${k.active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    {k.active ? 'نشط' : 'مخفي'}
                  </span>
                </div>
                {k.specialty && <p className="text-xs text-orange-600 dark:text-orange-400">{k.specialty}</p>}
                {k.phone && <p className="text-xs text-muted-foreground">📞 {k.phone}</p>}
                 {k.location_url && (
                   <a href={k.location_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                     <MapPin className="h-3 w-3" /> فتح الموقع
                   </a>
                 )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(k)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(k.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'تعديل المطبخ' : 'إضافة مطبخ جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>اسم المطبخ *</Label>
              <Input value={form.cook_name} onChange={e => setForm({ ...form, cook_name: e.target.value })} className="rounded-xl mt-1" placeholder="مثال: أم أحمد" />
            </div>
            <div>
              <Label>التخصص</Label>
              <Input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} className="rounded-xl mt-1" placeholder="مثال: منسف، معجنات..." />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl mt-1" placeholder="نبذة قصيرة..." />
            </div>
            <div>
              <Label>رقم الواتساب</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-xl mt-1" placeholder="962776241441" dir="ltr" />
            </div>
            <div>
              <Label>رابط الصورة</Label>
              <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="rounded-xl mt-1" placeholder="https://..." dir="ltr" />
            </div>
            <div>
              <Label>رابط الموقع على Google Maps</Label>
              <Input
                value={form.location_url}
                onChange={e => setForm({ ...form, location_url: e.target.value })}
                className="rounded-xl mt-1"
                placeholder="https://maps.google.com/?q=Salt,Jordan"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>خط العرض (Latitude) *</Label>
                <Input
                  value={form.latitude}
                  onChange={e => setForm({ ...form, latitude: e.target.value })}
                  className="rounded-xl mt-1"
                  placeholder="32.0354"
                  dir="ltr"
                  type="number"
                  step="any"
                />
              </div>
              <div>
                <Label>خط الطول (Longitude) *</Label>
                <Input
                  value={form.longitude}
                  onChange={e => setForm({ ...form, longitude: e.target.value })}
                  className="rounded-xl mt-1"
                  placeholder="35.7272"
                  dir="ltr"
                  type="number"
                  step="any"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              💡 افتح Google Maps → ابحث عن موقع المطبخ → انقر كليك يمين → انسخ الإحداثيات
            </p>
            <div>
              <Label>كلمة مرور لوحة التحكم</Label>
              <div className="relative mt-1">
                <Input
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="rounded-xl pl-20"
                  placeholder="أدخل كلمة مرور..."
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                />
                <div className="absolute left-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const p = generatePassword();
                      setForm({ ...form, password: p });
                      setShowPassword(true);
                      toast.success(`تم توليد كلمة مرور جديدة: ${p}`);
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                    title="توليد كلمة مرور جديدة"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">اضغط <RefreshCw className="inline h-3 w-3" /> لتوليد كلمة مرور عشوائية جديدة</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
              <Label>نشط (ظاهر للمستخدمين)</Label>
            </div>
            <Button className="w-full rounded-xl" onClick={handleSave}>{editing ? 'حفظ التعديلات' : 'إضافة'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}