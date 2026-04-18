import { useState } from 'react';
import PullToRefresh from '../components/PullToRefresh';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroBanner from '../components/HeroBanner';
import SearchBar from '../components/SearchBar';
import CategoryBar from '../components/CategoryBar';
import MealSection from '../components/MealSection';
import TrustSection from '../components/TrustSection';
import KitchensSection from '../components/KitchensSection';
import { useLang } from '@/lib/i18n';

export default function Home() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: meals = [], isLoading, refetch } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.Meal.list('-orders_count', 50),
  });

  const filtered = meals.filter((m) => {
    if (!m.available) return false;
    const matchSearch = !search || m.meal_name?.includes(search) || m.cook_name?.includes(search);
    const matchCat = category === 'all' || m.category === category;
    return matchSearch && matchCat;
  });

  const todayDeals = filtered.filter(m => m.badge === 'عرض اليوم');
  const popular = [...filtered].sort((a, b) => (b.orders_count || 0) - (a.orders_count || 0)).slice(0, 8);
  const topRated = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);

  return (
    <PullToRefresh onRefresh={refetch}>
    <div>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-2xl p-4 shadow-lg border border-primary/10 space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryBar selected={category} onSelect={setCategory} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {search || category !== 'all' ? (
          <MealSection title={t('searchResults')} meals={filtered} loading={isLoading} showAll />
        ) : (
          <>
            <KitchensSection />
            <MealSection title={t('todayDeals')} meals={todayDeals} loading={isLoading} />
            <MealSection title={t('mostOrdered')} meals={popular} loading={isLoading} />
            <MealSection title={t('topRated')} meals={topRated} loading={isLoading} />
          </>
        )}
      </div>

      <TrustSection />
    </div>
    </PullToRefresh>
  );
}