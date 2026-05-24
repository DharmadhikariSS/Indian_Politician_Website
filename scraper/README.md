# 🇮🇳 Indian Politician Data Ingestion & Scraping Suite

This is an enterprise-grade, modular, and legal-compliant Python-based scraping and ingestion suite designed to extract, translate, normalize, and score data on Indian politicians from a wide variety of public and media sources.

## 🏗️ Architecture

```
scraper/
├── requirements.txt         # Dependencies
├── README.md                # Usage Instructions
├── cli.py                   # Main CLI entry point
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

1. Install Python 3.10+ on your system.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize NLP resources (run once):
   ```bash
   python -c "import nltk; nltk.download('vader_lexicon')"
   ```

## 🚀 Usage

The suite provides a unified command line interface (`cli.py`):

### 1. Scrape a specific Candidate
To scrape and profile a specific politician using their MyNeta profile URL:
```bash
python cli.py --url "https://myneta.info/loksabha2024/candidate.php?candidate_id=123" --output candidate_data.json
```

### 2. Bulk Scrape an Election Year / State
To crawl all candidate profiles listed in a MyNeta election directory index page:
```bash
python cli.py --bulk "https://myneta.info/loksabha2024/" --state "Delhi" --output Delhi_LokSabha_2024.json
```

### 3. Integrated Full-Source Analysis
By default, the CLI matches personal profiles against other data sources (attendance, corporate registers, news headlines, and electoral bonds) based on fuzzy matches of the politician's name, DIN, PAN, or constituency, and writes the completed JSON to standard structures.
