from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import generate_gia_action_plan_with_gemini

router = APIRouter(prefix="/api/admin", tags=["MoSJE Admin Engine"])

class PlanGenerateRequest(BaseModel):
    district: str = "Salem"
    state: str = "Tamil Nadu"

class AssignConsultantRequest(BaseModel):
    beneficiary_id: str = "PMAJAY-SC-2026-8841"
    beneficiary_name: str = "Gowtham"
    consultant_name: str = "Mr. R. Ramesh"
    district: str = "Salem"

# In-memory financial consultants registry
CONSULTANTS_REGISTRY = [
    {"id": "FC-SLM-01", "name": "Mr. R. Ramesh", "district": "Salem", "state": "Tamil Nadu", "phone": "+91 94432 10987", "active_beneficiaries": 42, "grant_sanctioned": "₹ 18.5 Lakhs", "status": "Active"},
    {"id": "FC-SLM-02", "name": "Smt. K. Kavitha", "district": "Salem", "state": "Tamil Nadu", "phone": "+91 98421 55670", "active_beneficiaries": 38, "grant_sanctioned": "₹ 16.0 Lakhs", "status": "Active"},
    {"id": "FC-[#MDU-01", "name": "Mr. S. Murugan", "district": "Madurai", "state": "Tamil Nadu", "phone": "+91 97890 44321", "active_beneficiaries": 55, "grant_sanctioned": "₹ 24.2 Lakhs", "status": "Active"},
    {"id": "FC-[#VRN-01", "name": "Mr. A. K. Sharma", "district": "Varanasi", "state": "Uttar Pradesh", "phone": "+91 91234 88765", "active_beneficiaries": 64, "grant_sanctioned": "₹ 28.0 Lakhs", "status": "Active"}
]

# In-memory placement lifecycle pipeline
PLACEMENT_PIPELINE = [
    {"id": "PMAJAY-SC-2026-8841", "name": "Gowtham", "district": "Salem", "course": "Organic Agri-Input Producer (NSQF Level 4)", "status": "NSQF Certified", "outcomeType": "Self-Employment", "grantStatus": "Toolkit Grant Sanctioned (₹35,000)", "assignedConsultant": "Mr. R. Ramesh"},
    {"id": "PMAJAY-SC-2026-8842", "name": "Kavitha R", "district": "Salem", "course": "Solar PV Installer (NSQF Level 4)", "status": "In Training", "outcomeType": "Wage Job", "grantStatus": "Transport Allowance Active", "assignedConsultant": "Smt. K. Kavitha"},
    {"id": "PMAJAY-SC-2026-8843", "name": "M. Karthik", "district": "Madurai", "course": "Data Entry Saksham (NSQF Level 4)", "status": "Placed in Job", "outcomeType": "Wage Job (₹18,000/mo)", "grantStatus": "Completed", "assignedConsultant": "Mr. S. Murugan"},
    {"id": "PMAJAY-SC-2026-8844", "name": "P. Lakshmi", "district": "Villupuram", "course": "Master Weaver (NSQF Level 4)", "status": "Enterprise Started", "outcomeType": "Handloom SHG Leader", "grantStatus": "Modernization Grant Released (₹50,000)", "assignedConsultant": "Mr. R. Ramesh"}
]

@router.get("/heatmap")
def get_heatmap_analytics():
    return {
        "status": "success",
        "districts": [
            {"district": "Salem", "state": "Tamil Nadu", "topDemand": "Organic Agriculture & Solar PV", "scPopulation": "18.4%", "activeBeneficiaries": 1420, "placementRate": "84%"},
            {"district": "Madurai", "state": "Tamil Nadu", "topDemand": "Agri-Processing & Mobile Tech", "scPopulation": "21.2%", "activeBeneficiaries": 1890, "placementRate": "82%"},
            {"district": "Villupuram", "state": "Tamil Nadu", "topDemand": "Bio-Inputs & Modern Apparel", "scPopulation": "28.6%", "activeBeneficiaries": 2310, "placementRate": "74%"},
            {"district": "Varanasi", "state": "Uttar Pradesh", "topDemand": "Handicrafts & Digital Saksham", "scPopulation": "19.8%", "activeBeneficiaries": 3100, "placementRate": "80%"},
            {"district": "Patna", "state": "Bihar", "topDemand": "Data Entry & Solar Technician", "scPopulation": "16.5%", "activeBeneficiaries": 2750, "placementRate": "76%"}
        ]
    }

@router.get("/consultants")
def get_consultants():
    return {"status": "success", "consultants": CONSULTANTS_REGISTRY}

@router.get("/placements")
def get_placements():
    return {"status": "success", "placements": PLACEMENT_PIPELINE}

@router.post("/assign-consultant")
def assign_consultant(req: AssignConsultantRequest):
    return {
        "status": "success",
        "message": f"Assigned Financial Consultant {req.consultant_name} to beneficiary {req.beneficiary_name} ({req.beneficiary_id})",
        "assignment": req.dict()
    }

@router.post("/generate-plan")
def generate_perspective_plan(req: PlanGenerateRequest):
    action_plan = generate_gia_action_plan_with_gemini(req.district, req.state)
    return {
        "status": "success",
        "action_plan": action_plan
    }
