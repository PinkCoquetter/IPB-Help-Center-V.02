import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineLockClosed, 
  HiAtSymbol, 
  HiOutlineExclamation, 
  HiOutlineCheckCircle, 
  HiOutlineEye, 
  HiOutlineEyeOff 
} from 'react-icons/hi'; 
import LogoIPB from '../assets/logoipb.png';

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.username === 'student@apps.ipb.ac.id' && formData.password === '12345678') {
            setMessage({ type: 'success', text: 'Login successful!' });
            setTimeout(() => {
                onLogin();
                navigate('/dashboard');
            }, 1500);
        } else {
            setMessage({ type: 'error', text: 'Invalid username or password.' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] font-manrope p-6">
            <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[600px] bg-[#B2C5FF] rounded-full blur-[250px] pointer-events-none"></div>
            <div className="bg-white w-full max-w-md p-12 rounded-[2.5rem] shadow-xl border border-white/50 z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 bg-[#EAEDF2] rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-white">
                        <img
                            src={LogoIPB}
                            alt="Logo IPB"
                            className="w-14 h-14 object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
                </div>

                {message.text && (
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl mb-8 shadow-sm border bg-white ${message.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                        {message.type === 'error' ? <HiOutlineExclamation size={20}/> : <HiOutlineCheckCircle size={20}/>}
                        <span className="text-sm font-bold">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-['Public_Sans'] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative group">
                            <HiAtSymbol className="absolute left-4 top-1/2 -translate-y-1/2  text-gray-400 group-focus-within:text-blue-600" size={20} />
                            <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 font-['Public_Sans'] transition-all text-sm" placeholder="student@apps.ipb.ac.id" />
                        </div>
                    </div>
                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-['Public_Sans'] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>

                            {/* Input Field - Type berubah dinamis */}
                            <input
                                type={showPassword ? "text" : "password"} // Logika ganti tipe
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="block w-full pl-12 pr-12 py-5 bg-[#f1f4f9] border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 font-['Public_Sans'] font-medium"
                            />

                            {/* Tombol Mata (Kanan) */}
                            <button
                                type="button" // Wajib type button agar tidak trigger submit form
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? (
                                    <HiOutlineEyeOff className="h-5 w-5" />
                                ) : (
                                    <HiOutlineEye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-[#0040A1] to-[#0056D2] text-white py-5 rounded-2xl font-black text-sm shadow-xl transition-all hover:-translate-y-1">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;