import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-paper-border bg-white pt-16 pb-12 text-ink-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Vision */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cobalt text-white flex items-center justify-center font-serif text-lg font-bold italic">
                R
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">ReFound</span>
            </Link>
            <p className="text-sm text-ink-secondary leading-relaxed">
              A photography-first, community-driven visual platform reuniting campus students with their lost essentials.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-bg text-xs text-ink-secondary border border-paper-border">
              <MapPin className="w-3.5 h-3.5 text-cobalt" />
              <span>Campus Station Hub & Safety Network</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif text-base font-semibold text-ink-primary mb-4">
              Explore Belongings
            </h4>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <Link to="/browse?category=Electronics" className="hover:text-cobalt transition">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link to="/browse?category=ID Cards" className="hover:text-cobalt transition">
                  ID Cards & Wallets
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Accessories" className="hover:text-cobalt transition">
                  Watches & Accessories
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Keys" className="hover:text-cobalt transition">
                  Keys & Lanyards
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Books" className="hover:text-cobalt transition">
                  Books & Course Notes
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Bags" className="hover:text-cobalt transition">
                  Backpacks & Bags
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safe Handover */}
          <div>
            <h4 className="font-serif text-base font-semibold text-ink-primary mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cobalt" />
              <span>Campus Safety Rules</span>
            </h4>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li className="flex items-start gap-2">
                <span className="text-cobalt font-bold">1.</span>
                <span>Meet in daylight at designated spots (Campus Center, Library Desk).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cobalt font-bold">2.</span>
                <span>Never transfer money or pay ransoms for returned lost property.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cobalt font-bold">3.</span>
                <span>Mask student numbers and sensitive personal data on photos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cobalt font-bold">4.</span>
                <span>Ask claimants for non-public identifiable proof before handover.</span>
              </li>
            </ul>
          </div>

          {/* Handover spots & Campus Hub */}
          <div>
            <h4 className="font-serif text-base font-semibold text-ink-primary mb-4">
              Safe Meeting Points
            </h4>
            <div className="bg-paper-bg p-4 rounded-xl border border-paper-border space-y-2.5 text-xs text-ink-secondary">
              <p className="font-medium text-ink-primary flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-butter-dark" />
                Recommended Official Handover Hubs:
              </p>
              <p>• <strong>Central Library</strong> Information Desk (8 AM – 10 PM)</p>
              <p>• <strong>Student Union</strong> Main Concierge (9 AM – 8 PM)</p>
              <p>• <strong>Campus Safety Building</strong> 24/7 Front Reception</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & tagline */}
        <div className="pt-8 border-t border-paper-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-secondary">
          <p>© {new Date().getFullYear()} ReFound. Lost things. Found people. Built with care for university communities.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-ink-primary font-medium">
              Made with <Heart className="w-3.5 h-3.5 text-coral fill-coral" /> for honest campuses
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

