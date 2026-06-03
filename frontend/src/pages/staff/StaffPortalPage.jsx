import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaffDashboardView } from './StaffDashboardView';
import { StaffTicketDetailView } from './StaffTicketDetailView';
import { StaffLoginView } from './StaffLoginView';

const StaffPortalPage = ({ tickets, updateTicket }) => {
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div className="min-h-screen bg-[#F1F4F9] font-sans selection:bg-blue-100 selection:text-[#0040A1]">
      <AnimatePresence mode="wait">
        {!isStaffLoggedIn ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StaffLoginView onLoginSuccess={() => setIsStaffLoggedIn(true)} />
          </motion.div>
        ) : selectedTicketId && activeTicket ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StaffTicketDetailView 
              ticket={activeTicket} 
              onBack={() => setSelectedTicketId(null)} 
              updateTicket={updateTicket}
            />
          </motion.div>
        ) : (
          <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <StaffDashboardView 
              tickets={tickets} 
              onSelectTicket={(id) => setSelectedTicketId(id)} 
              onLogout={() => setIsStaffLoggedIn(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffPortalPage;