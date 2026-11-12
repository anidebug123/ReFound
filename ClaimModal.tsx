import React, { useState } from 'react';
import { ItemListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Send
} from 'lucide-react';

interface ClaimModalProps {
  listing: ItemListing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (claimId: string) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, submitClaim } = useApp();
  const [explanation, setExplanation] = useState('');
  const [privateDetails, setPrivateDetails] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      setError('Please explain why you believe this item belongs to you.');
      return;
    }
    if (!privateDetails.trim()) {
      setError('Please provide at least one private detail not visible in the public photo.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const claimId = submitClaim(
        listing.id,
        explanation.trim(),
        privateDetails.trim(),
        evidenceUrl.trim() ? [evidenceUrl.trim()] : undefined
      );
      setIsSubmitting(false);
      onSuccess(claimId);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to submit claim.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full border border-paper-border shadow-elevated p-6 sm:p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink-primary hover:bg-paper-card transition"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cobalt-light text-cobalt mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ownership Verification</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink-primary">
            Claim this {listing.title}
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            To prevent fraud and protect students, claims require verifiable proof. The finder will review your private details before agreeing to handover.
          </p>
        </div>

        {/* Item mini-summary */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-paper-bg border border-paper-border mb-6">
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className="w-12 h-12 rounded-xl object-cover border border-paper-border" 
          />
          <div className="truncate">
            <p className="font-serif text-sm font-bold text-ink-primary truncate">{listing.title}</p>
            <p className="text-[11px] text-ink-secondary truncate">
              Reported by {listing.reportedBy.name} at {listing.location}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-coral-light border border-coral/30 text-coral text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Question 1: Context / Explanation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1.5">
              1. Where and when did you lose it? <span className="text-coral">*</span>
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="e.g. I was studying on the 3rd floor quiet zone on Friday between 1 PM and 3 PM and accidentally left it on carrel 42."
              className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
              required
            />
          </div>

          {/* Question 2: Private identifying details */}
          <div className="bg-cobalt-light/30 p-4 rounded-2xl border border-cobalt/20">
            <label className="block text-xs font-bold uppercase tracking-wider text-cobalt mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Private detail NOT visible in the public photo <span className="text-coral">*</span></span>
            </label>
            <p className="text-[11px] text-ink-secondary mb-2">
              What proves this is yours? (e.g. Engraving inside the lid, device serial/Bluetooth name, lockscreen wallpaper, exact keychain, hidden sticker).
            </p>
            <textarea
              rows={2}
              value={privateDetails}
              onChange={(e) => setPrivateDetails(e.target.value)}
              placeholder="e.g. Laser engraving inside lid says 'A.C. 2026', and Bluetooth device name is 'Alex's Pods'."
              className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border text-xs bg-white text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
              required
            />
          </div>

          {/* Question 3: Optional evidence photo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1.5">
              3. Supporting Evidence Image URL (Optional)
            </label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="e.g. Photo of original purchase receipt or packaging box"
              className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
            />
          </div>

          {/* Current claimant banner */}
          <div className="flex items-center justify-between text-[11px] text-ink-secondary pt-2">
            <span>Claiming as: <strong>{currentUser.name}</strong></span>
            <span className="text-emerald-700 font-medium">Verified Student</span>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-paper-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-paper-border text-ink-secondary text-xs font-semibold hover:bg-paper-card transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white text-xs font-semibold shadow-subtle transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Claim to Finder'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
