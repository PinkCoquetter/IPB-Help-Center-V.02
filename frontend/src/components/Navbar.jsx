import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiSearch, HiLogout, HiX } from 'react-icons/hi';
import Logoprofile from '../assets/logoprofile.png';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State untuk pencarian

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Submit Request', path: '/tickets/new' },
    { name: 'My Tickets', path: '/tickets' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm font-manrope">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#0040A1] to-[#0056D2]"></div>

      <div className="max-w-[1440px] mx-auto flex items-center px-10 py-3 relative">
        
        {/* LOGO */}
        <div className="w-[200px] shrink-0">
          <Link to="/dashboard" className="text-[#0040A1] font-[800] text-2xl tracking-tighter italic">
            IPB OneHelp
          </Link>
        </div>

        {/* TENGAH: Navigasi (Hilang saat search terbuka) */}
        {!isSearchOpen ? (
          <div className="flex-grow flex justify-center space-x-10 animate-in fade-in duration-300">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-2 text-[13px] transition-all duration-200 ${
                    isActive ? 'text-[#0040A1] font-[800]' : 'text-gray-400 font-medium hover:text-gray-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-[-14px] left-0 w-full h-[2.5px] bg-[#0040A1] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          /* SEARCH BAR YANG BERFUNGSI */
          <div className="flex-grow flex justify-center px-10 animate-in slide-in-from-right-5 duration-300">
            <div className="relative w-full max-w-xl">
              <input 
                autoFocus
                type="text" 
                placeholder="Cari bantuan atau tiket..."
                className="w-full bg-gray-50 border border-gray-100 py-2 pl-4 pr-10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0040A1]/20"
              />
              <HiX 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500"
                onClick={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        )}

        {/* KANAN */}
        <div className="w-[200px] flex items-center justify-end space-x-6 shrink-0">
          <button 
            className={`transition-colors ${isSearchOpen ? 'text-[#0040A1]' : 'text-gray-400 hover:text-[#0040A1]'}`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <HiSearch size={22} />
          </button>

          {!isLoggedIn ? (
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white px-7 py-2 rounded-lg text-[13px] font-bold shadow-md hover:brightness-110 transition-all"
            >
              Sign In
            </button>
          ) : (
            /* FIX PROFILE LOGO (SESUAI GAMBAR) */
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="group relative flex items-center justify-center w-10 h-10"
              >
                {/* Lingkaran Putih & Shadow Luar */}
                <div className="absolute inset-0 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] border border-gray-50 group-hover:scale-105 transition-transform"></div>
                
                {/* Lingkaran Biru Dalam & Image */}
                <div className="relative w-7 h-7 bg-[#0040A1] rounded-full overflow-hidden flex items-center justify-center">
                  <img src={Logoprofile} alt="profile" className="w-full h-full object-cover" />
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-50 py-2 overflow-hidden z-50">
                  <button onClick={() => { onLogout(); navigate('/dashboard'); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 font-bold hover:bg-red-50">
                    <HiLogout size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;