# 🇮🇳 Indian Politician Data Ingestion & Scraping Suite

This is an enterprise-grade, modular, and legal-compliant Python-based scraping and ingestion suite designed to extract, translate, normalize, and score data on Indian politicians from a wide variety of public and media sources.

## 🏗️ Architecture

```
scraper/
├── requirements.txt         # Dependencies
├── README.md                # Usage Instructions (This file)
├── cli.py                   # Main CLI entry point
├── ingest.py                # Supabase DB & Storage Ingestion tool
├── core/
│   ├── downloader.py        # Resilient HTTP downloading (proxies, rate limits)
│   ├── translator.py        # Regional language translator & Indian numeric cleaner (Lakhs/Crores)
│   ├── ocr.py               # Local OCR for regional scanned ECI affidavits
│   └── scoring.py           # AI score & risk profile generator
└── modules/
    ├── myneta.py            # MyNeta / ECI profile scraper
    ├── legislative.py       # PRS & Parliament performance tracker
    ├── corporate.py         # MCA DIN corporate directorship parser
    ├── judicial.py          # e-Courts case progression checks
    ├── finance.py           # Electoral bonds & campaign funding aggregator
    ├── mplads.py            # MPLADS development fund utilization tracker
    ├── cag_grievance.py     # CPGRAMS performance & CAG audit checks
    └── media.py             # RSS Google News crawlers & sentiment analysis
```

## 🛠️ Setup & Installation

1. Install Python 3.9+ on your system.
2. Install dependencies:
   ```bash
   pip3 install -r scraper/requirements.txt
   ```
3. Initialize NLP resources (run once):
   ```bash
   python3 -c "import nltk; nltk.download('vader_lexicon')"
   ```

## 🚀 Step-by-Step Data Harvesting & Ingestion

To populate your live database with real Indian politicians, follow these simple steps:

### Step 1: Run the Scraper (Single Candidate or Bulk Crawl)

#### Option A: Bulk Scrape from Election Listings (Recommended)
To crawl a large number of candidates from an election listing directory (such as Lok Sabha 2024 winners or candidate tables):
```bash
# Scrape the first 30 winners of Lok Sabha 2024 (set --limit 0 for all 543 winners)
python3 -u scraper/cli.py --bulk "https://myneta.info/LokSabha2024/index.php?action=show_winners" --limit 30 --output scraper/politicians_scraped.json
```

#### Option B: Scrape a Single Candidate
To profile a specific politician using their exact MyNeta URL:
```bash
python3 -u scraper/cli.py --url "https://myneta.info/LokSabha2024/candidate.php?candidate_id=5395" --output scraper/politicians_scraped.json
```

### Step 2: Ingest Scraped Data into Supabase

Once you have generated the `scraper/politicians_scraped.json` file, run the ingestion script to synchronize images to the Supabase portraits storage bucket and upsert records to the PostgreSQL database:
```bash
python3 scraper/ingest.py
```

*Note: The script automatically reads your `.env` credentials in the root directory to perform secure PostgREST REST API requests.*

---

## ⚡ Technical Highlights & Improvements

1. **Relative URL Resolution Fix:** Standardized all extracted links using `urllib.parse.urljoin` to prevent "Page Not Found!!" errors caused by root-relative anchors.
2. **Sub-directory Matching Filter:** Implemented a directory-level segment validator in `cli.py` to filter out invalid duplicate links and correctly target target elections (e.g. `/LokSabha2024/`).
3. **Pristine HTML Table Extraction:** Custom, ID-specific parsing selectors for `movable_assets`, `immovable_assets`, `liabilities`, `income_tax`, and `cases` tables.
4. **Combined Financial Value Parsing:** Upgraded the financial parser in `core/translator.py` to robustly extract and normalize large raw Rupee figures (e.g., `Rs 2,58,92,000 2 Crore+` yields mathematically perfect `2.5892` crores) without multiplier confusion.
5. **PostgREST Key Harmonization:** Built a strict key mapping model inside `ingest.py` to align all parsed JSON dictionaries identically, bypassing Supabase multi-object column mismatches (`PGRST102` error).
