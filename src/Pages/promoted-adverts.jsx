import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Menu, X, ChevronDown, Globe, TrendingUp, Star, Heart, Eye, MapPin, Phone, Mail, Check, Crown, Zap, Shield, Rocket } from 'lucide-react';
import useAuthRedirect from '../hooks/useAuthRedirect';

// Import components
import UnifiedNavbar from '../Component/UnifiedNavbar';
import PromotedHero from '../Component/promoted-new/PromotedHero';
import PromotedCategoryGrid from '../Component/promoted-new/PromotedCategoryGrid';
import PromotedCarousel from '../Component/promoted-new/PromotedCarousel';
import PromotedGrid from '../Component/promoted-new/PromotedGrid';
import PromotedFilters from '../Component/promoted-new/PromotedFilters';
import PromotedActivityFeed from '../Component/promoted-new/PromotedActivityFeed';
import PromotedSellerProfile from '../Component/promoted-new/PromotedSellerProfile';
import PromotedUpsellBanner from '../Component/promoted-new/PromotedUpsellBanner';
import PromotedFooter from '../Component/promoted-new/PromotedFooter';
import PromotedPostForm from '../Component/promoted-new/PromotedPostForm';

// Import API
import { promotedAdvertsAPI, categoriesAPI, promotedAdvertsUtils } from '../services/promotedAdvertsAPI';

const PromotedAdvertsPage = () => {
  const { requireAuth } = useAuthRedirect();
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredAdverts, setFeaturedAdverts] = useState([]);

  // Handle post promoted advert with authentication
  const handlePostPromoted = () => {
    if (requireAuth('/promoted-adverts?postForm=true', 'You must be logged in to post a promoted advert.')) {
      setShowPostForm(true);
    }
  };
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 12,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    city: '',
    priceRange: { min: 0, max: 10000 },
    advertType: '',
    verifiedOnly: false,
    promotionTier: '',
    featured: false,
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for postForm URL parameter and open form modal
  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      // Check if user is authenticated before showing form
      if (requireAuth('/promoted-adverts?postForm=true', 'You must be logged in to post a promoted advert.')) {
        setShowPostForm(true);
        // Remove the parameter from URL to prevent form reopening on refresh
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('postForm');
        navigate(`/promoted-adverts${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`, { replace: true });
      }
    }
  }, [searchParams]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load adverts when filters, search, or pagination change
  useEffect(() => {
    loadAdverts();
  }, [filters, searchQuery, sortBy, sortOrder, pagination.currentPage]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load categories and featured adverts in parallel
      const [categoriesData, featuredData] = await Promise.all([
        categoriesAPI.getCategories(),
        promotedAdvertsAPI.getFeatured(),
      ]);

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }

      if (featuredData.success) {
        setFeaturedAdverts(featuredData.data);
      }

      // Load initial adverts
      await loadAdverts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAdverts = async () => {
    try {
      console.log('PromotedAdvertsPage - Loading adverts...');
      const params = {
        page: pagination.currentPage,
        per_page: pagination.perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (filters.country) params.country = filters.country;
      if (searchQuery) params.search = searchQuery;

      // Prefer cross-category site feed (Clive: pull from existing categories)
      let response = await promotedAdvertsAPI.getSiteFeed(params);
      let rows = response?.data?.data;
      let pageMeta = response?.data;

      if (!response?.success || !Array.isArray(rows) || rows.length === 0) {
        const legacyParams = {
          page: pagination.currentPage,
          per_page: pagination.perPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        };
        if (filters.category) legacyParams.category = filters.category;
        if (filters.country) legacyParams.country = filters.country;
        if (filters.advertType) legacyParams.advert_type = filters.advertType;
        if (filters.promotionTier) legacyParams.promotion_tier = filters.promotionTier;
        if (filters.featured) legacyParams.featured = 1;
        if (filters.verifiedOnly) legacyParams.verified_only = 1;
        if (filters.priceRange.min > 0) legacyParams.min_price = filters.priceRange.min;
        if (filters.priceRange.max < 10000) legacyParams.max_price = filters.priceRange.max;
        if (searchQuery) legacyParams.search = searchQuery;

        response = await promotedAdvertsAPI.getAdverts(legacyParams);
        rows = response?.data?.data;
        pageMeta = response?.data;
      }

      if (response?.success) {
        setAdverts(Array.isArray(rows) ? rows : []);
        setPagination({
          currentPage: pageMeta?.current_page || 1,
          totalPages: pageMeta?.last_page || 1,
          perPage: pageMeta?.per_page || pagination.perPage,
          total: pageMeta?.total || 0,
        });
      }
    } catch (err) {
      console.error('PromotedAdvertsPage - Error loading adverts:', err);
      setError(err.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleFilterChange({ category });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleAdvertClick = async (advert) => {
    try {
      if (advert.slug) {
        await promotedAdvertsAPI.trackClick(advert.slug);
      }
    } catch (err) {
      console.error('Failed to track click:', err);
    }
    const href = advert.href || `/promoted-adverts/${advert.slug || advert.id}`;
    navigate(href);
  };

  const handleToggleFavorite = async (advertId) => {
    try {
      await promotedAdvertsAPI.toggleFavorite(advertId);
      // Refresh adverts to update favorite status
      await loadAdverts();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (loading && adverts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading promoted adverts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && adverts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadInitialData}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <UnifiedNavbar showBackButton={true} />

      {/* Hero Section */}
      <PromotedHero 
        onSearch={handleSearch} 
        onPostPromoted={handlePostPromoted}
        searchQuery={searchQuery}
      />

      {/* Main Content */}
      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Promoted Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PromotedCarousel adverts={featuredAdverts} onAdvertClick={handleAdvertClick} />
            </motion.div>

            {/* Category Explorer Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <PromotedCategoryGrid 
                categories={categories}
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </motion.div>

            {/* Filters and Listings Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <PromotedFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  onSortOrderChange={handleSortOrderChange}
                  categories={categories}
                />
              </div>

              <PromotedGrid
                adverts={adverts}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onAdvertClick={handleAdvertClick}
                onToggleFavorite={handleToggleFavorite}
                filters={filters}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            </div>

            {/* Promoted Seller Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Crown className="h-6 w-6 text-orange-500" />
                  Promoted Sellers
                </h2>
                <PromotedSellerProfile />
              </div>
            </motion.div>

            {/* Upsell Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <PromotedUpsellBanner onUpgrade={() => setShowPostForm(true)} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24"
            >
              <PromotedActivityFeed />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <PromotedFooter />

      {/* Post Form Modal */}
      <AnimatePresence>
        {showPostForm && (
          <PromotedPostForm onClose={() => setShowPostForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotedAdvertsPage;
