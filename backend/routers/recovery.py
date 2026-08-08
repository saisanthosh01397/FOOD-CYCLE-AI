from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import UserActivityLog, User
from dependencies import get_current_active_user
from services.recovery_service import recovery_service

router = APIRouter(prefix="/recovery", tags=["Recovery"])

@router.post(
    "",
    summary="Generate Recovery Recommendation",
    description="Generates a resource recovery recommendation for a given food log."
)
def create_recommendation(log_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    res = recovery_service.recommend(log_data)
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
