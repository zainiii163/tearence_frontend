import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiChevronDown, FiSearch, FiUser, FiShoppingBag, 
  FiHome, FiTrendingUp, FiStar, FiDollarSign, FiMapPin, FiMonitor,
  FiActivity, FiTool, FiMusic, FiCamera, FiHeart, FiPackage, FiPlus
} from 'react-icons/fi';
import { FaCar, FaHome, FaBook, FaTshirt } from 'react-icons/fa';

const BuySellNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainCategories = [
    { name: 'Vehicles', icon: <FaCar className="h-4 w-4" />, href: '/vehicles' },
    { name: 'Property', icon: <FaHome className="h-4 w-4" />, href: '/property' },
    { name: 'Electronics', icon: <FiMonitor className="h-4 w-4" />, href: '/buy-sell?category=electronics' },
    { name: 'Fashion', icon: <FaTshirt className="h-4 w-4" />, href: '/buy-sell?category=fashion' },
    { name: 'Books', icon: <FaBook className="h-4 w-4" />, href: '/books' },
    { name: 'Gaming', icon: <FiActivity className="h-4 w-4" />, href: '/buy-sell?category=gaming' },
    { name: 'Sports', icon: <FiTrendingUp className="h-4 w-4" />, href: '/buy-sell?category=sports' },
    { name: 'Baby & Kids', icon: <FiUser className="h-4 w-4" />, href: '/buy-sell?category=baby' },
    { name: 'Home & Garden', icon: <FiHome className="h-4 w-4" />, href: '/buy-sell?category=home-garden' },
    { name: 'Tools', icon: <FiTool className="h-4 w-4" />, href: '/buy-sell?category=tools' },
    { name: 'Music', icon: <FiMusic className="h-4 w-4" />, href: '/buy-sell?category=music' },
    { name: 'Cameras', icon: <FiCamera className="h-4 w-4" />, href: '/buy-sell?category=cameras' },
    { name: 'Pets', icon: <FiHeart className="h-4 w-4" />, href: '/buy-sell?category=pets' },
    { name: 'Other Items', icon: <FiPackage className="h-4 w-4" />, href: '/buy-sell?category=other' }
  ];

  const premiumSections = [
    { name: 'Promoted Listings', href: '/promoted', badge: 'HOT' },
    { name: 'Featured Items', href: '/featured', badge: 'NEW' },
    { name: 'Sponsored Posts', href: '/sponsored', badge: 'PRO' },
    { name: 'Affiliates Hub', href: '/affiliates', badge: 'EARN' },
    { name: 'Funding Hub', href: '/funding', badge: 'FUND' },
    { name: 'Property Hub', href: '/property', badge: 'REAL' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FiShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  <span>Categories</span>
                  <FiChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 p-4">
                        {mainCategories.map((category, index) => (
                          <Link
                            key={index}
                            to={category.href}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            <div className="flex-shrink-0 text-green-600 group-hover:text-green-700">
                              {category.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                              {category.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Premium Sections */}
              <div className="flex items-center space-x-6">
                {premiumSections.map((section, index) => (
                  <Link
                    key={index}
                    to={section.href}
                    className="relative text-gray-700 hover:text-green-600 transition-colors font-medium text-sm"
                  >
                    {section.name}
                    {section.badge && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                        {section.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/buy-sell?postForm=true')}
                className="hidden md:flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus className="h-4 w-4" />
                <span className="font-medium">Post Item</span>
              </button>

              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                <FiUser className="h-4 w-4" />
                <span className="hidden lg:block">Login</span>
              </Link>

              <Link
                to="/register"
                className="hidden lg:flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="font-medium">Register</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-green-600 transition-colors"
              >
                {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-4">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FiShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile Post Item Button */}
                <button
                  onClick={() => {
                    navigate('/buy-sell?postForm=true');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors mb-6"
                >
                  <FiPlus className="h-4 w-4" />
                  <span className="font-medium">Post Item</span>
                </button>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
                  <div className="space-y-1">
                    {mainCategories.map((category, index) => (
                      <Link
                        key={index}
                        to={category.href}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex-shrink-0 text-green-600">
                          {category.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Premium Sections */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Premium</h3>
                  <div className="space-y-1">
                    {premiumSections.map((section, index) => (
                      <Link
                        key={index}
                        to={section.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {section.name}
                        </span>
                        {section.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {section.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Auth Links */}
                <div className="border-t pt-6">
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="h-4 w-4" />
                      <span className="font-medium">Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-medium">Register</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default BuySellNavbar;
