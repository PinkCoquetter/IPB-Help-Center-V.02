import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed, HiAtSymbol, HiOutlineExclamation, HiOutlineCheckCircle } from 'react-icons/hi'; 
import LogoIPB from '../assets/logoipb.png';

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
};

    const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset pesan setiap kali tombol ditekan
    setMessage({ type: '', text: '' });

    if (formData.username === 'student@apps.ipb.ac.id' && formData.password === '12345678') {
        // 1. Set pesan sukses
        setMessage({ type: 'success', text: 'Login successful!' });

        // 2. Gunakan setTimeout agar user bisa membaca pesan sukses dulu
        setTimeout(() => {
            onLogin(); // Ubah status di App.jsx menjadi logged in
            navigate('/dashboard'); // Pindah ke dashboard
        }, 1500); // Tunggu 1.5 detik

    } else {
        // Jika Gagal
        setMessage({ type: 'error', text: 'Invalid username or password.' });
        // Kosongkan field password saja
        setFormData(prev => ({ ...prev, password: '' }));
    }
};

    return (
        <div className="min-h-screen flex flex-col bg-[#f0f4f8] font-manrope">
            {/* NAVBAR */}
            <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 shadow-sm fixed w-full top-0 z-50">
                <div className="flex items-center">
                    <h1 className="text-[#0040A1] font-bold text-2xl tracking-tight italic">IPB OneHelp</h1>
                </div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Student Support Portal
                </div>
            </nav>



            {/* LOGIN CARD CONTAINER */}
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden bg-[#f8fafc]">

                {/* EFEK BULATAN BIRU (BLOB) DI BACKGROUND */}
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[600px] bg-[#B2C5FF] rounded-full blur-[250px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[700px] bg-[#B2C5FF] rounded-full blur-[350px] pointer-events-none"></div>

                {/* LOGIN CARD */}
                <div className="relative z-10 bg-white w-full max-w-md p-12 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,74,173,0.3)] border border-white/50">

                    {/* Logo & Title */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-24 h-24 bg-[#f8fafc] rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                            <img
                                src={LogoIPB}
                                alt="Logo IPB"
                                className="w-14 h-14 object-contain"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                    </div>


                {/* --- NOTIFIKASI / ALERT --- */}
                {message.text && (
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl mb-8 animate-in fade-in zoom-in duration-300 shadow-sm border border-gray-50 bg-white ${
                        message.type === 'error' ? 'text-red-500' : 'text-emerald-600'
                    }`}>
                        {message.type === 'error' ? (
                            <HiOutlineExclamation className="text-xl shrink-0" />
                        ) : (
                            <HiOutlineCheckCircle className="text-xl shrink-0" />
                        )}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                    {/*Form*/}
                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <HiAtSymbol className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="student@apps.ipb.ac.id"
                                    className="block w-full pl-12 pr-5 py-5 bg-[#f1f4f9] border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="block w-full pl-12 pr-5 py-5 bg-[#f1f4f9] border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#0055c3] text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all duration-200 mt-4"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-8 text-center bg-[#f0f4f8]">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                    © 2026 THE ACADEMIC SANCTUARY, IPB UNIVERSITY
                </p>
            </footer>
        </div>
    );
};

export default LoginPage;