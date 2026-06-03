from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "IPB Help Center API"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = True

    # Defaults that can be overridden by .env
    DATABASE_URL: str = "postgresql+asyncpg://postgres:love@localhost:5432/ipb-helpdesk-postgres"

    @property
    def get_database_url(self) -> str:
        # Railway injects `postgresql://`, but SQLAlchemy async requires `postgresql+asyncpg://`
        if self.DATABASE_URL.startswith("postgresql://"):
            return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
        return self.DATABASE_URL
    
    SECRET_KEY: str = "yaudahlahyeah"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://ipb-help-center-v-02.vercel.app"
    ]

    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
