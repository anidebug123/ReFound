import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: (val: string) => void;
  placeholder?: string;
  large?: boolean;
}

export const QUICK_SEARCH_TAGS = ['AirPods', 'Student ID', 'Car Keys', 'Backpack', 'Charger', 'Glasses'];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search for wallets, ID cards, headphones...",
  large = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full transition-all duration-300 rounded-2xl bg-white border ${
          isFocused 
            ? 'border-cobalt shadow-card ring-2 ring-cobalt/20' 
            : 'border-paper-border shadow-subtle hover:border-gray-300'
        } ${large ? 'p-2 sm:p-2.5' : 'p-1.5'}`}
      >
        <div className={`pl-3 pr-2 text-ink-muted flex items-center pointer-events-none ${large ? 'text-cobalt' : ''}`}>
          <Search className={large ? 'w-5 h-5 text-cobalt' : 'w-4 h-4'} />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-ink-primary placeholder-ink-muted focus:outline-none ${
            large ? 'text-base sm:text-lg font-medium' : 'text-sm'
          }`}
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 text-ink-muted hover:text-ink-primary transition rounded-full hover:bg-paper-card mr-1"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className={`flex items-center gap-1.5 font-semibold text-white bg-cobalt hover:bg-cobalt-hover transition rounded-xl ${
            large ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'
          } shadow-subtle flex-shrink-0`}
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick Search Tag Suggestions (shown on large hero search) */}
      {large && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-secondary">
          <span className="flex items-center gap-1 font-medium text-ink-primary">
            <Sparkles className="w-3.5 h-3.5 text-butter-dark" />
            Popular:
          </span>
          {QUICK_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                onChange(tag);
                if (onSubmit) onSubmit(tag);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-paper-border text-ink-secondary hover:text-cobalt hover:border-cobalt/40 transition text-xs"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

