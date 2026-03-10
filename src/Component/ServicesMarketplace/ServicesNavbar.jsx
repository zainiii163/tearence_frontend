import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, Home, ArrowLeft } from 'lucide-react';

const ServicesNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Auth Buttons */}
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm font-medium">Register</span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-64' : 'max-h-0'
        }`}>
          <div className="px-4 py-2 space-y-1 bg-white border-t border-gray-100">
            {/* Mobile Back Button */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate(-1);
              }}
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors w-full"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                <span className="font-medium">Register</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default ServicesNavbar;
