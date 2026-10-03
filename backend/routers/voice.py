from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.gemini_service import parse_voice_transcript_with_gemini
from services.nsqf_matcher import match_nsqf_qps_for_profile
from database import (
    save_beneficiary_profile,
    get_all_beneficiary_profiles,
    get_beneficiary_profile
)

router = APIRouter(prefix="/api/voice", tags=["Voice Engine"])

class VoiceProcessRequest(BaseModel):
    transcript: Optional[str] = None
    language: str = "ta"
    name: Optional[str] = "Jeeva from Tharamangalam"
    location: Optional[str] = "Tharamangalam, Salem, Tamil Nadu"
    education: Optional[str] = "10th Standard"
    familyOccupation: Optional[str] = "Handloom Weaving"
    currentActivity: Optional[str] = "Assisting family in pit-loom weaving"
    mobility: Optional[str] = "Local"
    preference: Optional[str] = "Self-Employment"

@router.post("/process")
def process_voice_input(req: VoiceProcessRequest):
    """
    Processes collected voice interview inputs from React frontend,
    parses attributes with Gemini AI, matches NSQF courses, bridges skill gaps,
    and saves profile to persistent database.
    """
    profile_dict = req.dict()
    extracted_profile = parse_voice_transcript_with_gemini(profile_dict, req.language)
    
    # Compute NSQF matched qualification packs
    matched_qps = match_nsqf_qps_for_profile(extracted_profile)

    if matched_qps:
        extracted_profile["recommendedCourse"] = f"{matched_qps[0]['role']} (NSQF Level {matched_qps[0]['level']})"
        extracted_profile["grantEligible"] = matched_qps[0]["giaToolkitGrant"]

    # Save to Database
    profile_id = save_beneficiary_profile(extracted_profile)
    extracted_profile["id"] = profile_id

    # Multilingual Voice Feedback
    voice_feedback = {
        "ta": f"வணக்கம் {extracted_profile['name']}! உங்கள் விவரங்கள் வெற்றிகரமாக பதிவு செய்யப்பட்டன. உங்களுக்கு பரிந்துரைக்கப்பட்ட தொழிற்கல்வி: {matched_qps[0]['role'] if matched_qps else 'NSQF Skill Pack'}.",
        "en": f"Welcome {extracted_profile['name']}! Your livelihood profile is registered. Top recommended NSQF pathway: {matched_qps[0]['role'] if matched_qps else 'Skill Pack'}.",
        "hi": f"नमस्ते {extracted_profile['name']}! आपका आजीविका प्रोफाइल सफलतापूर्वक सहेजा गया। अनुशंसित प्रशिक्षण: {matched_qps[0]['role'] if matched_qps else 'प्रशिक्षण'}.",
        "te": f"నమస్కారం {extracted_profile['name']}! మీ లైవ్లీహుడ్ ప్రొఫైల్ విజయవంతంగా నమోదు చేయబడింది. సిఫార్సు చేయబడిన కోర్సు: {matched_qps[0]['role'] if matched_qps else 'శిక్షణ'}."
    }

    return {
        "status": "success",
        "profile_id": profile_id,
        "database_status": "Saved to Livora database",
        "profile": extracted_profile,
        "matched_courses": matched_qps,
        "assigned_consultant": extracted_profile.get("assignedConsultant"),
        "voice_response": voice_feedback.get(req.language, voice_feedback["en"])
    }

@router.get("/profiles")
def get_stored_profiles():
    """
    Returns all beneficiary profiles saved in database.
    """
    profiles = get_all_beneficiary_profiles()
    return {
        "status": "success",
        "total": len(profiles),
        "profiles": profiles
    }

@router.get("/profile/{profile_id}")
def get_single_profile(profile_id: str):
    profile = get_beneficiary_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"status": "success", "profile": profile}
