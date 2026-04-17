import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

const CATEGORIES = [
  { id: 'all', labelKey: 'catAll', icon: '🍽️' },
  { id: 'منسف', labelKey: 'catMansaf', icon: '🍖' },
  { id: 'مقلوبة', labelKey: 'catMaqluba', icon: '🍲' },
  { id: 'معجنات', labelKey: 'catPastries', icon: '🥟' },
  { id: 'أكل يومي', labelKey: 'catDailyFood', icon: '🥘' },
  { id: 'حلويات', labelKey: 'catSweets', icon: '🍰' },
  { id: 'مشروبات', labelKey: 'catDrinks', icon: '🥤' },
];

export default function CategoryBar({ selected, onSelect }) {
  const { t } = useLang();

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-1">
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 select-none ${
            selected === cat.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground border border-border hover:border-primary/30'
          }`}
        >
          <span className="text-base">{cat.icon}</span>
          <span>{t(cat.labelKey)}</span>
        </motion.button>
      ))}
    </div>
  );
}