import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <span className="font-bold text-xl text-gray-900">IPB Help Center</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition-colors">Home</Link>
            <Link to="/faqs" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition-colors">FAQ</Link>
            <Link to="/login" className="ml-2 bg-primary-600 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;