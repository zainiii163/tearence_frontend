import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, Globe, Crown, TrendingUp, Loader2, Eye, X } from 'lucide-react';
import useAuthRedirect from '../hooks/useAuthRedirect';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import SponsoredHero from '../Component/sponsored/SponsoredHero';
import SponsoredCategoryGrid from '../Component/sponsored/SponsoredCategoryGrid';
import SponsoredAdvertCard from '../Component/sponsored/SponsoredAdvertCard';
import SponsoredFilters from '../Component/sponsored/SponsoredFilters';
import SponsoredSellerProfile from '../Component/sponsored/SponsoredSellerProfile';
import SponsoredActivityFeed from '../Component/sponsored/SponsoredActivityFeed';
import SponsoredPostForm from '../Component/sponsored/SponsoredPostForm';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SponsoredAdvertsPage = () => {
  const { requireAuth } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Function to close modal and clear URL parameter
  const handleCloseModal = () => {
    setShowPostForm(false);
    // Remove postForm parameter from URL
    navigate('/sponsored-adverts', { replace: true });
  };

  // State management
  const [adverts, setAdverts] = useState([]);
  const [filteredAdverts, setFilteredAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homepageStats, setHomepageStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('mostRecent');
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 12
  });

  // Handle post sponsored advert with authentication
  const handlePostSponsored = () => {
    if (requireAuth('/sponsored-adverts?postForm=true', 'You must be logged in to post a sponsored advert.')) {
      setShowPostForm(true);
    }
  };

  // Handle form submission and data saving
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await sponsoredAdvertsAPI.createSponsoredAdvert(formData);

      if (response.success) {
        alert('Sponsored advert created successfully!');
        handleCloseModal();
        await loadInitialData();
      } else {
        setError(response.message || 'Failed to create sponsored advert');
      }
    } catch (err) {
      setError(err.message || 'Failed to create sponsored advert');
      console.error('Form submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check for postForm parameter in URL
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true') {
      // User is returning from login, check authentication and show form
      if (requireAuth('/sponsored-adverts?postForm=true', 'You must be logged in to post a sponsored advert.')) {
        setShowPostForm(true);
      }
    }
  }, [searchParams, requireAuth]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data using new API
      const [statsRes, catRes, advertsRes] = await Promise.allSettled([
        sponsoredAdvertsAPI.getStatistics(),
        sponsoredAdvertsAPI.getCategories(),
        sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 12, page: 1 }),
      ]);

      // Handle stats data
      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setHomepageStats(statsRes.value.data);
      }

      // Handle categories data
      if (catRes.status === 'fulfilled' && catRes.value?.success) {
        const categoriesData = Array.isArray(catRes.value.data) ? catRes.value.data : (catRes.value.data?.data || []);
        setCategories(categoriesData);
        console.log('Categories loaded:', categoriesData);
      } else {
        console.warn('Categories failed to load:', catRes.reason);
        setCategories([]);
      }

      // Handle adverts data
      if (advertsRes.status === 'fulfilled' && advertsRes.value?.success) {
        const advertsData = Array.isArray(advertsRes.value.data) ? advertsRes.value.data : (advertsRes.value.data?.data || []);
        setAdverts(advertsData);
        setFilteredAdverts(advertsData);

        const meta = advertsRes.value.meta || advertsRes.value.data;
        if (meta) {
          setPagination({
            currentPage: meta.current_page || 1,
            totalPages: meta.last_page || 1,
            total: meta.total || 0,
            perPage: meta.per_page || 12
          });
        }
      } else {
        console.warn('Adverts failed to load:', advertsRes.reason);
        setAdverts([]);
        setFilteredAdverts([]);
      }

    } catch (err) {
      setError(err.message || 'Failed to load initial data');
      console.error('Failed to load initial data:', err);
      setAdverts([]);
      setFilteredAdverts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Load live activity - using real API now that endpoints are working
  useEffect(() => {
    const loadLiveActivity = async () => {
      try {
        // Activity feed is handled by SponsoredActivityFeed component
        // No need to load separately here
      } catch (err) {
        console.warn('Failed to load live activity:', err);
      }
    };

    loadLiveActivity();
  }, []);

  // Search and filter functionality
  const handleSearch = useCallback(async (query = searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = {
        keyword: query,
        category: selectedCategory,
        country: selectedCountry,
        min_price: priceRange[0],
        max_price: priceRange[1],
        sort_by: sortBy === 'mostRecent' ? 'created_at' : sortBy === 'mostViewed' ? 'views_count' : sortBy === 'trending' ? 'views_count' : sortBy === 'priceLow' || sortBy === 'priceHigh' ? 'price' : 'created_at',
        sort_order: sortBy === 'priceLow' ? 'asc' : 'desc',
        per_page: pagination.perPage,
        page: 1
      };

      const response = await sponsoredAdvertsAPI.getSponsoredAdverts(searchParams);
      
      if (response.success) {
        const advertsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setAdverts(advertsData);
        setFilteredAdverts(advertsData);
        
        const meta = response.meta || response.data;
        if (meta) {
          setPagination({
            currentPage: meta.current_page || 1,
            totalPages: meta.last_page || 1,
            total: meta.total || 0,
            perPage: meta.per_page || 12
          });
        }
      } else {
        setError(response.message || 'Search failed');
      }
    } catch (err) {
      setError(err.message || 'Search failed');
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedCountry, sortBy, priceRange, pagination.perPage]);

  // Apply filters and search
  useEffect(() => {
    if (searchQuery || selectedCategory || selectedCountry || sortBy !== 'mostRecent') {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      // Reset to all adverts if no filters
      setFilteredAdverts(adverts);
    }
  }, [searchQuery, selectedCategory, selectedCountry, sortBy, priceRange, adverts, handleSearch]);

  const handleLoadMore = async () => {
    if (pagination.currentPage >= pagination.totalPages) return;
    
    try {
      setLoading(true);
      const searchParams = {
        keyword: searchQuery,
        category: selectedCategory,
        country: selectedCountry,
        min_price: priceRange[0],
        max_price: priceRange[1],
        sort_by: sortBy === 'mostRecent' ? 'created_at' : sortBy === 'mostViewed' ? 'views_count' : sortBy === 'trending' ? 'views_count' : sortBy === 'priceLow' || sortBy === 'priceHigh' ? 'price' : 'created_at',
        sort_order: sortBy === 'priceLow' ? 'asc' : 'desc',
        per_page: pagination.perPage,
        page: pagination.currentPage + 1
      };

      const result = await sponsoredAdvertsAPI.getSponsoredAdverts(searchParams);
      const newAdverts = Array.isArray(result.data) ? result.data : (result.data?.data || []);
      
      setAdverts(prev => [...prev, ...newAdverts]);
      setFilteredAdverts(prev => [...prev, ...newAdverts]);
      
      const meta = result.meta || result.data;
      if (meta) {
        setPagination(prev => ({
          ...prev,
          currentPage: meta.current_page || prev.currentPage + 1,
          total: meta.total || prev.total
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error('Load more failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSellerClick = (seller) => {
    setSelectedSeller(seller);
  };

  // Handle save advert
  const handleSaveAdvert = async (advertId) => {
    try {
      // For now, just toggle the saved state locally
      // TODO: Implement actual save advert API call
      setSavedAdverts(prev => 
        prev.includes(advertId) 
          ? prev.filter(id => id !== advertId)
          : [...prev, advertId]
      );
      
      // Show success message
      alert(advertId in savedAdverts ? 'Advert removed from saved!' : 'Advert saved successfully!');
    } catch (err) {
      console.error('Save advert failed:', err);
    }
  };

  // Handle view advert
  const handleViewAdvert = async (advert) => {
    try {
      // Track view analytics event
      await sponsoredAdvertsAPI.trackView(advert.id);

      // Update recently viewed
      setRecentlyViewed(prev => {
        const filtered = prev.filter(id => id !== advert.id);
        return [advert.id, ...filtered].slice(0, 10);
      });
    } catch (error) {
      console.error('View advert failed:', error);
    }
  };

  // Loading state
  if (loading && adverts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Sponsored Adverts...</p>
        </div>
      </div>
    );
  } else if (loading && adverts.length > 0) {
    // Show loading indicator at bottom when loading more
    return null;
  }

  // Error state
  if (error && adverts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={loadInitialData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} />

      <SponsoredHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />

      <div className="page-container py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">
                  {homepageStats?.sponsored_ads || '12,456'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Sponsored Ads</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">
                  {homepageStats?.countries || '142'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">
                  {homepageStats?.total_views || '45.2M'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">
                  {homepageStats?.satisfaction || '98%'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <SponsoredCategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {pagination.total} Sponsored Ads
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mostRecent">Most Recent</option>
                <option value="mostViewed">Most Viewed</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <SponsoredFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Adverts Grid */}
        {loading && adverts.length > 0 ? (
          <div className="grid gap-6 mb-8">
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading more adverts...</p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 mb-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredAdverts.map((advert) => (
              <SponsoredAdvertCard
                key={advert.sponsored_advert_id || advert.id}
                advert={advert}
                viewMode={viewMode}
                isSaved={savedAdverts.includes(advert.sponsored_advert_id || advert.id)}
                onSave={() => handleSaveAdvert(advert.sponsored_advert_id || advert.id)}
                onView={() => handleViewAdvert(advert)}
                onSellerClick={() => handleSellerClick(advert.seller)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {pagination.currentPage < pagination.totalPages && (
          <div className="text-center mb-12">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Sponsored Ads'
              )}
            </button>
          </div>
        )}

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SponsoredActivityFeed />
          </div>
          <div>
            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Recently Viewed</h3>
                <div className="space-y-3">
                  {recentlyViewed.slice(0, 5).map((advertId) => {
                    const advert = adverts.find(a => a.id === advertId);
                    return advert ? (
                      <div key={advertId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={advert.main_image || advert.image || '/img/NoImage.png'} 
                          alt={advert.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{advert.title}</p>
                          <p className="text-xs text-gray-600">{advert.price}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Premium Promotion */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center mb-4">
                <Crown className="w-6 h-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold">Go Premium</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Get maximum visibility for your adverts with our Premium sponsorship packages.
              </p>
              <p className="text-xs text-gray-600">
                Manage and upgrade your ads from your dashboard after logging in.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Profile Modal */}
      <AnimatePresence>
        {selectedSeller && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSeller(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <SponsoredSellerProfile 
                sellerId={selectedSeller?.id || selectedSeller}
                onClose={() => setSelectedSeller(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Form Modal */}
      <AnimatePresence>
        {showPostForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <SponsoredPostForm
                onCancel={handleCloseModal}
                onSuccess={() => {
                  handleCloseModal();
                  loadInitialData();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default SponsoredAdvertsPage;
