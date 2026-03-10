import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Grid3X3, 
  Car, 
  BookOpen, 
  Plane, 
  ShoppingBag, 
  Briefcase, 
  Calendar, 
  Star, 
  PlusCircle,
  User,
  LogIn,
  ChevronDown,
  Search,
  Globe
} from 'lucide-react';

const JobsNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/category-menu', icon: Grid3X3 },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Books & Literature', href: '/books', icon: BookOpen },
    { name: 'Resorts & Travel', href: '/resorts-travel', icon: Plane },
    { name: 'Buy & Sell', href: '/buy-sell', icon: ShoppingBag },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Events', href: '/events-venues', icon: Calendar },
    { name: 'Jobs & Vacancies', href: '/jobs', icon: Briefcase, current: true },
    { name: 'Promoted Adverts', href: '/promoted-adverts', icon: Star },
  ];

  const categories = [
    { name: 'Vehicles & Transport', href: '/vehicles', icon: Car },
    { name: 'Books & Literature', href: '/books', icon: BookOpen },
    { name: 'Resorts & Travel', href: '/resorts-travel', icon: Plane },
    { name: 'Buy & Sell', href: '/buy-sell', icon: ShoppingBag },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Events & Venues', href: '/events-venues', icon: Calendar },
    { name: 'Jobs & Vacancies', href: '/jobs', icon: Briefcase },
    { name: 'Property & Real Estate', href: '/properties', icon: Home },
    { name: 'Banner Adverts', href: '/banner-adverts', icon: Star },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Post Advert Button */}
            <a
              href="/post-ad"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Advert</span>
            </a>

            {/* Login/Register */}
            <div className="flex items-center space-x-2">
              <a
                href="/Login"
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </a>
              <a
                href="/Login"
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Register</span>
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}

              {/* Categories Dropdown for Mobile */}
              <div className="pt-2 pb-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">
                  Categories
                </div>
                {categories.map((category) => (
                  <a
                    key={category.name}
                    href={category.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors ml-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <a
                  href="/post-ad"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Advert</span>
                </a>
                <div className="flex space-x-2">
                  <a
                    href="/Login"
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </a>
                  <a
                    href="/Login"
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Register</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default JobsNavbar;
