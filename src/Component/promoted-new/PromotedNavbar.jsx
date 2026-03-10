import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Home, Grid3X3, Car, BookOpen, Plane, ShoppingCart, Briefcase, Calendar, Zap, LogIn, UserPlus } from 'lucide-react';

const PromotedNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Grid3X3 },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Books & Literature', href: '/books', icon: BookOpen },
    { name: 'Resorts & Travel', href: '/resorts', icon: Plane },
    { name: 'Buy & Sell', href: '/buy-sell', icon: ShoppingCart },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Promoted Adverts', href: '/promoted-adverts', icon: Zap, current: true },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : isActive(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/post-advert"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Post Advert
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40"
          >
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : isActive(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Link
                  to="/post-advert"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md text-center"
                >
                  Post Advert
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Register</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PromotedNavbar;
