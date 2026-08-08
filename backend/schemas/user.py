from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from models.user import UserRole

class UserBase(BaseModel):
    full_name: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    role: UserRole = Field(default=UserRole.mess_manager, example="Mess Manager")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, example="SecureP@ssw0rd")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="john.doe@example.com")
    password: str = Field(..., example="SecureP@ssw0rd")

class UserResponse(UserBase):
    id: str
    is_active: bool
    last_login: datetime | None = None
    total_predictions: int
    total_image_analyses: int
    avatar: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserUpdateRole(BaseModel):
    role: UserRole

class UserUpdateStatus(BaseModel):
    is_active: bool

class UserUpdateProfile(BaseModel):
    full_name: str
    email: EmailStr

class UserUpdatePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
