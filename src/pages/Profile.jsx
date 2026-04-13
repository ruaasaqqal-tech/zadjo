import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/AuthContext';
import { Trash2, UserCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingPhone, setSavingPhone] = useState(false);

  const handleSavePhone = async () => {
    if (!phone.trim()) return;
    setSavingPhone(true);
    await base44.auth.updateMe({ phone: phone.trim() });
    setSavingPhone(false);
    toast.success('تم حفظ رقم الهاتف');
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await base44.auth.deleteMe();
      base44.auth.logout('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm mb-6 flex items-center gap-4">
        <UserCircle className="h-14 w-14 text-muted-foreground" />
        <div>
          <p className="font-bold text-lg">{user?.full_name || 'المستخدم'}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Phone number */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm mb-6">
        <h2 className="font-bold mb-1 flex items-center gap-2">
          <Phone className="h-4 w-4" /> رقم الهاتف
        </h2>
        {!user?.phone && (
          <p className="text-xs text-amber-600 mb-3">⚠️ يجب إضافة رقم هاتفك لتتمكن من تأكيد الطلبات</p>
        )}
        <div className="flex gap-2">
          <Input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="07xxxxxxxx"
            dir="ltr"
            className="rounded-xl"
          />
          <Button onClick={handleSavePhone} disabled={savingPhone} className="rounded-xl px-5">
            {savingPhone ? '...' : 'حفظ'}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-destructive/30 shadow-sm">
        <h2 className="font-bold text-destructive mb-1 flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> حذف الحساب
        </h2>
        <p className="text-sm text-muted-foreground mb-4">سيتم حذف حسابك وجميع بياناتك بشكل نهائي.</p>

        {!confirming ? (
          <Button variant="destructive" onClick={() => setConfirming(true)} className="w-full select-none">
            حذف حسابي
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-destructive">هل أنت متأكد؟</p>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDelete} disabled={loading} className="flex-1 select-none">
                {loading ? 'جارٍ الحذف...' : 'نعم، احذف حسابي'}
              </Button>
              <Button variant="outline" onClick={() => setConfirming(false)} className="flex-1 select-none">
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}