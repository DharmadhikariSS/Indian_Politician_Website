import React, { useState } from 'react';
import {
  Trophy, XCircle, Users, Briefcase, AlertTriangle, Star,
  ArrowRight, ChevronDown, ChevronUp, Calendar, MapPin, Flag
} from 'lucide-react';
import type { DetailedPoliticianData } from '../../data/politicians';
import { useI18n } from '../../i18n/translations';

interface CareerEvent {
  year: number;
  event: string;
  role: string;
  party: string;
  constituency?: string;
  type: 'election_win' | 'election_loss' | 'party_join' | 'role_appointed' | 'controversy' | 'achievement' | 'entry';
  details: string;
  result?: 'won' | 'lost' | 'appointed' | 'resigned';
  margin?: number;
}

interface FamilyConnection {
  name: string;
  relation: string;
  role: string;
  party: string;
  yearsActive: string;
}

interface Props {
  politician: DetailedPoliticianData & {
    careerTimeline?: CareerEvent[];
    familyConnections?: FamilyConnection[];
    howEnteredPolitics?: string;
    studentPolitics?: string;
    partyHistory?: { party: string; from: number; to?: number; role: string }[];
  };
}

const EVENT_CONFIG = {
  election_win: {
    icon: Trophy,
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    label: 'Election Won',
  },
  election_loss: {
    icon: XCircle,
    color: '#FF4D4D',
    bg: 'rgba(255, 77, 77, 0.1)',
    border: 'rgba(255, 77, 77, 0.3)',
    label: 'Election Lost',
  },
  party_join: {
    icon: Flag,
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.3)',
    label: 'Party Joined',
  },
  role_appointed: {
    icon: Briefcase,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    label: 'Role Appointed',
  },
  controversy: {
    icon: AlertTriangle,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    label: 'Controversy',
  },
  achievement: {
    icon: Star,
    color: '#E8A020',
    bg: 'rgba(232, 160, 32, 0.1)',
    border: 'rgba(232, 160, 32, 0.3)',
    label: 'Achievement',
  },
  entry: {
    icon: ArrowRight,
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.3)',
    label: 'Entry into Politics',
  },
};

const PARTY_COLORS: Record<string, string> = {
  BJP: '#FF6B00',
  INC: '#0066CC',
  AAP: '#00BFFF',
  TMC: '#00AAE4',
  SP: '#E52D27',
  BSP: '#0066CC',
  NCP: '#005A96',
  SS: '#F0A500',
  JDU: '#006400',
  RJD: '#00CC00',
  CPI: '#CC0000',
  'CPI-M': '#CC0000',
  CPIM: '#CC0000',
  DMK: '#FF0000',
  AIADMK: '#009900',
  YSRCP: '#00A36C',
  TDP: '#FFFF00',
  BRS: '#FF69B4',
  TRS: '#FF69B4',
  BJD: '#006400',
  NC: '#00BFFF',
  PDP: '#006400',
  AIMIM: '#00CC44',
  JMM: '#006400',
  SAD: '#1B75BB',
};

function getPartyColor(party: string) {
  return PARTY_COLORS[party] || '#888899';
}

