from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class RecoveryBase(BaseModel):
    log_id: str = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    recommended_method: str = Field(..., example="Compost")
    expected_output: float = Field(..., example=2.5)
    nitrogen: Optional[float] = Field(None, example=1.2)
    phosphorus: Optional[float] = Field(None, example=0.5)
    potassium: Optional[float] = Field(None, example=0.8)

class RecoveryResponse(RecoveryBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
