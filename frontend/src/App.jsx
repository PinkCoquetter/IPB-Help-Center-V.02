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

  const handleLogin = (userData, token) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    if (token) localStorage.setItem('access_token', token);
    if (userData) localStorage.setItem('user_data', JSON.stringify(userData));
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<DashboardPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
       
        {/* --- ROUTES STAFF --- */}
        <Route 
          path="/staff/*" 
          element={<StaffPortalPage />} 
        />

        {/* HALAMAN BUAT TIKET */}
        <Route path="/tickets/new" element={
          isLoggedIn ? <SubmitRequestPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />

        {/* HALAMAN HISTORY (LIST) */}
        <Route path="/tickets" element={
          isLoggedIn ? <MyTicketsPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />

        {/* HALAMAN CHAT (DETAIL) */}
        <Route path="/tickets/:id" element={
          isLoggedIn ? <TicketDetailPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;