export function CareerTimeline({ politician }: Props) {
  const { t } = useI18n();
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const timeline = politician.careerTimeline || [];
  const displayedEvents = showAll ? timeline : timeline.slice(0, 6);

  const wins = timeline.filter(e => e.type === 'election_win').length;
  const losses = timeline.filter(e => e.type === 'election_loss').length;
  const partySwitches = (politician.partyHistory?.length || 1) - 1;

  return (
    <div className="space-y-6">

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t('career_election_wins'), value: wins, color: '#10B981', icon: Trophy },
          { label: t('career_election_losses'), value: losses, color: '#FF4D4D', icon: XCircle },
          { label: 'Party Switches', value: partySwitches, color: '#6366F1', icon: Flag },
          { label: t('field_active_since'), value: politician.activeSince || '—', color: '#E8A020', icon: Calendar },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-3 rounded-xl text-center">
            <stat.icon size={16} style={{ color: stat.color }} className="mx-auto mb-1.5" />
            <div className="text-xl font-black font-mono" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* How They Entered Politics */}
      {politician.howEnteredPolitics && (
        <div className="glass-panel rounded-xl p-4 border-l-2 border-accent-gold">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight size={14} className="text-accent-gold" />
            <h4 className="text-xs font-mono font-bold text-accent-gold uppercase tracking-widest">
              {t('career_how_entered')}
            </h4>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {politician.howEnteredPolitics}
          </p>
          {politician.studentPolitics && (
            <p className="text-xs text-text-muted mt-2 italic">
              🎓 {politician.studentPolitics}
            </p>
          )}
        </div>
      )}

      {/* Party History Bar */}
      {politician.partyHistory && politician.partyHistory.length > 0 && (
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flag size={14} className="text-accent-gold" />
            <h4 className="text-xs font-mono font-bold text-text-secondary uppercase tracking-widest">
              {t('career_party_history')}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {politician.partyHistory.map((ph, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold"
                  style={{
                    background: `${getPartyColor(ph.party)}18`,
                    color: getPartyColor(ph.party),
                    border: `1px solid ${getPartyColor(ph.party)}40`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: getPartyColor(ph.party) }}
                  />
                  {ph.party}
                  <span className="text-text-muted font-normal">
                    {ph.from}–{ph.to || 'Present'}
                  </span>
                </div>
                {i < (politician.partyHistory?.length || 0) - 1 && (
                  <ArrowRight size={12} className="text-text-muted" />
                )}
              </div>
            ))}
          </div>
          {partySwitches > 0 && (
            <p className="text-[10px] text-text-muted mt-2 font-mono">
              ⚠️ Switched parties {partySwitches} time{partySwitches > 1 ? 's' : ''} — National average: 1.2 switches per career
            </p>
          )}
        </div>
      )}

      {/* Family Dynasty Section */}
      {politician.familyConnections && politician.familyConnections.length > 0 && (
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-accent-gold" />
            <h4 className="text-xs font-mono font-bold text-text-secondary uppercase tracking-widest">
              {t('career_family')}
            </h4>
            <span className="tag-warning text-[9px]">DYNASTY</span>
          </div>
          <div className="space-y-2">
            {politician.familyConnections.map((fc, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: 'rgba(232, 160, 32, 0.15)', color: '#E8A020' }}
                >
                  {fc.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{fc.name}</span>
                    <span className="tag-gold text-[9px]">{fc.relation}</span>
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {fc.role} · {fc.party} · {fc.yearsActive}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={14} className="text-accent-gold" />
            <h4 className="text-xs font-mono font-bold text-text-secondary uppercase tracking-widest">
              {t('career_title')}
            </h4>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-5 top-0 bottom-0 w-px"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />

            <div className="space-y-3">
              {displayedEvents.map((event, i) => {
                const config = EVENT_CONFIG[event.type];
                const Icon = config.icon;
                const isExpanded = expandedEvent === i;

                return (
                  <div key={i} className="relative pl-12">
                    {/* Icon circle on line */}
                    <div
                      className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border"
                      style={{
                        background: config.bg,
                        borderColor: config.border,
                      }}
                    >
                      <Icon size={14} style={{ color: config.color }} />
                    </div>

                    <div
                      className="glass-panel rounded-xl p-3 cursor-pointer hover:bg-white/[0.04] transition-all"
                      onClick={() => setExpandedEvent(isExpanded ? null : i)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-accent-gold text-sm">
                              {event.year}
                            </span>
                            <span className="text-sm font-semibold text-text-primary">
                              {event.event}
                            </span>
                            {event.constituency && (
                              <span className="flex items-center gap-1 text-[10px] text-text-muted">
                                <MapPin size={9} />
                                {event.constituency}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: `${getPartyColor(event.party)}18`,
                                color: getPartyColor(event.party),
                              }}
                            >
                              {event.party}
                            </span>
                            <span className="text-[10px] text-text-muted">{event.role}</span>
                            {event.result === 'won' && (
                              <span className="tag-success text-[9px]">WON</span>
                            )}
                            {event.result === 'lost' && (
                              <span className="tag-danger text-[9px]">LOST</span>
                            )}
                            {event.margin && (
                              <span className="text-[10px] text-text-muted">
                                by {event.margin.toLocaleString('en-IN')} votes
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isExpanded
                            ? <ChevronUp size={14} className="text-text-muted" />
                            : <ChevronDown size={14} className="text-text-muted" />
                          }
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border-subtle">
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {event.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {timeline.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 py-2.5 text-xs font-mono font-bold text-accent-gold border border-accent-gold/20 rounded-xl hover:bg-accent-gold/5 transition-all flex items-center justify-center gap-2"
            >
              {showAll ? (
                <><ChevronUp size={12} /> Show Less</>
              ) : (
                <><ChevronDown size={12} /> Show {timeline.length - 6} More Events</>
              )}
            </button>
          )}
        </div>
      )}

      {timeline.length === 0 && (
        <div className="glass-panel rounded-xl p-8 text-center">
          <Calendar size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted">Career timeline data being compiled from ECI records.</p>
          <p className="text-xs text-text-muted mt-1">Source: Lok Dhaba, Sansad.in</p>
        </div>
      )}
    </div>
  );
}
