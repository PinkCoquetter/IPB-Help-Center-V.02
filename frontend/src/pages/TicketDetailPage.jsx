import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { HiOutlineCloudUpload, HiChatAlt2, HiOutlineArrowNarrowLeft } from 'react-icons/hi';

const TicketDetailPage = ({ isLoggedIn, onLogout, tickets }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mencari data tiket dari state global berdasarkan ID di URL
  const ticket = tickets.find(t => t.id === id);

  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (ticket) {
      setMessages([
        {
          id: 1,
          sender: "STUDENT USER",
          role: 'student',
          text: ticket.desc,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: ticket.date
        }
      ]);
    }
  }, [ticket]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
const now = new Date();
  const timeNow = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: Date.now(),
      sender: "STUDENT USER",
      role: 'student',
      text: replyText,
      time: timeNow,
      date: "Today"
    };

    setMessages([...messages, newMessage]);
    setReplyText(''); 
    showNotification('success','Balasan berhasil dikirim.');
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
              <div className="border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-[#f8fafc] hover:bg-gray-50 transition-colors cursor-pointer group">
                <HiOutlineCloudUpload className="text-3xl text-gray-300 group-hover:text-[#0040A1] mb-2" />
                <p className="text-xs font-bold text-gray-500 font-public tracking-tight">Tambah file pendukung balasan</p>
              </div>
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