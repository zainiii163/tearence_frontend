import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Globe, 
  Users, 
  Briefcase, 
  Star, 
  Plus,
  ChevronDown,
  User,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';

const AffiliateNavbar = ({ showMobileMenu, setShowMobileMenu, onPostClick }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const categories = [
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'Books & Literature', href: '/books' },
    { name: 'Resorts & Travel', href: '/travel' },
    { name: 'Buy & Sell', href: '/marketplace' },
    { name: 'Services', href: '/services' },
    { name: 'Events', href: '/events-venues' },
    { name: 'Jobs & Vacancies', href: '/jobs' },
    { name: 'Promoted Adverts', href: '/promoted' },
    { name: 'Sponsored Adverts', href: '/sponsored' },
    { name: 'Featured Adverts', href: '/featured' },
    { name: 'Affiliates Hub', href: '/affiliates', active: true }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  WorldwideAdverts
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                      className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl py-2 mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {categories.map((category, index) => (
                        <a
                          key={index}
                          href={category.href}
                          className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            category.active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {category.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="/affiliates" className="text-blue-600 font-medium">Affiliates Hub</a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={onPostClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Post</span>
              </button>
              
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Login</a>
              <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Register
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
            <motion.div
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="p-4">
                <a href="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</a>
                <div className="py-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href={category.href}
                      className={`block py-1 pl-4 text-sm ${
                        category.active ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <button
                    onClick={() => {
                      onPostClick();
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Post</span>
                  </button>
                  
                  <a href="/login" className="block py-2 text-center text-gray-700 hover:text-blue-600 mt-2">
                    Login
                  </a>
                  <a href="/register" className="block py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2">
                    Register
                  </a>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AffiliateNavbar;
