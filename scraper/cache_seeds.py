import os
import requests
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

SUPABASE_URL = "https://wcwufsyroraeirgeoaes.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3Vmc3lyb3JhZWlyZ2VvYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTcxOTMsImV4cCI6MjA5NTM3MzE5M30.ryvNqpXNxykBW154kpXSGQOURzlWYVcrKMfeiXxXBAk"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3Vmc3lyb3JhZWlyZ2VvYWVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc5NzE5MywiZXhwIjoyMDk1MzczMTkzfQ.wp2H_R78rsgfCYrngGKguzO2XMlKf1GKrJYrHVpb8rc"

# Seed politicians with their resolved working Wikipedia image URLs
seed_politicians = [
    {
        "id": "1",
        "name": "Narendra Modi",
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5f/The_official_portrait_of_Shri_Narendra_Modi%2C_the_Prime_Minister_of_the_Republic_of_India.jpg"
    },
    {
        "id": "2",
        "name": "Rahul Gandhi",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rahul_Gandhi.png/500px-Rahul_Gandhi.png"
    },
    {
        "id": "3",
        "name": "Amit Shah",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Shri_Amit_Shah_in_Raigad.jpg/500px-Shri_Amit_Shah_in_Raigad.jpg"
    },
    {
        "id": "4",
        "name": "Yogi Adityanath",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yogiji_in_2023.jpg/500px-Yogiji_in_2023.jpg"
    },
    {
        "id": "5",
        "name": "Arvind Kejriwal",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Arvind_Kejriwal_2022_Official_Portrail_%28AI_enhanced%29.jpg/500px-Arvind_Kejriwal_2022_Official_Portrail_%28AI_enhanced%29.jpg"
    },
    {
        "id": "6",
        "name": "Akhilesh Yadav",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Akhilesh_Yadav_receiving_Padma_Vibhushan_on_the_behalf_of_his_late_father_Sh._Mulayam_Singh_Yadav_%28cropped%29.jpg"
    },
    {
        "id": "7",
        "name": "Mamata Banerjee",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Official_portrait_of_Mamata_Banerjee.jpg/500px-Official_portrait_of_Mamata_Banerjee.jpg"
    },
    {
        "id": "8",
        "name": "Nitin Gadkari",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nitin_Jairam_Gadkari.jpg/500px-Nitin_Jairam_Gadkari.jpg"
    },
    {
        "id": "9",
        "name": "Rajnath Singh",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/2025_Rajnath_Singh_%28cropped%29.jpg/500px-2025_Rajnath_Singh_%28cropped%29.jpg"
    },
    {
        "id": "10",
        "name": "M.K. Stalin",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/The_Chief_Minister_of_Tamil_Nadu%2C_Thiru_MK_Stalin.jpg/500px-The_Chief_Minister_of_Tamil_Nadu%2C_Thiru_MK_Stalin.jpg"
    },
    {
        "id": "11",
        "name": "Uddhav Thackeray",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Uddhav_Thackeray%2C_President_of_Shiv_Sena-UBT.jpg/500px-Uddhav_Thackeray%2C_President_of_Shiv_Sena-UBT.jpg"
    }
]

def cache_image(p_id, name, original_url):
    logging.info(f"Processing image for {name} (ID: {p_id}) from URL: {original_url}")
    try:
        # Download the image
        headers = {
            "User-Agent": "MeraNetaImageCaching/1.0 (https://github.com/DharmadhikariSS/Indian_Politician_Website; support@meraneta.in)"
        }
        r = requests.get(original_url, headers=headers, timeout=25)
        if r.status_code != 200:
            logging.error(f"Failed to download image for {name}. Status code: {r.status_code}")
            return None
            
        content_type = r.headers.get("Content-Type", "image/jpeg")
        # Ensure we guess the correct extension
        ext = "jpg"
        if "png" in content_type:
            ext = "png"
        elif "webp" in content_type:
            ext = "webp"
            
        filename = f"{p_id}.{ext}"
        upload_endpoint = f"{SUPABASE_URL}/storage/v1/object/portraits/{filename}"
        
        upload_headers = {
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": content_type
        }
        
        # Upload using POST or PUT if already exists
        upload_resp = requests.post(upload_endpoint, data=r.content, headers=upload_headers, timeout=25)
        if upload_resp.status_code in [200, 201]:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/portraits/{filename}"
            logging.info(f"Successfully uploaded portrait for {name}: {public_url}")
            return public_url
        elif upload_resp.status_code == 400 and "already exists" in upload_resp.text.lower():
            logging.info(f"Image {filename} already exists. Attempting to overwrite via PUT...")
            put_resp = requests.put(upload_endpoint, data=r.content, headers=upload_headers, timeout=25)
            if put_resp.status_code in [200, 201]:
                public_url = f"{SUPABASE_URL}/storage/v1/object/public/portraits/{filename}"
                logging.info(f"Successfully overwrote portrait for {name}: {public_url}")
                return public_url
            else:
                logging.error(f"Failed to overwrite image via PUT: {put_resp.status_code} - {put_resp.text}")
        else:
            logging.error(f"Failed to upload image via POST: {upload_resp.status_code} - {upload_resp.text}")
            
    except Exception as e:
        logging.error(f"Exception while caching image for {name}: {e}")
    return None

def update_database(p_id, name, cached_url):
    logging.info(f"Updating database record for {name} (ID: {p_id}) with new photoUrl...")
    endpoint = f"{SUPABASE_URL}/rest/v1/politicians?id=eq.{p_id}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    payload = {
        "photoUrl": cached_url
    }
    try:
        r = requests.patch(endpoint, json=payload, headers=headers, timeout=15)
        if r.status_code in [200, 204]:
            logging.info(f"Successfully updated database for {name}!")
            return True
        else:
            logging.error(f"Failed to update database for {name}: {r.status_code} - {r.text}")
    except Exception as e:
        logging.error(f"Exception while updating database for {name}: {e}")
    return False

def main():
    success_count = 0
    for p in seed_politicians:
        cached_url = cache_image(p["id"], p["name"], p["url"])
        if cached_url:
            db_success = update_database(p["id"], p["name"], cached_url)
            if db_success:
                success_count += 1
        print("-" * 50)
    
    print(f"Caching complete. Successfully updated {success_count}/{len(seed_politicians)} seed politicians.")

if __name__ == "__main__":
    main()
