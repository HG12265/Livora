from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.gemini_service import generate_gia_action_plan_with_gemini
from database import (
    get_district_demand,
    get_all_financial_consultants,
    add_financial_consultant,
    get_all_placements,
    update_placement_status,
    get_all_perspective_plans,
    save_perspective_plan,
    get_all_coordination_tasks,
    update_coordination_task,
    save_beneficiary_profile
)

router = APIRouter(prefix="/api/admin", tags=["MoSJE PM-AJAY Admin & Ground Engine"])

class PlanGenerateRequest(BaseModel):
    district: str = "Salem"
    state: str = "Tamil Nadu"

class AssignConsultantRequest(BaseModel):
    beneficiary_id: str
    beneficiary_name: str
    consultant_name: str
    district: Optional[str] = "Salem"

class AddConsultantRequest(BaseModel):
    name: str
    district: str
    state: str
    phone: str
    email: Optional[str] = ""
    certification: str
    activeBeneficiaries: Optional[int] = 0
    grantSanctioned: Optional[str] = "₹ 0.0 Lakhs"
    loansFacilitated: Optional[str] = "₹ 0.0 Lakhs"
    status: Optional[str] = "Active"

class UpdatePlacementStatusRequest(BaseModel):
    id: str
    new_status: str
    outcomeType: Optional[str] = None
    employerOrUnit: Optional[str] = None
    incomeOrSalary: Optional[str] = None

class UpdateCoordinationTaskRequest(BaseModel):
    task_id: str
    status: str

class GroundRegisterRequest(BaseModel):
    name: str
    village: str
    district: str
    state: str = "Tamil Nadu"
    education: str
    traditionalOccupation: str
    preference: str = "Self-Employment"
    contactPhone: Optional[str] = ""
    assignedFacilitator: Optional[str] = "Gram Panchayat Village Mitra"

@router.get("/heatmap")
def get_heatmap_analytics():
    return {
        "status": "success",
        "districts": get_district_demand()
    }

@router.get("/consultants")
def get_consultants():
    return {
        "status": "success",
        "consultants": get_all_financial_consultants()
    }

@router.post("/consultants")
def register_consultant(req: AddConsultantRequest):
    new_fc = add_financial_consultant(req.dict())
    return {
        "status": "success",
        "message": f"Financial Consultant {req.name} registered under PM-AJAY GIA",
        "consultant": new_fc
    }

@router.post("/assign-consultant")
def assign_consultant(req: AssignConsultantRequest):
    return {
        "status": "success",
        "message": f"Successfully mapped Financial Consultant {req.consultant_name} to beneficiary {req.beneficiary_name} ({req.beneficiary_id})",
        "assignment": req.dict()
    }

@router.get("/placements")
def get_placements():
    return {
        "status": "success",
        "placements": get_all_placements()
    }

@router.post("/placements/update-status")
def update_placement(req: UpdatePlacementStatusRequest):
    updated = update_placement_status(
        record_id=req.id,
        new_status=req.new_status,
        outcome_type=req.outcomeType,
        employer_or_unit=req.employerOrUnit,
        income=req.incomeOrSalary
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Placement record not found")
    return {
        "status": "success",
        "message": f"Updated status to '{req.new_status}' for {updated['name']}",
        "record": updated
    }

@router.get("/perspective-plans")
def get_perspective_plans():
    return {
        "status": "success",
        "plans": get_all_perspective_plans()
    }

@router.post("/generate-plan")
def generate_perspective_plan(req: PlanGenerateRequest):
    action_plan = generate_gia_action_plan_with_gemini(req.district, req.state)
    saved_plan = save_perspective_plan(action_plan)
    return {
        "status": "success",
        "message": f"5-Year Perspective Plan generated and saved for District {req.district}",
        "action_plan": saved_plan
    }

@router.get("/coordination-tasks")
def get_coordination_tasks():
    return {
        "status": "success",
        "tasks": get_all_coordination_tasks()
    }

@router.post("/coordination-tasks/update")
def update_task_status(req: UpdateCoordinationTaskRequest):
    task = update_coordination_task(req.task_id, req.status)
    if not task:
        raise HTTPException(status_code=404, detail="Coordination task not found")
    return {
        "status": "success",
        "message": f"Updated task {req.task_id} to status: {req.status}",
        "task": task
    }

@router.post("/ground-register")
def ground_register_beneficiary(req: GroundRegisterRequest):
    profile_data = {
        "name": req.name,
        "location": f"{req.village}, {req.district}, {req.state}",
        "district": req.district,
        "state": req.state,
        "education": req.education,
        "familyOccupation": req.traditionalOccupation,
        "currentSkills": f"Ground-verified traditional skills in {req.traditionalOccupation}",
        "currentActivity": f"Local village livelihood in {req.village}",
        "mobility": "Local Village Cluster",
        "preference": req.preference,
        "facilitator": req.assignedFacilitator,
        "phone": req.contactPhone
    }
    profile_id = save_beneficiary_profile(profile_data)
    return {
        "status": "success",
        "profile_id": profile_id,
        "message": f"Beneficiary {req.name} registered via Village Ground Support Portal"
    }
