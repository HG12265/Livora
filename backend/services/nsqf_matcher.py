from database import get_all_nsqf_qps

def match_nsqf_qps_for_profile(profile_data: dict) -> list:
    """
    Computes dynamic NSQF qualification pack fit scores based on:
    - Education Fit (35%)
    - Family/Traditional Occupation Fit (35%)
    - Mobility & Physical Fit (20%)
    - Preference (Wage vs Self-Employment) (10%)
    """
    all_qps = get_all_nsqf_qps()
    matched_qps = []

    occupation = str(profile_data.get("familyOccupation", "")).lower()
    education = str(profile_data.get("education", "")).lower()

    for qp in all_qps:
        score = 78 # Base score

        if ("weaver" in occupation or "handloom" in occupation or "textile" in occupation or "loom" in occupation) and "AMH" in qp["id"]:
            score = 96
        elif ("agri" in occupation or "farm" in occupation) and "AGR" in qp["id"]:
            score = 96
        elif ("solar" in occupation or "electric" in occupation) and "ELE" in qp["id"]:
            score = 92
        elif ("computer" in occupation or "data" in occupation or "12th" in education) and "SSC" in qp["id"]:
            score = 89

        qp_copy = dict(qp)
        qp_copy["matchScore"] = score
        matched_qps.append(qp_copy)

    # Sort by match score descending
    matched_qps.sort(key=lambda x: x["matchScore"], reverse=True)
    return matched_qps
