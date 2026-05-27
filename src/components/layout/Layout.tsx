import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import {
  Search, Map as MapIcon, BarChart3, Info, Home, GitCompare,
  ShieldCheck, Sparkles, Menu, X, AlertTriangle
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useI18n } from '../../i18n/translations';

const NAV_LINKS = [
  { to: '/browse', labelKey: 'nav_browse', icon: null },
  { to: '/rankings', labelKey: 'nav_rankings', icon: BarChart3 },
  { to: '/compare', labelKey: 'nav_compare', icon: GitCompare },
  { to: '/map', labelKey: 'nav_map', icon: MapIcon },
  { to: '/democracy-match', labelKey: 'nav_quiz', icon: Sparkles, accent: true },
  { to: '/about', labelKey: 'nav_about', icon: Info },
  { to: '/sources', labelKey: 'nav_sources', icon: ShieldCheck },
];

const MOBILE_NAV = [
  { to: '/', labelKey: 'nav_home', icon: Home },
  { to: '/browse', labelKey: 'nav_browse', icon: Search },
  { to: '/democracy-match', labelKey: 'nav_quiz', icon: Sparkles },
  { to: '/compare', labelKey: 'nav_compare', icon: GitCompare },
  { to: '/map', labelKey: 'nav_map', icon: MapIcon },
  { to: '/rankings', labelKey: 'nav_rankings', icon: BarChart3 },
];

const Layout = () => {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Collapse mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Add scroll shadow to header
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      
      {/* ── Top Header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-bg-primary/95 backdrop-blur-xl border-b border-border-subtle shadow-[0_1px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Disclaimer ribbon */}
        <div className="bg-warning-amber/10 border-b border-warning-amber/15 py-1.5 px-4 text-center">
          <span className="text-[10px] font-mono text-warning-amber flex items-center justify-center gap-1.5">
            <AlertTriangle size={10} />
            {t('disclaimer')}
          </span>
        </div>

        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent-gold to-warning-amber opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 text-bg-primary font-mono font-black text-xs">IN</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg tracking-tight text-text-primary leading-none block">
                मेरा<span className="text-accent-gold"> नेता</span>
              </span>
              <span className="text-[9px] font-mono text-text-muted tracking-widest block leading-none">
                MERA NETA • KNOW YOUR NETA
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, labelKey, icon: Icon, accent }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                  ${isActive
                    ? 'text-accent-gold bg-accent-gold/8 border border-accent-gold/15'
                    : accent
                    ? 'text-accent-gold hover:bg-accent-gold/8'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`
                }
              >
                {Icon && <Icon size={14} />}
                {t(labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              to="/search"
              className="p-2 rounded-lg text-text-secondary hover:text-accent-gold hover:bg-bg-elevated border border-border-subtle transition-all duration-200"
              aria-label="Search politicians"
            >
              <Search size={16} />
            </Link>
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-border-subtle transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden glass-elevated border-t border-border-subtle">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, labelKey, icon: Icon, accent }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? 'text-accent-gold bg-accent-gold/8 border border-accent-gold/15'
                      : accent
                      ? 'text-accent-gold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`
                  }
                >
                  {Icon && <Icon size={16} />}
                  {t(labelKey)}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full relative pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-bg-secondary border-t border-border-subtle py-14 mt-auto hidden md:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold to-warning-amber flex items-center justify-center">
                  <span className="text-bg-primary font-mono font-black text-xs">IN</span>
                </div>
                <span className="font-heading font-bold text-base text-text-primary">
                  NETA<span className="text-accent-gold">TRACK</span>
                </span>
              </Link>
              <p className="text-xs text-text-secondary leading-relaxed">
                India's independent civic transparency registry. Non-partisan, data-driven political accountability for every citizen.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="live-dot" />
                <span className="text-[10px] font-mono text-success-green">Platform Active</span>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-4 text-xs uppercase tracking-widest">Platform</h3>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                {[
                  { to: '/browse', label: 'Browse Politicians' },
                  { to: '/rankings', label: 'National Rankings' },
                  { to: '/compare', label: 'Compare Engine' },
                  { to: '/map', label: 'India Map View' },
                  { to: '/democracy-match', label: 'Democracy Match Quiz', accent: true },
                ].map(({ to, label, accent }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`hover:text-accent-gold transition-colors ${accent ? 'text-accent-gold font-medium' : ''}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Sources */}
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-4 text-xs uppercase tracking-widest">Data Sources</h3>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                {[
                  { href: 'https://myneta.info', label: 'MyNeta (ECI Affidavits)' },
                  { href: 'https://prsindia.org', label: 'PRS Legislative Research' },
                  { href: 'https://ecourts.gov.in', label: 'e-Courts India Portal' },
                  { href: 'https://eci.gov.in', label: 'Election Commission India' },
                  { href: 'https://loksabha.nic.in', label: 'Lok Sabha Secretariat' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors">
                      {label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-4 text-xs uppercase tracking-widest">Legal & Methodology</h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                NETATTRACK is an independent, non-partisan civic technology tool. All data is parsed from officially submitted public records. AI integrity ratings are mathematical indices — not political expressions.
              </p>
              <Link to="/about" className="text-xs text-accent-gold hover:underline">
                Read Full Methodology & Disclaimer →
              </Link>
              <div className="mt-4 space-y-1 text-[10px] text-text-muted font-mono">
                <div>Version 4.0 — Production Build</div>
                <div>Data refreshed: June 2026</div>
              </div>
            </div>
          </div>

          <div className="divider-gradient mb-6" />
          
          <div className="flex flex-col md:flex-row items-center justify-between text-text-muted text-xs gap-2">
            <p>© 2026 NETATTRACK. Built for civic transparency and democratic awareness.</p>
            <div className="flex items-center gap-4 font-mono">
              <Link to="/sources" className="hover:text-text-secondary transition-colors">Sources</Link>
              <Link to="/about" className="hover:text-text-secondary transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Mobile Bottom Navigation ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-elevated border-t border-border-subtle mobile-nav-safe">
        <nav className="flex justify-around items-center h-14">
          {MOBILE_NAV.map(({ to, labelKey, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all ${
                  isActive ? 'text-accent-gold' : 'text-text-muted'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[9px] font-mono">{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
