import time
import random
import logging
import requests

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
]

class ResilientDownloader:
    def __init__(self, delay_range=(1.0, 3.0), timeout=15, retries=3):
        self.delay_range = delay_range
        self.timeout = timeout
        self.retries = retries
        self.session = requests.Session()

    def get_headers(self):
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "DNT": "1",
            "Connection": "keep-alive"
        }

    def fetch(self, url, params=None):
        delay = random.uniform(*self.delay_range)
        logging.info(f"Ethical Throttling: sleeping for {delay:.2f}s before fetching {url}")
        time.sleep(delay)

        for attempt in range(1, self.retries + 1):
            try:
                headers = self.get_headers()
                response = self.session.get(url, params=params, headers=headers, timeout=self.timeout)
                response.raise_for_status()
                return response.text
            except requests.RequestException as e:
                logging.warning(f"Attempt {attempt}/{self.retries} failed to fetch {url}: {e}")
                if attempt == self.retries:
                    logging.error(f"Failed to fetch {url} after {self.retries} attempts.")
                    return None
                time.sleep(2 ** attempt)  # Exponential backoff
        return None

if __name__ == "__main__":
    downloader = ResilientDownloader()
    content = downloader.fetch("https://httpbin.org/user-agent")
    print(content)
