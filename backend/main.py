import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from database import engine
from routers import auth, food_logs, predictions, recovery, dashboard, health, vision, users, system, export, history, rescue

# Configure Logging
logging.basicConfig(
    filename='logs/app.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FoodCycle AI API",
    description="Backend API for FoodCycle AI with automated waste prediction and resource recovery.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

from fastapi.middleware.cors import CORSMiddleware
from config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP Error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail, "error_code": exc.status_code},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"message": "Validation Error", "details": exc.errors()},
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database Error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Database Error. Please try again later."},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected Error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected internal server error occurred."},
    )

# Include Routers
app.include_router(auth.router)
app.include_router(food_logs.router)
app.include_router(predictions.router)
app.include_router(recovery.router)
app.include_router(dashboard.router)
app.include_router(health.router)
app.include_router(vision.router)
app.include_router(users.router)
app.include_router(system.router)
app.include_router(export.router)
app.include_router(history.router)
app.include_router(rescue.router)

from fastapi.staticfiles import StaticFiles
import os

os.makedirs("uploads/avatars", exist_ok=True)
os.makedirs("uploads/images", exist_ok=True)
os.makedirs("uploads/results", exist_ok=True)
app.mount("/static/avatars", StaticFiles(directory="uploads/avatars"), name="avatars")
app.mount("/static/images", StaticFiles(directory="uploads/images"), name="images")
app.mount("/static/results", StaticFiles(directory="uploads/results"), name="results")

@app.get("/")
def read_root():
    return {"message": "Welcome to FoodCycle AI API Phase 2"}

from database import SessionLocal
from models.user import User, UserRole
from services.auth_service import get_password_hash
from config import settings

@app.on_event("startup")
def on_startup():
    logger.info("FoodCycle AI FastAPI started.")
    # Seed default administrator if not exists
    db = SessionLocal()
    try:
        admin_email = settings.DEFAULT_ADMIN_EMAIL
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            logger.info(f"Creating default administrator: {admin_email}")
            admin_user = User(
                full_name="Administrator",
                email=admin_email,
                password_hash=get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
                role=UserRole.administrator
            )
            db.add(admin_user)
            db.commit()
    except Exception as e:
        logger.error(f"Error seeding default admin: {e}")
    finally:
        db.close()
