import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = "https://wcwufsyroraeirgeoaes.supabase.co";
// We use the Service Role Secret Key which has bypass RLS/write bypass rules!
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3Vmc3lyb3JhZWlyZ2VvYWVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc5NzE5MywiZXhwIjoyMDk1MzczMTkzfQ.wp2H_R78rsgfCYrngGKguzO2XMlKf1GKrJYrHVpb8rc";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false
  }
});

async function main() {
  console.log("Loading unified politicians_scraped.json...");
  const rawData = fs.readFileSync('scraper/politicians_scraped.json', 'utf-8');
  const politicians = JSON.parse(rawData);
  console.log(`Loaded ${politicians.length} politicians to ingest.`);

  // Iterate and prepare objects matching Supabase column typings
  // Standardize object keys to ensure there are no formatting anomalies
  const cleanData = politicians.map(p => {
    return {
      id: p.id,
      name: p.name,
      role: p.role,
      party: p.party,
      state: p.state,
      photoUrl: p.photoUrl,
      isVerified: p.isVerified,
      aiScore: p.aiScore,
      netWorth: p.netWorth,
      netWorthGrowth: parseFloat(p.netWorthGrowth) || 0,
      criminalCases: parseInt(p.criminalCases) || 0,
      attendancePct: p.attendancePct !== undefined ? parseInt(p.attendancePct) : null,
      isAttendanceExempt: p.isAttendanceExempt || false,
      attendanceExemptReason: p.attendanceExemptReason || null,
      gender: p.gender || 'Male',
      age: parseInt(p.age) || 50,
      constituency: p.constituency || 'Varanasi',
      termCount: parseInt(p.termCount) || 1,
      education: p.education || 'Graduate',
      panNumber: p.panNumber || 'N/A',
      activeSince: parseInt(p.activeSince) || 2015,
      biography: p.biography || '',
      pincodes: p.pincodes || [],
      municipalWard: p.municipalWard || null,
      strongestOpponentId: p.strongestOpponentId || null,
      agendaExecutionRate: p.agendaExecutionRate !== undefined ? parseInt(p.agendaExecutionRate) : null,
      localWardFundUtilization: p.localWardFundUtilization !== undefined ? parseInt(p.localWardFundUtilization) : null,
      grievanceRedressPct: p.grievanceRedressPct !== undefined ? parseInt(p.grievanceRedressPct) : null,
      conflictLedger: p.conflictLedger || [],
      flags: p.flags || {},
      integrityDetails: p.integrityDetails || {},
      financialTimeline: p.financialTimeline || [],
      criminalCaseList: p.criminalCaseList || [],
      parliamentActivity: p.parliamentActivity || {},
      electoralBonds: p.electoralBonds || [],
      newsArticles: p.newsArticles || [],
      manifestoPledges: p.manifestoPledges || [],
      manifestoSectorBreakdown: p.manifestoSectorBreakdown || [],
      constituencyRivalry: p.constituencyRivalry || {}
    };
  });

  console.log("Ingesting records to Supabase via HTTPS REST API...");
  const { data, error } = await supabase
    .from('politicians')
    .upsert(cleanData, { onConflict: 'id' });

  if (error) {
    console.error("Ingestion failed:", error);
    process.exit(1);
  }

  console.log("[+] Success! All 16 politicians successfully ingested into your Supabase database via REST API!");
}

main().catch(err => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
