import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  AlertTriangle, 
  Scale, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  User,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { usePoliticians } from '../hooks/usePoliticians';
import type { DetailedPoliticianData } from '../data/politicians';
import { IntegrityScoreGauge } from '../components/ui/IntegrityScoreGauge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type LeaderboardType = 'integrity-leaders' | 'integrity-concerns' | 'asset-spikes' | 'criminal-burden' | 'assembly-devotion';

const Rankings = () => {
  const { data: politicians = [], isLoading } = usePoliticians();
  const [activeBoard, setActiveBoard] = useState<LeaderboardType>('integrity-leaders');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedParty, setSelectedParty] = useState('all');

  // Extract unique states and parties for filtering
  const uniqueStates = useMemo(() => {
    return ['all', ...Array.from(new Set(politicians.map(p => p.state)))];
  }, [politicians]);

  const uniqueParties = useMemo(() => {
    return ['all', ...Array.from(new Set(politicians.map(p => p.party)))];
  }, [politicians]);

  const handleResetFilters = () => {
    setSelectedState('all');
    setSelectedParty('all');
  };

  // Convert Net Worth string (e.g. "45Cr", "50Lakh") to numerical Crores
  const parseNetWorth = (val: string | number | undefined | null): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    const clean = val.replace(/[₹\s,]/g, '').toLowerCase();
    const match = clean.match(/([\d.]+)(cr|lakh|l)?/);
    if (!match) return 0;
    const num = parseFloat(match[1]);
    const unit = match[2];
    if (unit === 'cr') return num;
    if (unit === 'lakh' || unit === 'l') return num / 100;
    return num;
  };

  // Filtered & Sorted politicians based on active board
  const rankedData = useMemo(() => {
    let data = [...politicians];

    // Filter by State and Party first
    if (selectedState !== 'all') {
      data = data.filter(p => p.state === selectedState);
    }
    if (selectedParty !== 'all') {
      data = data.filter(p => p.party === selectedParty);
    }

    // Sort based on active board
    switch (activeBoard) {
      case 'integrity-leaders':
        return data.sort((a, b) => b.aiScore - a.aiScore); // Highest integrity first
      case 'integrity-concerns':
        return data.sort((a, b) => a.aiScore - b.aiScore); // Lowest integrity first (highest risk)
      case 'asset-spikes':
        return data.sort((a, b) => b.netWorthGrowth - a.netWorthGrowth); // Highest growth first
      case 'criminal-burden':
        return data.sort((a, b) => b.criminalCases - a.criminalCases); // Highest cases first
      case 'assembly-devotion':
        return data
          .filter(p => p.attendancePct !== undefined)
          .sort((a, b) => (b.attendancePct || 0) - (a.attendancePct || 0)); // Highest attendance first
      default:
        return data;
    }
  }, [activeBoard, selectedState, selectedParty, politicians]);

  // Top 3 Podium Winners
  const podium = useMemo(() => {
    if (rankedData.length >= 3) {
      // Return 2nd, 1st, 3rd for standard visual order on a podium
      return [rankedData[1], rankedData[0], rankedData[2]];
    }
    return [];
  }, [rankedData]);

  // Remaining list below podium
  const remainingList = useMemo(() => {
    return rankedData.length >= 3 ? rankedData.slice(3) : rankedData;
  }, [rankedData]);

  // Visual labels & descriptions for active board
  const boardMeta = useMemo(() => {
    switch (activeBoard) {
      case 'integrity-leaders':
        return {
          title: 'INTEGRITY CHAMPIONS',
          description: 'Elected representatives with the highest AI Transparency and Integrity scores, reflecting clean administrative, financial, and criminal profiles.',
          metricName: 'AI Integrity Score',
          accentColor: 'text-success-green',
          icon: Trophy
        };
      case 'integrity-concerns':
        return {
          title: 'SYSTEMIC TRANSPARENCY RISK ALERT',
          description: 'Representatives flagged with the lowest AI Integrity scores, indicating severe density of active court proceedings, assets growth spikes, or ED probes.',
          metricName: 'AI Integrity Score',
          accentColor: 'text-danger-red',
          icon: ShieldAlert
        };
      case 'asset-spikes':
        return {
          title: 'RELATIVE ASSET GROWTH SPIKES',
          description: 'Politicians displaying the highest declared asset growth rates between standard electoral terms, adjusted against national inflation benchmarks.',
          metricName: 'Asset Growth %',
          accentColor: 'text-warning-amber',
          icon: TrendingUp
        };
      case 'criminal-burden':
        return {
          title: 'HIGH DENSITY CRIMINAL BURDEN',
          description: 'Representatives indexed with the largest volume of declared pending criminal cases, severe court indictments, and active charge sheets.',
          metricName: 'Criminal Cases',
          accentColor: 'text-danger-red',
          icon: Scale
        };
      case 'assembly-devotion':
        return {
          title: 'LEGISLATIVE ASSEMBLY SESSION DEVOTION',
          description: 'Representatives with the highest session attendance records, showing regular participation in debate, private bills, and constituent grievances.',
          metricName: 'Session Attendance',
          accentColor: 'text-info-blue',
          icon: Calendar
        };
    }
  }, [activeBoard]);

  // Helper to render metric values beautifully
  const renderMetricValue = (politician: DetailedPoliticianData) => {
    switch (activeBoard) {
      case 'integrity-leaders':
      case 'integrity-concerns':
        return (
          <div className="flex items-center gap-2 font-mono">
            <IntegrityScoreGauge score={politician.aiScore} size="sm" showLabel={false} />
            <strong className="text-sm">{politician.aiScore}/100</strong>
          </div>
        );
      case 'asset-spikes':
        return (
          <span className="font-mono text-sm font-bold text-danger-red flex items-center gap-1">
            <TrendingUp size={14} /> +{politician.netWorthGrowth}%
          </span>
        );
      case 'criminal-burden':
        return (
          <span className="font-mono text-sm font-bold text-danger-red">
            {politician.criminalCases} Cases
          </span>
        );
      case 'assembly-devotion':
        return (
          <span className="font-mono text-sm font-bold text-info-blue">
            {politician.attendancePct}% Attendance
          </span>
        );
    }
  };

  const ActiveIcon = boardMeta.icon;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      
      {/* Page Header */}
      <div className="border-b border-border-subtle pb-6 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Trophy className="text-accent-gold" size={32} />
            CIVIC TRANSPARENCY LEADERBOARDS
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl font-sans">
            Indexed transparency rankings calculated dynamically based on asset filings, active judicial criminal proceedings, and assembly telemetry.
          </p>
        </div>

        <span className="text-[10px] font-mono text-text-secondary bg-bg-secondary border border-border-subtle px-2.5 py-1 rounded shadow">
          DECISION TELEMETRY: LEVEL 1 ACTIVE
        </span>
      </div>

      {/* Leaderboard Selectors (Tabs) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 bg-bg-secondary/40 border border-border-subtle rounded-xl p-1.5 shrink-0">
        <button
          onClick={() => setActiveBoard('integrity-leaders')}
          className={`px-3 py-3 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeBoard === 'integrity-leaders' 
              ? 'bg-bg-card border border-border-subtle text-success-green shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Crown size={14} /> Integrity leaders
        </button>
        <button
          onClick={() => setActiveBoard('integrity-concerns')}
          className={`px-3 py-3 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeBoard === 'integrity-concerns' 
              ? 'bg-bg-card border border-border-subtle text-danger-red shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <ShieldAlert size={14} /> Risk alerts
        </button>
        <button
          onClick={() => setActiveBoard('asset-spikes')}
          className={`px-3 py-3 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeBoard === 'asset-spikes' 
              ? 'bg-bg-card border border-border-subtle text-warning-amber shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <TrendingUp size={14} /> Asset Spikes
        </button>
        <button
          onClick={() => setActiveBoard('criminal-burden')}
          className={`px-3 py-3 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeBoard === 'criminal-burden' 
              ? 'bg-bg-card border border-border-subtle text-danger-red shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Scale size={14} /> Criminal Burden
        </button>
        <button
          onClick={() => setActiveBoard('assembly-devotion')}
          className={`px-3 py-3 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 col-span-2 md:col-span-1 ${
            activeBoard === 'assembly-devotion' 
              ? 'bg-bg-card border border-border-subtle text-info-blue shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Calendar size={14} /> Assembly Devotion
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2 font-sans">
          <Filter size={14} className="text-accent-gold" />
          <span className="text-text-secondary uppercase font-bold tracking-wider text-xs">Filter Rankings:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* State Filter */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">STATE:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-bg-card border border-border-subtle text-text-primary rounded px-2 py-1.5 focus:outline-none focus:border-accent-gold text-xs"
            >
              <option value="all">All States</option>
              {uniqueStates.filter(s => s !== 'all').map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Party Filter */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">PARTY:</span>
            <select
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="bg-bg-card border border-border-subtle text-text-primary rounded px-2 py-1.5 focus:outline-none focus:border-accent-gold text-xs"
            >
              <option value="all">All Parties</option>
              {uniqueParties.filter(p => p !== 'all').map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetFilters} 
            className="text-[10px] py-1 border-border-subtle text-text-secondary hover:text-text-primary"
          >
            <RotateCcw size={10} className="mr-1" /> Reset Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
          <h3 className="font-heading text-lg font-bold text-text-secondary uppercase">CALCULATING LEADERBOARD SCORES...</h3>
        </div>
      ) : (
        <>
          {/* Description Meta */}
          <div className="bg-bg-card border border-border-subtle rounded-xl p-5 flex items-start gap-4 shrink-0">
            <div className={`p-2.5 rounded-lg bg-bg-secondary border border-border-subtle shrink-0 ${boardMeta.accentColor}`}>
              <ActiveIcon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary tracking-wide uppercase">
                {boardMeta.title}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mt-1 font-sans">
                {boardMeta.description}
              </p>
            </div>
          </div>

          {/* podium view (Rendered only if at least 3 items exist in filter) */}
          {podium.length === 3 ? (
            <section className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-bold text-center">
                ♛ LEADERBOARD PODIUM HIGHLIGHTS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
                
                {/* 2nd Place (Silver Medal) - Rendered Left */}
                <div className="flex flex-col items-center group order-2 md:order-1 mt-6">
                  <Link to={`/politician/${podium[0].id}`} className="w-full text-center">
                    <div className="relative rounded-2xl border border-border-subtle bg-bg-card/40 hover:bg-bg-card hover:border-text-secondary transition-all p-5 space-y-3.5 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#A0A0A0] relative shadow bg-bg-secondary">
                        <img src={podium[0].photoUrl} alt={podium[0].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-0 right-0 bg-[#A0A0A0] text-bg-primary font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">2</span>
                      </div>
                      <div>
                        <h4 className="font-heading text-base font-bold text-text-primary truncate group-hover:text-accent-gold">{podium[0].name}</h4>
                        <p className="text-[10px] text-text-secondary">{podium[0].role} • {podium[0].party}</p>
                        <p className="text-xs text-text-secondary font-mono">{podium[0].state}</p>
                      </div>
                      <div className="bg-bg-secondary px-3 py-1.5 rounded-lg border border-border-subtle w-full text-center font-mono">
                        {renderMetricValue(podium[0])}
                      </div>
                    </div>
                  </Link>
                  {/* Pedestal pedestal */}
                  <div className="w-full bg-[#1C2128]/50 border-t border-border-subtle/80 h-10 mt-2 rounded-t-lg flex items-center justify-center font-mono text-sm font-bold text-[#A0A0A0]">
                    SILVER MEDAL
                  </div>
                </div>

                {/* 1st Place (Gold Medal / Crown) - Rendered Center (Highest) */}
                <div className="flex flex-col items-center group order-1 md:order-2">
                  <Link to={`/politician/${podium[1].id}`} className="w-full text-center">
                    <div className="relative rounded-2xl border border-accent-gold/40 bg-bg-card hover:border-accent-gold transition-all p-6 space-y-4 flex flex-col items-center ring-1 ring-accent-gold/10">
                      <Crown className="text-accent-gold animate-bounce absolute top-[-16px] z-10" size={24} />
                      
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent-gold relative shadow-lg bg-bg-secondary">
                        <img src={podium[1].photoUrl} alt={podium[1].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-0 right-0 bg-accent-gold text-bg-primary font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center">1</span>
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-bold text-text-primary truncate group-hover:text-accent-gold">{podium[1].name}</h4>
                        <p className="text-xs text-text-secondary font-bold">{podium[1].role} • {podium[1].party}</p>
                        <p className="text-xs text-text-secondary font-mono mt-0.5">{podium[1].state}</p>
                      </div>
                      <div className="bg-bg-secondary px-3.5 py-2 rounded-lg border border-border-subtle w-full text-center font-mono ring-1 ring-accent-gold/5">
                        {renderMetricValue(podium[1])}
                      </div>
                    </div>
                  </Link>
                  {/* Pedestal pedestal */}
                  <div className="w-full bg-bg-card border-t border-accent-gold/40 h-16 mt-2 rounded-t-lg flex items-center justify-center font-mono text-base font-bold text-accent-gold">
                    GOLD CHAMPION
                  </div>
                </div>

                {/* 3rd Place (Bronze Medal) - Rendered Right */}
                <div className="flex flex-col items-center group order-3 mt-12">
                  <Link to={`/politician/${podium[2].id}`} className="w-full text-center">
                    <div className="relative rounded-2xl border border-border-subtle bg-bg-card/40 hover:bg-bg-card hover:border-text-secondary transition-all p-5 space-y-3.5 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#CD7F32] relative shadow bg-bg-secondary">
                        <img src={podium[2].photoUrl} alt={podium[2].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-0 right-0 bg-[#CD7F32] text-bg-primary font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
                      </div>
                      <div>
                        <h4 className="font-heading text-base font-bold text-text-primary truncate group-hover:text-accent-gold">{podium[2].name}</h4>
                        <p className="text-[10px] text-text-secondary">{podium[2].role} • {podium[2].party}</p>
                        <p className="text-xs text-text-secondary font-mono">{podium[2].state}</p>
                      </div>
                      <div className="bg-bg-secondary px-3 py-1.5 rounded-lg border border-border-subtle w-full text-center font-mono">
                        {renderMetricValue(podium[2])}
                      </div>
                    </div>
                  </Link>
                  {/* Pedestal pedestal */}
                  <div className="w-full bg-[#1C2128]/50 border-t border-border-subtle/80 h-8 mt-2 rounded-t-lg flex items-center justify-center font-mono text-xs font-bold text-[#CD7F32]">
                    BRONZE MEDAL
                  </div>
                </div>

              </div>
            </section>
          ) : null}

          {/* Complete Rankings list Table (Dense Table Layout) */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-bold">
              ⌨ COMPLETE INDEXED LEADERBOARD
            </h3>
            
            {rankedData.length === 0 ? (
              <div className="bg-bg-card border border-border-subtle rounded-xl p-12 text-center space-y-3.5">
                <ShieldAlert size={48} className="text-warning-amber mx-auto" />
                <div>
                  <h3 className="font-heading text-base font-bold text-text-primary">NO DATA IN ACTIVE CONSTRAINTS</h3>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed mt-1 font-sans">
                    No indexed politician fits these State and Party filters. Reset filtering coordinates.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="bg-bg-card rounded-xl border border-border-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-secondary border-b border-border-subtle font-mono text-[10px] tracking-wider text-text-secondary uppercase">
                        <th className="py-4 px-4 text-center w-16">Rank</th>
                        <th className="py-4 px-6">Representative</th>
                        <th className="py-4 px-4">Political Party</th>
                        <th className="py-4 px-4">State Location</th>
                        <th className="py-4 px-4 text-right pr-6">{boardMeta.metricName.toUpperCase()}</th>
                        <th className="py-4 px-4 text-center w-16">Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/40 text-xs">
                      {rankedData.map((politician, index) => {
                        const rank = index + 1;
                        return (
                          <tr 
                            key={politician.id}
                            className="hover:bg-bg-secondary/40 transition-colors group cursor-pointer"
                            onClick={() => window.location.href = `/politician/${politician.id}`}
                          >
                            {/* Rank position */}
                            <td className="py-3.5 px-4 text-center font-mono">
                              {rank === 1 ? <Crown size={16} className="text-accent-gold mx-auto" /> :
                               rank === 2 ? <span className="font-bold text-[#A0A0A0]">#2</span> :
                               rank === 3 ? <span className="font-bold text-[#CD7F32]">#3</span> :
                               <span className="text-text-secondary">#{rank}</span>}
                            </td>
                            
                            {/* Representative Profile card snippet */}
                            <td className="py-3.5 px-6 font-sans">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-bg-secondary border border-border-subtle overflow-hidden shrink-0">
                                  <img src={politician.photoUrl} alt={politician.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-text-primary group-hover:text-accent-gold transition-colors truncate">
                                    {politician.name}
                                  </p>
                                  <p className="text-[10px] text-text-secondary truncate mt-0.5">
                                    {politician.role} • {politician.constituency}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Political Party */}
                            <td className="py-3.5 px-4 font-mono font-bold">
                              <span className="bg-bg-secondary border border-border-subtle/80 px-2 py-0.5 rounded text-[10px] text-text-primary">
                                {politician.party}
                              </span>
                            </td>

                            {/* State */}
                            <td className="py-3.5 px-4 text-text-secondary font-medium">
                              {politician.state}
                            </td>

                            {/* Metric Value */}
                            <td className="py-3.5 px-4 text-right pr-6 font-mono font-bold">
                              {renderMetricValue(politician)}
                            </td>

                            {/* Action CTA link */}
                            <td className="py-3.5 px-4 text-center">
                              <Link 
                                to={`/politician/${politician.id}`}
                                className="text-text-secondary group-hover:text-accent-gold transition-colors inline-block"
                                onClick={(e) => e.stopPropagation()} // Prevent double trigger due to tr click
                              >
                                <ChevronRight size={16} />
                              </Link>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </>
      )}

    </div>
  );
};

export default Rankings;
