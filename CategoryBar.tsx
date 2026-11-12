import React from 'react';
import { ItemCategory } from '../../types';
import { 
  Laptop, 
  CreditCard, 
  Watch, 
  BookOpen, 
  Briefcase, 
  Shirt, 
  Key, 
  Package, 
  Sparkles
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: ItemCategory | null) => void;
  categoryCounts?: Record<string, number>;
}

export const CATEGORIES_WITH_ICONS: { label: ItemCategory; icon: React.ReactNode; color: string }[] = [
  { label: 'Electronics', icon: <Laptop className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
  { label: 'ID Cards', icon: <CreditCard className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Accessories', icon: <Watch className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50' },
  { label: 'Books', icon: <BookOpen className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
  { label: 'Bags', icon: <Briefcase className="w-4 h-4" />, color: 'text-orange-600 bg-orange-50' },
  { label: 'Clothing', icon: <Shirt className="w-4 h-4" />, color: 'text-pink-600 bg-pink-50' },
  { label: 'Keys', icon: <Key className="w-4 h-4" />, color: 'text-teal-600 bg-teal-50' },
  { label: 'Other', icon: <Package className="w-4 h-4" />, color: 'text-gray-600 bg-gray-50' },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {/* All Categories Pill */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === null
              ? 'bg-ink-primary text-white shadow-subtle'
              : 'bg-white text-ink-secondary hover:text-ink-primary hover:bg-paper-card border border-paper-border'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Items</span>
        </button>

        {CATEGORIES_WITH_ICONS.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          const count = categoryCounts[cat.label];

          return (
            <button
              key={cat.label}
              onClick={() => onSelectCategory(isSelected ? null : cat.label)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-cobalt text-white shadow-subtle font-semibold'
                  : 'bg-white text-ink-primary hover:bg-paper-card border border-paper-border'
              }`}
            >
              <span className={isSelected ? 'text-white' : ''}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
              {typeof count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-paper-bg text-ink-secondary'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

