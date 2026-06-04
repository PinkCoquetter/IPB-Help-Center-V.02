import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { StaffDashboardView } from './StaffDashboardView';
import { StaffTicketDetailView } from './StaffTicketDetailView';
import { StaffLoginView } from './StaffLoginView';

const StaffPortalPage = () => {
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(() => {
    return localStorage.getItem('isStaffLoggedIn') === 'true';
  });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTickets = async (isPolling = false) => {
    if (!isStaffLoggedIn) return;
    if (!isPolling) setLoading(true);
    try {
      const { fetchWithAuth } = await import('../../config/api');
      const response = await fetchWithAuth('/api/tickets/');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  React.useEffect(() => {
    loadTickets();
    const intervalId = setInterval(() => {
      loadTickets(true);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [isStaffLoggedIn]);

  React.useEffect(() => {
    if (isStaffLoggedIn) {
      localStorage.setItem('isStaffLoggedIn', 'true');
    } else {
      localStorage.removeItem('isStaffLoggedIn');
    }
  }, [isStaffLoggedIn]);

  React.useEffect(() => {
    // We no longer persist selectedTicketId to prevent direct navigation to detail on login
  }, [selectedTicketId]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId || t.ticket_number === selectedTicketId);

  const handleLogout = () => {
    setIsStaffLoggedIn(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  };

  return (
    <div className="min-h-screen bg-[#F1F4F9] font-sans selection:bg-blue-100 selection:text-[#0040A1]">
      <AnimatePresence mode="wait">
        {!isStaffLoggedIn ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StaffLoginView onLoginSuccess={() => setIsStaffLoggedIn(true)} />
          </motion.div>
        ) : selectedTicketId ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StaffTicketDetailView 
              ticketId={selectedTicketId} 
              onBack={() => {
                setSelectedTicketId(null);
                loadTickets();
              }}
            />
          </motion.div>
        ) : (
          <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <StaffDashboardView 
              tickets={tickets} 
              onSelectTicket={(id) => setSelectedTicketId(id)} 
              onLogout={handleLogout}
              onRefresh={loadTickets}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffPortalPage;