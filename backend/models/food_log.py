from sqlalchemy import Column, String, Float, Integer, Date, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel

class FoodWasteLog(BaseModel):
    __tablename__ = "food_waste_logs"

    date = Column(Date, nullable=False, index=True)
    meal_type = Column(String(50), nullable=False) # e.g., Breakfast, Lunch, Dinner
    food_category = Column(String(100), nullable=False) # e.g., Vegetables, Grains, Meat
    quantity_kg = Column(Float, nullable=False)
    people_served = Column(Integer, nullable=False)
    weather = Column(String(100), nullable=True)
    special_event = Column(Boolean, default=False)

    predictions = relationship("WastePrediction", back_populates="log", cascade="all, delete-orphan")
    recovery_recommendations = relationship("RecoveryRecommendation", back_populates="log", cascade="all, delete-orphan")
