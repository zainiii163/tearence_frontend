import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  MousePointer, 
  Calendar,
  TrendingUp,
  Crown,
  Star,
  ExternalLink,
  Play
} from 'lucide-react';
import { 
  getBannerAds,
  getFeaturedBannerAds,
  getBannerCategories,
  trackBannerClick,
  getBannerAdsByCategory
} from '../../api/banner';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Footer';

const BannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [featuredBanners, setFeaturedBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('mostRecent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const sortOptions = [
    { value: 'mostRecent', label: 'Most Recent' },
    { value: 'mostViewed', label: 'Most Viewed' },
    { value: 'mostClicked', label: 'Most Clicked' },
    { value: 'trending', label: 'Trending' },
    { value: 'featured', label: 'Featured' }
  ];

  // Load initial data
  useEffect(() => {
    loadBannerData();
  }, [searchQuery, selectedCategory, sortBy]);

  const loadBannerData = async () => {
    try {
      setLoading(true);
      setError(null);

      let bannerResponse;
      
      // Load based on selected category or all banners
      if (selectedCategory) {
        bannerResponse = await getBannerAdsByCategory(selectedCategory, {
          search: searchQuery,
          sort_by: sortBy,
          per_page: 20
        });
      } else if (sortBy === 'featured') {
        bannerResponse = await getFeaturedBannerAds({
          search: searchQuery,
          per_page: 20
        });
      } else if (sortBy === 'mostViewed') {
        bannerResponse = await getMostViewedBannerAds({
          search: searchQuery,
          per_page: 20
        });
      } else if (sortBy === 'mostRecent') {
        bannerResponse = await getRecentBannerAds({
          search: searchQuery,
          per_page: 20
        });
      } else {
        bannerResponse = await getBannerAds({
          search: searchQuery,
          sort_by: sortBy,
          per_page: 20
        });
      }

      // Load categories and featured banners
      const [categoriesResponse, featuredResponse] = await Promise.all([
        getBannerCategories(),
        getFeaturedBannerAds({ per_page: 5 })
      ]);

      // Handle banner response
      if (bannerResponse) {
        const bannerData = bannerResponse.data || bannerResponse;
        setBanners(Array.isArray(bannerData) ? bannerData : []);
      } else {
        setBanners([]);
      }

      // Handle categories response
      if (categoriesResponse) {
        const catsData = categoriesResponse.data || categoriesResponse;
        setCategories(Array.isArray(catsData) ? catsData : []);
      } else {
        setCategories([]);
      }

      // Handle featured response
      if (featuredResponse) {
        const featuredData = featuredResponse.data || featuredResponse;
        setFeaturedBanners(Array.isArray(featuredData) ? featuredData : []);
      } else {
        setFeaturedBanners([]);
      }
    } catch (err) {
      console.error('Error loading banner data:', err);
      setError(err.message || 'Failed to load banner data');
      // Reset data on error
      setBanners([]);
      setCategories([]);
      setFeaturedBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle banner click
  const handleBannerClick = async (banner) => {
    try {
      // Track the click if banner has a slug and is not a local catalog pack
      if (banner.slug && !banner.is_catalog) {
        await trackBannerClick(banner.slug);
      }
      
      // Open the target URL
      const targetUrl = banner.destination_link || banner.target_url || banner.url;
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      
      // Update local click count
      setBanners(prev => prev.map(b => 
        b.id === banner.id 
          ? { ...b, click_count: (b.click_count || 0) + 1 }
          : b
      ));
    } catch (err) {
      console.error('Error tracking banner click:', err);
      // Still open the URL even if tracking fails
      const targetUrl = banner.destination_link || banner.target_url || banner.url;
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Get banner type icon
  const getBannerTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return Play;
      case 'animated':
        return Star;
      default:
        return Eye;
    }
  };

  // Format banner size display
  const formatBannerSize = (size) => {
    const sizes = {
      'leaderboard': '728×90',
      'medium_rectangle': '300×250',
      'large_rectangle': '336×280',
      'skyscraper': '120×600',
      'wide_skyscraper': '160×600',
      'square': '250×250',
      'mobile_banner': '320×50'
    };
    return sizes[size] || size;
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

  if (loading && banners.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Banners...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="page-container py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Discover Banner Advertisements</h1>
            <p className="text-xl mb-8 text-blue-100">
              Explore premium banner ads from verified businesses and brands
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search banner advertisements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Featured Banners */}
        {featuredBanners.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Banners</h2>
              <Crown className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBanners.map((banner) => (
                <motion.div
                  key={banner.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-yellow-200"
                >
                  <div className="relative">
                    <img
                      src={banner.image_url || banner.banner_image || banner.image || '/img/banner/default-banner.jpg'}
                      alt={banner.title || banner.business_name || 'Banner'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/img/banner/default-banner.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        Featured
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{banner.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {banner.view_count || 0}
                        </span>
                        <span className="flex items-center">
                          <MousePointer className="w-3 h-3 mr-1" />
                          {banner.click_count || 0}
                        </span>
                      </div>
                      <button
                        onClick={() => handleBannerClick(banner)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

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
                {banners.length} Banner Ads
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Banners Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        >
          {banners.map((banner) => {
            const TypeIcon = getBannerTypeIcon(banner.type);
            
            return viewMode === 'grid' ? (
              <motion.div
                key={banner.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleBannerClick(banner)}
              >
                <div className="relative">
                  <img
                    src={banner.image_url || banner.banner_image || banner.image || '/img/banner/default-banner.jpg'}
                    alt={banner.title || banner.business_name || 'Banner'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/img/banner/default-banner.jpg';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <TypeIcon className="w-3 h-3" />
                      {formatBannerSize(banner.size)}
                    </div>
                  </div>
                  {banner.status === 'active' && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        Active
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{banner.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{banner.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {banner.view_count || 0}
                      </span>
                      <span className="flex items-center">
                        <MousePointer className="w-3 h-3 mr-1" />
                        {banner.click_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      <span className="text-xs">Visit</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={banner.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleBannerClick(banner)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={banner.image_url || banner.banner_image || banner.image || '/img/banner/default-banner.jpg'}
                    alt={banner.title || banner.business_name || 'Banner'}
                    className="w-24 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/img/banner/default-banner.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{banner.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <TypeIcon className="w-3 h-3" />
                          {formatBannerSize(banner.size)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {banner.view_count || 0} views
                        </span>
                        <span className="flex items-center">
                          <MousePointer className="w-3 h-3 mr-1" />
                          {banner.click_count || 0} clicks
                        </span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        <span className="text-xs">Visit Ad</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {banners.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BannersPage;
