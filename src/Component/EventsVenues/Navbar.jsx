import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, LogIn, UserPlus } from 'lucide-react';

const EventsVenuesNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logIn } = useSelector((store) => store.auth);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WA</span>
              </div>
              <span className="font-bold text-xl text-gray-900">WorldwideAdverts</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/register"
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default EventsVenuesNavbar;
