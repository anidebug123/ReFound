import React, { createContext, useContext, useState, useEffect } from 'react';
import { ItemListing, User, Claim, ModerationReport, ClaimStatus, HandoverDetails } from '../types';
import { DEMO_USERS, INITIAL_LISTINGS, INITIAL_CLAIMS, INITIAL_MODERATION_REPORTS } from '../data/seedData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  listings: ItemListing[];
  claims: Claim[];
  bookmarks: string[];
  moderationReports: ModerationReport[];
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  
  // Listing Operations
  addListing: (listingData: Omit<ItemListing, 'id' | 'createdAt' | 'updatedAt' | 'bookmarksCount' | 'claimIds' | 'status'>) => string;
  updateListing: (id: string, updates: Partial<ItemListing>) => void;
  deleteListing: (id: string) => void;
  toggleBookmark: (listingId: string) => void;
  isBookmarked: (listingId: string) => boolean;

  // Claim Operations
  submitClaim: (listingId: string, explanation: string, privateDetails: string, evidenceImages?: string[]) => string;
  updateClaimStatus: (claimId: string, status: ClaimStatus, finderResponse?: string) => void;
  sendClaimMessage: (claimId: string, text: string) => void;
  updateHandover: (claimId: string, details: Partial<HandoverDetails>) => void;
  confirmHandoverByFinder: (claimId: string) => void;
  confirmHandoverByClaimant: (claimId: string) => void;

  // Moderation Operations
  flagListing: (listingId: string, reason: string, details: string) => void;
  removeListingByModerator: (listingId: string) => void;
  resolveModerationReport: (reportId: string, action: 'action_taken' | 'dismissed') => void;

  // Utility
  resetToDemoData: () => void;
}

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'refound_current_user_id',
  LISTINGS: 'refound_listings_v1',
  CLAIMS: 'refound_claims_v1',
  BOOKMARKS: 'refound_bookmarks_v1',
  REPORTS: 'refound_reports_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    try {
      const savedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = DEMO_USERS.find(u => u.id === savedUserId);
      return found || DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  // Listings state
  const [listings, setListings] = useState<ItemListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load listings from storage', e);
    }
    return INITIAL_LISTINGS;
  });

  // Claims state
  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load claims from storage', e);
    }
    return INITIAL_CLAIMS;
  });

  // Bookmarks state (set of listing IDs bookmarked by the user)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
    return ['item-001', 'item-003', 'item-012'];
  });

  // Moderation reports
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load reports', e);
    }
    return INITIAL_MODERATION_REPORTS;
  });

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.error(e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
    } catch (e) {
      console.error(e);
    }
  }, [claims]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(moderationReports));
    } catch (e) {
      console.error(e);
    }
  }, [moderationReports]);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    showToast(`Switched active view to ${user.name} (${user.role === 'moderator' ? 'Campus Safety Staff' : 'Student'})`, 'info');
  };

  // Add listing
  const addListing = (listingData: Omit<ItemListing, 'id' | 'createdAt' | 'updatedAt' | 'bookmarksCount' | 'claimIds' | 'status'>): string => {
    const newId = `item-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const newListing: ItemListing = {
      ...listingData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      status: 'active',
      bookmarksCount: 0,
      claimIds: [],
    };

    setListings(prev => [newListing, ...prev]);
    showToast(`Your ${newListing.type === 'lost' ? 'lost report' : 'found listing'} was published successfully!`, 'success');
    return newId;
  };

  // Update listing
  const updateListing = (id: string, updates: Partial<ItemListing>) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    }));
    showToast('Listing updated successfully.', 'info');
  };

  // Delete listing
  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
    setBookmarks(prev => prev.filter(bId => bId !== id));
    showToast('Listing removed.', 'info');
  };

  // Toggle bookmark
  const toggleBookmark = (listingId: string) => {
    const isCurrentlyBookmarked = bookmarks.includes(listingId);
    if (isCurrentlyBookmarked) {
      setBookmarks(prev => prev.filter(id => id !== listingId));
      setListings(prev => prev.map(item => item.id === listingId ? { ...item, bookmarksCount: Math.max(0, item.bookmarksCount - 1) } : item));
      showToast('Removed from saved items', 'info');
    } else {
      setBookmarks(prev => [...prev, listingId]);
      setListings(prev => prev.map(item => item.id === listingId ? { ...item, bookmarksCount: item.bookmarksCount + 1 } : item));
      showToast('Saved to your bookmarks!', 'success');
    }
  };

  const isBookmarked = (listingId: string) => bookmarks.includes(listingId);

  // Submit a claim
  const submitClaim = (listingId: string, explanation: string, privateDetails: string, evidenceImages?: string[]): string => {
    const targetListing = listings.find(item => item.id === listingId);
    if (!targetListing) throw new Error('Listing not found');

    const newClaimId = `claim-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newClaim: Claim = {
      id: newClaimId,
      listingId,
      listingTitle: targetListing.title,
      listingImage: targetListing.images[0] || '',
      claimant: currentUser,
      explanation,
      privateIdentifyingDetails: privateDetails,
      evidenceImages: evidenceImages || [],
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: `Claim submitted: "${explanation.slice(0, 120)}..."`,
          timestamp: now,
        }
      ],
      handoverDetails: {
        meetingLocation: 'Campus Safety Office / Student Center Desk',
        finderConfirmed: false,
        claimantConfirmed: false,
      }
    };

    setClaims(prev => [newClaim, ...prev]);

    // Update listing status to under_claim and attach claim id
    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          status: 'under_claim',
          claimIds: [...(item.claimIds || []), newClaimId],
        };
      }
      return item;
    }));

    showToast('Your ownership claim has been submitted to the finder!', 'success');
    return newClaimId;
  };

  // Update claim status
  const updateClaimStatus = (claimId: string, status: ClaimStatus, finderResponse?: string) => {
    const now = new Date().toISOString();
    setClaims(prev => prev.map(claim => {
      if (claim.id === claimId) {
        const updatedMessages = [...claim.messages];
        if (finderResponse) {
          updatedMessages.push({
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            text: finderResponse,
            timestamp: now,
          });
        }
        return {
          ...claim,
          status,
          finderResponse: finderResponse || claim.finderResponse,
          updatedAt: now,
          messages: updatedMessages,
        };
      }
      return claim;
    }));

    // If rejected, check if we should set the listing back to active if no other active claims
    if (status === 'rejected') {
      const claim = claims.find(c => c.id === claimId);
      if (claim) {
        setListings(prev => prev.map(item => {
          if (item.id === claim.listingId) {
            return {
              ...item,
              status: 'active',
            };
          }
          return item;
        }));
      }
      showToast('Claim marked as rejected.', 'info');
    } else if (status === 'accepted') {
      showToast('Claim approved! You can now coordinate handover details.', 'success');
    }
  };

  // Send message in claim thread
  const sendClaimMessage = (claimId: string, text: string) => {
    const now = new Date().toISOString();
    setClaims(prev => prev.map(claim => {
      if (claim.id === claimId) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text,
          timestamp: now,
        };
        return {
          ...claim,
          messages: [...claim.messages, newMessage],
          updatedAt: now,
        };
      }
      return claim;
    }));
  };

  // Update handover
  const updateHandover = (claimId: string, details: Partial<HandoverDetails>) => {
    setClaims(prev => prev.map(claim => {
      if (claim.id === claimId) {
        return {
          ...claim,
          handoverDetails: {
            meetingLocation: 'Campus Safety Main Desk',
            finderConfirmed: false,
            claimantConfirmed: false,
            ...(claim.handoverDetails || {}),
            ...details,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return claim;
    }));
    showToast('Handover details updated.', 'info');
  };

  // Confirm handover by Finder
  const confirmHandoverByFinder = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    const claimantAlreadyConfirmed = claim.handoverDetails?.claimantConfirmed;
    const now = new Date().toISOString();

    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        const nextStatus = claimantAlreadyConfirmed ? 'completed' : c.status;
        return {
          ...c,
          status: nextStatus,
          handoverDetails: {
            meetingLocation: c.handoverDetails?.meetingLocation || 'Campus Safety Office',
            finderConfirmed: true,
            claimantConfirmed: c.handoverDetails?.claimantConfirmed || false,
            completedAt: claimantAlreadyConfirmed ? now : undefined,
          },
          updatedAt: now,
        };
      }
      return c;
    }));

    if (claimantAlreadyConfirmed) {
      finalizeReunion(claim.listingId, claim.claimant.name, currentUser.name);
    } else {
      showToast('Handover confirmed by you. Waiting for claimant confirmation.', 'info');
    }
  };

  // Confirm handover by Claimant
  const confirmHandoverByClaimant = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    const finderAlreadyConfirmed = claim.handoverDetails?.finderConfirmed;
    const now = new Date().toISOString();

    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        const nextStatus = finderAlreadyConfirmed ? 'completed' : c.status;
        return {
          ...c,
          status: nextStatus,
          handoverDetails: {
            meetingLocation: c.handoverDetails?.meetingLocation || 'Campus Safety Office',
            finderConfirmed: c.handoverDetails?.finderConfirmed || false,
            claimantConfirmed: true,
            completedAt: finderAlreadyConfirmed ? now : undefined,
          },
          updatedAt: now,
        };
      }
      return c;
    }));

    if (finderAlreadyConfirmed) {
      const targetListing = listings.find(l => l.id === claim.listingId);
      const finderName = targetListing?.reportedBy.name || 'Finder';
      finalizeReunion(claim.listingId, currentUser.name, finderName);
    } else {
      showToast('Receipt confirmed by you. Waiting for finder confirmation.', 'info');
    }
  };

  const finalizeReunion = (listingId: string, claimantName: string, finderName: string) => {
    const today = new Date().toISOString().split('T')[0];
    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          status: 'reunited',
          reunitedStory: {
            date: today,
            note: `Successfully returned to ${claimantName}! Coordinated safely on campus.`,
            reunitedBy: `${finderName} & ${claimantName}`,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    }));
    showToast('🎉 Item officially reunited! Congratulations!', 'success');
  };

  // Moderation: Flag listing
  const flagListing = (listingId: string, reason: string, details: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    const newReport: ModerationReport = {
      id: `rep-${Date.now().toString(36)}`,
      listingId,
      listingTitle: listing.title,
      reporter: currentUser,
      reason,
      details,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setModerationReports(prev => [newReport, ...prev]);
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, isFlagged: true, flagReason: reason } : l));
    showToast('Listing flagged for moderator review. Thank you for keeping campus safe.', 'info');
  };

  // Moderation: Remove listing
  const removeListingByModerator = (listingId: string) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: 'removed' } : l));
    showToast('Listing marked as removed by moderator.', 'warning');
  };

  // Moderation: Resolve report
  const resolveModerationReport = (reportId: string, action: 'action_taken' | 'dismissed') => {
    setModerationReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
    showToast(`Moderation report marked as ${action}.`, 'info');
  };

  // Reset to initial seed data
  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.LISTINGS);
    localStorage.removeItem(STORAGE_KEYS.CLAIMS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    setListings(INITIAL_LISTINGS);
    setClaims(INITIAL_CLAIMS);
    setBookmarks(['item-001', 'item-003', 'item-012']);
    setModerationReports(INITIAL_MODERATION_REPORTS);
    setCurrentUserState(DEMO_USERS[0]);
    showToast('App reset to fresh demo dataset.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: DEMO_USERS,
        listings,
        claims,
        bookmarks,
        moderationReports,
        toast,
        showToast,
        addListing,
        updateListing,
        deleteListing,
        toggleBookmark,
        isBookmarked,
        submitClaim,
        updateClaimStatus,
        sendClaimMessage,
        updateHandover,
        confirmHandoverByFinder,
        confirmHandoverByClaimant,
        flagListing,
        removeListingByModerator,
        resolveModerationReport,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

