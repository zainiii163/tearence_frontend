import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import booksAPI from '../../services/booksAPI';
import './Books.css';
import {
  FaBook,
  FaSearch,
  FaFilter,
  FaDownload,
  FaDollarSign,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaEye,
  FaHeart,
  FaShareAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const BooksList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    book_type: '',
    author: '',
    min_price: '',
    max_price: '',
    search: '',
    sort: 'newest',
    per_page: 20,
    page: 1
  });
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Genres options
  const genres = [
    { value: '', label: 'All Genres' },
    { value: 'action', label: 'Action' },
    { value: 'education', label: 'Education' },
    { value: 'drama', label: 'Drama' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non_fiction', label: 'Non-Fiction' },
    { value: 'textbook', label: 'Textbook' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'scifi', label: 'Sci-Fi' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'biography', label: 'Biography' },
    { value: 'self_help', label: 'Self-Help' },
    { value: 'business', label: 'Business' },
    { value: 'children', label: 'Children' },
  ];

  // Book types
  const bookTypes = [
    { value: '', label: 'All Types' },
    { value: 'physical', label: 'Physical Books' },
    { value: 'pdf', label: 'PDF Downloads' },
    { value: 'audiobook', label: 'Audiobooks' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'author_az', label: 'Author: A-Z' },
    { value: 'title_az', label: 'Title: A-Z' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  useEffect(() => {
    fetchBooks();
  }, [filters, fetchBooks]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await booksAPI.getBooks(filters);
      setBooks(response.data || []);
      setPagination(response.meta || {});
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
      await fetchBooks();
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sort) => {
    setFilters(prev => ({ ...prev, sort, page: 1 }));
  };

  const toggleFavorite = async (bookId) => {
    try {
      if (favorites.has(bookId)) {
        await booksAPI.removeFromFavorites(bookId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(bookId);
          return newFavorites;
        });
        toast.success('Removed from favorites');
      } else {
        await booksAPI.addToFavorites(bookId);
        setFavorites(prev => new Set(prev).add(bookId));
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const shareBook = (book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.origin + `/books/${book.listing_id}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/books/${book.listing_id}`
      );
      toast.success('Link copied to clipboard!');
    }
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      book_type: '',
      author: '',
      min_price: '',
      max_price: '',
      search: '',
      sort: 'newest',
      per_page: 20,
      page: 1
    });
  };

  const BookCard = ({ book }) => {
    const isFavorite = favorites.has(book.listing_id);
    
    return (
      <div className="book-card group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(book.listing_id)}
          className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <FaHeart 
            className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          />
        </button>

        {/* Book cover */}
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
          {book.images && book.images.length > 0 ? (
            <img
              src={book.images[0].image_path}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FaBook className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Book type badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {book.book_type}
            </span>
          </div>

          {/* Downloadable badge */}
          {book.is_downloadable && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
                <FaDownload className="w-3 h-3" />
                Downloadable
              </span>
            </div>
          )}
        </div>

        {/* Book info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600">by {book.author}</p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {book.genre}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {book.format}
            </span>
            {book.condition && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {book.condition}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {book.description}
          </p>

          {/* Rating and stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(book.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({book.reviews_count || 0})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FaEye className="w-3 h-3" />
              <span>{book.view_count || 0}</span>
            </div>
          </div>

          {/* Price section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <FaDollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xl font-bold text-green-600">
                {book.price}
              </span>
            </div>
            {book.total_revenue > 0 && (
              <span className="text-xs text-gray-500">
                Revenue: ${book.total_revenue}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/books/${book.listing_id}`)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200"
            >
              View Details
            </button>
            <button
              onClick={() => shareBook(book)}
              className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              <FaShareAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Books Marketplace</h1>
              <p className="text-gray-600 mt-1">Discover and purchase books from our collection</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FaFilter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search books by title, author, or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="submit"
                disabled={searchLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {genres.map(genre => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Type
                </label>
                <select
                  value={filters.book_type}
                  onChange={(e) => handleFilterChange('book_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {bookTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  placeholder="Author name..."
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="999.99"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            {pagination.total && (
              <span>Showing {books.length} of {pagination.total} books</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Per page:</span>
            <select
              value={filters.per_page}
              onChange={(e) => handleFilterChange('per_page', parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value={12}>12</option>
              <option value={20}>20</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Books grid/list */}
        {books.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {books.map(book => (
              <BookCard key={book.listing_id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(pagination.total_pages)].map((_, i) => {
                const page = i + 1;
                const isCurrent = page === pagination.current_page;
                const isNearCurrent = Math.abs(page - pagination.current_page) <= 2;
                const isFirst = page === 1;
                const isLast = page === pagination.total_pages;
                
                if (isCurrent || isNearCurrent || isFirst || isLast) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                
                if (page === pagination.current_page - 3 || page === pagination.current_page + 3) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                
                return null;
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;
