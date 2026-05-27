import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, AlertTriangle, TrendingUp, Users, ShieldAlert, BadgeAlert,
  Newspaper, ChevronRight, MapPin, Building2, ShieldCheck, Scale,
  Globe, ArrowRight, Sparkles, BarChart3, GitCompare, Star,
  FileText, Clock, Zap, Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PoliticianCard } from '../components/ui/PoliticianCard';
import { usePoliticians } from '../hooks/usePoliticians';
import { useI18n } from '../i18n/translations';

const PLATFORM_FEATURES = [
  {
    icon: ShieldAlert,
    title: 'Criminal Record Tracker',
    desc: 'Real-time tracking of FIRs, chargesheets, and court dates from ECI affidavits.',
    color: 'text-danger-red',
    bg: 'glass-danger',
  },
  {
    icon: TrendingUp,
    title: 'Wealth Growth Monitor',
    desc: 'Cross-election asset comparison using sworn declaration data.',
    color: 'text-warning-amber',
    bg: '',
  },
  {
    icon: BarChart3,
    title: 'Parliament Performance',
    desc: 'Attendance, debates, questions & bills data from PRS Legislative Research.',
    color: 'text-info-blue',
    bg: '',
  },
  {
    icon: GitCompare,
    title: 'Side-by-Side Compare',
    desc: 'Compare any two politicians across 20+ integrity metrics simultaneously.',
    color: 'text-success-green',
    bg: 'glass-success',
  },
  {
    icon: Sparkles,
    title: 'Democracy Match Quiz',
    desc: 'Find which politician\'s track record aligns with your civic priorities.',
    color: 'text-accent-gold',
    bg: '',
  },
  {
    icon: MapPin,
    title: 'Constituency Finder',
    desc: 'Enter your PIN code to instantly discover your MP, MLA, and Corporator.',
    color: 'text-purple',
    bg: '',
  },
];

const GOVERNANCE_LEVELS = [
  {
    level: 'National',
    icon: '🇮🇳',
    roles: ['Prime Minister', 'Union Cabinet Ministers', 'Ministers of State', 'Rajya Sabha MPs', 'Lok Sabha MPs'],
    badge: 'Central Govt',
  },
  {
    level: 'State',
    icon: '🏛️',
    roles: ['Chief Ministers', 'State Cabinet Ministers', 'MLAs', 'MLCs', 'Speakers'],
    badge: 'State Govt',
  },
  {
    level: 'Local / District',
    icon: '🏙️',
    roles: ['Mayors', 'Deputy Mayors', 'Municipal Councillors', 'Zila Panchayat'],
    badge: 'Urban Bodies',
  },
  {
    level: 'Grassroots',
    icon: '🌾',
    roles: ['Block Pramukh', 'Gram Panchayat Sarpanch', 'Ward Member'],
    badge: 'Panchayati Raj',
  },
];

