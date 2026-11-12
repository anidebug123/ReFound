import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ItemCategory, ListingType } from '../types';
import { CAMPUS_LOCATIONS, CATEGORIES_LIST } from '../data/seedData';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  ShieldAlert, 
  Sparkles, 
  Eye, 
  MapPin, 
  Calendar, 
  Clock, 
  Image as ImageIcon
} from 'lucide-react';

export const ReportItemPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, addListing } = useApp();

  // Multi-step indicator: 1 = Details, 2 = Location & Time, 3 = Photos, 4 = Review
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const initialType = (searchParams.get('type') as ListingType) || 'found';
  const [type, setType] = useState<ListingType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [colour, setColour] = useState('');
  const [brand, setBrand] = useState('');
  const [distinguishingFeatures, setDistinguishingFeatures] = useState('');

  // Location & Time State
  const [location, setLocation] = useState('Central Library');
  const [locationDetails, setLocationDetails] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const [eventDate, setEventDate] = useState(todayStr);
  const [eventTime, setEventTime] = useState('14:00');

  // Images State
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [acknowledgedPrivacy, setAcknowledgedPrivacy] = useState(false);

  // Success State
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);

  // Sync type from URL if user navigates with query param
  useEffect(() => {
    const urlType = searchParams.get('type') as ListingType;
    if (urlType === 'lost' || urlType === 'found') {
      setType(urlType);
    }
  }, [searchParams]);

  // Sample quick images presets for effortless demo testing
  const SAMPLE_PRESET_IMAGES: Record<string, string[]> = {
    Electronics: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    ],
    'ID Cards': [
      'https://images.unsplash.com/photo-1589330694653-dad6bc01cf0e?w=800&auto=format&fit=crop&q=80',
    ],
    Bags: [
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    ],
    Keys: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    ],
    Accessories: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    ],
    Books: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    ],
    Clothing: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    ],
    Other: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    ],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert file to base64 data url for preview
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImages(prev => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomUrl = () => {
    if (customImageUrl.trim()) {
      setImages(prev => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleApplyPreset = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  // Validation per step
  const canProceedStep1 = title.trim().length >= 3 && description.trim().length >= 5 && colour.trim().length >= 2;
  const canProceedStep2 = location.trim().length > 0 && eventDate.length > 0;
  const canProceedStep3 = images.length > 0;

  const handleSubmitListing = () => {
    const newId = addListing({
      title,
      description,
      category,
      type,
      colour,
      brand: brand.trim() || undefined,
      distinguishingFeatures: distinguishingFeatures.trim() || undefined,
      location,
      locationDetails: locationDetails.trim() || undefined,
      eventDate,
      eventTime: eventTime || undefined,
      images: images.length > 0 ? images : [SAMPLE_PRESET_IMAGES[category]?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'],
      reportedBy: currentUser,
    });
    setCreatedListingId(newId);
  };

  // SUCCESS SCREEN
  if (createdListingId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-subtle animate-bounce-in">
          <Check className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 px-3 py-1 rounded-md bg-emerald-50 inline-block mb-3">
          Listing Published
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary mb-3">
          {type === 'found' ? 'Found Report Live' : 'Lost Report Broadcasted'}
        </h1>

        <p className="text-sm text-ink-secondary mb-8 leading-relaxed">
          Your listing <strong className="text-ink-primary">"{title}"</strong> has been published to Northwest University's discovery network. Students can now view and submit claims.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(`/item/${createdListingId}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white text-sm font-semibold shadow-subtle transition flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Published Listing</span>
          </button>

          <button
            onClick={() => navigate('/browse')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-paper-border text-ink-primary hover:bg-paper-card text-sm font-semibold transition"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-cobalt px-2.5 py-1 rounded-md bg-cobalt-light inline-block mb-2">
          New Report
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
          {type === 'found' ? 'Report a Found Belonging' : 'Report a Lost Belonging'}
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Provide accurate details to help reunite this item with its rightful owner.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-lg mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-paper-border -translate-y-1/2 z-0" />
          
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Photos' },
            { num: 4, label: 'Review' },
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num as any);
                  }}
                  disabled={s.num > step}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-cobalt text-white'
                      : isCurrent
                      ? 'bg-ink-primary text-white ring-4 ring-cobalt-light'
                      : 'bg-white border border-paper-border text-ink-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </button>
                <span className={`text-[11px] font-medium mt-1.5 ${
                  isCurrent ? 'text-ink-primary font-bold' : 'text-ink-muted'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTAINER */}
      <div className="bg-white rounded-3xl border border-paper-border p-6 sm:p-10 shadow-subtle">
        
        {/* STEP 1: ITEM DETAILS */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Type Switcher */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
                What happened? <span className="text-coral">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('found')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    type === 'found'
                      ? 'border-cobalt bg-cobalt-light/40 text-cobalt ring-1 ring-cobalt'
                      : 'border-paper-border bg-paper-bg hover:bg-paper-card text-ink-secondary'
                  }`}
                >
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-ink-primary">I found something</p>
                    <p className="text-xs text-ink-secondary">I picked up an item and want to return it</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('lost')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    type === 'lost'
                      ? 'border-coral bg-coral-light/40 text-coral ring-1 ring-coral'
                      : 'border-paper-border bg-paper-bg hover:bg-paper-card text-ink-secondary'
                  }`}
                >
                  <Eye className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-ink-primary">I lost something</p>
                    <p className="text-xs text-ink-secondary">I misplaced my belongings on campus</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Item Title <span className="text-coral">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AirPods Pro (2nd Gen) in Forest Green Case"
                className="w-full px-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt"
              />
              <p className="text-[11px] text-ink-muted mt-1">Be descriptive and mention defining details.</p>
            </div>

            {/* Category & Colour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  Category <span className="text-coral">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  aria-label="Item Category"
                  className="w-full px-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary bg-white focus:outline-none focus:border-cobalt"
                >
                  {CATEGORIES_LIST.map((cat: ItemCategory) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  Primary Colour(s) <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  placeholder="e.g. Forest Green, Matte Black, Silver"
                  className="w-full px-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Brand / Manufacturer (Optional)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Sony, Fjällräven, Casio"
                className="w-full px-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Public Description <span className="text-coral">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe where it was situated, condition, and any general observations..."
                className="w-full px-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
              />
            </div>

            {/* Distinguishing Features / Verification secret */}
            <div className="bg-paper-bg p-4 rounded-2xl border border-paper-border">
              <label className="block text-xs font-semibold text-ink-primary mb-1">
                Distinguishing Private Detail (Verification Key)
              </label>
              <p className="text-[11px] text-ink-secondary mb-2">
                {type === 'found' 
                  ? 'Is there a private mark, hidden sticker, or engraving you will use to verify the claimant? (Kept confidential for claim checks)'
                  : 'Mention any secret detail you know about your item to prove it is yours.'}
              </p>
              <input
                type="text"
                value={distinguishingFeatures}
                onChange={(e) => setDistinguishingFeatures(e.target.value)}
                placeholder="e.g. Inscription on inside of lid, custom keychain, scratch on bottom"
                className="w-full px-3.5 py-2 rounded-xl border border-paper-border text-sm bg-white text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  canProceedStep1 
                    ? 'bg-cobalt hover:bg-cobalt-hover text-white shadow-subtle' 
                    : 'bg-paper-card text-ink-muted cursor-not-allowed'
                }`}
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION AND TIME */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-paper-border pb-4">
              <h3 className="font-serif text-xl font-bold text-ink-primary">
                {type === 'found' ? 'Where and when did you find it?' : 'Where and when did you last see it?'}
              </h3>
              <p className="text-xs text-ink-secondary mt-1">
                Specify campus area and timing so classmates can match their routine.
              </p>
            </div>

            {/* Campus Area Selection */}
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-2">
                Campus Location / Building <span className="text-coral">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CAMPUS_LOCATIONS.filter((loc: string) => loc !== 'All Locations').map((loc: string) => {
                  const isSelected = location === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between ${
                        isSelected 
                          ? 'border-cobalt bg-cobalt-light text-cobalt font-semibold' 
                          : 'border-paper-border hover:bg-paper-card text-ink-primary'
                      }`}
                    >
                      <span className="truncate">{loc}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Location Details */}
            <div>
              <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                Exact Spot Details (Room, Table, Hallway)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. 3rd Floor Quiet Study carrel 42, near the water fountain"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cobalt"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  Date {type === 'found' ? 'Found' : 'Lost'} <span className="text-coral">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={eventDate}
                    max={todayStr}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary focus:outline-none focus:border-cobalt"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  Approximate Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-paper-border text-sm text-ink-primary focus:outline-none focus:border-cobalt"
                  />
                </div>
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-paper-border">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-paper-border text-ink-secondary text-sm font-semibold hover:bg-paper-card transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="px-6 py-3 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white font-semibold text-sm transition shadow-subtle flex items-center gap-2"
              >
                <span>Continue to Photographs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: UPLOAD PHOTOGRAPHS */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-paper-border pb-4">
              <h3 className="font-serif text-xl font-bold text-ink-primary">
                Item Photographs
              </h3>
              <p className="text-xs text-ink-secondary mt-1">
                A clear, authentic photograph makes visual discovery 10x faster.
              </p>
            </div>

            {/* Important Privacy Rule Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Student Privacy & Sensitive Belongings Policy</p>
                <p className="mt-0.5 text-amber-800">
                  Do not upload photographs showing full student ID numbers, debit cards, phone numbers, or confidential documents. 
                  Please crop or mask sensitive numbers before uploading.
                </p>
              </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-paper-border bg-paper-card">
                    <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-coral transition"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white backdrop-blur-sm">
                        Primary Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-paper-border rounded-2xl p-6 text-center hover:border-cobalt transition bg-paper-bg">
              <Upload className="w-8 h-8 text-cobalt mx-auto mb-2" />
              <p className="text-sm font-semibold text-ink-primary">
                Upload photos from your device
              </p>
              <p className="text-xs text-ink-secondary mt-1 mb-4">
                Supports PNG, JPG, or WEBP up to 10MB
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-paper-border text-xs font-semibold text-ink-primary hover:bg-paper-card cursor-pointer transition shadow-subtle">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Custom URL or Quick Presets for Demo */}
            <div className="bg-paper-card p-4 rounded-2xl border border-paper-border space-y-3">
              <label className="block text-xs font-semibold text-ink-primary">
                Or Paste Image URL / Use Demo Photography:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-paper-border text-xs bg-white text-ink-primary focus:outline-none focus:border-cobalt"
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  className="px-4 py-2 rounded-xl bg-white border border-paper-border text-xs font-semibold hover:bg-paper-bg transition text-ink-primary"
                >
                  Add URL
                </button>
              </div>

              {/* Category Quick Presets */}
              {SAMPLE_PRESET_IMAGES[category] && (
                <div className="pt-2">
                  <p className="text-[11px] text-ink-muted mb-2">
                    Quick demo photos for {category}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PRESET_IMAGES[category].map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplyPreset(url)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-paper-border text-[11px] hover:border-cobalt text-ink-secondary"
                      >
                        <ImageIcon className="w-3 h-3 text-cobalt" />
                        <span>Add Sample Photo #{i + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-ink-secondary cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={acknowledgedPrivacy}
                onChange={(e) => setAcknowledgedPrivacy(e.target.checked)}
                className="mt-0.5 rounded text-cobalt focus:ring-cobalt"
              />
              <span>
                I confirm that this photograph does not expose sensitive personal phone numbers, ID codes, or private addresses.
              </span>
            </label>

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-paper-border">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-paper-border text-ink-secondary text-sm font-semibold hover:bg-paper-card transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!canProceedStep3 || !acknowledgedPrivacy}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition shadow-subtle flex items-center gap-2 ${
                  canProceedStep3 && acknowledgedPrivacy
                    ? 'bg-cobalt hover:bg-cobalt-hover text-white'
                    : 'bg-paper-card text-ink-muted cursor-not-allowed'
                }`}
              >
                <span>Review Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-paper-border pb-4">
              <h3 className="font-serif text-xl font-bold text-ink-primary">
                Review your report before posting
              </h3>
              <p className="text-xs text-ink-secondary mt-1">
                Check all information. You can edit any section before publishing.
              </p>
            </div>

            {/* Listing Preview Card */}
            <div className="rounded-2xl border border-paper-border bg-paper-bg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-5">
                <img
                  src={images[0]}
                  alt="Listing preview"
                  className="w-full sm:w-48 h-44 object-cover rounded-xl border border-paper-border"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white ${
                      type === 'found' ? 'bg-cobalt' : 'bg-coral'
                    }`}>
                      {type === 'found' ? 'Found' : 'Lost'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-white border border-paper-border text-ink-primary">
                      {category}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-ink-primary">
                    {title}
                  </h4>

                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {description}
                  </p>

                  <div className="space-y-1 text-xs text-ink-secondary pt-2">
                    <p>• <strong>Location:</strong> {location} {locationDetails && `(${locationDetails})`}</p>
                    <p>• <strong>Date:</strong> {eventDate} {eventTime && `at ${eventTime}`}</p>
                    <p>• <strong>Colour:</strong> {colour} {brand && `• Brand: ${brand}`}</p>
                    {distinguishingFeatures && (
                      <p className="text-cobalt font-medium">• <strong>Verification Secret:</strong> {distinguishingFeatures}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reporter Persona Confirmation */}
            <div className="p-4 rounded-xl bg-white border border-paper-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-10 h-10 rounded-full object-cover border border-paper-border" 
                />
                <div>
                  <p className="text-xs font-semibold text-ink-primary">
                    Posting as {currentUser.name}
                  </p>
                  <p className="text-[11px] text-ink-secondary">{currentUser.department}</p>
                </div>
              </div>
              <span className="text-[11px] text-ink-muted">
                Student Contact Masked
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-paper-border">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl border border-paper-border text-ink-secondary text-sm font-semibold hover:bg-paper-card transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Photos</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitListing}
                className="px-8 py-3.5 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white font-semibold text-sm transition shadow-card flex items-center gap-2 group"
              >
                <span>Publish Listing Now</span>
                <Check className="w-4 h-4 group-hover:scale-110 transition" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
