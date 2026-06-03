import asyncio
import sys
import os

# Tambahkan path agar bisa mengimport app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.faq import FAQ, FAQVisibilityEnum

FAQS_DATA = [
    {
        "question": "Bagaimana cara mencetak Transkrip Nilai Sementara?",
        "answer": "Anda dapat mencetak Transkrip Nilai Sementara melalui portal SIMAK IPB pada menu Akademik > Riwayat Nilai. Pilih semester yang diinginkan lalu klik tombol Cetak PDF.",
        "category": "Akademik dan Kelulusan",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Kapan jadwal pendaftaran wisuda semester ini dibuka?",
        "answer": "Jadwal pendaftaran wisuda biasanya dibuka 1 bulan sebelum hari H wisuda. Silakan pantau pengumuman resmi di website kemahasiswaan atau akun Instagram resmi Ditmawa IPB.",
        "category": "Akademik dan Kelulusan",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Bagaimana prosedur pengajuan keringanan UKT?",
        "answer": "Pengajuan keringanan UKT dilakukan secara terpusat melalui portal Beasiswa IPB setiap awal semester genap. Anda harus menyiapkan dokumen pendukung seperti slip gaji orang tua dan surat keterangan tidak mampu dari kelurahan.",
        "category": "Keuangan dan Beasiswa",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Apakah saya bisa meminjam ruang kelas untuk kegiatan UKM?",
        "answer": "Bisa. Peminjaman ruangan untuk kegiatan kemahasiswaan dilakukan melalui aplikasi IPB Mobile atau website Sarpras IPB dengan persetujuan Dosen Pembina UKM dan Direktorat Kemahasiswaan (Ditmawa).",
        "category": "Fasilitas dan Infrastruktur (Sarpras)",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Bagaimana cara reset password akun IDB (IPB ID)?",
        "answer": "Jika Anda lupa password IPB ID, Anda dapat melakukan reset mandiri melalui halaman login dengan mengklik 'Lupa Password'. Tautan reset akan dikirim ke email alternatif yang terdaftar di sistem. Jika masih terkendala, silakan kunjungi helpdesk IT (DSITD).",
        "category": "Layanan IT dan Digital",
        "visibility": FAQVisibilityEnum.PUBLIC
    },
    {
        "question": "Apa saja syarat untuk mendapatkan pelayanan di Poliklinik IPB?",
        "answer": "Mahasiswa aktif IPB berhak mendapatkan pelayanan dasar di Poliklinik IPB secara gratis cukup dengan menunjukkan Kartu Tanda Mahasiswa (KTM) yang masih berlaku.",
        "category": "Kesehatan dan Kesejahteraan",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Berapa lama batas waktu peminjaman buku di Perpustakaan Pusat LSI?",
        "answer": "Mahasiswa S1 dapat meminjam maksimal 5 buku dengan durasi peminjaman selama 2 minggu (14 hari). Peminjaman dapat diperpanjang 1 kali secara online melalui web LSI.",
        "category": "Perpustakaan dan Jurnal",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Di mana saya bisa mendapatkan informasi lowongan magang resmi?",
        "answer": "Informasi lowongan magang dan kerja dapat diakses melalui portal CDA (Career Development & Assessment) IPB. Pastikan Anda sudah melengkapi profil CV di portal tersebut.",
        "category": "Karir, Magang, dan Tracer Study",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Apa yang harus dilakukan jika saya kehilangan KTM di area kampus?",
        "answer": "Segera laporkan kehilangan ke pos keamanan (UKK) terdekat untuk dibuatkan Surat Keterangan Tanda Lapor Kehilangan (SKTLK). Bawa surat tersebut ke loket akademik rektorat untuk proses pencetakan KTM baru.",
        "category": "Keamanan dan Ketertiban",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Bagaimana prosedur pendaftaran program Student Exchange (Pertukaran Pelajar)?",
        "answer": "Informasi dan pendaftaran program Student Exchange dikoordinasikan oleh Direktorat Program Internasional (ICO). Mahasiswa harus memenuhi syarat IPK minimal 3.00 dan skor TOEFL tertentu. Pendaftaran dibuka dua kali setahun.",
        "category": "Layanan Internasional",
        "visibility": FAQVisibilityEnum.STUDENT
    },
    {
        "question": "Jam berapa operasional bus kampus (Tayo) IPB?",
        "answer": "Bus kampus beroperasi setiap hari Senin - Jumat mulai pukul 06.30 WIB hingga 18.00 WIB. Rute utama melayani lingkar dalam kampus Dramaga.",
        "category": "Bantuan Umum dan Lainnya",
        "visibility": FAQVisibilityEnum.PUBLIC
    }
]

async def seed_faqs():
    async with AsyncSessionLocal() as session:
        # Cek apakah sudah ada data FAQ
        result = await session.execute(select(FAQ))
        existing_faqs = result.scalars().all()
        
        if len(existing_faqs) > 0:
            print("Database sudah berisi FAQ. Proses seeding dilewati.")
            return

        print("Memasukkan 11 data FAQ ke dalam database...")
        for faq_data in FAQS_DATA:
            new_faq = FAQ(**faq_data)
            session.add(new_faq)
            
        await session.commit()
        print("✅ Semua data FAQ berhasil dimasukkan!")

if __name__ == "__main__":
    asyncio.run(seed_faqs())
