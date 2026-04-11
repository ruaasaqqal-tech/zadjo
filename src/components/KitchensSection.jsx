import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import KitchenCard from './KitchenCard';
import { Home } from 'lucide-react';

export default function KitchensSection() {
  const { data: kitchens = [], isLoading } = useQuery({
    queryKey: ['kitchens'],
    queryFn: () => base44.entities.Kitchen.list('-created_date', 20),
  });

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏠</span>
          <h2 className="text-xl font-bold">مطابخ البيت</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-shrink-0 w-44 h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!kitchens.length) return null;

  return (
    <section className="py-6">
      <div className="bg-gradient-to-l from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200/50 dark:border-orange-800/30 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🏠</span>
          <h2 className="text-xl font-bold text-foreground">مطابخ البيت</h2>
        </div>
        <p className="text-sm text-muted-foreground">وجبات طازجة من أيدي ربات البيوت</p>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        {kitchens.map((kitchen, i) => (
          <KitchenCard key={kitchen.id} kitchen={kitchen} index={i} />
        ))}
      </div>
    </section>
  );
}