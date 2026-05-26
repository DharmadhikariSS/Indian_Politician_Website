import React, { useState, useMemo } from 'react';
import { usePoliticians } from '../hooks/usePoliticians';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  Sliders, 
  Scale, 
  DollarSign, 
  Activity, 
  Building2, 
  HelpCircle,
  GitCompare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DemocracyMatch = () => {
  const { data: politicians = [], isLoading } = usePoliticians();

  // Slider Weights
  const [weights, setWeights] = useState({
    criminal: 50,
    financial: 50,
    legislative: 50,
    development: 50,
    grievance: 50
  });

  const [pincodeFilter, setPincodeFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'MP' | 'MLA' | 'Corporator'>('ALL');

  const handleSliderChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  // Run the matching compatibility algorithm
  const matchedPoliticians = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return [];

    return politicians
      .map(p => {
        // Retrieve candidate raw scores
        const criminalScore = p.integrityDetails?.criminalHistory ?? 50;
        const financialScore = p.integrityDetails?.financialIntegrity ?? 50;
        
        // For legislative
        const attendance = p.parliamentActivity?.attendance ?? p.attendancePct ?? 70;
        const legislativeScore = Math.min(100, Math.max(0, (attendance + (p.parliamentActivity?.debatesCount ?? 10) * 1.5)));
        
        // For development
        const devScore = p.localWardFundUtilization ?? (p.aiScore > 50 ? 80 : 40);

        // For grievance
        const grievanceScore = p.grievanceRedressPct ?? (p.aiScore > 50 ? 85 : 45);

        // Weighted match calculation
        const matchPct = Math.round(
          (
            (weights.criminal * criminalScore) +
            (weights.financial * financialScore) +
            (weights.legislative * legislativeScore) +
            (weights.development * devScore) +
            (weights.grievance * grievanceScore)
          ) / totalWeight
        );

        return {
          ...p,
          matchPct
        };
      })
      // Filter by Pincode if entered
      .filter(p => {
        if (!pincodeFilter) return true;
        return p.pincodes?.includes(pincodeFilter.trim());
      })
      // Filter by Role
      .filter(p => {
        if (selectedRole === 'ALL') return true;
        const roleLower = p.role.toLowerCase();
        if (selectedRole === 'MP') {
          return roleLower.includes('mp') || roleLower.includes('parliament') || roleLower.includes('lok sabha') || roleLower.includes('rajya sabha');
        }
        if (selectedRole === 'MLA') {
          return roleLower.includes('mla') || roleLower.includes('assembly') || roleLower.includes('legislative');
        }
        if (selectedRole === 'Corporator') {
          return roleLower.includes('corporator') || roleLower.includes('councillor');
        }
        return true;
      })
      // Sort by Match Percentage descending
      .sort((a, b) => b.matchPct - a.matchPct);

  }, [politicians, weights, pincodeFilter, selectedRole]);

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        
        {/* Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-accent-gold/15 rounded-full text-accent-gold mb-2 animate-pulse">
            <Sparkles size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            DEMOCRACY <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-warning-amber">MATCH ENGINE</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed font-sans">
            Input your governance weights, filter by location, and discover which candidates align closest to your ideal representation.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Panel - 5 Columns */}
          <div className="lg:col-span-5 bg-bg-secondary border border-border-subtle p-6 rounded-2xl space-y-8 sticky top-24">
            <div className="border-b border-border-subtle pb-4 flex items-center gap-2">
              <Sliders size={20} className="text-accent-gold" />
              <h2 className="font-heading font-bold text-lg text-text-primary uppercase tracking-wider">Allocation Board</h2>
            </div>

            {/* Slider 1: Criminal History */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-danger-red uppercase">
                  <Scale size={14} /> Criminal Strictness
                </span>
                <span className="text-text-secondary">{weights.criminal}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.criminal} 
                onChange={(e) => handleSliderChange('criminal', parseInt(e.target.value))}
                className="w-full accent-danger-red cursor-pointer bg-bg-card h-1.5 rounded-lg"
              />
              <p className="text-[10px] text-text-secondary leading-normal">
                How heavily should court trials and charges filed deduct from a candidate's compatibility?
              </p>
            </div>

            {/* Slider 2: Financial Integrity */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-success-green uppercase">
                  <DollarSign size={14} /> Wealth Auditing
                </span>
                <span className="text-text-secondary">{weights.financial}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.financial} 
                onChange={(e) => handleSliderChange('financial', parseInt(e.target.value))}
                className="w-full accent-success-green cursor-pointer bg-bg-card h-1.5 rounded-lg"
              />
              <p className="text-[10px] text-text-secondary leading-normal">
                Strictness level applied to term-over-term asset surges compared directly against salary and inflation.
              </p>
            </div>

            {/* Slider 3: Legislative Telemetry */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-info-blue uppercase">
                  <Activity size={14} /> Legislative Action
                </span>
                <span className="text-text-secondary">{weights.legislative}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.legislative} 
                onChange={(e) => handleSliderChange('legislative', parseInt(e.target.value))}
                className="w-full accent-info-blue cursor-pointer bg-bg-card h-1.5 rounded-lg"
              />
              <p className="text-[10px] text-text-secondary leading-normal">
                Value placed on parliamentary attendance percentages, debates hosted, and bills sponsored.
              </p>
            </div>

            {/* Slider 4: Development Fund Utilization */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-warning-amber uppercase">
                  <Building2 size={14} /> Local Development
                </span>
                <span className="text-text-secondary">{weights.development}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.development} 
                onChange={(e) => handleSliderChange('development', parseInt(e.target.value))}
                className="w-full accent-warning-amber cursor-pointer bg-bg-card h-1.5 rounded-lg"
              />
              <p className="text-[10px] text-text-secondary leading-normal">
                Preference for candidates efficiently spending local MPLADS / MLALAD / Ward allocation budgets.
              </p>
            </div>

            {/* Slider 5: Grievance Redress */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5 text-accent-gold uppercase">
                  <ShieldCheck size={14} /> Grievance Speed
                </span>
                <span className="text-text-secondary">{weights.grievance}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.grievance} 
                onChange={(e) => handleSliderChange('grievance', parseInt(e.target.value))}
                className="w-full accent-accent-gold cursor-pointer bg-bg-card h-1.5 rounded-lg"
              />
              <p className="text-[10px] text-text-secondary leading-normal">
                Weights given to administrative resolution speed for direct constituent complaints.
              </p>
            </div>
          </div>

          {/* Results List Panel - 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Filter Controls */}
            <div className="bg-bg-secondary border border-border-subtle p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between text-left">
              
              <div className="w-full sm:w-auto flex items-center gap-2 bg-bg-card border border-border-subtle px-3 py-2 rounded-lg shrink-0">
                <MapPin size={16} className="text-accent-gold" />
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter 6-digit PIN Code"
                  value={pincodeFilter}
                  onChange={(e) => setPincodeFilter(e.target.value.replace(/\D/g, ''))}
                  className="bg-transparent border-none outline-none font-mono text-xs w-36 text-text-primary placeholder:text-text-secondary"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-1 border border-border-subtle bg-bg-card p-1 rounded-lg text-xs font-mono">
                {(['ALL', 'MP', 'MLA', 'Corporator'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 rounded transition-all uppercase font-bold shrink-0 ${
                      selectedRole === role 
                        ? 'bg-accent-gold text-bg-primary shadow-sm' 
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {role}s
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Results Grid */}
            {isLoading ? (
              <div className="bg-bg-secondary border border-border-subtle p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-8 h-8 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin"></div>
                <p className="font-mono text-xs text-text-secondary uppercase">Scanning database compatibility matrix...</p>
              </div>
            ) : matchedPoliticians.length === 0 ? (
              <div className="bg-bg-secondary border border-border-subtle p-12 rounded-2xl text-center space-y-4 text-left">
                <HelpCircle size={48} className="text-text-secondary mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg uppercase">No Ballot Candidates Matched</h3>
                  <p className="text-xs text-text-secondary max-w-md mx-auto">
                    We could not locate any active representatives under the selected criteria. Try typing a test PIN code like <code className="bg-bg-card px-1.5 py-0.5 rounded text-accent-gold">560001</code>, <code className="bg-bg-card px-1.5 py-0.5 rounded text-accent-gold">233001</code>, or leaving it blank.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {matchedPoliticians.map((p, idx) => {
                  const matchColor = p.matchPct >= 75 
                    ? 'text-success-green bg-success-green/10 border-success-green/20' 
                    : p.matchPct >= 45 
                    ? 'text-warning-amber bg-warning-amber/10 border-warning-amber/20' 
                    : 'text-danger-red bg-danger-red/10 border-danger-red/20';

                  return (
                    <Card key={p.id} className="bg-bg-secondary hover:border-border-subtle transition-all text-left">
                      <CardContent className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                        
                        {/* Candidate Identity */}
                        <div className="flex gap-4 items-center min-w-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-border-subtle shrink-0 bg-bg-card">
                            <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-heading font-bold text-base text-text-primary tracking-wide truncate">{p.name}</h3>
                              <Badge variant="outline" className="font-mono text-[8px] tracking-widest uppercase shrink-0">
                                {p.party}
                              </Badge>
                              {p.municipalWard && (
                                <Badge variant="outline" className="font-mono text-[8px] text-accent-gold border-accent-gold/20 shrink-0">
                                  LOCAL WARD
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary font-mono flex items-center gap-1">
                              <span>{p.role}</span> • <span>{p.constituency}, {p.state}</span>
                            </p>
                          </div>
                        </div>

                        {/* Compatibility Percentage & Action */}
                        <div className="w-full sm:w-auto shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                          
                          {/* Compatibility meter */}
                          <div className="text-right">
                            <div className="flex items-center gap-1.5 sm:justify-end">
                              <span className="text-[10px] font-mono font-bold text-text-secondary uppercase">COMPATIBILITY:</span>
                              <span className={`font-mono font-bold text-sm px-2 py-0.5 border rounded ${matchColor}`}>
                                {p.matchPct}%
                              </span>
                            </div>
                            {/* Visual micro-bar */}
                            <div className="w-28 bg-bg-card h-1 rounded-full mt-1.5 overflow-hidden hidden sm:block">
                              <div 
                                className={`h-full ${
                                  p.matchPct >= 75 ? 'bg-success-green' : p.matchPct >= 45 ? 'bg-warning-amber' : 'bg-danger-red'
                                }`}
                                style={{ width: `${p.matchPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Quick Link */}
                          <div className="flex items-center gap-2">
                            <Link to={`/politician/${p.id}`}>
                              <Button className="bg-bg-card border border-border-subtle hover:bg-bg-secondary text-[10px] font-mono font-bold px-3 py-1.5 rounded flex items-center gap-1 text-accent-gold shadow-sm">
                                DOSSIER <ExternalLink size={10} />
                              </Button>
                            </Link>
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default DemocracyMatch;
