from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from database import get_db
from models.user import User, UserActivityLog
from models.rescue import RescueOrganization, RescueListing, Notification, ListingStatus
from dependencies import get_current_active_user

router = APIRouter(prefix="/rescue", tags=["Rescue"])

class ListingCreate(BaseModel):
    food_name: str
    food_category: str
    quantity: float
    unit: str
    available_until: datetime
    is_vegetarian: bool = True
    packaging: Optional[str] = None
    requires_pickup: bool = True
    description: Optional[str] = None
    location_area: str

class StatusUpdate(BaseModel):
    status: ListingStatus

@router.get("/organizations")
def get_organizations(area: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(RescueOrganization).filter(RescueOrganization.is_active == True)
    if area:
        query = query.filter(RescueOrganization.service_area.ilike(f"%{area}%"))
    return query.all()

@router.post("/listings")
def create_listing(listing_data: ListingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Create listing
    new_listing = RescueListing(
        donor_id=current_user.id,
        food_name=listing_data.food_name,
        food_category=listing_data.food_category,
        quantity=listing_data.quantity,
        unit=listing_data.unit,
        available_until=listing_data.available_until,
        is_vegetarian=listing_data.is_vegetarian,
        packaging=listing_data.packaging,
        requires_pickup=listing_data.requires_pickup,
        description=listing_data.description,
        location_area=listing_data.location_area
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    
    # Notify matching organizations
    orgs = db.query(RescueOrganization).filter(
        RescueOrganization.service_area.ilike(f"%{listing_data.location_area}%"),
        RescueOrganization.is_verified == True
    ).all()
    
    for org in orgs:
        notif = Notification(
            org_id=org.id,
            listing_id=new_listing.id,
            message=f"New surplus food available nearby: {listing_data.quantity} {listing_data.unit} {listing_data.food_name}. Available until {listing_data.available_until.strftime('%I:%M %p')}. Pickup required: {listing_data.requires_pickup}."
        )
        db.add(notif)
    
    # Notify Donor
    donor_notif = Notification(
        user_id=current_user.id,
        listing_id=new_listing.id,
        message=f"Your listing for {listing_data.food_name} has been published successfully."
    )
    db.add(donor_notif)
    
    db.commit()
    return {
        "id": new_listing.id,
        "food_name": new_listing.food_name,
        "status": new_listing.status
    }

@router.get("/listings")
def get_listings(db: Session = Depends(get_db)):
    return db.query(RescueListing).filter(RescueListing.status == ListingStatus.POSTED).all()

@router.get("/listings/me")
def get_my_listings(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(RescueListing).filter(RescueListing.donor_id == current_user.id).order_by(RescueListing.created_at.desc()).all()

@router.post("/listings/{listing_id}/accept")
def accept_listing(listing_id: str, org_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    listing = db.query(RescueListing).filter(RescueListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.status != ListingStatus.POSTED:
        raise HTTPException(status_code=400, detail="Listing is no longer available")
        
    if listing.available_until < datetime.now():
        raise HTTPException(status_code=400, detail="Listing has expired")
        
    org = db.query(RescueOrganization).filter(RescueOrganization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    listing.status = ListingStatus.CLAIMED
    listing.claimed_by_org_id = org.id
    
    # Notify Donor
    notif = Notification(
        user_id=listing.donor_id,
        listing_id=listing.id,
        message=f"Your listing for {listing.food_name} was claimed by {org.name}."
    )
    db.add(notif)
    db.commit()
    db.refresh(listing)
    return {"status": listing.status}

@router.put("/listings/{listing_id}/status")
def update_status(listing_id: str, status_data: StatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    listing = db.query(RescueListing).filter(RescueListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    # Only donor or system can update status here for simplicity
    if listing.donor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this listing")
        
    listing.status = status_data.status
    
    if status_data.status == ListingStatus.COMPLETED:
        # Notify org
        notif = Notification(
            org_id=listing.claimed_by_org_id,
            listing_id=listing.id,
            message=f"Pickup completed for {listing.food_name}."
        )
        db.add(notif)
        
    db.commit()
    db.refresh(listing)
    return {"status": listing.status}

@router.get("/notifications")
def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
