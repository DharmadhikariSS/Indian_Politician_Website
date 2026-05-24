import os
import json
import requests

# Set these if not loading from .env
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or "placeholder" in SUPABASE_URL:
    print("ERROR: Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.")
    print("Example (Windows PowerShell):")
    print("  $env:VITE_SUPABASE_URL='https://your-project.supabase.co'")
    print("  $env:VITE_SUPABASE_ANON_KEY='your-anon-key'")
    print("  python ingest.py")
    exit(1)

def main():
    print("Loading politicians_scraped.json...")
    file_path = "politicians_scraped.json"
    if not os.path.exists(file_path):
        file_path = os.path.join("scraper", "politicians_scraped.json")
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"Successfully loaded database index from: {file_path}")
    except FileNotFoundError:
        print("politicians_scraped.json not found in root or scraper/ directory. Run the scraper first.")
        return

    print(f"Loaded {len(data)} politicians. Pushing to Supabase...")
    
    endpoint = f"{SUPABASE_URL}/rest/v1/politicians"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    response = requests.post(endpoint, json=data, headers=headers)
    
    if response.status_code in [200, 201]:
        print("Success! Data ingested to Supabase.")
    else:
        print(f"Failed to ingest data. Status: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    main()
