import logging
import pprint
from scraper.modules.cronyism_evaluator import CronyismEvaluator
from scraper.modules.social_crawler import SocialMediaCrawler

class AIScoringEngineV3:
    def __init__(self):
        self.crony_evaluator = CronyismEvaluator()
        self.social_crawler = SocialMediaCrawler()

    def parse_net_worth(self, val):
        if not val:
            return 0.0
        clean = val.replace("₹", "").replace(" ", "").replace(",", "").lower()
        match = re.search(r"([\d.]+)(cr|lakh|l)?", clean)
        if not match:
            return 0.0
        num = float(match.group(1))
        unit = match.group(2)
        if unit == "cr":
            return num
        if unit == "lakh" or unit == "l":
            return num / 100
        return num

    def compute_civic_trust_index(self, politician_data):
        """
        Calculates the v3.0 Civic Trust Index (0-100) using multi-pillar integration,
        spousal/kinship network mapping, state procurement tender checks, and social sentiment scoring.
        """
        name = politician_data.get("name", "Representative")
        state = politician_data.get("state", "India")
        role = politician_data.get("role", "MLA")
        net_worth_str = politician_data.get("netWorth", "0Cr")
        
        logging.info(f"Computing v3.0 Civic Trust Index for: {name} ({party if 'party' in locals() else ''})")

        # 1. Legislative Index (Lp) - 25% Weight
        attendance = politician_data.get("attendancePct", 75)
        # Scale to 100 scale
        L_p = attendance  # Defaulting legislative to attendance for simple mapping
        
        # 2. Financial Declarations Index (Fi) - 30% Weight
        growth_pct = politician_data.get("netWorthGrowth", 15)
        F_i = 100
        if growth_pct > 300:
            F_i = 30
        elif growth_pct > 100:
            F_i = 60
        elif growth_pct > 25:
            F_i = 85

        # 3. Judicial Dossier (Jc) - 25% Weight
        cases_count = politician_data.get("criminalCases", 0)
        cases_list = politician_data.get("criminalCaseList", [])
        has_conviction = any("convict" in c.get("status", "").lower() or "guilty" in c.get("status", "").lower() for c in cases_list)
        
        J_c = 100 - (cases_count * 10)
        if has_conviction:
            J_c = 10
        J_c = max(0, J_c)

        # 4. Public Telemetry Index (Pt) - 15% Weight (Fact-Check + Sentiment)
        social_data = self.social_crawler.scan_social_sentiment(name, state)
        truth_score = social_data["truthfulnessScore"]
        social_sentiment = social_data["socialSentiment"]
        
        # Scale social sentiment (-1 to +1) to (0 to 100)
        sentiment_scaled = (social_sentiment + 1) * 50
        P_t = (0.6 * truth_score) + (0.4 * sentiment_scaled)

        # Calculate Base Score (Bscore)
        B_score = (0.25 * L_p) + (0.35 * F_i) + (0.25 * J_c) + (0.15 * P_t)

        # 5. Apply Cronyism and Kinship Risk Penalty Multipliers (Rm)
        crony_data = self.crony_evaluator.map_kinship_and_corporate_network(name, state, net_worth_str)
        crony_flags = crony_data["flags"]
        
        M_crony = 1.0
        if crony_flags["hasProcurementConflict"]:
            M_crony = 0.70  # 30% Cronyism penalty

        M_offshore = 1.0
        if crony_flags["hasOffshoreLeaksMatch"] or politician_data.get("flags", {}).get("offshoreLink"):
            M_offshore = 0.75  # 25% Offshore shell leakage penalty

        # Judicial Stalling Check
        M_stalling = 1.0
        # If active cases > 3 and has under trial status for long time
        if cases_count > 3:
            M_stalling = 0.80  # 20% stalling penalty

        # Final CTI Score
        cti_score = B_score * M_crony * M_offshore * M_stalling
        cti_score = max(0, min(100, int(cti_score)))

        # Assign Risk Level
        if cti_score >= 71:
            risk_level = "LOW"
        elif cti_score >= 41:
            risk_level = "MEDIUM"
        elif cti_score >= 25:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

        # Construct Detailed Factors
        risk_factors = []
        if M_crony < 1.0:
            risk_factors.append(f"Cronyism Alert: Close relative's firm won state contracts in {state}")
        if M_offshore < 1.0:
            risk_factors.append("Offshore Disclosure Warning: Beneficial shell ownership linked in tax shelters")
        if cti_score < 50 and J_c < 70:
            risk_factors.append(f"Judicial Burden: {cases_count} active penal trials unresolved")
        if truth_score < 60:
            risk_factors.append(f"Fact-Check Alert: Significant statements rated false by independent auditors ({truth_score}% truth index)")

        positive_contributions = []
        if cti_score >= 71:
            positive_contributions.append("Clean Kinship Sheet: No procurement or shell conflicts indexed")
            positive_contributions.append("Pristine criminal history docket")
        if attendance > 85:
            positive_contributions.append(f"Exemplary assembly devotion ({attendance}% attendance)")

        # Compile detailed profile
        politician_data["aiScore"] = cti_score
        politician_data["integrityDetails"] = {
            "financialIntegrity": int(F_i * M_offshore),
            "publicService": int(L_p),
            "criminalHistory": int(J_c * M_stalling),
            "riskLevel": risk_level,
            "summary": f"{name} graded at {cti_score}/100 ({risk_level} Risk) under v3.0 Civic Trust Index audits.",
            "riskFactors": risk_factors,
            "positiveContributions": positive_contributions if positive_contributions else ["Standard regulatory disclosure compliance"],
            "kinshipNetwork": crony_data["kinshipNetwork"],
            "conflictTenders": crony_flags["conflictTenders"],
            "socialSentiment": social_data
        }

        return politician_data

if __name__ == "__main__":
    import re
    engine = AIScoringEngineV3()
    test_data = {
        "name": "Devendra Fadnavis",
        "role": "MLA",
        "party": "BJP",
        "state": "Maharashtra",
        "constituency": "Nagpur South West",
        "attendancePct": 92,
        "criminalCases": 0,
        "netWorth": "5.2Cr",
        "netWorthGrowth": 25,
        "flags": { "offshoreLink": True }
    }
    profiled = engine.compute_civic_trust_index(test_data)
    pprint.pprint(profiled["integrityDetails"])
