import MealCard from './MealCard';
import MealCardSkeleton from './MealCardSkeleton';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MealSection({ title, meals, loading, showAll = false }) {
  if (loading) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <MealCardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (!meals?.length) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {!showAll && (
          <Link to="/menu" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            عرض الكل
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {meals.map((meal, i) => (
          <MealCard key={meal.id} meal={meal} index={i} />
        ))}
      </div>
    </section>
  );
}