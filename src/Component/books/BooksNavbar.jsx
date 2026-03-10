import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Grid3X3, PlusCircle, User, LogIn } from 'lucide-react';

const BooksNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePostBook = () => {
    navigate('/books?postForm=true');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WorldwideAdverts</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/books"
              className="flex items-center space-x-1 text-yellow-600 font-semibold"
            >
              <BookOpen className="w-4 h-4" />
              <span>Books & Literature</span>
            </Link>
            
            <Link
              to="/categories"
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 transition-colors"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Categories</span>
            </Link>
            
            <button
              onClick={handlePostBook}
              className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Your Book</span>
            </button>
            
            <Link
              to="/login"
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/register"
              className="flex items-center space-x-1 border border-yellow-600 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-600 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-yellow-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/books"
                className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5" />
                <span>Books & Literature</span>
              </Link>
              
              <Link
                to="/categories"
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Grid3X3 className="w-5 h-5" />
                <span>Categories</span>
              </Link>
              
              <button
                onClick={handlePostBook}
                className="w-full flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-2 rounded-md text-base font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Post Your Book</span>
              </button>
              
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              
              <Link
                to="/register"
                className="flex items-center space-x-2 border border-yellow-600 text-yellow-600 px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-600 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BooksNavbar;
