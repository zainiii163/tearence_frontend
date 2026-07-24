import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  Star, 
  Eye, 
  Heart,
  BookOpen,
  X,
  Loader2
} from 'lucide-react';
import BooksAPI from '../../services/booksAPI';
import BooksCard from './BooksCard';

const BooksListing = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [genres, setGenres] = useState([]);
  const [trendingGenres, setTrendingGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [stats, setStats] = useState(null);

  // Available options for filters
  const availableGenres = [
    'Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Sci-Fi', 
    'Biography', 'History', 'Self-Help', 'Business', 'Programming',
    'Fantasy', 'Thriller', 'Horror', 'Poetry', 'Drama'
  ];

  const availableFormats = ['paperback', 'hardcover', 'ebook', 'audiobook'];
  const availableBookTypes = ['Fiction', 'Non-Fiction', 'Academic', 'Biography'];
  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

  useEffect(() => {
    fetchBooks();
    fetchTrendingGenres();
    fetchStatistics();
  }, [filters]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await BooksAPI.getBooks({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        ...filters
      });
      
      if (response.success) {
        setBooks(response.data.items);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchTrendingGenres = async () => {
    try {
      const response = await BooksAPI.getTrendingGenres();
      if (response.success) {
        setTrendingGenres(response.data);
      }
    } catch (error) {
      console.error('Error fetching trending genres:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await BooksAPI.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const handleBookView = async (book) => {
    try {
      await BooksAPI.incrementViews(book.id, {
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleSaveBook = async (bookId, save = true) => {
    try {
      const response = await BooksAPI.saveBook(bookId, save);
      
      if (response.success) {
        // Update UI to reflect saved state
        setBooks(prev => prev.map(book => 
          book.id === bookId 
            ? { ...book, is_saved: save }
            : book
        ));
      }
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ currentPage: newPage }));
  };

  const clearFilters = () => {
    setFilters({});
    setPagination(prev => ({ currentPage: 1 }));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star className="w-4 h-4 fill-yellow-200 text-yellow-400" />}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading && (!books || books.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="books-container page-container py-6">
      {/* Header with Stats */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(stats.total_books || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(stats.active_books || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Active Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{(stats.verified_authors || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Verified Authors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{(stats.total_genres || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Genres</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.average_rating}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.most_popular_genre}</div>
              <div className="text-sm text-gray-600">Popular Genre</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.featured_books_count}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books, authors, publishers..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Genre Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                    <select
                      value={filters.genre || ''}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Genres</option>
                      {availableGenres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Format Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select
                      value={filters.format || ''}
                      onChange={(e) => handleFilterChange('format', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Formats</option>
                      {availableFormats.map(format => (
                        <option key={format} value={format}>
                          {format.charAt(0).toUpperCase() + format.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Book Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Book Type</label>
                    <select
                      value={filters.book_type || ''}
                      onChange={(e) => handleFilterChange('book_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {availableBookTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={filters.language || ''}
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Languages</option>
                      {availableLanguages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.min_price || ''}
                        onChange={(e) => handleFilterChange('min_price', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.max_price || ''}
                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={filters.sort_by || 'created_at'}
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="created_at">Latest</option>
                      <option value="title">Title</option>
                      <option value="price">Price</option>
                      <option value="rating">Rating</option>
                      <option value="views_count">Popularity</option>
                      <option value="saves_count">Most Saved</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                    <select
                      value={filters.sort_order || 'desc'}
                      onChange={(e) => handleFilterChange('sort_order', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>

                  {/* Verified Authors Only */}
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verified_only || false}
                        onChange={(e) => handleFilterChange('verified_only', e.target.checked)}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Verified Authors Only</span>
                    </label>
                  </div>

                  {/* Promoted Only */}
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.promoted_only || false}
                        onChange={(e) => handleFilterChange('promoted_only', e.target.checked)}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Promoted Books Only</span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trending Genres */}
      {(trendingGenres && trendingGenres.length > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Genres</h3>
          <div className="flex flex-wrap gap-2">
            {trendingGenres.map((genre) => (
              <button
                key={genre.genre || genre.name}
                onClick={() => handleFilterChange('genre', genre.genre || genre.name)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
              >
                {genre.genre || genre.name} ({genre.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          {pagination && pagination.totalItems > 0 && (
            <span>
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
              of {(pagination.totalItems || 0).toLocaleString()} books
            </span>
          )}
        </div>
      </div>

      {/* Books Grid/List */}
      <AnimatePresence mode="wait">
        {(!books || books.length === 0) && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={
              viewMode === 'grid'
                ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-4'
            }
          >
            {books && books.map((book) => (
              <BooksCard
                key={book.id}
                book={book}
                onView={() => handleBookView(book)}
                onSave={() => handleSaveBook(book.id, !book.is_saved)}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {[...Array(pagination.totalPages)].map((_, index) => {
            const page = index + 1;
            const isCurrentPage = page === pagination.currentPage;
            const isNearCurrent = Math.abs(page - pagination.currentPage) <= 2;
            
            if (!isNearCurrent && page !== 1 && page !== pagination.totalPages) {
              return null;
            }
            
            if (page === 1 && pagination.currentPage > 4) {
              return (
                <React.Fragment key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {page}
                  </button>
                  <span className="px-2">...</span>
                </React.Fragment>
              );
            }
            
            if (page === pagination.totalPages && pagination.currentPage < pagination.totalPages - 3) {
              return (
                <React.Fragment key={page}>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => handlePageChange(page)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            }
            
            if (isNearCurrent) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            }
            
            return null;
          })}
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BooksListing;
