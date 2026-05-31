from fastapi import FastAPI
from fastapi import Request
from starlette.responses import JSONResponse

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.core.config import settings
from app.core.rate_limit import limiter
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.logging import LoggingMiddleware

from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
from slowapi import RateLimitExceeded
from slowapi.errors import RateLimitExceeded

# Import models
import app.models  # noqa: F401

from app.routers import auth, tickets, categories, services, faqs, notifications, admin, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    redis = aioredis.from_url(redis_url, encoding="utf8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="helpdesk-cache")
    yield
    print(" Server stopped.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="IPB Help Center API - Refactored (Production Reality)",
    lifespan=lifespan,
)

# Set up Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add custom middlewares (order matters: innermost first in some setups, but Starlette executes top-to-bottom for request, bottom-to-top for response)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(LoggingMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(categories.router)
app.include_router(services.router)
app.include_router(faqs.router)
app.include_router(notifications.router)
app.include_router(admin.router)
app.include_router(users.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
    }

@app.get("/health", tags=["Root"])
async def health():
    return {"status": "ok"}
