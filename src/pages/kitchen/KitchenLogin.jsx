import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat, Eye, EyeOff, LogIn } from 'lucide-react';

export default function KitchenLogin() {
  const [kitchenName, setKitchenName] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!kitchenName.trim() || !password.trim()) { setError('يرجى إدخال اسم المطبخ وكلمة المرور'); return; }
    setLoading(true);
    const kitchens = await base44.entities.Kitchen.filter({ cook_name: kitchenName.trim(), active: true });
    const kitchen = kitchens.find(k => k.password === password.trim());
    if (!kitchen) {
      setError('اسم المطبخ أو كلمة المرور غير صحيحة');
      setLoading(false);
      return;
    }
    // Store kitchen session in localStorage
    localStorage.setItem('kitchen_session', JSON.stringify({ id: kitchen.id, name: kitchen.cook_name }));
    setLoading(false);
    navigate('/kitchen-portal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border/50 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg mb-4">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-primary">Zad JO</h1>
          <p className="text-sm text-muted-foreground mt-1">لوحة تحكم المطبخ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label className="mb-1 block">اسم المطبخ</Label>
            <Input
              value={kitchenName}
              onChange={e => setKitchenName(e.target.value)}
              placeholder="مثال: أم أحمد"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="mb-1 block">كلمة المرور</Label>
            <div className="relative">
              <Input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                placeholder="كلمة المرور"
                className="rounded-xl pl-10"
                dir="ltr"
              />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl font-bold gap-2">
            <LogIn className="h-4 w-4" />
            {loading ? 'جاري الدخول...' : 'دخول'}
          </Button>
        </form>
      </div>
    </div>
  );
}