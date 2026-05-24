import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  TrendingUp, 
  BookOpen, 
  Newspaper, 
  Database, 
  FileSearch, 
  Building2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  ExternalLink, 
  MessageSquare 
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How often is politician data updated?",
    answer: "Our web scraping agents monitor official public databases, including the Election Commission of India (ECI) affidavits and PRS Legislative Research, on a weekly cadence. Any newly published criminal case disclosures, financial filings, or session attendance sheets are ingested, parsed, and updated in our system within 48 hours of original publication."
  },
  {
    question: "Is NETATTRACK affiliated with any political party?",
    answer: "No. NETATTRACK is a 100% independent, non-partisan civic technology platform. We have no affiliations with any political party, candidate, or corporate interest. Our development is fully open-source, and our rating algorithms apply uniform mathematical criteria to all public representatives, regardless of their political alignment."
  },
  {
    question: "How can I report data inaccuracies?",
    answer: "If you detect any discrepancy or outdated information on a representative's profile, you can raise an issue directly on our GitHub repository. Please provide primary government document links (e.g., ECI affidavit PDFs, official parliament ledger rows) to support your claim. Our editorial and moderation team audits all reports to maintain the highest standards of data integrity."
  },
  {
    question: "What does the AI Integrity Score represent?",
    answer: "The AI Integrity Score is a mathematical index calculated by aggregating publicly available quantitative variables across four key pillars: Criminal Records (35% weight), Financial Integrity (30% weight), Legislative Performance (20% weight), and Media Sentiment (15% weight). It is a structural assessment of compliance, transparency, and public devotion, not a political or subjective opinion."
  },
  {
    question: "How is the risk level classification determined?",
    answer: "We classify politicians into four distinct risk tiers based on their composite AI Integrity Score: 0-25 is classified as 'CRITICAL' (substantial criminal charges, extreme asset inflation, or major session absence); 26-40 as 'HIGH'; 41-70 as 'MEDIUM'; and 71-100 as 'LOW' risk (exemplary transparency, clean criminal record, and active legislative participation)."
  },
  {
    question: "Is my browsing data collected or tracked?",
    answer: "No. We believe in absolute user privacy. NETATTRACK does not employ tracking cookies, advertising pixels, or analytics engines. Your queries and searches are fully anonymous. The entire platform is hosted as an open-source public good."
  }
];

