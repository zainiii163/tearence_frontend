import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Calendar, Building, PlusCircle, User, LogIn, Search, Heart, ChevronDown, ArrowLeft } from 'lucide-react';

const EventsVenuesNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePostEvent = () => {
    navigate('/events-venues/post?type=event');
    setIsMenuOpen(false);
  };

  const handlePostVenue = () => {
    navigate('/events-venues/post?type=venue');
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const eventCategories = [
    { name: 'Concerts', href: '/events-venues?category=concerts' },
    { name: 'Conferences', href: '/events-venues?category=conferences' },
    { name: 'Sports', href: '/events-venues?category=sports' },
    { name: 'Festivals', href: '/events-venues?category=festivals' },
    { name: 'Workshops', href: '/events-venues?category=workshops' },
    { name: 'Networking', href: '/events-venues?category=networking' },
  ];

  const venueCategories = [
    { name: 'Hotels', href: '/events-venues/venues/category/hotels' },
    { name: 'Restaurants', href: '/events-venues/venues/category/restaurants' },
    { name: 'Conference Centers', href: '/events-venues/venues/category/conference-centers' },
    { name: 'Outdoor Venues', href: '/events-venues/venues/category/outdoor-venues' },
    { name: 'Party Venues', href: '/events-venues/venues/category/party-venues' },
    { name: 'Wedding Venues', href: '/events-venues/venues/category/wedding-venues' },
    { name: 'Stadiums', href: '/events-venues/venues/category/stadiums' },
    { name: 'Grounds', href: '/events-venues/venues/category/grounds' },
    { name: 'Caravan Parks', href: '/events-venues/venues/category/caravan-parks' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isEventsVenuesPage = location.pathname.startsWith('/events-venues');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-md'
    }`}>
      <div className="page-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">WorldwideAdverts</span>
                <span className="text-xs text-purple-600 font-medium hidden sm:block">Entertainment</span>
              </div>
            </Link>
          </div>

          {/* Back Button (only on events-venues pages) */}
          {isEventsVenuesPage && location.pathname !== '/events-venues' && (
            <button
              onClick={handleBack}
              className="hidden md:flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-purple-600 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActivePath('/') && !isActivePath('/events-venues')
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>
            
            {/* Events Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen('events')}
                onMouseLeave={() => setIsCategoriesOpen(null)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/events-venues')
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Events</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {isCategoriesOpen === 'events' && (
                <div 
                  onMouseEnter={() => setIsCategoriesOpen('events')}
                  onMouseLeave={() => setIsCategoriesOpen(null)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-2">
                    {eventCategories.map((category, index) => (
                      <Link
                        key={index}
                        to={category.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Venues Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen('venues')}
                onMouseLeave={() => setIsCategoriesOpen(null)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/events-venues')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <Building className="w-4 h-4" />
                <span className="font-medium">Venues</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {isCategoriesOpen === 'venues' && (
                <div 
                  onMouseEnter={() => setIsCategoriesOpen('venues')}
                  onMouseLeave={() => setIsCategoriesOpen(null)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-2">
                    {venueCategories.map((category, index) => (
                      <Link
                        key={index}
                        to={category.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/events-venues"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActivePath('/events-venues')
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Entertainment</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <button
              onClick={handlePostEvent}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post Event</span>
            </button>
            
            <button
              onClick={handlePostVenue}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post Venue</span>
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-purple-600 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/register"
              className="flex items-center space-x-2 border-2 border-purple-500 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-200 font-medium"
            >
              <User className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>

          {/* Right side items - Search and Icons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events & venues..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <Link
                to="/"
                className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 block px-4 py-3 rounded-xl font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              {/* Mobile Back Button */}
              {isEventsVenuesPage && location.pathname !== '/events-venues' && (
                <button
                  onClick={() => {
                    handleBack();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 block px-4 py-3 rounded-xl font-medium transition-colors w-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              )}
              
              <div className="border-t border-gray-200 pt-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Events Categories</p>
                {eventCategories.map((category, index) => (
                  <Link
                    key={index}
                    to={category.href}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 block px-4 py-3 rounded-xl font-medium transition-colors pl-8"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Venues Categories</p>
                {venueCategories.map((category, index) => (
                  <Link
                    key={index}
                    to={category.href}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-4 py-3 rounded-xl font-medium transition-colors pl-8"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
              
              <Link
                to="/events-venues"
                className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white block px-4 py-3 rounded-xl font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="w-5 h-5" />
                <span>All Entertainment</span>
              </Link>
              
              <button
                onClick={handlePostEvent}
                className="w-full flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Post Event</span>
              </button>
              
              <button
                onClick={handlePostVenue}
                className="w-full flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Post Venue</span>
              </button>
              
              <div className="border-t border-gray-200 pt-2 space-y-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 block px-4 py-3 rounded-xl font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/register"
                  className="flex items-center space-x-3 border-2 border-purple-500 text-purple-600 px-4 py-3 rounded-xl font-medium hover:bg-purple-500 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Register</span>
                </Link>
              </div>
              
              {/* Mobile Quick Actions */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-around">
                  <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">Saved</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EventsVenuesNavbar;
