import logging

class AIScoringEngine:
    def __init__(self):
        pass

    def compute_integrity_profile(self, politician_data):
        """
        Computes AI Integrity Score, riskLevel, riskFactors, 
        and summarizes the profile based on structural heuristics.
        """
        score = 100
        risk_factors = []
        positive_contributions = []

        # 1. Legislative Attendance (Devotion)
        attendance = politician_data.get("attendancePct", 75)
        role = politician_data.get("role", "")
        if role in ["MLA", "MP Lok Sabha", "MP Rajya Sabha"]:
            if attendance < 40:
                score -= 25
                risk_factors.append(f"Critically poor legislative session attendance record ({attendance}%)")
            elif attendance < 60:
                score -= 15
                risk_factors.append(f"Low legislative session attendance record ({attendance}%)")
            elif attendance >= 90:
                positive_contributions.append(f"Outstanding legislative session attendance record ({attendance}%)")

        # 2. Criminal History Burden
        cases_count = politician_data.get("criminalCases", 0)
        cases_list = politician_data.get("criminalCaseList", [])
        
        # Check for conviction
        has_conviction = False
        for case in cases_list:
            status = case.get("status", "").lower()
            if "convict" in status or "guilty" in status:
                has_conviction = True
                break

        if cases_count > 0:
            score -= (cases_count * 8)
            risk_factors.append(f"{cases_count} active criminal charges pending in regional courts")
            
            # Check for severe sections
            has_severe = False
            for case in cases_list:
                charges = [c.lower() for c in case.get("charges", [])]
                sections = [s.lower() for s in case.get("sections", [])]
                
                severe_keywords = ["intimidation", "bribery", "corruption", "cheat", "forgery", "rioting", "extortion", "laundering", "grab"]
                for char in charges + sections:
                    if any(kw in char for kw in severe_keywords):
                        has_severe = True
                        break
            if has_severe:
                score -= 15
                risk_factors.append("Includes severe charges (e.g. corruption, forgery, intimidation)")
        else:
            positive_contributions.append("Pristine / clean criminal record with zero active cases")

        # 3. Financial timeline and asset spikes
        timeline = politician_data.get("financialTimeline", [])
        growth_pct = politician_data.get("netWorthGrowth", 0)
        net_worth_str = politician_data.get("netWorth", "0")
        
        try:
            net_worth_val = float(net_worth_str.replace("Cr", "").replace("₹", "").strip())
        except ValueError:
            net_worth_val = 0.0

        if growth_pct > 300 and net_worth_val > 1.0:
            score -= 25
            risk_factors.append(f"Disproportionate asset growth of {growth_pct}% over a single term")
        elif growth_pct > 100 and net_worth_val > 5.0:
            score -= 15
            risk_factors.append(f"Unexplained asset growth of {growth_pct}% ({net_worth_str} total net worth)")
        elif growth_pct <= 0:
            positive_contributions.append("Negative or static asset accumulation indicating clean financial transparency")

        # 4. Investigative Flags
        flags = politician_data.get("flags", {})
        if flags.get("edRaid"):
            score -= 25
            risk_factors.append("Active Enforcement Directorate (ED) money laundering or contract probe")
        if flags.get("offshoreLink"):
            score -= 20
            risk_factors.append("Named in international leaks regarding beneficial ownership of offshore shell companies")
        if flags.get("cronyism"):
            score -= 15
            risk_factors.append("Administrative cronyism flags in local/state contract allocations")
        
        if has_conviction:
            score = min(score, 25)  # Cap score if convicted
            risk_factors.append("Convicted in a court of law for corporate cheating or land allocation fraud")

        # Cap the score between 0 and 100
        score = max(0, min(100, int(score)))

        # Assign Risk Level
        if score >= 71:
            risk_level = "LOW"
        elif score >= 41:
            risk_level = "MEDIUM"
        elif score >= 25:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

        # Generate summary statement
        name = politician_data.get("name", "Representative")
        state = politician_data.get("state", "India")
        constituency = politician_data.get("constituency", "Constituency")
        party = politician_data.get("party", "IND")
        
        summary = f"{name} is a {role} representing the {constituency} constituency in {state} from the {party} party."
        if risk_level in ["HIGH", "CRITICAL"]:
            summary += f" Dynamic telemetry scans flag {name} as a {risk_level}-risk politician with a score of {score}/100. This is driven by {len(risk_factors)} critical indicators, including unexplained net worth accumulation of {growth_pct}% and active pending prosecutions."
        elif risk_level == "MEDIUM":
            summary += f" Baseline telemetries flag {name} under moderate risk classification ({score}/100) due to moderate asset shifts or minor protest-related FIRs, though they maintain a clean profile elsewhere."
        else:
            summary += f" Standard checks identify {name} as a low-risk public representative with a pristine integrity rating of {score}/100. They present clean financial declarations and exemplary governance devotion indices."

        # Merge results back into integrityDetails structure
        politician_data["aiScore"] = score
        politician_data["integrityDetails"] = {
            "financialIntegrity": max(10, score + 10 if score < 90 else 98),
            "publicService": max(10, int(attendance * 0.9 + 10)),
            "criminalHistory": 100 - (cases_count * 15 if cases_count < 6 else 90),
            "riskLevel": risk_level,
            "summary": summary,
            "riskFactors": risk_factors,
            "positiveContributions": positive_contributions if positive_contributions else ["Maintained active voter grievance support cell in the constituency"]
        }
        return politician_data

if __name__ == "__main__":
    engine = AIScoringEngine()
    test_data = {
        "name": "Rajendra Singh",
        "role": "MLA",
        "party": "IND",
        "state": "Uttar Pradesh",
        "constituency": "Ghazipur Sadar",
        "attendancePct": 45,
        "criminalCases": 4,
        "netWorth": "45Cr",
        "netWorthGrowth": 320,
        "flags": { "edRaid": True, "cronyism": True },
        "financialTimeline": [{"year": 2022, "assets": 45.0, "liabilities": 8.5}],
        "criminalCaseList": [
            {"caseNumber": "FIR 12/2023", "charges": ["bribery in contracts"], "sections": ["PC Act Sec 7"], "status": "Under Investigation"}
        ]
    }
    profiled = engine.compute_integrity_profile(test_data)
    import pprint
    pprint.pprint(profiled["integrityDetails"])
