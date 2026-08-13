from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from dependencies import get_current_active_user, get_current_admin_user
from services.dashboard_service import get_dashboard_analytics, get_system_health

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return get_dashboard_analytics(db, current_user)

@router.get("/system-health")
def system_health(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    return get_system_health(db)
