import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Search, Map as MapIcon, BarChart3, Info, Home } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-bg-secondary border-b border-border-subtle sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {/* India Map SVG Silhouette Placeholder */}
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
            <Link to="/map" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <MapIcon size={16} /> Map
            </Link>
            <Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <Info size={16} /> About
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

      <footer className="bg-bg-secondary border-t border-border-subtle py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-text-secondary text-sm">
          <p>© 2026 Politician Transparency & Accountability Platform</p>
          <p className="mt-2 text-xs">Public interest civic technology tool. Data sourced from publicly available government records.</p>
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
          <Link to="/map" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <MapIcon size={20} />
            <span className="text-[10px] mt-1">Map</span>
          </Link>
          <Link to="/rankings" className="flex flex-col items-center text-text-secondary hover:text-accent-gold">
            <BarChart3 size={20} />
            <span className="text-[10px] mt-1">Rank</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
