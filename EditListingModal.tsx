import React, { useState } from 'react';
import { ItemListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Check } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../../data/seedData';

interface EditListingModalProps {
  listing: ItemListing;
  isOpen: boolean;
  onClose: () => void;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({ listing, isOpen, onClose }) => {
  const { updateListing } = useApp();

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [colour, setColour] = useState(listing.colour);
  const [location, setLocation] = useState(listing.location);
  const [locationDetails, setLocationDetails] = useState(listing.locationDetails || '');
  const [status, setStatus] = useState(listing.status);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateListing(listing.id, {
      title,
      description,
      colour,
      location,
      locationDetails,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full border border-paper-border shadow-elevated p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ink-muted hover:text-ink-primary hover:bg-paper-card transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-bold text-ink-primary mb-1">
          Edit Listing
        </h3>
        <p className="text-xs text-ink-secondary mb-4">
          Update your report details or status.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary focus:outline-none focus:border-cobalt"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary focus:outline-none focus:border-cobalt"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">
                Colour
              </label>
              <input
                type="text"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary focus:outline-none focus:border-cobalt"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary bg-white focus:outline-none focus:border-cobalt"
              >
                <option value="active">Active</option>
                <option value="under_claim">Under Review</option>
                <option value="reunited">Reunited</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">
                Campus Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary bg-white focus:outline-none focus:border-cobalt"
              >
                {CAMPUS_LOCATIONS.filter(l => l !== 'All Locations').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1">
                Specific Location Details
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="e.g. 2nd floor desk"
                className="w-full px-3 py-2 rounded-xl border border-paper-border text-xs text-ink-primary focus:outline-none focus:border-cobalt"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-paper-border text-ink-secondary hover:bg-paper-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-cobalt hover:bg-cobalt-hover text-white shadow-subtle flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

