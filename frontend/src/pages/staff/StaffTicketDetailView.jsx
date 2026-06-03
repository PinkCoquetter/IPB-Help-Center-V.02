import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, FileText, Upload, Save, ShieldCheck, 
  CheckCircle, Loader2, Paperclip, Trash2, 
  AlertTriangle, AlertCircle, MessageSquare 
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export const StaffTicketDetailView = ({ ticket, onBack, updateTicket }) => {
  // --- STATE ---
  const [statusValue, setStatusValue] = useState(ticket.status);
  const [staffValue, setStaffValue] = useState(ticket.assignedStaff || 'Tsabitta');
  const [replyContent, setReplyContent] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'init',
    sender: ticket.studentName || "Mahasiswa", // Mengambil dari data tiket
      role: 'student',
      text: ticket.desc,
      time: "09:15",
      date: ticket.date,
      attachments: [] // Pesan awal bisa punya lampiran
    }
  ]);

  // State khusus file
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [notification, setNotification] = useState(null);
  // unused state removed

  // --- LOGIC NOTIFIKASI ---
  const showNotification = (type, message) => {
    setNotification({ id: Date.now(), type, message });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // --- LOGIC FILE UPLOAD ---
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

  // --- HANDLERS ---
  const handleSaveStatus = () => {
    setIsSavingStatus(true);
    setTimeout(() => {
      updateTicket(ticket.id, { status: statusValue, assignedStaff: staffValue });
      showNotification('success', 'Berhasil memperbarui status tiket.');
      setIsSavingStatus(false);
    }, 500);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (statusValue === 'RESOLVED') {
      showNotification('error', 'Tiket sudah ditutup!');
      return;
    }
    if (!replyContent.trim() && uploadedFiles.length === 0) return;

    setIsSendingReply(true);
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        sender: staffValue + " (Staf)",
        role: 'staff',
        text: replyContent,
        attachments: [...uploadedFiles], // Masukkan file ke dalam pesan
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Hari ini"
      };

      setMessages(prev => [...prev, newMessage]);
      setReplyContent('');
      setUploadedFiles([]); // Kosongkan list file setelah kirim
      showNotification('success', 'Balasan dikirim!');
      setIsSendingReply(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-manrope">
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -100, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -100, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[9999] flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white shadow-2xl border min-w-[400px] justify-center ${
              notification.type === 'success' ? 'bg-[#00A36C]' : 'bg-[#E74C3C]'
            }`}
          >
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto px-10 pt-16 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-[#0040A1] font-bold text-[10px] uppercase mb-8 transition-all">
          <ArrowLeft size={16} /> Kembali ke Antrian
        </button>

        <div className="grid grid-cols-12 gap-10 items-start">
          <div className="col-span-8 space-y-8">
            
            {/* --- LIST CHAT BUBBLE --- */}
            <div className="space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`bg-white p-10 rounded-[2.5rem] border shadow-sm ${msg.role === 'staff' ? 'border-blue-100 bg-blue-50/10' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{msg.role === 'staff' ? 'Tanggapan Staf' : 'Deskripsi Mahasiswa'}</span>
                    <span className="text-sm font-extrabold text-gray-900">{msg.sender}</span>
                  </div>
                  
                  <div className={`${msg.role === 'staff' ? 'bg-white' : 'bg-[#F8FAFC]'} p-8 rounded-[1.5rem] mb-6`}>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed italic">"{msg.text}"</p>
                  </div>

                  {/* Tampilan Lampiran di dalam Bubble */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6 border-t border-gray-100 pt-6">
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
                  <div className="text-right mt-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest">{msg.date}, {msg.time}</div>
                </div>
              ))}
            </div>

            {/* --- FORM BALASAN DENGAN UPLOAD --- */}
            <form onSubmit={handleSendReply} className="bg-white p-12 rounded-[3.5rem] shadow-xl border-t-[10px] border-[#0040A1] space-y-8">
              <div className="flex items-center gap-3 text-[#0040A1]">
                <MessageSquare size={22} />
                <span className="text-[12px] font-black uppercase tracking-widest">Kirim Tanggapan</span>
              </div>

              <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} disabled={statusValue === 'RESOLVED'}
                placeholder="Ketik rincian tanggapan di sini..." className="w-full rounded-[2rem] border-none bg-[#F8FAFC] p-8 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0040A1] min-h-[150px]"
              />

              {/* Upload Box */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Dokumen Pendukung (Opsional)</p>
                <div 
                  onClick={() => !isSendingReply && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                  className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isDragging ? 'border-[#0040A1] bg-blue-50' : 'border-gray-200 bg-[#F8FAFC] hover:bg-gray-50'
                  }`}
                >
                  <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                  <Upload className={`mb-3 ${isDragging ? 'text-[#0040A1]' : 'text-gray-300'}`} size={32} />
                  <p className="text-xs font-bold text-gray-400">Klik atau seret dokumen ke sini</p>
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

              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-300">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase">Secure Channel</span>
                </div>
                <button type="submit" disabled={isSendingReply || statusValue === 'RESOLVED'}
                  className="bg-[#0040A1] text-white px-12 py-4 rounded-2xl font-black text-[12px] uppercase shadow-xl hover:bg-blue-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSendingReply ? 'Mengirim...' : 'Kirim Balasan'}
                </button>
              </div>
            </form>
          </div>

          {/* --- SIDEBAR KANAN --- */}
          <div className="col-span-4 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-left mb-10">
              Data Pribadi Mahasiswa
            </p>
            
            {/* Avatar Bulat: Inisial diambil otomatis dari huruf pertama nama */}
            <div className="w-24 h-24 bg-[#006071] text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-lg shadow-teal-900/10 uppercase">
              {ticket.studentName ? ticket.studentName.charAt(0) : 'U'}
            </div>

            {/* Nama Mahasiswa: Diambil dari data tiket */}
            <h4 className="text-xl font-black text-gray-900 mb-1 font-manrope">
              {ticket.studentName || 'Unknown Student'}
            </h4>

            {/* NIM: Diambil dari data tiket */}
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] font-public">
              NIM: {ticket.nim || 'N/A'}
            </p>
          </div>


            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Kelola Tiket (Staf)</p>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase mb-3 block tracking-widest">Update Status</label>
                  <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)} className="w-full p-5 bg-[#F8FAFC] rounded-2xl font-bold text-sm outline-none border border-gray-100">
                    <option value="OPEN">Baru Masuk (OPEN)</option>
                    <option value="IN PROGRESS">Sedang Diproses (IN PROGRESS)</option>
                    <option value="RESOLVED">Selesai (RESOLVED)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-300 uppercase mb-3 block tracking-widest">Assign Staff</label>
                  <input type="text" value={staffValue} onChange={(e) => setStaffValue(e.target.value)} className="w-full p-5 bg-[#F8FAFC] rounded-2xl font-bold text-sm outline-none border border-gray-100" />
                </div>
                <button onClick={handleSaveStatus} disabled={isSavingStatus} className="w-full bg-[#0040A1] text-white py-5 rounded-2xl font-black text-[12px] uppercase flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-lg">
                  {isSavingStatus ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={20} />} Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};