const Home = () => {
  const { t } = useI18n();
  const { data: politicians = [], isLoading } = usePoliticians();
  const [searchPincode, setSearchPincode] = useState('');
  const [funnelResults, setFunnelResults] = useState<{
    mp: any | null;
    mla: any | null;
    corporator: any | null;
    pincode: string;
  } | null>(null);
  const [funnelError, setFunnelError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [heroCount, setHeroCount] = useState(0);

  // Animate counter on load
  useEffect(() => {
    if (!isLoading && politicians.length > 0) {
      let start = 0;
      const end = politicians.length;
      const step = Math.ceil(end / 40);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setHeroCount(end);
          clearInterval(timer);
        } else {
          setHeroCount(start);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isLoading, politicians.length]);

  const handlePincodeSearch = (pincode: string) => {
    const trimmed = pincode.trim();
    if (trimmed.length !== 6 || !/^\d+$/.test(trimmed)) {
      setFunnelError(t('pin_error'));
      setFunnelResults(null);
      return;
    }
    setFunnelError('');
    const matches = politicians.filter(p => p.pincodes?.includes(trimmed));
    if (matches.length === 0) {
      setFunnelError(t('pin_not_found'));
      setFunnelResults(null);
      return;
    }
    const mp = matches.find(p => p.role.toLowerCase().includes('mp') || p.role.toLowerCase().includes('lok sabha') || p.role.toLowerCase().includes('rajya sabha')) || null;
    const mla = matches.find(p => p.role === 'MLA') || null;
    const corporator = matches.find(p => p.role === 'Corporator') || null;
    setFunnelResults({ mp, mla, corporator, pincode: trimmed });
  };

  const handleLiveGeolocation = () => {
    setIsLocating(true);
    setFunnelError('');
    setTimeout(() => {
      setIsLocating(false);
      setSearchPincode('560001');
      handlePincodeSearch('560001');
    }, 1500);
  };

  const recentArticles = useMemo(() => {
    const articles = politicians.flatMap(p =>
      (p.newsArticles || []).map(art => ({
        ...art,
        politicianId: p.id,
        politicianName: p.name,
        politicianParty: p.party,
      }))
    );
    return articles.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  }, [politicians]);

  const recentlyFlagged = useMemo(() => {
    return [...politicians].sort((a, b) => a.aiScore - b.aiScore).slice(0, 4);
  }, [politicians]);

  const stats = useMemo(() => {
    const totalTracked = politicians.length;
    const totalCases = politicians.reduce((acc, p) => acc + (p.criminalCases || 0), 0);
    const growthValues = politicians.map(p => p.netWorthGrowth).filter(g => typeof g === 'number' && g >= 0);
    const avgGrowth = growthValues.length > 0
      ? Math.round(growthValues.reduce((acc, g) => acc + g, 0) / growthValues.length)
      : 20;
    const scamLinked = politicians.filter(p => {
      const f = p.flags || {};
      return f.offshoreLink || f.cronyism || f.edRaid || f.convicted;
    }).length;
    return { totalTracked, totalCases, avgGrowth, scamLinked };
  }, [politicians]);

  const STAT_ITEMS = [
    { value: isLoading ? '...' : `${heroCount}+`, label: t('stat_tracked'), color: 'text-text-primary', sub: t('stat_live') },
    { value: isLoading ? '...' : String(stats.totalCases), label: t('stat_cases'), color: 'text-danger-red', sub: t('stat_pending') },
    { value: isLoading ? '...' : `${stats.avgGrowth}%`, label: t('stat_growth'), color: 'text-warning-amber', sub: t('stat_per_term') },
    { value: isLoading ? '...' : String(stats.scamLinked), label: t('stat_flagged'), color: 'text-accent-gold', sub: t('stat_politicians') },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
          <div className="absolute top-20 left-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(232,160,32,0.2) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
          {/* India Tricolor dots */}
          <div className="absolute top-10 right-10 opacity-5 font-mono text-[200px] select-none">🇮🇳</div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 border border-border-medium">
            <span className="live-dot" />
            <span className="text-xs font-mono text-success-green uppercase tracking-widest">{t('hero_badge')}</span>
          </div>

          {/* Hero headline */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 leading-none">
            <span className="text-text-primary block">{t('hero_title_1')}</span>
            <span className="gradient-text-hero block">{t('hero_title_2')}</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-text-secondary mb-10 font-sans leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* ── PIN Code Finder ── */}
          <div className="max-w-3xl mx-auto glass-elevated p-6 rounded-2xl shadow-2xl space-y-5 text-left mb-10">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-text-primary flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-accent-gold" />
                  {t('pin_title')}
                </h3>
                <p className="text-xs text-text-secondary font-sans">
                  {t('pin_subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-bg-primary border border-border-medium px-3 py-2.5 rounded-xl text-sm font-mono w-full sm:w-44 focus-within:border-accent-gold/50 transition-colors">
                  <MapPin size={14} className="text-text-muted shrink-0" />
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="e.g. 560001"
                    value={searchPincode}
                    onChange={(e) => setSearchPincode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handlePincodeSearch(searchPincode)}
                    className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-muted text-sm"
                  />
                </div>
                <button
                  onClick={() => handlePincodeSearch(searchPincode)}
                  className="bg-accent-gold hover:bg-accent-gold/85 text-bg-primary font-bold font-mono text-xs px-5 py-2.5 rounded-xl shrink-0 shadow-lg press-effect transition-all"
                  id="pin-search-btn"
                >
                  {t('pin_cta')}
                </button>
                <button
                  onClick={handleLiveGeolocation}
                  className="flex items-center justify-center gap-1.5 font-mono text-xs px-4 py-2.5 rounded-xl shrink-0 border border-border-medium hover:bg-bg-elevated text-text-primary press-effect transition-all"
                >
                  {isLocating ? (
                    <><div className="w-3.5 h-3.5 border-2 border-info-blue/30 border-t-info-blue rounded-full animate-spin" /> {t('pin_locating')}</>
                  ) : (
                    <><Globe size={13} className="text-info-blue" /> {t('pin_gps')}</>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {funnelError && (
              <div className="glass-danger rounded-xl p-3 text-danger-red font-mono text-xs flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                {funnelError}
              </div>
            )}

            {/* Results */}
            {funnelResults && (
              <div className="pt-4 border-t border-border-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-accent-gold">
                    <ShieldCheck size={14} /> {t('pin_ballot')} {funnelResults.pincode}
                  </div>
                  <button
                    onClick={() => { setFunnelResults(null); setSearchPincode(''); }}
                    className="font-mono text-[10px] text-text-muted hover:text-text-secondary underline transition-colors"
                  >
                    {t('pin_clear')}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { tier: t('pin_mp'), data: funnelResults.mp, label: t('pin_view') },
                    { tier: t('pin_mla'), data: funnelResults.mla, label: t('pin_view') },
                    { tier: t('pin_corp'), data: funnelResults.corporator, label: t('pin_view') },
                  ].map(({ tier, data: rep, label }) => (
                    <div key={tier} className="glass-panel rounded-xl p-3.5 space-y-3">
                      <span className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-widest">{tier}</span>
                      {rep ? (
                        <>
                          <div className="flex items-center gap-3">
                            <img src={rep.photoUrl} alt={rep.name}
                              className="w-9 h-9 rounded-lg object-cover object-top border border-border-subtle shrink-0"
                              referrerPolicy="no-referrer" />
                            <div className="min-w-0">
                              <p className="font-heading font-bold text-sm text-text-primary truncate">{rep.name}</p>
                              <p className="text-[10px] text-text-secondary font-mono truncate">{rep.party} • {rep.constituency || rep.state}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full border ${
                              rep.aiScore >= 70 ? 'tag-success' : rep.aiScore >= 40 ? 'tag-warning' : 'tag-danger'
                            }`}>
                              SCORE: {rep.aiScore}/100
                            </span>
                            <Link to={`/politician/${rep.id}`}
                              className="text-[9px] font-mono text-accent-gold hover:text-text-primary flex items-center gap-0.5 transition-colors">
                              {label} <ArrowRight size={9} />
                            </Link>
                          </div>
                        </>
                      ) : (
                        <p className="text-[10px] text-text-muted font-sans leading-relaxed">
                          {t('pin_not_found')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link to="/democracy-match" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-accent-gold hover:bg-accent-gold/85 text-bg-primary font-bold font-heading text-sm px-8 py-3.5 rounded-xl shadow-lg press-effect transition-all">
                <Sparkles size={18} className="animate-pulse" />
                {t('section_cta').toUpperCase()}
              </button>
            </Link>
            <Link to="/search" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 glass-panel hover:bg-bg-elevated text-text-primary font-medium text-sm px-8 py-3.5 rounded-xl border border-border-medium press-effect transition-all">
                <Search size={16} />
                {t('nav_search')}
              </button>
            </Link>
            <Link to="/browse" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 glass-panel hover:bg-bg-elevated text-info-blue font-medium text-sm px-8 py-3.5 rounded-xl border border-info-blue/20 press-effect transition-all">
                {t('nav_browse')}
              </button>
            </Link>
          </div>

          {/* ── Live Stats Bar ── */}
          <div className="glass-panel rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 border border-border-medium">
            {STAT_ITEMS.map(({ value, label, color, sub }) => (
              <div key={label} className="flex flex-col items-center py-2">
                <span className={`text-3xl md:text-4xl font-mono font-black ${color}`}>{value}</span>
                <span className="text-xs font-heading font-semibold text-text-primary mt-1">{label}</span>
                <span className="text-[10px] text-text-muted font-mono mt-0.5">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWS TICKER
      ══════════════════════════════════════════ */}
      <div className="border-y border-border-subtle overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="ticker-track flex items-center gap-10 py-3 font-mono text-[11px] text-text-secondary whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-danger-red">
            <AlertTriangle size={12} /> {isLoading ? '...' : stats.totalCases} pending criminal cases tracked
          </span>
          <span className="text-border-subtle">•</span>
          <span className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-warning-amber" /> Average asset growth {isLoading ? '...' : `${stats.avgGrowth}%`} per term
          </span>
          <span className="text-border-subtle">•</span>
          <span className="flex items-center gap-1.5 text-warning-amber">
            <BadgeAlert size={12} /> {isLoading ? '...' : stats.scamLinked} politicians with active wealth discrepancy flags
          </span>
          <span className="text-border-subtle">•</span>
          <span className="flex items-center gap-1.5 text-success-green">
            <ShieldCheck size={12} /> 100% independent civic transparency registry — no political affiliations
          </span>
          <span className="text-border-subtle">•</span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-info-blue" /> {isLoading ? '...' : `${politicians.length}+`} politicians tracked across all states
          </span>
          <span className="text-border-subtle">•</span>
          {/* Duplicate for seamless loop */}
          <span className="flex items-center gap-1.5 text-danger-red">
            <AlertTriangle size={12} /> {isLoading ? '...' : stats.totalCases} pending criminal cases tracked
          </span>
          <span className="text-border-subtle">•</span>
          <span className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-warning-amber" /> Average asset growth {isLoading ? '...' : `${stats.avgGrowth}%`} per term
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT SECTIONS
      ══════════════════════════════════════════ */}
      <div className="container mx-auto px-4 py-16 space-y-24">

        {/* ── Recently Flagged Politicians ── */}
        <section className="section-enter">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tag-danger flex items-center gap-1"><AlertTriangle size={10} /> HIGH RISK</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-black text-text-primary">
                {t('section_flagged')}
              </h2>
              <p className="text-text-secondary text-sm mt-1.5">
                {t('section_flagged_sub')}
              </p>
            </div>
            <Link to="/rankings">
              <button className="hidden sm:flex items-center gap-1.5 text-sm font-mono text-info-blue hover:text-text-primary border border-border-subtle hover:border-info-blue/30 px-4 py-2 rounded-lg transition-all">
                {t('view_all')} <ChevronRight size={14} />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
              <p className="font-mono text-sm text-text-secondary animate-pulse">{t('loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentlyFlagged.map((politician, idx) => (
                <PoliticianCard key={politician.id} data={politician} rank={idx + 1} />
              ))}
            </div>
          )}
        </section>

        {/* ── Platform Features Grid ── */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4 border border-border-subtle">
              <Zap size={12} className="text-accent-gold" />
              <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Platform Capabilities</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-text-primary mb-3">
              {t('section_features')}
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-sm">
              {t('section_features_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORM_FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={`glass-panel hover-glow rounded-2xl p-6 border border-border-subtle group cursor-default`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bg || 'bg-bg-elevated'}`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-heading font-bold text-base text-text-primary mb-2 group-hover:text-accent-gold transition-colors">
                  {title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Breaking Press Scans ── */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tag-info flex items-center gap-1"><Newspaper size={10} /> PRESS INTEL</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-black text-text-primary">
                {t('section_news')}
              </h2>
              <p className="text-text-secondary text-sm mt-1.5">
                {t('section_news_sub')}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-info-blue/20 border-t-info-blue rounded-full animate-spin" />
            </div>
          ) : recentArticles.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-text-muted">
              <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-mono text-sm">No press articles indexed in current scan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentArticles.map(article => {
                const isCrit = article.sentiment === 'CRITICAL_ALLEGATION';
                const isPos = article.sentiment === 'POSITIVE_OUTCOME';
                return (
                  <div key={article.id} className="glass-panel hover-glow rounded-2xl p-5 flex flex-col justify-between border border-border-subtle">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-mono text-text-muted">
                          {article.publisher.toUpperCase()} • {article.date}
                        </span>
                        <span className={`shrink-0 ${
                          isCrit ? 'tag-danger' : isPos ? 'tag-success' : 'tag-info'
                        }`}>
                          {article.sentiment.split('_')[0]}
                        </span>
                      </div>
                      <Link to={`/politician/${article.politicianId}`}>
                        <h3 className="font-heading text-base font-bold text-text-primary hover:text-accent-gold transition-colors leading-snug">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                    <div className="border-t border-border-subtle/50 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-text-muted truncate pr-2">
                        <Link to={`/politician/${article.politicianId}`} className="text-text-secondary font-bold hover:text-accent-gold">
                          {article.politicianName}
                        </Link>
                        {' '}({article.politicianParty})
                      </span>
                      <Link to={`/politician/${article.politicianId}`} className="text-accent-gold hover:text-warning-amber flex items-center gap-1 shrink-0 transition-colors">
                        AUDIT <ChevronRight size={10} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Browse by Governance Level ── */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-text-primary mb-3">
              Explore by Governance Level
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto">
              From the Prime Minister to your local Gram Panchayat — track accountability at every tier of Indian democracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {GOVERNANCE_LEVELS.map((area) => (
              <div key={area.level} className="glass-panel hover-glow-gold rounded-2xl p-6 border border-border-subtle group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{area.icon}</span>
                  <span className="tag-gold text-[9px]">{area.badge}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-accent-gold mb-4">{area.level}</h3>
                <ul className="space-y-2.5">
                  {area.roles.map((role) => (
                    <li key={role}>
                      <Link
                        to={`/browse?role=${role}`}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group/link"
                      >
                        <ChevronRight size={12} className="text-text-muted group-hover/link:text-accent-gold transition-colors shrink-0" />
                        {role}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Call to Action Section ── */}
        <section>
          <div className="glass-gold rounded-3xl p-10 md:p-16 text-center border border-accent-gold/15">
            <Star size={32} className="text-accent-gold mx-auto mb-4 animate-float" />
            <h2 className="text-2xl md:text-4xl font-heading font-black text-text-primary mb-4">
              Which politician best represents YOUR values?
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Take the Democracy Match Quiz — answer 10 civic questions and find out which politicians' actual track records align with what matters to you.
            </p>
            <Link to="/democracy-match">
              <button className="inline-flex items-center gap-3 bg-accent-gold hover:bg-accent-gold/85 text-bg-primary font-black font-heading text-base px-10 py-4 rounded-2xl shadow-xl press-effect transition-all">
                <Sparkles size={20} />
                START DEMOCRACY MATCH
              </button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
