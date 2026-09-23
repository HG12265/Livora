from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.gemini_service import parse_voice_transcript_with_gemini
from services.nsqf_matcher import match_nsqf_qps_for_profile
from database import save_beneficiary_profile, get_all_beneficiary_profiles

router = APIRouter(prefix="/api/voice", tags=["Voice Engine"])

class VoiceProcessRequest(BaseModel):
    transcript: Optional[str] = None
    language: str = "ta"
    name: Optional[str] = "Gowtham"
    location: Optional[str] = "Salem, Tamil Nadu"
    education: Optional[str] = "12th Standard"
    familyOccupation: Optional[str] = "Agriculture"
    mobility: Optional[str] = "Local"
    preference: Optional[str] = "Self-Employment"

@router.post("/process")
def process_voice_input(req: VoiceProcessRequest):
    """
    Processes collected voice interview inputs from React frontend,
    parses attributes with Gemini AI, matches NSQF courses, and saves profile to MongoDB.
    """
    profile_dict = req.dict()
    extracted_profile = parse_voice_transcript_with_gemini(profile_dict, req.language)
    
    # Save directly to MongoDB / Database
    profile_id = save_beneficiary_profile(extracted_profile)
    extracted_profile["profile_id"] = profile_id

    # Compute NSQF matched qualification packs
    matched_qps = match_nsqf_qps_for_profile(extracted_profile)

    return {
        "status": "success",
        "profile_id": profile_id,
        "database_status": "Saved to MongoDB collection 'beneficiary_profiles'",
        "profile": extracted_profile,
        "matched_courses": matched_qps,
        "voice_response": f"வணக்கம் {extracted_profile['name']}! உங்கள் சுயவிவரம் MongoDB தரவுத்தளத்தில் சேமிக்கப்பட்டது."
    }

@router.get("/profiles")
def get_stored_profiles():
    """
    Returns all beneficiary profiles saved in MongoDB / database.
    """
    profiles = get_all_beneficiary_profiles()
    return {
        "status": "success",
        "total_profiles_in_db": len(profiles),
        "profiles": profiles
    }
