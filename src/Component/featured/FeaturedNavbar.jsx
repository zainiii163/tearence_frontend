import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  Home, 
  Car, 
  Book, 
  Plane, 
  ShoppingCart, 
  Briefcase, 
  Calendar, 
  Ticket, 
  Star, 
  Crown, 
  Rocket,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  Globe
} from 'lucide-react';

const FeaturedNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Globe, dropdown: true },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Books & Literature', href: '/books', icon: Book },
    { name: 'Resorts & Travel', href: '/travel', icon: Plane },
    { name: 'Buy & Sell', href: '/marketplace', icon: ShoppingCart },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Events', href: '/events-venues', icon: Calendar },
    { name: 'Jobs & Vacancies', href: '/jobs', icon: Briefcase },
    { name: 'Promoted Adverts', href: '/promoted', icon: Star },
    { name: 'Sponsored Adverts', href: '/sponsored', icon: Crown },
    { name: 'Featured Adverts', href: '/featured', icon: Rocket, current: true },
  ];

  const categories = [
    { name: 'Property', href: '/property', color: 'text-blue-600' },
    { name: 'Vehicles', href: '/vehicles', color: 'text-red-600' },
    { name: 'Jobs', href: '/jobs', color: 'text-purple-600' },
    { name: 'Business', href: '/business', color: 'text-yellow-600' },
    { name: 'Electronics', href: '/electronics', color: 'text-gray-600' },
    { name: 'Fashion', href: '/fashion', color: 'text-pink-600' },
    { name: 'Travel', href: '/travel', color: 'text-teal-600' },
    { name: 'Events', href: '/events-venues', color: 'text-indigo-600' },
    { name: 'Animals and Pets', href: '/pets', color: 'text-green-600' },
    { name: 'Home & Garden', href: '/home-garden', color: 'text-lime-600' },
    { name: 'Health', href: '/health', color: 'text-red-600' },
    { name: 'Education', href: '/education', color: 'text-blue-600' },
  ];

  const handlePostAdvert = () => {
    navigate('/featured?postForm=true');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="page-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                        className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                          item.current
                            ? 'text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-700 hover:text-purple-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isCategoriesDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200">
                          <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse Categories</h3>
                            <div className="space-y-2">
                              {categories.map((category) => (
                                <Link
                                  key={category.name}
                                  to={category.href}
                                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${category.color} hover:bg-gray-50 transition-colors`}
                                  onClick={() => setIsCategoriesDropdownOpen(false)}
                                >
                                  <span>{category.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                        item.current
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-700 hover:text-purple-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handlePostAdvert}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              <Rocket className="h-4 w-4" />
              <span>Post Advert</span>
            </button>
            
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/register"
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    item.current
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              <button
                onClick={handlePostAdvert}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                <Rocket className="h-4 w-4" />
                <span>Post Advert</span>
              </button>
              
              <Link
                to="/login"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              
              <Link
                to="/register"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FeaturedNavbar;
