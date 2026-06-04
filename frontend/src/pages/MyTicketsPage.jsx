import React, { useRef, useState, useEffect } from 'react';
import { fetchWithAuth } from '../config/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  HiOutlineMail, 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineArrowNarrowRight 
} from 'react-icons/hi';

const getStatusStyles = (status) => {
  switch (status) {
    case 'OPEN':
      return {
        badge: 'bg-[#0040A1] text-white',
        button: 'bg-[#f0f5ff] text-[#0040A1] hover:bg-[#e0e9ff]',
        text: 'text-gray-900',
        label: 'Tiket Baru'
      };
    case 'IN PROGRESS':
      return {
        badge: 'bg-[#DBE4FF] text-[#0040A1]',
        button: 'bg-[#f0f5ff] text-[#0040A1] hover:bg-[#e0e9ff]',
        text: 'text-gray-900',
        label: 'Sedang Diproses'
      };
    case 'RESOLVED':
      return {
        badge: 'bg-[#F1F4F9] text-[#B0B8C1]',
        button: 'bg-[#F8FAFC] text-[#B0B8C1] hover:bg-gray-100',
        text: 'text-gray-400',
        label: 'Selesai'
      };
    default:
      return { badge: 'bg-gray-100 text-gray-500', button: 'bg-gray-50 text-gray-400', label: status };
  }
};

const MyTicketsPage = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const listRef = useRef(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetchWithAuth('/api/tickets/me');
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          console.error("Failed to fetch tickets");
        }
      } catch (e) {
        console.error("Error fetching tickets:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'OPEN').length;
  const progressCount = tickets.filter(t => t.status === 'in_progress' || t.status === 'IN PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'RESOLVED').length;

  const stats = [
    { id: 'OPEN', label: 'Tiket Baru', val: openCount.toString().padStart(2, '0'), sub: 'MENUNGGU TANGGAPAN', icon: <HiOutlineMail />, color: 'text-blue-600' },
    { id: 'IN PROGRESS', label: 'Sedang Diproses', val: progressCount.toString().padStart(2, '0'), sub: 'PENANGANAN AKTIF', icon: <HiOutlineClipboardList />, color: 'text-indigo-600' },
    { id: 'RESOLVED', label: 'Selesai', val: resolvedCount.toString().padStart(2, '0'), sub: 'PERMOHONAN DITUTUP', icon: <HiOutlineCheckCircle />, color: 'text-teal-600' },
  ];

  const filteredTickets = tickets.filter(t => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'OPEN') return t.status === 'open' || t.status === 'OPEN';
    if (filterStatus === 'IN PROGRESS') return t.status === 'in_progress' || t.status === 'IN PROGRESS';
    if (filterStatus === 'RESOLVED') return t.status === 'resolved' || t.status === 'RESOLVED';
    return t.status === filterStatus;
  });

  const handleFilter = (statusId) => {
    setFilterStatus(prev => prev === statusId ? 'ALL' : statusId);
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-10 pt-36 pb-20 font-sans">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tighter font-manrope">Tiket Saya</h1>
          <p className="text-gray-400 text-sm font-medium font-public">Lihat perkembangan laporan dan pertanyaan yang telah Anda ajukan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 font-public">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              onClick={() => handleFilter(stat.id)}
              className={`bg-white p-10 rounded-[2.5rem] shadow-sm border-2 transition-all cursor-pointer flex items-center justify-between active:scale-95 group ${
                filterStatus === stat.id ? 'border-[#0040A1] ring-4 ring-blue-50' : 'border-transparent hover:border-blue-100'
              }`}
            >
              <div className="flex flex-col gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 ${
                   filterStatus === stat.id ? 'bg-[#0040A1] text-white' : 'bg-[#F0F5FF] text-[#0040A1]'
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-gray-900 leading-none mb-2">{stat.label}</p>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{stat.sub}</p>
                </div>
              </div>
              <span className={`text-5xl font-black tracking-tighter font-manrope transition-colors ${
                filterStatus === stat.id ? 'text-[#0040A1]' : 'text-[#0040A1]/30'
              }`}>
                {stat.val}
              </span>
            </div>
          ))}
        </div>

        {/* --- LIST TICKET SECTION --- */}
        <div ref={listRef} className="flex justify-between items-center mb-8 pt-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 font-manrope uppercase tracking-tight">Histori Tiket</h2>
            {filterStatus !== 'ALL' && (
              <span className="px-3 py-1 bg-blue-50 text-[#0040A1] text-[10px] font-bold rounded-full animate-pulse">
                Menampilkan: {filterStatus}
              </span>
            )}
          </div>
          {filterStatus !== 'ALL' && (
            <button 
              onClick={() => setFilterStatus('ALL')}
              className="text-[11px] font-bold text-red-500 hover:underline font-public uppercase tracking-widest"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="space-y-6 font-public">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => {
              const style = getStatusStyles(ticket.status);
              return (
                <div 
                  key={ticket.id} 
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center transition-all hover:shadow-md"
                >
                  <div className="space-y-3 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-md tracking-wider uppercase ${style.badge}`}>
                        {style.label}
                      </span>
                      <span className="text-[10px] font-bold text-gray-300 tracking-[0.3em]">
                        #{ticket.ticket_number || ticket.id}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold font-manrope transition-colors ${style.text}`}>
                      {ticket.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed max-w-2xl font-medium text-gray-400">
                      {ticket.description || ticket.desc}
                    </p>
                  </div>

                  <div className="mt-8 md:mt-0 text-right flex flex-col items-end gap-5 w-full md:w-auto">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-public">
                        {ticket.status === 'resolved' || ticket.status === 'RESOLVED' ? 'Selesai pada' : 'Diajukan pada'}
                      </p>
                      <p className="text-sm font-bold text-gray-900">{new Date(ticket.created_at || ticket.date).toLocaleDateString('en-GB')}</p>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className={`px-8 py-3 rounded-full text-[11px] font-bold flex items-center gap-2 transition-all shadow-sm ${style.button}`}
                    >
                      {ticket.status === 'RESOLVED' ? 'Lihat Riwayat' : 'Lihat Detail'} 
                      <HiOutlineArrowNarrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            
            /* NOTIFIKASI KOSONG SESUAI STATUS */
              <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-gray-200 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-2xl">
                  <HiOutlineMail />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Tidak Ada Tiket</h3>
                <p className="text-gray-400 font-medium max-w-xs mx-auto">
                  {filterStatus === 'OPEN' 
                    ? 'Saat ini tidak ada tiket dengan status "Baru Masuk".' 
                    : filterStatus === 'IN PROGRESS' 
                    ? 'Tidak ada tiket yang sedang dalam penanganan aktif.'
                    : 'Belum ada riwayat tiket yang diselesaikan.'}
                </p>
                <button 
                  onClick={() => setFilterStatus('ALL')} 
                  className="mt-6 text-[#0040A1] font-black text-[11px] uppercase tracking-widest hover:underline"
                >
                  Lihat Semua Tiket
                </button>
              </div>
            )}
          </div>
      </main>

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] font-manrope">
          © 2026 THE ACADEMIC SANCTUARY, IPB UNIVERSITY
        </p>
      </footer>
    </div>
  );
};

export default MyTicketsPage;