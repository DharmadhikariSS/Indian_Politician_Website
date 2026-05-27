import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, TrendingUp, TrendingDown, Scale, Building2,
  AlertTriangle, BadgeAlert, ChevronRight, Calendar
} from 'lucide-react';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { IntegrityScoreGauge } from './IntegrityScoreGauge';

export interface PoliticianData {
  id: string;
  name: string;
  role: string;
  party: string;
  state: string;
  photoUrl: string;
  isVerified: boolean;
  aiScore: number;
  netWorth: string;
  netWorthGrowth: number;
  criminalCases: number;
  attendancePct?: number;
  isAttendanceExempt?: boolean;
  attendanceExemptReason?: string;
  age?: number;
  termCount?: number;
  constituency?: string;
  flags: {
    edRaid?: boolean;
    convicted?: boolean;
    offshoreLink?: boolean;
    cronyism?: boolean;
    goodWork?: boolean;
  };
}

interface PoliticianCardProps {
  data: PoliticianData;
  layout?: 'grid' | 'list';
  rank?: number;
}

const getScoreColor = (score: number) => {
  if (score >= 71) return { text: 'text-success-green', bg: 'bg-success-green', glass: 'glass-success' };
  if (score >= 41) return { text: 'text-warning-amber', bg: 'bg-warning-amber', glass: '' };
  return { text: 'text-danger-red', bg: 'bg-danger-red', glass: 'glass-danger' };
};

const getScoreLabel = (score: number) => {
  if (score >= 85) return 'EXEMPLARY';
  if (score >= 71) return 'TRUSTWORTHY';
  if (score >= 55) return 'MODERATE';
  if (score >= 41) return 'CAUTION';
  if (score >= 25) return 'HIGH RISK';
  return 'CRITICAL';
};

