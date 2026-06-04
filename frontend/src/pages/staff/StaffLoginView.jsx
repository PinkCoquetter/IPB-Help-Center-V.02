import React, { useState } from 'react';
import API_URL from '../../config/api';
import { HiOutlineLockClosed, HiAtSymbol, HiOutlineExclamation, HiOutlineCheckCircle, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import LogoIPB from '../../assets/logoipb.png';

export const StaffLoginView = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.username,
                    password: formData.password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Pastikan role staff atau admin
                if (data.user.role.toLowerCase() !== 'staff' && data.user.role.toLowerCase() !== 'admin') {
                    setMessage({ type: 'error', text: 'Access denied. Staff only.' });
                    return;
                }
                
                // Simpan token untuk fetch dengan auth
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user_data', JSON.stringify(data.user));

                setMessage({ type: 'success', text: 'Staff Authentication Success!' });
                
                setTimeout(() => {
                    onLoginSuccess();
                }, 1000);
            } else {
                setMessage({ type: 'error', text: data.detail || 'Invalid staff credentials.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection failed. Please try again later.' });
            console.error("Staff Login Error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-20">
            <div className="bg-white w-full max-w-md p-12 rounded-[2.5rem] shadow-xl border border-white/50">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 bg-[#EAEDF2] rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-white">
                        <img src={LogoIPB} alt="Logo" className="w-14 h-14 object-contain" />
                    </div>
                    <h2 className="text-4xl font-[800] text-gray-900 tracking-tight font-manrope">Staff Portal</h2>
                </div>

                {message.text && (
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl mb-8 border bg-white ${
                        message.type === 'error' ? 'text-red-500 border-red-50' : 'text-emerald-600 border-emerald-50'
                    }`}>
                        {message.type === 'error' ? <HiOutlineExclamation size={20}/> : <HiOutlineCheckCircle size={20}/>}
                        <span className="text-sm font-bold">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 font-public">Email Staff</label>
                        <div className="relative">
                            <HiAtSymbol className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                placeholder="staff@apps.ipb.ac.id" 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#0040A1] text-sm font-medium" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 font-public">Password</label>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#0040A1]"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? <HiOutlineEyeOff size={20}/> : <HiOutlineEye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white py-5 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all uppercase tracking-widest font-manrope">
                        Sign In to Portal
                    </button>
                </form>
            </div>
        </div>
    );
};