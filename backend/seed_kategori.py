import asyncio
from sqlalchemy import delete
from app.core.database import AsyncSessionLocal
from app.models.ticket_category import TicketCategory
from app.models.service import Service

# Data Mentah (Terstruktur)
DATA_KATEGORI = {
    "1. Akademik dan Kelulusan": {
        "Kelulusan dan Alumni": [
            "Ijazah dan Transkrip Digital", "Legalisir Dokumen Akademik", "Pendaftaran Wisuda",
            "Pengambilan Ijazah / Transkrip", "Pengambilan Surat Keterangan Lulus (SKL)",
            "Sertifikat Akreditasi Ban-PT/Lam", "Surat Bebas Pustaka", "Surat Keterangan Pengganti Ijazah",
            "Tracer Study IPB", "Verifikasi Keaslian Ijazah"
        ],
        "Layanan Administrasi Akademik": [
            "Aktif Kembali Setelah Non-Aktif", "Cetak KTM Pengganti / Hilang", "Evaluasi Masa Studi Mahasiswa",
            "Mutasi / Pindah Program Studi", "Pelepasan Mahasiswa Asing", "Pemutakhiran Data Mahasiswa",
            "Pendaftaran Mahasiswa Baru (PMB)", "Pengajuan Beasiswa Mahasiswa", "Pengajuan Cuti Akademik",
            "Pengajuan Pengunduran Diri", "Pengesahan Rencana Studi (KRS)", "Perpanjangan Masa Studi",
            "Sertifikat Kompetensi Mahasiswa", "Surat Keterangan Aktif Kuliah", "Surat Keterangan Kelakuan Baik",
            "Surat Pengantar Magang / Penelitian", "Verifikasi Berkas Mahasiswa Baru"
        ],
        "Proses Belajar Mengajar": [
            "Alokasi Ruang Kuliah / Ujian", "Evaluasi Dosen oleh Mahasiswa (EDOM)", "Informasi Jadwal Kuliah & Ujian",
            "Kalender Akademik IPB", "Kurikulum dan Silabus KBM", "Legalisir Kartu Hasil Studi (KHS)",
            "Nilai Mata Kuliah & Remedial", "Pendaftaran Praktikum / Respons", "Penggantian Dosen Pengampu",
            "Penilaian Tugas Akhir / Skripsi", "Penyelenggaraan Kuliah Daring", "Persidangan Kasus Akademik"
        ]
    },
    "2. Keuangan dan Tarif": {
        "Beasiswa dan Bantuan Biaya": [
            "Bantuan Biaya Pendidikan (KIP-K)", "Beasiswa Prestasi / Kemitraan", "Keringanan / Penundaan UKT",
            "Pengembalian Kelebihan Bayar"
        ],
        "Pembayaran UKT dan Tarif": [
            "Informasi Tagihan Pembayaran", "Metode Pembayaran (Virtual Account)", "Penetapan Uang Kuliah Tunggal (UKT)",
            "Tarif Layanan Non-Akademik", "UKT Multistrata", "Update-No Rekening-KBM"
        ]
    },
    "3. Penelitian dan Pengabdian": {
        "Inovasi dan Publikasi": [
            "Fasilitasi Hak Kekayaan Intelektual (HKI)", "Insentif Publikasi Ilmiah", "Pendaftaran Paten / Desain Industri",
            "Pengelolaan Jurnal Ilmiah IPB"
        ],
        "Manajemen Penelitian": [
            "Dana Hibah Penelitian Internal", "Izin Penelitian / Pengambilan Data", "Monitoring dan Evaluasi (Monev)",
            "Pendaftaran Proposal Penelitian", "Riset dan Inovasi"
        ],
        "Pengabdian Masyarakat": [
            "KKNT IPB", "Pemberdayaan Masyarakat Desa", "Penerapan Inovasi Lingkungan"
        ]
    },
    "4. Kemahasiswaan": {
        "Kesejahteraan Mahasiswa": [
            "Asuransi Kesehatan Mahasiswa", "Asrama Mahasiswa IPB", "Bantuan Logistik / Darurat",
            "Konseling Psikologi Mahasiswa", "Layanan Unit Kesehatan", "Verifikasi Berkas Pendaftaran BP"
        ],
        "Lomba Mahasiswa dan SKPI": [
            "Fasilitasi pendanaan lomba", "Informasi Lomba Kemahasiswaan", "SIMAWA/SKPI", "MBKM Program Studi"
        ],
        "Ormawa dan Softskill": [
            "Informasi kegiatan Ormawa", "Informasi kegiatan Softskill"
        ],
        "Layanan Pengembangan Karir": [
            "Info Kewirausahaan DUSP", "Info Magang Mahasiswa/Lulusan", "Lowongan Kerja/ICR/Job Fair", "Training Persiapan/Konsul Karir"
        ]
    },
    "5. Penerimaan Mahasiswa Baru": {
        "Pendaftaran": [
            "Registrasi Online", "Verifikasi Berkas"
        ]
    },
    "6. Kepegawaian": {
        "Pengembangan SDM dan PKK": [
            "BKD SISTER", "Hibah Penelitian Tendik", "Kenaikan Gaji Berkala", "Kenaikan Jabatan Dosen",
            "Kenaikan Jabfungsional Tendik", "Kenaikan Pangkat Dosen", "Kenaikan Pangkat Tendik",
            "Pelantikan Pejabat Struktural", "Pemeriksaan Kesehatan PNS", "Pengangkatan PNS", "Penilaian angka_kredit & KI",
            "Sertifikasi dosen PT_pengusul", "Sertifikasi dosen PT_penilai", "Sumpah jabatan PNS&fungsional", "Ujian penyetaraan ijazah"
        ],
        "Rekrutmen Evaluasi Kinerja": [
            "Bantuan biaya pendidikan", "Beban Kinerja Dosen", "Insentif Tepat Waktu", "Izin Dinas LN", "Koordinator peningkatan kapasita",
            "Magang/Prakerin di IPB", "Mutasi Pegawai IPB", "Pelatihan Dasar CPNS", "Pembebasan tugas belajar", "Pembebasan tugas diperbantukan",
            "Penanganan disiplin pegawai", "Penerimaan Pegawai", "Pengajuan pensiun PNS", "Pengaktifan dari Tugasbelajar", "Pengaktifan dari tugasdiperbantu",
            "Pengurusan SK diperbantuan", "Pengurusan Tugas Belajar", "Penugasan mengikuti pelatihan", "Perhitungan Ad-hoc", "Perpanjangan Tugas Belajar",
            "Promosi untuk jabatan", "Rotasi Pegawai IPB", "Sistem Imbal Jasa", "SISTER-DIKTI"
        ],
        "Remunerasi dan Kesejahteraan": [
            "Gaji ke13-14 NonPNS", "Gaji ke13-14 PNS", "Gaji terusan,rapel,fungsional", "Layanan asuransi pegawai", "Layanan kartu pegawai",
            "Layanan Suket Penghasilan", "Pelepasan calon jemaah_haji", "Pemilihan TendDos Berprestasi", "Pengajuan Gaji Non-PNS", "Pengajuan Gaji PNS",
            "Pengajuan Lembur", "Pengajuan P2", "pengajuan P3", "Pengajuan Satyalancana Karyasaty", "Pengajuan SKPP", "Pengajuan uangmakan NonPNS",
            "Pengajuan uangmakan PNS", "Permintaan KGB PNS", "Seremonial pensiunan PNS"
        ]
    },
    "7. Kehumasan dan Promosi": {
        "Informasi dan Pengaduan": [
            "Pengadaan Barang dan Jasa", "Permohonan Informasi Publik", "Saran dan Pengaduan", "Informasi agenda unit_kerja",
            "Informasi kepakaran dosen", "Mengundang media massa", "Permohonan informasi lainnya", "Permohonan petugas MC", "Permohonan publikasi media"
        ],
        "Layanan Promosi IPB": [
            "Kunjungan ke IPB", "Layanan lainnya", "Narasumber untuk promosi_IPB", "Permohonan Merchandise IPB", "Undangan Education Expo"
        ]
    },
    "8. Pengaduan Pelanggaran": {
        "Pengaduan": [
            "Pengaduan Dugaan Korupsi", "Pengaduan Kekerasan Seksual", "Pengaduan Melanggar Kode Etik", "Pengaduan Melanggar Tata Tertib", "Pengaduan Pinjol/Penipuan"
        ]
    },
    "9. Perencanaan dan Info Pendidikan": {
        "Info Pendidikan": [
            "Biodata Mahasiswa SIMAK", "Jadwal Kuliah", "KRS Mahasiswa", "Pindah Minor", "Platform Exam dan Class"
        ]
    },
    "10. Sarana Dan Prasarana": {
        "Fasilitas dan Pelayanan": [
            "Bangunan/Gedung", "Inventarisasi dan Penghapusan As", "Jalan", "Kebersihan Lingkungan, Penebanga", "Laporan Keamanan",
            "Lift / AC / Telepon", "Limbah", "Listrik", "Masalah Air", "Masalah Kerusakan Kursi", "Masalah Kerusakan LCD",
            "Pelayanan Kebutuhan Barang dan J", "Pelayanan Mobil Jenazah", "Peminjaman dan Pemakaian Lapanga", "Peminjaman Kendaraan",
            "Peminjaman Ruangan (GWW, Audit A", "Tenda dan Kursi di Rumah Duka da", "Transportasi Kampus"
        ]
    },
    "11. Teknologi Informasi": {
        "Akses dan Jaringan": [
            "Akses Sistem Informasi", "Akun ID IPB, Email", "Aplikasi Microsoft dan Windows", "Aplikasi Microsoft, Zoom, Webex", "Credential Account",
            "Data, PDDIKTI, SISTER", "Email dan ID IPB", "Indikator Kinerja Utama (IKU)", "Jaringan dan Koneksi", "Kuliah / Ujian daring (online)",
            "Learning Management System (LMS)", "Penghapusan Storage Akun Google"
        ],
        "Sistem Informasi": [
            "Pengembangan/Perubahan Aplikasi", "Website, Jurnal, dan Repository"
        ]
    }
}

