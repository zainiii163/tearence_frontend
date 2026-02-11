import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMarketplaceBooks,
  setFilters,
  setCurrentPage,
  purchaseBook,
  downloadBookPDF,
} from '../../slice/BookMarketplaceSlice';
import {
  FaBook,
  FaSearch,
  FaDownload,
  FaShoppingCart,
  FaExternalLinkAlt,
  FaDollarSign,
  FaFilePdf,
  FaHeadphones,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaEye,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookMarketplacePage = () => {
  const dispatch = useDispatch();
  const {
    books,
    loading,
    purchasing,
    downloading,
    pagination,
    filters,
  } = useSelector((state) => state.bookMarketplace);

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Book genres - matching API documentation
  const genres = [
    { value: 'all', label: 'All Genres' },
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

  // Book types - matching API documentation
  const bookTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'pdf', label: 'PDF Downloads' },
    { value: 'audiobook', label: 'Audiobooks' },
    { value: 'external', label: 'External Links' },
  ];

  // Book formats - matching API documentation

  // Sort options - matching API documentation
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'title', label: 'Title: A-Z' },
    { value: 'author', label: 'Author: A-Z' },
  ];

  useEffect(() => {
    dispatch(fetchMarketplaceBooks({
      page: pagination.currentPage || 1,
      per_page: pagination.itemsPerPage || 20,
      ...filters,
    }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters]);

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
    dispatch(setCurrentPage(1)); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const handlePurchase = async (book) => {
    try {
      await dispatch(purchaseBook(book.book_id)).unwrap();
      toast.success('Book purchased successfully! You can now download it.');
    } catch (error) {
      toast.error(error.message || 'Failed to purchase book');
    }
  };

  const handleDownload = async (book) => {
    try {
      await dispatch(downloadBookPDF(book.book_id)).unwrap();
      toast.success('Download started successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to download book');
    }
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const closeBookModal = () => {
    setShowBookModal(false);
    setSelectedBook(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      dispatch(setCurrentPage(page));
    }
  };


  const getFormatBadge = (bookType) => {
    const formatConfig = {
      pdf: { bg: 'bg-red-100', text: 'text-red-800', label: 'PDF' },
      audiobook: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Audiobook' },
      external: { bg: 'bg-green-100', text: 'text-green-800', label: 'External' },
    };
    
    const config = formatConfig[bookType] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Book' };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-24 pb-12">
        {/* Header Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FaBook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Book Marketplace
              </h1>
              <p className="text-muted-foreground">
                Discover and purchase books from our community - PDFs, physical books, and more
              </p>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>

        {/* Book Categories Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <button
                  key={genre.value}
                  onClick={() => handleFilterChange('genre', genre.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.genre === genre.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {genres.map(genre => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>

            {/* Book Type Filter */}
            <select
              value={filters.book_type}
              onChange={(e) => handleFilterChange('book_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {bookTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Price Range:</span>
            <div className="flex gap-2 flex-1 max-w-xs">
              <input
                type="number"
                placeholder="Min"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {books.map((book) => (
              <div
                key={book.book_id}
                className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-muted relative">
                  <img
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    src={book.cover_image || '/img/NoImage.png'}
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = '/img/NoImage.png';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getFormatBadge(book.book_type)}
                  </div>
                  {book.is_premium && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {book.genre || 'General'}
                    </span>
                    {book.rating && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600">
                        <FaStar className="h-3 w-3 fill-current" />
                        {book.rating}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold leading-tight text-foreground line-clamp-2 mb-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    by {book.author}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {book.short_description || book.description?.substring(0, 100) + '...'}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                      <FaDollarSign className="h-4 w-4" />
                      {book.price}
                    </div>
                    <button
                      onClick={() => openBookModal(book)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      <FaEye className="h-3 w-3" />
                      View Details
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {book.book_type === 'pdf' ? (
                      <>
                        {book.is_purchased ? (
                          <button
                            onClick={() => handleDownload(book)}
                            disabled={downloading}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 h-9 px-3 text-sm font-medium transition-colors"
                          >
                            <FaDownload className="h-3 w-3" />
                            {downloading ? 'Downloading...' : 'Download'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchase(book)}
                            disabled={purchasing}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-9 px-3 text-sm font-medium transition-colors"
                          >
                            <FaShoppingCart className="h-3 w-3" />
                            {purchasing ? 'Purchasing...' : 'Purchase'}
                          </button>
                        )}
                      </>
                    ) : book.book_type === 'audiobook' ? (
                      <>
                        {book.is_purchased ? (
                          <button
                            onClick={() => handleDownload(book)}
                            disabled={downloading}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 h-9 px-3 text-sm font-medium transition-colors"
                          >
                            <FaDownload className="h-3 w-3" />
                            {downloading ? 'Downloading...' : 'Download Audio'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchase(book)}
                            disabled={purchasing}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-9 px-3 text-sm font-medium transition-colors"
                          >
                            <FaShoppingCart className="h-3 w-3" />
                            {purchasing ? 'Purchasing...' : 'Purchase'}
                          </button>
                        )}
                      </>
                    ) : book.book_type === 'external' ? (
                      <a
                        href={book.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 text-sm font-medium transition-colors"
                      >
                        <FaExternalLinkAlt className="h-3 w-3" />
                        Visit Website
                      </a>
                    ) : (
                      <button
                        onClick={() => handlePurchase(book)}
                        disabled={purchasing}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-9 px-3 text-sm font-medium transition-colors"
                      >
                        <FaShoppingCart className="h-3 w-3" />
                        {purchasing ? 'Purchasing...' : 'Purchase'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FaBook className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No books found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {books.length} of {pagination.totalItems} books
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 h-9 px-3 gap-2"
              >
                <FaChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 h-9 px-3 gap-2"
              >
                Next
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Book Details Modal */}
      {showBookModal && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeBookModal}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeBookModal}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <div className="p-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={selectedBook.cover_image || '/img/NoImage.png'}
                    alt={selectedBook.title}
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                  <p className="text-lg text-gray-600 mb-4">by {selectedBook.author}</p>
                  <div className="flex items-center gap-4 mb-4">
                    {getFormatBadge(selectedBook.format)}
                    <span className="text-lg font-semibold text-primary">
                      ${selectedBook.price}
                    </span>
                    {selectedBook.rating && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <FaStar className="h-4 w-4 fill-current" />
                        {selectedBook.rating}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedBook.description}</p>
                  </div>
                  {selectedBook.isbn && (
                    <div className="mb-2">
                      <span className="font-semibold">ISBN:</span> {selectedBook.isbn}
                    </div>
                  )}
                  {selectedBook.publisher && (
                    <div className="mb-2">
                      <span className="font-semibold">Publisher:</span> {selectedBook.publisher}
                    </div>
                  )}
                  {selectedBook.pages && (
                    <div className="mb-2">
                      <span className="font-semibold">Pages:</span> {selectedBook.pages}
                    </div>
                  )}
                  {selectedBook.language && (
                    <div className="mb-4">
                      <span className="font-semibold">Language:</span> {selectedBook.language}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {selectedBook.format === 'pdf' ? (
                      <>
                        {selectedBook.is_purchased ? (
                          <button
                            onClick={() => handleDownload(selectedBook)}
                            disabled={downloading}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 h-10 px-4 text-sm font-medium transition-colors"
                          >
                            <FaDownload className="h-4 w-4" />
                            {downloading ? 'Downloading...' : 'Download PDF'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchase(selectedBook)}
                            disabled={purchasing}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10 px-4 text-sm font-medium transition-colors"
                          >
                            <FaShoppingCart className="h-4 w-4" />
                            {purchasing ? 'Purchasing...' : 'Purchase & Download'}
                          </button>
                        )}
                      </>
                    ) : selectedBook.format === 'website' ? (
                      <a
                        href={selectedBook.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm font-medium transition-colors"
                      >
                        <FaExternalLinkAlt className="h-4 w-4" />
                        Visit Website
                      </a>
                    ) : (
                      <button
                        onClick={() => handlePurchase(selectedBook)}
                        disabled={purchasing}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10 px-4 text-sm font-medium transition-colors"
                      >
                        <FaShoppingCart className="h-4 w-4" />
                        {purchasing ? 'Processing...' : 'Order Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookMarketplacePage;
