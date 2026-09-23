from fastapi import APIRouter
from pydantic import BaseModel
from services.nsqf_matcher import match_nsqf_qps_for_profile

router = APIRouter(prefix="/api/nsqf", tags=["NSQF Engine"])

class NSQFMatchRequest(BaseModel):
    name: str = "Kavitha R"
    education: str = "10th Standard"
    familyOccupation: str = "Traditional Handloom Weaving & Agri-labor"
    location: str = "Salem, Tamil Nadu"

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
