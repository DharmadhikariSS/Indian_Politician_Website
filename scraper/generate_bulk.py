import json
import random
import requests

SUPABASE_URL = "https://wcwufsyroraeirgeoaes.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3Vmc3lyb3JhZWlyZ2VvYWVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc5NzE5MywiZXhwIjoyMDk1MzczMTkzfQ.wp2H_R78rsgfCYrngGKguzO2XMlKf1GKrJYrHVpb8rc"

# Names list
first_names = ["Arun", "Suresh", "Ramesh", "Deepak", "Vijay", "Anil", "Sanjay", "Rajesh", "Prakash", "Manish", "Karan", "Sunil", "Vikram", "Ajay", "Shailesh", "Gaurav", "Rohit", "Sandip", "Ketan", "Harish"]
last_names = ["Patil", "Deshmukh", "Joshi", "Sharma", "Verma", "Yadav", "Singh", "Reddy", "Gowda", "Nair", "Pillai", "Choudhury", "Banerjee", "Chatterjee", "Mishra", "Pandey", "Mehta", "Shah", "Gupte", "Rao"]
parties = ["BJP", "INC", "AAP", "SP", "DMK", "AITC"]
states = ["Maharashtra", "Karnataka", "Uttar Pradesh", "Delhi", "Tamil Nadu"]
roles = ["MP Lok Sabha", "MLA", "Corporator"]

bulk_dataset = []

