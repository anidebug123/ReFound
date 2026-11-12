import React, { useMemo, useState, useEffect } from 'react';
import { ItemListing } from '../../types';
import { ListingCard } from '../listings/ListingCard';

interface MasonryGridProps {
  items: ItemListing[];
  emptyMessage?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ 
  items, 
  emptyMessage = "No listings found matching your criteria." 
}) => {
  // Dynamic column count based on window width
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 1024) {
        setColumnCount(2);
      } else if (width < 1280) {
        setColumnCount(3);
      } else {
        setColumnCount(4);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute items into columns round-robin / balanced
  const columns = useMemo(() => {
    const cols: ItemListing[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      cols[index % columnCount].push(item);
    });
    return cols;
  }, [items, columnCount]);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-paper-border p-8 max-w-xl mx-auto my-8 shadow-subtle">
        <div className="w-16 h-16 rounded-full bg-paper-card flex items-center justify-center mx-auto mb-4 text-ink-muted text-2xl font-serif">
          ?
        </div>
        <h3 className="font-serif text-xl font-bold text-ink-primary mb-2">
          Nothing here yet
        </h3>
        <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-6">
          {colItems.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

