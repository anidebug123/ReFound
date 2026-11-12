import React, { useState } from 'react';
import { Claim, ItemListing } from '../../types';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Check, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  Clock, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ClaimDetailCardProps {
  claim: Claim;
  listing?: ItemListing;
}

export const ClaimDetailCard: React.FC<ClaimDetailCardProps> = ({ claim, listing }) => {
  const { 
    currentUser, 
    updateClaimStatus, 
    sendClaimMessage, 
    updateHandover,
    confirmHandoverByFinder,
    confirmHandoverByClaimant
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [meetingLocation, setMeetingLocation] = useState(
    claim.handoverDetails?.meetingLocation || 'Central Library Information Desk'
  );
  const [suggestedTime, setSuggestedTime] = useState(
    claim.handoverDetails?.suggestedTime || 'Tomorrow at 11:00 AM'
  );
  const [expanded, setExpanded] = useState(true);

  const isFinder = listing ? listing.reportedBy.id === currentUser.id : false;
  const isClaimant = claim.claimant.id === currentUser.id;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3457D5', '#F5D978', '#F07861', '#DDEBDD'],
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendClaimMessage(claim.id, messageText.trim());
    setMessageText('');
  };

  const handleAcceptClaim = () => {
    updateClaimStatus(
      claim.id, 
      'accepted', 
      'I verified your private ownership details and they match! Let’s meet at the campus hub to return your item.'
    );
  };

  const handleRejectClaim = () => {
    updateClaimStatus(
      claim.id, 
      'rejected', 
      'Unfortunately, the private identifying details provided did not match this item.'
    );
  };

  const handleUpdateHandoverPlan = () => {
    updateHandover(claim.id, {
      meetingLocation,
      suggestedTime,
    });
  };

  const handleFinderConfirm = () => {
    confirmHandoverByFinder(claim.id);
    if (claim.handoverDetails?.claimantConfirmed) {
      triggerConfetti();
    }
  };

  const handleClaimantConfirm = () => {
    confirmHandoverByClaimant(claim.id);
    if (claim.handoverDetails?.finderConfirmed) {
      triggerConfetti();
    }
  };

  const timeAgo = () => {
    try {
      return formatDistanceToNow(parseISO(claim.createdAt), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const statusStyles = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    under_review: 'bg-blue-100 text-blue-800 border-blue-300',
    accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rejected: 'bg-rose-100 text-rose-800 border-rose-300',
    completed: 'bg-sage-dark text-white border-sage',
  };

  return (
    <div className="bg-white rounded-3xl border border-paper-border shadow-subtle overflow-hidden transition">
      
      {/* Top Banner: Item info & Status */}
      <div className="p-5 bg-paper-bg border-b border-paper-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={claim.listingImage}
            alt={claim.listingTitle}
            className="w-12 h-12 rounded-xl object-cover border border-paper-border flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-serif text-base font-bold text-ink-primary truncate">
              {claim.listingTitle}
            </h4>
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <span>Claim #{claim.id}</span>
              <span>•</span>
              <span>{timeAgo()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${statusStyles[claim.status]}`}>
            {claim.status === 'completed' ? 'Reunited 🎉' : claim.status.replace('_', ' ')}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-ink-secondary hover:bg-paper-card transition"
            aria-label="Toggle claim details"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-6">
          
          {/* Claimant and Finder Persona badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Claimant Info */}
            <div className="p-3.5 rounded-2xl bg-paper-card border border-paper-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={claim.claimant.avatar}
                  alt={claim.claimant.name}
                  className="w-8 h-8 rounded-full object-cover border border-paper-border"
                />
                <div>
                  <p className="font-semibold text-ink-primary">Claimant: {claim.claimant.name}</p>
                  <p className="text-[11px] text-ink-secondary">{claim.claimant.department}</p>
                </div>
              </div>
              {isClaimant && (
                <span className="text-[10px] font-bold text-cobalt bg-cobalt-light px-2 py-0.5 rounded">
                  You
                </span>
              )}
            </div>

            {/* Finder / Reporter Info */}
            {listing && (
              <div className="p-3.5 rounded-2xl bg-paper-card border border-paper-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={listing.reportedBy.avatar}
                    alt={listing.reportedBy.name}
                    className="w-8 h-8 rounded-full object-cover border border-paper-border"
                  />
                  <div>
                    <p className="font-semibold text-ink-primary">Finder: {listing.reportedBy.name}</p>
                    <p className="text-[11px] text-ink-secondary">{listing.reportedBy.department}</p>
                  </div>
                </div>
                {isFinder && (
                  <span className="text-[10px] font-bold text-cobalt bg-cobalt-light px-2 py-0.5 rounded">
                    You
                  </span>
                )}
              </div>
            )}

          </div>

          {/* Submitted Ownership Claim Evidence Box */}
          <div className="rounded-2xl border border-paper-border bg-paper-bg p-5 space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
                Where & When Misplaced:
              </span>
              <p className="mt-1 text-sm text-ink-primary bg-white p-3 rounded-xl border border-paper-border">
                {claim.explanation}
              </p>
            </div>

            {/* Secret Verification Detail */}
            <div className="bg-cobalt-light/40 p-4 rounded-xl border border-cobalt/20">
              <div className="flex items-center gap-2 text-cobalt font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Private Ownership Proof (Confidential):</span>
              </div>
              <p className="text-sm font-medium text-ink-primary">
                "{claim.privateIdentifyingDetails}"
              </p>
            </div>

            {/* Supporting evidence image if attached */}
            {claim.evidenceImages && claim.evidenceImages.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary block mb-1.5">
                  Attached Proof of Ownership:
                </span>
                <img
                  src={claim.evidenceImages[0]}
                  alt="Proof"
                  className="w-32 h-32 object-cover rounded-xl border border-paper-border"
                />
              </div>
            )}
          </div>

          {/* FINDER DECISION BUTTONS (If status is pending or under_review and current user is Finder) */}
          {isFinder && (claim.status === 'pending' || claim.status === 'under_review') && (
            <div className="p-4 rounded-2xl bg-butter-light border border-butter/40 space-y-3">
              <div className="flex items-center gap-2 text-butter-dark font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Finder Verification Decision</span>
              </div>
              <p className="text-xs text-ink-secondary">
                Compare the claimant's private proof against the item you hold. Do their details match?
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleAcceptClaim}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-subtle transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Claim (Details Match)</span>
                </button>
                <button
                  onClick={handleRejectClaim}
                  className="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Claim</span>
                </button>
              </div>
            </div>
          )}

          {/* HANDOVER COORDINATION SECTION (When claim is accepted or completed) */}
          {(claim.status === 'accepted' || claim.status === 'completed') && (
            <div className="p-5 rounded-2xl bg-white border-2 border-cobalt/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="font-serif text-base font-bold text-ink-primary">
                    {claim.status === 'completed' ? 'Item Reunited Successfully' : 'Safe Campus Handover'}
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cobalt-light text-cobalt">
                  Official Campus Protocol
                </span>
              </div>

              {/* Handover Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-paper-bg border border-paper-border space-y-1">
                  <span className="text-ink-muted flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cobalt" /> Suggested Meeting Point
                  </span>
                  <input
                    type="text"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    onBlur={handleUpdateHandoverPlan}
                    className="w-full bg-transparent font-semibold text-ink-primary focus:outline-none"
                    placeholder="e.g. Central Library Circulation Desk"
                  />
                </div>

                <div className="p-3 rounded-xl bg-paper-bg border border-paper-border space-y-1">
                  <span className="text-ink-muted flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-cobalt" /> Suggested Time
                  </span>
                  <input
                    type="text"
                    value={suggestedTime}
                    onChange={(e) => setSuggestedTime(e.target.value)}
                    onBlur={handleUpdateHandoverPlan}
                    className="w-full bg-transparent font-semibold text-ink-primary focus:outline-none"
                    placeholder="e.g. Tomorrow at 11:00 AM"
                  />
                </div>
              </div>

              {/* Double Confirmation Buttons */}
              <div className="pt-2 border-t border-paper-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${
                      claim.handoverDetails?.finderConfirmed ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-ink-secondary">
                      Finder Confirmed: <strong>{claim.handoverDetails?.finderConfirmed ? 'Yes' : 'Pending'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${
                      claim.handoverDetails?.claimantConfirmed ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-ink-secondary">
                      Claimant Confirmed: <strong>{claim.handoverDetails?.claimantConfirmed ? 'Yes' : 'Pending'}</strong>
                    </span>
                  </div>
                </div>

                {/* Handover Action button depending on role */}
                {claim.status !== 'completed' && (
                  <div>
                    {isFinder && !claim.handoverDetails?.finderConfirmed && (
                      <button
                        onClick={handleFinderConfirm}
                        className="px-4 py-2 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white text-xs font-semibold shadow-subtle transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Handed Over (Finder)</span>
                      </button>
                    )}

                    {isClaimant && !claim.handoverDetails?.claimantConfirmed && (
                      <button
                        onClick={handleClaimantConfirm}
                        className="px-4 py-2 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white text-xs font-semibold shadow-subtle transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Received (Claimant)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {claim.status === 'completed' && (
                <div className="p-3 rounded-xl bg-sage-light text-sage-dark text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-butter-dark" />
                  <span>Reunion verified and recorded. Congratulations!</span>
                </div>
              )}
            </div>
          )}

          {/* IN-APP DEMO MESSAGING THREAD */}
          <div className="border border-paper-border rounded-2xl overflow-hidden bg-paper-bg">
            <div className="px-4 py-3 bg-white border-b border-paper-border flex items-center justify-between">
              <span className="text-xs font-bold text-ink-primary flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cobalt" />
                Coordination Messages ({claim.messages.length})
              </span>
              <span className="text-[11px] text-ink-muted">Private to Finder & Claimant</span>
            </div>

            {/* Message log */}
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
              {claim.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover border border-paper-border flex-shrink-0"
                    />
                    <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs ${
                      isMe 
                        ? 'bg-cobalt text-white rounded-tr-none' 
                        : 'bg-white text-ink-primary border border-paper-border rounded-tl-none shadow-subtle'
                    }`}>
                      <p className={`text-[10px] font-bold mb-0.5 ${isMe ? 'text-white/80' : 'text-ink-secondary'}`}>
                        {msg.senderName}
                      </p>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send input */}
            <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-paper-border flex items-center gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Send a private message to coordinate handover..."
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-paper-bg border border-paper-border text-ink-primary focus:outline-none focus:border-cobalt"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white transition flex-shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
