from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import logging

# --- IMPORT SECURITY ---
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.limiter import limiter  # Mengambil instance dari core agar sinkron
from app.core.config import settings

# Import models
import app.models  # noqa: F401

from app.routers import auth, tickets, categories, services, faqs, notifications, admin, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield
    print("👋 Server stopped.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="IPB Help Center API - Secured version",
    lifespan=lifespan,
)

# --- RATE LIMIT CONFIG ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# --- SECURITY HEADERS ---
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# --- ERROR MASKING (AUDIT LOG) ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"AUDIT_LOG | Path: {request.url.path} | Error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Silakan hubungi administrator."},
    )

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# --- ROUTERS ---
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