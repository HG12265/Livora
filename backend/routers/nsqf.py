from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.nsqf_matcher import match_nsqf_qps_for_profile
from database import get_all_nsqf_qps

router = APIRouter(prefix="/api/nsqf", tags=["NSQF Engine"])

class NSQFMatchRequest(BaseModel):
    name: Optional[str] = "Kavitha R"
    education: Optional[str] = "10th Standard"
    familyOccupation: Optional[str] = "Traditional Handloom Weaving & Agri-labor"
    currentSkills: Optional[str] = "Weaving, crop harvesting"
    location: Optional[str] = "Salem, Tamil Nadu"
    preference: Optional[str] = "Self-Employment"

@router.get("/courses")
def get_all_courses():
    """
    Returns all 8 official NSQF Qualification Packs with skill gaps and curriculum.
    """
    return {
        "status": "success",
        "courses": get_all_nsqf_qps()
    }

@router.post("/match")
def match_nsqf_courses(profile: NSQFMatchRequest):
    """
    Computes NSQF qualification pack fit scores and skill gaps for candidate profile.
    """
    matched_qps = match_nsqf_qps_for_profile(profile.dict())
    return {
        "status": "success",
        "total_matched": len(matched_qps),
        "matched_courses": matched_qps
    }
