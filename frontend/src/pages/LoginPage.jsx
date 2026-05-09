import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed, HiAtSymbol } from 'react-icons/hi';
import LogoIPB from '../assets/logoipb.png';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            navigate('/dashboard');
        } else {
            alert("Please fill in all fields");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f0f4f8] font-manrope">
            {/* NAVBAR */}
            <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 shadow-md sticky top-0 z-50">
                <div className="flex items-center space-x-10">
                    <h1 className="text-[#0040A1] font-bold text-2xl tracking-tight">Help Center</h1>
                    <div className="hidden md:flex space-x-8 text-gray-400 text-sm font-regular">
                        <a href="#" className="hover:text-blue-700">Dashboard</a>
                        <a href="#" className="hover:text-blue-700">Submit Request</a>
                        <a href="#" className="hover:text-blue-700">My Tickets</a>
                    </div>
                </div>
                <button className="bg-[#004aad] text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-200">
                    Sign In
                </button>
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