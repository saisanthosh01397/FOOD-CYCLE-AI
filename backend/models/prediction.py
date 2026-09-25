from sqlalchemy import Column, Float, String, ForeignKey, Date, JSON
from sqlalchemy.orm import relationship
from .base import BaseModel

class WastePrediction(BaseModel):
    __tablename__ = "waste_predictions"

    log_id = Column(String(36), ForeignKey("food_waste_logs.id", ondelete="CASCADE"), nullable=True)
    items = Column(JSON, nullable=False) # Stores array of dish predictions
    total_preparation_kg = Column(Float, nullable=False)
    total_expected_waste_kg = Column(Float, nullable=False)
    preventive_actions = Column(JSON, nullable=False)
    prediction_date = Column(Date, nullable=False)

    log = relationship("FoodWasteLog", back_populates="predictions")
