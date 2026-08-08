from sqlalchemy import Column, String, Enum, Boolean, Integer, ForeignKey, DateTime
import enum
from datetime import datetime
from .base import BaseModel

class UserRole(str, enum.Enum):
    administrator = "Administrator"
    mess_manager = "Mess Manager"

class User(BaseModel):
    __tablename__ = "users"

    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.mess_manager, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime, nullable=True)
    total_predictions = Column(Integer, default=0, nullable=False)
    total_image_analyses = Column(Integer, default=0, nullable=False)
    avatar = Column(String(255), nullable=True)

class UserActivityLog(BaseModel):
    __tablename__ = "user_activity_logs"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action_type = Column(String(50), nullable=False) # e.g. 'Login', 'Image Upload', 'Prediction'
    description = Column(String(255), nullable=True)
