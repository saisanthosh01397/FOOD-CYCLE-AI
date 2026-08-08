from pydantic import BaseModel, Field
from datetime import datetime

class DashboardBase(BaseModel):
    total_waste: float = Field(default=0.0, example=150.5)
    total_compost: float = Field(default=0.0, example=80.2)
    total_biogas: float = Field(default=0.0, example=30.0)
    total_donations: float = Field(default=0.0, example=40.3)
    carbon_saved: float = Field(default=0.0, example=25.0)

class DashboardResponse(DashboardBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
