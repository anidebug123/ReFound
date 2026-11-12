import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ItemListing, ModerationReport, Claim } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  Search, 
  FileText, 
  ExternalLink
} from 'lucide-react';

export const ModeratorPage: React.FC = () => {
  const { 
    listings, 
    claims, 
    moderationReports, 
    resolveModerationReport, 
    removeListingByModerator
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'all_listings' | 'claims' | 'reunions'>('reports');
  const [searchFilter, setSearchFilter] = useState('');

  // Flagged items & reports
  const pendingReports = useMemo(() => {
    return moderationReports.filter((r: ModerationReport) => r.status === 'pending');
  }, [moderationReports]);

  // Reunited count
  const reunitedCount = useMemo(() => {
    return listings.filter((l: ItemListing) => l.status === 'reunited').length;
  }, [listings]);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((l: ItemListing) => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.category.toLowerCase().includes(q);
    });
  }, [listings, searchFilter]);

  const handleDismissReport = (reportId: string) => {
    resolveModerationReport(reportId, 'dismissed');
  };

  const handleRemoveReportedItem = (reportId: string, listingId: string) => {
    removeListingByModerator(listingId);
    resolveModerationReport(reportId, 'action_taken');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Editorial Header */}
      <div className="bg-white rounded-3xl border border-paper-border p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Safety & Integrity Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
            Moderator Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Review student reports, ensure privacy compliance, and oversee safe handovers across Northwest University.
          </p>
        </div>

        {/* Quick summary stats in restrained editorial chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-paper-bg border border-paper-border text-xs">
            <span className="text-ink-secondary block font-medium">Pending Flags</span>
            <span className="text-base font-bold text-coral">{pendingReports.length}</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-paper-bg border border-paper-border text-xs">
            <span className="text-ink-secondary block font-medium">Total Listings</span>
            <span className="text-base font-bold text-ink-primary">{listings.length}</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-paper-bg border border-paper-border text-xs">
            <span className="text-ink-secondary block font-medium">Successful Reunions</span>
            <span className="text-base font-bold text-emerald-600">{reunitedCount}</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-paper-border overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'reports'
              ? 'bg-ink-primary text-white shadow-subtle'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-coral" />
          <span>Flagged Content</span>
          {pendingReports.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-coral text-white font-bold">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all_listings')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'all_listings'
              ? 'bg-ink-primary text-white shadow-subtle'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4 text-cobalt" />
          <span>All Campus Listings</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-paper-card text-ink-primary">
            {listings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'claims'
              ? 'bg-ink-primary text-white shadow-subtle'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All Claims</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-paper-card text-ink-primary">
            {claims.length}
          </span>
        </button>
      </div>

      {/* TAB 1: FLAGGED CONTENT */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {moderationReports.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-paper-border p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-ink-primary mb-1">
                Zero Pending Safety Flags
              </h3>
              <p className="text-xs text-ink-secondary">
                All reported items have been reviewed by Campus Safety.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moderationReports.map((report: ModerationReport) => {
                const targetListing = listings.find((l: ItemListing) => l.id === report.listingId);
                const isPending = report.status === 'pending';

                return (
                  <div 
                    key={report.id}
                    className="bg-white rounded-2xl border border-paper-border p-5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isPending ? 'bg-coral-light text-coral' : 'bg-paper-card text-ink-secondary'
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-xs font-semibold text-ink-primary">
                          Report #{report.id}
                        </span>
                        <span className="text-xs text-ink-muted">•</span>
                        <span className="text-xs text-coral font-medium">{report.reason}</span>
                      </div>

                      <p className="text-xs text-ink-secondary leading-relaxed bg-paper-bg p-3 rounded-xl border border-paper-border">
                        <strong>Reporter note:</strong> {report.details}
                      </p>

                      {targetListing && (
                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span className="text-ink-muted">Target Item:</span>
                          <Link 
                            to={`/item/${targetListing.id}`}
                            className="font-bold text-cobalt hover:underline flex items-center gap-1"
                          >
                            <span>{targetListing.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <span className="text-ink-muted">({targetListing.location})</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {isPending && (
                      <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleDismissReport(report.id)}
                          className="px-4 py-2 rounded-xl border border-paper-border text-xs font-semibold text-ink-secondary hover:bg-paper-card transition"
                        >
                          Dismiss Flag
                        </button>

                        <button
                          onClick={() => handleRemoveReportedItem(report.id, report.listingId)}
                          className="px-4 py-2 rounded-xl bg-coral hover:bg-coral-hover text-white text-xs font-semibold shadow-subtle transition flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Item</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL CAMPUS LISTINGS */}
      {activeTab === 'all_listings' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search listings by title, category or building..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-paper-border bg-white text-xs text-ink-primary focus:outline-none focus:border-cobalt"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-paper-border overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper-bg text-ink-secondary border-b border-paper-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Item</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Reporter</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-border">
                  {filteredListings.map((item: ItemListing) => (
                    <tr key={item.id} className="hover:bg-paper-bg/50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={item.images[0]} 
                            alt={item.title} 
                            className="w-9 h-9 rounded-lg object-cover border border-paper-border flex-shrink-0" 
                          />
                          <Link to={`/item/${item.id}`} className="font-semibold text-ink-primary hover:text-cobalt line-clamp-1">
                            {item.title}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === 'found' ? 'bg-cobalt-light text-cobalt' : 'bg-coral-light text-coral'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ink-secondary">{item.category}</td>
                      <td className="py-3 px-4 text-ink-secondary">{item.location}</td>
                      <td className="py-3 px-4 text-ink-secondary">{item.reportedBy.name}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-xs font-medium">{item.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.status !== 'removed' ? (
                          <button
                            onClick={() => removeListingByModerator(item.id)}
                            className="text-xs text-coral hover:underline font-semibold"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-[11px] text-ink-muted">Removed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALL CLAIMS */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-paper-border overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper-bg text-ink-secondary border-b border-paper-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Claim ID</th>
                    <th className="py-3 px-4 font-semibold">Listing</th>
                    <th className="py-3 px-4 font-semibold">Claimant</th>
                    <th className="py-3 px-4 font-semibold">Private Proof Note</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Handover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-border">
                  {claims.map((claim: Claim) => (
                    <tr key={claim.id} className="hover:bg-paper-bg/50 transition">
                      <td className="py-3 px-4 font-mono font-medium">{claim.id}</td>
                      <td className="py-3 px-4 font-semibold text-ink-primary">
                        <Link to={`/item/${claim.listingId}`} className="hover:text-cobalt">
                          {claim.listingTitle}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-ink-secondary">{claim.claimant.name}</td>
                      <td className="py-3 px-4 text-ink-secondary max-w-xs truncate">
                        "{claim.privateIdentifyingDetails}"
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-semibold text-xs">{claim.status}</span>
                      </td>
                      <td className="py-3 px-4 text-ink-secondary">
                        {claim.handoverDetails?.meetingLocation || 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
