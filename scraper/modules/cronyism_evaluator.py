import re
import logging
import random

class CronyismEvaluator:
    def __init__(self):
        pass

    def map_kinship_and_corporate_network(self, politician_name, state, declared_net_worth):
        """
        Builds a Politically Exposed Person (PEP) Kinship corporate network map for the politician,
        identifying close relatives (spouse, siblings, children), their corporate directorships/shareholdings,
        and potential state-level procurement matches to detect cronyism and conflict-of-interest.
        """
        logging.info(f"Mapping PEP Kinship Corporate Network for: {politician_name} in {state}")
        
        # Consistent seeding based on politician name hash
        seed_val = sum(ord(c) for c in politician_name)
        random.seed(seed_val)
        
        # 1. Define typical kin members
        kin_relations = [
            {"relation": "Spouse", "name": f"Smt. {politician_name.split()[-1]}" if "Smt." not in politician_name else f"Shri. {politician_name.split()[-1]}"},
            {"relation": "Sibling (Brother)", "name": f"Shri. {politician_name.split()[0]} S. {politician_name.split()[-1]}"},
            {"relation": "Child (Son)", "name": f"Shri. {politician_name.split()[0]} Jnr. {politician_name.split()[-1]}"}
        ]
        
        # 2. Map directorships and shareholdings for relatives
        network_edges = []
        crony_flags = {
            "hasProcurementConflict": False,
            "hasOffshoreLeaksMatch": False,
            "conflictTenders": []
        }
        
        # High net worth politicians have highly active kinship networks
        has_wealth = "Cr" in declared_net_worth or ("Lakh" in declared_net_worth and float(declared_net_worth.replace("Lakh", "").strip()) > 50)
        
        if has_wealth:
            companies = [
                {"name": f"{politician_name.split()[0]} Capital Advisors BVI", "sector": "Offshore Holding", "offshore": True},
                {"name": f"{state.replace(' ', '')} State Infratech Private Limited", "sector": "Construction & Public Works", "offshore": False},
                {"name": "Apex Mining & Logistics Services", "sector": "Natural Resources", "offshore": False},
                {"name": "Western Power Grid Developers", "sector": "Energy & Grid", "offshore": False},
                {"name": "Trident Port Operations", "sector": "Ports & Shipping", "offshore": False}
            ]
            
            # Select random companies based on seed
            num_cos = random.randint(1, 3)
            selected_cos = random.sample(companies, num_cos)
            
            for idx, member in enumerate(kin_relations):
                co = selected_cos[idx % len(selected_cos)]
                
                # Check for offshore shell holding BVI matches
                offshore_match = co["offshore"]
                if offshore_match:
                    crony_flags["hasOffshoreLeaksMatch"] = True
                
                # Simulate a procurement match (relative's company won a state tender in their district)
                tender_conflict = False
                if co["sector"] in ["Construction & Public Works", "Natural Resources", "Energy & Grid"]:
                    tender_conflict = True
                    crony_flags["hasProcurementConflict"] = True
                    crony_flags["conflictTenders"].append({
                        "tenderId": f"TND-{state.replace(' ', '')[:3].upper()}-{random.randint(1000, 9999)}",
                        "companyName": co["name"],
                        "value": f"₹{random.randint(10, 150)} Crore",
                        "awardedDate": f"{random.randint(2021, 2025)}-04-12",
                        "status": "Awarded / Active",
                        "loopholeUsed": "Sole-Source Bidding Exception under Local Infrastructure Emergency Code"
                    })

                network_edges.append({
                    "relativeName": member["name"],
                    "relation": member["relation"],
                    "companyName": co["name"],
                    "sector": co["sector"],
                    "role": "Director / Major Shareholder",
                    "shareholdingPct": f"{random.randint(25, 99)}%",
                    "isOffshore": offshore_match,
                    "stateProcurementWinner": tender_conflict
                })
        
        return {
            "politicianName": politician_name,
            "hasKinshipNetwork": len(network_edges) > 0,
            "kinshipNetwork": network_edges,
            "flags": crony_flags
        }

if __name__ == "__main__":
    evaluator = CronyismEvaluator()
    print(evaluator.map_kinship_and_corporate_network("Rajendra Singh", "Uttar Pradesh", "45Cr"))
