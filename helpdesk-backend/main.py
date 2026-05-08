from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from config import settings
from database import init_db

# Import semua models agar SQLAlchemy tahu tabelnya
import models  # noqa: F401

from routers import auth, tickets, categories, academic_services, faqs, notifications


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: buat tabel jika belum ada."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    await init_db()
    print(f"✅  {settings.APP_NAME} v{settings.APP_VERSION} siap!")
    yield
    print("👋  Server berhenti.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## IPB Help Center API

Backend untuk sistem tiket layanan akademik IPB.

### Role Pengguna
| Role | Deskripsi |
|------|-----------|
| **mahasiswa** | Membuat & memantau tiket, baca FAQ & layanan |
| **staff** | Menanggapi & memperbarui status tiket |
| **admin** | Kelola semua data + lihat laporan |
| **stakeholder** | Hanya lihat laporan & statistik |

### Autentikasi
Gunakan **Bearer Token** dari endpoint `/api/auth/login`.
    """,
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static files (untuk download dokumen upload) ─────────────────────────────
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(categories.router)
app.include_router(academic_services.router)
app.include_router(faqs.router)
app.include_router(notifications.router)


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
