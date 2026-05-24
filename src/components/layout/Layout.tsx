import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Search, Map as MapIcon, BarChart3, Info, Home, GitCompare, ShieldCheck } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <header className="bg-bg-secondary border-b border-border-subtle sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {/* India Map SVG Silhouette Silhouette */}
            <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center text-bg-primary font-bold">IN</div>
            <span className="font-heading font-bold text-xl tracking-wider text-text-primary hidden sm:block">
              NETA<span className="text-accent-gold">TRACK</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 font-sans text-sm font-medium">
            <Link to="/browse" className="text-text-secondary hover:text-text-primary transition-colors">Browse</Link>
            <Link to="/rankings" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <BarChart3 size={16} /> Rankings
            </Link>
            <Link to="/compare" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <GitCompare size={16} /> Compare
            </Link>
            <Link to="/map" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <MapIcon size={16} /> Map
            </Link>
            <Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <Info size={16} /> About
            </Link>
            <Link to="/sources" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <ShieldCheck size={16} /> Sources
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/search" className="p-2 text-text-secondary hover:text-accent-gold transition-colors bg-bg-card rounded-md border border-border-subtle">
              <Search size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

      <footer className="bg-bg-secondary border-t border-border-subtle py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Platform</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/" className="hover:text-accent-gold transition-colors">Home</Link></li>
                <li><Link to="/browse" className="hover:text-accent-gold transition-colors">Browse Politicians</Link></li>
                <li><Link to="/rankings" className="hover:text-accent-gold transition-colors">National Rankings</Link></li>
                <li><Link to="/compare" className="hover:text-accent-gold transition-colors">Compare Engine</Link></li>
                <li><Link to="/sources" className="hover:text-accent-gold transition-colors">Verification Sources</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Data Sources</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="https://myneta.info" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors">MyNeta (ECI Affidavits)</a></li>
                <li><a href="https://prsindia.org" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors">PRS Legislative Research</a></li>
                <li><a href="https://ecourts.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors">e-Courts India Portal</a></li>
                <li><Link to="/about" className="hover:text-accent-gold transition-colors">Methodology Details</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                NETATTRACK is an independent, non-partisan civic technology tool. All data is parsed from officially submitted public records. AI ratings are mathematical indices, not political expressions.
              </p>
              <div className="mt-4">
                <Link to="/about" className="text-xs text-accent-gold hover:underline">Read Methodology & Disclaimer &rarr;</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border-subtle pt-6 text-center text-text-secondary text-xs">
            <p>© 2026 NETATTRACK. Built for civic transparency and democratic awareness.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle z-50">
        <nav className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <Home size={20} />
            <span className="text-[10px] mt-1">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <Search size={20} />
            <span className="text-[10px] mt-1">Search</span>
          </Link>
          <Link to="/compare" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <GitCompare size={20} />
            <span className="text-[10px] mt-1">Compare</span>
          </Link>
          <Link to="/map" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <MapIcon size={20} />
            <span className="text-[10px] mt-1">Map</span>
          </Link>
          <Link to="/rankings" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <BarChart3 size={20} />
            <span className="text-[10px] mt-1">Rank</span>
          </Link>
          <Link to="/sources" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <ShieldCheck size={20} />
            <span className="text-[10px] mt-1">Sources</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
