import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.services.auth_service import authenticate_user
from app.schemas.auth import LoginRequest
import logging

logging.basicConfig(level=logging.INFO)

async def test_login():
    engine = create_async_engine(settings.DATABASE_URL)
    session_maker = async_sessionmaker(engine, expire_on_commit=False)
    
    async with session_maker() as session:
        try:
            req = LoginRequest(email="admin@ipb.ac.id", password="admin123")
            result = await authenticate_user(req, session)
            print("LOGIN SUCCESS!")
            print(result.access_token)
        except Exception as e:
            print("LOGIN FAILED:", str(e))

if __name__ == "__main__":
    asyncio.run(test_login())
