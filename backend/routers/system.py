from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserActivityLog, UserRole
from models.food_log import FoodLog
from dependencies import get_current_admin_user
import platform
import psutil

router = APIRouter(prefix="/system", tags=["System Settings"])

@router.get("/status")
def get_system_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    total_users = db.query(User).count()
    total_food_logs = db.query(FoodLog).count()
    
    # Calculate totals from users table
    users = db.query(User).all()
    total_predictions = sum(u.total_predictions for u in users)
    total_images_analyzed = sum(u.total_image_analyses for u in users)
    
    return {
        "metrics": {
            "Total Users": total_users,
            "Total Food Logs": total_food_logs,
            "Total Predictions": total_predictions,
            "Total Images Analyzed": total_images_analyzed
        },
        "system": {
            "Database Status": "Online",
            "Backend Status": "Running",
            "AI Model Status (Prophet, Random Forest, YOLO)": "Loaded & Active",
            "OS": platform.system(),
            "CPU Usage": f"{psutil.cpu_percent()}%",
            "Memory Usage": f"{psutil.virtual_memory().percent}%"
        }
    }

@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user), limit: int = 50):
    logs = db.query(UserActivityLog).order_by(UserActivityLog.created_at.desc()).limit(limit).all()
    
    result = []
    for log in logs:
        user = db.query(User).filter(User.id == log.user_id).first()
        result.append({
            "time": log.created_at.strftime("%H:%M") if log.created_at else "Unknown",
            "date": log.created_at.strftime("%Y-%m-%d") if log.created_at else "Unknown",
            "user": user.full_name if user else "Unknown User",
            "action": log.action_type,
            "description": log.description
        })
    return result
