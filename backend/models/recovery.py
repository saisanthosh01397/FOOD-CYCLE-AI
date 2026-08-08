from sqlalchemy import Column, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class RecoveryRecommendation(BaseModel):
    __tablename__ = "recovery_recommendations"

    log_id = Column(String(36), ForeignKey("food_waste_logs.id", ondelete="CASCADE"), nullable=False)
    recommended_method = Column(String(100), nullable=False) # e.g., Compost, Donation, Biogas
    expected_output = Column(Float, nullable=False) # e.g., output in kg or liters
    nitrogen = Column(Float, nullable=True) # npk metrics for compost
    phosphorus = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)

    log = relationship("FoodWasteLog", back_populates="recovery_recommendations")
