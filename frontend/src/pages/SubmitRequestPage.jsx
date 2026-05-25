import React from 'react';
import Navbar from '../components/Navbar';
import { HiOutlineCloudUpload, HiOutlineShieldCheck } from 'react-icons/hi';

const SubmitRequestPage = ({ isLoggedIn, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-manrope">
        <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      
      <main className="max-w-5xl mx-auto px-10 pt-32 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Submit a Request</h1>
          <p className="text-gray-400 text-sm">Please fill in the form below to open a new ticket.</p>
        </div>

        <form className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-8">
          {/* Subject */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#191C1E] uppercase tracking-[0.2em] ml-1">Subject</label>
            <input 
              type="text" 
              placeholder="How can we help?" 
              className="w-full px-6 py-4 bg-[#f8fafc] rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
          </div>

          {/* Topic & NIM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#191C1E] uppercase tracking-[0.2em] ml-1">Topic</label>
              <select className="w-full px-6 py-4 bg-[#f8fafc] rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-500 appearance-none cursor-pointer">
                <option>Select a topic</option>
                <option>Akademik</option>
                <option>Fasilitas</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#191C1E] uppercase tracking-[0.2em] ml-1">NIM</label>
              <input 
                type="text" 
                placeholder="G6401231000" 
                className="w-full px-6 py-4 bg-[#f8fafc] rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#191C1E] uppercase tracking-[0.2em] ml-1">Detailed Description</label>
            <textarea 
              rows="5" 
              placeholder="Please provide as much detail as possible to help us assist you faster." 
              className="w-full px-6 py-4 bg-[#f8fafc] rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all resize-none"
            ></textarea>
          </div>

          {/* Upload Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#191C1E] uppercase tracking-[0.2em] ml-1">Attachments (Optional)</label>
            <div className="border-2 border-dashed border-gray-100 rounded-4xl p-16 flex flex-col items-center justify-center bg-[#f8fafc] hover:bg-gray-50 transition-colors cursor-pointer group">
              <HiOutlineCloudUpload className="text-4xl text-gray-300 group-hover:text-blue-500 transition-colors mb-4" />
              <p className="text-sm font-bold text-gray-400">Click to upload or drag and drop</p>
              <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">PDF, DOCX, PNG or JPG (max 10MB)</p>
            </div>
          </div>

          {/* Footer Form */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-300">
              <HiOutlineShieldCheck className="text-xl" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">End-to-end secure processing</span>
            </div>
            <button className="bg-[#0040A1] text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 shadow-xl shadow-blue-100 transition-all active:scale-95">
              Send Request
            </button>
          </div>
        </form>
      </main>

      <footer className="py-12 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          © 2026 THE ACADEMIC SANCTUARY, IPB UNIVERSITY
        </p>
      </footer>
    </div>
  );
};

export default SubmitRequestPage;