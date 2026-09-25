from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import UserActivityLog, User
from dependencies import get_current_active_user
from services.recovery_service import recovery_service

router = APIRouter(prefix="/recovery", tags=["Recovery"])

from datetime import datetime
from models.food_log import FoodWasteLog
from models.recovery import RecoveryRecommendation

@router.post(
    "",
    summary="Generate Recovery Recommendation",
    description="Generates a resource recovery recommendation for a given food log."
)
def create_recommendation(log_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    res = recovery_service.recommend(log_data)
    
    # Persist parent log
    fwl = FoodWasteLog(
        date=datetime.now().date(),
        meal_type="Recovery Event",
        food_category=log_data.get("food_category", "Mixed"),
        quantity_kg=log_data.get("quantity_kg", 0.0),
        people_served=0
    )
    db.add(fwl)
    db.commit()
    db.refresh(fwl)
    
    # Persist child recovery
    npk = res.get("npk_estimation", {})
    rr = RecoveryRecommendation(
        log_id=fwl.id,
        recommended_method=res.get("recommended_method", "Unknown"),
        expected_output=0.0,
        nitrogen=npk.get("nitrogen", 0.0),
        phosphorus=npk.get("phosphorus", 0.0),
        potassium=npk.get("potassium", 0.0)
    )
    db.add(rr)
    
    log = UserActivityLog(user_id=current_user.id, action_type="Recovery Recommendation", description="Generated a recovery recommendation")
    db.add(log)
    db.commit()
    return res

@router.get(
    "/history",
    summary="Get Recovery Recommendation History",
    description="Retrieves a history of past recommendations."
)
def get_recommendation_history(db: Session = Depends(get_db)):
    return recovery_service.get_history()
