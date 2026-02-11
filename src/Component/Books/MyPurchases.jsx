import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import booksAPI from '../../services/booksAPI';
import {
  FaBook,
  FaDownload,
  FaExternalLinkAlt,
  FaEye,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaSync,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyPurchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    book_type: 'all',
    sort: 'newest',
    per_page: 12,
    page: 1
  });
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await booksAPI.getMyPurchases(filters);
      setPurchases(response.data || []);
      setPagination(response.meta || {});
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleDownload = async (purchase) => {
    if (!purchase.download_token) {
      toast.error('Download not available');
      return;
    }

    setDownloading(prev => ({ ...prev, [purchase.purchase_id]: true }));
    
    try {
      const blob = await booksAPI.downloadBook(purchase.download_token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from content-disposition header or create default
      const filename = `${purchase.listing.title} - ${purchase.listing.author}.${purchase.listing.file_type || 'pdf'}`;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started!');
      
      // Update download count
      setPurchases(prev => prev.map(p => 
        p.purchase_id === purchase.purchase_id 
          ? { ...p, total_downloads: (p.total_downloads || 0) + 1 }
          : p
      ));
    } catch (error) {
      toast.error('Download failed: ' + error.message);
    } finally {
      setDownloading(prev => ({ ...prev, [purchase.purchase_id]: false }));
    }
  };

  const isDownloadAvailable = (purchase) => {
    return purchase.payment_status === 'completed' && 
           purchase.download_token && 
           (!purchase.download_token_expires_at || new Date(purchase.download_token_expires_at) > new Date());
  };

  const getStatusBadge = (purchase) => {
    const { payment_status, download_token, download_token_expires_at } = purchase;
    
    if (payment_status !== 'completed') {
      return {
        color: 'yellow',
        icon: <FaClock className="w-3 h-3" />,
        text: 'Payment Pending'
      };
    }
    
    if (!download_token) {
      return {
        color: 'red',
        icon: <FaTimesCircle className="w-3 h-3" />,
        text: 'Download Not Available'
      };
    }
    
    if (new Date(download_token_expires_at) <= new Date()) {
      return {
        color: 'red',
        icon: <FaExclamationTriangle className="w-3 h-3" />,
        text: 'Download Expired'
      };
    }
    
    return {
      color: 'green',
      icon: <FaCheckCircle className="w-3 h-3" />,
      text: 'Available'
    };
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      book_type: 'all',
      sort: 'newest',
      per_page: 12,
      page: 1
    });
  };

  const refreshPurchases = () => {
    fetchPurchases();
  };

  const PurchaseCard = ({ purchase }) => {
    const status = getStatusBadge(purchase);
    const canDownload = isDownloadAvailable(purchase);
    const isDownloading = downloading[purchase.purchase_id];

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Book cover */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
          {purchase.listing.images && purchase.listing.images.length > 0 ? (
            <img
              src={purchase.listing.images[0].image_path}
              alt={purchase.listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FaBook className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 bg-${status.color}-100 text-${status.color}-700 text-xs rounded-full`}>
              {status.icon}
              {status.text}
            </span>
          </div>

          {/* Book type badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {purchase.listing.book_type}
            </span>
          </div>
        </div>

        {/* Purchase info */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">
              {purchase.listing.title}
            </h3>
            <p className="text-sm text-gray-600">by {purchase.listing.author}</p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {purchase.listing.genre}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {purchase.listing.format}
            </span>
            {purchase.listing.condition && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {purchase.listing.condition}
              </span>
            )}
          </div>

          {/* Purchase details */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Purchase Date:</span>
              <span className="font-medium">
                {new Date(purchase.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price Paid:</span>
              <span className="font-medium text-green-600">${purchase.price_paid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Downloads:</span>
              <span className="font-medium">{purchase.total_downloads || 0}</span>
            </div>
            {purchase.download_token_expires_at && canDownload && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium text-orange-600">
                  {new Date(purchase.download_token_expires_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate(`/books/${purchase.listing.listing_id}`)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              <FaEye className="w-4 h-4" />
              View Details
            </button>
            
            {canDownload ? (
              <button
                onClick={() => handleDownload(purchase)}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isDownloading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FaDownload className="w-4 h-4" />
                    Download Now
                  </>
                )}
              </button>
            ) : (
              <div className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded text-center text-sm">
                {status.text}
              </div>
            )}

            {purchase.listing.website_url && (
              <a
                href={purchase.listing.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200"
              >
                <FaExternalLinkAlt className="w-4 h-4" />
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your purchases...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Book Purchases</h1>
              <p className="text-gray-600 mt-1">View and download your purchased books</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshPurchases}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FaSync className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FaFilter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search your purchases..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available for Download</option>
                  <option value="expired">Download Expired</option>
                  <option value="pending">Payment Pending</option>
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
                  <option value="all">All Types</option>
                  <option value="physical">Physical Books</option>
                  <option value="pdf">PDF Downloads</option>
                  <option value="audiobook">Audiobooks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="title_az">Title: A-Z</option>
                </select>
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
              <span>Showing {purchases.length} of {pagination.total} purchases</span>
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
              <option value={24}>24</option>
              <option value={36}>36</option>
            </select>
          </div>
        </div>

        {/* Purchases grid */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchases.map(purchase => (
              <PurchaseCard key={purchase.purchase_id} purchase={purchase} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
            <p className="text-gray-600 mb-4">
              You haven't purchased any books yet, or no purchases match your filters.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/books')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Books
              </button>
              {filters.search || filters.status !== 'all' || filters.book_type !== 'all' ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
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

export default MyPurchases;
