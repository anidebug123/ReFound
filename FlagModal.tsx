import React, { useState } from 'react';
import { ItemListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, Send } from 'lucide-react';

interface FlagModalProps {
  listing: ItemListing;
  isOpen: boolean;
  onClose: () => void;
}

export const FlagModal: React.FC<FlagModalProps> = ({ listing, isOpen, onClose }) => {
  const { flagListing } = useApp();
  const [reason, setReason] = useState('Exposed Sensitive Information / ID Number');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    flagListing(listing.id, reason, details.trim() || 'Reported by campus user');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full border border-paper-border shadow-elevated p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ink-muted hover:text-ink-primary hover:bg-paper-card transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-coral mb-2">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Report to Campus Safety</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-ink-primary mb-2">
          Flag Listing
        </h3>
        <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
          Help our campus moderators review listings that violate student safety guidelines or exhibit suspicious behavior.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1">
              Reason for flag
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary bg-white focus:outline-none focus:border-cobalt"
            >
              <option value="Exposed Sensitive Information / ID Number">
                Exposed Sensitive Information / ID Number
              </option>
              <option value="Suspicious or Fraudulent Claim">
                Suspicious or Fraudulent Activity
              </option>
              <option value="Prohibited or Inappropriate Item">
                Prohibited / Inappropriate Item
              </option>
              <option value="Duplicate or Spam Post">
                Duplicate or Spam Post
              </option>
              <option value="Other Safety Concern">
                Other Safety Concern
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context for our campus safety moderators..."
              className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-paper-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-paper-border text-ink-secondary hover:bg-paper-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-coral hover:bg-coral-hover text-white shadow-subtle flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

