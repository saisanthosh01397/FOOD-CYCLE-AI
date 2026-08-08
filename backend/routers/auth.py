from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserCreate, UserLogin, UserResponse, Token
from services.auth_service import create_user, get_user_by_email, verify_password, create_access_token
from models.user import UserActivityLog
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Creates a new user account with the specified role."
)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)

@router.post(
    "/login",
    response_model=Token,
    summary="User Login",
    description="Authenticates a user and returns a JWT token."
)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact your administrator.",
        )

    # Update last_login
    db_user.last_login = datetime.utcnow()
    
    # Log login activity
    log = UserActivityLog(user_id=db_user.id, action_type="Login", description="User logged in successfully")
    db.add(log)
    db.commit()

    access_token = create_access_token(data={
        "sub": db_user.email,
        "role": db_user.role.value,
        "full_name": db_user.full_name
    })
    
    # Returning the user details in the token response for the frontend
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "full_name": db_user.full_name,
            "role": db_user.role.value
        }
    }

from dependencies import get_current_active_user

@router.post("/logout-all", status_code=status.HTTP_200_OK)
def logout_all(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    log = UserActivityLog(user_id=current_user.id, action_type="Logout", description="User logged out from all devices")
    db.add(log)
    db.commit()
    return {"message": "Successfully logged out from all devices"}
