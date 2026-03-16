import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Home,
  Grid3x3,
  Car,
  BookOpen,
  Plane,
  ShoppingBag,
  Briefcase,
  Calendar,
  UserCheck,
  HandHeart,
  Crown,
  Gem,
  Sparkles,
  Plus,
  LogIn,
  UserPlus
} from 'lucide-react';

const FundingNavbar = ({ showMobileMenu, setShowMobileMenu, onPostProject }) => {
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle window resize and scroll
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Responsive breakpoints
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const categories = [
    { name: 'Vehicles', icon: <Car className="w-4 h-4" />, href: '/vehicles' },
    { name: 'Books & Literature', icon: <BookOpen className="w-4 h-4" />, href: '/books' },
    { name: 'Resorts & Travel', icon: <Plane className="w-4 h-4" />, href: '/travel' },
    { name: 'Buy & Sell', icon: <ShoppingBag className="w-4 h-4" />, href: '/marketplace' },
    { name: 'Services', icon: <Briefcase className="w-4 h-4" />, href: '/services' },
    { name: 'Events', icon: <Calendar className="w-4 h-4" />, href: '/events-venues' },
    { name: 'Jobs & Vacancies', icon: <UserCheck className="w-4 h-4" />, href: '/jobs' },
    { name: 'Promoted Adverts', icon: <Crown className="w-4 h-4" />, href: '/promoted' },
    { name: 'Sponsored Adverts', icon: <Gem className="w-4 h-4" />, href: '/sponsored' },
    { name: 'Featured Adverts', icon: <Sparkles className="w-4 h-4" />, href: '/featured' },
    { name: 'Affiliates Hub', icon: <HandHeart className="w-4 h-4" />, href: '/affiliates' },
    { name: 'Funding Hub', icon: <HandHeart className="w-4 h-4" />, href: '/funding', active: true }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`bg-white border-b border-gray-200 sticky top-0 z-40 transition-all duration-300 funding-navbar ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 nav-container">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                  <HandHeart className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className={`text-gray-900 font-bold transition-colors group-hover:text-blue-600 logo-truncate ${
                  isMobile ? 'text-sm' : 'text-lg sm:text-xl'
                }`}>
                  {isMobile ? 'WWA' : 'WorldwideAdverts'}
                </span>
              </a>
            </div>

            {/* Desktop Menu - Hidden on mobile, visible on tablet and desktop */}
            <div className={`hidden ${isTablet ? 'md:flex' : 'lg:flex'} items-center space-x-4 sm:space-x-6 lg:space-x-8`}>
              {/* Home - Hidden on tablet, visible on desktop */}
              {!isTablet && (
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                  Home
                </a>
              )}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => !isMobile && setShowCategoriesDropdown(true)}
                  onMouseLeave={() => !isMobile && setShowCategoriesDropdown(false)}
                  onClick={() => isMobile && setShowCategoriesDropdown(!showCategoriesDropdown)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base"
                >
                  <span>{isTablet ? 'Cats' : 'Categories'}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                    showCategoriesDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {showCategoriesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => !isMobile && setShowCategoriesDropdown(true)}
                      onMouseLeave={() => !isMobile && setShowCategoriesDropdown(false)}
                      className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 overflow-hidden ${
                        isMobile ? 'w-full left-0 right-0' : 'w-64'
                      }`}
                    >
                      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
                        {categories.map((category, index) => (
                          <a
                            key={index}
                            href={category.href}
                            className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors ${
                              category.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            } ${isMobile ? 'text-xs' : 'text-sm'}`}
                            onClick={() => setShowCategoriesDropdown(false)}
                          >
                            <div className="flex-shrink-0">{category.icon}</div>
                            <span className="font-medium truncate line-clamp-1">{category.name}</span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct Links - Responsive visibility */}
              {isDesktop && (
                <>
                  <a href="/promoted" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                    Promoted
                  </a>
                  <a href="/sponsored-adverts" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                    Sponsored
                  </a>
                  <a href="/featured" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                    Featured
                  </a>
                  <a href="/affiliates" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                    Affiliates
                  </a>
                  <a href="/funding" className="text-blue-600 font-medium transition-colors text-sm lg:text-base border-b-2 border-blue-600 pb-1">
                    Funding
                  </a>
                </>
              )}
            </div>

            {/* Right Side Actions - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Post Project Button - Adjusted for different screen sizes */}
              <button
                onClick={onPostProject}
                className={`flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg ${
                  isMobile 
                    ? 'px-2 py-1.5 text-xs rounded-md' 
                    : isTablet 
                    ? 'px-3 py-2 text-sm rounded-lg' 
                    : 'px-4 py-2 rounded-lg'
                }`}
              >
                <Plus className={`w-3 h-3 sm:w-4 sm:h-4`} />
                {!isMobile && <span>{isTablet ? 'Post' : 'Post Project'}</span>}
              </button>

              {/* Auth Links - Responsive */}
              {isDesktop ? (
                <>
                  <a href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </a>
                  <a href="/register" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm lg:text-base">
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </a>
                </>
              ) : (
                <a href="/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors text-xs sm:text-sm">
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  {!isMobile && <span>Login</span>}
                </a>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`p-1.5 sm:p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors ${
                  isDesktop ? 'hidden' : 'flex'
                }`}
              >
                {showMobileMenu ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)} />
            <div className={`fixed left-0 top-0 bottom-0 bg-white shadow-xl overflow-y-auto transition-transform duration-300 ${
              isMobile ? 'w-72' : 'w-80'
            }`}>
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <HandHeart className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className={`text-gray-900 font-bold ${
                      isMobile ? 'text-sm' : 'text-lg sm:text-xl'
                    }`}>
                      {isMobile ? 'WWA' : 'WorldwideAdverts'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                {/* Post Project Button */}
                <button
                  onClick={() => {
                    onPostProject();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Post Project</span>
                </button>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <a 
                    href="/" 
                    className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Home
                  </a>
                  
                  <div className="space-y-1">
                    <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Categories
                    </div>
                    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
                      {categories.map((category, index) => (
                        <a
                          key={index}
                          href={category.href}
                          className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 rounded-lg transition-colors ${
                            category.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          } text-xs sm:text-sm`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <div className="flex-shrink-0">{category.icon}</div>
                          <span className="font-medium truncate line-clamp-1">{category.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links for Mobile */}
                  {!isDesktop && (
                    <div className="space-y-1">
                      <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Links
                      </div>
                      <a 
                        href="/promoted" 
                        className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Promoted
                      </a>
                      <a 
                        href="/sponsored-adverts" 
                        className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Sponsored
                      </a>
                      <a 
                        href="/featured" 
                        className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Featured
                      </a>
                      <a 
                        href="/affiliates" 
                        className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Affiliates
                      </a>
                    </div>
                  )}
                </div>

                {/* Auth Links */}
                <div className="pt-4 sm:pt-6 border-t border-gray-200 space-y-2 sm:space-y-3">
                  <a 
                    href="/login" 
                    className="block w-full text-center px-3 sm:px-4 py-2 sm:py-3 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Login
                  </a>
                  <a 
                    href="/register" 
                    className="block w-full text-center px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Register
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FundingNavbar;
