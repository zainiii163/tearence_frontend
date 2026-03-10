import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Menu, 
  X, 
  Search, 
  Globe, 
  User, 
  LogIn, 
  UserPlus,
  ChevronDown,
  Megaphone
} from 'lucide-react';

const BannerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logIn, token, userDetail } = useSelector((store) => store.auth);
  
  // Check if user is authenticated
  const isAuthenticated = logIn === true || token;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Banner Adverts', href: '/banner-adverts' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Megaphone className="w-8 h-8 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WorldwideAdverts
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${
                  item.name === 'Banner Adverts' ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/banner-adverts?postForm=true')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
                >
                  Post Banner Advert
                </button>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {userDetail?.name || userDetail?.email || 'User'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                item.name === 'Banner Adverts' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate('/banner-adverts?postForm=true');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mb-3"
                >
                  Post Banner Advert
                </button>
                <div className="flex items-center justify-center space-x-2 text-gray-700 px-3 py-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {userDetail?.name || userDetail?.email || 'User'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/banner-adverts?postForm=true');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mb-3"
                >
                  Post Banner Advert
                </button>
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BannerNavbar;
