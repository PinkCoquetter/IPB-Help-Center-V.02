import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Selamat Datang di <span className="text-primary-600">IPB Help Center</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        Layanan terpadu satu pintu untuk seluruh keluhan, pertanyaan, dan bantuan sivitas akademika IPB.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
          Buat Tiket Bantuan
        </Link>
        <Link to="/faqs" className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition shadow-sm">
          Lihat FAQ
        </Link>
      </div>
    </div>
  );
};

export default Home;