const About = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary">
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto py-6">
          <div className="inline-flex items-center justify-center p-3 bg-accent-gold/15 rounded-full text-accent-gold mb-2">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-warning-amber">NETATTRACK</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-sans">
            Transparent, data-driven civic intelligence for every Indian voter.
          </p>
          <div className="pt-4 border-t border-border-subtle max-w-lg mx-auto">
            <Badge variant="outline" className="text-accent-gold border-accent-gold/30 font-mono tracking-widest uppercase">
              Non-Partisan Civic Tech Platform
            </Badge>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed pt-2">
            NETATTRACK is an independent, open-source technology platform designed to empower citizens by synthesizing complex public disclosures into clear, actionable integrity telemetry. We believe that deep democratic transparency is the foundation of institutional accountability.
          </p>
        </section>

        {/* AI Scoring Methodology Section */}
        <section className="space-y-8">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-2xl font-heading font-bold text-text-primary">HOW THE AI INTEGRITY SCORE WORKS</h2>
            <p className="text-text-secondary text-sm">A rigorous mathematical composite index measuring accountability and compliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-bg-secondary hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="w-10 h-10 bg-danger-red/10 rounded-lg flex items-center justify-center text-danger-red">
                  <Scale size={20} />
                </div>
                <h3 className="font-heading font-bold text-base">Criminal Records</h3>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-text-primary">35%</span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase">Weight</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Scans courts and FIR databases. Penalizes active cases, IPC/BNS charges (crimes against women, corruption), and conviction states.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="w-10 h-10 bg-warning-amber/10 rounded-lg flex items-center justify-center text-warning-amber">
                  <TrendingUp size={20} />
                </div>
                <h3 className="font-heading font-bold text-base">Financial Integrity</h3>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-text-primary">30%</span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase">Weight</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Audits declarations across terms. Penalizes disproportionate asset inflation that significantly exceeds declared salary margins and normal index inflation rates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="w-10 h-10 bg-info-blue/10 rounded-lg flex items-center justify-center text-info-blue">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-heading font-bold text-base">Legislative Activity</h3>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-text-primary">20%</span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase">Weight</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Measures parliamentary session attendance records, frequency of debates participated in, questions raised, and private member bills introduced.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="w-10 h-10 bg-accent-gold/10 rounded-lg flex items-center justify-center text-accent-gold">
                  <Newspaper size={20} />
                </div>
                <h3 className="font-heading font-bold text-base">Sentiment Scan</h3>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-text-primary">15%</span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase">Weight</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Runs natural language processing algorithms on mainstream and investigative journalism. Classifies reports as positive outcomes or verified integrity alerts.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Tiers Table */}
          <div className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden mt-6">
            <div className="p-4 bg-bg-card border-b border-border-subtle">
              <h4 className="font-heading font-bold text-sm tracking-wide text-text-primary uppercase">Risk Classification Thresholds</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary font-mono">
                    <th className="p-4">SCORE RANGE</th>
                    <th className="p-4">RISK CLASSIFICATION</th>
                    <th className="p-4">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-sans text-text-primary">
                  <tr className="hover:bg-bg-card/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-success-green">71 - 100</td>
                    <td className="p-4"><Badge variant="success">LOW RISK</Badge></td>
                    <td className="p-4 text-text-secondary">Clean background disclosures, compliant financial charts, and regular legislative participation.</td>
                  </tr>
                  <tr className="hover:bg-bg-card/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-warning-amber">41 - 70</td>
                    <td className="p-4"><Badge variant="warning">MEDIUM RISK</Badge></td>
                    <td className="p-4 text-text-secondary">Moderate declared asset growth, minor protest-related FIR entries, or average legislative attendance.</td>
                  </tr>
                  <tr className="hover:bg-bg-card/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-danger-red">26 - 40</td>
                    <td className="p-4"><Badge variant="danger">HIGH RISK</Badge></td>
                    <td className="p-4 text-text-secondary">Significant asset discrepancy query, unresolved criminal charges, or low parliamentary participation.</td>
                  </tr>
                  <tr className="hover:bg-bg-card/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-danger-red border-l-4 border-l-danger-red">0 - 25</td>
                    <td className="p-4"><Badge variant="danger" className="bg-red-700/35 border-red-700 text-red-500 font-extrabold">CRITICAL RISK</Badge></td>
                    <td className="p-4 text-text-secondary">Severe active criminal proceedings (corruption, extortion), extreme wealth inflation, or chronic session absence.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Data Ingestion Sources */}
        <section className="space-y-8">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-2xl font-heading font-bold text-text-primary">DATA INGESTION SOURCES</h2>
            <p className="text-text-secondary text-sm">Where we aggregate our primary source material. All data is verifiable at the origin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-bg-secondary border-border-subtle hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-3">
                <Database size={24} className="text-accent-gold" />
                <h3 className="font-heading font-bold text-sm">MyNeta / Election Commission</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Declared candidates' affidavits, educational filings, asset sheets, liabilities registers, and self-reported active criminal listings.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary border-border-subtle hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-3">
                <FileSearch size={24} className="text-accent-gold" />
                <h3 className="font-heading font-bold text-sm">PRS Legislative Research</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Precise session attendance tracking, question database query arrays, speech logs, bill draft sponsorship index registers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary border-border-subtle hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-3">
                <Scale size={24} className="text-accent-gold" />
                <h3 className="font-heading font-bold text-sm">e-Courts India Portal</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Active trial statuses, FIR docket registry filings, judicial hearings records, charge sheet declarations, and historical conviction files.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary border-border-subtle hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-3">
                <Building2 size={24} className="text-accent-gold" />
                <h3 className="font-heading font-bold text-sm">MCA Corporate Registry</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Director Identification Numbers (DIN), corporate shareholdings, shell entity listings, and directorship audits on active companies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary border-border-subtle hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-3">
                <Globe size={24} className="text-accent-gold" />
                <h3 className="font-heading font-bold text-sm">Electoral Bonds Records</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Corporate bond purchases, candidate/party receipt ledger links, and disclosure sheets released under Supreme Court mandates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-secondary border-border-subtle hover:border-text-secondary transition-colors">
              <CardContent className="pt-6 space-y-3">
                <MessageSquare size={24} className="text-accent-gold" />
                <h3 className="font-heading font-bold text-sm">CPGRAMS & CAG Audits</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Grievance resolution rates, local constituency development (MPLADS) fund audits, and Comptroller General compliance filings.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive FAQ Accordion */}
        <section className="space-y-8">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-2xl font-heading font-bold text-text-primary">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-text-secondary text-sm">Answers to common queries regarding transparency, data processing, and platform ethics.</p>
          </div>

          <div className="space-y-3">
            {FAQ_DATA.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-sm hover:text-accent-gold transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="text-text-secondary">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-border-subtle/50' : 'max-h-0'
                    }`}
                  >
                    <p className="p-5 text-xs text-text-secondary leading-relaxed font-sans bg-bg-card/30">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Legal & Compliance Disclaimer Section */}
        <section className="bg-bg-secondary/40 border border-border-subtle rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 text-warning-amber">
            <AlertTriangle size={24} />
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider">LEGAL DISCLAIMER & COMPLIANCE</h3>
          </div>
          <div className="text-xs text-text-secondary space-y-3 leading-relaxed font-sans">
            <p>
              The AI Integrity Score and individual risk assessments displayed on NETATTRACK are structural composite indices computed exclusively using publicly available public filings. These are generated via transparent, reproducible mathematical algorithms and do not represent political opinions, personal endorsements, or subjective reviews.
            </p>
            <p>
              We maintain absolute respect for constitutional rights and the judicial process. An active criminal case is an allegation and does not equate to a conviction. The data presented on this website is for informational, civic awareness purposes only. All parameters can be audited and cross-referenced with official, verified ECI and judiciary sources.
            </p>
          </div>
        </section>

        {/* Contact/Contribute Section */}
        <section className="text-center bg-gradient-to-b from-bg-secondary to-bg-primary border border-border-subtle rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-heading font-bold text-text-primary">CONTRIBUTE TO CIVIC TRANSPARENCY</h2>
          <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-md mx-auto">
            NETATTRACK is entirely open-source. Help us audit algorithms, add regional scraper modules, or translate features into local languages.
          </p>
          <div className="flex justify-center pt-2">
            <a 
              href="https://github.com/DharmadhikariSS/Indian_Politician_Website"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-bg-card border border-border-subtle hover:border-text-secondary text-text-primary px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
                <svg className="w-4 h-4 fill-current mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                VIEW CODE ON GITHUB <ExternalLink size={12} />
              </button>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
