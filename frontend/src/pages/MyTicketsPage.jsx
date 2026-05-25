import React from 'react';
import Navbar from '../components/Navbar';
import { HiOutlineMail, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineArrowSmRight, HiOutlineEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const getStatusStyles = (status) => {
  switch (status) {
    case 'OPEN':
      return {
        badge: 'bg-[#0056d2] text-[#ccd8ff]',
        button: 'bg-[#f0f5ff] text-[#0040A1] hover:bg-[#e0e9ff]',
        text: 'text-gray-900',
        desc: 'text-gray-400'
      };
    case 'IN PROGRESS':
      return {
        badge: 'bg-[#B6D0FF] text-[#3F5881]',
        button: 'bg-[#f0f5ff] text-[#0040A1] hover:bg-[#e0e9ff]',
        text: 'text-gray-900',
        desc: 'text-gray-400'
      };
    case 'RESOLVED':
      return {
        badge: 'bg-[#E0E3E5] text-[#424654]',
        button: 'bg-[#f8fafc] text-[#737785] hover:bg-gray-100',
        text: 'text-gray-500',
        desc: 'text-gray-400'
      };
    default:
      return { badge: 'bg-gray-100 text-gray-500', button: 'bg-gray-50 text-gray-400' };
  }
};

const MyTicketsPage = ({ isLoggedIn, onLogout }) => { 
  const navigate = useNavigate();

  const stats = [
    { 
      label: 'Open Tickets', 
      value: '02', 
      sub: 'AWAITING RESPONSE', 
      icon: <HiOutlineMail />, 
      color: 'text-[#0040A1]', 
      bgColor: 'bg-blue-50' 
    },
    { 
      label: 'In Progress', 
      value: '01', 
      sub: 'ACTIVE INVESTIGATION', 
      icon: <HiOutlineClipboardList />, 
      color: 'text-[#0040A1]', 
      bgColor: 'bg-blue-50' 
    },
    { 
      label: 'Resolved', 
      value: '14', 
      sub: 'ARCHIVED HISTORY', 
      icon: <HiOutlineCheckCircle />, 
      color: 'text-[#004E5F]', 
      bgColor: 'bg-teal-50' 
    },
  ];

  const tickets = [
    {
      id: 'TKT-9420',
      status: 'OPEN',
      title: 'Pembayaran UKT Gagal',
      desc: 'Pembayaran UKT tidak bisa dilakukan, saya tidak tahu alasannya apa',
      date: 'Oct 12, 2024',
      type: 'active'
    },
    {
      id: 'TKT-8851',
      status: 'IN PROGRESS',
      title: 'Pelanggaran Tata Tertib PKU',
      desc: 'Mahasiswa melakukan pelanggaran di kawasan PKU',
      date: 'Oct 09, 2024',
      type: 'active'
    },
    {
      id: 'TKT-7704',
      status: 'RESOLVED',
      title: 'KTM Tidak Bisa Digunakan',
      desc: 'Saat mau masuk kawasan kampus, KTM tidak dapat discan.',
      date: 'Oct 05, 2024',
      type: 'resolved'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-manrope">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-10 pt-32 pb-20">
        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">My Tickets</h1>
          <p className="text-gray-400 text-sm tracking-tight">
            Track the status of your academic and technical inquiries.
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex items-start justify-between">
              <div className="space-y-4">
                <div className={`${stat.bgColor} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[16px] font-regular text-gray-900  tracking-tight">{stat.label}</p>
                  <p className="text-[9px] font-regular text-gray-400 uppercase tracking-widest">{stat.sub}</p>
                </div>
              </div>
              <span className="text-xl font-regular text-[#0040A1]">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Section List Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Active Requests</h2>
          <button className="text-[11px] font-bold text-[#0056D2] hover:underline flex items-center gap-1 uppercase tracking-wider">
            View Archive <HiOutlineArrowSmRight size={14} />
          </button>
        </div>

        {/* Ticket List Containers */}
        <div className="space-y-4">
          {tickets.map((ticket, i) => {
            const style = getStatusStyles(ticket.status);
            
            return (
              <div 
                key={i} 
                className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center transition-all hover:shadow-md"
              >
                {/* SISI KIRI: Konten */}
                <div className="space-y-3 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`text-[9px] font-regular px-2.5 py-1 rounded-md tracking-wider uppercase ${style.badge}`}>
                      {ticket.status}
                    </span>
                    {/* ID Tiket */}
                    <span className="text-[10px] font-bold text-[#737875] tracking-widest uppercase">
                      #{ticket.id}
                    </span>
                  </div>
                  
                  <h3 className={`text-lg font-regular transition-colors ${style.text}`}>
                    {ticket.title}
                  </h3>
                  <p className={`text-xs leading-relaxed max-w-xl transition-colors ${style.desc}`}>
                    {ticket.desc}
                  </p>
                </div>

                {/* SISI KANAN: Tanggal & Tombol */}
                <div className="mt-6 md:mt-0 text-right flex flex-col items-end gap-2 w-full md:w-auto">
                  <div className="mb-2">
                    <p className="text-[9px] font-bold text-[#737785] uppercase tracking-widest mb-1">
                      {ticket.status === 'RESOLVED' ? 'RESOLVED ON' : 'SUBMITTED ON'}
                    </p>
                    <p className={`text-xs font-bold ${ticket.status === 'RESOLVED' ? 'text[#191c1e]' : 'text-[]#737875'}`}>
                      {ticket.date}
                    </p>
                  </div>
                  
                  {/* Tombol Dinamis */}
                  <button 
                    onClick={() => ticket.status !== 'RESOLVED' && navigate(`/tickets/${ticket.id}`)}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 transition-all ${style.button}`}
                  >
                    {ticket.status === 'RESOLVED' ? (
                      <>View History <HiOutlineEye size={14}/></>
                    ) : (
                      <>View Details <HiOutlineArrowSmRight size={14}/></>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          © 2026 THE ACADEMIC SANCTUARY, IPB UNIVERSITY
        </p>
      </footer>
    </div>
  );
};

export default MyTicketsPage;