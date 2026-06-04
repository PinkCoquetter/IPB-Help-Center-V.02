import React, { useState } from 'react';
import { fetchWithAuth } from '../config/api';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { HiOutlineCloudUpload, HiOutlineShieldCheck } from 'react-icons/hi';

const SubmitRequestPage = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil parameter dari URL (misal: ?title=Surat...&topic=Akademik...)
  const queryParams = new URLSearchParams(location.search);
  const initialTitle = queryParams.get('title') || '';
  const initialTopic = queryParams.get('topic') || '';

  const [ticketData, setTicketData] = useState({
    title: initialTitle,
    topic: initialTopic,
    nim: '',
    description: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kategori topik sesuai FAQ
  const topicCategories = [
    { id: 1, name: 'Akademik' },
    { id: 2, name: 'IT' },
    { id: 3, name: 'SPP' },
    { id: 4, name: 'Fasilitas' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]); // Simpan raw file untuk FormData
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ticketData.title && ticketData.description) {
      setIsSubmitting(true);
      try {
        const catObj = topicCategories.find(c => c.name === ticketData.topic);
        const categoryId = catObj ? catObj.id : 1; // Default ke 1 jika tidak ada
        
        const response = await fetchWithAuth('/api/tickets/', {
          method: 'POST',
          body: JSON.stringify({
            title: ticketData.title,
            description: ticketData.description,
            category_id: categoryId,
            priority: 'MEDIUM'
          })
        });

        if (response.ok) {
          const data = await response.json();
          const ticketId = data.ticket_id;
          
          if (attachment) {
            const formData = new FormData();
            formData.append('file', attachment);
            
            await fetchWithAuth(`/api/tickets/${ticketId}/attachments`, {
              method: 'POST',
              body: formData
            });
          }
          
          navigate(`/tickets/${ticketId}`);
        } else {
          const errData = await response.json();
          let errorMsg = 'Terjadi kesalahan';
          if (errData.detail) {
            errorMsg = typeof errData.detail === 'string' 
              ? errData.detail 
              : JSON.stringify(errData.detail);
          }
          alert(`Gagal membuat tiket: ${errorMsg}`);
        }
      } catch (error) {
        console.error("Error submitting ticket:", error);
        alert("Koneksi gagal. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Mohon lengkapi Judul dan Deskripsi permasalahan");      
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
                  <option value="">Pilih topik permasalahan</option>
                  {topicCategories.map((cat) => (
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
              <label className="border-2 border-dashed border-gray-200 rounded-[2rem] p-16 flex flex-col items-center justify-center bg-[#f8fafc] hover:bg-gray-50 transition-colors cursor-pointer group relative">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,.png,.jpg,.jpeg" />
                <HiOutlineCloudUpload className="text-4xl text-gray-300 group-hover:text-[#0040A1] transition-colors mb-4" />
                {attachment ? (
                  <p className="text-sm font-bold text-[#0040A1] font-public">{attachment.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-500 font-public">Klik atau seret file ke sini</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-public">PDF, DOCX, PNG atau JPG (max 10MB)</p>
                  </>
                )}
              </label>
            </div>

            {/* Footer Form */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-50 gap-6">
              <div className="flex items-center gap-2 text-gray-300">
                <HiOutlineShieldCheck className="text-xl" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">End-to-end secure processing</span>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full md:w-auto bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white px-14 py-4 rounded-2xl font-bold text-sm font-manrope uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50">
                {isSubmitting ? 'Memproses...' : 'Buat Tiket'}
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