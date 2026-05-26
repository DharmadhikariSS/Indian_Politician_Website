import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, TrendingDown, Scale, Building2, AlertTriangle, BadgeAlert } from 'lucide-react';
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
}

export function PoliticianCard({ data, layout = 'grid' }: PoliticianCardProps) {
  const isList = layout === 'list';

  return (
    <Link to={`/politician/${data.id}`} className="block transition-transform hover:-translate-y-1 hover:shadow-lg">
      <Card className={`h-full border-border-subtle bg-bg-card overflow-hidden ${isList ? 'flex flex-row' : 'flex flex-col'}`}>
        <div className={`relative ${isList ? 'w-48 shrink-0' : 'w-full pt-[75%] bg-bg-secondary'}`}>
          <img 
            src={data.photoUrl || "https://placehold.co/400x400/161B22/E6EDF3?text=Photo"} 
            alt={data.name} 
            className={`absolute top-0 left-0 w-full h-full object-cover ${isList ? 'rounded-l-xl' : ''}`}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            <div className="bg-bg-primary/90 backdrop-blur-sm p-1 rounded-full shadow-md">
              <IntegrityScoreGauge score={data.aiScore} size="sm" showLabel={false} />
            </div>
          </div>
          {data.isVerified && (
            <div className="absolute bottom-2 left-2 bg-info-blue text-white p-1 rounded-full shadow-md" title="Verified Profile">
              <ShieldCheck size={14} />
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-bg-primary/80 backdrop-blur-md px-2 py-1 text-xs font-bold rounded shadow-md border border-border-subtle">
            {data.party}
          </div>
        </div>

        <CardContent className={`p-4 flex flex-col flex-1 ${isList ? 'justify-center' : ''}`}>
          <div className="mb-1">
            <h3 className="font-heading text-lg font-bold truncate text-text-primary group-hover:text-accent-gold transition-colors">
              {data.name}
            </h3>
            <p className="text-xs text-text-secondary truncate">
              {data.role} • {data.state}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div>
              <p className="text-[10px] uppercase text-text-secondary font-semibold">Net Worth</p>
              <p className="font-mono text-sm font-bold flex items-center gap-1">
                ₹{data.netWorth}
                {data.netWorthGrowth > 0 ? (
                  <span className="text-danger-red text-[10px] flex items-center"><TrendingUp size={12}/>{data.netWorthGrowth}%</span>
                ) : (
                  <span className="text-success-green text-[10px] flex items-center"><TrendingDown size={12}/>{Math.abs(data.netWorthGrowth)}%</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-text-secondary font-semibold">Criminal Cases</p>
              {data.criminalCases > 0 ? (
                <Badge variant="danger" className="mt-0.5"><Scale size={10} className="mr-1"/> {data.criminalCases} Cases</Badge>
              ) : (
                <Badge variant="success" className="mt-0.5">Clean Record</Badge>
              )}
            </div>
            {data.isAttendanceExempt ? (
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] uppercase text-text-secondary font-semibold">Attendance</p>
                  <p className="text-[10px] text-text-secondary font-mono font-bold bg-bg-secondary px-1.5 py-0.5 rounded truncate max-w-[120px]" title={data.attendanceExemptReason}>
                    {data.attendanceExemptReason || 'N/A (Exempt)'}
                  </p>
                </div>
                <div className="w-full bg-bg-secondary rounded-full h-1.5 opacity-40">
                  <div 
                    className="h-1.5 rounded-full bg-text-secondary" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            ) : data.attendancePct !== undefined && (
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] uppercase text-text-secondary font-semibold">Attendance</p>
                  <p className={`text-xs font-mono font-bold ${data.attendancePct < 60 ? 'text-danger-red' : data.attendancePct > 80 ? 'text-success-green' : 'text-warning-amber'}`}>
                    {data.attendancePct}%
                  </p>
                </div>
                <div className="w-full bg-bg-secondary rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${data.attendancePct < 60 ? 'bg-danger-red' : data.attendancePct > 80 ? 'bg-success-green' : 'bg-warning-amber'}`} 
                    style={{ width: `${data.attendancePct}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-2 border-t border-border-subtle flex flex-wrap gap-1.5">
            {data.flags.edRaid && <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-bg-secondary"><BadgeAlert size={10} className="mr-1 text-warning-amber"/> ED Raid</Badge>}
            {data.flags.convicted && <Badge variant="danger" className="text-[10px] px-1.5 py-0"><AlertTriangle size={10} className="mr-1"/> Convicted</Badge>}
            {data.flags.offshoreLink && <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-bg-secondary">💰 Offshore</Badge>}
            {data.flags.cronyism && <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-bg-secondary"><Building2 size={10} className="mr-1 text-accent-gold"/> Cronyism</Badge>}
            {data.flags.goodWork && <Badge variant="success" className="text-[10px] px-1.5 py-0">✅ Good Work</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
