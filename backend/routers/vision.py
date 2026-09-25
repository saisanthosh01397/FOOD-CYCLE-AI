from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from database import get_db
from models.image_metadata import ImageMetadata
from models.user import UserActivityLog, User
from dependencies import get_current_active_user
from services.vision_service import vision_service
from services.recovery_service import recovery_service
import os
import shutil
import uuid
import json

router = APIRouter(prefix="/vision", tags=["Computer Vision"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '../uploads/images')
RESULTS_DIR = os.path.join(os.path.dirname(__file__), '../uploads/results')

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10 MB

def validate_image(file: UploadFile):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")
    
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    validate_image(file)
    
    ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_image = ImageMetadata(filename=unique_filename)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return {"message": "Image uploaded successfully", "image_id": db_image.id, "filename": unique_filename}

@router.post("/detect-food")
async def detect_food(image_id: str, db: Session = Depends(get_db)):
    db_image = db.query(ImageMetadata).filter(ImageMetadata.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
        
    file_path = os.path.join(UPLOAD_DIR, db_image.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image file missing on disk")
        
    result_filename = f"result_{db_image.filename}"
    result_path = os.path.join(RESULTS_DIR, result_filename)
    
    detections = vision_service.detect_food(file_path, result_path)
    
    # Update DB
    db_image.result_filename = result_filename
    db_image.detected_categories = json.dumps(detections)
    
    # Store top confidence
    if detections and "confidence" in detections[0]:
        db_image.confidence = max([d.get("confidence", 0.0) for d in detections])
    db_image.status = "Processed"
    
    db.commit()
    
    return {"image_id": db_image.id, "detections": detections, "annotated_image": result_filename}

@router.post("/analyze-image")
async def analyze_image(
    quantity_kg: float = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 1. Validate image
    validate_image(file)
    
    # Save temp
    ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Detect food
    result_filename = f"result_{unique_filename}"
    result_path = os.path.join(RESULTS_DIR, result_filename)
    detections = vision_service.detect_food(file_path, result_path)
    
    # Store in DB
    db_image = ImageMetadata(
        filename=unique_filename,
        result_filename=result_filename,
        detected_categories=json.dumps(detections),
        status="Analyzed"
    )
    
    top_cat = None
    top_conf = 0.0
    if detections:
        top_conf = max([d.get("confidence", 0.0) for d in detections])
        db_image.confidence = top_conf
        
        # Get category of highest confidence object
        best_obj = max(detections, key=lambda x: x.get("confidence", 0.0))
        top_cat = best_obj.get("food_category")
        
    db.add(db_image)
    
    # Update user stats
    current_user.total_image_analyses += 1
    
    # Log activity
    log = UserActivityLog(user_id=current_user.id, action_type="Image Upload", description=f"Analyzed {unique_filename} and detected {top_cat or 'Nothing'}")
    db.add(log)
    
    db.commit()
    db.refresh(db_image)
    
    if not top_cat:
        return {
            "image_id": db_image.id,
            "detected_category": None,
            "confidence": 0.0,
            "all_detections": [],
            "error": "Food category not recognized by the current vision model.",
            "annotated_image": result_filename
        }
    
    # 4. Call Recovery AI
    log_data = {
        "food_category": top_cat,
        "quantity_kg": quantity_kg,
    }
    
    recovery_result = recovery_service.recommend(log_data)
    
    # Persist parent log
    from datetime import datetime
    from models.food_log import FoodWasteLog
    from models.recovery import RecoveryRecommendation
    
    fwl = FoodWasteLog(
        date=datetime.now().date(),
        meal_type="Vision Scan",
        food_category=top_cat,
        quantity_kg=quantity_kg,
        people_served=0
    )
    db.add(fwl)
    db.commit()
    db.refresh(fwl)
    
    # Associate Image
    db_image.log_id = fwl.id
    db.add(db_image)
    
    # Persist child recovery
    npk = recovery_result.get("npk_estimation", {})
    rr = RecoveryRecommendation(
        log_id=fwl.id,
        recommended_method=recovery_result.get("recommended_method", "Unknown"),
        expected_output=0.0,
        nitrogen=npk.get("nitrogen", 0.0),
        phosphorus=npk.get("phosphorus", 0.0),
        potassium=npk.get("potassium", 0.0)
    )
    db.add(rr)
    db.commit()
    
    # Return aggregated response
    return {
        "image_id": db_image.id,
        "detected_category": top_cat,
        "confidence": top_conf,
        "all_detections": detections,
        "recovery_recommendation": recovery_result.get("recommended_method", "Composting"),
        "npk_values": recovery_result.get("npk_estimation", {"nitrogen": 2.0, "phosphorus": 1.0, "potassium": 1.5}),
        "explainable_ai_reason": recovery_result.get("xai", {}).get("human_readable_explanation", "Default recommendation due to processing limitations."),
        "annotated_image": result_filename
    }
