import React, { useState } from 'react';
import {
  Phone, Mail, Globe, FileText, MessageSquare, AlertTriangle,
  ExternalLink, Copy, Check, Building2, MapPin, ChevronDown, ChevronUp
} from 'lucide-react';
import type { DetailedPoliticianData } from '../../data/politicians';
import { useI18n } from '../../i18n/translations';

interface Props {
  politician: DetailedPoliticianData;
}

interface RTITemplate {
  title: string;
  body: string;
}

function generateRTITemplate(politician: DetailedPoliticianData): RTITemplate {
  return {
    title: `RTI Application: Information about ${politician.name} (${politician.constituency}, ${politician.state})`,
    body: `The Public Information Officer,
[Concerned Ministry/Department]

Sub: Application under Right to Information Act, 2005

Respected Sir/Madam,

I, the undersigned, a citizen of India, request the following information under the Right to Information Act, 2005:

1. Complete details of MPLADS/MLALAD funds sanctioned and utilized by ${politician.name} (${politician.role}) for the constituency of ${politician.constituency}, ${politician.state}, from the year ${politician.activeSince || 2004} to the present date.

2. A list of all projects recommended, sanctioned, and completed under the above fund, with their current status and expenditure details.

3. Copies of all public works committee reports related to the above constituency.

4. Details of any audit objections, CAG observations, or administrative action related to the above.

I am enclosing the prescribed fee of ₹10/- via [DD/IPO/Online].

Name: [Your Name]
Address: [Your Address]
Contact: [Your Contact]
Date: ${new Date().toLocaleDateString('en-IN')}

Yours faithfully,
[Your Signature]`,
  };
}

const GRIEVANCE_PORTALS = [
  {
    name: 'PM Grievance Portal (CPGRAMS)',
    url: 'https://pgportal.gov.in',
    desc: 'Central government grievances — fastest resolution',
    icon: '🏛️',
  },
  {
    name: 'National Voter Services Portal',
    url: 'https://voters.eci.gov.in',
    desc: 'Voter registration, name correction, polling booth',
    icon: '🗳️',
  },
  {
    name: 'RTI Online Portal (Govt of India)',
    url: 'https://rtionline.gov.in',
    desc: 'File RTI with any central ministry (₹10 fee)',
    icon: '📋',
  },
  {
    name: 'eCourts Case Status',
    url: 'https://ecourts.gov.in/ecourts_home/index.php',
    desc: 'Track court cases across India',
    icon: '⚖️',
  },
  {
    name: 'Aadhar Grievance Portal',
    url: 'https://uidai.gov.in',
    desc: 'Issues with Aadhaar-linked services',
    icon: '🪪',
  },
];

export function CitizenActionPanel({ politician }: Props) {
  const { t } = useI18n();
  const [copiedRTI, setCopiedRTI] = useState(false);
  const [showRTI, setShowRTI] = useState(false);
  const [showPortals, setShowPortals] = useState(false);

  const rtiTemplate = generateRTITemplate(politician);

  const handleCopyRTI = () => {
    navigator.clipboard.writeText(rtiTemplate.body).then(() => {
      setCopiedRTI(true);
      setTimeout(() => setCopiedRTI(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
        <MessageSquare size={14} className="text-accent-gold" />
        <h4 className="text-xs font-mono font-bold text-text-secondary uppercase tracking-widest">
          Citizen Action Center
        </h4>
        <span className="tag-gold text-[9px]">YOUR RIGHTS</span>
      </div>

      {/* Contact Your Neta */}
      <div className="glass-panel rounded-xl p-4">
        <h5 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Phone size={14} className="text-success-green" />
          {t('contact_neta')}
        </h5>
        <div className="space-y-2">
          {[
            {
              icon: Building2,
              label: 'Parliament Office',
              value: `Room 70, Parliament House, New Delhi — 110001`,
              link: null,
              color: '#6366F1',
            },
            {
              icon: MapPin,
              label: 'Constituency Office',
              value: `${politician.constituency}, ${politician.state}`,
              link: null,
              color: '#10B981',
            },
            {
              icon: Globe,
              label: 'Official Website',
              value: `sansad.in/members`,
              link: `https://sansad.in/ls/members/`,
              color: '#E8A020',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
              <item.icon size={14} style={{ color: item.color }} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-text-muted">{item.label}</div>
                <div className="text-xs text-text-primary truncate">{item.value}</div>
              </div>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={11} className="text-text-muted hover:text-accent-gold transition-colors" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File RTI */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <button
          onClick={() => setShowRTI(!showRTI)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-info-blue" />
            <div>
              <div className="text-sm font-semibold text-text-primary text-left">{t('file_rti')}</div>
              <div className="text-[10px] text-text-muted text-left">Get MPLADS data for {politician.constituency}</div>
            </div>
          </div>
          {showRTI ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
        </button>

        {showRTI && (
          <div className="px-4 pb-4 space-y-3 border-t border-border-subtle">
            <p className="text-xs text-text-muted leading-relaxed pt-3">
              You have the right to information under the <strong className="text-text-secondary">RTI Act, 2005</strong>.
              File this template with the concerned government department. Fee: <strong className="text-accent-gold">₹10</strong>.
            </p>

            <div className="bg-bg-primary rounded-lg p-3 border border-border-subtle text-xs text-text-secondary font-mono leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
              {rtiTemplate.body.slice(0, 400)}...
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyRTI}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  copiedRTI
                    ? 'bg-success-green/20 text-success-green border border-success-green/30'
                    : 'border border-info-blue/30 text-info-blue hover:bg-info-blue/10'
                }`}
              >
                {copiedRTI ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy RTI Template</>}
              </button>
              <a
                href="https://rtionline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-bold border border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 transition-all"
              >
                <ExternalLink size={12} /> File Online →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* File Complaint */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <button
          onClick={() => setShowPortals(!showPortals)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-warning-amber" />
            <div>
              <div className="text-sm font-semibold text-text-primary text-left">{t('file_complaint')}</div>
              <div className="text-[10px] text-text-muted text-left">Grievance portals & official channels</div>
            </div>
          </div>
          {showPortals ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
        </button>

        {showPortals && (
          <div className="px-4 pb-4 space-y-2 border-t border-border-subtle pt-3">
            {GRIEVANCE_PORTALS.map((portal, i) => (
              <a
                key={i}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
              >
                <span className="text-lg flex-shrink-0">{portal.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                    {portal.name}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">{portal.desc}</div>
                </div>
                <ExternalLink size={11} className="text-text-muted group-hover:text-accent-gold transition-colors flex-shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Voter Rights Reminder */}
      <div className="glass-panel rounded-xl p-3 border border-info-blue/20">
        <p className="text-[10px] font-mono text-info-blue uppercase tracking-wider mb-1.5 font-bold">
          ℹ️ Know Your Rights
        </p>
        <ul className="text-[10px] text-text-muted space-y-1 leading-relaxed">
          <li>• MPs must be accessible to constituents — they hold public office</li>
          <li>• MPLADS (₹5 Cr/year) is YOUR money. Demand accountability.</li>
          <li>• RTI responses must come within 30 days or first appeal applies</li>
          <li>• You can raise issues in Parliament via your MP — write to them!</li>
        </ul>
      </div>
    </div>
  );
}
