from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class PredictionBase(BaseModel):
    log_id: Optional[str] = Field(None, example="123e4567-e89b-12d3-a456-426614174000")
    predicted_quantity: float = Field(..., example=6.2)
    confidence_score: float = Field(..., example=0.89)
    prediction_date: date = Field(..., example="2026-08-05")

class PredictionResponse(PredictionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
