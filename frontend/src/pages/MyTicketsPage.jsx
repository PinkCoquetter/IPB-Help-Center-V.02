import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  HiOutlineMail, 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineArrowNarrowRight, 
  HiOutlineEye 
} from 'react-icons/hi';

// 1. Fungsi penentu warna (Taruh di luar agar rapi)
const getStatusStyles = (status) => {
  switch (status) {
    case 'OPEN':
      return {
        badge: 'bg-[#0040A1] text-white',
        button: 'bg-[#f0f5ff] text-[#0040A1] hover:bg-[#e0e9ff]',
        text: 'text-gray-900',
        desc: 'text-gray-400'
      };
    case 'IN PROGRESS':
      return {
        badge: 'bg-[#DBE4FF] text-[#0040A1]',
        button: 'bg-[#f0f5ff] text-[#0040A1] hover:bg-[#e0e9ff]',
        text: 'text-gray-900',
        desc: 'text-gray-400'
      };
    case 'RESOLVED':
      return {
        badge: 'bg-[#F1F4F9] text-[#B0B8C1]',
        button: 'bg-[#F8FAFC] text-[#B0B8C1] hover:bg-gray-100',
        text: 'text-gray-400',
        desc: 'text-gray-300'
      };
    default:
      return { badge: 'bg-gray-100 text-gray-500', button: 'bg-gray-50 text-gray-400' };
  }
};

// 2. Pastikan PROPS ditulis lengkap di dalam kurung ({ ... })
const MyTicketsPage = ({ isLoggedIn, onLogout, tickets = [] }) => {
  const navigate = useNavigate();
  const listRef = useRef(null);

  // Fungsi scroll
  const scrollToTickets = () => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hitung jumlah tiket (Safeguard dengan tickets || [])
  const openCount = (tickets || []).filter(t => t.status === 'OPEN').length;
  const progressCount = (tickets || []).filter(t => t.status === 'IN PROGRESS').length;
  const resolvedCount = (tickets || []).filter(t => t.status === 'RESOLVED').length;

  const stats = [
    { label: 'Open Tickets', val: openCount.toString().padStart(2, '0'), sub: 'AWAITING RESPONSE', icon: <HiOutlineMail />, color: 'text-blue-600' },
    { label: 'In Progress', val: progressCount.toString().padStart(2, '0'), sub: 'ACTIVE INVESTIGATION', icon: <HiOutlineClipboardList />, color: 'text-indigo-600' },
    { label: 'Resolved', val: resolvedCount.toString().padStart(2, '0'), sub: 'ARCHIVED HISTORY', icon: <HiOutlineCheckCircle />, color: 'text-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* 3. Kirim props ke Navbar agar tidak error */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-10 pt-36 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tighter font-manrope">Tiket Saya</h1>
          <p className="text-gray-400 text-sm font-medium font-public">Lihat perkembangan laporan dan pertanyaan yang telah Anda ajukan.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              onClick={scrollToTickets}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between cursor-pointer hover:shadow-md transition-all active:scale-95 group"
            >
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F5FF] text-[#0040A1] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900 leading-none mb-1 font-public">{stat.label}</p>
                  <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest font-public">{stat.sub}</p>
                </div>
              </div>
              <span className="text-5xl font-black text-[#0040A1] tracking-tighter font-manrope">
                {stat.val}
              </span>
            </div>
          ))}
        </div>

        {/* LIST TICKET */}
        <div ref={listRef} className="flex justify-between items-center mb-8 pt-4">
          <h2 className="text-xl font-bold text-gray-800 font-manrope">Active Requests</h2>
        </div>

        <div className="space-y-6 font-public">
          {tickets.length > 0 ? (
            tickets.map((ticket, i) => {
              const style = getStatusStyles(ticket.status);
              return (
                <div 
                  key={i} 
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center transition-all hover:shadow-md"
                >
                  <div className="space-y-3 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-md tracking-wider uppercase ${style.badge}`}>
                        {ticket.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-300 tracking-[0.3em]">
                        #{ticket.id}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold font-manrope transition-colors ${style.text}`}>
                      {ticket.title}
                    </h3>
                    <p className={`text-[13px] leading-relaxed max-w-2xl font-medium transition-colors ${style.desc}`}>
                      {ticket.desc}
                    </p>
                  </div>

                  <div className="mt-8 md:mt-0 text-right flex flex-col items-end gap-5 w-full md:w-auto">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {ticket.status === 'RESOLVED' ? 'Resolved on' : 'Submitted on'}
                      </p>
                      <p className="text-sm font-bold text-gray-900">{ticket.date}</p>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className={`px-8 py-3 rounded-full text-[11px] font-bold flex items-center gap-2 transition-all shadow-sm ${style.button}`}
                    >
                      {ticket.status === 'RESOLVED' ? 'View History' : 'View Details'} 
                      <HiOutlineArrowNarrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium font-public">Belum ada tiket yang dibuat.</p>
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