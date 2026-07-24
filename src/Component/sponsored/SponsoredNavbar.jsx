import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Car, Book, Plane, ShoppingBag, Wrench, Calendar, Users, Briefcase, BadgeCheck, Crown, Plus, User, ChevronDown, Search } from 'lucide-react';

const SponsoredNavbar = ({ mobileMenuOpen, setMobileMenuOpen, onPostAdvert }) => {
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

  const navigationItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Categories', icon: ChevronDown, href: '#', hasDropdown: true },
    { name: 'Vehicles', icon: Car, href: '/vehicles' },
    { name: 'Books & Literature', icon: Book, href: '/books' },
    { name: 'Resorts & Travel', icon: Plane, href: '/resorts' },
    { name: 'Buy & Sell', icon: ShoppingBag, href: '/buy-sell' },
    { name: 'Services', icon: Wrench, href: '/services' },
    { name: 'Events', icon: Calendar, href: '/events-venues' },
    { name: 'Jobs & Vacancies', icon: Users, href: '/jobs' },
    { name: 'Promoted Adverts', icon: BadgeCheck, href: '/promoted' },
    { name: 'Sponsored Adverts', icon: Crown, href: '/sponsored-adverts', active: true },
  ];

  const categories = [
    { name: 'Property', href: '/properties', icon: '🏠' },
    { name: 'Vehicles', href: '/vehicles', icon: '🚗' },
    { name: 'Jobs', href: '/jobs', icon: '💼' },
    { name: 'Services', href: '/services', icon: '🔧' },
    { name: 'Books', href: '/books', icon: '📚' },
    { name: 'Travel', href: '/resorts', icon: '✈️' },
    { name: 'Events', href: '/events-venues', icon: '🎭' },
    { name: 'Fashion', href: '/buy-sell?category=fashion', icon: '👗' },
    { name: 'Electronics', href: '/buy-sell?category=electronics', icon: '📱' },
    { name: 'Business', href: '/buy-sell?category=business', icon: '💼' },
    { name: 'Pets', href: '/buy-sell?category=pets', icon: '🐾' },
    { name: 'Education', href: '/buy-sell?category=education', icon: '🎓' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="page-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  WorldwideAdverts
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-1">
                {navigationItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <button
                        onMouseEnter={() => setShowCategoriesDropdown(true)}
                        onMouseLeave={() => setShowCategoriesDropdown(false)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          item.active
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border border-orange-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-1" />
                        {item.name}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          item.active
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border border-orange-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-1" />
                        {item.name}
                      </a>
                    )}

                    {/* Categories Dropdown */}
                    {item.hasDropdown && (
                      <AnimatePresence>
                        {showCategoriesDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onMouseEnter={() => setShowCategoriesDropdown(true)}
                            onMouseLeave={() => setShowCategoriesDropdown(false)}
                            className="absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                          >
                            <div className="p-4">
                              <h3 className="text-sm font-semibold text-gray-900 mb-3">Explore Categories</h3>
                              <div className="grid grid-cols-3 gap-2">
                                {categories.map((category) => (
                                  <a
                                    key={category.name}
                                    href={category.href}
                                    className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <span className="text-2xl mb-1">{category.icon}</span>
                                    <span className="text-xs text-gray-700 text-center">{category.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onPostAdvert}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Advert
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="w-4 h-4 mr-2" />
              Login
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Register
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    item.active
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              ))}
              
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button
                  onClick={onPostAdvert}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all mb-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Advert
                </button>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </button>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default SponsoredNavbar;
