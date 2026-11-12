import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/masonry/MasonryGrid';
import { CategoryBar } from '../components/common/CategoryBar';
import { CAMPUS_LOCATIONS } from '../data/seedData';
import { ItemCategory, ListingType, ItemListing } from '../types';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  RotateCcw, 
  MapPin, 
  ChevronDown
} from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const { listings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state initialized from URL params if present
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(
    (searchParams.get('category') as ItemCategory) || null
  );
  const [listingType, setListingType] = useState<ListingType | 'all'>(
    (searchParams.get('type') as ListingType) || 'all'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'under_claim' | 'reunited'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'eventDate'>('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync state if search params change externally
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null && qParam !== query) {
      setQuery(qParam);
    }
    const catParam = searchParams.get('category') as ItemCategory;
    if (catParam && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
    const typeParam = searchParams.get('type') as ListingType;
    if (typeParam && typeParam !== listingType) {
      setListingType(typeParam);
    }
  }, [searchParams]);

  // Update query params when state changes
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '' || v === 'all') {
        current.delete(k);
      } else {
        current.set(k, v);
      }
    });
    setSearchParams(current);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateUrlParams({ q: val });
  };

  const handleCategorySelect = (cat: ItemCategory | null) => {
    setSelectedCategory(cat);
    updateUrlParams({ category: cat });
  };

  const handleTypeSelect = (type: ListingType | 'all') => {
    setListingType(type);
    updateUrlParams({ type: type === 'all' ? null : type });
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory(null);
    setListingType('all');
    setSelectedLocation('All Locations');
    setStatusFilter('all');
    setSortBy('newest');
    setSearchParams({});
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach((item: ItemListing) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [listings]);

  // Filter & Sort logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((item: ItemListing) => {
        // Exclude moderator-removed items
        if (item.status === 'removed') return false;

        // Query search
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q) || false;
          const matchColour = item.colour.toLowerCase().includes(q);
          const matchLocation = item.location.toLowerCase().includes(q) || item.locationDetails?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchBrand && !matchColour && !matchLocation) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory && item.category !== selectedCategory) {
          return false;
        }

        // Type filter (lost vs found)
        if (listingType !== 'all' && item.type !== listingType) {
          return false;
        }

        // Location filter
        if (selectedLocation !== 'All Locations' && item.location !== selectedLocation) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'active' && item.status !== 'active') return false;
          if (statusFilter === 'under_claim' && item.status !== 'under_claim') return false;
          if (statusFilter === 'reunited' && item.status !== 'reunited') return false;
        }

        return true;
      })
      .sort((a: ItemListing, b: ItemListing) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'eventDate') {
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        }
        return 0;
      });
  }, [listings, query, selectedCategory, listingType, selectedLocation, statusFilter, sortBy]);

  const activeFiltersCount = [
    query ? 1 : 0,
    selectedCategory ? 1 : 0,
    listingType !== 'all' ? 1 : 0,
    selectedLocation !== 'All Locations' ? 1 : 0,
    statusFilter !== 'all' ? 1 : 0,
  ].reduce((acc, curr) => acc + curr, 0);

  const visibleListings = filteredListings.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Editorial Header */}
      <div className="border-b border-paper-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-cobalt px-2.5 py-1 rounded-md bg-cobalt-light inline-block mb-2">
          Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink-primary">
          Explore what's been found.
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary mt-1 font-sans">
          Browse items reported by your campus community. Search by keyword, building, or category.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-2xl border border-paper-border p-4 shadow-subtle space-y-4">
        
        {/* Top line: Search input + Lost/Found toggles */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search by keywords (e.g. AirPods, keys, water bottle, blue jacket)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-paper-border bg-paper-bg text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt"
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Lost / Found Type Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-paper-bg border border-paper-border self-start lg:self-auto">
            <button
              onClick={() => handleTypeSelect('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                listingType === 'all'
                  ? 'bg-white text-ink-primary shadow-subtle'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              All Types ({listings.length})
            </button>
            <button
              onClick={() => handleTypeSelect('found')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                listingType === 'found'
                  ? 'bg-cobalt text-white shadow-subtle'
                  : 'text-ink-secondary hover:text-cobalt'
              }`}
            >
              Found ({listings.filter((l: ItemListing) => l.type === 'found').length})
            </button>
            <button
              onClick={() => handleTypeSelect('lost')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                listingType === 'lost'
                  ? 'bg-coral text-white shadow-subtle'
                  : 'text-ink-secondary hover:text-coral'
              }`}
            >
              Lost ({listings.filter((l: ItemListing) => l.type === 'lost').length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort listings"
                className="appearance-none pl-8 pr-8 py-2.5 rounded-xl border border-paper-border bg-paper-bg text-xs font-semibold text-ink-primary cursor-pointer hover:border-gray-400 focus:outline-none focus:border-cobalt"
              >
                <option value="newest">Recently Posted</option>
                <option value="eventDate">Recently Lost/Found</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-ink-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-ink-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Location Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by campus location"
                className="appearance-none pl-8 pr-8 py-2.5 rounded-xl border border-paper-border bg-paper-bg text-xs font-semibold text-ink-primary cursor-pointer hover:border-gray-400 focus:outline-none focus:border-cobalt max-w-[160px] sm:max-w-[200px] truncate"
              >
                {CAMPUS_LOCATIONS.map((loc: string) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-cobalt absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-ink-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Second line: Category Chips */}
        <div className="pt-2 border-t border-paper-border">
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Status Filter tags (All, Active, Under Claim, Reunited) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-paper-border text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink-secondary">Status:</span>
            {(['all', 'active', 'under_claim', 'reunited'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition ${
                  statusFilter === st
                    ? 'bg-ink-primary text-white font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary bg-paper-bg hover:bg-paper-card'
                }`}
              >
                {st === 'all' ? 'All' : st === 'under_claim' ? 'Under Review' : st}
              </button>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-coral hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Chips */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-ink-secondary font-medium">
          Showing <span className="font-bold text-ink-primary">{filteredListings.length}</span> matching listings
        </p>

        {/* Active badges */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-cobalt-light text-cobalt font-medium">
                {selectedCategory}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleCategorySelect(null)} 
                />
              </span>
            )}
            {listingType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-paper-card text-ink-primary font-medium">
                Type: {listingType}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleTypeSelect('all')} 
                />
              </span>
            )}
            {selectedLocation !== 'All Locations' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-paper-card text-ink-primary font-medium">
                {selectedLocation}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedLocation('All Locations')} 
                />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Asymmetric Masonry Grid */}
      <MasonryGrid
        items={visibleListings}
        emptyMessage="No items found matching your filters. Try clearing your search query or choosing another category."
      />

      {/* Load More Button */}
      {visibleListings.length < filteredListings.length && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-8 py-3 rounded-2xl bg-white border border-paper-border text-ink-primary font-semibold text-sm hover:bg-paper-card transition shadow-subtle hover:shadow"
          >
            Load More Listings ({filteredListings.length - visibleListings.length} remaining)
          </button>
        </div>
      )}

    </div>
  );
};
