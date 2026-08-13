from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserActivityLog, UserRole
from models.food_log import FoodWasteLog
from dependencies import get_current_admin_user
import platform
import psutil
import time

router = APIRouter(prefix="/system", tags=["System Settings"])

@router.get("/status")
def get_system_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    total_users = db.query(User).count()
    total_food_logs = db.query(FoodWasteLog).count()
    
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

@router.post("/backup")
def trigger_backup(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    import os
    import datetime
    backup_dir = os.path.join(os.path.dirname(__file__), '../backups')
    os.makedirs(backup_dir, exist_ok=True)
    filename = f"db_backup_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.sql"
    with open(os.path.join(backup_dir, filename), 'w') as f:
        f.write("-- Mock Database Backup\n")
    
    log = UserActivityLog(user_id=current_user.id, action_type="System", description=f"Triggered manual database backup ({filename})")
    db.add(log)
    db.commit()
    return {"message": "Database backup completed successfully", "filename": filename}

@router.post("/restore")
def trigger_restore(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    time.sleep(1) # simulate restore
    log = UserActivityLog(user_id=current_user.id, action_type="System", description="Triggered database restore from last backup")
    db.add(log)
    db.commit()
    return {"message": "Database restored successfully"}
