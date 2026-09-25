import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "foodcycle_ai")
    DEFAULT_ADMIN_EMAIL: str = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@foodcycleai.com")
    DEFAULT_ADMIN_PASSWORD: str = os.getenv("DEFAULT_ADMIN_PASSWORD", "FoodCycle@2026")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-replace-in-production")
    ALLOWED_ORIGINS: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")

    @property
    def DATABASE_URL(self):
        env_db_url = os.getenv("DATABASE_URL")
        if env_db_url:
            # If using standard mysql:// from some providers, replace with mysql+pymysql://
            if env_db_url.startswith("mysql://"):
                env_db_url = env_db_url.replace("mysql://", "mysql+pymysql://")
            return env_db_url
            
        from urllib.parse import quote_plus
        encoded_password = quote_plus(self.MYSQL_PASSWORD) if self.MYSQL_PASSWORD else ""
        return f"mysql+pymysql://{self.MYSQL_USER}:{encoded_password}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

settings = Settings()
