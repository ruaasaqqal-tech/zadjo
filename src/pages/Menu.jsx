import { useState } from 'react';
import PullToRefresh from '../components/PullToRefresh';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SearchBar from '../components/SearchBar';
import CategoryBar from '../components/CategoryBar';
import MealSection from '../components/MealSection';

export default function Menu() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: meals = [], isLoading, refetch } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.Meal.list('-orders_count', 100),
  });

  const filtered = meals.filter((m) => {
    if (!m.available) return false;
    const matchSearch = !search || m.meal_name?.includes(search) || m.cook_name?.includes(search);
    const matchCat = category === 'all' || m.category === category;
    return matchSearch && matchCat;
  });

  return (
    <PullToRefresh onRefresh={refetch}>
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">القائمة الكاملة</h1>
      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryBar selected={category} onSelect={setCategory} />
      </div>
      <MealSection title={`${filtered.length} وجبة متاحة`} meals={filtered} loading={isLoading} showAll />
    </div>
    </PullToRefresh>
  );
}