import asyncio
from app.core.database import AsyncSessionLocal
from app.models.user import User, RoleEnum
from app.models.ticket_category import TicketCategory
from app.models.ticket import Ticket, TicketStatus
from app.models.faq import FAQ
from app.core.security import hash_password

async def seed():
    async with AsyncSessionLocal() as session:
        print("Mulai mengisi database dengan data dummy IPB Help Center...")

        # 1. Buat Users (Admin, Staff, Mahasiswa)
        print("Membuat Users...")
        admin = User(
            full_name="Tsabitha (Admin)",
            email="admin@apps.ipb.ac.id",
            hashed_password=hash_password("admin123"),
            role=RoleEnum.ADMIN
        )
        
        staff_akademik = User(
            full_name="Budi Staff Akademik",
            email="staff.akademik@apps.ipb.ac.id",
            hashed_password=hash_password("staff123"),
            role=RoleEnum.STAFF
        )
        
        student_1 = User(
            full_name="Mahasiswa IPB Angkatan 60",
            email="mahasiswa60@apps.ipb.ac.id",
            hashed_password=hash_password("student123"),
            role=RoleEnum.STUDENT,
            nim="G64190001"
        )

        student_2 = User(
            full_name="Mahasiswa IPB Angkatan 61",
            email="mahasiswa61@apps.ipb.ac.id",
            hashed_password=hash_password("student123"),
            role=RoleEnum.STUDENT,
            nim="G64190002"
        )
        
        session.add_all([admin, staff_akademik, student_1, student_2])
        await session.commit() # Commit dulu agar dapat ID

        # 2. Buat Kategori Tiket
        print("Membuat Kategori...")
        cat_akademik = TicketCategory(name="Akademik", description="Layanan Administrasi Akademik (KRS, Cuti, Nilai)")
        cat_keuangan = TicketCategory(name="Keuangan", description="Layanan UKT dan Tagihan Keuangan")
        cat_it = TicketCategory(name="IT Support", description="Layanan Akun IPB, WiFi, dan Jaringan")
        cat_fasilitas = TicketCategory(name="Fasilitas & Sarpras", description="Layanan Gedung, Kelas, dan Asrama PPKU")
        
        session.add_all([cat_akademik, cat_keuangan, cat_it, cat_fasilitas])
        await session.commit()

        # 3. Buat Data Tiket Percobaan
        print("Membuat Tiket Dummy...")
        ticket_1 = Ticket(
            title="Pembayaran UKT Gagal via BNI",
            description="Saya sudah transfer UKT via BNI Mobile tapi di SIMAK masih berstatus belum bayar. Mohon bantuannya.",
            status=TicketStatus.OPEN,
            category_id=cat_keuangan.id,
            student_id=student_1.id
        )

        ticket_2 = Ticket(
            title="KTM Hilang di Kantin Stekpi",
            description="KTM saya hilang kemarin, bagaimana prosedur pembuatan KTM baru? Apakah ada biaya ganti?",
            status=TicketStatus.IN_PROGRESS,
            category_id=cat_akademik.id,
            student_id=student_2.id,
            assigned_to_id=staff_akademik.id
        )

        ticket_3 = Ticket(
            title="Lupa Password IDB IPB",
            description="Saya lupa password email @apps.ipb.ac.id saya, bagaimana cara resetnya?",
            status=TicketStatus.RESOLVED,
            category_id=cat_it.id,
            student_id=student_1.id,
            assigned_to_id=admin.id
        )

        session.add_all([ticket_1, ticket_2, ticket_3])
        
        # 4. Buat FAQ (Tanya Jawab Umum)
        print("Membuat FAQs...")
        faq_1 = FAQ(
            question="Bagaimana cara mereset password akun IPB?",
            answer="Anda dapat mereset password melalui laman reset.ipb.ac.id menggunakan nomor HP yang terdaftar di SIMAK.",
            category_id=cat_it.id,
            is_active=True
        )
        faq_2 = FAQ(
            question="Syarat pengajuan cuti akademik?",
            answer="Pengajuan cuti dapat dilakukan melalui SIMAK dengan persetujuan Dosen Pembimbing Akademik dan melampirkan surat permohonan.",
            category_id=cat_akademik.id,
            is_active=True
        )

        session.add_all([faq_1, faq_2])
        await session.commit()

        print("🎉 Database berhasil diisi dengan data IPB Help Center (Users, Categories, Tickets, FAQs)!")

if __name__ == "__main__":
    asyncio.run(seed())
