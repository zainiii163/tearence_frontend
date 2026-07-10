import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiList, FiSearch, FiPlus } from 'react-icons/fi';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { buysellAPI } from '../api/buysell';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import BuySellHero from '../Component/buy-sell/BuySellHero';
import BuySellCategoryGrid from '../Component/buy-sell/BuySellCategoryGrid';
import BuySellFilters from '../Component/buy-sell/BuySellFilters';
import BuySellGrid from '../Component/buy-sell/BuySellGrid';
import BuySellActivityFeed from '../Component/buy-sell/BuySellActivityFeed';
import BuySellPostForm from '../Component/buy-sell/BuySellPostForm';
import ErrorBoundary from '../Component/ErrorBoundary/ErrorBoundary';
import Footer from '../Component/Footer';

const BuySellPage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/buy-sell?postForm=true', 'You must be logged in to post an item for sale.')) {
      setShowPostForm(true);
    }
  };

  // Check for postForm parameter (only if authenticated)
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const fetchAdverts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        category: selectedCategory,
        search: searchTerm,
        sortBy: sortBy,
        sortOrder: 'desc',
        condition: filters.condition || '',
        priceMin: filters.priceRange ? filters.priceRange.split('-')[0] : '',
        priceMax: filters.priceRange ? filters.priceRange.split('-')[1] : '',
        country: filters.location ? filters.location.split(',')[0] : '',
        city: filters.location ? filters.location.split(',')[1] : '',
        featured: filters.featured || false,
        promoted: filters.promoted || false,
        sponsored: filters.sponsored || false,
        urgent: filters.urgent || false
      };

      const response = await buysellAPI.getAdverts(params);
      setAdverts(response.items || []);
      setPagination({
        currentPage: response.meta?.current_page || 1,
        totalPages: response.meta?.last_page || 1,
        totalItems: response.meta?.total || 0,
        itemsPerPage: response.meta?.per_page || 20
      });
    } catch (error) {
      console.error('Error fetching adverts:', error);
      // Set empty state on error
      setAdverts([]);
      setPagination(prev => ({ ...prev, totalPages: 1, totalItems: 0 }));
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, filters, sortBy, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
    // Refresh data to show new item
    fetchAdverts();
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton={true} />
        
        {/* Hero Section */}
        <ErrorBoundary>
          <BuySellHero 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </ErrorBoundary>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <ErrorBoundary>
                <BuySellFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  activeFiltersCount={getActiveFiltersCount()}
                  selectedCategory={selectedCategory}
                />
              </ErrorBoundary>
            </div>

            {/* Results Section */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' ? 'All Items' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {loading ? 'Loading...' : `${pagination.totalItems} items found`}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="nearest">Nearest First</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      <FiGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      <FiList className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Grid (when all categories selected) */}
              {selectedCategory === 'all' && (
                <ErrorBoundary>
                  <BuySellCategoryGrid onSelectCategory={setSelectedCategory} />
                </ErrorBoundary>
              )}

              {/* Items Grid/List */}
              {selectedCategory !== 'all' && (
                <ErrorBoundary>
                  <BuySellGrid
                    adverts={adverts}
                    loading={loading}
                    viewMode={viewMode}
                  />
                </ErrorBoundary>
              )}

              {/* No Results */}
              {!loading && adverts.length === 0 && selectedCategory !== 'all' && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FiSearch className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="mt-12">
            <ErrorBoundary>
              <BuySellActivityFeed />
            </ErrorBoundary>
          </div>
        </div>

        {/* Post Form Modal */}
        <AnimatePresence>
          {showPostForm && (
            <ErrorBoundary>
              <BuySellPostForm onClose={handleClosePostForm} onSuccess={fetchAdverts} />
            </ErrorBoundary>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer />
    </ErrorBoundary>
  );
};

export default BuySellPage;
