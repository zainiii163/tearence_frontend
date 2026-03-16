import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Menu, 
  X, 
  Search, 
  Globe, 
  User, 
  LogIn, 
  UserPlus,
  ChevronDown,
  Megaphone,
  Home,
  Grid3X3,
  PlusCircle
} from 'lucide-react';

const BannerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logIn, token, userDetail } = useSelector((store) => store.auth);
  
  // Check if user is authenticated
  const isAuthenticated = logIn === true || token;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: <Home className="w-4 h-4" />
    },
    { 
      name: 'Banner Adverts', 
      href: '/banner-adverts', 
      icon: <Megaphone className="w-4 h-4" />
    },
    { 
      name: 'Categories', 
      href: '/categories', 
      icon: <Grid3X3 className="w-4 h-4" />
    },
  ];

  const categories = [
    { name: 'Real Estate', href: '/banner-adverts?category=real-estate' },
    { name: 'Vehicles', href: '/banner-adverts?category=vehicles' },
    { name: 'Travel', href: '/banner-adverts?category=travel' },
    { name: 'Jobs', href: '/banner-adverts?category=jobs' },
    { name: 'Services', href: '/banner-adverts?category=services' },
    { name: 'Events', href: '/banner-adverts?category=events' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-md'
    }`}>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center h-16 px-4 xl:px-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Megaphone className="w-8 h-8 text-blue-600 transform group-hover:scale-110 transition-transform duration-200" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    WorldwideAdverts
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Banner Marketplace</span>
                </div>
              </Link>
            </div>

            {/* Center Navigation */}
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.href || 
                    (item.name === 'Banner Adverts' && location.pathname.startsWith('/banner-adverts'))
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.name === 'Banner Adverts' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Categories</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Popular Categories
                      </div>
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.href}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/banner-adverts?postForm=true')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="font-medium">Post Banner</span>
                  </button>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden xl:block">
                      <div className="text-sm font-medium text-gray-900">
                        {userDetail?.name?.split(' ')[0] || userDetail?.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">Account</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:block lg:hidden">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center h-16 px-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Megaphone className="w-7 h-7 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    WorldwideAdverts
                  </span>
                  <span className="text-xs text-gray-500">Banners</span>
                </div>
              </Link>
            </div>

            {/* Center Navigation */}
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.href || 
                    (item.name === 'Banner Adverts' && location.pathname.startsWith('/banner-adverts'))
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/banner-adverts?postForm=true')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex justify-between items-center h-14 px-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Megaphone className="w-6 h-6 text-blue-600" />
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WWAdverts
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/banner-adverts?postForm=true')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white border-t border-gray-100">
            <div className="px-3 py-3 space-y-1">
              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.href || 
                    (item.name === 'Banner Adverts' && location.pathname.startsWith('/banner-adverts'))
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.name === 'Banner Adverts' && (
                    <span className="w-2 h-2 bg-green-500 rounded-full ml-auto"></span>
                  )}
                </Link>
              ))}

              {/* Categories Section */}
              <div className="pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categories
                </div>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Section */}
              <div className="pt-3 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {userDetail?.name?.split(' ')[0] || userDetail?.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">Account</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/banner-adverts?postForm=true');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span className="font-medium">Post Banner</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="font-medium">Register</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BannerNavbar;
