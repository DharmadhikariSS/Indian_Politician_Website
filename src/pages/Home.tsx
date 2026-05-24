import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, TrendingUp, Users, ShieldAlert, BadgeAlert, Newspaper, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PoliticianCard } from '../components/ui/PoliticianCard';
import { usePoliticians } from '../hooks/usePoliticians';

const WorkAreas = [
  { level: 'National', roles: ['Prime Minister', 'Union Cabinet Ministers', 'Ministers of State', 'Rajya Sabha MPs', 'Lok Sabha MPs'] },
  { level: 'State', roles: ['Chief Ministers', 'State Cabinet Ministers', 'MLAs', 'MLCs', 'Speakers'] },
  { level: 'Local / District', roles: ['Mayors', 'Deputy Mayors', 'Municipal Councillors', 'Zila Panchayat'] },
  { level: 'Grassroots', roles: ['Block Pramukh', 'Gram Panchayat Sarpanch', 'Ward Member'] },
];

const Home = () => {
  const { data: politicians = [], isLoading } = usePoliticians();

  // Extract all news articles and sort them by date descending
  const recentArticles = useMemo(() => {
    const articles = politicians.flatMap(p => 
      (p.newsArticles || []).map(art => ({
        ...art,
        politicianId: p.id,
        politicianName: p.name,
        politicianParty: p.party
      }))
    );
    // Sort by date descending
    return articles.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  }, [politicians]);

  // Dynamically select riskiest politicians for "Recently Flagged"
  const recentlyFlagged = useMemo(() => {
    return [...politicians]
      .sort((a, b) => a.aiScore - b.aiScore) // Riskiest first
      .slice(0, 4);
  }, [politicians]);

  // Derive dynamic stats from parsed ECI records
  const stats = useMemo(() => {
    const totalTracked = politicians.length;
    const totalCases = politicians.reduce((acc, p) => acc + (p.criminalCases || 0), 0);
    
    // Average Net Worth Growth percentage
    const growthValues = politicians
      .map(p => p.netWorthGrowth)
      .filter(g => typeof g === 'number' && g >= 0);
    
    const avgGrowth = growthValues.length > 0 
      ? Math.round(growthValues.reduce((acc, g) => acc + g, 0) / growthValues.length) 
      : 20;

    // Scan for flagged markers
    const scamLinked = politicians.filter(p => {
      const f = p.flags || {};
      return f.offshoreLink || f.cronyism || f.edRaid || f.convicted;
    }).length;

    return {
      totalTracked,
      totalCases,
      avgGrowth,
      scamLinked
    };
  }, [politicians]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-bg-secondary pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
          {/* Abstract India Map SVG placeholder */}
          <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] fill-current text-accent-gold">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" />
          </svg>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <BadgeAlert className="mx-auto mb-6 text-accent-gold" size={48} />
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-text-primary">
            Know Your Representatives.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-warning-amber">Hold Power Accountable.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary mb-10 font-sans">
            Transparent, data-driven insights on every MP, MLA, Minister, Sarpanch, and Mayor across India.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/search" className="w-full sm:w-auto">
              <Button size="lg" className="w-full font-bold bg-accent-gold text-bg-primary hover:bg-accent-gold/80">
                <Search className="mr-2 h-5 w-5" /> Search a Politician
              </Button>
            </Link>
            <Link to="/browse" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                Browse by State
              </Button>
            </Link>
            <Link to="/rankings" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full bg-bg-card border border-border-subtle text-info-blue hover:bg-bg-primary">
                <ShieldAlert className="mr-2 h-5 w-5" /> AI Integrity Report
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border-subtle pt-10">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-mono font-bold text-text-primary">
                {isLoading ? '...' : `${stats.totalTracked}+`}
              </span>
              <span className="text-xs uppercase tracking-wider text-text-secondary mt-1">Politicians Tracked</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-mono font-bold text-danger-red">
                {isLoading ? '...' : stats.totalCases}
              </span>
              <span className="text-xs uppercase tracking-wider text-text-secondary mt-1">Cases Pending</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-mono font-bold text-warning-amber">
                {isLoading ? '...' : `${stats.avgGrowth}%`}
              </span>
              <span className="text-xs uppercase tracking-wider text-text-secondary mt-1">Avg Asset Growth</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-mono font-bold text-accent-gold">
                {isLoading ? '...' : stats.scamLinked}
              </span>
              <span className="text-xs uppercase tracking-wider text-text-secondary mt-1">Scam Linked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-bg-card border-b border-border-subtle overflow-hidden flex whitespace-nowrap py-3">
        <div className="animate-marquee flex items-center gap-8 font-mono text-sm text-text-secondary">
          <span className="flex items-center text-danger-red"><AlertTriangle size={14} className="mr-1"/> {isLoading ? '...' : stats.totalCases} pending criminal cases tracked</span>
          <span className="flex items-center"><TrendingUp size={14} className="mr-1"/> {isLoading ? '...' : `${stats.avgGrowth}%`} average net worth growth per term</span>
          <span className="flex items-center text-warning-amber"><AlertTriangle size={14} className="mr-1"/> {isLoading ? '...' : stats.scamLinked} politicians with active wealth discrepancy tags</span>
          <span className="flex items-center text-success-green"><Users size={14} className="mr-1"/> 100% independent civic transparency registry</span>
          {/* Duplicate for infinite loop illusion */}
          <span className="flex items-center text-danger-red"><AlertTriangle size={14} className="mr-1"/> {isLoading ? '...' : stats.totalCases} pending criminal cases tracked</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        
        {/* Top Sections */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-text-primary">Recently Flagged</h2>
              <p className="text-text-secondary text-sm mt-1">Politicians with new FIRs, ED raids, or EC notices</p>
            </div>
            <Link to="/rankings">
              <Button variant="link" className="text-info-blue">
                View All Reports
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
              <h3 className="font-heading text-lg font-bold text-text-secondary">LOADING TELEMETRY DATA...</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyFlagged.map(politician => (
                <PoliticianCard key={politician.id} data={politician} />
              ))}
            </div>
          )}
        </section>

        {/* Breaking Transparency Scans */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
                <Newspaper className="text-accent-gold" size={24} />
                BREAKING TRANSPARENCY PRESS SCANS
              </h2>
              <p className="text-text-secondary text-sm mt-1">Live aggregated media disclosures, audits, and investigative journalism alerts</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
              <h3 className="font-heading text-lg font-bold text-text-secondary">SCANNING PRESS LEDGERS...</h3>
            </div>
          ) : recentArticles.length === 0 ? (
            <div className="bg-bg-secondary border border-border-subtle rounded-xl p-10 text-center text-text-secondary">
              No press articles indexed in current directory scan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentArticles.map(article => {
                const isCrit = article.sentiment === 'CRITICAL_ALLEGATION';
                const isPos = article.sentiment === 'POSITIVE_OUTCOME';
                
                return (
                  <div 
                    key={article.id} 
                    className="bg-bg-secondary rounded-xl border border-border-subtle p-5 hover:border-text-secondary transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary">
                        <span>{article.publisher.toUpperCase()} • {article.date}</span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                          isCrit ? 'bg-danger-red/10 text-danger-red border border-danger-red/20' :
                          isPos ? 'bg-success-green/10 text-success-green border border-success-green/20' :
                          'bg-bg-card text-text-secondary border border-border-subtle'
                        }`}>
                          {article.sentiment.split('_')[0]}
                        </span>
                      </div>

                      <Link to={`/politician/${article.politicianId}`}>
                        <h3 className="font-heading text-lg font-bold text-text-primary hover:text-accent-gold transition-colors leading-tight">
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="border-t border-border-subtle/50 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-text-secondary truncate pr-2">
                        SUBJECT: <Link to={`/politician/${article.politicianId}`} className="text-text-primary font-bold hover:text-accent-gold">{article.politicianName} ({article.politicianParty})</Link>
                      </span>
                      <Link to={`/politician/${article.politicianId}`} className="text-accent-gold hover:text-text-primary flex items-center shrink-0">
                        AUDIT &gt;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Browse By Work Area */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-8 border-b border-border-subtle pb-4">Explore by Governance Level</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WorkAreas.map((area, idx) => (
              <div key={idx} className="bg-bg-secondary rounded-xl border border-border-subtle p-6 hover:border-text-secondary transition-colors">
                <h3 className="text-xl font-heading text-accent-gold mb-4 uppercase tracking-wider">{area.level}</h3>
                <ul className="space-y-3">
                  {area.roles.map((role, rIdx) => (
                    <li key={rIdx}>
                      <Link to={`/browse?role=${role}`} className="text-text-primary hover:text-info-blue text-sm font-medium transition-colors flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-border-subtle mr-2 inline-block"></span>
                        {role}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
