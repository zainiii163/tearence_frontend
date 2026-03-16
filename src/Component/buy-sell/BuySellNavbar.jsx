import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiChevronDown, FiSearch, FiUser, FiShoppingBag, 
  FiHome, FiTrendingUp, FiStar, FiDollarSign, FiMapPin, FiMonitor,
  FiActivity, FiTool, FiMusic, FiCamera, FiHeart, FiPackage, FiPlus,
  FiGrid, FiList, FiBell, FiSettings
} from 'react-icons/fi';
import { FaCar, FaHome, FaBook, FaTshirt } from 'react-icons/fa';
import { buysellAPI } from '../../api/buysell';

const BuySellNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [trendingItems, setTrendingItems] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMobileSection, setActiveMobileSection] = useState('categories');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch trending items and recently viewed
    const fetchData = async () => {
      try {
        const [trending, recent] = await Promise.all([
          buysellAPI.getTrendingItems(5),
          buysellAPI.getRecentlyViewed(5)
        ]);
        setTrendingItems(trending);
        setRecentlyViewed(recent);
      } catch (error) {
        console.error('Error fetching navbar data:', error);
        // Set empty arrays on error
        setTrendingItems([]);
        setRecentlyViewed([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    { name: 'Promoted', href: '/promoted', badge: 'HOT' },
    { name: 'Featured', href: '/featured', badge: 'NEW' },
    { name: 'Sponsored', href: '/sponsored', badge: 'PRO' },
    { name: 'Affiliates', href: '/affiliates', badge: 'EARN' },
    { name: 'Funding', href: '/funding', badge: 'FUND' }
  ];

  const mobileSections = [
    { id: 'categories', name: 'Categories', icon: <FiGrid className="h-4 w-4" /> },
    { id: 'premium', name: 'Premium', icon: <FiStar className="h-4 w-4" /> },
    { id: 'trending', name: 'Trending', icon: <FiTrendingUp className="h-4 w-4" /> },
    { id: 'account', name: 'Account', icon: <FiUser className="h-4 w-4" /> }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg border-b border-gray-200' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                <FiShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">WorldwideAdverts</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900 xs:hidden">WWA</span>
            </Link>

            {/* Desktop Main Navigation */}
            <div className="hidden xl:flex items-center space-x-6 lg:space-x-8">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium text-sm lg:text-base py-2"
                >
                  <span>Categories</span>
                  <FiChevronDown className={`h-3 w-3 lg:h-4 lg:w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-96 lg:w-[28rem] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 p-4 max-h-96 overflow-y-auto">
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
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
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
              <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
                {premiumSections.map((section, index) => (
                  <Link
                    key={index}
                    to={section.href}
                    className="relative text-gray-700 hover:text-green-600 transition-colors font-medium text-sm lg:text-base py-2"
                  >
                    {section.name}
                    {section.badge && (
                      <span className="absolute -top-1 -right-2 lg:-top-2 lg:-right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                        {section.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Post Item Button - Hidden on small screens */}
              <button
                onClick={() => navigate('/buy-sell?postForm=true')}
                className="hidden sm:flex items-center space-x-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                <span className="hidden md:block">Post Item</span>
                <span className="md:hidden">Post</span>
              </button>

              {/* Login/Register - Desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors font-medium text-sm py-2"
                >
                  <FiUser className="h-4 w-4" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <span>Register</span>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-green-600 transition-colors p-2"
              >
                {isMenuOpen ? <FiX className="h-5 w-5 sm:h-6 sm:w-6" /> : <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tablet Categories Bar */}
        <div className="hidden lg:block xl:hidden border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 lg:space-x-6 py-3 overflow-x-auto">
              {mainCategories.slice(0, 8).map((category, index) => (
                <Link
                  key={index}
                  to={category.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors whitespace-nowrap text-sm font-medium"
                >
                  <div className="flex-shrink-0">
                    {category.icon}
                  </div>
                  <span>{category.name}</span>
                </Link>
              ))}
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
            <div className="absolute left-0 top-0 bottom-0 w-80 sm:w-96 bg-white shadow-xl overflow-y-auto">
              {/* Mobile Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FiShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Mobile Post Item Button */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => {
                    navigate('/buy-sell?postForm=true');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                  <FiPlus className="h-4 w-4" />
                  <span className="font-medium">Post Item</span>
                </button>
              </div>

              {/* Mobile Navigation Tabs */}
              <div className="flex border-b border-gray-200">
                {mobileSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveMobileSection(section.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeMobileSection === section.id
                        ? 'text-green-600 border-b-2 border-green-600 -mb-[2px]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {section.icon}
                    <span>{section.name}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Content */}
              <div className="p-4 pb-20">
                {/* Categories Section */}
                {activeMobileSection === 'categories' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {mainCategories.map((category, index) => (
                        <Link
                          key={index}
                          to={category.href}
                          className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-green-50 transition-colors text-center group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex-shrink-0 text-green-600 group-hover:text-green-700 text-lg">
                            {category.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-700 text-center">
                            {category.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Premium Section */}
                {activeMobileSection === 'premium' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Premium Features</h3>
                    <div className="space-y-2">
                      {premiumSections.map((section, index) => (
                        <Link
                          key={index}
                          to={section.href}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-green-50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <FiStar className="h-5 w-5 text-yellow-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {section.name}
                            </span>
                          </div>
                          {section.badge && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {section.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Section */}
                {activeMobileSection === 'trending' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Trending Items</h3>
                    {!loading && trendingItems.length > 0 ? (
                      <div className="space-y-3">
                        {trendingItems.map((item, index) => (
                          <Link
                            key={item.id || index}
                            to={`/item/${item.id}`}
                            className="block p-4 rounded-lg hover:bg-green-50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-3">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ${item.price || '0'}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="animate-pulse">
                          <div className="h-4 w-4 bg-gray-200 rounded-full mx-auto mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
                        </div>
                        <p className="text-gray-500 text-sm">Loading trending items...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Account Section */}
                {activeMobileSection === 'account' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Account</h3>
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-green-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Login</span>
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-green-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Register</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-green-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiSettings className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Dashboard</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-14 sm:h-16 xl:h-16" />

      {/* Mobile Post Button - Floating */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => navigate('/buy-sell?postForm=true')}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-105 flex items-center justify-center"
        >
          <FiPlus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar - Mobile */}
      <div className="lg:hidden fixed top-20 left-4 right-4 z-40">
        <div className="relative">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            onClick={() => navigate('/buy-sell?search=true')}
          />
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
            onClick={() => navigate('/buy-sell?search=true')}
          >
            <FiSearch className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default BuySellNavbar;
