from sqlalchemy import Column, Float
from .base import BaseModel

class DashboardStatistic(BaseModel):
    __tablename__ = "dashboard_statistics"

    total_waste = Column(Float, default=0.0)
    total_compost = Column(Float, default=0.0)
    total_biogas = Column(Float, default=0.0)
    total_donations = Column(Float, default=0.0)
    carbon_saved = Column(Float, default=0.0)
