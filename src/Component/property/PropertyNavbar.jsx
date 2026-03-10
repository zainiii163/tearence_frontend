import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  Building, 
  Car, 
  BookOpen, 
  Plane, 
  ShoppingBag, 
  Wrench, 
  Calendar, 
  Briefcase,
  Grid,
  Star, 
  TrendingUp, 
  Award, 
  Users, 
  DollarSign, 
  Plus, 
  UserCircle, 
  Settings, 
  LogOut,
  ChevronDown,
  Globe
} from 'lucide-react';

const PropertyNavbar = ({ showMobileMenu, setShowMobileMenu, onPostProperty }) => {
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Grid, hasDropdown: true },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Books & Literature', href: '/books', icon: BookOpen },
    { name: 'Resorts & Travel', href: '/travel', icon: Plane },
    { name: 'Buy & Sell', href: '/classifieds', icon: ShoppingBag },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'Events', href: '/events-venues', icon: Calendar },
    { name: 'Jobs & Vacancies', href: '/jobs', icon: Briefcase },
    { name: 'Promoted Adverts', href: '/promoted', icon: Star },
    { name: 'Sponsored Adverts', href: '/sponsored', icon: TrendingUp },
    { name: 'Featured Adverts', href: '/featured', icon: Award },
    { name: 'Affiliates Hub', href: '/affiliates', icon: Users },
    { name: 'Funding Hub', href: '/funding', icon: DollarSign },
    { name: 'Property Hub', href: '/properties', icon: Building, active: true },
  ];

  const categories = [
    { name: 'Vehicles & Transport', href: '/vehicles', icon: Car },
    { name: 'Property & Real Estate', href: '/properties', icon: Building },
    { name: 'Books & Literature', href: '/books', icon: BookOpen },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'Events & Venues', href: '/events-venues', icon: Calendar },
    { name: 'Jobs & Vacancies', href: '/jobs', icon: Briefcase },
    { name: 'Travel & Tourism', href: '/travel', icon: Plane },
    { name: 'Buy & Sell', href: '/classifieds', icon: ShoppingBag },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowCategoriesDropdown(true)}
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showCategoriesDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          onMouseEnter={() => setShowCategoriesDropdown(true)}
                          onMouseLeave={() => setShowCategoriesDropdown(false)}
                          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                        >
                          {categories.map((category) => (
                            <a
                              key={category.name}
                              href={category.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <category.icon className="w-4 h-4 text-gray-400" />
                              {category.name}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onPostProperty}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Post Property
            </button>
            
            <div className="relative">
              <button
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <UserCircle className="w-5 h-5" />
                <ChevronDown className="w-3 h-3" />
              </button>
              
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onMouseLeave={() => setShowUserDropdown(false)}
                    className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    <a href="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      Account
                    </a>
                    <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="w-4 h-4 text-gray-400" />
                      Settings
                    </a>
                    <hr className="my-2 border-gray-200" />
                    <a href="/logout" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </a>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={onPostProperty}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Post Property
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <a href="/account" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <UserCircle className="w-4 h-4" />
                  Account
                </a>
                <a href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  Settings
                </a>
                <a href="/logout" className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  Logout
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PropertyNavbar;
