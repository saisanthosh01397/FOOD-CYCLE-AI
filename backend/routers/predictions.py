from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import UserActivityLog, User
from dependencies import get_current_active_user
from services.prediction_service import prediction_service

router = APIRouter(prefix="/prediction", tags=["Predictions"])

from datetime import datetime
from models.food_log import FoodWasteLog
from models.prediction import WastePrediction

@router.post(
    "",
    summary="Generate Waste Prediction",
    description="Generates a waste prediction for a given food log."
)
def create_prediction(log_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Validate Menu
    menu_items = log_data.get("menu_items", [])
    if not menu_items or len(menu_items) == 0:
        return {"error": "Menu configuration cannot be empty. Please select at least one dish."}
        
    # 1. Run inference
    res = prediction_service.predict(log_data)
    
    # 2. Extract inputs
    p_date_str = log_data.get("date", datetime.now().strftime("%Y-%m-%d"))
    p_date = datetime.strptime(p_date_str, "%Y-%m-%d").date()
    meal_type = log_data.get("meal_type", "Lunch")
    people = int(log_data.get("people", 100))
    weather = log_data.get("weather", "sunny")
    sp_event = log_data.get("special_event", "none") != "none"
    
    # 3. Create parent FoodWasteLog
    fwl = FoodWasteLog(
        date=p_date,
        meal_type=meal_type,
        food_category="Multi-Item Menu",
        quantity_kg=res.get("total_preparation_kg", 0.0),
        people_served=people,
        weather=weather,
        special_event=sp_event
    )
    db.add(fwl)
    db.commit()
    db.refresh(fwl)
    
    # 4. Create child WastePrediction
    wp = WastePrediction(
        log_id=fwl.id,
        items=res.get("items", []),
        total_preparation_kg=res.get("total_preparation_kg", 0.0),
        total_expected_waste_kg=res.get("total_expected_waste_kg", 0.0),
        preventive_actions=res.get("preventive_actions", []),
        prediction_date=p_date
    )
    db.add(wp)
    
    current_user.total_predictions += 1
    log = UserActivityLog(user_id=current_user.id, action_type="Prediction", description="Generated a dish-level waste prediction")
    db.add(log)
    db.commit()
    
    res["log_id"] = fwl.id
    return res

from pydantic import BaseModel
from typing import List, Dict

class ActualsPayload(BaseModel):
    log_id: str
    measurements: List[Dict]

@router.post(
    "/actuals",
    summary="Record Actuals",
    description="Records actual preparation and consumption measurements."
)
def record_actuals(payload: ActualsPayload, db: Session = Depends(get_db)):
    fwl = db.query(FoodWasteLog).filter(FoodWasteLog.id == payload.log_id).first()
    if not fwl:
        return {"error": "Prediction log not found."}
    
    fwl.actual_measurements = payload.measurements
    db.commit()
    return {"message": "Actuals recorded successfully."}

@router.get(
    "/history",
    summary="Get Prediction History",
    description="Retrieves a history of past predictions."
)
def get_prediction_history(db: Session = Depends(get_db)):
    return prediction_service.get_history()
