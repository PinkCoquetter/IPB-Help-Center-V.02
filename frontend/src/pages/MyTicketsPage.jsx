import React from 'react';
import Navbar from '../components/Navbar';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const MyTicketsPage = () => {
  const stats = [
    { label: 'Open Tickets', value: '02', sub: 'Awaiting Response' },
    { label: 'In Progress', value: '01', sub: 'Active Investigation' },
    { label: 'Resolved', value: '14', sub: 'Archived History' },
  ];

  const tickets = [
    { id: 'TKT-9420', title: 'Pembayaran UKT Gagal', desc: 'Pembayaran UKT tidak bisa dilakukan, saya tidak tahu alasannya apa', date: 'Oct 12, 2024', status: 'OPEN', color: 'blue' },
    { id: 'TKT-8851', title: 'Pelanggaran Tata Tertib PKU', desc: 'Mahasiswa melakukan pelanggaran di kawasan PKU', date: 'Oct 09, 2024', status: 'IN PROGRESS', color: 'blue' },
    { id: 'TKT-7704', title: 'KTM Tidak Bisa Digunakan', desc: 'Saat mau masuk kawasan kampus, KTM tidak dapat discan.', date: 'Oct 05, 2024', status: 'RESOLVED', color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-manrope">
      <Navbar />
      <main className="max-w-7xl mx-auto px-10 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-400 text-sm">Track the status of your academic and technical inquiries.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col items-center text-center">
              <span className="text-5xl font-black text-gray-900 mb-2">{stat.value}</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-900">Active Requests</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">View Archive</button>
          </div>
          <div className="divide-y divide-gray-50">
            {tickets.map((ticket, i) => (
              <div key={i} className="p-10 hover:bg-gray-50/50 transition-colors flex justify-between items-center group">
                <div className="space-y-3">
                  <span className={`inline-block text-[10px] font-black px-3 py-1 rounded border ${
                    ticket.status === 'RESOLVED' ? 'border-green-100 text-green-600 bg-green-50/30' : 'border-blue-100 text-blue-600 bg-blue-50/30'
                  }`}>
                    {ticket.status} #{ticket.id}
                  </span>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{ticket.title}</h4>
                  <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{ticket.desc}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Submitted on</p>
                    <p className="text-sm font-bold text-gray-900">{ticket.date}</p>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
                    View Details <HiOutlineArrowNarrowRight />
                  </button>
                </div>
              </div>
            ))}
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

export default MyTicketsPage;