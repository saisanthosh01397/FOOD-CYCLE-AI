from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import UserActivityLog, User
from dependencies import get_current_active_user
from services.prediction_service import prediction_service

router = APIRouter(prefix="/prediction", tags=["Predictions"])

@router.post(
    "",
    summary="Generate Waste Prediction",
    description="Generates a waste prediction for a given food log."
)
def create_prediction(log_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    res = prediction_service.predict(log_data)
    
    current_user.total_predictions += 1
    log = UserActivityLog(user_id=current_user.id, action_type="Prediction", description="Generated a waste prediction")
    db.add(log)
    db.commit()
    return res

@router.get(
    "/history",
    summary="Get Prediction History",
    description="Retrieves a history of past predictions."
)
def get_prediction_history(db: Session = Depends(get_db)):
    return prediction_service.get_history()
