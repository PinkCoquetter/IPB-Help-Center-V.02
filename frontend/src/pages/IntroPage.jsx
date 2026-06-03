import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setStep(2), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex items-center justify-center relative overflow-hidden font-manrope px-6">
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#B2C5FF] rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#D6E3FF] rounded-full blur-[120px] opacity-60"></div>

      <div className="relative z-10 text-center w-full max-w-5xl">
        <h2 className={`text-[50px] md:text-[80px] font-[800] tracking-[-2px] leading-[1.2] md:leading-[90px] mb-12 flowing-gradient ${step === 1 ? 'animate-pulse' : ''}`}>
          {step === 1 ? "IPB OneHelp" : "Reliable Support for Your Academic Journey"}
        </h2>
        {step === 2 && (
          <button onClick={() => navigate('/dashboard')} className="px-12 py-4 rounded-xl font-bold text-white transition-all shadow-xl hover:scale-105 bg-gradient-to-r from-[#0040A1] to-[#0056D2]">
            Mulai
          </button>
        )}
      </div>

      <style jsx>{`
        .flowing-gradient {
          background: linear-gradient(to right, #0040A1 0%, #237AF7 25%, #0040A1 50%, #237AF7 75%, #0040A1 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: flow 4s linear infinite;
        }
        @keyframes flow { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
      `}</style>
    </div>
  );
};

export default IntroPage;