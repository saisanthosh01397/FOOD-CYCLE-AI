from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from sqlalchemy import text

router = APIRouter(prefix="/health", tags=["Health"])

@router.get(
    "",
    summary="Health Check",
    description="Returns the status of the API and Database connection."
)
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "error"

    return {
        "status": "ok",
        "database": db_status
    }
