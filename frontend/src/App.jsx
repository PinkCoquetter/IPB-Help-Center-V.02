import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import MyTicketsPage from './pages/MyTicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import StaffPortalPage from './pages/staff/StaffPortalPage'; 


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  // Data Tiket Global (Sinkronisasi antar tab menggunakan localStorage)
  const defaultTickets = [
    { 
      id: 'TKT-9420', status: 'OPEN', title: 'Pembayaran UKT Gagal', desc: 'Pembayaran UKT tidak bisa dilakukan, saya tidak tahu alasannya apa', date: 'Oct 12, 2024',
      messages: [
        { id: 1, sender: 'STUDENT USER', role: 'student', text: 'Pembayaran UKT tidak bisa dilakukan, saya tidak tahu alasannya apa', time: '09:15', date: 'Oct 12, 2024' }
      ]
    },
    { 
      id: 'TKT-8851', status: 'IN PROGRESS', title: 'Pelanggaran Tata Tertib PKU', desc: 'Mahasiswa melakukan pelanggaran di kawasan PKU', date: 'Oct 09, 2024',
      messages: [
        { id: 1, sender: 'STUDENT USER', role: 'student', text: 'Mahasiswa melakukan pelanggaran di kawasan PKU', time: '10:30', date: 'Oct 09, 2024' }
      ]
    },
    { 
      id: 'TKT-7704', status: 'RESOLVED', title: 'KTM Tidak Bisa Digunakan', desc: 'Saat mau masuk kawasan kampus, KTM tidak dapat discan.', date: 'Oct 05, 2024',
      messages: [
        { id: 1, sender: 'STUDENT USER', role: 'student', text: 'Saat mau masuk kawasan kampus, KTM tidak dapat discan.', time: '14:20', date: 'Oct 05, 2024' }
      ]
    }
  ];

  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('global_tickets');
    if (savedTickets) {
      try {
        return JSON.parse(savedTickets);
      } catch (e) {
        console.error("Failed to parse tickets from localStorage", e);
      }
    }
    return defaultTickets;
  });

  // Simpan ke localStorage setiap kali ada perubahan pada tickets
  React.useEffect(() => {
    try {
      localStorage.setItem('global_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error("Failed to save tickets to localStorage:", e);
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        alert("Gagal menyimpan: Ukuran file lampiran terlalu besar! Batas memori browser penuh. Mohon hapus tiket ini dan buat ulang dengan ukuran file yang lebih kecil.");
      }
    }
  }, [tickets]);

  // Sinkronisasi perubahan antar tab (real-time chat di browser yg sama)
  React.useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'global_tickets' && e.newValue) {
        setTickets(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addTicket = (newTicket) => {
    const now = new Date();
    const timeNow = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateNow = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // Beri pesan pertama (deskripsi) ke tiket baru
    const ticketWithMessages = {
      ...newTicket,
      date: dateNow, // Override hardcoded date from SubmitRequestPage if any
      messages: [
        { 
          id: 1, 
          sender: 'STUDENT USER', 
          role: 'student', 
          text: newTicket.desc, 
          time: timeNow, 
          date: dateNow,
          attachments: newTicket.attachments || [] 
        }
      ]
    };
    setTickets(prevTickets => [ticketWithMessages, ...prevTickets]);
  };
  const updateTicket = (id, updatedData) => {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    };
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<DashboardPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
       
       
        {/* --- ROUTES STAFF (Tambahkan ini) --- */}
         <Route 
          path="/staff/*" 
          element={<StaffPortalPage tickets={tickets} updateTicket={updateTicket} />} 
        />



        {/* HALAMAN BUAT TIKET */}
        <Route path="/tickets/new" element={
          isLoggedIn ? <SubmitRequestPage isLoggedIn={isLoggedIn} onLogout={handleLogout} addTicket={addTicket} /> : <Navigate to="/login" />
        } />

        {/* HALAMAN HISTORY (LIST) */}
        <Route path="/tickets" element={
          isLoggedIn ? <MyTicketsPage isLoggedIn={isLoggedIn} onLogout={handleLogout} tickets={tickets} /> : <Navigate to="/login" />
        } />

        {/* HALAMAN CHAT (DETAIL) - Pastikan ini mengarah ke TicketDetailPage */}
        <Route path="/tickets/:id" element={
          isLoggedIn ? <TicketDetailPage isLoggedIn={isLoggedIn} onLogout={handleLogout} tickets={tickets} updateTicket={updateTicket} /> : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;