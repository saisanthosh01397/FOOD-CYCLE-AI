from sqlalchemy.orm import Session
from sqlalchemy import func
from models.food_log import FoodWasteLog

def get_dashboard_stats(db: Session):
    total_waste = db.query(func.sum(FoodWasteLog.quantity_kg)).scalar() or 0.0
    # Dummy logic for aggregated dashboard for now
    return {
        "total_waste": total_waste,
        "total_compost": total_waste * 0.4,
        "total_biogas": total_waste * 0.2,
        "total_donations": total_waste * 0.3,
        "carbon_saved": total_waste * 1.5,
    }