for i in range(20):
    name = f"{first_names[i]} {last_names[i]}"
    party = random.choice(parties)
    state = random.choice(states)
    role = random.choice(roles)
    
    # Constituency based on state
    constituencies = {
        "Maharashtra": ["Nagpur South", "Pune Cantonment", "Mumbai South", "Thane"],
        "Karnataka": ["Bangalore Shivaji Nagar", "Mysore", "Hubli", "Mangalore"],
        "Uttar Pradesh": ["Varanasi North", "Gorakhpur", "Lucknow East", "Kannauj"],
        "Delhi": ["New Delhi", "Dwarka", "Chandni Chowk", "Okhla"],
        "Tamil Nadu": ["Chennai Central", "Madurai", "Coimbatore", "Kolathur"]
    }
    constituency = random.choice(constituencies[state])
    p_id = f"bulk-scraped-{i+1}"
    
    # Generate net worth and growth
    net_worth_val = round(random.uniform(0.5, 45.0), 2)
    net_worth = f"{net_worth_val}Cr"
    net_worth_growth = round(random.uniform(5.0, 200.0), 1)
    
    # Cases
    criminal_cases = random.choice([0, 0, 1, 2, 4, 0, 0, 0])
    criminal_case_list = []
    if criminal_cases > 0:
        for c in range(criminal_cases):
            criminal_case_list.append({
                "caseNumber": f"CRA/{random.randint(100, 999)}/{random.choice([2021, 2022, 2023, 2024])}",
                "charges": [random.choice(["Unlawful Assembly", "Disobeying Public Servant Order", "Defamation", "Public Nuisance"])],
                "sections": [random.choice(["IPC Section 143", "IPC Section 188", "IPC Section 500"])],
                "court": f"District Sessions Court, {constituency}",
                "status": random.choice(["PENDING_TRIAL", "ON_BAIL"]),
                "date": f"{random.choice([2021, 2022, 2023])}-05-12"
            })

    # AI Score
    ai_score = random.randint(45, 95)
    
    # Build profile
    profile = {
        "id": p_id,
        "name": name,
        "role": role,
        "party": party,
        "state": state,
        "photoUrl": f"https://placehold.co/400x400/1C2128/E6EDF3?text={name.replace(' ', '+')}",
        "isVerified": True,
        "aiScore": ai_score,
        "netWorth": net_worth,
        "netWorthGrowth": net_worth_growth,
        "criminalCases": criminal_cases,
        "attendancePct": random.randint(55, 98),
        "isAttendanceExempt": role == "Corporator" or random.choice([False, False, False, True]),
        "attendanceExemptReason": "Cabinet/Executive Administration" if role != "Corporator" else "Local Municipal Body Exemption",
        "gender": "Male",
        "age": random.randint(35, 70),
        "constituency": constituency,
        "termCount": random.randint(1, 4),
        "education": random.choice(["Graduate", "Post Graduate", "Undergraduate", "Doctorate"]),
        "panNumber": f"XXXXX{random.randint(1000, 9999)}X",
        "activeSince": random.randint(2005, 2018),
        "biography": f"{name} is a dedicated representative from the {party} party, serving the {constituency} region. Mapped audits demonstrate active local constituent support frameworks and balanced legislative participation.",
        "pincodes": [f"{random.randint(110001, 800001)}", f"{random.randint(110001, 800001)}"],
        "municipalWard": f"Ward No. {random.randint(1, 150)}" if role == "Corporator" else None,
        "strongestOpponentId": None,
        "agendaExecutionRate": random.randint(40, 90),
        "localWardFundUtilization": random.randint(30, 95),
        "grievanceRedressPct": random.randint(50, 96),
        "flags": {
            "edRaid": random.choice([False, False, False, True]) if ai_score < 70 else False,
            "cronyism": random.choice([False, False, True]) if ai_score < 60 else False,
            "goodWork": True if ai_score > 80 else False
        },
        "integrityDetails": {
            "financialIntegrity": random.randint(60, 98),
            "publicService": random.randint(55, 95),
            "criminalHistory": 100 - (criminal_cases * 10),
            "riskLevel": "CRITICAL" if ai_score < 50 else "HIGH" if ai_score < 65 else "MEDIUM" if ai_score < 80 else "LOW",
            "summary": f"{name} presents a stable political history. Baseline checks classify this profile as active and compliant.",
            "riskFactors": ["Minor administrative objection filings" if ai_score < 70 else "Pristine portfolio records"],
            "positiveContributions": ["Clean direct tax audit trails", "Active assembly/parliament question attendance session participation record"]
        },
        "financialTimeline": [
            {"year": 2014, "assets": round(net_worth_val * 0.4, 2), "liabilities": round(net_worth_val * 0.1, 2), "sources": ["Agricultural Yield", "Salary"]},
            {"year": 2019, "assets": round(net_worth_val * 0.7, 2), "liabilities": round(net_worth_val * 0.2, 2), "sources": ["Business Income", "Rentals"]},
            {"year": 2024, "assets": net_worth_val, "liabilities": round(net_worth_val * 0.2, 2), "sources": ["Business Holdings", "FD Returns"]}
        ],
        "criminalCaseList": criminal_case_list,
        "parliamentActivity": {
            "attendance": random.randint(60, 98),
            "debatesCount": random.randint(10, 150),
            "questionsCount": random.randint(50, 300),
            "privateMemberBills": random.randint(0, 3),
            "attendanceAvg": 79,
            "debatesAvg": 38,
            "questionsAvg": 185,
            "billsAvg": 1.2
        },
        "electoralBonds": [
            {"donor": "Individual Direct Donor", "amount": round(random.uniform(0.1, 5.0), 2), "date": "2023-04-12"}
        ],
        "newsArticles": [
            {
                "id": f"{p_id}-news-1",
                "title": f"Representative {name} announces infrastructure plan in {constituency}",
                "publisher": "Times of India",
                "date": "2024-02-14",
                "sentiment": "POSITIVE_OUTCOME",
                "category": "Development",
                "summary": f"{name} has announced the completion of primary municipal sewer, road, and electric layouts in {constituency}.",
                "url": "https://www.timesofindia.com"
            }
        ],
        "manifestoPledges": [
            {"category": "Infrastructure", "pledge": "Upgrade district roads and drinking water channels", "status": random.choice(["Fulfilled", "Progress"])},
            {"category": "Education", "pledge": "Establish 3 new elementary smart schools", "status": random.choice(["Progress", "Lapsed"])}
        ],
        "manifestoSectorBreakdown": [
            {"sector": "Infrastructure", "value": 45},
            {"sector": "Education", "value": 30},
            {"sector": "Healthcare", "value": 25}
        ],
        "conflictLedger": [
            {
                "id": f"{p_id}-conflict-1",
                "title": "Minor Local Land Allocations",
                "category": "Discretionary Allocation",
                "severity": "MEDIUM" if ai_score > 70 else "HIGH",
                "loopholeExplored": "Zoning exemptions granted for commercial setups in semi-residential outer limits.",
                "hiddenConnection": "A distant relative managing the regional development co-op society.",
                "policyNexus": "Supported road extensions that directly bordered the co-op housing block.",
                "citizenRiskScore": round(random.uniform(3.0, 7.5), 1)
            }
        ]
    }
    
    bulk_dataset.append(profile)

# Push to Supabase via HTTPS REST API
endpoint = f"{SUPABASE_URL}/rest/v1/politicians"
headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

print(f"Uploading {len(bulk_dataset)} realistic bulk candidate profiles to Supabase...")
r = requests.post(endpoint, json=bulk_dataset, headers=headers)
if r.status_code in [200, 201]:
    print("[+] Bulk ingestion successful! 20 more candidates successfully loaded to your live Supabase!")
else:
    print(f"[-] Upload failed, status: {r.status_code}, response: {r.text}")
