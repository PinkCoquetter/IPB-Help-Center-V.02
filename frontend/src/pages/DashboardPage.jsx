import React from 'react';
import Navbar from '../components/Navbar';
import { HiSearch, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { RiComputerLine, RiMegaphoneLine, RiHandCoinLine, RiUserHeartLine } from 'react-icons/ri';
import ImageGraduate from '../assets/graduate.png';
import Imagecabel from '../assets/cabel.png';
import ImageHealth from '../assets/mentalhealth.jpg';

const DashboardPage = () => {
  const categories = [
    {
      title: 'IT Support',
      icon: <RiComputerLine />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      desc: 'Troubleshoot campus WiFi, reset password, or anything about IT support.',
      links: ['Reset Password', 'Connect to WiFi']
    },
    {
      title: 'Reports',
      icon: <RiMegaphoneLine />,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      desc: 'Report problems, safety issues, or violations on campus.',
      links: ['Pengaduan Melanggar Tata Tertib', 'Pengaduan Kekerasan Seksual']
    },
    {
      title: 'Financial Aid',
      icon: <RiHandCoinLine />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      desc: 'Information regarding scholarships, grants, and loans.',
      links: ['UKT Mahasiswa', 'Informasi Beasiswa']
    },
    {
      title: 'Student Life',
      icon: <RiUserHeartLine />,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      desc: 'Submit requests for student activities, wellness support, and campus facilities.',
      links: ['Surat Peminjaman Ruangan', 'Surat Izin Akademik']
    }
  ];

  const articles = [
    {
      tag: 'ACADEMIC',
      title: 'Everything About Graduation',
      desc: 'Learn what you need to prepare for graduation, including requirements, fees, and important arrangements.',
      img: ImageGraduate
    },
    {
      tag: 'IT MAINTENANCE',
      title: 'How to Connect to WiFi: Desktop and iOS',
      desc: 'Step-by-step guide to connecting desktop and iOS devices to the campus WiFi network.',
      img: Imagecabel
    },
    {
      tag: 'WELLNESS',
      title: 'New Mental Health Resources Available',
      desc: 'Students can now access unlimited therapy sessions through campus clinics.',
      img: ImageHealth
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-manrope">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-10 max-w-7xl mx-auto">
        <p className="text-[#0055c3] font-bold text-[10px] tracking-[0.2em] mb-4 uppercase">
          Student Support Portal
        </p>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-10 tracking-tight">
          How can we <span className="text-[#0055c3]">help you</span> today?
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-2xl mb-6">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for articles, guides, or topics..."
            className="block w-full pl-14 pr-32 py-5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm"
          />
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#0040A1] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors">
            Search
          </button>
        </div>

        {/* Popular Tags */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Popular:</span>
          {['Permission Letter', 'WiFi Setup', 'Tuition Fees'].map((tag) => (
            <button key={tag} className="px-4 py-1.5 bg-blue-50 text-[#0055c3] rounded-full text-[11px] font-bold hover:bg-blue-100 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="max-w-7xl mx-auto px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${cat.iconBg} ${cat.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{cat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {cat.desc}
              </p>
              <div className="space-y-3">
                {cat.links.map((link, idx) => (
                  <a key={idx} href="#" className="flex items-center gap-2 text-[#0055c3] text-xs font-bold hover:underline">
                    <HiOutlineArrowNarrowRight /> {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Articles Section */}
      <div className="max-w-7xl mx-auto px-10 pb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Recent Articles</h2>
          </div>
          <a href="#" className="flex items-center gap-2 text-[#0055c3] font-bold text-sm hover:underline">
            View all articles <HiOutlineArrowNarrowRight />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.concat(articles).map((art, i) => ( 
            <div key={i} className="group cursor-pointer">
              <div className="rounded-[2rem] overflow-hidden mb-6 aspect-[16/10] shadow-sm">
                <img 
                  src={art.img} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 font-bold text-[9px] tracking-widest rounded mb-4 uppercase">
                {art.tag}
              </span>
              <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 leading-tight">
                {art.title}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                {art.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          © 2026 THE ACADEMIC SANCTUARY, IPB UNIVERSITY
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;