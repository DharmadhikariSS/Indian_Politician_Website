import os
import json
import requests
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_env():
    # Try to load .env from root, parent, or current directories
    for path in [".env", "../.env", "scraper/.env"]:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ[k.strip()] = v.strip().strip('"').strip("'")
                logging.info(f"Loaded environment parameters from: {path}")
            except Exception as e:
                logging.warning(f"Error loading environment file {path}: {e}")
            break

# Execute automatic env loading on startup
load_env()

# Retrieve credentials
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or "placeholder" in SUPABASE_URL or "your-project-id" in SUPABASE_URL:
    print("ERROR: Please set active VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in .env.")
    print("Example (.env in project root):")
    print("  VITE_SUPABASE_URL=https://your-project-id.supabase.co")
    print("  VITE_SUPABASE_ANON_KEY=your-anon-public-key")
    exit(1)

def ensure_storage_bucket():
    """
    Ensure the public 'portraits' bucket exists in Supabase Storage.
    """
    logging.info("Checking/Creating 'portraits' Supabase Storage bucket...")
    endpoint = f"{SUPABASE_URL}/storage/v1/bucket"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "id": "portraits",
        "name": "portraits",
        "public": True,
        "file_size_limit": 5242880, # 5MB
        "allowed_mime_types": ["image/jpeg", "image/png", "image/webp"]
    }
    try:
        # First check if the bucket exists by listing all buckets
        list_endpoint = f"{SUPABASE_URL}/storage/v1/bucket"
        r_list = requests.get(list_endpoint, headers=headers, timeout=10)
        if r_list.status_code == 200:
            buckets = r_list.json()
            if any(b.get("id") == "portraits" for b in buckets):
                logging.info("Supabase portraits bucket already exists.")
                return True
        
        # Bucket does not exist or we couldn't fetch, let's create it
        r = requests.post(endpoint, json=payload, headers=headers, timeout=10)
        if r.status_code in [200, 201]:
            logging.info("Successfully created public 'portraits' Supabase Storage bucket!")
            return True
        else:
            logging.warning(f"Storage bucket check/creation returned status {r.status_code}: {r.text}")
            return False
    except Exception as e:
        logging.error(f"Error checking/creating portraits bucket: {e}")
        return False

def cache_image_to_supabase(candidate_id, photo_url):
    """
    Downloads candidate image and uploads it to the public portraits storage bucket.
    """
    if "placehold.co" in photo_url or not photo_url.startswith("http"):
        # Keep mock placeholder as-is
        return photo_url

    logging.info(f"Caching candidate portrait image for candidate {candidate_id} from {photo_url}...")
    try:
        # Download candidate photo
        img_resp = requests.get(photo_url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        })
        if img_resp.status_code != 200:
            logging.warning(f"Could not download candidate image, status: {img_resp.status_code}")
            return photo_url

        content_type = img_resp.headers.get("Content-Type", "image/jpeg")
        # Infer file extension
        ext = "jpg"
        if "png" in content_type:
            ext = "png"
        elif "webp" in content_type:
            ext = "webp"

        filename = f"{candidate_id}.{ext}"
        upload_endpoint = f"{SUPABASE_URL}/storage/v1/object/portraits/{filename}"
        
        upload_headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": content_type
        }

        # Upload to Supabase Storage
        upload_resp = requests.post(upload_endpoint, data=img_resp.content, headers=upload_headers, timeout=15)
        if upload_resp.status_code in [200, 201]:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/portraits/{filename}"
            logging.info(f"Successfully uploaded portrait image to Supabase: {public_url}")
            return public_url
        else:
            # If already exists, we might get an error. Try to overwrite (PUT request)
            if upload_resp.status_code == 400 and "already exists" in upload_resp.text.lower():
                logging.info(f"Image {filename} already exists. Attempting to overwrite via PUT...")
                put_resp = requests.put(upload_endpoint, data=img_resp.content, headers=upload_headers, timeout=15)
                if put_resp.status_code in [200, 201]:
                    public_url = f"{SUPABASE_URL}/storage/v1/object/public/portraits/{filename}"
                    logging.info(f"Successfully overwrote portrait image in Supabase: {public_url}")
                    return public_url
            
            logging.warning(f"Could not upload image to storage bucket, status {upload_resp.status_code}: {upload_resp.text}")
            return photo_url
    except Exception as e:
        logging.error(f"Error caching image to Supabase: {e}")
        return photo_url

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

    print(f"Loaded {len(data)} politicians.")
    
    # 1. Initialize Storage Bucket if we have external photos to upload
    has_bucket = False
    has_external_images = any("placehold.co" not in p.get("photoUrl", "") and p.get("photoUrl", "").startswith("http") for p in data)
    if has_external_images:
        has_bucket = ensure_storage_bucket()

    # 2. Iterate and Cache Portrait Images
    for politician in data:
        p_id = politician.get("id") or politician.get("name").lower().replace(" ", "-")
        # Ensure politician has an ID
        politician["id"] = p_id
        photo_url = politician.get("photoUrl")
        if photo_url and has_bucket:
            # Try to upload external image to bucket
            cached_url = cache_image_to_supabase(p_id, photo_url)
            politician["photoUrl"] = cached_url

    # Save cached URLs back to JSON file to maintain consistency
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Successfully synchronized cached image locations back to politicians_scraped.json.")
    except Exception as save_err:
        print(f"Warning: Failed to save cached URLs back to JSON file: {save_err}")

    # 3. Ingest Records to PostgreSQL Database via Supabase PostgREST
    print("Pushing records to Supabase...")
    endpoint = f"{SUPABASE_URL}/rest/v1/politicians"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    response = requests.post(endpoint, json=data, headers=headers)
    
    if response.status_code in [200, 201]:
        print("Success! Data successfully ingested to Supabase database.")
    else:
        print(f"Failed to ingest data. Status: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    main()