async def seed_categories():
    async with AsyncSessionLocal() as session:
        print("Mereset dan Mengisi Ulang Kategori Tiket dan Layanan...")
        
        # Hapus data kategori dan layanan yang lama (Opsional, agar tidak ada duplikat jika dijalankan ulang)
        await session.execute(delete(Service))
        await session.execute(delete(TicketCategory))
        await session.commit()

        # Proses Insert
        for cat_name, sub_groups in DATA_KATEGORI.items():
            # Buat Kategori Utama (Misal: 1. Akademik dan Kelulusan)
            category = TicketCategory(name=cat_name, description=f"Kategori Utama: {cat_name}")
            session.add(category)
            await session.commit() # Commit untuk dapat ID kategori
            await session.refresh(category)

            # Buat Layanan (Services) di bawah Kategori tersebut
            for sub_group_name, services_list in sub_groups.items():
                for svc_name in services_list:
                    service = Service(
                        name=f"[{sub_group_name}] {svc_name}",
                        description=f"Layanan spesifik untuk {svc_name}",
                        category_id=category.id
                    )
                    session.add(service)
            
            await session.commit()
            print(f"✅ Kategori '{cat_name}' beserta layanan-layanannya berhasil dimasukkan.")

        print("🎉 Semua struktur kategori layanan berhasil dimasukkan ke Database!")

if __name__ == "__main__":
    asyncio.run(seed_categories())
