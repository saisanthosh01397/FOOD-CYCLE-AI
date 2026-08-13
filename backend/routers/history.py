from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from models.food_log import FoodWasteLog
from models.prediction import WastePrediction
from models.recovery import RecoveryRecommendation
from models.image_metadata import ImageMetadata
from dependencies import get_current_active_user

router = APIRouter(prefix="/history", tags=["History"])

@router.get("")
def get_history(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    category: str = "",
    meal_type: str = "",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    query = db.query(FoodWasteLog)
    
    if search:
        query = query.filter(or_(
            FoodWasteLog.food_category.ilike(f"%{search}%"),
            FoodWasteLog.meal_type.ilike(f"%{search}%")
        ))
    if category:
        query = query.filter(FoodWasteLog.food_category == category)
    if meal_type:
        query = query.filter(FoodWasteLog.meal_type == meal_type)
        
    total = query.count()
    offset = (page - 1) * limit
    logs = query.order_by(FoodWasteLog.date.desc()).offset(offset).limit(limit).all()
    
    items = []
    for log in logs:
        pred = db.query(WastePrediction).filter(WastePrediction.log_id == log.id).first()
        rec = db.query(RecoveryRecommendation).filter(RecoveryRecommendation.log_id == log.id).first()
        img = db.query(ImageMetadata).filter(ImageMetadata.log_id == log.id).first()
        
        items.append({
            "id": log.id,
            "date": str(log.date),
            "meal_type": log.meal_type,
            "food_category": log.food_category,
            "quantity_kg": log.quantity_kg,
            "prediction": pred.predicted_quantity if pred else None,
            "recovery": rec.recommended_method if rec else None,
            "image": img.filename if img else None,
            "status": "Completed"
        })
        
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }
