import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { HiPlus, HiX, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { RiGraduationCapLine, RiUserSearchLine, RiBankLine, RiTrophyLine } from 'react-icons/ri';

// Import gambar gedung IPB untuk banner
import BgGedung from '../assets/image 3.png';

const DashboardPage = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  // 1. State untuk Tab FAQ yang aktif
  const [activeTab, setActiveTab] = useState('Akademik');
  
  // 2. State untuk Accordion (pertanyaan mana yang sedang terbuka)
  const [openFaq, setOpenFaq] = useState(null);

  const categoryCards = [
    {
      title: 'Layanan Permohonan Surat',
      icon: <RiGraduationCapLine />,
      links: ['Surat Izin Akademik', 'Surat Pengantar Mahasiswa', 'Surat Tugas Mahasiswa', 'Permohonan Surat Magang']
    },
    {
      title: 'Layanan Pengembangan Karir',
      icon: <RiUserSearchLine />,
      links: ['Info Magang Mahasiswa', 'Lowongan Kerja/Job Fair']
    },
    {
      title: 'Admin Kemahasiswaan',
      icon: <RiBankLine />,
      links: ['Proposal Sponsorship', 'Surat Undangan Kegiatan Mahasiswa', 'Penandatanganan Sertifikat']
    },
    {
      title: 'Lomba Mahasiswa dan SKPI',
      icon: <RiTrophyLine />,
      links: ['Fasilitas Pendanaan Lomba', 'Informasi Lomba Kemahasiswaan']
    }
  ];

  const faqData = {
    Akademik: [
      { q: "Bagaimana prosedur pengajuan cuti akademik?", a: "Prosedur pengajuan cuti akademik dapat dilakukan melalui portal mahasiswa dengan melampirkan surat permohonan dan bukti bebas pustaka." },
      { q: "Kapan batas akhir pengisian KRS untuk semester ganjil?", a: "Batas akhir pengisian KRS semester ganjil adalah tanggal 31 Agustus 2024 melalui sistem informasi akademik." }
    ],
    IT: [
      { q: "Bagaimana cara menghubungkan perangkat ke jaringan Wi-Fi kampus?", a: "Gunakan konfigurasi username dan password SSO Portal Akademik untuk akses Wi-Fi IPB di seluruh area universitas." },
      { q: "Bagaimana prosedur aktivasi akun email resmi kampus bagi mahasiswa baru?", a: "Langkah-langkah aktivasi akun email baru bisa dilakukan secara mandiri melalui link yang dikirimkan ke email pribadi saat pendaftaran." }
    ],
    SPP: [
      { q: "Bagaimana cara melihat daftar dan mengajukan permohonan beasiswa?", a: "Informasi terkait beasiswa dapat diakses melalui menu finansial di portal mahasiswa atau hubungi biro kemahasiswaan." },
      { q: "Bagaimana alur dan syarat pengajuan keringanan atau cicilan pembayaran UKT?", a: "Panduan resmi mengenai prosedur permohonan keringanan/cicilan pembayaran UKT bagi mahasiswa yang memenuhi kriteria." }
    ],
    Fasilitas: [
      { q: "Bagaimana prosedur dan syarat peminjaman ruangan di lingkungan kampus?", a: "Pengajuan izin peminjaman ruangan harus dilakukan minimal H-3 melalui sistem perizinan fasilitas kampus." },
      { q: "Bagaimana cara mendapatkan hak akses dan izin penggunaan laboratorium?", a: "Akses laboratorium memerlukan persetujuan kepala laboratorium dan telah mengikuti pelatihan keselamatan kerja." }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-manrope">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="max-w-[1440px] mx-auto px-10 pt-36 pb-20">
        
        {/* --- HERO SECTION --- */}
        <div className="mb-14">
          <p className="text-[#0040A1] font-bold text-[10px] tracking-[0.2em] mb-4 uppercase">Student Support Portal</p>
          <h1 className="text-6xl font-[800] text-gray-900 mb-2 tracking-tighter">
            Selamat datang di <span className="text-[#0040A1]">IPB OneHelp</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">Silahkan lakukan login untuk membuat tiket.</p>
        </div>

        {/* --- MY TICKETS SECTION (4 CARDS) --- */}
        <div className="mb-24">
          <h2 className="text-2xl font-[800] text-gray-900 mb-8 tracking-tight">My Tickets</h2>
          <div className="grid grid-cols-4 gap-6">
            {categoryCards.map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-50 text-[#0040A1] w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-6">
                  {card.icon}
                </div>
                <h3 className="text-[15px] font-[800] text-gray-800 leading-tight mb-6">{card.title}</h3>
                <div className="space-y-3">
                  {card.links.map((link, j) => (
                    <a key={j} href="#" className="flex items-center gap-2 text-[10px] font-bold text-[#0040A1] hover:underline">
                      <HiOutlineArrowNarrowRight className="shrink-0" /> {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="flex justify-center gap-4 mb-10">
          {['Akademik', 'IT', 'SPP', 'Fasilitas'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenFaq(null); }}
              className={`px-12 py-3 rounded-2xl text-[13px] font-[800] transition-all border ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white border-transparent shadow-lg' 
                  : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

          {/* Accordion List */}
          <div className="space-y-4 mb-10">
            {faqData[activeTab].map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-7 bg-[#EDEDED] rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  <span className="text-[13px] font-[800] text-gray-700">{item.q}</span>
                  {openFaq === index ? <HiX className="text-gray-400" /> : <HiPlus className="text-gray-400" />}
                </button>
                {openFaq === index && (
                  <div className="p-7 bg-[#F8FAFC] border border-gray-100 rounded-2xl mt-2 text-[11px] text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* --- CTA BANNER WITH BACKGROUND IMAGE --- */}
          <div className="relative h-[180px] rounded-[2.5rem] overflow-hidden flex items-center shadow-xl">
            <img src={BgGedung} alt="Gedung IPB" className="absolute inset-0 w-full h-full object-cover" />
            
            {/* Update Overlay Gradasi Biru agar lebih mirip desain Figma */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0040A1]/95 to-[#0056D2]/80"></div>

            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between px-14">
              <div className="text-white">
                <h3 className="text-2xl font-[800] mb-2 tracking-tight">Belum menemukan jawaban yang Anda cari?</h3>
                <p className="text-blue-100 text-xs font-medium opacity-90">Silahkan mengajukan permohonan bantuan lebih lanjut dengan membuka tiket layanan</p>
              </div>
              <button 
                onClick={() => isLoggedIn ? navigate('/tickets/new') : navigate('/login')}
                className="bg-white text-[#0040A1] px-10 py-3.5 rounded-2xl font-[800] text-sm hover:shadow-2xl transition-all shadow-lg shrink-0 active:scale-95"
              >
                New Ticket
              </button>
            </div>
          </div>
      </main>

      <footer className="py-12 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          © 2026 THE ACADEMIC SANCTUARY, IPB UNIVERSITY
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;