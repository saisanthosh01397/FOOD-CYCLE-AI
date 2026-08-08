from sqlalchemy.orm import Session
from models.food_log import FoodWasteLog
from schemas.food_log import FoodLogCreate

def get_food_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(FoodWasteLog).offset(skip).limit(limit).all()

def get_food_log(db: Session, log_id: str):
    return db.query(FoodWasteLog).filter(FoodWasteLog.id == log_id).first()

def create_food_log(db: Session, log: FoodLogCreate):
    db_log = FoodWasteLog(
        date=log.date,
        meal_type=log.meal_type,
        food_category=log.food_category,
        quantity_kg=log.quantity_kg,
        people_served=log.people_served,
        weather=log.weather,
        special_event=log.special_event
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def update_food_log(db: Session, log_id: str, log: FoodLogCreate):
    db_log = get_food_log(db, log_id)
    if db_log:
        for key, value in log.model_dump().items():
            setattr(db_log, key, value)
        db.commit()
        db.refresh(db_log)
    return db_log

def delete_food_log(db: Session, log_id: str):
    db_log = get_food_log(db, log_id)
    if db_log:
        db.delete(db_log)
        db.commit()
    return db_log
