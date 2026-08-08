from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.food_log import FoodLogCreate, FoodLogResponse
from services.food_log_service import create_food_log, get_food_logs, get_food_log, update_food_log, delete_food_log

router = APIRouter(prefix="/food-logs", tags=["Food Waste Logs"])

@router.post(
    "",
    response_model=FoodLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new food waste log",
    description="Records a new food waste entry."
)
def create_log(log: FoodLogCreate, db: Session = Depends(get_db)):
    return create_food_log(db, log)

@router.get(
    "",
    response_model=List[FoodLogResponse],
    summary="Get all food waste logs",
    description="Retrieves a list of all food waste logs."
)
def read_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_food_logs(db, skip=skip, limit=limit)

@router.get(
    "/{id}",
    response_model=FoodLogResponse,
    summary="Get a specific food waste log",
    description="Retrieves details of a specific food waste log by ID."
)
def read_log(id: str, db: Session = Depends(get_db)):
    log = get_food_log(db, id)
    if not log:
        raise HTTPException(status_code=404, detail="Food waste log not found")
    return log

@router.put(
    "/{id}",
    response_model=FoodLogResponse,
    summary="Update a food waste log",
    description="Updates the details of an existing food waste log."
)
def update_log(id: str, log: FoodLogCreate, db: Session = Depends(get_db)):
    updated_log = update_food_log(db, id, log)
    if not updated_log:
        raise HTTPException(status_code=404, detail="Food waste log not found")
    return updated_log

@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a food waste log",
    description="Removes a food waste log."
)
def delete_log(id: str, db: Session = Depends(get_db)):
    deleted_log = delete_food_log(db, id)
    if not deleted_log:
        raise HTTPException(status_code=404, detail="Food waste log not found")
    return None
