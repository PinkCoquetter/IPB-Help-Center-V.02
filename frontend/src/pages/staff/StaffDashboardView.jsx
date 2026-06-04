import React, { useState } from 'react';
import { HiSearch, HiOutlineMail, HiOutlineClipboardList, HiOutlineCheckCircle, HiRefresh } from 'react-icons/hi';

export const StaffDashboardView = ({ tickets, onSelectTicket, onLogout, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Tiket Baru', count: tickets.filter(t => t.status === 'open' || t.status === 'OPEN').length, sub: 'MENUNGGU TANGGAPAN', icon: <HiOutlineMail />, status: 'open', color: 'text-blue-600' },
    { label: 'Sedang Diproses', count: tickets.filter(t => t.status === 'in_progress' || t.status === 'IN PROGRESS').length, sub: 'PENANGANAN AKTIF', icon: <HiOutlineClipboardList />, status: 'in_progress', color: 'text-indigo-600' },
    { label: 'Selesai', count: tickets.filter(t => t.status === 'resolved' || t.status === 'RESOLVED').length, sub: 'PERMOHONAN DITUTUP', icon: <HiOutlineCheckCircle />, status: 'resolved', color: 'text-emerald-600' },
  ];

  const filteredTickets = tickets.filter(t => {
    let matchStatus = true;
    if (filterStatus !== 'ALL') {
      const tStat = t.status.toLowerCase().replace('_', ' ');
      const fStat = filterStatus.toLowerCase().replace('_', ' ');
      matchStatus = tStat === fStat;
    }
    const searchString = search.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(searchString) || 
                        (t.ticket_number && t.ticket_number.toLowerCase().includes(searchString)) ||
                        (t.id && t.id.toString().toLowerCase().includes(searchString));
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-10 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#191C1E] tracking-tight font-manrope">Antrian Tiket</h1>
          <p className="text-gray-500 font-medium font-public mt-1">Pantau status permohonan layanan akademik dan bantuan teknis mahasiswa IPB.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onRefresh} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50">
            <HiRefresh /> Perbarui Antrian
          </button>
          <button onClick={onLogout} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-12">
        {stats.map((s, i) => (
          <div 
            key={i} 
            onClick={() => setFilterStatus(filterStatus === s.status ? 'ALL' : s.status)}
            className={`bg-white p-10 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between shadow-sm ${filterStatus === s.status ? 'border-[#0040A1]' : 'border-transparent hover:border-blue-100'}`}
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0040A1] flex items-center justify-center text-2xl shadow-inner">{s.icon}</div>
              <div>
                <p className="text-sm font-bold text-gray-900 font-manrope">{s.label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-public">{s.sub}</p>
              </div>
            </div>
            <span className={`text-5xl font-black font-manrope ${s.color}`}>{s.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Daftar Antrian Permohonan Layanan</h3>
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" placeholder="Cari berdasarkan nama mahasiswa, ID, atau judul..." 
              className="pl-12 pr-6 py-3.5 bg-[#f1f4f9] rounded-2xl text-sm outline-none w-[400px] focus:ring-2 focus:ring-blue-500 font-public"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left font-public">
          <thead className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-10 py-6">ID TIKET</th>
              <th className="px-10 py-6">MAHASISWA</th>
              <th className="px-10 py-6">PERMASALAHAN</th>
              <th className="px-10 py-6">KATEGORI</th>
              <th className="px-10 py-6 text-center">STATUS</th>
              <th className="px-10 py-6 text-right">WAKTU PENGAJUAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => onSelectTicket(t.id)}>
                <td className="px-10 py-7 text-[#0040A1] font-extrabold text-sm">#{t.ticket_number || t.id}</td>
               <td className="px-10 py-7">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#006071] text-white flex items-center justify-center text-[10px] font-black uppercase">
                      {/* Ambil inisial dari nama mahasiswa */}
                      {t.student?.full_name ? t.student.full_name.charAt(0) : (t.student_name ? t.student_name.charAt(0) : (t.studentName ? t.studentName.charAt(0) : 'U'))} 
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {t.student?.full_name || t.student_name || t.studentName || 'Unknown Student'}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-7 text-sm text-gray-600 font-medium max-w-xs truncate">{t.title}</td>
                <td className="px-10 py-7">
                  <span className="px-3 py-1 bg-gray-100 rounded-md text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {t.category ? t.category.name : 'UMUM'}
                  </span>
                </td>
                <td className="px-10 py-7 text-center">
                  <span className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    (t.status === 'OPEN' || t.status === 'open') ? 'bg-blue-50 text-blue-600 border border-blue-100' : (t.status === 'IN PROGRESS' || t.status === 'in_progress') ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-green-50 text-green-600 border border-green-100'
                  }`}>{(t.status === 'OPEN' || t.status === 'open') ? 'BARU MASUK' : (t.status === 'IN PROGRESS' || t.status === 'in_progress') ? 'DIPROSES' : 'SELESAI'}</span>
                </td>
                <td className="px-10 py-7 text-right">
                    <p className="text-[11px] font-bold text-gray-900">{new Date(t.created_at || t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-[10px] font-medium text-gray-400">{new Date(t.created_at || t.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};