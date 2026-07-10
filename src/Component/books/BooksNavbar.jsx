import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, Home, BookOpen, Grid3X3, PlusCircle, User, LogIn, Search, Heart, ShoppingBag, ChevronDown, LayoutDashboard } from 'lucide-react';

const BooksNavbar = () => {
  const { logIn } = useSelector((store) => store.auth);
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

  const handlePostBook = () => {
    navigate('/books?postForm=true');
    setIsMenuOpen(false);
  };

  const bookCategories = [
    { name: 'Fiction', href: '/books?genre=fiction' },
    { name: 'Non-Fiction', href: '/books?genre=non-fiction' },
    { name: 'Academic', href: '/books?genre=academic' },
    { name: 'Children', href: '/books?genre=children' },
    { name: 'Business', href: '/books?genre=business' },
    { name: 'Self-Help', href: '/books?genre=self-help' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">WorldwideAdverts</span>
                <span className="text-xs text-amber-600 font-medium hidden sm:block">Books Marketplace</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActivePath('/') && !isActivePath('/books')
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath('/categories')
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="font-medium">Categories</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {isCategoriesOpen && (
                <div 
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-2">
                    {bookCategories.map((category, index) => (
                      <Link
                        key={index}
                        to={category.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200">
                          <BookOpen className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/books"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActivePath('/books')
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Books</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            {logIn ? (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/register"
                  className="flex items-center space-x-2 border-2 border-amber-500 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-500 hover:text-white transition-all duration-200 font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Right side items - Search and Icons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-gray-100 rounded-lg transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-amber-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <Link
                to="/"
                className="flex items-center space-x-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 block px-4 py-3 rounded-xl font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              <div className="border-t border-gray-200 pt-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
                {bookCategories.map((category, index) => (
                  <Link
                    key={index}
                    to={category.href}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 block px-4 py-3 rounded-xl font-medium transition-colors pl-8"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
              
              <Link
                to="/books"
                className="flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white block px-4 py-3 rounded-xl font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5" />
                <span>All Books</span>
              </Link>
              
              <div className="border-t border-gray-200 pt-2 space-y-2">
                {logIn ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white block px-4 py-3 rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 block px-4 py-3 rounded-xl font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                    
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 border-2 border-amber-500 text-amber-600 px-4 py-3 rounded-xl font-medium hover:bg-amber-500 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
              
              {/* Mobile Quick Actions */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-around">
                  <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-amber-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">Saved</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-amber-600 transition-colors relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-xs">Cart</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
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

export default BooksNavbar;
