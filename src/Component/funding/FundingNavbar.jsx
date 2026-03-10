import React, { useState } from 'react';
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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <HandHeart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Home */}
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showCategoriesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setShowCategoriesDropdown(true)}
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      {categories.map((category, index) => (
                        <a
                          key={index}
                          href={category.href}
                          className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                            category.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {category.icon}
                          <span className="font-medium">{category.name}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct Links */}
              <a href="/promoted" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Promoted
              </a>
              <a href="/sponsored-adverts" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sponsored
              </a>
              <a href="/featured" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Featured
              </a>
              <a href="/affiliates" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Affiliates
              </a>
              <a href="/funding" className="text-blue-600 font-medium transition-colors">
                Funding
              </a>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={onPostProject}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Post Project</span>
              </button>
              <a href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </a>
              <a href="/register" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)} />
            <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <HandHeart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
                  </div>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
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
                  <a href="/" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium">
                    Home
                  </a>
                  
                  <div className="space-y-1">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Categories
                    </div>
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href={category.href}
                        className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors ${
                          category.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {category.icon}
                        <span className="font-medium">{category.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Auth Links */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <a href="/login" className="block w-full text-center px-4 py-3 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Login
                  </a>
                  <a href="/register" className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
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
