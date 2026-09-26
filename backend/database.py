import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

connect_args = {}
# Check for Aiven CA certificate in the backend directory
ca_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ca.pem")
if os.path.exists(ca_path):
    connect_args["ssl"] = {"ca": ca_path}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from models.base import Base

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
