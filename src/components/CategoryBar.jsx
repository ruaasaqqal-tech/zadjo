import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: '🍽️' },
  { id: 'منسف', label: 'منسف', icon: '🍖' },
  { id: 'مقلوبة', label: 'مقلوبة', icon: '🍲' },
  { id: 'معجنات', label: 'معجنات', icon: '🥟' },
  { id: 'أكل يومي', label: 'أكل يومي', icon: '🥘' },
  { id: 'حلويات', label: 'حلويات', icon: '🍰' },
  { id: 'مشروبات', label: 'مشروبات', icon: '🥤' },
];

export default function CategoryBar({ selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-1">
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
            selected === cat.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground border border-border hover:border-primary/30'
          }`}
        >
          <span className="text-base">{cat.icon}</span>
          <span>{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}