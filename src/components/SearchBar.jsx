import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث عن أكلة أو مطبخ..."
        className="pr-10 pl-10 h-12 rounded-2xl bg-card border-border/50 text-sm"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute left-1 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-xl hover:bg-muted active:bg-muted/80 transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}