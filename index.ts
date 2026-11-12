export type UserRole = 'student' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department?: string;
  studentIdMasked?: string;
}

export type ItemCategory = 
  | 'Electronics'
  | 'ID Cards'
  | 'Accessories'
  | 'Books'
  | 'Bags'
  | 'Clothing'
  | 'Keys'
  | 'Other';

export type ListingType = 'lost' | 'found';

export type ListingStatus = 'active' | 'under_claim' | 'reunited' | 'closed' | 'removed';

export interface ItemListing {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  type: ListingType;
  colour: string;
  brand?: string;
  distinguishingFeatures?: string;
  location: string;
  locationDetails?: string;
  eventDate: string; // YYYY-MM-DD
  eventTime?: string;
  images: string[];
  reportedBy: User;
  createdAt: string; // ISO string
  updatedAt: string;
  status: ListingStatus;
  bookmarksCount: number;
  claimIds: string[];
  isFlagged?: boolean;
  flagReason?: string;
  reunitedStory?: {
    date: string;
    note: string;
    reunitedBy: string;
  };
}

export type ClaimStatus = 'pending' | 'under_review' | 'accepted' | 'rejected' | 'completed';

export interface ClaimMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface HandoverDetails {
  meetingLocation: string;
  suggestedTime?: string;
  finderConfirmed: boolean;
  claimantConfirmed: boolean;
  completedAt?: string;
  reunionNote?: string;
}

export interface Claim {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  claimant: User;
  explanation: string;
  privateIdentifyingDetails: string;
  evidenceImages?: string[];
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  finderResponse?: string;
  messages: ClaimMessage[];
  handoverDetails?: HandoverDetails;
}

export interface ModerationReport {
  id: string;
  listingId: string;
  listingTitle: string;
  reporter: User;
  reason: string;
  details: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
}

