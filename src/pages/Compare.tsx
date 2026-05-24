import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  GitCompare, 
  Search, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  User, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { usePoliticians } from '../hooks/usePoliticians';
import type { DetailedPoliticianData } from '../data/politicians';
import { IntegrityScoreGauge } from '../components/ui/IntegrityScoreGauge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const parseNetWorth = (val: string | undefined): number => {
  if (!val) return 0;
  const clean = val.replace(/[₹\s,]/g, '').toLowerCase();
  const match = clean.match(/([\d.]+)(cr|lakh|l)?/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2];
  if (unit === 'cr') return num;
  if (unit === 'lakh' || unit === 'l') return num / 100;
  return num;
};

const Compare = () => {
  const { data: politicians = [], isLoading } = usePoliticians();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  // Initialize selected politicians from URL params
  const p1Id = searchParams.get('p1');
  const p2Id = searchParams.get('p2');

  const p1 = useMemo(() => politicians.find(p => p.id === p1Id), [politicians, p1Id]);
  const p2 = useMemo(() => politicians.find(p => p.id === p2Id), [politicians, p2Id]);

  // Set up Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(politicians, {
      keys: ['name', 'party', 'state', 'constituency'],
      threshold: 0.35,
    });
  }, [politicians]);

  // Handle URL updates when a politician is selected
  const handleSelect = (slot: 1 | 2, id: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slot === 1) {
      newParams.set('p1', id);
      setQuery1('');
      setShowDropdown1(false);
    } else {
      newParams.set('p2', id);
      setQuery2('');
      setShowDropdown2(false);
    }
    setSearchParams(newParams);
  };

  // Clear slot selection
  const handleClearSlot = (slot: 1 | 2) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(slot === 1 ? 'p1' : 'p2');
    setSearchParams(newParams);
  };

  // Search suggestions
  const suggestions1 = useMemo(() => {
    if (!query1) return politicians.slice(0, 5);
    return fuse.search(query1).map(r => r.item).slice(0, 5);
  }, [query1, fuse, politicians]);

  const suggestions2 = useMemo(() => {
    if (!query2) return politicians.slice(0, 5);
    return fuse.search(query2).map(r => r.item).slice(0, 5);
  }, [query2, fuse, politicians]);

  // Chart 1: Financial Timeline Overlay Data
  const mergedTimelineData = useMemo(() => {
    if (!p1 || !p2) return [];
    const years = Array.from(new Set([
      ...(p1.financialTimeline || []).map(t => t.year),
      ...(p2.financialTimeline || []).map(t => t.year)
    ])).sort();

    return years.map(year => {
      const t1 = (p1.financialTimeline || []).find(t => t.year === year);
      const t2 = (p2.financialTimeline || []).find(t => t.year === year);
      return {
        year,
        [`${p1.name} (₹ Cr)`]: t1 ? t1.assets : null,
        [`${p2.name} (₹ Cr)`]: t2 ? t2.assets : null,
      };
    });
  }, [p1, p2]);

  // Chart 2: Legislative Performance Grouped Data
  const legislativeData = useMemo(() => {
    if (!p1 || !p2) return [];
    const act1 = p1.parliamentActivity;
    const act2 = p2.parliamentActivity;
    
    if (!act1 && !act2) return [];

    return [
      {
        metric: 'Attendance %',
        [p1.name]: act1 ? act1.attendance : 0,
        [p2.name]: act2 ? act2.attendance : 0,
      },
      {
        metric: 'Debates Count',
        [p1.name]: act1 ? act1.debatesCount : 0,
        [p2.name]: act2 ? act2.debatesCount : 0,
      },
      {
        metric: 'Questions Asked',
        [p1.name]: act1 ? act1.questionsCount : 0,
        [p2.name]: act2 ? act2.questionsCount : 0,
      },
      {
        metric: 'Bills Sponsored x10',
        [p1.name]: act1 ? act1.privateMemberBills * 10 : 0,
        [p2.name]: act2 ? act2.privateMemberBills * 10 : 0,
      }
    ];
  }, [p1, p2]);

  // Comparison Verdict
  const verdict = useMemo(() => {
    if (!p1 || !p2) return null;
    
    const scores = {
      score: p1.aiScore > p2.aiScore ? p1.name : p1.aiScore < p2.aiScore ? p2.name : 'Tie',
      fin: p1.integrityDetails.financialIntegrity > p2.integrityDetails.financialIntegrity ? p1.name : p1.integrityDetails.financialIntegrity < p2.integrityDetails.financialIntegrity ? p2.name : 'Tie',
      crim: p1.integrityDetails.criminalHistory > p2.integrityDetails.criminalHistory ? p1.name : p1.integrityDetails.criminalHistory < p2.integrityDetails.criminalHistory ? p2.name : 'Tie',
      pub: p1.integrityDetails.publicService > p2.integrityDetails.publicService ? p1.name : p1.integrityDetails.publicService < p2.integrityDetails.publicService ? p2.name : 'Tie',
    };

    return scores;
  }, [p1, p2]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 bg-bg-primary text-text-primary">
        <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin"></div>
        <p className="text-text-secondary font-mono text-sm tracking-wider uppercase animate-pulse">Loading Comparison Engine...</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
          <GitCompare className="text-accent-gold" size={32} />
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary uppercase tracking-tight">
              CIVIC COMPARISON ENGINE
            </h1>
            <p className="text-xs text-text-secondary">
              Direct head-to-head transparency overlays, ECI records comparisons, and legislative telemetry side-by-sides.
            </p>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Politician 1 Slot */}
          <div className="space-y-4 relative">
            <h2 className="text-xs uppercase tracking-wider text-text-secondary font-bold font-mono">Politician A</h2>
            
            {p1 ? (
              <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 relative flex items-center gap-4 hover:border-text-secondary transition-all">
                <button 
                  onClick={() => handleClearSlot(1)}
                  className="absolute top-3 right-3 text-text-secondary hover:text-danger-red transition-colors p-1"
                >
                  <X size={18} />
                </button>
                <div className="w-16 h-16 rounded-full overflow-hidden border border-border-subtle shrink-0">
                  <img src={p1.photoUrl} alt={p1.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-info-blue/15 text-info-blue border border-info-blue/20 px-2 py-0.5 rounded font-mono font-bold">
                      {p1.party}
                    </span>
                    <span className="text-[10px] font-sans text-text-secondary">{p1.state}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text-primary truncate">{p1.name}</h3>
                  <p className="text-xs text-text-secondary truncate">{p1.role || 'Representative'}</p>
                </div>
                <div className="shrink-0 pl-2">
                  <IntegrityScoreGauge score={p1.aiScore} size="sm" showLabel={false} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center border border-border-subtle bg-bg-secondary rounded-xl px-4 py-3 focus-within:border-accent-gold transition-colors">
                  <Search size={20} className="text-text-secondary mr-2" />
                  <input
                    type="text"
                    placeholder="Search representative name..."
                    value={query1}
                    onChange={(e) => {
                      setQuery1(e.target.value);
                      setShowDropdown1(true);
                    }}
                    onFocus={() => setShowDropdown1(true)}
                    className="bg-transparent border-none outline-none text-sm text-text-primary w-full"
                  />
                  {query1 && (
                    <button onClick={() => setQuery1('')} className="text-text-secondary">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {showDropdown1 && (
                  <div className="absolute left-0 right-0 mt-2 bg-bg-secondary border border-border-subtle rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-border-subtle/50">
                    {suggestions1.length === 0 ? (
                      <p className="p-4 text-xs text-text-secondary font-sans">No matching representatives found.</p>
                    ) : (
                      suggestions1.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(1, item.id)}
                          className="flex items-center justify-between p-3.5 hover:bg-bg-card cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border-subtle shrink-0">
                              <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-sm text-text-primary">{item.name}</h4>
                              <p className="text-[10px] text-text-secondary">{item.party} • {item.state} • {item.constituency}</p>
                            </div>
                          </div>
                          <Badge variant={item.aiScore >= 70 ? 'success' : item.aiScore >= 45 ? 'warning' : 'danger'}>
                            AI {item.aiScore}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Politician 2 Slot */}
          <div className="space-y-4 relative">
            <h2 className="text-xs uppercase tracking-wider text-text-secondary font-bold font-mono">Politician B</h2>
            
            {p2 ? (
              <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 relative flex items-center gap-4 hover:border-text-secondary transition-all">
                <button 
                  onClick={() => handleClearSlot(2)}
                  className="absolute top-3 right-3 text-text-secondary hover:text-danger-red transition-colors p-1"
                >
                  <X size={18} />
                </button>
                <div className="w-16 h-16 rounded-full overflow-hidden border border-border-subtle shrink-0">
                  <img src={p2.photoUrl} alt={p2.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-info-blue/15 text-info-blue border border-info-blue/20 px-2 py-0.5 rounded font-mono font-bold">
                      {p2.party}
                    </span>
                    <span className="text-[10px] font-sans text-text-secondary">{p2.state}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text-primary truncate">{p2.name}</h3>
                  <p className="text-xs text-text-secondary truncate">{p2.role || 'Representative'}</p>
                </div>
                <div className="shrink-0 pl-2">
                  <IntegrityScoreGauge score={p2.aiScore} size="sm" showLabel={false} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center border border-border-subtle bg-bg-secondary rounded-xl px-4 py-3 focus-within:border-accent-gold transition-colors">
                  <Search size={20} className="text-text-secondary mr-2" />
                  <input
                    type="text"
                    placeholder="Search representative name..."
                    value={query2}
                    onChange={(e) => {
                      setQuery2(e.target.value);
                      setShowDropdown2(true);
                    }}
                    onFocus={() => setShowDropdown2(true)}
                    className="bg-transparent border-none outline-none text-sm text-text-primary w-full"
                  />
                  {query2 && (
                    <button onClick={() => setQuery2('')} className="text-text-secondary">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {showDropdown2 && (
                  <div className="absolute left-0 right-0 mt-2 bg-bg-secondary border border-border-subtle rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-border-subtle/50">
                    {suggestions2.length === 0 ? (
                      <p className="p-4 text-xs text-text-secondary font-sans">No matching representatives found.</p>
                    ) : (
                      suggestions2.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(2, item.id)}
                          className="flex items-center justify-between p-3.5 hover:bg-bg-card cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border-subtle shrink-0">
                              <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-sm text-text-primary">{item.name}</h4>
                              <p className="text-[10px] text-text-secondary">{item.party} • {item.state} • {item.constituency}</p>
                            </div>
                          </div>
                          <Badge variant={item.aiScore >= 70 ? 'success' : item.aiScore >= 45 ? 'warning' : 'danger'}>
                            AI {item.aiScore}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Close search dropdowns on wrapper click */}
        {(showDropdown1 || showDropdown2) && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => {
              setShowDropdown1(false);
              setShowDropdown2(false);
            }}
          />
        )}

        {/* Dual Selected Workspace */}
        {p1 && p2 ? (
          <div className="space-y-12 pt-6">
            
            {/* KPI Grid */}
            <section className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-text-secondary font-bold font-mono border-b border-border-subtle pb-2">
                HEAD-TO-HEAD KPI MATRIX
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                
                {/* AI Score */}
                <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 space-y-2 text-center">
                  <span className="text-[10px] uppercase font-mono text-text-secondary tracking-wider block">AI Score</span>
                  <div className="flex items-center justify-center gap-3 font-mono text-base font-bold">
                    <span className={p1.aiScore >= p2.aiScore ? 'text-success-green' : 'text-text-secondary'}>{p1.aiScore}</span>
                    <span className="text-border-subtle">|</span>
                    <span className={p2.aiScore >= p1.aiScore ? 'text-success-green' : 'text-text-secondary'}>{p2.aiScore}</span>
                  </div>
                  <Badge variant={p1.aiScore >= p2.aiScore ? 'success' : 'default'} className="mx-auto block text-[8px] max-w-max uppercase">
                    {p1.aiScore >= p2.aiScore ? `${p1.party} +` : `${p2.party} +`}
                  </Badge>
                </div>

                {/* Declared Net Worth */}
                <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 space-y-2 text-center">
                  <span className="text-[10px] uppercase font-mono text-text-secondary tracking-wider block">Net Worth</span>
                  <div className="flex items-center justify-center gap-3 font-mono text-xs font-bold">
                    <span className={parseNetWorth(p1.netWorth) <= parseNetWorth(p2.netWorth) ? 'text-success-green' : 'text-text-secondary'}>₹{p1.netWorth}</span>
                    <span className="text-border-subtle">|</span>
                    <span className={parseNetWorth(p2.netWorth) <= parseNetWorth(p1.netWorth) ? 'text-success-green' : 'text-text-secondary'}>₹{p2.netWorth}</span>
                  </div>
                  <Badge variant="outline" className="mx-auto block text-[8px] max-w-max uppercase border-border-subtle">
                    Lower Preferred
                  </Badge>
                </div>

                {/* Criminal Cases */}
                <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 space-y-2 text-center">
                  <span className="text-[10px] uppercase font-mono text-text-secondary tracking-wider block">Criminal Cases</span>
                  <div className="flex items-center justify-center gap-3 font-mono text-base font-bold">
                    <span className={p1.criminalCases <= p2.criminalCases ? 'text-success-green' : 'text-danger-red'}>{p1.criminalCases}</span>
                    <span className="text-border-subtle">|</span>
                    <span className={p2.criminalCases <= p1.criminalCases ? 'text-success-green' : 'text-danger-red'}>{p2.criminalCases}</span>
                  </div>
                  <Badge variant="outline" className="mx-auto block text-[8px] max-w-max uppercase border-border-subtle">
                    Zero is Target
                  </Badge>
                </div>

                {/* Attendance */}
                <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 space-y-2 text-center">
                  <span className="text-[10px] uppercase font-mono text-text-secondary tracking-wider block">Attendance</span>
                  <div className="flex items-center justify-center gap-3 font-mono text-base font-bold">
                    <span className={(p1.parliamentActivity?.attendance || 0) >= (p2.parliamentActivity?.attendance || 0) ? 'text-success-green' : 'text-text-secondary'}>
                      {p1.parliamentActivity?.attendance || 'N/A'}%
                    </span>
                    <span className="text-border-subtle">|</span>
                    <span className={(p2.parliamentActivity?.attendance || 0) >= (p1.parliamentActivity?.attendance || 0) ? 'text-success-green' : 'text-text-secondary'}>
                      {p2.parliamentActivity?.attendance || 'N/A'}%
                    </span>
                  </div>
                  <Badge variant="outline" className="mx-auto block text-[8px] max-w-max uppercase border-border-subtle">
                    Session Avg 76%
                  </Badge>
                </div>

                {/* Asset Growth */}
                <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 space-y-2 text-center">
                  <span className="text-[10px] uppercase font-mono text-text-secondary tracking-wider block">Asset Growth</span>
                  <div className="flex items-center justify-center gap-3 font-mono text-base font-bold">
                    <span className={p1.netWorthGrowth <= p2.netWorthGrowth ? 'text-success-green' : 'text-text-secondary'}>
                      {p1.netWorthGrowth}%
                    </span>
                    <span className="text-border-subtle">|</span>
                    <span className={p2.netWorthGrowth <= p1.netWorthGrowth ? 'text-success-green' : 'text-text-secondary'}>
                      {p2.netWorthGrowth}%
                    </span>
                  </div>
                  <Badge variant="outline" className="mx-auto block text-[8px] max-w-max uppercase border-border-subtle">
                    Lower Growth
                  </Badge>
                </div>

                {/* Term Count */}
                <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 space-y-2 text-center">
                  <span className="text-[10px] uppercase font-mono text-text-secondary tracking-wider block">Experience</span>
                  <div className="flex items-center justify-center gap-3 font-mono text-base font-bold">
                    <span className={p1.termCount >= p2.termCount ? 'text-success-green' : 'text-text-secondary'}>
                      {p1.termCount} Terms
                    </span>
                    <span className="text-border-subtle">|</span>
                    <span className={p2.termCount >= p1.termCount ? 'text-success-green' : 'text-text-secondary'}>
                      {p2.termCount} Terms
                    </span>
                  </div>
                  <Badge variant="outline" className="mx-auto block text-[8px] max-w-max uppercase border-border-subtle">
                    Active Years
                  </Badge>
                </div>

              </div>
            </section>

            {/* Sub-Score Diverging Bar Comparisons */}
            <section className="space-y-6 bg-bg-secondary border border-border-subtle rounded-2xl p-6">
              <h3 className="text-sm uppercase tracking-wider text-text-secondary font-bold font-mono border-b border-border-subtle pb-2">
                INTEGRITY COMPASS SUB-SCORE DIRECT COMPASS
              </h3>
              
              <div className="space-y-6">
                
                {/* Financial Integrity */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-accent-gold">{p1.name}: {p1.integrityDetails.financialIntegrity}/100</span>
                    <span className="uppercase text-text-secondary tracking-wider font-semibold">Financial Integrity Index</span>
                    <span className="font-bold text-info-blue">{p2.name}: {p2.integrityDetails.financialIntegrity}/100</span>
                  </div>
                  <div className="h-3 flex bg-bg-primary rounded-full overflow-hidden border border-border-subtle/50 relative">
                    <div 
                      className="h-full bg-accent-gold ml-auto"
                      style={{ width: `${p1.integrityDetails.financialIntegrity / 2}%` }}
                    />
                    <div className="w-1 bg-border-subtle h-full z-10" />
                    <div 
                      className="h-full bg-info-blue"
                      style={{ width: `${p2.integrityDetails.financialIntegrity / 2}%` }}
                    />
                  </div>
                </div>

                {/* Public Service */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-accent-gold">{p1.name}: {p1.integrityDetails.publicService}/100</span>
                    <span className="uppercase text-text-secondary tracking-wider font-semibold">Public Service & Legislative participation</span>
                    <span className="font-bold text-info-blue">{p2.name}: {p2.integrityDetails.publicService}/100</span>
                  </div>
                  <div className="h-3 flex bg-bg-primary rounded-full overflow-hidden border border-border-subtle/50 relative">
                    <div 
                      className="h-full bg-accent-gold ml-auto"
                      style={{ width: `${p1.integrityDetails.publicService / 2}%` }}
                    />
                    <div className="w-1 bg-border-subtle h-full z-10" />
                    <div 
                      className="h-full bg-info-blue"
                      style={{ width: `${p2.integrityDetails.publicService / 2}%` }}
                    />
                  </div>
                </div>

                {/* Criminal History */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-accent-gold">{p1.name}: {p1.integrityDetails.criminalHistory}/100</span>
                    <span className="uppercase text-text-secondary tracking-wider font-semibold">Criminal History Compliance</span>
                    <span className="font-bold text-info-blue">{p2.name}: {p2.integrityDetails.criminalHistory}/100</span>
                  </div>
                  <div className="h-3 flex bg-bg-primary rounded-full overflow-hidden border border-border-subtle/50 relative">
                    <div 
                      className="h-full bg-accent-gold ml-auto"
                      style={{ width: `${p1.integrityDetails.criminalHistory / 2}%` }}
                    />
                    <div className="w-1 bg-border-subtle h-full z-10" />
                    <div 
                      className="h-full bg-info-blue"
                      style={{ width: `${p2.integrityDetails.criminalHistory / 2}%` }}
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* Recharts Visual Overlay Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Timeline chart */}
              <Card className="bg-bg-secondary border-border-subtle">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle/50 pb-3">
                    <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-text-primary flex items-center gap-2">
                      <TrendingUp size={16} className="text-accent-gold" /> Declared Asset Timelines (₹ Crores)
                    </h4>
                  </div>
                  
                  {mergedTimelineData.length === 0 ? (
                    <p className="text-xs text-text-secondary font-mono">No historical financial timelines indexable.</p>
                  ) : (
                    <div className="h-80 w-full font-mono text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mergedTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="p1Grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#D4A017" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="p2Grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3182CE" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3182CE" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                          <XAxis dataKey="year" stroke="#718096" />
                          <YAxis stroke="#718096" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1A202C', borderColor: '#2D3748', color: '#E2E8F0' }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey={`${p1.name} (₹ Cr)`} 
                            stroke="#D4A017" 
                            fillOpacity={1} 
                            fill="url(#p1Grad)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey={`${p2.name} (₹ Cr)`} 
                            stroke="#3182CE" 
                            fillOpacity={1} 
                            fill="url(#p2Grad)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Legislative Performance Chart */}
              <Card className="bg-bg-secondary border-border-subtle">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle/50 pb-3">
                    <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-text-primary flex items-center gap-2">
                      <BookOpen size={16} className="text-accent-gold" /> Legislative session stats comparison
                    </h4>
                  </div>
                  
                  {legislativeData.length === 0 ? (
                    <p className="text-xs text-text-secondary font-mono">No parliament participation details indexable.</p>
                  ) : (
                    <div className="h-80 w-full font-mono text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={legislativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                          <XAxis dataKey="metric" stroke="#718096" />
                          <YAxis stroke="#718096" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1A202C', borderColor: '#2D3748', color: '#E2E8F0' }}
                          />
                          <Legend />
                          <Bar dataKey={p1.name} fill="#D4A017" radius={[4, 4, 0, 0]} />
                          <Bar dataKey={p2.name} fill="#3182CE" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Criminal burden listing */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Politician 1 */}
              <Card className="bg-bg-secondary border-border-subtle">
                <CardContent className="pt-6 space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <Scale size={20} className="text-accent-gold" />
                    <h4 className="font-heading font-bold text-sm text-text-primary uppercase truncate">{p1.name} Criminal Burden</h4>
                  </div>
                  
                  {p1.criminalCases === 0 ? (
                    <div className="flex items-center gap-2 text-success-green bg-success-green/10 border border-success-green/20 rounded-xl p-4">
                      <CheckCircle2 size={20} />
                      <span className="text-xs font-mono font-bold">✅ EXTRANEOUS SCANS REVEAL PRISTINE CRIMINAL COMPLIANCE</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-danger-red/10 border border-danger-red/20 rounded-xl p-4 flex items-center gap-2.5 text-danger-red">
                        <AlertTriangle size={20} />
                        <span className="text-xs font-mono font-bold">{p1.criminalCases} ACTIVE COURT CASES DISCLOSED</span>
                      </div>
                      <div className="space-y-2">
                        {p1.criminalCaseList?.slice(0, 3).map((c, i) => (
                          <div key={i} className="bg-bg-primary border border-border-subtle rounded-xl p-3.5 space-y-1.5 text-xs">
                            <div className="flex justify-between font-mono font-bold text-[10px]">
                              <span className="text-text-primary">{c.caseNumber}</span>
                              <span className="text-danger-red">{c.status.toUpperCase()}</span>
                            </div>
                            <p className="text-text-secondary leading-relaxed font-sans">{c.court}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {c.charges.map((ch, idx) => (
                                <Badge key={idx} variant="danger" className="text-[8px] py-0 px-1 font-sans">{ch}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Politician 2 */}
              <Card className="bg-bg-secondary border-border-subtle">
                <CardContent className="pt-6 space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <Scale size={20} className="text-info-blue" />
                    <h4 className="font-heading font-bold text-sm text-text-primary uppercase truncate">{p2.name} Criminal Burden</h4>
                  </div>
                  
                  {p2.criminalCases === 0 ? (
                    <div className="flex items-center gap-2 text-success-green bg-success-green/10 border border-success-green/20 rounded-xl p-4">
                      <CheckCircle2 size={20} />
                      <span className="text-xs font-mono font-bold">✅ EXTRANEOUS SCANS REVEAL PRISTINE CRIMINAL COMPLIANCE</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-danger-red/10 border border-danger-red/20 rounded-xl p-4 flex items-center gap-2.5 text-danger-red">
                        <AlertTriangle size={20} />
                        <span className="text-xs font-mono font-bold">{p2.criminalCases} ACTIVE COURT CASES DISCLOSED</span>
                      </div>
                      <div className="space-y-2">
                        {p2.criminalCaseList?.slice(0, 3).map((c, i) => (
                          <div key={i} className="bg-bg-primary border border-border-subtle rounded-xl p-3.5 space-y-1.5 text-xs">
                            <div className="flex justify-between font-mono font-bold text-[10px]">
                              <span className="text-text-primary">{c.caseNumber}</span>
                              <span className="text-danger-red">{c.status.toUpperCase()}</span>
                            </div>
                            <p className="text-text-secondary leading-relaxed font-sans">{c.court}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {c.charges.map((ch, idx) => (
                                <Badge key={idx} variant="danger" className="text-[8px] py-0 px-1 font-sans">{ch}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </section>

            {/* AI Verdict Banner */}
            {verdict && (
              <section className="bg-gradient-to-r from-bg-secondary via-bg-card to-bg-secondary border border-border-subtle rounded-2xl p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center p-2.5 bg-accent-gold/15 rounded-full text-accent-gold">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text-primary uppercase tracking-wider">
                  AI CIVIC INTEGRITY OVERVIEW VERDICT
                </h3>
                <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-[10px] text-text-secondary pt-2">
                  <div className="border border-border-subtle/50 bg-bg-primary/55 rounded-xl p-3 space-y-1">
                    <span>OVERALL RATING</span>
                    <strong className="text-accent-gold block text-xs mt-1 uppercase">{verdict.score}</strong>
                  </div>
                  <div className="border border-border-subtle/50 bg-bg-primary/55 rounded-xl p-3 space-y-1">
                    <span>FINANCIAL COMPLIANCE</span>
                    <strong className="text-accent-gold block text-xs mt-1 uppercase">{verdict.fin}</strong>
                  </div>
                  <div className="border border-border-subtle/50 bg-bg-primary/55 rounded-xl p-3 space-y-1">
                    <span>CRIMINAL COMPLIANCE</span>
                    <strong className="text-accent-gold block text-xs mt-1 uppercase">{verdict.crim}</strong>
                  </div>
                  <div className="border border-border-subtle/50 bg-bg-primary/55 rounded-xl p-3 space-y-1">
                    <span>PUBLIC TELEMETRY</span>
                    <strong className="text-accent-gold block text-xs mt-1 uppercase">{verdict.pub}</strong>
                  </div>
                </div>
              </section>
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-bg-secondary border border-border-subtle rounded-2xl p-8">
            <GitCompare size={48} className="text-text-secondary/40 animate-pulse" />
            <h3 className="font-heading font-bold text-lg text-text-secondary uppercase">Awaiting Comparison Inputs</h3>
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed font-sans">
              Select two public representatives using the search inputs above to overlay their ECI disclosures, asset charts, and legislative telemetry.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('p1', 'scraped-1');
                  newParams.set('p2', 'scraped-2');
                  setSearchParams(newParams);
                }}
                className="bg-bg-card hover:bg-bg-primary border border-border-subtle px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold text-accent-gold transition-colors"
              >
                COMPARE MODI VS FADNAVIS
              </button>
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('p1', 'scraped-2');
                  newParams.set('p2', 'scraped-3');
                  setSearchParams(newParams);
                }}
                className="bg-bg-card hover:bg-bg-primary border border-border-subtle px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold text-accent-gold transition-colors"
              >
                COMPARE FADNAVIS VS SHIVAKUMAR
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Compare;
