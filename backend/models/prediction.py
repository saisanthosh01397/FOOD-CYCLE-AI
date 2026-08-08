from sqlalchemy import Column, Float, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from .base import BaseModel

class WastePrediction(BaseModel):
    __tablename__ = "waste_predictions"

    log_id = Column(String(36), ForeignKey("food_waste_logs.id", ondelete="CASCADE"), nullable=True)
    predicted_quantity = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    prediction_date = Column(Date, nullable=False)

    log = relationship("FoodWasteLog", back_populates="predictions")
