import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiSearch, HiUser } from 'react-icons/hi';

const Navbar = () => {
  const location = useLocation();

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Submit Request', path: '/tickets/new' }, 
  { name: 'My Tickets', path: '/tickets' },
];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm font-manrope">
      {/* Garis Biru Tipis di Paling Atas */}
      <div className="h-[3px] w-full bg-[#0055c3]"></div>

      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-10 py-3">
        
        {/* KIRI: Logo */}
        <div className="flex-1">
          <Link to="/dashboard" className="text-[#0040A1] font-bold text-xl tracking-tight">
            Help Center
          </Link>
        </div>

        {/* TENGAH: Navigasi */}
        <div className="flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm transition-all duration-200 ${
                  isActive 
                    ? 'text-[#0040A1] font-bold' 
                    : 'text-gray-400 font-medium hover:text-gray-600'
                }`}
              >
                {link.name}
                {/* Indikator Garis Bawah jika Active */}
                {isActive && (
                  <span className="absolute bottom-[4px] left-0 w-full h-[2px] bg-[#0040A1] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* KANAN: Search & Profile */}
        <div className="flex-1 flex items-center justify-end space-x-6">
          {/* Icon Search */}
          <button className="text-gray-400 hover:text-[#0040A1] transition-colors">
            <HiSearch size={20} />
          </button>

          {/* Tombol Profil Bulat */}
          <button className="w-9 h-9 bg-[#0040A1] text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-all shadow-md shadow-blue-100">
            <HiUser size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;