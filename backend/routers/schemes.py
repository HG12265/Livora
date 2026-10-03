from fastapi import APIRouter
from database import get_all_gia_schemes, get_all_training_centers

router = APIRouter(prefix="/api/schemes", tags=["PM-AJAY Schemes & Centers"])

@router.get("/all")
def get_schemes():
    return {
        "status": "success",
        "schemes": get_all_gia_schemes()
    }

@router.get("/centers")
def get_training_centers(district: str = None):
    centers = get_all_training_centers()
    if district:
        filtered = [c for c in centers if district.lower() in c.get("district", "").lower()]
        return {"status": "success", "centers": filtered}
    return {
        "status": "success",
        "centers": centers
    }
