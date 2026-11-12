import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  PlusCircle, 
  Bookmark, 
  ShieldAlert, 
  Menu, 
  X, 
  RotateCcw, 
  Check, 
  User as UserIcon,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser, availableUsers, bookmarks, claims, resetToDemoData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const activeClaimsCount = claims.filter(
    c => c.status === 'pending' || c.status === 'under_review' || c.status === 'accepted'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/90 backdrop-blur-md border-b border-paper-border transition-all">
      {/* Top micro-bar: Demo context banner & Campus Switcher */}
      <div className="bg-[#242424] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-medium">
            Demo Campus Network: <strong className="text-white">Northwest University</strong>
          </span>
          <span className="hidden sm:inline text-gray-500">|</span>
          <span className="hidden sm:inline text-gray-400">
            Current Persona: <span className="text-butter font-semibold">{currentUser.name}</span> ({currentUser.role === 'moderator' ? 'Campus Safety Staff' : 'Student'})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Persona selector quick dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-200 transition text-[11px]"
              title="Switch demo persona to test different permissions and claim views"
            >
              <UserIcon className="w-3 h-3 text-butter" />
              <span>Switch User</span>
              <span className="text-[9px] text-gray-400">▼</span>
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-elevated border border-paper-border p-2 z-50 text-[#242424]"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="text-[11px] font-semibold text-ink-secondary px-2.5 py-1 uppercase tracking-wider">
                  Select Demo Persona
                </div>
                {availableUsers.map(user => {
                  const isCurrent = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition ${
                        isCurrent ? 'bg-cobalt-light text-cobalt font-medium' : 'hover:bg-paper-bg'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-gray-200" 
                        />
                        <div className="truncate">
                          <p className="font-semibold leading-tight">{user.name}</p>
                          <p className="text-[10px] text-ink-secondary truncate">{user.department}</p>
                        </div>
                      </div>
                      {isCurrent ? (
                        <Check className="w-4 h-4 text-cobalt flex-shrink-0" />
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-ink-secondary flex-shrink-0">
                          {user.role}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="border-t border-paper-border mt-2 pt-2">
                  <button
                    onClick={() => {
                      resetToDemoData();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-left text-xs text-coral hover:bg-coral-light transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Dataset</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={resetToDemoData}
            className="text-gray-400 hover:text-white transition flex items-center gap-1 text-[11px]"
            title="Reset localStorage data to default seed"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main horizontal navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-cobalt text-white flex items-center justify-center shadow-subtle group-hover:scale-105 transition transform">
              <span className="font-serif text-xl font-bold italic">R</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-ink-primary">
                  ReFound
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-butter-light text-butter-dark border border-butter/30">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-ink-secondary font-medium tracking-wide hidden sm:block -mt-1">
                Lost things. Found people.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/browse"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/browse')
                  ? 'bg-cobalt text-white shadow-subtle'
                  : 'text-ink-primary hover:bg-white hover:shadow-subtle'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Browse Items</span>
            </Link>

            <Link
              to="/#how-it-works"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-ink-secondary hover:text-ink-primary hover:bg-white transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How It Works</span>
            </Link>

            <Link
              to="/my-activity"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 relative ${
                isActive('/my-activity')
                  ? 'bg-cobalt text-white shadow-subtle'
                  : 'text-ink-primary hover:bg-white hover:shadow-subtle'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>My Activity</span>
              {activeClaimsCount > 0 ? (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive('/my-activity') ? 'bg-white text-cobalt' : 'bg-cobalt-light text-cobalt'
                }`} title={`${activeClaimsCount} active claim(s)`}>
                  {activeClaimsCount}
                </span>
              ) : bookmarks.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive('/my-activity') ? 'bg-white text-cobalt' : 'bg-cobalt-light text-cobalt'
                }`}>
                  {bookmarks.length}
                </span>
              )}
            </Link>

            {currentUser.role === 'moderator' && (
              <Link
                to="/moderator"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/moderator')
                    ? 'bg-ink-primary text-white shadow-subtle'
                    : 'text-coral hover:bg-coral-light'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Moderator Desk</span>
              </Link>
            )}
          </nav>

          {/* Actions: Report Lost / Report Found */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              to="/report?type=lost"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-coral bg-coral-light hover:bg-coral/20 border border-coral/30 transition flex items-center gap-1.5"
            >
              <span>Report Lost</span>
            </Link>

            <Link
              to="/report?type=found"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cobalt hover:bg-cobalt-hover shadow-subtle hover:shadow transition flex items-center gap-1.5 group"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Found</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/report?type=found"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-cobalt"
            >
              Report
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink-primary hover:bg-white transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-paper-border bg-paper-bg px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-paper-border mb-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200" 
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-ink-primary">{currentUser.name}</p>
              <p className="text-xs text-ink-secondary truncate">{currentUser.department}</p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-butter-light text-butter-dark">
              {currentUser.role}
            </span>
          </div>

          <nav className="flex flex-col space-y-1">
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-ink-primary hover:bg-white transition flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cobalt" />
                Browse All Items
              </span>
              <ArrowRight className="w-4 h-4 text-ink-secondary" />
            </Link>

            <Link
              to="/my-activity"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-ink-primary hover:bg-white transition flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-coral" />
                My Activity & Saved
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-paper-card text-ink-primary">
                {bookmarks.length}
              </span>
            </Link>

            <Link
              to="/report?type=lost"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-coral bg-coral-light/50 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              I Lost Something
            </Link>

            <Link
              to="/report?type=found"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-white bg-cobalt transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              I Found Something
            </Link>

            <Link
              to="/moderator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-ink-secondary hover:bg-white transition flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Campus Safety Moderator View
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
