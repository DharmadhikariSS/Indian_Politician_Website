import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  User, 
  Scale, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { usePoliticians } from '../hooks/usePoliticians';
import type { DetailedPoliticianData } from '../data/politicians';
import { IntegrityScoreGauge } from '../components/ui/IntegrityScoreGauge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const Browse = () => {
  const { data: politicians = [], isLoading } = usePoliticians();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'all';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedParty, setSelectedParty] = useState('all');
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedScoreBracket, setSelectedScoreBracket] = useState('all'); // all, red (0-40), amber (41-70), green (71-100)
  const [selectedCriminal, setSelectedCriminal] = useState('all'); // all, clean (0), has-cases (>0), severe (>=4)
  const [selectedNetWorth, setSelectedNetWorth] = useState('all'); // all, under-1, 1-10, 10-100, 100-plus
  const [activeFlags, setActiveFlags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('aiScore-asc'); // aiScore-asc, aiScore-desc, netWorth-desc, criminal-desc, attendance-desc

  // Selected Politician for the right-hand preview panel
  const [selectedId, setSelectedId] = useState<string>('');

  // Synchronize state if URL query parameter changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  // Extract unique values for filter dropdowns
  const uniqueStates = useMemo(() => {
    return ['all', ...Array.from(new Set(politicians.map(p => p.state)))];
  }, [politicians]);

  const uniqueParties = useMemo(() => {
    return ['all', ...Array.from(new Set(politicians.map(p => p.party)))];
  }, [politicians]);

  const uniqueRoles = useMemo(() => {
    return ['all', ...Array.from(new Set(politicians.map(p => p.role)))];
  }, [politicians]);

  // Flags list
  const availableFlags = [
    { key: 'edRaid', label: 'ED Raid', icon: AlertTriangle, color: 'text-warning-amber' },
    { key: 'convicted', label: 'Convicted', icon: AlertTriangle, color: 'text-danger-red' },
    { key: 'offshoreLink', label: 'Offshore Link', icon: Building2, color: 'text-info-blue' },
    { key: 'cronyism', label: 'Cronyism', icon: Building2, color: 'text-accent-gold' },
    { key: 'goodWork', label: 'Good Work', icon: CheckCircle2, color: 'text-success-green' }
  ];

  const handleToggleFlag = (flagKey: string) => {
    if (activeFlags.includes(flagKey)) {
      setActiveFlags(activeFlags.filter(f => f !== flagKey));
    } else {
      setActiveFlags([...activeFlags, flagKey]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedState('all');
    setSelectedParty('all');
    setSelectedRole('all');
    setSelectedScoreBracket('all');
    setSelectedCriminal('all');
    setSelectedNetWorth('all');
    setActiveFlags([]);
    setSortBy('aiScore-asc');
    setSearchParams({});
  };

  // Convert Net Worth string (e.g. "45Cr", "0.12Cr") to numerical Crores for range comparison
  const getNetWorthInCrores = (netWorthStr: string): number => {
    const numericPart = parseFloat(netWorthStr.replace(/[^\d.-]/g, ''));
    return isNaN(numericPart) ? 0 : numericPart;
  };

  // Filter & Sort Logic
  const filteredPoliticians = useMemo(() => {
    return politicians
      .filter(politician => {
        // Text Search (Name, State, Constituency, Party)
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          const matchName = politician.name.toLowerCase().includes(query);
          const matchState = politician.state.toLowerCase().includes(query);
          const matchConstituency = politician.constituency.toLowerCase().includes(query);
          const matchParty = politician.party.toLowerCase().includes(query);
          const matchRole = politician.role.toLowerCase().includes(query);
          if (!matchName && !matchState && !matchConstituency && !matchParty && !matchRole) {
            return false;
          }
        }

        // Dropdown Filters
        if (selectedState !== 'all' && politician.state !== selectedState) return false;
        if (selectedParty !== 'all' && politician.party !== selectedParty) return false;
        
        // Handle specific role matching
        if (selectedRole !== 'all') {
          if (politician.role !== selectedRole) return false;
        }

        // AI Score Bracket
        if (selectedScoreBracket !== 'all') {
          const score = politician.aiScore;
          if (selectedScoreBracket === 'red' && score > 40) return false;
          if (selectedScoreBracket === 'amber' && (score <= 40 || score > 70)) return false;
          if (selectedScoreBracket === 'green' && score <= 70) return false;
        }

        // Criminal Cases
        if (selectedCriminal !== 'all') {
          const cases = politician.criminalCases;
          if (selectedCriminal === 'clean' && cases > 0) return false;
          if (selectedCriminal === 'has-cases' && cases === 0) return false;
          if (selectedCriminal === 'severe' && cases < 4) return false;
        }

        // Net Worth Brackets
        if (selectedNetWorth !== 'all') {
          const crores = getNetWorthInCrores(politician.netWorth);
          if (selectedNetWorth === 'under-1' && crores >= 1) return false;
          if (selectedNetWorth === '1-10' && (crores < 1 || crores > 10)) return false;
          if (selectedNetWorth === '10-100' && (crores < 10 || crores > 100)) return false;
          if (selectedNetWorth === '100-plus' && crores < 100) return false;
        }

        // Active Flags (AND logic)
        for (const flag of activeFlags) {
          if (!politician.flags[flag as keyof typeof politician.flags]) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === 'aiScore-asc') {
          return a.aiScore - b.aiScore; // Riskiest first
        }
        if (sortBy === 'aiScore-desc') {
          return b.aiScore - a.aiScore; // Cleanest first
        }
        if (sortBy === 'netWorth-desc') {
          return getNetWorthInCrores(b.netWorth) - getNetWorthInCrores(a.netWorth);
        }
        if (sortBy === 'criminal-desc') {
          return b.criminalCases - a.criminalCases;
        }
        if (sortBy === 'attendance-desc') {
          return (b.attendancePct || 0) - (a.attendancePct || 0);
        }
        return 0;
      });
  }, [
    searchQuery,
    selectedState,
    selectedParty,
    selectedRole,
    selectedScoreBracket,
    selectedCriminal,
    selectedNetWorth,
    activeFlags,
    sortBy,
    politicians
  ]);

  // Set default selected politician on filter change
  useEffect(() => {
    if (filteredPoliticians.length > 0) {
      // Keep selected if still in the list, otherwise select the first one
      const exists = filteredPoliticians.some(p => p.id === selectedId);
      if (!exists) {
        setSelectedId(filteredPoliticians[0].id);
      }
    } else {
      setSelectedId('');
    }
  }, [filteredPoliticians, selectedId]);

  // Find the selected politician data
  const selectedPolitician = useMemo(() => {
    return politicians.find(p => p.id === selectedId);
  }, [selectedId, politicians]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Search Header Banner */}
      <div className="bg-bg-secondary border-b border-border-subtle p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-accent-gold" />
            VOTER DECISION HUB • TELEMETRY CENTER
          </h1>
          <p className="text-xs text-text-secondary">
            Live sorting and analytical assessment framework for {politicians.length} indexed public representatives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by name, state, constituency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-card border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm font-sans focus:outline-none focus:border-accent-gold transition-colors text-text-primary"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetFilters} 
            className="text-xs flex items-center gap-1 border-border-subtle"
          >
            <RotateCcw size={12} /> Reset
          </Button>
        </div>
      </div>

      {/* 3-Panel Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* PANEL 1: Left Filters Sidebar (Scrollable) */}
        <aside className="w-80 bg-bg-secondary/60 border-r border-border-subtle overflow-y-auto hidden lg:block p-5 space-y-6 shrink-0">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-sm uppercase tracking-wider text-text-secondary font-bold flex items-center gap-2">
              <Filter size={14} className="text-accent-gold" /> Filter Parameters
            </h2>
            <span className="text-[10px] bg-bg-card border border-border-subtle text-accent-gold px-2 py-0.5 rounded font-mono">
              ACTIVE
            </span>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="text-xs uppercase text-text-secondary font-bold tracking-wider block">State/Territory</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-bg-card border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold"
            >
              <option value="all">All States</option>
              {uniqueStates.filter(s => s !== 'all').map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Party Filter */}
          <div className="space-y-2">
            <label className="text-xs uppercase text-text-secondary font-bold tracking-wider block">Political Party</label>
            <select
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="w-full bg-bg-card border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold"
            >
              <option value="all">All Parties</option>
              {uniqueParties.filter(p => p !== 'all').map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-xs uppercase text-text-secondary font-bold tracking-wider block">Governance Role</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setSearchParams(e.target.value === 'all' ? {} : { role: e.target.value });
              }}
              className="w-full bg-bg-card border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold"
            >
              <option value="all">All Roles</option>
              {uniqueRoles.filter(r => r !== 'all').map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* AI Score Bracket */}
          <div className="space-y-2">
            <label className="text-xs uppercase text-text-secondary font-bold tracking-wider block">AI Integrity Score</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedScoreBracket(selectedScoreBracket === 'red' ? 'all' : 'red')}
                className={`text-xs p-2 rounded border font-semibold transition-colors flex items-center justify-between ${
                  selectedScoreBracket === 'red' 
                    ? 'bg-danger-red/20 border-danger-red text-danger-red' 
                    : 'bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>Risky (0-40)</span>
                <span className="w-2 h-2 rounded-full bg-danger-red"></span>
              </button>
              <button
                onClick={() => setSelectedScoreBracket(selectedScoreBracket === 'amber' ? 'all' : 'amber')}
                className={`text-xs p-2 rounded border font-semibold transition-colors flex items-center justify-between ${
                  selectedScoreBracket === 'amber' 
                    ? 'bg-warning-amber/20 border-warning-amber text-warning-amber' 
                    : 'bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>Caution (41-70)</span>
                <span className="w-2 h-2 rounded-full bg-warning-amber"></span>
              </button>
              <button
                onClick={() => setSelectedScoreBracket(selectedScoreBracket === 'green' ? 'all' : 'green')}
                className={`text-xs p-2 rounded border font-semibold transition-colors col-span-2 flex items-center justify-between ${
                  selectedScoreBracket === 'green' 
                    ? 'bg-success-green/20 border-success-green text-success-green' 
                    : 'bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>High Integrity (71-100)</span>
                <span className="w-2 h-2 rounded-full bg-success-green"></span>
              </button>
            </div>
          </div>

          {/* Criminal Case Bracket */}
          <div className="space-y-2">
            <label className="text-xs uppercase text-text-secondary font-bold tracking-wider block">Criminal Charges</label>
            <div className="space-y-1.5 font-sans">
              {[
                { key: 'all', label: 'Any Record Status' },
                { key: 'clean', label: 'Prinstine / Clean Record Only' },
                { key: 'has-cases', label: '1+ Declared Active Cases' },
                { key: 'severe', label: 'Severe / 4+ Pending Cases' }
              ].map(item => (
                <label key={item.key} className="flex items-center text-xs text-text-primary font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="criminal"
                    checked={selectedCriminal === item.key}
                    onChange={() => setSelectedCriminal(item.key)}
                    className="mr-2 text-accent-gold focus:ring-accent-gold"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Asset Bracket */}
          <div className="space-y-2">
            <label className="text-xs uppercase text-text-secondary font-bold tracking-wider block">Asset Bracket</label>
            <select
              value={selectedNetWorth}
              onChange={(e) => setSelectedNetWorth(e.target.value)}
              className="w-full bg-bg-card border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold"
            >
              <option value="all">Any Assets Dec</option>
              <option value="under-1">Under ₹1 Crore</option>
              <option value="1-10">₹1 Crore - ₹10 Crores</option>
              <option value="10-100">₹10 Crores - ₹100 Crores</option>
              <option value="100-plus">₹100 Crores +</option>
            </select>
          </div>

          {/* Risk Alert Flags */}
          <div className="space-y-2.5">
            <label className="text-xs uppercase text-text-secondary font-bold tracking-wider block">Risk Alert Flags</label>
            <div className="flex flex-wrap gap-1.5">
              {availableFlags.map(flag => {
                const isSelected = activeFlags.includes(flag.key);
                const Icon = flag.icon;
                return (
                  <button
                    key={flag.key}
                    onClick={() => handleToggleFlag(flag.key)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                      isSelected 
                        ? 'bg-bg-card border-accent-gold text-accent-gold' 
                        : 'bg-bg-card/40 border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-secondary'
                    }`}
                  >
                    <Icon size={12} className={isSelected ? 'text-accent-gold' : flag.color} />
                    {flag.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PANEL 2: Middle Results List (Scrollable) */}
        <main className="flex-1 flex flex-col min-w-0 bg-bg-primary overflow-hidden">
          {/* Results Summary Bar */}
          <div className="bg-bg-card/40 border-b border-border-subtle p-3 flex items-center justify-between text-xs shrink-0 px-4">
            <div className="font-mono text-text-secondary">
              SHOWING <span className="text-text-primary font-bold">{filteredPoliticians.length}</span> OF <span className="text-text-primary font-bold">{politicians.length}</span> REPRESENTATIVES
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-text-secondary flex items-center gap-1"><ArrowUpDown size={12} /> SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-bg-card border border-border-subtle text-text-primary rounded px-2 py-1 focus:outline-none focus:border-accent-gold text-xs"
              >
                <option value="aiScore-asc">Riskiest First (AI Score 0-100)</option>
                <option value="aiScore-desc">Cleanest First (AI Score 100-0)</option>
                <option value="netWorth-desc">Net Worth (High to Low)</option>
                <option value="criminal-desc">Criminal Cases (High to Low)</option>
                <option value="attendance-desc">Assembly Attendance (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Grid / List Results (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
                <h3 className="font-heading text-lg font-bold text-text-secondary">LOADING DATA...</h3>
              </div>
            ) : filteredPoliticians.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <ShieldAlert size={48} className="text-warning-amber mx-auto" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">NO DATA MATCHES SELECTED CRITERIA</h3>
                  <p className="text-xs text-text-secondary max-w-sm mt-1">
                    Try broadening your state, party, or scoring filter constraints or reset your filters.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredPoliticians.map((politician) => {
                  const isSelected = politician.id === selectedId;
                  const isSevereRisk = politician.aiScore <= 40;
                  const isCautionRisk = politician.aiScore > 40 && politician.aiScore <= 70;
                  
                  return (
                    <div
                      key={politician.id}
                      onClick={() => setSelectedId(politician.id)}
                      className={`group border rounded-xl overflow-hidden cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-accent-gold bg-bg-card ring-1 ring-accent-gold/40' 
                          : 'border-border-subtle bg-bg-card/45 hover:border-text-secondary hover:bg-bg-card/90'
                      }`}
                    >
                      <div className="p-4 flex gap-4 items-center">
                        {/* Profile Image Column */}
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

                        {/* Middle Identity Column */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className={`font-heading text-base font-bold truncate transition-colors ${
                              isSelected ? 'text-accent-gold' : 'text-text-primary group-hover:text-accent-gold'
                            }`}>
                              {politician.name}
                            </h3>
                            <span className="text-[10px] bg-bg-secondary border border-border-subtle px-1.5 py-0.5 rounded font-bold font-mono">
                              {politician.party}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {politician.role} • {politician.state}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-mono text-text-secondary mt-1 flex-wrap">
                            <span>ASSETS: <strong className="text-text-primary">₹{politician.netWorth}</strong></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-border-subtle"></span>
                            <span>
                              CASES: <strong className={politician.criminalCases > 0 ? 'text-danger-red font-bold' : 'text-success-green'}>{politician.criminalCases} Pending</strong>
                            </span>
                            {politician.attendancePct !== undefined && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-border-subtle"></span>
                                <span>ATTENDANCE: <strong className="text-text-primary">{politician.attendancePct}%</strong></span>
                              </>
                            )}
                          </div>

                          {/* Quick Badges in row */}
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {politician.flags.edRaid && <Badge variant="outline" className="text-[9px] px-1 py-0 bg-bg-secondary/40 border-warning-amber/40 text-warning-amber">ED Probe</Badge>}
                            {politician.flags.convicted && <Badge variant="danger" className="text-[9px] px-1 py-0">CONVICTED</Badge>}
                            {politician.flags.offshoreLink && <Badge variant="outline" className="text-[9px] px-1 py-0 bg-bg-secondary/40 border-info-blue/40 text-info-blue">💰 BVI Assets</Badge>}
                            {politician.flags.cronyism && <Badge variant="outline" className="text-[9px] px-1 py-0 bg-bg-secondary/40 border-accent-gold/40 text-accent-gold">Cronyism</Badge>}
                            {politician.flags.goodWork && <Badge variant="success" className="text-[9px] px-1 py-0">✅ Exemplary</Badge>}
                          </div>
                        </div>

                        {/* Right Gauge / Action Column */}
                        <div className="flex flex-col items-center gap-1 shrink-0 pl-2">
                          <IntegrityScoreGauge score={politician.aiScore} size="sm" showLabel={false} />
                          <span className={`text-[9px] font-bold font-mono ${
                            isSevereRisk ? 'text-danger-red' : isCautionRisk ? 'text-warning-amber' : 'text-success-green'
                          }`}>
                            SCORE {politician.aiScore}
                          </span>
                        </div>
                        
                        <div className="text-text-secondary shrink-0 hidden sm:block">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* PANEL 3: Right selected representative full profile preview (Scrollable) */}
        <aside className="w-[420px] bg-bg-secondary border-l border-border-subtle overflow-y-auto hidden xl:block p-6 shrink-0 space-y-6">
          {selectedPolitician ? (
            <div className="space-y-6">
              {/* Header Telemetry Branding */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase">
                  TELEMETRY REPORT // ID-{selectedPolitician.id}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-accent-gold font-mono">
                  <Sparkles size={10} /> AI AUDIT READY
                </span>
              </div>

              {/* Profile Card View */}
              <div className="relative rounded-xl border border-border-subtle bg-bg-card p-4 overflow-hidden">
                {/* Score Ring Overlap */}
                <div className="absolute top-4 right-4 bg-bg-primary/95 p-2 rounded-xl border border-border-subtle flex flex-col items-center gap-0.5 shadow-md">
                  <IntegrityScoreGauge score={selectedPolitician.aiScore} size="md" showLabel={true} />
                  <span className="text-[9px] text-text-secondary font-mono tracking-wider font-bold">INTEGRITY</span>
                </div>

                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-border-subtle bg-bg-secondary shrink-0">
                    <img 
                      src={selectedPolitician.photoUrl} 
                      alt={selectedPolitician.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="pr-20">
                    <span className="text-[10px] bg-info-blue/10 text-info-blue px-2 py-0.5 rounded-full font-bold font-mono">
                      {selectedPolitician.party} Party
                    </span>
                    <h2 className="font-heading text-xl font-bold mt-2 text-text-primary leading-tight">
                      {selectedPolitician.name}
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">
                      {selectedPolitician.role} representing <strong className="text-text-primary">{selectedPolitician.constituency}</strong>, {selectedPolitician.state}
                    </p>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-2 border-t border-border-subtle mt-4 pt-3.5 text-center font-mono">
                  <div className="bg-bg-primary/30 p-2 rounded border border-border-subtle/50">
                    <p className="text-[9px] uppercase text-text-secondary font-semibold">Net Worth</p>
                    <p className="text-sm font-bold text-text-primary mt-0.5">₹{selectedPolitician.netWorth}</p>
                  </div>
                  <div className="bg-bg-primary/30 p-2 rounded border border-border-subtle/50">
                    <p className="text-[9px] uppercase text-text-secondary font-semibold">Criminal cases</p>
                    <p className={`text-sm font-bold mt-0.5 ${selectedPolitician.criminalCases > 0 ? 'text-danger-red' : 'text-success-green'}`}>
                      {selectedPolitician.criminalCases}
                    </p>
                  </div>
                  <div className="bg-bg-primary/30 p-2 rounded border border-border-subtle/50">
                    <p className="text-[9px] uppercase text-text-secondary font-semibold">Attendance</p>
                    <p className="text-sm font-bold text-text-primary mt-0.5">
                      {selectedPolitician.attendancePct !== undefined ? `${selectedPolitician.attendancePct}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-bold">Biographical Snapshot</h4>
                <p className="text-xs text-text-primary leading-relaxed bg-bg-card border border-border-subtle/50 rounded-lg p-3 font-sans">
                  {selectedPolitician.biography}
                </p>
              </div>

              {/* AI REPORT INSIGHTS */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1">
                  <Sparkles size={13} className="text-accent-gold" /> AI Transparency Assessment
                </h4>

                <div className="border border-border-subtle bg-bg-card rounded-xl p-4 space-y-4">
                  {/* Risk Level Badge */}
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <span className="text-xs text-text-secondary">INTEGRITY CLASSIFICATION</span>
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      selectedPolitician.integrityDetails.riskLevel === 'CRITICAL' ? 'bg-danger-red/20 text-danger-red border border-danger-red/40' :
                      selectedPolitician.integrityDetails.riskLevel === 'HIGH' ? 'bg-danger-red/10 text-danger-red/80 border border-danger-red/20' :
                      selectedPolitician.integrityDetails.riskLevel === 'MEDIUM' ? 'bg-warning-amber/10 text-warning-amber border border-warning-amber/20' :
                      'bg-success-green/10 text-success-green border border-success-green/20'
                    }`}>
                      {selectedPolitician.integrityDetails.riskLevel} RISK
                    </span>
                  </div>

                  {/* Summary paragraph */}
                  <p className="text-xs text-text-primary leading-relaxed">
                    {selectedPolitician.integrityDetails.summary}
                  </p>

                  {/* Risk factors list */}
                  {selectedPolitician.integrityDetails.riskFactors.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-danger-red font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Red Flag Risk Triggers
                      </p>
                      <ul className="space-y-1.5">
                        {selectedPolitician.integrityDetails.riskFactors.map((risk, index) => (
                          <li key={index} className="text-[11px] text-text-secondary leading-relaxed flex items-start">
                            <span className="text-danger-red mr-2 inline-block shrink-0">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Positive contributions */}
                  {selectedPolitician.integrityDetails.positiveContributions.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-success-green font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Public Service & Positives
                      </p>
                      <ul className="space-y-1.5">
                        {selectedPolitician.integrityDetails.positiveContributions.map((pos, index) => (
                          <li key={index} className="text-[11px] text-text-secondary leading-relaxed flex items-start">
                            <span className="text-success-green mr-2 inline-block shrink-0">•</span>
                            {pos}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* View Full Profile CTA */}
              <Link 
                to={`/politician/${selectedPolitician.id}`} 
                className="block pt-2"
              >
                <Button className="w-full bg-accent-gold text-bg-primary hover:bg-accent-gold/80 font-bold flex items-center justify-center gap-1.5 py-3.5">
                  Analyze Full Accountability Profile <ExternalLink size={14} />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <User size={48} className="text-text-secondary/40 mx-auto" />
              <div>
                <h3 className="font-heading text-lg font-bold text-text-secondary">SELECT REPRESENTATIVE</h3>
                <p className="text-xs text-text-secondary max-w-sm mt-1">
                  Choose a politician from the middle panel to execute dynamic AI and telemetry integrity analyses.
                </p>
              </div>
            </div>
          )}
        </aside>
        
      </div>
    </div>
  );
};

export default Browse;
