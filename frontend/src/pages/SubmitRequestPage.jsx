import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { HiOutlineCloudUpload, HiOutlineShieldCheck } from 'react-icons/hi';

const SubmitRequestPage = ({ isLoggedIn, onLogout, addTicket }) => {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState({
    title: '',
    topic: 'Select a topic',
    nim: '',
    description: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/categories/`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (ticketData.title && ticketData.nim && ticketData.description) {
      const now = new Date();
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateNow = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeNow = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      
      addTicket({
      id: ticketId,
      status: 'OPEN',
      title: ticketData.title,
      desc: ticketData.description,
      studentName: 'JOHANNA D.', // Nanti ini bisa diambil dari data user yang sedang login
      nim: ticketData.nim,
      date: dateNow,
      timestamp: timeNow 
    });


navigate(`/tickets/${ticketId}`);
    } else {
      alert("Mohon lengkapi Title, NIM, dan Deskripsi");      
    } 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="max-w-5xl mx-auto px-10 pt-32 pb-20">
        <div className="animate-in fade-in duration-500">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tighter font-manrope text-center md:text-left">Buat Tiket</h1>
          <p className="text-gray-400 text-sm mb-12 text-center md:text-left">Silahkan lengkapi formulir berikut untuk membuat tiket baru.</p>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-50 space-y-10">
            {/* Title */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] ml-1">Permasalahan</label>
              <input 
                type="text" name="title" value={ticketData.title} onChange={handleChange}
                placeholder="Masukkan permasalahan anda di kolom ini" 
                className="w-full px-8 py-5 bg-[#f8fafc] rounded-[1.5rem] border-none focus:ring-2 focus:ring-[#0040A1] outline-none text-sm font-medium transition-all"
              />
            </div>

            {/* NIM & Topic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] ml-1">NIM</label>
                <input 
                  type="text" name="nim" value={ticketData.nim} onChange={handleChange}
                  placeholder="G6401231000" 
                  className="w-full px-8 py-5 bg-[#f8fafc] rounded-[1.5rem] border-none focus:ring-2 focus:ring-[#0040A1] outline-none text-sm font-medium"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] ml-1">Topik</label>
                <select name="topic" value={ticketData.topic} onChange={handleChange} className="w-full px-8 py-5 bg-[#f8fafc] rounded-[1.5rem] border-none focus:ring-2 focus:ring-[#0040A1] outline-none text-sm font-medium cursor-pointer">
                  <option value="Select a topic">Pilih topik permasalahan</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] ml-1">Detil Deskripsi Permasalahan</label>
              <textarea 
                rows="6" name="description" value={ticketData.description} onChange={handleChange}
                placeholder="Jelaskan permasalahan anda sedetil mungkin untuk kami bantu." 
                className="w-full px-8 py-5 bg-[#f8fafc] rounded-[1.5rem] border-none focus:ring-2 focus:ring-[#0040A1] outline-none text-sm font-medium transition-all resize-none"
              ></textarea>
            </div>

            {/* Attachment */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] ml-1">Dokumen Pendukung (Opsional)</label>
              <div className="border-2 border-dashed border-gray-100 rounded-[2rem] p-16 flex flex-col items-center justify-center bg-[#f8fafc] hover:bg-gray-50 transition-colors cursor-pointer group">
                <HiOutlineCloudUpload className="text-4xl text-gray-300 group-hover:text-[#0040A1] transition-colors mb-4" />
                <p className="text-sm font-bold text-gray-500 font-public">Klik untuk menambahkan file</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-public">PDF, DOCX, PNG atau JPG (max 10MB)</p>
              </div>
            </div>

            {/* Footer Form */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-50 gap-6">
              <div className="flex items-center gap-2 text-gray-300">
                <HiOutlineShieldCheck className="text-xl" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">End-to-end secure processing</span>
              </div>
              <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white px-14 py-4 rounded-2xl font-bold text-sm font-manrope uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95">
                Buat Tiket
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-12 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] font-manrope">
          © 2026 THE ACADEMIC SANCTUARY, IPB UNIVERSITY
        </p>
      </footer>
    </div>
  );
};

export default SubmitRequestPage;