export function PoliticianCard({ data, layout = 'grid', rank }: PoliticianCardProps) {
  const isList = layout === 'list';
  const colors = getScoreColor(data.aiScore);
  const hasCriticalFlags = data.flags.convicted || data.flags.edRaid;
  const flagCount = Object.values(data.flags).filter(Boolean).length;

  return (
    <Link to={`/politician/${data.id}`} className="block group" aria-label={`View ${data.name}'s profile`}>
      <div
        className={`
          relative glass-panel card-scan hover-glow rounded-2xl overflow-hidden
          border border-border-subtle
          ${hasCriticalFlags ? 'border-pulse' : ''}
          ${isList ? 'flex flex-row' : 'flex flex-col'}
          h-full
        `}
      >
        {/* ── Rank Badge (if provided) ── */}
        {rank !== undefined && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-black
              ${rank === 1 ? 'bg-accent-gold text-bg-primary' :
                rank === 2 ? 'bg-text-secondary/80 text-bg-primary' :
                rank === 3 ? 'bg-warning-amber/80 text-bg-primary' :
                'bg-bg-elevated text-text-secondary border border-border-medium'}
            `}>
              {rank}
            </div>
          </div>
        )}

        {/* ── Photo Area ── */}
        <div className={`relative ${isList ? 'w-36 shrink-0' : 'w-full pt-[72%] bg-bg-secondary'} overflow-hidden`}>
          <img
            src={data.photoUrl || 'https://placehold.co/400x400/0c0c10/4A4A57?text=?'}
            alt={data.name}
            className={`
              absolute top-0 left-0 w-full h-full object-cover object-top
              transition-transform duration-500 group-hover:scale-105
              ${isList ? 'rounded-l-2xl' : ''}
            `}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          
          {/* Gradient overlay at bottom */}
          {!isList && (
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/20 to-transparent" />
          )}

          {/* AI Score chip */}
          <div className="absolute top-2 right-2 z-10">
            <div className="glass-elevated rounded-xl p-1.5 shadow-xl">
              <IntegrityScoreGauge score={data.aiScore} size="sm" showLabel={false} />
            </div>
          </div>

          {/* Verified badge */}
          {data.isVerified && (
            <div className="absolute top-2 left-2 z-10 glass-elevated rounded-full p-1" title="Verified Profile">
              <ShieldCheck size={12} className="text-info-blue" />
            </div>
          )}

          {/* Party badge at bottom */}
          <div className={`
            absolute bottom-2 right-2 z-10
            glass-elevated rounded-md px-2 py-1
            text-[10px] font-mono font-bold text-text-primary
          `}>
            {data.party}
          </div>

          {/* Score label ribbon at bottom */}
          {!isList && (
            <div className={`
              absolute bottom-2 left-2 z-10 rounded-md px-2 py-0.5
              text-[9px] font-mono font-black uppercase tracking-wider
              ${data.aiScore >= 71 ? 'glass-success text-success-green' :
                data.aiScore >= 41 ? 'bg-warning-amber/15 text-warning-amber border border-warning-amber/20' :
                'glass-danger text-danger-red'}
            `}>
              {getScoreLabel(data.aiScore)}
            </div>
          )}
        </div>

        {/* ── Card Content ── */}
        <CardContent className={`p-4 flex flex-col flex-1 min-w-0 ${isList ? 'justify-between' : ''}`}>
          
          {/* Name & Role */}
          <div className="mb-3">
            <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-accent-gold transition-colors duration-200 truncate leading-tight">
              {data.name}
            </h3>
            <p className="text-[11px] text-text-secondary truncate mt-0.5 font-sans">
              {data.role}
              {data.constituency && ` • ${data.constituency}`}
            </p>
            <p className="text-[10px] text-text-muted truncate mt-0.5 font-mono">
              {data.state}
              {data.age && ` • Age ${data.age}`}
              {data.termCount && ` • ${data.termCount} terms`}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            
            {/* Net Worth */}
            <div className="bg-bg-secondary/50 rounded-lg p-2.5">
              <p className="text-[9px] uppercase text-text-muted font-mono tracking-wider mb-1">Net Worth</p>
              <p className="font-mono text-sm font-bold text-text-primary">
                ₹{data.netWorth}
              </p>
              <div className={`flex items-center gap-0.5 text-[10px] font-mono mt-0.5 ${
                data.netWorthGrowth > 50 ? 'text-danger-red' :
                data.netWorthGrowth > 20 ? 'text-warning-amber' :
                'text-success-green'
              }`}>
                {data.netWorthGrowth > 0 ? (
                  <><TrendingUp size={10} /> +{data.netWorthGrowth}%</>
                ) : (
                  <><TrendingDown size={10} /> {data.netWorthGrowth}%</>
                )}
              </div>
            </div>

            {/* Criminal Cases */}
            <div className={`rounded-lg p-2.5 ${
              data.criminalCases > 0 ? 'bg-danger-red/8 border border-danger-red/15' : 'bg-bg-secondary/50'
            }`}>
              <p className="text-[9px] uppercase text-text-muted font-mono tracking-wider mb-1">Cases</p>
              {data.criminalCases > 0 ? (
                <>
                  <p className="font-mono text-sm font-black text-danger-red">{data.criminalCases}</p>
                  <p className="text-[9px] text-danger-red/70 font-mono">Pending</p>
                </>
              ) : (
                <>
                  <p className="font-mono text-sm font-black text-success-green">0</p>
                  <p className="text-[9px] text-success-green/70 font-mono">Clean</p>
                </>
              )}
            </div>
          </div>

          {/* Attendance Bar */}
          {!data.isAttendanceExempt && data.attendancePct !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] uppercase font-mono text-text-muted tracking-wider">Attendance</span>
                <span className={`text-[10px] font-mono font-bold ${
                  data.attendancePct < 60 ? 'text-danger-red' :
                  data.attendancePct > 80 ? 'text-success-green' : 'text-warning-amber'
                }`}>{data.attendancePct}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${
                    data.attendancePct < 60 ? 'bg-danger-red' :
                    data.attendancePct > 80 ? 'bg-success-green' : 'bg-warning-amber'
                  }`}
                  style={{ width: `${data.attendancePct}%` }}
                />
              </div>
            </div>
          )}

          {data.isAttendanceExempt && (
            <div className="mb-3 text-[9px] font-mono text-text-muted bg-bg-secondary/50 rounded-lg px-2.5 py-1.5">
              {data.attendanceExemptReason || 'Executive role — attendance exempt'}
            </div>
          )}

          {/* Flags */}
          {flagCount > 0 && (
            <div className="mt-auto pt-2.5 border-t border-border-subtle/50 flex flex-wrap gap-1">
              {data.flags.edRaid && (
                <span className="tag-warning flex items-center gap-0.5">
                  <BadgeAlert size={8} /> ED Raid
                </span>
              )}
              {data.flags.convicted && (
                <span className="tag-danger flex items-center gap-0.5">
                  <AlertTriangle size={8} /> Convicted
                </span>
              )}
              {data.flags.offshoreLink && (
                <span className="tag-info">💰 Offshore</span>
              )}
              {data.flags.cronyism && (
                <span className="tag-gold flex items-center gap-0.5">
                  <Building2 size={8} /> Cronyism
                </span>
              )}
              {data.flags.goodWork && (
                <span className="tag-success">✅ Good Work</span>
              )}
            </div>
          )}
        </CardContent>

        {/* ── View Profile CTA (hover only) ── */}
        <div className={`
          absolute bottom-0 left-0 right-0
          flex items-center justify-center gap-1
          py-2.5 font-mono text-[10px] font-bold text-accent-gold
          bg-gradient-to-t from-bg-primary/95 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
        `}>
          VIEW FULL DOSSIER <ChevronRight size={12} />
        </div>
      </div>
    </Link>
  );
}
