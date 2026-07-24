import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Home, Grid, Plus, LogIn, UserPlus, ChevronDown, Search, Globe } from 'lucide-react';

const VehicleNavbar = ({ showPostForm, setShowPostForm }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Vehicles', href: '/vehicles', icon: Grid, current: true },
    { name: 'Categories', href: '/categories', icon: Globe },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="page-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  item.current
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="py-1">
                    <a href="/vehicles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Vehicles</a>
                    <a href="/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Properties</a>
                    <a href="/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Services</a>
                    <a href="/banner-adverts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Banner Adverts</a>
                    <a href="/books" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Books</a>
                    <a href="/events-venues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Events & Venues</a>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setShowPostForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post Vehicle Advert</span>
            </button>
            <a
              href="/login"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </a>
            <a
              href="/register"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    item.current
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => setShowPostForm(true)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Vehicle Advert</span>
                </button>
                <div className="mt-3 space-y-1">
                  <a
                    href="/login"
                    className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </a>
                  <a
                    href="/register"
                    className="block bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default VehicleNavbar;
