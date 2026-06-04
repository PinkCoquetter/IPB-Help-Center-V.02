import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { HiPlus, HiX, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { RiGraduationCapLine, RiUserSearchLine, RiBankLine, RiTrophyLine } from 'react-icons/ri';
import BgGedung from '../assets/image 3.png';

const DashboardPage = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Akademik');
    const [openFaq, setOpenFaq] = useState(null);
  const [allFaqs, setAllFaqs] = useState([]);

  // Fetch FAQs dari API backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://ipb-help-center-v02-production.up.railway.app';
        const response = await fetch(`${apiUrl}/api/faqs/public`);
        if (response.ok) {
          const data = await response.json();
          setAllFaqs(data);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFaqs();
  }, []);

  // Filter FAQ berdasarkan tab aktif (menggunakan field `category` dari database)
  const filteredFaqs = allFaqs.filter(faq => faq.category === activeTab);

  const categoryCards = [
    {
      title: 'Layanan Permohonan Surat',
      topic: 'Akademik dan Kelulusan',
      icon: <RiGraduationCapLine />,
      links: ['Surat Izin Akademik', 'Surat Pengantar Mahasiswa', 'Surat Tugas Mahasiswa', 'Permohonan Surat Magang']
    },
    {
      title: 'Teknologi & Informasi',
      topic: 'Layanan IT dan Digital',
      icon: <RiUserSearchLine />,
      links: ['Penghapusan Storage Akun', 'Akun IPB, Email']
    },
    {
      title: 'Keuangan & Pembayaran',
      topic: 'Keuangan dan Beasiswa',
      icon: <RiBankLine />,
      links: ['Bantuan UKT', 'Informasi Beasiswa']
    },
    {
      title: 'Sarana & Prasarana',
      topic: 'Fasilitas dan Infrastruktur (Sarpras)',
      icon: <RiTrophyLine />,
      links: ['Peminjaman Ruangan dan Alat', 'Layanan Kerusakan & Perbaikan']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-manrope">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="max-w-[1440px] mx-auto px-10 pt-36 pb-20">
        
        {/* --- HERO SECTION --- */}
        <div className="mb-14">
          <p className="text-[#0040A1] font-semibold font-['Public_Sans'] text-[10px] tracking-[0.2em] mb-4 uppercase">
            Student Support Portal
          </p>
          <h1 className="text-6xl font-bold text-gray-900 mb-2 tracking-tighter">
            Selamat datang di <span className="text-[#0040A1]">IPB OneHelp</span>
          </h1>
        </div>

        {/* --- MY TICKETS SECTION */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Kategori Tiket</h2>
          <div className="grid grid-cols-4 gap-6">
            {categoryCards.map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-50 text-[#0040A1] w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-6">
                  {card.icon}
                </div>
                <h3 className="text-[15px] font-bold text-gray-800 leading-tight mb-6">{card.title}</h3>
                <div className="space-y-3">
                  {card.links.map((link, j) => (
                    <button 
                      key={j} 
                      onClick={() => navigate(`/tickets/new?title=${encodeURIComponent(link)}&topic=${encodeURIComponent(card.topic)}`)} 
                      className="flex items-center gap-2 text-[13px] font-['Public_Sans'] font-bold text-[#0040A1] text-left hover:underline w-full"
                    >
                      <HiOutlineArrowNarrowRight className="shrink-0" /> {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*FAQ*/}
        <div className="flex justify-center gap-4 mb-10">
          {['Akademik', 'IT', 'SPP', 'Fasilitas'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenFaq(null); }}
              className={`px-12 py-3 rounded-2xl text-[13px] font-bold transition-all border ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white border-transparent shadow-lg' 
                  : 'bg-white text-gray-800 border-gray-100 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

          {/* Accordion List */}
          <div className="space-y-4 mb-14">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div 
                  key={item.id || index} 
                  className="bg-[#EDEDED] rounded-[1rem] transition-all duration-300"
                >
                  {/* Tombol Pertanyaan */}
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-8 text-left outline-none"
                  >
                    <span className="text-[14px]  font-['Public_Sans'] font-bold text-[gray-800] pr-10 leading-relaxed">
                      {item.question}
                    </span>
                    <div className="text-gray-500 shrink-0">
                      {isOpen ? <HiX size={20} /> : <HiPlus size={20} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-8 pb-8 -mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <p className="text-[12px] font-['Public_Sans'] font-medium text-[#424654] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
            ) : (
              <div className="text-center py-12 text-gray-400 font-['Public_Sans'] text-sm">
                Belum ada FAQ untuk kategori ini.
              </div>
            )}
          </div>
          <div className="relative h-[180px] rounded-[2.5rem] overflow-hidden flex items-center shadow-xl">
            <img src={BgGedung} alt="Gedung IPB" className="absolute inset-0 w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-[#0040A1]/95 to-[#0056D2]/80"></div>

            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between px-14">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2 tracking-tight">Belum menemukan jawaban yang Anda cari?</h3>
                <p className="text-blue-100 text-s font-['Public_Sans'] font-medium opacity-90">Silahkan mengajukan permohonan bantuan lebih lanjut dengan membuka tiket layanan</p>
              </div>
              <button 
                onClick={() => isLoggedIn ? navigate('/tickets/new') : navigate('/login')}
                className="bg-white font-['Public_Sans'] text-[#0040A1] px-10 py-3.5 rounded-2xl font-bold text-sm hover:shadow-2xl transition-all shadow-lg shrink-0 active:scale-95"
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