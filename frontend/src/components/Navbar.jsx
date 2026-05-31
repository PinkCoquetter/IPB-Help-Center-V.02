import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiSearch, HiLogout, HiX, HiUser } from 'react-icons/hi';
import Logoprofile from '../assets/logoprofile.png';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', path: '/dashboard' },
    { name: 'Buat Tiket Baru', path: '/tickets/new' },
    { name: 'Tiket Saya', path: '/tickets' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm font-manrope">
      <div className="h-[px] w-full bg-gradient-to-r from-[#0040A1] to-[#0056D2]"></div>
      <div className="max-w-[1440px] mx-auto flex items-center px-10 py-3 relative">
        <div className="w-[200px] shrink-0">
          <Link to="/dashboard" className="text-[#0040A1] font-bold text-2xl tracking-tighter">IPB OneHelp</Link>
        </div>

        {!isSearchOpen ? (
          <div className="flex-grow flex justify-center space-x-10">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`relative py-2 text-[13px] transition-all ${location.pathname === link.path ? 'text-[#0040A1] font-[800]' : 'text-gray-400 font-medium'}`}>
                {link.name}
                {location.pathname === link.path && <span className="absolute bottom-[-14px] left-0 w-full h-[2.5px] bg-[#0040A1] rounded-full"></span>}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-grow flex justify-center px-10">
            <div className="relative w-full max-w-xl">
              <input autoFocus type="text" placeholder="Cari bantuan..." className="w-full bg-gray-50 border border-gray-100 py-2 pl-4 pr-10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0040A1]/20" />
              <HiX className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}

        <div className="w-[200px] flex items-center justify-end space-x-6">
          <button className="text-gray-400" onClick={() => setIsSearchOpen(!isSearchOpen)}><HiSearch size={22} /></button>
          {!isLoggedIn ? (
            <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white px-7 py-2 rounded-lg text-[13px] font-regular shadow-md">Sign In</button>
          ) : (
           <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="group relative flex items-center justify-center w-10 h-10 transition-transform active:scale-90"
            >
              {/* 1. Lingkaran Putih Luar + Shadow (Biar kelihatan "timbul") */}
              <div className="absolute inset-0 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-gray-50 group-hover:shadow-md transition-all"></div>
              
              {/* 2. Lingkaran Biru Dalam */}
              <div className="relative w-7 h-7 bg-[#0040A1] rounded-full flex items-center justify-center shadow-inner">
                {/* 3. Ikon User Putih Bawaan (Tajam & Presisi) */}
                <HiUser className="text-white text-lg" />
              </div>
            </button>
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border py-2 z-50 overflow-hidden">
                  <button onClick={() => { onLogout(); navigate('/dashboard'); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 font-bold hover:bg-red-50"><HiLogout size={18} /> Logout</button>
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