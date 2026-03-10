import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiGrid, FiList, FiMapPin, FiDollarSign, 
  FiTag, FiX, FiChevronDown, FiHeart, FiShare2, FiPlus, FiStar,
  FiTrendingUp, FiClock, FiUser, FiShoppingBag, FiHome, FiCar,
  FiSmartphone, FiBook, FiGamepad2, FiActivity, FiMonitor, FiCamera,
  FiMusic, FiTool, FiPackage
} from 'react-icons/fi';
import { 
  FaCar, FaHome, FaBook, FaTshirt, FaMobile, FaLaptop, FaChair, 
  FaDumbbell, FaBaby, FaGamepad, FaCamera, FaMusic, FaPaintBrush, FaDog
} from 'react-icons/fa';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import BuySellNavbar from '../Component/buy-sell/BuySellNavbar';
import BuySellHero from '../Component/buy-sell/BuySellHero';
import BuySellCategoryGrid from '../Component/buy-sell/BuySellCategoryGrid';
import BuySellFilters from '../Component/buy-sell/BuySellFilters';
import BuySellGrid from '../Component/buy-sell/BuySellGrid';
import BuySellActivityFeed from '../Component/buy-sell/BuySellActivityFeed';
import BuySellPostForm from '../Component/buy-sell/BuySellPostForm';
import { mockBuySellData } from '../data/mockBuySellData';

const BuySellPage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchAdverts();
  }, [selectedCategory, searchTerm, filters, sortBy]);

  const fetchAdverts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredData = [...mockBuySellData];
      
      // Apply category filter
      if (selectedCategory !== 'all') {
        filteredData = filteredData.filter(item => item.category === selectedCategory);
      }
      
      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply other filters
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(v => v === '+' ? Infinity : parseInt(v));
        filteredData = filteredData.filter(item => {
          const price = item.price || 0;
          return price >= min && (max === undefined || price <= max);
        });
      }
      
      if (filters.condition && filters.condition !== 'all') {
        filteredData = filteredData.filter(item => item.condition === filters.condition);
      }
      
      if (filters.location) {
        filteredData = filteredData.filter(item => 
          item.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Apply sorting
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case 'price_low':
            return (a.price || 0) - (b.price || 0);
          case 'price_high':
            return (b.price || 0) - (a.price || 0);
          case 'popular':
            return (b.views || 0) - (a.views || 0);
          case 'nearest':
            return a.distance - b.distance;
          default: // newest
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
      
      setAdverts(filteredData);
    } catch (error) {
      console.error('Error fetching adverts:', error);
    } finally {
      setLoading(false);
    }
  };

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
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const handlePostItemClick = () => {
    setShowPostForm(true);
    setSearchParams({ postForm: 'true' });
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BuySellNavbar />
      
      {/* Hero Section */}
      <BuySellHero 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <BuySellFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              activeFiltersCount={getActiveFiltersCount()}
              selectedCategory={selectedCategory}
            />
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
                  {loading ? 'Loading...' : `${adverts.length} items found`}
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
              <BuySellCategoryGrid onSelectCategory={setSelectedCategory} />
            )}

            {/* Items Grid/List */}
            {selectedCategory !== 'all' && (
              <BuySellGrid
                adverts={adverts}
                loading={loading}
                viewMode={viewMode}
              />
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
          <BuySellActivityFeed />
        </div>
      </div>

      {/* Floating Post Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={handlePostClick}
        className="fixed bottom-8 right-8 z-50 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-colors group"
      >
        <FiPlus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Post Item
        </span>
      </motion.button>

      {/* Post Form Modal */}
      <AnimatePresence>
        {showPostForm && (
          <BuySellPostForm onClose={handleClosePostForm} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuySellPage;
