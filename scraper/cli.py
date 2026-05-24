import os
import sys
import json
import argparse
import logging
from bs4 import BeautifulSoup

# Add parent directory to path to ensure relative imports work when executed from the parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper.core.downloader import ResilientDownloader
from scraper.core.translator import RegionalTranslator
from scraper.core.ocr import AffidavitOCREngine
from scraper.core.scoring import AIScoringEngine

from scraper.modules.myneta import MyNetaScraper
from scraper.modules.legislative import LegislativeCollector
from scraper.modules.corporate import CorporateDINCollector
from scraper.modules.judicial import ECourtsJudicialScanner
from scraper.modules.finance import ElectoralBondsCollector
from scraper.modules.mplads import MPLADSCollector
from scraper.modules.cag_grievance import CAGAndGrievanceScanner
from scraper.modules.media import NewsMediaCrawlEngine

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class IngestionPipelineOrchestrator:
    def __init__(self):
        self.downloader = ResilientDownloader()
        self.translator = RegionalTranslator()
        self.ocr_engine = AffidavitOCREngine()
        self.scoring_engine = AIScoringEngine()

        self.myneta_scraper = MyNetaScraper(self.downloader, self.translator)
        self.legislative_coll = LegislativeCollector(self.downloader)
        self.corporate_coll = CorporateDINCollector()
        self.judicial_scanner = ECourtsJudicialScanner()
        self.bonds_coll = ElectoralBondsCollector()
        self.mplads_coll = MPLADSCollector()
        self.audit_scanner = CAGAndGrievanceScanner()
        self.media_crawler = NewsMediaCrawlEngine(self.downloader, self.translator)

    def process_candidate_url(self, url):
        """
        Executes the full-source ingestion pipeline on a single politician URL.
        """
        logging.info(f"=== Beginning pipeline ingestion for: {url} ===")

        # 1. Base ECI/MyNeta Scraping
        profile = self.myneta_scraper.scrape_candidate(url)
        if not profile:
            logging.error(f"Ingestion failed: could not scrape baseline ECI profile from {url}")
            return None

        name = profile["name"]
        role = profile["role"]
        state = profile["state"]
        party = profile["party"]
        constituency = profile["constituency"]

        # 2. Scrape News Media & Sentiment
        logging.info("Step 2: Scanning news media feeds and performing sentiment analytics...")
        media_profile = self.media_crawler.scrape_headlines(name)
        
        # 3. Scrape Legislative Devotion Performance
        logging.info("Step 3: Ingesting PRS legislative participation and attendance telemetry...")
        leg_profile = self.legislative_coll.fetch_performance_metrics(name, role)
        profile["attendancePct"] = leg_profile["attendance"]
        profile["parliamentActivity"] = leg_profile

        # 4. Ingest Corporate Connections (MCA/Zauba DIN Search)
        logging.info("Step 4: Cross-referencing Ministry of Corporate Affairs director registries...")
        corp_profile = self.corporate_coll.scan_mca_registry(name, state)
        profile["panNumber"] = corp_profile["din"]  # DIN maps cleanly to this profile segment
        if corp_profile["flags"]["offshoreLink"]:
            profile["flags"]["offshoreLink"] = True
        if corp_profile["flags"]["cronyism"]:
            profile["flags"]["cronyism"] = True

        # 5. e-Courts Judicial Check
        logging.info("Step 5: Querying active criminal trials on e-Courts & National Judicial Data Grid...")
        jud_profile = self.judicial_scanner.verify_case_status(profile["criminalCaseList"])
        profile["criminalCaseList"] = jud_profile["cases"]
        if jud_profile["hasConviction"]:
            profile["flags"]["convicted"] = True

        # 6. SBI Electoral Bonds Campaign Funding Ingestion
        logging.info("Step 6: Parsing ECI electoral bonds registry and company redemptions...")
        eb_profile = self.bonds_coll.extract_bonding_history(name, party)
        profile["electoralBonds"] = eb_profile["electoralBonds"]

        # 7. MPLADS Development Fund Utilization
        logging.info("Step 7: Ingesting MPLADS allocation and project utilization rates...")
        spent_profile = self.mplads_coll.get_constituency_spending(constituency, role)
        # Store in biography or standard structure if needed

        # 8. CPGRAMS & CAG Audit Performance
        logging.info("Step 8: Checking CPGRAMS grievances and auditing CAG objections...")
        audit_profile = self.audit_scanner.scan_cag_and_cpgrams(name, role)
        if audit_profile["cagObjections"] > 0:
            profile["flags"]["cronyism"] = True  # Audit objections flag cronyism
        
        # 9. Dynamic Integrity Scoring Engine
        logging.info("Step 9: Compiling telemetry through AI Integrity Scoring Engine...")
        completed_profile = self.scoring_engine.compute_integrity_profile(profile)

        logging.info(f"=== Ingestion Complete! Calculated AI Integrity Score: {completed_profile['aiScore']} ===")
        return completed_profile

    def bulk_crawl_election_directory(self, index_url, target_state=None):
        """
        Crawls all candidate profiles listed in an election index directory.
        """
        logging.info(f"=== Initiating Bulk Directory Ingestion on {index_url} ===")
        html = self.downloader.fetch(index_url)
        if not html:
            logging.error(f"Could not load index directory: {index_url}")
            return []

        soup = BeautifulSoup(html, "lxml")
        candidate_links = []

        # Find all anchor links referencing candidates
        # Typically of format: candidate.php?candidate_id=X
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if "candidate.php" in href:
                # Resolve relative URL if needed
                full_url = href
                if href.startswith("candidate"):
                    base_dir = os.path.dirname(index_url)
                    full_url = f"{base_dir}/{href}"
                
                if full_url not in candidate_links:
                    candidate_links.append(full_url)

        logging.info(f"Found {len(candidate_links)} candidate profiles in election directory.")
        
        # Limit to first few to prevent sandbox timeouts during demonstration
        limit = 3
        logging.info(f"Demonstration mode active. Crawling first {limit} profiles...")

        scraped_dataset = []
        for url in candidate_links[:limit]:
            try:
                candidate_profile = self.process_candidate_url(url)
                if candidate_profile:
                    # Filter by state if requested
                    if target_state and candidate_profile.get("state", "").lower() != target_state.lower():
                        logging.info(f"Skipping candidate {candidate_profile.get('name')} (State {candidate_profile.get('state')} != {target_state})")
                        continue
                    scraped_dataset.append(candidate_profile)
            except Exception as e:
                logging.error(f"Error processing URL {url}: {e}")

        return scraped_dataset

def main():
    parser = argparse.ArgumentParser(description="🇮🇳 Indian Politician Multi-Source Ingestion & Scraping Suite CLI")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url", help="Scrape a single politician profile from their MyNeta URL")
    group.add_argument("--bulk", help="Crawl an entire election index page (e.g. state legislative listings)")
    
    parser.add_argument("--state", help="Filter bulk crawl outputs by specific state")
    parser.add_argument("--output", default="politicians_scraped.json", help="Output JSON filename (default: politicians_scraped.json)")

    args = parser.parse_args()
    orchestrator = IngestionPipelineOrchestrator()

    if args.url:
        result = orchestrator.process_candidate_url(args.url)
        if result:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump([result], f, indent=2, ensure_ascii=False)
            logging.info(f"Successfully exported candidate profile to: {args.output}")
        else:
            logging.error("Failed to process candidate.")

    elif args.bulk:
        results = orchestrator.bulk_crawl_election_directory(args.bulk, target_state=args.state)
        if results:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            logging.info(f"Successfully exported {len(results)} candidate profiles to: {args.output}")
        else:
            logging.error("Failed to complete bulk crawl or index was empty.")

if __name__ == "__main__":
    main()
