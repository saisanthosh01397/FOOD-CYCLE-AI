from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.dashboard import DashboardResponse
from services.dashboard_service import get_dashboard_stats
from models.user import User, UserRole, UserActivityLog
from models.food_log import FoodWasteLog
from dependencies import get_current_admin_user
from sqlalchemy import func

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get(
    "",
    summary="Get Dashboard Statistics",
    description="Retrieves aggregated statistics for the dashboard."
)
def get_dashboard(db: Session = Depends(get_db)):
    return get_dashboard_stats(db)

@router.get(
    "/admin-stats",
    summary="Get Admin Dashboard Statistics",
)
def get_admin_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    total_users = db.query(User).count()
    administrators = db.query(User).filter(User.role == UserRole.administrator).count()
    mess_managers = db.query(User).filter(User.role == UserRole.mess_manager).count()
    
    # We can get total waste logged from FoodLog model if it exists, or just use the dashboard_service logic
    # For now, we will query user activity logs for totals
    total_predictions = db.query(UserActivityLog).filter(UserActivityLog.action_type == "Prediction").count()
    total_image_analyses = db.query(UserActivityLog).filter(UserActivityLog.action_type == "Image Upload").count()
    total_recovery_recommendations = db.query(UserActivityLog).filter(UserActivityLog.action_type == "Recovery Recommendation").count()
    
    total_waste = db.query(func.sum(FoodWasteLog.quantity_kg)).scalar() or 0.0
    
    return {
        "total_users": total_users,
        "administrators": administrators,
        "mess_managers": mess_managers,
        "total_waste_logged": total_waste,
        "total_predictions": total_predictions,
        "total_image_analyses": total_image_analyses,
        "total_recovery_recommendations": total_recovery_recommendations
    }
