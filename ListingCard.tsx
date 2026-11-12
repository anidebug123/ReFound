import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ItemListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ListingCardProps {
  listing: ItemListing;
  showReporter?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, showReporter = true }) => {
  const { toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked(listing.id);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80';

  const timeAgo = () => {
    try {
      return formatDistanceToNow(parseISO(listing.createdAt), { addSuffix: true });
    } catch {
      return listing.eventDate;
    }
  };

  const isReunited = listing.status === 'reunited';
  const isFound = listing.type === 'found';

  return (
    <div className="group relative bg-white rounded-2xl border border-paper-border overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1 flex flex-col">
      {/* Visual Badge overlay */}
      <div className="relative overflow-hidden bg-paper-card">
        {/* Main Photograph */}
        <Link to={`/item/${listing.id}`} className="block overflow-hidden relative">
          <img
            src={imageError ? fallbackImage : (listing.images[0] || fallbackImage)}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            style={{
              maxHeight: '340px',
              minHeight: '200px',
            }}
            loading="lazy"
          />

          {/* Gradient overlay for contrast on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {/* Type Badge */}
          {isReunited ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sage-dark text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-butter" />
              Reunited
            </span>
          ) : isFound ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cobalt text-white shadow-sm">
              Found
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-coral text-white shadow-sm">
              Lost
            </span>
          )}

          {/* Under claim status badge if applicable */}
          {listing.status === 'under_claim' && !isReunited && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-butter text-ink-primary shadow-sm">
              Under Review
            </span>
          )}

          {/* Category Chip */}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/95 text-ink-primary backdrop-blur-sm shadow-sm border border-paper-border">
            {listing.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(listing.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            bookmarked 
              ? 'bg-coral text-white scale-105' 
              : 'bg-white/90 text-ink-secondary hover:text-coral hover:bg-white backdrop-blur-sm'
          }`}
          title={bookmarked ? 'Remove bookmark' : 'Save this listing'}
          aria-label="Save listing"
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
        </button>

        {/* Privacy Notice for sensitive documents */}
        {listing.category === 'ID Cards' && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 text-white backdrop-blur-sm text-[10px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Sensitive ID photo details masked for student privacy</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/item/${listing.id}`} className="group-hover:text-cobalt transition">
            <h3 className="font-serif text-lg font-semibold text-ink-primary leading-snug line-clamp-2 mb-2">
              {listing.title}
            </h3>
          </Link>

          <p className="text-xs text-ink-secondary line-clamp-2 mb-3 leading-relaxed">
            {listing.description}
          </p>

          {/* Location & Date */}
          <div className="space-y-1.5 text-xs text-ink-secondary mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cobalt flex-shrink-0" />
              <span className="font-medium text-ink-primary truncate">{listing.location}</span>
              {listing.locationDetails && (
                <span className="text-ink-muted truncate hidden sm:inline">
                  • {listing.locationDetails}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" />
              <span>{isFound ? 'Found' : 'Lost'} on {listing.eventDate}</span>
              <span className="text-ink-muted">({timeAgo()})</span>
            </div>
          </div>
        </div>

        {/* Bottom footer: Reporter Profile & Action */}
        <div className="pt-3 border-t border-paper-border flex items-center justify-between gap-2 mt-auto">
          {showReporter ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={listing.reportedBy.avatar}
                alt={listing.reportedBy.name}
                className="w-6 h-6 rounded-full object-cover border border-paper-border flex-shrink-0"
              />
              <div className="truncate">
                <span className="text-xs text-ink-secondary font-medium truncate block">
                  {isFound ? 'Found by ' : 'Reported by '}
                  <span className="text-ink-primary font-semibold">{listing.reportedBy.name}</span>
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs font-semibold text-cobalt">View details</span>
          )}

          <Link
            to={`/item/${listing.id}`}
            className="text-xs font-semibold text-cobalt hover:text-cobalt-hover hover:underline transition flex-shrink-0"
          >
            {isReunited ? 'Reunion Story' : isFound ? 'Claim Item →' : 'I Found This →'}
          </Link>
        </div>

        {/* Flagged warning banner if item is flagged */}
        {listing.isFlagged && (
          <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span>Under review by campus safety</span>
          </div>
        )}
      </div>
    </div>
  );
};

