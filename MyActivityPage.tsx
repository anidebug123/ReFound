import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ItemListing, Claim } from '../types';
import { ClaimDetailCard } from '../components/claims/ClaimDetailCard';
import { EditListingModal } from '../components/listings/EditListingModal';
import { ListingCard } from '../components/listings/ListingCard';
import { 
  Bookmark, 
  Eye, 
  Sparkles, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  PlusCircle
} from 'lucide-react';

export const MyActivityPage: React.FC = () => {
  const { 
    currentUser, 
    listings, 
    claims, 
    bookmarks, 
    deleteListing, 
    updateListing,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'claims' | 'saved'>('found');
  const [editingListing, setEditingListing] = useState<ItemListing | null>(null);

  // Filter items reported by current user
  const myLostListings = useMemo(() => {
    return listings.filter(
      (item: ItemListing) => item.reportedBy.id === currentUser.id && item.type === 'lost' && item.status !== 'removed'
    );
  }, [listings, currentUser]);

  const myFoundListings = useMemo(() => {
    return listings.filter(
      (item: ItemListing) => item.reportedBy.id === currentUser.id && item.type === 'found' && item.status !== 'removed'
    );
  }, [listings, currentUser]);

  // Bookmarked items
  const savedListings = useMemo(() => {
    return listings.filter((item: ItemListing) => bookmarks.includes(item.id) && item.status !== 'removed');
  }, [listings, bookmarks]);

  // Claims relevant to current user:
  // 1. Claims submitted by current user (as claimant)
  // 2. Claims submitted for listings reported by current user (as finder)
  const myClaims = useMemo(() => {
    const myListingsIds = listings
      .filter((l: ItemListing) => l.reportedBy.id === currentUser.id)
      .map((l: ItemListing) => l.id);

    return claims.filter(
      (c: Claim) => c.claimant.id === currentUser.id || myListingsIds.includes(c.listingId)
    );
  }, [claims, listings, currentUser]);

  const handleDelete = (listing: ItemListing) => {
    if (window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      deleteListing(listing.id);
    }
  };

  const handleMarkReunitedDirect = (listing: ItemListing) => {
    updateListing(listing.id, {
      status: 'reunited',
      reunitedStory: {
        date: new Date().toISOString().split('T')[0],
        note: `Marked as reunited by ${currentUser.name}.`,
        reunitedBy: currentUser.name,
      }
    });
    showToast('Listing marked as reunited!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl border border-paper-border p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cobalt shadow-subtle"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
                {currentUser.name}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-butter-light text-butter-dark border border-butter/30">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">{currentUser.department}</p>
            <p className="text-[11px] text-ink-muted mt-1">
              Campus ID: {currentUser.studentIdMasked} • {currentUser.email}
            </p>
          </div>
        </div>

        {/* Quick Report actions */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <Link
            to="/report?type=found"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white text-xs font-semibold shadow-subtle transition flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </Link>
          <Link
            to="/report?type=lost"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-coral/40 text-coral hover:bg-coral-light text-xs font-semibold shadow-subtle transition flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </Link>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-paper-border overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('found')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'found'
              ? 'bg-cobalt text-white shadow-subtle'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>My Found Items</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'found' ? 'bg-white/20 text-white' : 'bg-paper-card text-ink-primary'
          }`}>
            {myFoundListings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('lost')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'lost'
              ? 'bg-coral text-white shadow-subtle'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>My Lost Items</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'lost' ? 'bg-white/20 text-white' : 'bg-paper-card text-ink-primary'
          }`}>
            {myLostListings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'claims'
              ? 'bg-ink-primary text-white shadow-subtle'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Claims & Verification</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'claims' ? 'bg-white/20 text-white' : 'bg-paper-card text-ink-primary'
          }`}>
            {myClaims.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-ink-primary text-white shadow-subtle'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Bookmarks</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-paper-card text-ink-primary'
          }`}>
            {savedListings.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT: MY FOUND ITEMS */}
      {activeTab === 'found' && (
        <div className="space-y-4">
          {myFoundListings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-paper-border p-8">
              <Sparkles className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-ink-primary mb-1">
                You haven't reported any found belongings yet
              </h3>
              <p className="text-xs text-ink-secondary mb-6 max-w-sm mx-auto">
                Did you pick up something on campus? Report it to help a classmate get it back.
              </p>
              <Link
                to="/report?type=found"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cobalt text-white text-xs font-semibold shadow-subtle"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report a Found Item</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFoundListings.map((listing: ItemListing) => (
                <div key={listing.id} className="bg-white rounded-2xl border border-paper-border overflow-hidden shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video bg-paper-card overflow-hidden">
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        listing.status === 'reunited' ? 'bg-emerald-600' : 'bg-cobalt'
                      }`}>
                        {listing.status === 'reunited' ? 'Reunited' : 'Active Found Item'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <Link to={`/item/${listing.id}`}>
                        <h4 className="font-serif text-base font-bold text-ink-primary hover:text-cobalt transition line-clamp-1">
                          {listing.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-ink-secondary line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="space-y-1 text-xs text-ink-muted pt-1">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cobalt" />
                          <span>{listing.location}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Found on {listing.eventDate}</span>
                        </p>
                      </div>

                      {listing.claimIds && listing.claimIds.length > 0 && (
                        <div className="mt-2 p-2 rounded-xl bg-cobalt-light text-cobalt text-xs font-semibold flex items-center justify-between">
                          <span>{listing.claimIds.length} Claim(s) Submitted</span>
                          <button
                            onClick={() => setActiveTab('claims')}
                            className="underline text-[11px]"
                          >
                            Review Claims →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 border-t border-paper-border bg-paper-bg/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingListing(listing)}
                      className="px-3 py-1.5 rounded-lg border border-paper-border bg-white text-ink-primary hover:bg-paper-card text-xs font-medium flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {listing.status !== 'reunited' && (
                      <button
                        onClick={() => handleMarkReunitedDirect(listing)}
                        className="px-3 py-1.5 rounded-lg bg-sage text-sage-dark hover:bg-emerald-200 text-xs font-semibold transition"
                      >
                        Mark Reunited
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(listing)}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral-light transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MY LOST ITEMS */}
      {activeTab === 'lost' && (
        <div className="space-y-4">
          {myLostListings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-paper-border p-8">
              <Eye className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-ink-primary mb-1">
                No active lost reports
              </h3>
              <p className="text-xs text-ink-secondary mb-6 max-w-sm mx-auto">
                Misplaced an item on campus? Post a lost report with identifying details.
              </p>
              <Link
                to="/report?type=lost"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-coral text-white text-xs font-semibold shadow-subtle"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report a Lost Item</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myLostListings.map((listing: ItemListing) => (
                <div key={listing.id} className="bg-white rounded-2xl border border-paper-border overflow-hidden shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video bg-paper-card overflow-hidden">
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-coral">
                        Lost Item
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <Link to={`/item/${listing.id}`}>
                        <h4 className="font-serif text-base font-bold text-ink-primary hover:text-coral transition line-clamp-1">
                          {listing.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-ink-secondary line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="space-y-1 text-xs text-ink-muted pt-1">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-coral" />
                          <span>Last seen: {listing.location}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{listing.eventDate}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 border-t border-paper-border bg-paper-bg/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingListing(listing)}
                      className="px-3 py-1.5 rounded-lg border border-paper-border bg-white text-ink-primary hover:bg-paper-card text-xs font-medium flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleMarkReunitedDirect(listing)}
                      className="px-3 py-1.5 rounded-lg bg-sage text-sage-dark hover:bg-emerald-200 text-xs font-semibold transition"
                    >
                      Recovered
                    </button>

                    <button
                      onClick={() => handleDelete(listing)}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral-light transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CLAIMS & VERIFICATION */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink-primary">
                Claims & Ownership Verification
              </h3>
              <p className="text-xs text-ink-secondary">
                Review claims submitted for items you found, or track the progress of items you claimed.
              </p>
            </div>
          </div>

          {myClaims.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-paper-border p-8">
              <Sparkles className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-ink-primary mb-1">
                No active claims found
              </h4>
              <p className="text-xs text-ink-secondary mb-4 max-w-sm mx-auto">
                When a student submits an ownership claim for an item you found, or when you claim a found item, it will appear here.
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cobalt text-white text-xs font-semibold"
              >
                <span>Browse Campus Listings</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {myClaims.map((claim: Claim) => {
                const targetListing = listings.find((l: ItemListing) => l.id === claim.listingId);
                return (
                  <ClaimDetailCard
                    key={claim.id}
                    claim={claim}
                    listing={targetListing}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SAVED BOOKMARKS */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink-primary">
                Saved Items ({savedListings.length})
              </h3>
              <p className="text-xs text-ink-secondary">
                Listings you bookmarked to follow up on.
              </p>
            </div>
          </div>

          {savedListings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-paper-border p-8">
              <Bookmark className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-ink-primary mb-1">
                Your bookmarks list is empty
              </h4>
              <p className="text-xs text-ink-secondary mb-4">
                Click the bookmark ribbon on any listing to save it here for quick access.
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cobalt text-white text-xs font-semibold"
              >
                <span>Explore Listings</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.map((listing: ItemListing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          isOpen={!!editingListing}
          onClose={() => setEditingListing(null)}
        />
      )}

    </div>
  );
};
