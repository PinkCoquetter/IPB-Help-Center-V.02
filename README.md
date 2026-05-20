# IPB Help Center V.02

Sistem Help Center terpadu untuk IPB University dengan arsitektur modern (FastAPI + React).

## Arsitektur

- **Backend**: FastAPI (Python 3.11+), SQLAlchemy Async, PostgreSQL, Alembic, JWT Auth
- **Frontend**: React 19, Vite, TailwindCSS v3, Axios, React Router v7
- **Database**: PostgreSQL 15

## Persyaratan

- Docker & Docker Compose
- Atau Node.js 20+ & Python 3.11+ (untuk pengembangan lokal)

## Cara Menjalankan (menggunakan Docker)

1. Jalankan `docker-compose up -d`
2. Backend API akan berjalan di `http://localhost:8000`
3. Frontend Web akan berjalan di `http://localhost:5173`
4. Jalankan migrasi database:
   ```bash
   docker exec -it ipb_helpdesk_backend bash
   alembic upgrade head
   python seed.py
   exit
   ```

## Development Lokal

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate # (atau venv\Scripts\activate di Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```
