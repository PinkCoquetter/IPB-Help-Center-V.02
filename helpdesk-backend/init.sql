-- ============================================================
-- IPB Help Center — PostgreSQL Initial Schema
-- Jalankan sekali saat setup pertama kali
-- ============================================================

-- Buat database (jalankan sebagai superuser di luar database ini)
-- CREATE DATABASE ipb_helpdesk;
-- \c ipb_helpdesk

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- untuk full-text search

-- ─── Enum Types ───────────────────────────────────────────────────────────────
DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM ('mahasiswa', 'staff', 'admin', 'stakeholder');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status_enum AS ENUM ('Open', 'In Progress', 'Selesai', 'Ditolak', 'Ditutup');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE priority_enum AS ENUM ('Low', 'Medium', 'High', 'Urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE notif_type_enum AS ENUM (
        'tiket_baru', 'status_diproses', 'status_selesai',
        'status_ditolak', 'status_ditutup', 'balasan_baru'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── Tabel Users ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    nim             VARCHAR(20) UNIQUE,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role            role_enum NOT NULL DEFAULT 'mahasiswa',
    program_studi   VARCHAR(100),
    jabatan         VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

-- ─── Tabel Kategori ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ
);

-- ─── Tabel Layanan Akademik ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academic_services (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    description TEXT,
    guide       TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ
);

-- ─── Tabel FAQ ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
    id          SERIAL PRIMARY KEY,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ
);

-- ─── Tabel Tiket ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
    id                  SERIAL PRIMARY KEY,
    ticket_number       VARCHAR(30) UNIQUE NOT NULL,
    queue_number        INTEGER,
    subject             VARCHAR(255) NOT NULL,
    description         TEXT NOT NULL,
    status              ticket_status_enum NOT NULL DEFAULT 'Open',
    priority            priority_enum NOT NULL DEFAULT 'Medium',
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    assigned_staff_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    resolved_at         TIMESTAMPTZ
);

-- ─── Tabel Balasan Tiket ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_responses (
    id          SERIAL PRIMARY KEY,
    message     TEXT NOT NULL,
    ticket_id   INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabel Histori Tiket ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_history (
    id          SERIAL PRIMARY KEY,
    ticket_id   INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    old_status  ticket_status_enum,
    new_status  ticket_status_enum NOT NULL,
    changed_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
    note        TEXT,
    changed_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabel Dokumen Pendukung ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
    id            SERIAL PRIMARY KEY,
    file_name     VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type     VARCHAR(100) NOT NULL,
    file_size     BIGINT NOT NULL,
    file_path     VARCHAR(500) NOT NULL,
    ticket_id     INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabel Notifikasi ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id        SERIAL PRIMARY KEY,
    message   TEXT NOT NULL,
    type      notif_type_enum NOT NULL,
    is_read   BOOLEAN DEFAULT FALSE,
    user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    sent_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tickets_user_id     ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status      ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at  ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_user_id       ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_is_read       ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_responses_ticket_id ON ticket_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_history_ticket_id   ON ticket_history(ticket_id);

-- ─── Seed Data: Kategori Awal ─────────────────────────────────────────────────
INSERT INTO categories (name, description) VALUES
    ('Akademik',   'Permasalahan terkait akademik, nilai, KRS, dan sejenisnya'),
    ('Fasilitas',  'Permasalahan terkait fasilitas kampus'),
    ('Keuangan',   'Permasalahan terkait pembayaran dan beasiswa'),
    ('Lainnya',    'Pertanyaan dan permasalahan lain')
ON CONFLICT (name) DO NOTHING;

-- ─── Seed Data: Admin Default ─────────────────────────────────────────────────
-- Password default: Admin@IPB123 (ganti setelah pertama login!)
-- Hash bcrypt dari 'Admin@IPB123':
INSERT INTO users (full_name, email, hashed_password, role, jabatan) VALUES
    ('Administrator', 'admin@ipb.ac.id',
     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2.',
     'admin', 'System Administrator')
ON CONFLICT (email) DO NOTHING;

-- ─── Seed Data: FAQ Awal ──────────────────────────────────────────────────────
INSERT INTO faqs (question, answer, category_id)
SELECT
    'Bagaimana cara mengajukan surat keterangan aktif?',
    'Login ke Help Center → Buka Tiket → Pilih kategori Akademik → Isi form → Submit. Surat akan diproses dalam 3 hari kerja.',
    id FROM categories WHERE name = 'Akademik'
ON CONFLICT DO NOTHING;

INSERT INTO faqs (question, answer, category_id)
SELECT
    'Berapa lama tiket biasanya diproses?',
    'Tiket normal diproses dalam 1-3 hari kerja. Tiket dengan prioritas tinggi akan diproses lebih cepat.',
    id FROM categories WHERE name = 'Lainnya'
ON CONFLICT DO NOTHING;

COMMIT;
