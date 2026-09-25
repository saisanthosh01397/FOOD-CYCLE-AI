from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel

class ListingStatus(str, enum.Enum):
    POSTED = "POSTED"
    CLAIMED = "CLAIMED"
    PICKUP_SCHEDULED = "PICKUP_SCHEDULED"
    COLLECTED = "COLLECTED"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"

class RescueOrganization(BaseModel):
    __tablename__ = "rescue_organizations"
    
    name = Column(String(100), nullable=False)
    org_type = Column(String(50), nullable=False)
    service_area = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    contact_email = Column(String(100), nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class RescueListing(BaseModel):
    __tablename__ = "rescue_listings"
    
    food_name = Column(String(100), nullable=False)
    food_category = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    available_until = Column(DateTime, nullable=False)
    is_vegetarian = Column(Boolean, default=True)
    packaging = Column(String(100), nullable=True)
    requires_pickup = Column(Boolean, default=True)
    description = Column(Text, nullable=True)
    location_area = Column(String(100), nullable=False)
    status = Column(Enum(ListingStatus), default=ListingStatus.POSTED)
    donor_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    claimed_by_org_id = Column(String(36), ForeignKey("rescue_organizations.id", ondelete="SET NULL"), nullable=True)
    
    donor = relationship("User")
    organization = relationship("RescueOrganization")

class Notification(BaseModel):
    __tablename__ = "notifications"
    
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    org_id = Column(String(36), ForeignKey("rescue_organizations.id", ondelete="CASCADE"), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    listing_id = Column(String(36), ForeignKey("rescue_listings.id", ondelete="CASCADE"), nullable=True)
    
    listing = relationship("RescueListing")
