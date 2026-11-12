import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/common/SearchBar';
import { CategoryBar } from '../components/common/CategoryBar';
import { MasonryGrid } from '../components/masonry/MasonryGrid';
import { ItemCategory } from '../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Search, 
  MapPin, 
  CheckCircle2,
  PlusCircle,
  Eye,
  Sparkles
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { listings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query)}`);
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [listings]);

  // Filter recently found items (active or under_claim)
  const recentlyFound = useMemo(() => {
    return listings
      .filter(item => item.type === 'found' && item.status !== 'removed')
      .filter(item => selectedCategory ? item.category === selectedCategory : true)
      .slice(0, 8);
  }, [listings, selectedCategory]);

  // Recently lost items
  const recentlyLost = useMemo(() => {
    return listings
      .filter(item => item.type === 'lost' && item.status !== 'removed')
      .slice(0, 4);
  }, [listings]);

  // Reunited success stories
  const reunitedItems = useMemo(() => {
    return listings.filter(item => item.status === 'reunited');
  }, [listings]);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-paper-border overflow-hidden bg-gradient-to-b from-[#FAF8F3] via-[#FAF8F3] to-[#F5F2E9]">
        {/* Decorative subtle background accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cobalt-light/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-butter-light/60 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Subtle Campus Community Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-paper-border shadow-subtle mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cobalt animate-ping" />
            <span className="text-xs font-semibold text-ink-primary">
              Northwest University Verified Lost & Found
            </span>
            <span className="text-xs text-ink-muted">•</span>
            <span className="text-xs text-ink-secondary">Over 140+ items reunited</span>
          </div>

          {/* Editorial Hero Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink-primary leading-[1.08] mb-6">
            Lost something? <br />
            <span className="italic font-normal text-cobalt">It might be right here.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ink-secondary mb-10 leading-relaxed font-sans">
            Your campus is full of good people. ReFound helps lost belongings find their way back home through visual discovery and verified ownership.
          </p>

          {/* Large Hero Search Interface */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              large
            />
          </div>

          {/* Hero Reunion Micro-Banner */}
          {reunitedItems.length > 0 && (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 p-2.5 sm:px-4 sm:py-2 rounded-2xl bg-white/80 border border-paper-border backdrop-blur-sm text-xs text-ink-secondary shadow-subtle">
              <div className="flex -space-x-1.5 overflow-hidden">
                {reunitedItems.slice(0, 3).map((item) => (
                  <img
                    key={item.id}
                    src={item.images[0]}
                    alt={item.title}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                  />
                ))}
              </div>
              <span className="font-medium text-ink-primary">
                Latest reunion: <span className="text-cobalt font-semibold">{reunitedItems[0]?.title}</span>
              </span>
              <Link 
                to={`/item/${reunitedItems[0]?.id}`}
                className="text-cobalt hover:underline font-semibold flex items-center gap-0.5"
              >
                Read story <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Quick Dual Action CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/report?type=found"
              className="px-6 py-3 rounded-2xl bg-cobalt hover:bg-cobalt-hover text-white text-sm font-semibold shadow-subtle transition flex items-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4" />
              <span>I Found Something</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              to="/report?type=lost"
              className="px-6 py-3 rounded-2xl bg-white hover:bg-paper-card text-coral border border-coral/30 text-sm font-semibold shadow-subtle transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>I Lost Something</span>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY SHORTCUTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink-primary">
              Filter by Category
            </h2>
            <p className="text-xs text-ink-secondary">
              Narrow down items recently reported around campus buildings
            </p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold text-cobalt hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </section>

      {/* MAIN DISCOVERY SECTION: RECENTLY FOUND AROUND CAMPUS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cobalt px-2.5 py-1 rounded-md bg-cobalt-light inline-block mb-2">
              Visual Discovery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
              Recently found around campus
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Take a look. Your missing item could be here waiting to be claimed.
            </p>
          </div>

          <Link
            to="/browse?type=found"
            className="text-xs sm:text-sm font-semibold text-cobalt hover:text-cobalt-hover hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>Explore all {listings.filter(l => l.type === 'found').length} found items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive Asymmetric Masonry Grid */}
        <MasonryGrid 
          items={recentlyFound} 
          emptyMessage="No items found in this category yet. Be the first to report one!"
        />

        <div className="mt-12 text-center">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-paper-border text-ink-primary hover:bg-paper-card text-sm font-semibold shadow-subtle hover:shadow transition"
          >
            <Search className="w-4 h-4 text-cobalt" />
            <span>Open Complete Visual Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* RECENTLY LOST SECTION (STUDENTS SEEKING ITEMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-paper-border shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-coral px-2.5 py-1 rounded-md bg-coral-light inline-block mb-2">
                Have You Seen These?
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
                Recently reported lost by classmates
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary mt-1">
                Help a fellow student out. If you came across any of these, let them know right away!
              </p>
            </div>

            <Link
              to="/browse?type=lost"
              className="text-xs sm:text-sm font-semibold text-coral hover:underline flex items-center gap-1 flex-shrink-0"
            >
              <span>View all missing items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyLost.map(item => (
              <div 
                key={item.id}
                className="group relative bg-paper-bg rounded-2xl border border-paper-border p-4 transition-all hover:shadow-card hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-coral text-white">
                      Lost
                    </span>
                  </div>

                  <Link to={`/item/${item.id}`}>
                    <h4 className="font-serif text-sm font-bold text-ink-primary line-clamp-1 group-hover:text-coral transition mb-1">
                      {item.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-ink-secondary line-clamp-2 mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-paper-border flex items-center justify-between text-[11px] text-ink-secondary">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-coral" />
                    {item.location}
                  </span>
                  <Link 
                    to={`/item/${item.id}`} 
                    className="font-semibold text-coral hover:underline"
                  >
                    I found it →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENTLY REUNITED STORIES SECTION */}
      {reunitedItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-sage-light border border-sage/60 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-sage/30 blur-2xl" />

            <div className="max-w-2xl mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sage-dark text-white mb-3">
                <Sparkles className="w-3.5 h-3.5 text-butter" />
                <span>Reunited Stories</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
                One less lost item. <br />One more happy reunion.
              </h2>
              <p className="text-sm text-ink-secondary mt-2">
                Real students reuniting through ReFound’s safe verification workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reunitedItems.slice(0, 3).map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-5 border border-sage/40 shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-14 h-14 rounded-xl object-cover border border-paper-border" 
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-sage-dark bg-sage px-2 py-0.5 rounded">
                          Successfully Returned
                        </span>
                        <h4 className="font-serif text-sm font-bold text-ink-primary line-clamp-1 mt-1">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-ink-secondary italic leading-relaxed mb-4 bg-paper-bg p-3 rounded-xl border border-paper-border">
                      "{item.reunitedStory?.note || 'Safely verified and returned through ReFound!'}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-ink-secondary pt-3 border-t border-paper-border">
                    <span className="font-medium text-ink-primary">
                      Reunited by {item.reunitedStory?.reunitedBy}
                    </span>
                    <span className="text-ink-muted">
                      {item.reunitedStory?.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cobalt px-2.5 py-1 rounded-md bg-cobalt-light inline-block mb-3">
            Simple & Trustworthy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
            How ReFound Works
          </h2>
          <p className="text-sm text-ink-secondary mt-2">
            Built from the ground up for university campuses: privacy first, zero spam, and verified claims.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-paper-border shadow-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cobalt-light text-cobalt flex items-center justify-center font-serif text-lg font-bold mb-4">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-ink-primary mb-2">
                Snap & Report
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Found an item in the library or quad? Upload a clean photo and pinpoint the campus building in under 60 seconds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-paper-border text-[11px] text-ink-muted flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cobalt" />
              <span>Sensitive IDs stay masked</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-paper-border shadow-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-butter-light text-butter-dark flex items-center justify-center font-serif text-lg font-bold mb-4">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-ink-primary mb-2">
                Visual Discovery
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Lost an item? Browse high-resolution photography on our asymmetric discovery board or filter by location and category.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-paper-border text-[11px] text-ink-muted flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-butter-dark" />
              <span>Instant keyword search</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-paper-border shadow-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-coral-light text-coral flex items-center justify-center font-serif text-lg font-bold mb-4">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-ink-primary mb-2">
                Prove Ownership
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Click "Claim it" and provide private details not visible in the public photo (e.g. engraving, passcode, hidden charm).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-paper-border text-[11px] text-ink-muted flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
              <span>Finder verifies credibility</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-paper-border shadow-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sage text-sage-dark flex items-center justify-center font-serif text-lg font-bold mb-4">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-ink-primary mb-2">
                Safe Handover
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Coordinate a daylight meetup at an official campus station (Library Desk, Safety Office) and confirm the happy reunion.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-paper-border text-[11px] text-ink-muted flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-sage-dark" />
              <span>Double confirmation safety</span>
            </div>
          </div>

        </div>
      </section>

      {/* COMMUNITY CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ink-primary text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-elevated">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cobalt/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-butter px-3 py-1 rounded-md bg-white/10 inline-block mb-4">
              Campus Integrity Pledge
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-4">
              Be the good person someone was hoping for today.
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed">
              Did you pick up a set of keys, a charger, or a forgotten ID card on your way to class? Report it now. It takes 60 seconds to turn someone’s stressful day around.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/report?type=found"
                className="px-6 py-3.5 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white text-sm font-semibold transition flex items-center gap-2 group"
              >
                <span>Report an Item You Found</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                to="/browse"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
              >
                Explore Campus Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
