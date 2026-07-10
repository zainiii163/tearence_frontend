import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Grid, List, ChevronLeft, ChevronRight, RefreshCw, BookOpen, ChevronDown } from 'lucide-react';
import BooksCard from './BooksCard';
import BooksAPI from '../../services/booksAPI';

const BooksGrid = ({ 
  filters = {}, 
  onViewBook, 
  onSaveBook, 
  onShareBook, 
  onContactAuthor,
  compact = false,
  showFilters = true 
}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    has_more: true
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);

  const loadBooks = useCallback(async (page = 1, append = false) => {
    if (loading && !append) return;
    
    setLoading(true);
    setError('');

    try {
      const params = {
        page,
        per_page: pagination.per_page,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...filters
      };

      const response = await BooksAPI.getBooks(params);
      
      if (response.success) {
        const newBooks = response.data.items || [];
        
        if (append) {
          setBooks(prev => [...prev, ...newBooks]);
        } else {
          setBooks(newBooks);
        }
        
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          itemsPerPage: response.data.pagination?.itemsPerPage || 12,
          total: response.data.pagination?.totalItems || 0,
          hasMore: response.data.pagination?.hasNextPage || false,
          hasPrevPage: response.data.pagination?.currentPage > 1
        });
      } else {
        setError(response.message || 'Failed to load books');
      }
    } catch (error) {
      // Handle 429 errors specifically
      if (error.message?.includes('Too Many Attempts') || error.message?.includes('429')) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
      } else {
        setError(error.message || 'An error occurred while loading books');
      }
      console.error('Books loading error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBooks(1, false);
    }, 100); // Small delay to prevent rapid calls

    return () => clearTimeout(timeoutId);
  }, [filters, sortBy, sortOrder]);

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      loadBooks(pagination.currentPage + 1, true);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBooks(1, false);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSave = async (bookId, isSaved) => {
    try {
      const response = await BooksAPI.saveBook(bookId);
      
      if (response.success) {
        // Update local state
        setBooks(prev => prev.map(book => 
          book.id === bookId 
            ? { 
                ...book, 
                is_saved: isSaved,
                saves_count: isSaved 
                  ? (book.saves_count || 0) + 1 
                  : Math.max((book.saves_count || 0) - 1, 0)
              }
            : book
        ));
        
        if (onSaveBook) {
          onSaveBook(bookId, isSaved);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to save book:', error);
      throw error;
    }
  };

  const handleView = (book) => {
    BooksAPI.incrementViews(book.id).catch(() => {});

    if (onViewBook) {
      onViewBook(book);
    }
  };

  const handleShare = (book) => {
    if (onShareBook) {
      onShareBook(book);
    }
  };

  const handleContact = (book) => {
    if (onContactAuthor) {
      onContactAuthor(book);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="font-medium">Error loading books</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-lg">No books found</p>
          <p className="text-sm">Try adjusting your filters or search terms</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      {showFilters && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {pagination.total > 0 && (
                <span>
                  Showing {((pagination.current_page - 1) * pagination.per_page) + 1}-
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)} 
                  of {pagination.total.toLocaleString()} books
                </span>
              )}
            </div>
            
            {refreshing && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Refreshing...
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <div className="flex gap-1">
                {[
                  { key: 'created_at', label: 'Latest' },
                  { key: 'title', label: 'Title' },
                  { key: 'price', label: 'Price' },
                  { key: 'views_count', label: 'Popular' },
                  { key: 'saves_count', label: 'Saved' }
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => handleSortChange(option.key)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      sortBy === option.key
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    {sortBy === option.key && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Books Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={
          viewMode === 'grid'
            ? `grid gap-6 ${
                compact 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`
            : 'space-y-4'
        }
      >
        <AnimatePresence mode="wait">
          {books.map((book) => (
            <motion.div key={book.id} variants={itemVariants}>
              <BooksCard
                book={book}
                onView={handleView}
                onSave={handleSave}
                onShare={handleShare}
                onContact={handleContact}
                compact={compact}
                showActions={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {pagination.has_more && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Books
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <div>
              Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div>
            {pagination.total.toLocaleString()} total books
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksGrid;
