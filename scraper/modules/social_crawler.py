import re
import logging
import random

class SocialMediaCrawler:
    def __init__(self):
        pass

    def scan_social_sentiment(self, politician_name, state):
        """
        Simulates scanning local platforms, state subreddits (e.g. r/delhi, r/maharashtra, r/karnataka),
        and Twitter/X hashes to identify grassroot citizen reports, truthfulness indicators, and localized grievances.
        """
        logging.info(f"Scanning social platforms & subreddits for: {politician_name} (State: {state})")
        
        # Unique and consistent seeding
        seed_val = sum(ord(c) for c in politician_name)
        random.seed(seed_val)
        
        # State subreddits mapping
        state_subreddits = {
            "Delhi": "r/delhi",
            "Maharashtra": "r/maharashtra",
            "Karnataka": "r/karnataka",
            "Uttar Pradesh": "r/uttarpradesh",
            "Gujarat": "r/gujarat",
            "Tamil Nadu": "r/chennai",
            "West Bengal": "r/kolkata"
        }
        
        subreddit = state_subreddits.get(state, "r/india")
        
        # Grassroots scenarios
        posts = []
        sentiment_score = 0.0
        truthfulness_score = random.randint(60, 95) # Fact-Check Truth Score (out of 100)
        
        # Seed scenarios
        is_risky = seed_val % 3 == 0
        
        if is_risky:
            generic_posts = [
                {
                    "platform": "Reddit",
                    "source": subreddit,
                    "title": f"Local contractors complaining about {politician_name} demanding cuts on road contracts",
                    "sentiment": -0.75,
                    "upvotes": random.randint(15, 120),
                    "summary": "Contractors alleging corruption in public works allocations."
                },
                {
                    "platform": "Twitter/X",
                    "source": f"#{politician_name.replace(' ', '')}Scam",
                    "title": f"Viral video shows municipal garbage trucks dumping directly next to rivers - {politician_name}'s district",
                    "sentiment": -0.60,
                    "upvotes": random.randint(100, 1500),
                    "summary": "Environmental compliance violation flagged by local environmentalists."
                }
            ]
            posts.extend(generic_posts)
            sentiment_score = -0.68
            truthfulness_score = random.randint(45, 65) # Lower truthfulness
        else:
            generic_posts = [
                {
                    "platform": "Reddit",
                    "source": subreddit,
                    "title": f"Visited the new public clinic opened by {politician_name} in my town, very clean and well-stocked!",
                    "sentiment": 0.85,
                    "upvotes": random.randint(40, 250),
                    "summary": "Citizen verifies functional constituency healthcare utility."
                },
                {
                    "platform": "Twitter/X",
                    "source": f"#{politician_name.replace(' ', '')}",
                    "title": f"Congratulations to {politician_name} for organizing the regional water conservation summit.",
                    "sentiment": 0.70,
                    "upvotes": random.randint(50, 600),
                    "summary": "Praise for organizing regional water harvesting workshops."
                }
            ]
            posts.extend(generic_posts)
            sentiment_score = 0.78
        
        return {
            "politicianName": politician_name,
            "targetSubreddit": subreddit,
            "truthfulnessScore": truthfulness_score,
            "socialSentiment": sentiment_score,
            "indexedPosts": posts
        }

if __name__ == "__main__":
    crawler = SocialMediaCrawler()
    print(crawler.scan_social_sentiment("Arvind Kejriwal", "Delhi"))
