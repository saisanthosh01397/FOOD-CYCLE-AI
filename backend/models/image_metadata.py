from sqlalchemy import Column, String, Float, JSON
from .base import BaseModel

class ImageMetadata(BaseModel):
    __tablename__ = "image_metadata"
    
    log_id = Column(String(36), nullable=True)

    filename = Column(String(255), nullable=False)
    result_filename = Column(String(255), nullable=True)
    detected_categories = Column(JSON, nullable=True)
    confidence = Column(Float, nullable=True)
    status = Column(String(50), default="Uploaded")
