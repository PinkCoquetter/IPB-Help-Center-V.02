import React from 'react';
import Navbar from '../components/Navbar';
import { HiOutlineDocumentDownload, HiOutlineArrowNarrowLeft } from 'react-icons/hi';

const TicketDetailPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-manrope">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-10 pt-32 pb-20">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-sm mb-8 transition-colors">
          <HiOutlineArrowNarrowLeft /> Back to Tickets
        </button>

        {/* Header Ticket */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Pembayaran UKT Gagal</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded">OPEN #TKT-9420</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Oct 12, 2024</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden mb-8">
          <div className="p-10 border-l-4 border-blue-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Submission Summary</p>
            <p className="text-gray-700 font-medium leading-relaxed italic">
              "Pembayaran UKT tidak bisa dilakukan, saya tidak tahu alasannya apa. Mohon bantuannya segera karena tenggat waktu sudah dekat."
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-8">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</p>
                <p className="text-sm font-bold text-gray-900">How can we help?</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                  <p className="text-sm font-bold text-gray-900">Select a topic</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student ID</p>
                  <p className="text-sm font-bold text-gray-900">G6401231000</p>
                </div>
             </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Attachments</p>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                <HiOutlineDocumentDownload size={20} />
              </div>
              <div className="flex-grow">
                <p className="text-xs font-bold text-gray-900">Bukti_Pembayaran_Gagal.pdf</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">2.4 MB • PDF File</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Detailed Description</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Saya sudah mencoba melakukan pembayaran melalui Mobile Banking dan ATM, namun muncul pesan error "Transaksi Gagal - Hubungi Pihak Terkait". 
            Dana di rekening saya mencukupi. Saya sudah melampirkan bukti screenshot error tersebut.
          </p>
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

export default TicketDetailPage;