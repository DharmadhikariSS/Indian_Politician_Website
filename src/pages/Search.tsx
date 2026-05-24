import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { 
  Search as SearchIcon, 
  X, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Scale, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  History,
  Activity,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { usePoliticians } from '../hooks/usePoliticians';
import type { DetailedPoliticianData } from '../data/politicians';
import { IntegrityScoreGauge } from '../components/ui/IntegrityScoreGauge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

type FilterCategory = 'all' | 'federal' | 'state-local' | 'risky' | 'clean';

const Search = () => {
  const { data: politicians = [], isLoading } = usePoliticians();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Electoral Bonds',
    'ED Raid',
    'Uttar Pradesh',
    'Sarpanch'
  ]);
  // Initialize Fuse.js for advanced fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(politicians, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'state', weight: 0.2 },
        { name: 'constituency', weight: 0.2 },
        { name: 'role', weight: 0.1 },
        { name: 'party', weight: 0.1 }
      ],
      threshold: 0.35, // Balanced tolerance for typo tolerance
      ignoreLocation: true
    });
  }, [politicians]);

  // Perform search and time the execution
  const { results: searchResults, searchTimeMs } = useMemo(() => {
    const startTime = performance.now();
    let results: DetailedPoliticianData[] = [];

    if (query.trim() === '') {
      results = [...politicians];
    } else {
      results = fuse.search(query).map(res => res.item);
    }

    // Apply category filters
    if (activeCategory === 'federal') {
      results = results.filter(p => p.role.includes('MP') || p.role.includes('Cabinet Minister'));
    } else if (activeCategory === 'state-local') {
      results = results.filter(p => p.role.includes('MLA') || p.role.includes('Mayor') || p.role.includes('Sarpanch'));
    } else if (activeCategory === 'risky') {
      results = results.filter(p => p.aiScore <= 40);
    } else if (activeCategory === 'clean') {
      results = results.filter(p => p.aiScore >= 70 && p.criminalCases === 0);
    }

    const endTime = performance.now();
    const timeMs = parseFloat((endTime - startTime).toFixed(2));
    
    return { results, searchTimeMs: timeMs };
  }, [query, activeCategory, fuse, politicians]);

  // Handle clicking a popular recent search keyword
  const handleRecentClick = (keyword: string) => {
    setQuery(keyword);
  };

  // Log query in recent searches on submit/blur
  const handleSaveSearch = () => {
    if (query.trim() !== '' && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleClearQuery = () => {
    setQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl min-h-[calc(100vh-64px)]">
      
      {/* Header telemetry section */}
      <div className="border-b border-border-subtle pb-6 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary flex items-center gap-2">
            <SearchIcon className="text-accent-gold" size={32} />
            FUZZY TRANS-REGIONAL SEARCH ENGINE
          </h1>
          <p className="text-sm text-text-secondary mt-1 font-sans">
            Query our entire indexed base using partial strings, typos, state coordinates, or party names.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono bg-bg-secondary border border-border-subtle px-3 py-1.5 rounded shadow">
          <Activity size={12} className="text-success-green animate-pulse" />
          INDEX STATUS: 12,450 DECLARED NODES ACTIVE
        </div>
      </div>

      {/* Main Search Panel */}
      <Card className="bg-bg-secondary border border-border-subtle shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-4 text-text-secondary w-6 h-6" />
            <input
              type="text"
              placeholder="Search representatives by typing names, constituencies (e.g. 'Madurai'), state names, or parties..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleSaveSearch}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSearch()}
              className="w-full bg-bg-card border-2 border-border-subtle rounded-xl pl-12 pr-12 py-3.5 text-base font-sans focus:outline-none focus:border-accent-gold transition-colors text-text-primary placeholder:text-text-secondary"
            />
            {query && (
              <button 
                onClick={handleClearQuery}
                className="absolute right-4 top-4 text-text-secondary hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Popular searches row */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs text-text-secondary font-mono">
            <span className="flex items-center gap-1"><History size={12} /> SEARCH TELEMETRY DISCOVERIES:</span>
            {recentSearches.map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleRecentClick(keyword)}
                className="bg-bg-card border border-border-subtle hover:border-text-secondary text-text-primary px-2.5 py-1 rounded transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs & Speed Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 font-mono text-xs">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 bg-bg-secondary/40 border border-border-subtle rounded-lg p-1">
          {[
            { key: 'all', label: 'All Representatives' },
            { key: 'federal', label: 'Union Parliament (MPs / Ministers)' },
            { key: 'state-local', label: 'Assembly & Local (MLAs / Mayors / Sarpanch)' },
            { key: 'risky', label: 'Critical Risk Alert (AI Score ≤ 40)' },
            { key: 'clean', label: 'High Integrity & Clean Records' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key as FilterCategory)}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                activeCategory === tab.key 
                  ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Speed Stats */}
        <div className="text-text-secondary self-end">
          INDEX QUERY RETRIEVED IN <span className="text-text-primary font-bold">{searchTimeMs}ms</span> • FOUND <span className="text-accent-gold font-bold">{searchResults.length}</span> MATCHES
        </div>
      </div>

      {/* Search Results List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-16 text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold mx-auto"></div>
            <h3 className="font-heading text-lg font-bold text-text-secondary uppercase">RETRIEVING COMPREHENSIVE INDEX...</h3>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-16 text-center space-y-3.5">
            <ShieldAlert size={48} className="text-warning-amber mx-auto" />
            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wider">
                NO RESULTS RETRIEVED FOR "{query}"
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed mt-1 font-sans">
                The fuzzy engine could not associate this query with any declared representative. Re-verify spelling coordinates.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setQuery(''); setActiveCategory('all'); }}>
              Reset Search Parameters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((politician) => {
              const isSevereRisk = politician.aiScore <= 40;
              const isCautionRisk = politician.aiScore > 40 && politician.aiScore <= 70;
              const netWorthCrores = parseFloat(politician.netWorth.replace(/[^\d.-]/g, '')) || 0;

              return (
                <Link 
                  key={politician.id}
                  to={`/politician/${politician.id}`}
                  className="block group"
                >
                  <Card className="border-border-subtle bg-bg-card/45 hover:border-text-secondary hover:bg-bg-card transition-all overflow-hidden h-full">
                    {/* Top warning line */}
                    <div className={`h-1 w-full ${
                      isSevereRisk ? 'bg-danger-red' : isCautionRisk ? 'bg-warning-amber' : 'bg-success-green'
                    }`} />

                    <div className="p-4 flex gap-4 items-center">
                      {/* Photo Portrait */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border-subtle bg-bg-secondary relative">
                        <img 
                          src={politician.photoUrl} 
                          alt={politician.name} 
                          className="w-full h-full object-cover"
                        />
                        {politician.isVerified && (
                          <div className="absolute bottom-0 right-0 bg-info-blue p-0.5 rounded-tl shadow text-[8px] font-bold text-white">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Info Identity */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-accent-gold transition-colors truncate">
                            {politician.name}
                          </h3>
                          <span className="text-[9px] bg-bg-secondary border border-border-subtle px-1.5 py-0.5 rounded font-bold font-mono">
                            {politician.party}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {politician.role} • {politician.state}
                          </span>
                        </div>

                        <div className="flex items-center gap-3.5 text-[11px] font-mono text-text-secondary mt-1 flex-wrap">
                          <span>ASSETS: <strong className="text-text-primary">₹{politician.netWorth}</strong></span>
                          <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                          <span>
                            CASES: <strong className={politician.criminalCases > 0 ? 'text-danger-red font-bold' : 'text-success-green'}>{politician.criminalCases} Pending</strong>
                          </span>
                          {politician.attendancePct !== undefined && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                              <span>SESSIONS: <strong className="text-text-primary">{politician.attendancePct}%</strong></span>
                            </>
                          )}
                        </div>

                        {/* Quick flags row */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {politician.flags.edRaid && <Badge variant="outline" className="text-[8px] px-1 py-0 bg-bg-secondary/40 border-warning-amber/40 text-warning-amber">ED RAID</Badge>}
                          {politician.flags.convicted && <Badge variant="danger" className="text-[8px] px-1 py-0">CONVICTED</Badge>}
                          {politician.flags.offshoreLink && <Badge variant="outline" className="text-[8px] px-1 py-0 bg-bg-secondary/40 border-info-blue/40 text-info-blue">💰 OFFSHORE</Badge>}
                          {politician.flags.goodWork && <Badge variant="success" className="text-[8px] px-1 py-0">✅ HIGH SERVICE</Badge>}
                        </div>
                      </div>

                      {/* Integrity Gauge */}
                      <div className="flex flex-col items-center gap-0.5 shrink-0 pl-1">
                        <IntegrityScoreGauge score={politician.aiScore} size="sm" showLabel={false} />
                        <span className={`text-[8px] font-bold font-mono ${
                          isSevereRisk ? 'text-danger-red' : isCautionRisk ? 'text-warning-amber' : 'text-success-green'
                        }`}>
                          SCORE {politician.aiScore}
                        </span>
                      </div>
                      
                      <div className="text-text-secondary shrink-0 group-hover:text-accent-gold transition-colors pl-1">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Search;
