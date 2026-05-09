# 🎓 IPB Help Center — Backend API

Backend untuk sistem tiket layanan akademik IPB menggunakan **FastAPI** + **PostgreSQL**.

---

## 📁 Struktur Proyek

```
helpdesk-backend/
├── main.py                  # Entry point FastAPI
├── config.py                # Konfigurasi (dari .env)
├── database.py              # Koneksi & session PostgreSQL
├── init.sql                 # Schema SQL + seed data
├── requirements.txt         # Dependensi Python
├── .env.example             # Template environment variables
│
├── models/                  # ORM Models (SQLAlchemy)
│   ├── user.py              # User + RoleEnum
│   ├── ticket.py            # Ticket, TicketResponse, TicketHistory
│   ├── document.py          # Dokumen pendukung
│   ├── category.py          # Kategori tiket
│   ├── academic_service.py  # Layanan akademik & panduan
│   ├── faq.py               # FAQ
│   └── notification.py      # Notifikasi
│
├── schemas/                 # Pydantic Schemas (validasi request/response)
│   ├── user.py
│   ├── ticket.py
│   ├── category.py
│   ├── academic_service.py
│   ├── faq.py
│   └── notification.py
│
├── routers/                 # Endpoint API
│   ├── auth.py              # Register, Login, /me
│   ├── tickets.py           # CRUD tiket + upload + laporan
│   ├── categories.py        # Kelola kategori
│   ├── academic_services.py # Kelola layanan akademik
│   ├── faqs.py              # Kelola FAQ
│   └── notifications.py     # Notifikasi user
│
└── utils/
    ├── auth.py              # JWT, bcrypt, role guard
    └── ticket_number.py     # Generator nomor tiket unik
```

---

## ⚙️ Cara Setup

### 1. Buat Virtual Environment
```bash
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

### 2. Install Dependensi
```bash
pip install -r requirements.txt
```

### 3. Setup PostgreSQL
```bash
# Buat database
psql -U postgres -c "CREATE DATABASE ipb_helpdesk;"

# Jalankan schema + seed data
psql -U postgres -d ipb_helpdesk -f init.sql
```

### 4. Konfigurasi Environment
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi database Anda
```

### 5. Jalankan Server
```bash
uvicorn main:app --reload --port 8000
```

### 6. Buka Dokumentasi API
- **Swagger UI** → http://localhost:8000/docs
- **ReDoc**     → http://localhost:8000/redoc

---

## 🔑 Role & Akses

| Role | Akses |
|------|-------|
| `mahasiswa` | Buat tiket, upload dokumen, lihat tiket sendiri, baca FAQ |
| `staff` | Balas & update status tiket, tutup tiket |
| `admin` | Semua akses + kelola kategori, FAQ, layanan, laporan |
| `stakeholder` | Hanya lihat laporan & statistik |

---

## 📌 Endpoint Utama

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Daftar akun |
| POST | `/api/auth/login` | Login → JWT token |
| GET  | `/api/auth/me` | Profil user login |

### Tiket
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/tickets/` | Buat tiket baru |
| GET  | `/api/tickets/` | Daftar tiket |
| GET  | `/api/tickets/{id}` | Detail tiket |
| POST | `/api/tickets/{id}/reply` | Balas tiket |
| PATCH | `/api/tickets/{id}/status` | Update status tiket |
| POST | `/api/tickets/{id}/close` | Tutup tiket |
| POST | `/api/tickets/{id}/assign` | Assign ke staff |
| POST | `/api/tickets/{id}/documents` | Upload dokumen |
| GET  | `/api/tickets/report/summary` | Laporan tiket |

### Kategori, FAQ, Layanan, Notifikasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/POST/PUT/DELETE | `/api/categories/` | Kelola kategori |
| GET/POST/PUT/DELETE | `/api/faqs/` | Kelola FAQ |
| GET/POST/PUT/DELETE | `/api/services/` | Kelola layanan akademik |
| GET | `/api/notifications/` | Daftar notifikasi |
| PATCH | `/api/notifications/read-all` | Tandai semua dibaca |

---

## 🔗 Integrasi dengan Frontend React

Tambahkan ke `vite.config.js`:
```js
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

Contoh fetch di React:
```js
const res = await fetch('/api/tickets/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ subject, description, category_id })
});
```

---

## 👤 Akun Admin Default
- **Email**: `admin@ipb.ac.id`
- **Password**: `Admin@IPB123`
- ⚠️ Ganti password setelah pertama login!
