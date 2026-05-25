import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import MyTicketsPage from './pages/MyTicketsPage';

function App() {
  // Versi TESTING: Status login selalu mulai dari FALSE (Guest) setiap refresh
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fungsi untuk mengubah status menjadi login
  const handleLogin = () => {
    setIsLoggedIn(true);
    // Kita TIDAK menyimpan ke localStorage agar saat refresh otomatis logout
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* 1. Laman Intro (Muncul pertama kali) */}
        <Route path="/" element={<IntroPage />} />
        
        {/* 2. Laman Login 
            - Jika sudah login, dilempar ke dashboard.
            - Jika belum, tampilkan LoginPage.
        */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />
        
        {/* 3. Laman Dashboard 
            - Bisa diakses Guest maupun User Terdaftar.
            - Tampilan berubah otomatis via props isLoggedIn.
        */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          } 
        />

        {/* 4. Jalur Terproteksi (Hanya untuk yang sudah Login) 
            - Jika mencoba akses tanpa login, dilempar ke /login.
        */}
        <Route 
          path="/tickets/new" 
          element={
            isLoggedIn ? (
              <SubmitRequestPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/tickets" 
          element={
            isLoggedIn ? (
              <MyTicketsPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Jalur Cadangan: Jika user mengetik URL asal, arahkan ke dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;