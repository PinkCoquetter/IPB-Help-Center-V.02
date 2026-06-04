# mypy: ignore-errors
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import logging

from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

# --- IMPORT SECURITY ---
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.limiter import limiter  # Mengambil instance dari core agar sinkron
from app.core.config import settings

# Import models
import app.models  # noqa: F401

from app.routers import auth, tickets, categories, services, faqs, notifications, admin, users

from sqlalchemy import select, func as sa_func
from app.core.database import AsyncSessionLocal
from app.models.faq import FAQ, FAQVisibilityEnum
from app.models.user import User, RoleEnum
from app.core.security import hash_password

FAQS_SEED_DATA = [
    {
        "question": "Bagaimana cara mencetak Transkrip Nilai Sementara?",
        "answer": "Anda dapat mencetak Transkrip Nilai Sementara melalui portal SIMAK IPB pada menu Akademik > Riwayat Nilai. Pilih semester yang diinginkan lalu klik tombol Cetak PDF.",
        "category": "Akademik",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Kapan jadwal pendaftaran wisuda semester ini dibuka?",
        "answer": "Jadwal pendaftaran wisuda biasanya dibuka 1 bulan sebelum hari H wisuda. Silakan pantau pengumuman resmi di website kemahasiswaan atau akun Instagram resmi Ditmawa IPB.",
        "category": "Akademik",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Bagaimana prosedur pengajuan keringanan UKT?",
        "answer": "Pengajuan keringanan UKT dilakukan secara terpusat melalui portal Beasiswa IPB setiap awal semester genap. Anda harus menyiapkan dokumen pendukung seperti slip gaji orang tua dan surat keterangan tidak mampu dari kelurahan.",
        "category": "SPP",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Apakah saya bisa meminjam ruang kelas untuk kegiatan UKM?",
        "answer": "Bisa. Peminjaman ruangan untuk kegiatan kemahasiswaan dilakukan melalui aplikasi IPB Mobile atau website Sarpras IPB dengan persetujuan Dosen Pembina UKM dan Direktorat Kemahasiswaan (Ditmawa).",
        "category": "Fasilitas",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Bagaimana cara reset password akun IDB (IPB ID)?",
        "answer": "Jika Anda lupa password IPB ID, Anda dapat melakukan reset mandiri melalui halaman login dengan mengklik 'Lupa Password'. Tautan reset akan dikirim ke email alternatif yang terdaftar di sistem. Jika masih terkendala, silakan kunjungi helpdesk IT (DSITD).",
        "category": "IT",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Apa saja syarat untuk mendapatkan pelayanan di Poliklinik IPB?",
        "answer": "Mahasiswa aktif IPB berhak mendapatkan pelayanan dasar di Poliklinik IPB secara gratis cukup dengan menunjukkan Kartu Tanda Mahasiswa (KTM) yang masih berlaku.",
        "category": "Fasilitas",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Berapa lama batas waktu peminjaman buku di Perpustakaan Pusat LSI?",
        "answer": "Mahasiswa S1 dapat meminjam maksimal 5 buku dengan durasi peminjaman selama 2 minggu (14 hari). Peminjaman dapat diperpanjang 1 kali secara online melalui web LSI.",
        "category": "Fasilitas",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Di mana saya bisa mendapatkan informasi lowongan magang resmi?",
        "answer": "Informasi lowongan magang dan kerja dapat diakses melalui portal CDA (Career Development & Assessment) IPB. Pastikan Anda sudah melengkapi profil CV di portal tersebut.",
        "category": "Akademik",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Bagaimana cara menghubungkan perangkat ke jaringan Wi-Fi kampus?",
        "answer": "Untuk terhubung ke Wi-Fi kampus, pilih jaringan 'IPB-Hotspot' atau 'eduroam', lalu masukkan username dan password akun IPB ID Anda. Jika terkendala, hubungi helpdesk DSITD.",
        "category": "IT",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Bagaimana alur dan syarat pengajuan keringanan atau cicilan pembayaran UKT?",
        "answer": "Panduan resmi mengenai prosedur permohonan keringanan/cicilan pembayaran UKT bagi mahasiswa yang memenuhi kriteria dapat diakses melalui portal keuangan mahasiswa IPB.",
        "category": "SPP",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Jam berapa operasional bus kampus (Tayo) IPB?",
        "answer": "Bus kampus beroperasi setiap hari Senin - Jumat mulai pukul 06.30 WIB hingga 18.00 WIB. Rute utama melayani lingkar dalam kampus Dramaga.",
        "category": "Fasilitas",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
]

async def _seed_faqs():
    """Auto-seed FAQ data if the table is empty."""
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(sa_func.count()).select_from(FAQ))
            count = result.scalar()
            if count and count > 0:
                logging.info(f"FAQ table already has {count} rows, skipping seed.")
                return
            logging.info("Seeding FAQ data...")
            for faq_data in FAQS_SEED_DATA:
                session.add(FAQ(**faq_data))
            await session.commit()
            logging.info(f"✅ Successfully seeded {len(FAQS_SEED_DATA)} FAQs.")
    except Exception as e:
        logging.error(f"FAQ seeding failed: {e}")

async def _seed_users():
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(sa_func.count()).select_from(User))
            count = result.scalar()
            if count and count > 0:
                logging.info(f"User table already has {count} rows, skipping seed.")
                return
            logging.info("Seeding User data...")
            
            admin = User(
                full_name="Admin IPB",
                email="admin@apps.ipb.ac.id",
                hashed_password=hash_password("admin123"),
                role=RoleEnum.ADMIN
            )
            staff = User(
                full_name="Staff Akademik",
                email="staff.akademik@apps.ipb.ac.id",
                hashed_password=hash_password("staff123"),
                role=RoleEnum.STAFF
            )
            student = User(
                full_name="Mahasiswa IPB",
                email="student@apps.ipb.ac.id",
                hashed_password=hash_password("12345678"),
                role=RoleEnum.STUDENT,
                nim="G64100000"
            )
            session.add_all([admin, staff, student])
            await session.commit()
            logging.info("✅ Successfully seeded default Users.")
    except Exception as e:
        logging.error(f"User seeding failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    FastAPICache.init(InMemoryBackend(), prefix="helpcenter-cache")
    await _seed_users()
    await _seed_faqs()
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