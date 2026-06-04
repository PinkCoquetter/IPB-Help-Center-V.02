import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { HiOutlineCloudUpload, HiChatAlt2, HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { FileText, Paperclip, Trash2 } from 'lucide-react';

const TicketDetailPage = ({ isLoggedIn, onLogout, tickets, updateTicket }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mencari data tiket dari state global berdasarkan ID di URL
  const ticket = tickets.find(t => t.id === id);

  // Gunakan pesan dari global state
  const messages = ticket?.messages || [];

  const [replyText, setReplyText] = useState('');
  
  // State khusus file
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const addFiles = (files) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() && uploadedFiles.length === 0) return;
    
    const now = new Date();
    const timeNow = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateNow = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newMessage = {
      id: Date.now(),
      sender: "STUDENT USER",
      role: 'student',
      text: replyText,
      attachments: [...uploadedFiles],
      time: timeNow,
      date: dateNow
    };

    updateTicket(ticket.id, { messages: [...messages, newMessage] });
    setReplyText('');  
    setUploadedFiles([]);
  };

  if (!ticket) return <div className="p-20 text-center font-manrope text-2xl font-bold">Ticket Not Found</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <main className="max-w-5xl mx-auto px-10 pt-32 pb-20">
        <button 
          onClick={() => navigate('/tickets')} 
          className="flex items-center gap-2 text-gray-400 hover:text-[#0040A1] font-bold text-sm mb-8 transition-colors uppercase tracking-widest font-manrope"
        >
          <HiOutlineArrowNarrowLeft /> Kembali
        </button>

        {/* HEADER TIKET */}
        <div className="mb-12">
          <h1 className="text-5xl font-[800] text-gray-900 mb-4 tracking-tighter font-manrope">{ticket.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black px-3 py-1 bg-[#0040A1] text-white rounded uppercase tracking-widest">{ticket.status}</span>
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.3em]">#{ticket.id}</span>
            <div className="flex-grow"></div>
            <div className="text-right">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Submitted on</p>
                <p className="text-sm font-bold text-gray-900">{ticket.date}</p>
            </div>
          </div>
        </div>

        {/* LIST PESAN / THREAD */}
        <div className="space-y-8 mb-16">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white p-8 md:p-10 rounded-[2.5rem] border shadow-sm ${msg.role === 'staff' ? 'bg-blue-50/20 border-blue-100 shadow-blue-900/5' : 'border-gray-50'}`}>
              <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${msg.role === 'staff' ? 'bg-[#0040A1] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {msg.sender.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight font-manrope">
                      {msg.role === 'staff' ? msg.sender : "JOHANNA D."} 
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-public">
                      {msg.role === 'staff' ? 'Support Team' : `STUDENT ID: ${ticket.nim}`} 
                    </p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-300 uppercase">{msg.date}, {msg.time}</p>
              </div>
              <p className={`text-sm font-medium leading-relaxed px-2 ${msg.role === 'staff' ? 'text-gray-800' : 'text-gray-500 italic'}`}>
                "{msg.text}"
              </p>
              {/* Tampilan Lampiran di dalam Bubble */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6 border-t border-gray-50 pt-6">
                  {msg.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 bg-blue-50 text-[#0040A1] rounded-xl flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-800 truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* REPLY BOX*/}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border-t-8 border-[#0040A1] relative">
          <div className="flex items-center gap-2 mb-8 text-[#0040A1]">
            <HiChatAlt2 size={24} />
            <span className="text-[11px] font-black uppercase tracking-widest italic font-manrope">Kirim Balasan / Reply Ticket</span>
          </div>

          <form onSubmit={handleSendReply} className="space-y-10">
            <textarea 
              rows="4" value={replyText} onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis tanggapan atau pertanyaan anda di sini..." 
              className="w-full px-8 py-6 bg-[#f8fafc] rounded-[2rem] border-none focus:ring-2 focus:ring-[#0040A1] outline-none text-sm font-medium transition-all resize-none"
            ></textarea>

            {/* ATTACHMENT DI BALASAN */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] ml-1 italic">Attachments (Optional)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                  isDragging ? 'border-[#0040A1] bg-blue-50' : 'border-gray-100 bg-[#f8fafc] hover:bg-gray-50'
                }`}
              >
                <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                <HiOutlineCloudUpload className={`text-3xl mb-2 ${isDragging ? 'text-[#0040A1]' : 'text-gray-300 group-hover:text-[#0040A1]'}`} />
                <p className="text-xs font-bold text-gray-500 font-public tracking-tight">Tambah file pendukung balasan</p>
              </div>

              {/* List File yang terpilih sebelum dikirim */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white border border-blue-100 p-3 pl-4 rounded-full shadow-sm">
                      <Paperclip size={14} className="text-[#0040A1]" />
                      <span className="text-xs font-bold text-gray-700">{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
              <button type="submit" className="bg-[#0040A1] text-white px-14 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all ml-auto font-manrope">
                Kirim
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TicketDetailPage;