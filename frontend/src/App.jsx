import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import semua halaman yang sudah dibuat
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import MyTicketsPage from './pages/MyTicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman pertama yang muncul adalah Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Halaman lainnya */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tickets/new" element={<SubmitRequestPage />} />
        <Route path="/tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />

        {/* Jika user nyasar ke url ngasal, lempar ke login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;