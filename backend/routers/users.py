from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserRole, UserActivityLog
from schemas.user import UserResponse, UserUpdateRole, UserUpdateStatus, UserCreate, UserUpdateProfile, UserUpdatePassword
from dependencies import get_current_admin_user, get_current_active_user
from services.auth_service import get_password_hash, verify_password
import os
import shutil
import uuid
from typing import List

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    return db.query(User).all()

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_by_admin(user_data: UserCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

class AdminUserUpdate(BaseModel):
    full_name: str
    email: str

class AdminPasswordUpdate(BaseModel):
    new_password: str

@router.put("/{user_id}", response_model=UserResponse)
def update_user_by_admin(user_id: str, payload: AdminUserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if payload.email != target_user.email:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
            
    target_user.full_name = payload.full_name
    target_user.email = payload.email
    db.commit()
    db.refresh(target_user)
    return target_user

@router.put("/{user_id}/password", status_code=status.HTTP_200_OK)
def reset_user_password(user_id: str, payload: AdminPasswordUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    target_user.password_hash = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password reset successfully"}

@router.put("/{user_id}/role", response_model=UserResponse)
def update_user_role(user_id: str, payload: UserUpdateRole, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Prevent demoting the last remaining administrator
    if target_user.role == UserRole.administrator and payload.role != UserRole.administrator:
        admin_count = db.query(User).filter(User.role == UserRole.administrator).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot demote the last remaining Administrator.")
            
    target_user.role = payload.role
    db.commit()
    db.refresh(target_user)
    return target_user

@router.put("/{user_id}/status", response_model=UserResponse)
def update_user_status(user_id: str, payload: UserUpdateStatus, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Prevent deactivating the last remaining administrator
    if target_user.role == UserRole.administrator and not payload.is_active:
        admin_count = db.query(User).filter(User.role == UserRole.administrator, User.is_active == True).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot deactivate the last remaining active Administrator.")
            
    target_user.is_active = payload.is_active
    db.commit()
    db.refresh(target_user)
    return target_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Prevent deleting the last remaining administrator
    if target_user.role == UserRole.administrator:
        admin_count = db.query(User).filter(User.role == UserRole.administrator).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last remaining Administrator.")
            
    db.delete(target_user)
    db.commit()
    return

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_me(payload: UserUpdateProfile, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Check if email is being changed and if it exists
    if payload.email != current_user.email:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    current_user.full_name = payload.full_name
    current_user.email = payload.email
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password", status_code=status.HTTP_200_OK)
def update_password(payload: UserUpdatePassword, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.password_hash = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

UPLOAD_DIR = "uploads/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/me/avatar", response_model=UserResponse)
def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    file_ext = file.filename.split(".")[-1]
    filename = f"{current_user.id}_{uuid.uuid4().hex[:8]}.{file_ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    current_user.avatar = f"/static/avatars/{filename}"
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me/avatar", response_model=UserResponse)
def remove_avatar(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    current_user.avatar = None
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_account(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role == UserRole.administrator:
        admin_count = db.query(User).filter(User.role == UserRole.administrator).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last remaining Administrator account.")
            
    db.delete(current_user)
    db.commit()
    return

from pydantic import BaseModel
class ActivityLogCreate(BaseModel):
    action_type: str
    description: str

@router.post("/log", status_code=status.HTTP_201_CREATED)
def log_activity(payload: ActivityLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    log = UserActivityLog(user_id=current_user.id, action_type=payload.action_type, description=payload.description)
    db.add(log)
    db.commit()
    return {"message": "Logged"}
