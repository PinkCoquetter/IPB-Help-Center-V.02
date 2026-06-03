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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Data Tiket Global (Akan reset jika refresh)
  const [tickets, setTickets] = useState([
    { id: 'TKT-9420', status: 'OPEN', title: 'Pembayaran UKT Gagal', desc: 'Pembayaran UKT tidak bisa dilakukan, saya tidak tahu alasannya apa', date: 'Oct 12, 2024' },
    { id: 'TKT-8851', status: 'IN PROGRESS', title: 'Pelanggaran Tata Tertib PKU', desc: 'Mahasiswa melakukan pelanggaran di kawasan PKU', date: 'Oct 09, 2024' },
    { id: 'TKT-7704', status: 'RESOLVED', title: 'KTM Tidak Bisa Digunakan', desc: 'Saat mau masuk kawasan kampus, KTM tidak dapat discan.', date: 'Oct 05, 2024' }
  ]);

  const addTicket = (newTicket) => {
    // Data tiket baru sudah diurus di dalam SubmitRequestPage
    setTickets([newTicket, ...tickets]);
  };
  const updateTicket = (id, updatedData) => {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    };
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

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
          isLoggedIn ? <TicketDetailPage isLoggedIn={isLoggedIn} onLogout={handleLogout} tickets={tickets} /> : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;