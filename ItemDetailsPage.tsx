import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ClaimModal } from '../components/claims/ClaimModal';
import { FlagModal } from '../components/common/FlagModal';
import { ListingCard } from '../components/listings/ListingCard';
import { ItemListing } from '../types';
import { 
  Bookmark, 
  Share2, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    listings, 
    currentUser, 
    toggleBookmark, 
    isBookmarked, 
    claims, 
    showToast 
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [flagModalOpen, setFlagModalOpen] = useState(false);

  const listing = useMemo(() => {
    return listings.find((item: ItemListing) => item.id === id);
  }, [listings, id]);

  // Related items from same category
  const relatedItems = useMemo(() => {
    if (!listing) return [];
    return listings
      .filter((item: ItemListing) => item.id !== listing.id && item.category === listing.category && item.status !== 'removed')
      .slice(0, 3);
  }, [listings, listing]);

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-ink-primary mb-3">
          Listing Not Found
        </h2>
        <p className="text-sm text-ink-secondary mb-6">
          This lost-and-found report might have been removed or reunited.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cobalt text-white text-sm font-semibold shadow-subtle hover:bg-cobalt-hover transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(listing.id);
  const isOwner = listing.reportedBy.id === currentUser.id;
  const isFound = listing.type === 'found';
  const isReunited = listing.status === 'reunited';

  // Check if current user already submitted a claim for this listing
  const myExistingClaim = claims.find(
    c => c.listingId === listing.id && c.claimant.id === currentUser.id
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Listing URL copied to clipboard!', 'success');
  };

  const handleClaimSuccess = (_claimId: string) => {
    setClaimModalOpen(false);
    navigate('/my-activity');
  };

  const timeAgo = () => {
    try {
      return formatDistanceToNow(parseISO(listing.createdAt), { addSuffix: true });
    } catch {
      return listing.eventDate;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-paper-border pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(listing.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              bookmarked
                ? 'bg-coral text-white border-coral'
                : 'bg-white text-ink-secondary border-paper-border hover:bg-paper-card'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-white' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-paper-border text-ink-secondary hover:bg-paper-card transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Flag Button */}
          <button
            onClick={() => setFlagModalOpen(true)}
            className="p-1.5 rounded-xl text-ink-muted hover:text-coral hover:bg-coral-light transition"
            title="Flag inappropriate or sensitive content"
            aria-label="Flag listing"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* REUNITED CELEBRATION HERO BANNER IF REUNITED */}
      {isReunited && (
        <div className="bg-sage rounded-3xl p-6 sm:p-8 border border-sage-dark/30 shadow-subtle flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-sage-dark text-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-8 h-8 text-butter" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-dark bg-white/70 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Officially Reunited
            </span>
            <h2 className="font-serif text-2xl font-bold text-ink-primary">
              This item has been safely returned to its owner!
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              {listing.reunitedStory?.note || 'Verified and handed over in person with campus safety confirmation.'}
            </p>
            {listing.reunitedStory?.reunitedBy && (
              <p className="text-xs font-semibold text-sage-dark mt-2">
                Reunited on {listing.reunitedStory.date} • {listing.reunitedStory.reunitedBy}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TWO-COLUMN EDITORIAL DETAIL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: PHOTOGRAPHY & GALLERY (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Hero Photograph */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-paper-border shadow-card aspect-[4/3] flex items-center justify-center">
            <img
              src={listing.images[activeImageIdx] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                isReunited 
                  ? 'bg-sage-dark' 
                  : isFound 
                  ? 'bg-cobalt' 
                  : 'bg-coral'
              }`}>
                {isReunited ? 'Reunited' : isFound ? 'Found Belonging' : 'Lost Belonging'}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-ink-primary backdrop-blur-sm shadow-sm border border-paper-border">
                {listing.category}
              </span>
            </div>

            {/* Privacy notice badge for ID Cards */}
            {listing.category === 'ID Cards' && (
              <div className="absolute bottom-4 left-4 right-4 p-2.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Student identification numbers and photo have been verified and masked.</span>
              </div>
            )}
          </div>

          {/* Additional Thumbnails Gallery */}
          {listing.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition flex-shrink-0 ${
                    activeImageIdx === idx 
                      ? 'border-cobalt ring-2 ring-cobalt/20 scale-105' 
                      : 'border-paper-border hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Safety & Handover Tips Card */}
          <div className="p-6 rounded-2xl bg-paper-card border border-paper-border space-y-3 text-xs text-ink-secondary">
            <h4 className="font-serif text-sm font-bold text-ink-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cobalt" />
              <span>Campus Verification & Handover Protocol</span>
            </h4>
            <p>
              To protect student property, finders are advised never to release belongings without checking private proof (e.g. device password, matching serial, or specific personal marks).
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-ink-primary font-medium">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-paper-border">
                📍 Meet in Public Daylit Spaces
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-paper-border">
                🚫 Zero Cash Ransoms
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-paper-border">
                🔒 Private Claim Checks
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: EDITORIAL METADATA & ACTIONS (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs text-ink-muted mb-2">
              <span>Reported {timeAgo()}</span>
              <span>•</span>
              <span className="text-ink-secondary">ID: {listing.id}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary leading-tight mb-3">
              {listing.title}
            </h1>

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold bg-paper-card border border-paper-border">
              <span className={`w-2 h-2 rounded-full ${
                listing.status === 'reunited' 
                  ? 'bg-emerald-500' 
                  : listing.status === 'under_claim' 
                  ? 'bg-amber-500' 
                  : 'bg-cobalt'
              }`} />
              <span className="capitalize">
                Status: {listing.status === 'under_claim' ? 'Under Claim Review' : listing.status}
              </span>
            </div>
          </div>

          {/* Core Specifications Table */}
          <div className="bg-white rounded-2xl border border-paper-border divide-y divide-paper-border shadow-subtle">
            
            {/* Campus Location */}
            <div className="p-4 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-cobalt flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-ink-muted block font-medium">Campus Location</span>
                <span className="font-semibold text-ink-primary text-sm">{listing.location}</span>
                {listing.locationDetails && (
                  <p className="text-ink-secondary mt-0.5">{listing.locationDetails}</p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="p-4 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-cobalt flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-ink-muted block font-medium">Date & Time</span>
                <span className="font-semibold text-ink-primary text-sm">
                  {listing.eventDate} {listing.eventTime && `at ${listing.eventTime}`}
                </span>
              </div>
            </div>

            {/* Physical Attributes: Colour & Brand */}
            <div className="p-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-ink-muted block font-medium">Colour</span>
                <span className="font-semibold text-ink-primary">{listing.colour}</span>
              </div>
              <div>
                <span className="text-ink-muted block font-medium">Brand</span>
                <span className="font-semibold text-ink-primary">{listing.brand || 'Unbranded / Unknown'}</span>
              </div>
            </div>

          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-ink-primary">
              Description & Circumstances
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed bg-white p-5 rounded-2xl border border-paper-border shadow-subtle">
              {listing.description}
            </p>
          </div>

          {/* Distinguishing Features Notice */}
          {listing.distinguishingFeatures && (
            <div className="bg-butter-light p-4 rounded-2xl border border-butter/40 text-xs">
              <div className="flex items-center gap-2 font-bold text-butter-dark mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Ownership Verification Clue</span>
              </div>
              <p className="text-ink-primary">
                {isOwner 
                  ? `Your private note: "${listing.distinguishingFeatures}"`
                  : 'The finder has noted private distinguishing features. You will be asked to describe non-public details when submitting a claim.'}
              </p>
            </div>
          )}

          {/* Reporter Profile Box */}
          <div className="bg-white p-4 rounded-2xl border border-paper-border shadow-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={listing.reportedBy.avatar}
                alt={listing.reportedBy.name}
                className="w-12 h-12 rounded-full object-cover border border-paper-border"
              />
              <div>
                <p className="text-xs font-semibold text-ink-primary">
                  {isFound ? 'Found by' : 'Reported by'} {listing.reportedBy.name}
                </p>
                <p className="text-[11px] text-ink-secondary">{listing.reportedBy.department}</p>
                <span className="inline-block mt-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-medium">
                  Verified Student ID Masked
                </span>
              </div>
            </div>

            {isOwner && (
              <span className="text-xs font-bold text-cobalt px-2.5 py-1 rounded-lg bg-cobalt-light">
                Your Listing
              </span>
            )}
          </div>

          {/* PRIMARY CALL TO ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            
            {/* If listing is already reunited */}
            {isReunited ? (
              <div className="w-full py-4 text-center rounded-2xl bg-sage-light border border-sage font-serif font-bold text-sage-dark text-base">
                🎉 Successfully Reunited!
              </div>
            ) : isOwner ? (
              // Current user is the reporter of this item
              <div className="space-y-2">
                <Link
                  to="/my-activity"
                  className="w-full py-3.5 px-6 rounded-2xl bg-ink-primary hover:bg-black text-white text-sm font-semibold shadow-subtle transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-butter" />
                  <span>Review Incoming Claims ({listing.claimIds?.length || 0})</span>
                </Link>
                <p className="text-center text-[11px] text-ink-muted">
                  You created this listing. You can manage or delete it in My Activity.
                </p>
              </div>
            ) : myExistingClaim ? (
              // Current user already claimed it
              <div className="p-4 rounded-2xl bg-cobalt-light/50 border border-cobalt/30 text-center space-y-2">
                <p className="text-xs font-bold text-cobalt flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You submitted a claim for this item</span>
                </p>
                <p className="text-xs text-ink-secondary">
                  Current Status: <strong className="capitalize">{myExistingClaim.status}</strong>
                </p>
                <Link
                  to="/my-activity"
                  className="inline-block text-xs font-semibold text-cobalt hover:underline"
                >
                  Track Claim & View Messages in My Activity →
                </Link>
              </div>
            ) : isFound ? (
              // Found item: User can claim it!
              <button
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-cobalt hover:bg-cobalt-hover text-white text-base font-semibold shadow-card hover:shadow-elevated transition transform active:scale-[0.99] flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-butter group-hover:rotate-12 transition" />
                <span>This is mine — Claim it</span>
              </button>
            ) : (
              // Lost item: User can say they found it!
              <button
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-coral hover:bg-coral-hover text-white text-base font-semibold shadow-card hover:shadow-elevated transition transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I found this item — Contact Student</span>
              </button>
            )}

            <p className="text-center text-[11px] text-ink-muted">
              🔒 ReFound never discloses phone numbers or private addresses publicly.
            </p>
          </div>

        </div>

      </div>

      {/* RELATED CAMPUS LISTINGS */}
      {relatedItems.length > 0 && (
        <div className="pt-12 border-t border-paper-border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-ink-primary">
              More in {listing.category}
            </h3>
            <Link
              to={`/browse?category=${listing.category}`}
              className="text-xs font-semibold text-cobalt hover:underline"
            >
              View all {listing.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map(item => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        listing={listing}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onSuccess={handleClaimSuccess}
      />

      {/* Flag Modal */}
      <FlagModal
        listing={listing}
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
      />

    </div>
  );
};
