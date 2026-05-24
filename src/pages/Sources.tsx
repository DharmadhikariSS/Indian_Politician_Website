import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Scale, 
  AlertTriangle, 
  Database, 
  Layers, 
  Compass, 
  Map, 
  Newspaper,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface SourceItem {
  name: string;
  url: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  reliability: string;
}

const PRIMARY_REGISTRIES: SourceItem[] = [
  {
    name: "MyNeta Info (ADR)",
    url: "https://myneta.info/",
    category: "Electoral Affidavits & Declared Assets",
    icon: <Database size={20} className="text-accent-gold" />,
    description: "The primary digital portal maintained by the Association for Democratic Reforms (ADR), compiling legally sworn affidavits, asset sheets, and liabilities filings submitted by contesting candidates.",
    reliability: "ECI sworn records"
  },
  {
    name: "PRS Legislative Research",
    url: "https://prsindia.org/",
    category: "Legislative Telemetry & Activity",
    icon: <Compass size={20} className="text-info-blue" />,
    description: "An independent, non-partisan research body tracking precise Lok Sabha and Rajya Sabha attendance statistics, debates participated in, and questions asked by MPs.",
    reliability: "Official assembly ledgers"
  },
  {
    name: "Ministry of Corporate Affairs (MCA)",
    url: "https://www.mca.gov.in/",
    category: "Corporate Directors & DIN Filings",
    icon: <Building2 size={20} className="text-success-green" />,
    description: "Official portal of the Indian Corporate Registry. Tracks Director Identification Numbers (DIN), corporate shareholdings, and shell entity indicators.",
    reliability: "Government registry"
  },
  {
    name: "e-Courts India Portal",
    url: "https://ecourts.gov.in/",
    category: "Judicial trials & FIR Dossiers",
    icon: <Scale size={20} className="text-danger-red" />,
    description: "National judicial database tracking active trials, penal charges (IPC/BNS sections), magistrate hearings, and procedural court orders.",
    reliability: "Judiciary databases"
  },
  {
    name: "ICIJ Offshore Leaks Database",
    url: "https://offshoreleaks.icij.org/",
    category: "Offshore Shells & Trusts",
    icon: <Globe size={20} className="text-warning-amber" />,
    description: "International portal parsing offshore assets, beneficial owners, and shell corporations mapped across the Panama, Pandora, and Paradise Papers.",
    reliability: "Investigative archives"
  },
  {
    name: "CPGRAMS Grievance Portal",
    url: "https://pgportal.gov.in/",
    category: "Constituency Responsiveness",
    icon: <Newspaper size={20} className="text-text-secondary" />,
    description: "Official centralized public grievance monitoring system tracking the rate and timeline of citizen complaint resolutions in the district.",
    reliability: "Executive records"
  }
];

const LOOPHOLES = [
  {
    title: "Benami (Proxy) Corporate Clustering",
    icon: <Building2 className="text-accent-gold" size={24} />,
    explanation: "Politicians frequently register holding companies under proxy names (domestic staff or distant cousins) to mask actual ownership. Our algorithm detects this by identifying multiple multi-crore companies sharing the exact same physical filing address, phone cluster, or email domains.",
    prevention: "ROC filing audits & Balance-sheet unsecured loan checks."
  },
  {
    title: "Geographical Land Zoning Correlations",
    icon: <Map className="text-accent-gold" size={24} />,
    explanation: "Buying agricultural land cheaply in a family member's name and subsequently using executive zoning permits to fast-track its conversion into a commercial zone or aligning state expressways directly through those coordinate bounds.",
    prevention: "Affidavit land coordinate checks mapped onto GIS timeline zoning registers."
  },
  {
    title: "Sub-Contracting Conglomerate Webs",
    icon: <Layers className="text-accent-gold" size={24} />,
    explanation: "A relative's firm does not bid directly for public tenders to avoid regulatory audits. Instead, a large, independent conglomerate wins a ₹500Cr government project, and subsequently sub-contracts key parts of it (earthmoving, material supplies) to companies owned by the politician's sibling at highly inflated rates.",
    prevention: "Expense ledger auditing & Kinship director mappings."
  },
  {
    title: "Coercive Policy & Investigation Timelines",
    icon: <AlertTriangle className="text-accent-gold" size={24} />,
    explanation: "Initiating investigations or regulatory raids (via agencies like the ED) against corporations, which subsequently buy funding bonds or award sub-contracts to associated entities, leading the investigation to quietly go cold.",
    prevention: "Time-series graphs correlating Probe launches with Bond purchases."
  }
];

const Sources = () => {
  const [openLoopholeIdx, setOpenLoopholeIdx] = useState<number | null>(null);

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary">
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16">
        
        {/* Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto py-6">
          <div className="inline-flex items-center justify-center p-3 bg-accent-gold/15 rounded-full text-accent-gold mb-2">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            BACKGROUND <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-warning-amber">VERIFICATION</span> PORTAL
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-sans">
            Click-to-verify primary source registries and advanced corruption tracking audits.
          </p>
          <div className="pt-4 border-t border-border-subtle max-w-lg mx-auto">
            <Badge variant="outline" className="text-accent-gold border-accent-gold/30 font-mono tracking-widest uppercase">
              100% Verifiable & Unbiased Truths
            </Badge>
          </div>
        </section>

        {/* Clickable Registries Grid */}
        <section className="space-y-8">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-2xl font-heading font-bold text-text-primary">PRIMARY SOURCE REGISTRIES</h2>
            <p className="text-text-secondary text-sm">Direct, clickable links to verified databases to inspect the reality of any politician.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRIMARY_REGISTRIES.map((src, idx) => (
              <Card key={idx} className="bg-bg-secondary hover:border-text-secondary transition-all">
                <CardContent className="pt-6 space-y-4 text-left flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-bg-card border border-border-subtle rounded-lg shrink-0">
                        {src.icon}
                      </div>
                      <Badge variant="outline" className="text-[8px] font-mono border-border-subtle/80 uppercase">
                        {src.reliability}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-text-secondary uppercase">{src.category}</span>
                      <h3 className="font-heading font-bold text-base text-text-primary">{src.name}</h3>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {src.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border-subtle/50 mt-auto">
                    <a 
                      href={src.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <button className="w-full bg-bg-card border border-border-subtle hover:bg-bg-secondary font-mono font-bold text-[10px] py-2 rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm text-accent-gold">
                        OPEN SOURCE REGISTRY <ExternalLink size={10} />
                      </button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Loopholes Section */}
        <section className="space-y-8">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-2xl font-heading font-bold text-text-primary">UNCOVERING HIDE-OUTS: ADVANCED AUDITS</h2>
            <p className="text-text-secondary text-sm">How we audit details that are intentionally obscured from the general public.</p>
          </div>

          <div className="space-y-3">
            {LOOPHOLES.map((lh, idx) => {
              const isOpen = openLoopholeIdx === idx;
              return (
                <div 
                  key={idx}
                  className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenLoopholeIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-sm hover:text-accent-gold transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-3.5">
                      {lh.icon}
                      <span>{lh.title}</span>
                    </div>
                    <span className="text-text-secondary">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-border-subtle/50' : 'max-h-0'
                    }`}
                  >
                    <div className="p-5 text-xs text-text-secondary leading-relaxed font-sans bg-bg-card/30 space-y-3 text-left">
                      <p>{lh.explanation}</p>
                      <div className="bg-danger-red/5 border border-danger-red/10 rounded-lg p-3 text-danger-red font-mono text-[10px]">
                        <strong>AUDIT PREVENTATIVE:</strong> {lh.prevention}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Sources;
