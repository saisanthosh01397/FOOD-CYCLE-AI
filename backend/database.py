import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

connect_args = {}
if settings.MYSQL_SSL_CA and os.path.exists(settings.MYSQL_SSL_CA):
    connect_args["ssl"] = {"ca": settings.MYSQL_SSL_CA}
else:
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
