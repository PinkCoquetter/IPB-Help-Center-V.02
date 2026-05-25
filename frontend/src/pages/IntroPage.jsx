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
    <div className="min-h-screen bg-[#F0F4F9] flex items-center justify-center relative overflow-hidden font-manrope">
      
      {/* --- BACKGROUND BLOBS (Sesuai Kode Warna B2C5FF & D6E3FF) --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#B2C5FF] rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#D6E3FF] rounded-full blur-[120px] opacity-60"></div>

      <div className="relative z-10 text-center px-4 w-full max-w-5xl">
        {step === 1 ? (
          /* STEP 1: SPLASH SCREEN LOGO */
          <h1 className="text-[80px] font-[800] tracking-[-5px] leading-[90px] animate-pulse bg-gradient-to-r from-[#0040A1] to-[#237AF7] bg-clip-text text-transparent">
            IPB OneHelp
          </h1>
        ) : (
          /* STEP 2: MOTIVATION PAGE */
          <div className="flex flex-col items-center">
            {/* TEXT DENGAN GRADASI BERGERAK (FLOWING GRADIENT) */}
            <h2 className="text-[50px] md:text-[80px] font-[800] tracking-[-2px] leading-[70px] md:leading-[90px] mb-12 select-none flowing-gradient">
              Reliable Support for Your <br /> Academic Journey
            </h2>

            {/* TOMBOL MULAI DENGAN GRADASI */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-12 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-xl hover:shadow-blue-300/50 hover:scale-105 active:scale-95 bg-gradient-to-r from-[#0040A1] to-[#237AF7]"
            >
              Mulai
            </button>
          </div>
        )}
      </div>

      {/* --- CUSTOM CSS UNTUK ANIMASI GRADASI BERGERAK --- */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@800&display=swap');

        .flowing-gradient {
          background: linear-gradient(
            to right, 
            #0040A1 0%, 
            #237AF7 25%, 
            #0040A1 50%, 
            #237AF7 75%, 
            #0040A1 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: flow 4s linear infinite;
        }

        @keyframes flow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .font-manrope {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default IntroPage;