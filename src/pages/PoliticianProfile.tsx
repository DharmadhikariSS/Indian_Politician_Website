import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  ShieldCheck, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Award, 
  FileText, 
  CheckCircle2, 
  ChevronLeft, 
  User, 
  Sparkles, 
  Clock, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Newspaper,
  GitCompare,
  ShieldAlert,
  Route,
  MessageSquare
} from 'lucide-react';
import { usePolitician } from '../hooks/usePoliticians';
import { mockPoliticians, type DetailedPoliticianData } from '../data/politicians';
import { IntegrityScoreGauge } from '../components/ui/IntegrityScoreGauge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { CareerTimeline } from '../components/ui/CareerTimeline';
import { NewsFeed } from '../components/ui/NewsFeed';
import { CitizenActionPanel } from '../components/ui/CitizenActionPanel';
import { DynamicText } from '../components/ui/DynamicText';
import { useI18n } from '../i18n/translations';

const PoliticianProfile = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'criminal' | 'legislative' | 'press' | 'manifesto' | 'conflicts' | 'career' | 'actions'>('overview');

  // Find politician by ID using the usePolitician query hook!
  const { data: politician, isLoading } = usePolitician(id);

  const opponent = useMemo(() => {
    if (!politician || !politician.strongestOpponentId) return null;
    return mockPoliticians.find(p => p.id === politician.strongestOpponentId) || null;
  }, [politician]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 py-20 text-center space-y-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
        <h1 className="font-heading text-2xl font-bold text-text-secondary uppercase">RETRIEVING ACCOUNTABILITY PROFILE...</h1>
      </div>
    );
  }

  if (!politician) {
    return (
      <div className="container mx-auto p-4 py-20 text-center space-y-6">
        <AlertTriangle size={64} className="text-danger-red mx-auto" />
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold">REPRESENTATIVE NOT FOUND</h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            The politician index for ID "{id}" could not be retrieved from the central database ledger.
          </p>
        </div>
        <Link to="/browse">
          <Button variant="outline" className="border-border-subtle hover:bg-bg-secondary text-accent-gold mt-4">
            <ChevronLeft size={16} className="mr-1" /> Return to Decision Hub
          </Button>
        </Link>
      </div>
    );
  }

  // Segment colors for AI Score levels
  const isSevereRisk = politician.aiScore <= 40;
  const isCautionRisk = politician.aiScore > 40 && politician.aiScore <= 70;

  // Custom tooltips for Recharts
  const CustomFinancialTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-secondary border border-border-subtle p-3 rounded-lg shadow-xl font-mono text-xs">
          <p className="font-bold text-text-primary mb-1.5">YEAR: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-6 my-0.5">
              <span>{entry.name.toUpperCase()}:</span>
              <span className="font-bold">₹{entry.value.toFixed(2)} Cr</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomComparativeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-secondary border border-border-subtle p-3 rounded-lg shadow-xl font-mono text-xs">
          <p className="font-bold text-text-primary mb-1.5">{label.toUpperCase()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-6 my-0.5">
              <span>{entry.name.toUpperCase()}:</span>
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Corporate funding pie chart calculations
  const pieData = politician.electoralBonds?.map((bond, index) => ({
    name: bond.donor,
    value: bond.amount,
    color: index === 0 ? '#D4A017' : index === 1 ? '#ED8936' : index === 2 ? '#4299E1' : '#38A169'
  })) || [];

  const manifestoSectorData = politician.manifestoSectorBreakdown?.map((item, index) => ({
    name: item.sector,
    value: item.value,
    color: index === 0 ? '#D4A017' : index === 1 ? '#4299E1' : index === 2 ? '#38A169' : '#ED8936'
  })) || [];

  const totalBondsAmount = politician.electoralBonds?.reduce((sum, b) => sum + b.amount, 0) || 0;

  // Legislative comparative data for chart
  const legislativeChartData = politician.parliamentActivity ? [
    {
      metric: 'Attendance %',
      Representative: politician.parliamentActivity.attendance,
      Average: politician.parliamentActivity.attendanceAvg,
    },
    {
      metric: 'Debates led',
      Representative: politician.parliamentActivity.debatesCount,
      Average: politician.parliamentActivity.debatesAvg,
    },
    {
      metric: 'Questions',
      Representative: politician.parliamentActivity.questionsCount,
      Average: politician.parliamentActivity.questionsAvg,
    },
    {
      metric: 'Private Bills',
      Representative: politician.parliamentActivity.privateMemberBills * 50, // Scaled for visual comparison
      Average: politician.parliamentActivity.billsAvg * 50,
      actualRepValue: politician.parliamentActivity.privateMemberBills,
      actualAvgValue: politician.parliamentActivity.billsAvg,
    }
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      
      {/* Back to Browse breadcrumb */}
      <div className="shrink-0 flex items-center justify-between">
        <Link 
          to="/browse" 
          className="text-xs text-text-secondary hover:text-text-primary flex items-center font-mono"
        >
          <ChevronLeft size={14} className="mr-1" /> BACK TO DATA HUB
        </Link>
        <span className="text-[10px] font-mono text-text-secondary bg-bg-secondary border border-border-subtle px-2 py-0.5 rounded">
          DATABASE STATUS: ACTIVE LEDGER
        </span>
      </div>

      {/* 1. Header Profile Banner */}
      <section className="bg-bg-secondary rounded-2xl border border-border-subtle overflow-hidden relative shadow-lg">
        {/* Dynamic Warning Indicator Ribbon */}
        <div className={`h-1.5 w-full ${
          isSevereRisk ? 'bg-danger-red animate-pulse' : isCautionRisk ? 'bg-warning-amber' : 'bg-success-green'
        }`} />

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center relative z-10">
          {/* Portrait Photo */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-border-subtle bg-bg-card shrink-0 relative shadow-inner">
            <img 
              src={politician.photoUrl} 
              alt={politician.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {politician.isVerified && (
              <div className="absolute bottom-2 left-2 bg-info-blue text-white p-1 rounded-full shadow-md" title="Verified Profile">
                <ShieldCheck size={16} />
              </div>
            )}
          </div>

          {/* Identity details */}
          <div className="flex-1 space-y-3.5 min-w-0">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 bg-bg-card border border-border-subtle rounded-full text-accent-gold shadow-sm">
                Party: {politician.party}
              </span>
              <span className="text-xs font-mono text-text-secondary">
                ID-CONSTITUENCY: {politician.constituency.toUpperCase()}
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
              {politician.name}
            </h1>

            <div className="flex items-center gap-6 text-sm text-text-secondary font-sans flex-wrap">
              <span className="flex items-center gap-1.5"><User size={16} className="text-accent-gold" /> {politician.role}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border-subtle"></span>
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-accent-gold" /> Age: {politician.age}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border-subtle"></span>
              <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-accent-gold" /> Educ: {politician.education}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border-subtle"></span>
              <span className="flex items-center gap-1.5 font-mono"><FileText size={16} className="text-accent-gold" /> PAN: {politician.panNumber}</span>
            </div>

            {/* Quick Warning Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {politician.flags.edRaid && <Badge variant="outline" className="bg-bg-primary/50 text-warning-amber border-warning-amber/40"><AlertTriangle size={12} className="mr-1"/> Enforcement Directorate Raided</Badge>}
              {politician.flags.convicted && <Badge variant="danger" className="border border-danger-red/40"><AlertTriangle size={12} className="mr-1"/> Convicted in Court</Badge>}
              {politician.flags.offshoreLink && <Badge variant="outline" className="bg-bg-primary/50 text-info-blue border-info-blue/40">💰 Offshore Panama/BVI Assets Flag</Badge>}
              {politician.flags.cronyism && <Badge variant="outline" className="bg-bg-primary/50 text-accent-gold border-accent-gold/40"><Building2 size={12} className="mr-1"/> Alleged Public Procurement Cronyism</Badge>}
              {politician.flags.goodWork && <Badge variant="success" className="border border-success-green/40">✅ Exemplary Public Record Awarded</Badge>}
            </div>
          </div>

          {/* Large Integrity Score Widget */}
          <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl flex flex-col items-center gap-2 shadow-md w-full md:w-44 shrink-0 text-center">
            <IntegrityScoreGauge score={politician.aiScore} size="lg" showLabel={true} />
            <div>
              <p className="text-[10px] font-mono tracking-wider uppercase text-text-secondary font-bold">Integrity Score</p>
              <p className={`text-xs font-mono font-bold uppercase mt-0.5 ${
                isSevereRisk ? 'text-danger-red' : isCautionRisk ? 'text-warning-amber' : 'text-success-green'
              }`}>
                {politician.integrityDetails.riskLevel} RISK CLASSIFICATION
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-border-subtle overflow-x-auto whitespace-nowrap bg-bg-secondary/40 rounded-xl p-1 shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'overview' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sparkles size={16} /> {t('tab_overview')}
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'financials' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <TrendingUp size={16} /> {t('tab_financials')} ({politician.netWorth})
        </button>
        <button
          onClick={() => setActiveTab('criminal')}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'criminal' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Scale size={16} /> {t('tab_criminal')} ({politician.criminalCases})
        </button>
        {politician.parliamentActivity && (
          <button
            onClick={() => setActiveTab('legislative')}
            className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
              activeTab === 'legislative' 
                ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BookOpen size={16} /> {t('tab_parliament')} ({politician.isAttendanceExempt ? t('score_exempt') : `${politician.attendancePct}%`})
          </button>
        )}
        <button
          onClick={() => setActiveTab('press')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'press' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Newspaper size={14} /> {t('tab_news')} ({politician.newsArticles?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('career')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'career' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Route size={14} /> {t('tab_career')}
        </button>
        <button
          onClick={() => setActiveTab('manifesto')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'manifesto' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <FileText size={14} /> {t('tab_manifesto')} ({politician.manifestoPledges?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('conflicts')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'conflicts' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <ShieldAlert size={14} /> {t('tab_conflicts')} ({politician.conflictLedger?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeTab === 'actions' 
              ? 'bg-bg-card border border-border-subtle text-accent-gold shadow-md' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <MessageSquare size={14} /> {t('career_action')}
        </button>
      </div>

      {/* 3. Dynamic Tab Workspace Content */}
      <div className="space-y-6">
        
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Biography & General Stats */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-border-subtle bg-bg-card">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5">
                    {t('prof_biography')}
                  </h3>
                  <p className="text-sm text-text-primary leading-relaxed">
                    <DynamicText text={politician.biography} />
                  </p>
                  <div className="border-t border-border-subtle/50 pt-4 space-y-3.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">{t('prof_active_politics')}:</span>
                      <span className="font-bold text-text-primary">{t('prof_since')} {politician.activeSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">{t('prof_terms')}:</span>
                      <span className="font-bold text-text-primary">{politician.termCount} {t('prof_terms_served')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">{t('prof_house')}:</span>
                      <span className="font-bold text-text-primary">{politician.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">{t('prof_state_reg')}:</span>
                      <span className="font-bold text-text-primary">{politician.state}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sub-Score Breakdown Gauge */}
              <Card className="border-border-subtle bg-bg-card">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5">
                    {t('prof_integrity_breakdown')}
                  </h3>
                  
                  {/* Financial Integrity Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-secondary">{t('prof_financial_integrity')}</span>
                      <span className={`font-bold ${politician.integrityDetails.financialIntegrity < 50 ? 'text-danger-red' : 'text-success-green'}`}>
                        {politician.integrityDetails.financialIntegrity}/100
                      </span>
                    </div>
                    <div className="w-full bg-bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${politician.integrityDetails.financialIntegrity < 50 ? 'bg-danger-red' : 'bg-success-green'}`} 
                        style={{ width: `${politician.integrityDetails.financialIntegrity}%` }}
                      />
                    </div>
                  </div>

                  {/* Public Service Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-secondary">{t('prof_public_service')}</span>
                      <span className={`font-bold ${politician.integrityDetails.publicService < 50 ? 'text-danger-red' : 'text-success-green'}`}>
                        {politician.integrityDetails.publicService}/100
                      </span>
                    </div>
                    <div className="w-full bg-bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${politician.integrityDetails.publicService < 50 ? 'bg-warning-amber' : 'bg-success-green'}`} 
                        style={{ width: `${politician.integrityDetails.publicService}%` }}
                      />
                    </div>
                  </div>

                  {/* Criminal History Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-secondary">{t('prof_criminal_record')}</span>
                      <span className={`font-bold ${politician.integrityDetails.criminalHistory < 50 ? 'text-danger-red' : 'text-success-green'}`}>
                        {politician.integrityDetails.criminalHistory}/100
                      </span>
                    </div>
                    <div className="w-full bg-bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${politician.integrityDetails.criminalHistory < 50 ? 'bg-danger-red' : 'bg-success-green'}`} 
                        style={{ width: `${politician.integrityDetails.criminalHistory}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-text-secondary leading-relaxed font-sans pt-1 border-t border-border-subtle/50">
                    {t('prof_score_source')}
                  </p>
                </CardContent>
              </Card>

              {opponent && (
                <Card className="border-border-subtle bg-bg-card text-left mt-6">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5 flex items-center gap-1.5">
                      <GitCompare size={18} className="text-accent-gold" /> {t('prof_rival_title')}
                    </h3>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-subtle bg-bg-secondary shrink-0">
                        <img src={opponent.photoUrl} alt={opponent.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-text-primary truncate">{opponent.name}</h4>
                          <Badge variant="outline" className="text-[8px] font-mono shrink-0">{opponent.party}</Badge>
                        </div>
                        <p className="text-[10px] text-text-secondary font-mono truncate">{opponent.role} • {opponent.constituency}</p>
                      </div>
                    </div>

                    <div className="bg-bg-secondary/40 border border-border-subtle/50 p-3.5 rounded-xl space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between items-center border-b border-border-subtle/50 pb-1.5">
                        <span className="text-text-secondary uppercase">{t('prof_integrity_compare')}:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${politician.aiScore < 50 ? 'text-danger-red' : 'text-success-green'}`}>{politician.aiScore}</span>
                          <span className="text-text-secondary text-[10px] font-bold">vs</span>
                          <span className={`font-bold ${opponent.aiScore < 50 ? 'text-danger-red' : 'text-success-green'}`}>{opponent.aiScore}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-text-secondary leading-normal flex items-start gap-1">
                        <span className="shrink-0 mt-0.5">🎯</span>
                        <span><DynamicText text={politician.constituencyRivalry?.historicalMarginText ?? 'Contesting regional rival.'} /></span>
                      </div>
                    </div>

                    <Link to={`/compare?p1=${politician.id}&p2=${opponent.id}`}>
                      <Button className="w-full bg-accent-gold text-bg-primary hover:bg-accent-gold/80 font-mono font-bold text-xs py-2.5 rounded shadow flex items-center justify-center gap-1.5">
                        <GitCompare size={14} /> {t('prof_compare_btn')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Cols: Complete AI Report Assessment */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border-subtle bg-bg-card overflow-hidden">
                {/* Tech banner */}
                <div className="bg-bg-secondary border-b border-border-subtle p-4 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-1.5 text-accent-gold font-mono font-bold">
                    <Sparkles size={14} /> {t('prof_ai_title')}
                  </div>
                  <span className="text-[10px] text-text-secondary font-mono">
                    {t('prof_ai_status')}
                  </span>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Detailed summary paragraph */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-accent-gold font-bold">
                      {t('prof_exec_outline')}
                    </h4>
                    <p className="text-base text-text-primary leading-relaxed font-sans bg-bg-secondary/40 border border-border-subtle/50 rounded-xl p-4">
                      <DynamicText text={politician.integrityDetails.summary} />
                    </p>
                  </div>

                  {/* Red flags triggers */}
                  {politician.integrityDetails.riskFactors.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-border-subtle">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-danger-red font-bold flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-danger-red animate-pulse" /> {t('prof_risk_triggers')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {politician.integrityDetails.riskFactors.map((risk, index) => (
                          <div 
                            key={index}
                            className="bg-danger-red/5 border border-danger-red/15 rounded-xl p-3.5 text-xs text-text-primary leading-relaxed flex items-start gap-2.5"
                          >
                            <span className="text-danger-red text-base font-bold shrink-0 mt-[-3px]">!</span>
                            <span className="font-sans font-medium text-text-secondary"><strong className="text-text-primary">{t('prof_trigger')} {index+1}:</strong> <DynamicText text={risk} /></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Positives contributions */}
                  {politician.integrityDetails.positiveContributions.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-border-subtle">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-success-green font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-success-green" /> {t('prof_positive')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {politician.integrityDetails.positiveContributions.map((pos, index) => (
                          <div 
                            key={index}
                            className="bg-success-green/5 border border-success-green/15 rounded-xl p-3.5 text-xs text-text-primary leading-relaxed flex items-start gap-2.5 font-sans"
                          >
                            <span className="text-success-green text-base font-bold shrink-0 mt-[-3px]">✓</span>
                            <span className="font-medium text-text-secondary"><strong className="text-text-primary">{t('prof_contribution')} {index+1}:</strong> <DynamicText text={pos} /></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: FINANCIALS ===================== */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            
            {/* Financial Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-center">
              <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('fin_net_worth')}</p>
                <p className="text-2xl font-bold text-accent-gold mt-1.5">₹{politician.netWorth}</p>
                <p className="text-[10px] text-text-secondary mt-1">{t('fin_net_worth_sub')}</p>
              </div>
              <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('fin_growth')}</p>
                <p className={`text-2xl font-bold mt-1.5 flex justify-center items-center gap-1 ${
                  politician.netWorthGrowth > 100 ? 'text-danger-red' : 'text-success-green'
                }`}>
                  {politician.netWorthGrowth > 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                  {politician.netWorthGrowth}%
                </p>
                <p className="text-[10px] text-text-secondary mt-1">{t('fin_growth_sub')}</p>
              </div>
              <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('fin_liabilities')}</p>
                <p className="text-2xl font-bold text-text-primary mt-1.5">
                  ₹{politician.financialTimeline[politician.financialTimeline.length - 1].liabilities.toFixed(2)}Cr
                </p>
                <p className="text-[10px] text-text-secondary mt-1">{t('fin_liabilities_sub')}</p>
              </div>
              <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('fin_bonds')}</p>
                <p className="text-2xl font-bold text-info-blue mt-1.5">
                  {totalBondsAmount > 0 ? `₹${totalBondsAmount.toFixed(1)}Cr` : '₹0.0Cr'}
                </p>
                <p className="text-[10px] text-text-secondary mt-1">{t('fin_bonds_sub')}</p>
              </div>
            </div>

            {/* Asset Growth curves & corporate funding columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Asset Curve Area Chart (2/3 width) */}
              <div className="lg:col-span-2">
                <Card className="border-border-subtle bg-bg-card h-full">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5">
                      {t('fin_chart_title')}
                    </h3>
                    
                    <div className="h-80 w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={politician.financialTimeline}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D4A017" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#D4A017" stopOpacity={0.0}/>
                            </linearGradient>
                            <linearGradient id="colorLiabs" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#E53E3E" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                          <XAxis dataKey="year" stroke="#8B949E" tickLine={false} style={{ fontSize: 10, fontFamily: 'Space Mono' }} />
                          <YAxis stroke="#8B949E" tickLine={false} style={{ fontSize: 10, fontFamily: 'Space Mono' }} />
                          <Tooltip content={<CustomFinancialTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'Space Mono', paddingTop: 10 }} />
                          <Area 
                            type="monotone" 
                            name="Declared Assets" 
                            dataKey="assets" 
                            stroke="#D4A017" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorAssets)" 
                          />
                          <Area 
                            type="monotone" 
                            name="Declared Liabilities" 
                            dataKey="liabilities" 
                            stroke="#E53E3E" 
                            strokeWidth={1.5}
                            fillOpacity={1} 
                            fill="url(#colorLiabs)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Corporate Donors Breakdown (1/3 width) */}
              <div className="lg:col-span-1">
                <Card className="border-border-subtle bg-bg-card h-full">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5">
                      {t('fin_pie_title')}
                    </h3>
                    
                    {pieData.length > 0 ? (
                      <div className="space-y-6">
                        <div className="h-44 w-full relative flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={48}
                                outerRadius={68}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `₹${value} Cr`} />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* Inner sum label */}
                          <div className="absolute text-center">
                            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-mono block">{t('fin_total_bond')}</span>
                            <span className="font-mono text-base font-bold text-text-primary">₹{totalBondsAmount.toFixed(1)}Cr</span>
                          </div>
                        </div>

                        {/* Custom legend list */}
                        <div className="space-y-2 border-t border-border-subtle/50 pt-4 font-mono text-xs">
                          {pieData.map((donor, idx) => (
                            <div key={idx} className="flex justify-between items-center text-text-secondary">
                              <span className="flex items-center gap-2 truncate">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: donor.color }} />
                                {donor.name}
                              </span>
                              <span className="font-bold text-text-primary">₹{donor.value} Cr</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-center p-4 space-y-2">
                        <Building2 size={32} className="text-text-secondary/40" />
                        <h4 className="font-heading text-sm font-bold text-text-secondary">{t('fin_no_donors')}</h4>
                        <p className="text-[10px] text-text-secondary max-w-xs leading-relaxed font-sans">
                          {t('fin_no_donors_sub')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>

            {/* Income Streams declared list */}
            <Card className="border-border-subtle bg-bg-card">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5">
                  {t('fin_sources_title')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {politician.financialTimeline.map((item, idx) => (
                    <div key={idx} className="bg-bg-secondary/40 border border-border-subtle rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center border-b border-border-subtle/60 pb-2">
                        <span className="font-mono text-sm font-bold text-accent-gold">{t('fin_year')} {item.year}</span>
                        <Badge variant="outline" className="text-[10px] font-mono border-border-subtle">₹{item.assets} Cr</Badge>
                      </div>
                      <ul className="space-y-1.5 pt-1.5">
                        {item.sources.map((source, sIdx) => (
                          <li key={sIdx} className="text-xs text-text-secondary flex items-start gap-1.5 font-sans leading-relaxed">
                            <span className="text-accent-gold shrink-0">•</span>
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* ===================== TAB 3: CRIMINAL TRIALS ===================== */}
        {activeTab === 'criminal' && (
          <div className="space-y-6">
            
            {/* Trial KPI Header */}
            <div className="bg-danger-red/5 border border-danger-red/15 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="bg-danger-red/10 p-3 rounded-full shrink-0 border border-danger-red/20 hidden sm:block">
                  <Scale size={28} className="text-danger-red" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wide">
                    {t('crim_title')}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-xl mt-1">
                    {t('crim_note')}
                  </p>
                </div>
              </div>

              <div className="bg-bg-secondary/70 border border-border-subtle px-6 py-3 rounded-xl font-mono text-center shadow shrink-0">
                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('crim_total')}</span>
                <p className="text-3xl font-bold text-danger-red mt-0.5">{politician.criminalCases} {t('crim_active')}</p>
              </div>
            </div>

            {/* Complete listing of criminal FIR cases */}
            {politician.criminalCaseList.length > 0 ? (
              <div className="space-y-4">
                {politician.criminalCaseList.map((trial, index) => (
                  <Card key={index} className="border-border-subtle bg-bg-card hover:border-danger-red/35 transition-colors overflow-hidden">
                    {/* Top Case ID row */}
                    <div className="bg-bg-secondary p-4 flex justify-between items-center border-b border-border-subtle/50 text-xs font-mono">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-danger-red" /> {trial.caseNumber}
                        </span>
                        <span className="text-text-secondary">| {t('crim_date')}: {trial.date}</span>
                      </div>
                      <Badge variant={trial.status.includes('Convicted') ? 'danger' : 'outline'} className="border-border-subtle font-bold">
                        {trial.status.toUpperCase()}
                      </Badge>
                    </div>

                    <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                      {/* Allegations & Charges Column */}
                      <div className="md:col-span-1 space-y-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-danger-red font-bold">DECLARED ALLEGATIONS</h4>
                        <ul className="space-y-1.5">
                          {trial.charges.map((charge, cIdx) => (
                            <li key={cIdx} className="text-xs text-text-primary leading-relaxed flex items-start gap-1.5">
                              <span className="text-danger-red shrink-0">•</span>
                              <DynamicText text={charge} />
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Legislative IPC Sections Column */}
                      <div className="md:col-span-1 space-y-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-accent-gold font-bold">{t('crim_section')}</h4>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {trial.sections.map((section, sIdx) => (
                            <Badge key={sIdx} variant="outline" className="bg-bg-primary/40 border-border-subtle text-text-primary font-mono text-[10px]">
                              {section}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-[10px] text-text-secondary leading-relaxed pt-1.5">
                          Indian Penal Code (IPC) or custom Prevention of Corruption Act categories registered in magistrate files.
                        </p>
                      </div>

                      {/* Judicial Authority Column */}
                      <div className="md:col-span-1 space-y-2 font-mono text-xs text-text-secondary">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-bold">JUDICIAL VENUE</h4>
                        <div className="space-y-1.5 pt-1.5">
                          <p>{t('crim_court')}: <strong className="text-text-primary">{trial.court}</strong></p>
                          <p>{t('crim_status_label')}: <strong className="text-text-primary">{trial.status}</strong></p>
                          <p>CASE RECORD: <strong className="text-text-primary">VERIFIED LEDGER</strong></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {politician.criminalCases > politician.criminalCaseList.length && (
                  <div className="bg-bg-secondary/40 border border-border-subtle rounded-xl p-5 md:p-6 space-y-3 font-sans text-xs">
                    <div className="flex gap-4 items-start">
                      <div className="p-2.5 bg-warning-amber/10 border border-warning-amber/20 text-warning-amber rounded-lg shrink-0">
                        <AlertTriangle size={18} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider">
                          Magistrate Filings Audit Notice
                        </h4>
                        <p className="text-text-secondary leading-relaxed">
                          This candidate has declared a total of <strong>{politician.criminalCases} pending criminal cases</strong> in their official nomination filings with the Election Commission of India (ECI). The <strong>{politician.criminalCaseList.length}</strong> cases listed above detail the most severe active indictments or high-profile charge sheets. The remaining <strong>{politician.criminalCases - politician.criminalCaseList.length}</strong> cases primarily represent protest-related assembly charges (e.g. IPC Section 143/188), political marches, and minor localized municipal ordinance filings.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                          <a 
                            href={`https://myneta.info/`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary hover:bg-bg-primary rounded-lg border border-border-subtle text-accent-gold transition-colors font-mono font-medium"
                          >
                            📂 View Raw MyNeta Ledger
                          </a>
                          <a 
                            href="https://affidavit.eci.gov.in/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary hover:bg-bg-primary rounded-lg border border-border-subtle text-text-primary hover:text-accent-gold transition-colors font-mono font-medium"
                          >
                            📥 Download Signed ECI Affidavit (PDF)
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-16 text-center space-y-3.5">
                <CheckCircle2 size={48} className="text-success-green mx-auto animate-bounce" />
                <div>
                  <h3 className="font-heading text-xl font-bold text-text-primary uppercase tracking-wide">
                    {t('crim_no_cases')}
                  </h3>
                  <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed font-sans">
                    {t('crim_no_cases_sub')}
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ===================== TAB 4: LEGISLATIVE ===================== */}
        {activeTab === 'legislative' && politician.parliamentActivity && (
          <div className="space-y-6">
            {politician.isAttendanceExempt ? (
              <div className="bg-bg-secondary/40 border border-border-subtle rounded-2xl p-6 md:p-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="p-4 bg-info-blue/10 border border-info-blue/20 text-info-blue rounded-2xl shrink-0">
                    <BookOpen size={32} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-heading text-xl font-bold text-text-primary">
                      Legislative Telemetry: Exempt
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                      As a <strong>{politician.role}</strong>, this representative serves in an executive leadership capacity (such as Prime Minister, Cabinet Minister, Chief Minister, or State Executive).
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                      Under Indian parliamentary standards and PRS Legislative Research guidelines, individual legislative activity metrics—including house attendance, participation in debates, submission of questions, and introduction of Private Member Bills—are <strong>not tracked or applicable</strong> for ministers and chief executives, as their primary responsibility lies in cabinet governance and executive administration.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-secondary rounded-lg border border-border-subtle text-xs font-mono font-medium text-accent-gold mt-2">
                      <span>Reason:</span>
                      <span className="text-text-primary">{politician.attendanceExemptReason || 'Executive Office'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Legislative comparative KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-center">
                  <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('parl_attendance')}</p>
                    <p className="text-2xl font-bold text-info-blue mt-1.5">{politician.parliamentActivity.attendance}%</p>
                    <p className="text-[10px] text-text-secondary mt-1">{t('parl_national_avg')}: {politician.parliamentActivity.attendanceAvg}%</p>
                  </div>
                  <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('parl_debates')}</p>
                    <p className="text-2xl font-bold text-text-primary mt-1.5">{politician.parliamentActivity.debatesCount}</p>
                    <p className="text-[10px] text-text-secondary mt-1">{t('parl_national_avg')}: {politician.parliamentActivity.debatesAvg}</p>
                  </div>
                  <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('parl_questions')}</p>
                    <p className="text-2xl font-bold text-text-primary mt-1.5">{politician.parliamentActivity.questionsCount}</p>
                    <p className="text-[10px] text-text-secondary mt-1">{t('parl_national_avg')}: {politician.parliamentActivity.questionsAvg}</p>
                  </div>
                  <div className="bg-bg-secondary border border-border-subtle p-4 rounded-xl shadow">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{t('parl_bills')}</p>
                    <p className="text-2xl font-bold text-text-primary mt-1.5">{politician.parliamentActivity.privateMemberBills}</p>
                    <p className="text-[10px] text-text-secondary mt-1">{t('parl_national_avg')}: {politician.parliamentActivity.billsAvg}</p>
                  </div>
                </div>

                {/* Performance charts compared to Average */}
                <Card className="border-border-subtle bg-bg-card">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5">
                      {t('parl_title')}
                    </h3>
                    
                    <div className="h-96 w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={legislativeChartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                          <XAxis dataKey="metric" stroke="#8B949E" tickLine={false} style={{ fontSize: 10, fontFamily: 'Space Mono' }} />
                          <YAxis stroke="#8B949E" tickLine={false} style={{ fontSize: 10, fontFamily: 'Space Mono' }} />
                          <Tooltip content={<CustomComparativeTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'Space Mono', paddingTop: 10 }} />
                          <Bar 
                            name="This Representative" 
                            dataKey="Representative" 
                            fill="#4299E1" 
                            radius={[4, 4, 0, 0]} 
                          />
                          <Bar 
                            name="Legislative Average" 
                            dataKey="Average" 
                            fill="#1C2128" 
                            stroke="#30363D"
                            strokeWidth={1.5}
                            radius={[4, 4, 0, 0]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="text-[10px] text-text-secondary leading-relaxed font-sans pt-1 border-t border-border-subtle/50 text-center">
                      * Note: "Private Bills" are scaled by x50 on the comparative chart to maintain clear visual proportions against high attendance percentages.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* ===================== TAB 5: PRESS SCAN ===================== */}
        {activeTab === 'press' && (
          <div className="space-y-6">
            {/* Press KPI Info Bar */}
            <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="bg-accent-gold/10 p-3 rounded-full shrink-0 border border-accent-gold/20 hidden sm:block">
                  <Newspaper size={28} className="text-accent-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wide">
                    MEDIA PRESS SCAN & SENTIMENT AUDIT
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-xl mt-1">
                    Live scan tracking of verified press coverage, investigative journalism reports, and official policy disclosures regarding this representative.
                  </p>
                </div>
              </div>

              <div className="bg-bg-secondary/70 border border-border-subtle px-6 py-3 rounded-xl font-mono text-center shadow shrink-0">
                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">TOTAL SCANNED REPORTS</span>
                <p className="text-3xl font-bold text-accent-gold mt-0.5">{politician.newsArticles?.length || 0} Articles</p>
              </div>
            </div>

            {/* Articles feed list */}
            {politician.newsArticles && politician.newsArticles.length > 0 ? (
              <div className="space-y-4">
                {politician.newsArticles.map((article) => (
                  <Card key={article.id} className="border-border-subtle bg-bg-card hover:border-accent-gold/35 transition-colors overflow-hidden">
                    <div className="p-5 space-y-3.5">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] text-text-secondary uppercase">
                            PUBLISHED BY <strong className="text-text-primary">{article.publisher}</strong> • {article.date}
                          </span>
                          <h4 className="font-heading text-lg font-bold text-text-primary group-hover:text-accent-gold transition-colors">
                            <DynamicText text={article.title} />
                          </h4>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono border-border-subtle/80 text-text-primary uppercase bg-bg-secondary">
                            {article.category}
                          </Badge>
                          <Badge 
                            variant={
                              article.sentiment === 'CRITICAL_ALLEGATION' ? 'danger' :
                              article.sentiment === 'POSITIVE_OUTCOME' ? 'success' : 'outline'
                            }
                            className="text-[10px] font-mono uppercase"
                          >
                            {article.sentiment.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed font-sans">
                        <DynamicText text={article.summary} />
                      </p>

                      <div className="flex justify-between items-center border-t border-border-subtle/30 pt-3.5 mt-2">
                        <span className="text-[10px] font-mono text-text-secondary uppercase">
                          AUDIT CLASSIFICATION: VERIFIED SCAN
                        </span>
                        
                        <a 
                          href={article.url} 
                          className="text-[10px] font-mono font-bold text-accent-gold hover:text-text-primary flex items-center gap-1"
                        >
                          OPEN PRESS REPORT <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-16 text-center space-y-3.5">
                <Newspaper size={48} className="text-text-secondary/40 mx-auto" />
                <div>
                  <h3 className="font-heading text-xl font-bold text-text-secondary uppercase tracking-wide">
                    NO DIRECT PRESS SCANS LOGGED
                  </h3>
                  <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed font-sans">
                    No verified investigative media publications or press scanner releases are currently indexed under this representative's file.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 6: MANIFESTO SCAN ===================== */}
        {activeTab === 'manifesto' && (
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-accent-gold/10 p-3 rounded-full shrink-0 border border-accent-gold/20 hidden sm:block">
                  <FileText size={28} className="text-accent-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wide">
                    CAMPAIGN MANIFESTO & Speech AGENDA AUDIT
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-xl mt-1">
                    Auditing what they promised vs how they behave. We parse campaign speeches, manifesto filings, and public pledges and cross-reference them against actual legislative votes.
                  </p>
                </div>
              </div>

              {politician.agendaExecutionRate !== undefined && (
                <div className="bg-bg-secondary/70 border border-border-subtle px-6 py-3 rounded-xl font-mono text-center shadow shrink-0">
                  <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">AGENDA EXECUTION RATE</span>
                  <p className={`text-3xl font-bold mt-0.5 ${
                    politician.agendaExecutionRate >= 70 ? 'text-success-green' :
                    politician.agendaExecutionRate >= 45 ? 'text-warning-amber' :
                    'text-danger-red'
                  }`}>{politician.agendaExecutionRate}%</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Sector Allocation Chart (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-border-subtle bg-bg-card">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-subtle pb-2.5">
                      PLEDGED SECTOR ALLOCATIONS
                    </h3>
                    
                    {manifestoSectorData.length > 0 ? (
                      <div className="space-y-4">
                        <div className="h-56 relative flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={manifestoSectorData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {manifestoSectorData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                content={({ active, payload }: any) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-bg-secondary border border-border-subtle p-2 rounded font-mono text-[10px]">
                                        <p className="font-bold text-text-primary">{payload[0].name.toUpperCase()}</p>
                                        <p className="text-accent-gold font-bold">{payload[0].value}% weight</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute text-center space-y-0.5">
                            <span className="text-[10px] text-text-secondary font-mono block uppercase">PRIMARY FOCUS</span>
                            <span className="text-sm font-heading font-bold text-text-primary">
                              {manifestoSectorData[0]?.name.toUpperCase() ?? 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-border-subtle/50 pt-4">
                          {manifestoSectorData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                              <span className="text-text-secondary truncate uppercase">{entry.name}:</span>
                              <span className="font-bold text-text-primary">{entry.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-56 flex flex-col items-center justify-center text-center text-text-secondary text-xs">
                        No semantic manifesto sectors parsed for this representative.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Audit Preventative Disclaimer */}
                <Card className="border-danger-red/20 bg-danger-red/5">
                  <CardContent className="p-4 space-y-2 text-xs text-text-secondary leading-relaxed">
                    <h4 className="font-mono font-bold text-danger-red text-[10px] uppercase tracking-wider flex items-center gap-1">
                      ⚠️ Promise vs. Vote Audit Loophole Flag
                    </h4>
                    <p className="font-sans">
                      Politicians frequently promise high expenditure on key welfare items (like water supply or health centers) during election campaigns but systematically vote against state allocations or let local development funds lapse. Our system parses local assembly minutes to compute actual alignment.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Pledges Audited list (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-border-subtle bg-bg-card">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-heading text-base font-bold text-text-primary border-b border-border-subtle pb-2.5">
                      AUDITED CAMPAIGN promises STATUS
                    </h3>

                    {politician.manifestoPledges && politician.manifestoPledges.length > 0 ? (
                      <div className="space-y-3">
                        {politician.manifestoPledges.map((pledge, idx) => (
                          <div 
                            key={idx} 
                            className="bg-bg-secondary border border-border-subtle/70 rounded-xl p-4 flex items-center justify-between gap-4 font-sans text-xs"
                          >
                            <div className="space-y-1 text-left min-w-0">
                              <span className="text-[9px] font-mono text-text-secondary uppercase">{pledge.category}</span>
                              <p className="font-medium text-text-primary leading-normal truncate">{pledge.pledge}</p>
                            </div>
                            
                            <Badge 
                              variant={
                                pledge.status === 'Fulfilled' ? 'success' :
                                pledge.status === 'Progress' ? 'info' : 'outline'
                              }
                              className="font-mono text-[9px] uppercase tracking-widest shrink-0"
                            >
                              {pledge.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center text-text-secondary text-xs">
                        No election pledges or campaign promise filings are mapped under this representative's file.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        )}

        {/* ===================== TAB 7: CONFLICTS LEDGER ===================== */}
        {activeTab === 'conflicts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Risk Meter & Summary */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-border-subtle bg-bg-card">
                  <CardContent className="p-6 text-center space-y-4">
                    <h3 className="font-heading text-lg font-bold text-text-primary border-b border-border-subtle pb-2.5 uppercase tracking-wide">
                      Citizen Risk Audit
                    </h3>
                    
                    {/* Radial Risk Meter */}
                    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                      {/* SVG Circle Gauge */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#1C2128"
                          strokeWidth="8"
                        />
                        {/* Colored progress bar */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={
                            (politician.conflictLedger && politician.conflictLedger.length > 0 ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length) : 0) >= 8 ? '#FF4560' :
                            (politician.conflictLedger && politician.conflictLedger.length > 0 ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length) : 0) >= 6 ? '#FEB019' : '#00E396'
                          }
                          strokeWidth="8"
                          strokeDasharray={251.3}
                          strokeDashoffset={251.3 * (1 - (politician.conflictLedger && politician.conflictLedger.length > 0 ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length) : 0) / 10)}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Center text score */}
                      <div className="absolute text-center space-y-0.5">
                        <p className="text-3xl font-mono font-bold text-text-primary">
                          {politician.conflictLedger && politician.conflictLedger.length > 0
                            ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length).toFixed(1)
                            : '0.0'}
                        </p>
                        <p className="text-[9px] uppercase font-mono text-text-secondary tracking-widest">
                          Risk Index
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge 
                        variant={
                          (politician.conflictLedger && politician.conflictLedger.length > 0
                            ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length) : 0) >= 8 ? 'danger' :
                          (politician.conflictLedger && politician.conflictLedger.length > 0
                            ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length) : 0) >= 6 ? 'warning' : 'success'
                        }
                        className="font-mono text-xs py-1 px-3"
                      >
                        {
                          (politician.conflictLedger && politician.conflictLedger.length > 0
                            ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length) : 0) >= 8 ? 'CRITICAL EXPOSURE' :
                          (politician.conflictLedger && politician.conflictLedger.length > 0
                            ? (politician.conflictLedger.reduce((sum, c) => sum + c.citizenRiskScore, 0) / politician.conflictLedger.length) : 0) >= 6 ? 'MODERATE EXPOSURE' : 'LOW EXPOSURE'
                        }
                      </Badge>
                      <p className="text-xs text-text-secondary leading-relaxed pt-2">
                        The Citizen Risk Index evaluates family business cartels, corporate funding nexus, and policy loopholes exploited to benefit private interests.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Audit Guidelines */}
                <Card className="border-border-subtle bg-bg-card">
                  <CardContent className="p-5 space-y-3 font-sans text-xs">
                    <h4 className="font-heading font-bold text-text-primary uppercase tracking-wide border-b border-border-subtle pb-2">
                      Auditing Parameters
                    </h4>
                    <ul className="space-y-2.5 text-text-secondary leading-relaxed">
                      <li className="flex gap-2">
                        <strong className="text-accent-gold shrink-0">1. Nepotism:</strong>
                        <span>Family members holding lucrative corporate director seats receiving public tenders.</span>
                      </li>
                      <li className="flex gap-2">
                        <strong className="text-accent-gold shrink-0">2. Concessions:</strong>
                        <span>Favorable zoning, tax exemptions, and fast-tracked clearances for friendly syndicates.</span>
                      </li>
                      <li className="flex gap-2">
                        <strong className="text-accent-gold shrink-0">3. Policy Nexus:</strong>
                        <span>Aggressively enacting mandates (like fuel blends) that enrich family commercial operations.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Conflicted Ledger Cases List */}
              <div className="lg:col-span-2 space-y-4">
                {politician.conflictLedger && politician.conflictLedger.length > 0 ? (
                  politician.conflictLedger.map((alert, idx) => (
                    <Card 
                      key={idx} 
                      className={`border bg-bg-card overflow-hidden hover:shadow-lg transition-all ${
                        alert.severity === 'CRITICAL' ? 'border-danger-red/30' :
                        alert.severity === 'HIGH' ? 'border-warning-amber/30' : 'border-border-subtle'
                      }`}
                    >
                      {/* Alert Header Row */}
                      <div className="bg-bg-secondary p-4 flex justify-between items-center border-b border-border-subtle/50 text-xs font-mono">
                        <div className="flex items-center gap-2.5">
                          <ShieldAlert 
                            size={16} 
                            className={
                              alert.severity === 'CRITICAL' ? 'text-danger-red' :
                              alert.severity === 'HIGH' ? 'text-warning-amber' : 'text-info-blue'
                            } 
                          />
                          <span className="font-bold text-text-primary text-sm tracking-wide">
                            {alert.title}
                          </span>
                        </div>
                        <Badge 
                          variant={
                            alert.severity === 'CRITICAL' ? 'danger' :
                            alert.severity === 'HIGH' ? 'warning' : 'outline'
                          }
                          className="font-mono text-[9px] px-2 py-0.5 rounded font-bold"
                        >
                          {alert.severity}
                        </Badge>
                      </div>

                      {/* Detailed comparative ledger compartments */}
                      <CardContent className="p-5 space-y-4 font-sans text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                          {/* Loophole Column */}
                          <div className="space-y-1.5 md:col-span-1">
                            <span className="text-[9px] uppercase font-mono font-bold text-danger-red">
                              The System Loophole
                            </span>
                            <p className="text-text-primary leading-relaxed">
                              {alert.loopholeExplored}
                            </p>
                          </div>

                          {/* Family/Corporate Connection */}
                          <div className="space-y-1.5 md:col-span-1 border-t md:border-t-0 md:border-x border-border-subtle/40 md:px-4">
                            <span className="text-[9px] uppercase font-mono font-bold text-accent-gold">
                              The Hidden Connections
                            </span>
                            <p className="text-text-primary leading-relaxed">
                              {alert.hiddenConnection}
                            </p>
                          </div>

                          {/* Policy Nexus */}
                          <div className="space-y-1.5 md:col-span-1">
                            <span className="text-[9px] uppercase font-mono font-bold text-info-blue">
                              The Policy/Manifesto Nexus
                            </span>
                            <p className="text-text-primary leading-relaxed">
                              {alert.policyNexus}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Score Ribbon */}
                        <div className="pt-3 border-t border-border-subtle/50 flex justify-between items-center font-mono text-[10px]">
                          <span className="text-text-secondary">INTEGRITY THREAT MATRIX</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-text-secondary">EXPOSURE SCORE:</span>
                            <span className={`font-bold ${
                              alert.citizenRiskScore >= 8 ? 'text-danger-red' :
                              alert.citizenRiskScore >= 6 ? 'text-warning-amber' : 'text-info-blue'
                            }`}>
                              {alert.citizenRiskScore} / 10
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-16 text-center space-y-3.5">
                    <CheckCircle2 size={48} className="text-success-green mx-auto animate-bounce" />
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text-primary uppercase tracking-wide">
                        PRISTINE INTEGRITY AUDIT
                      </h3>
                      <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed font-sans">
                        No active conflicts of interest, corporate tenders quid pro quo, or nepotism cartels have been mapped for this representative.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ===================== TAB: CAREER JOURNEY ===================== */}
        {activeTab === 'career' && (
          <div className="glass-panel rounded-2xl p-6 border border-border-subtle">
            <div className="mb-4 pb-4 border-b border-border-subtle">
              <h2 className="font-heading text-xl font-bold text-text-primary">
                राजनीतिक सफर / Political Journey
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Complete career timeline, party history & family dynasty connections
              </p>
            </div>
            <CareerTimeline politician={politician as any} />
          </div>
        )}

        {/* ===================== TAB: NEWS (ENHANCED) ===================== */}
        {activeTab === 'press' && (
          <div className="glass-panel rounded-2xl p-6 border border-border-subtle">
            <div className="mb-4 pb-4 border-b border-border-subtle">
              <h2 className="font-heading text-xl font-bold text-text-primary">
                Media Coverage & News
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Articles indexed from 50+ Indian news sources — sentiment classified by AI
              </p>
            </div>
            <NewsFeed politician={politician} />
          </div>
        )}

        {/* ===================== TAB: CITIZEN ACTIONS ===================== */}
        {activeTab === 'actions' && (
          <div className="max-w-2xl mx-auto glass-panel rounded-2xl p-6 border border-border-subtle">
            <div className="mb-4 pb-4 border-b border-border-subtle">
              <h2 className="font-heading text-xl font-bold text-text-primary">
                🙋 Apna Hak Jaano / Know Your Rights
              </h2>
              <p className="text-xs text-text-muted mt-1">
                File RTI, contact your neta, raise grievances through official channels
              </p>
            </div>
            <CitizenActionPanel politician={politician} />
          </div>
        )}

      </div>

    </div>
  );
};

export default PoliticianProfile;
