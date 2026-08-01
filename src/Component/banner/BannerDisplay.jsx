import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Play,
  Plus,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  BarChart3,
  Users,
  Globe,
  Target,
  DollarSign,
  Clock,
  MapPin,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { 
  getBannerAds,
  getFeaturedBannerAds,
  getMostViewedBannerAds,
  getRecentBannerAds,
  getBannerCategories,
  trackBannerClick,
  getBannerAdsByCategory
} from '../../api/banner';
import BannerSubmissionForm from './BannerSubmissionForm';

const BannerDisplay = ({ showCreateButton = true, maxHeight = 'auto' }) => {
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showBannerDetail, setShowBannerDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBanners: 0,
    activeBanners: 0,
    totalViews: 0,
    totalClicks: 0
  });

  const sortOptions = [
    { value: 'mostRecent', label: 'Most Recent', icon: Calendar },
    { value: 'mostViewed', label: 'Most Viewed', icon: Eye },
    { value: 'mostClicked', label: 'Most Clicked', icon: MousePointer },
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'featured', label: 'Featured', icon: Crown }
  ];

  const bannerTypes = {
    image: { icon: Eye, label: 'Image' },
    animated: { icon: Play, label: 'Animated' },
    html5: { icon: Star, label: 'HTML5' },
    video: { icon: Play, label: 'Video' }
  };

  const promotionTiers = {
    standard: { color: 'gray', icon: Star, label: 'Standard' },
    promoted: { color: 'blue', icon: TrendingUp, label: 'Promoted' },
    featured: { color: 'yellow', icon: Crown, label: 'Featured' },
    sponsored: { color: 'purple', icon: Star, label: 'Sponsored' },
    network_boost: { color: 'red', icon: Crown, label: 'Top Spotlight' }
  };

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
          sort_by: sortBy === 'mostRecent' ? 'created_at' : sortBy === 'mostViewed' ? 'views_count' : sortBy,
          sort_order: 'desc',
          limit: 20
        });
      } else if (sortBy === 'featured') {
        bannerResponse = await getFeaturedBannerAds({
          search: searchQuery,
          limit: 20
        });
      } else if (sortBy === 'mostViewed') {
        bannerResponse = await getMostViewedBannerAds({
          search: searchQuery,
          limit: 20
        });
      } else if (sortBy === 'mostRecent') {
        bannerResponse = await getRecentBannerAds({
          search: searchQuery,
          limit: 20
        });
      } else {
        bannerResponse = await getBannerAds({
          search: searchQuery,
          sort_by: sortBy === 'mostClicked' ? 'clicks_count' : sortBy,
          sort_order: 'desc',
          limit: 20
        });
      }

      // Load categories and featured banners
      const [categoriesResponse, featuredResponse] = await Promise.all([
        getBannerCategories(),
        getFeaturedBannerAds({ limit: 5 })
      ]);

      // Handle banner response
      if (bannerResponse) {
        const bannerData = bannerResponse.data || bannerResponse;
        setBanners(Array.isArray(bannerData) ? bannerData : []);
        
        // Calculate stats
        const totalViews = Array.isArray(bannerData) ? bannerData.reduce((sum, banner) => sum + (banner.views_count || 0), 0) : 0;
        const totalClicks = Array.isArray(bannerData) ? bannerData.reduce((sum, banner) => sum + (banner.clicks_count || 0), 0) : 0;
        const activeBanners = Array.isArray(bannerData) ? bannerData.filter(b => b.status === 'active').length : 0;
        
        setStats({
          totalBanners: Array.isArray(bannerData) ? bannerData.length : 0,
          activeBanners,
          totalViews,
          totalClicks
        });
      } else {
        setBanners([]);
        setStats({ totalBanners: 0, activeBanners: 0, totalViews: 0, totalClicks: 0 });
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
      setBanners([]);
      setCategories([]);
      setFeaturedBanners([]);
      setStats({ totalBanners: 0, activeBanners: 0, totalViews: 0, totalClicks: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBannerData();
  };

  const handleBannerClick = async (banner) => {
    try {
      // Track the click if banner has a slug
      if (banner.slug) {
        await trackBannerClick(banner.slug);
      }
      
      // Update local click count
      setBanners(prev => prev.map(b => 
        b.id === banner.id 
          ? { ...b, clicks_count: (b.clicks_count || 0) + 1 }
          : b
      ));
      
      // Open the target URL
      const targetUrl = banner.destination_link || banner.target_url || banner.url;
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Error tracking banner click:', err);
      // Still open the URL even if tracking fails
      const targetUrl = banner.destination_link || banner.target_url || banner.url;
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleBannerSuccess = (newBanner) => {
    setShowCreateForm(false);
    loadBannerData(); // Refresh the banner list
  };

  const formatBannerSize = (size) => {
    const sizes = {
      '728x90': '728×90',
      '300x250': '300×250',
      '160x600': '160×600',
      '970x250': '970×250',
      '468x60': '468×60',
      '1080x1080': '1080×1080',
      '150x150': '150×150',
      '200x400': '200×400',
      '100x600': '100×600',
      '100x400': '100×400',
      '100x200': '100×200'
    };
    return sizes[size] || size;
  };

  const getCTR = (views, clicks) => {
    if (!views || views === 0) return 0;
    return ((clicks / views) * 100).toFixed(2);
  };

  const BannerCard = ({ banner, featured = false }) => {
    const typeInfo = bannerTypes[banner.banner_type] || bannerTypes.image;
    const promotionInfo = promotionTiers[banner.promotion_tier] || promotionTiers.standard;
    const TypeIcon = typeInfo.icon;
    const PromotionIcon = promotionInfo.icon;

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
          featured ? 'border-2 border-yellow-200' : ''
        }`}
        onClick={() => handleBannerClick(banner)}
      >
        <div className="relative">
          <img
            src={banner.banner_image_url || banner.image_url || banner.banner_image || banner.image || '/img/banner/default-banner.jpg'}
            alt={banner.title || banner.business_name || 'Banner'}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/img/banner/default-banner.jpg';
            }}
          />
          
          {/* Type Badge */}
          <div className="absolute top-2 left-2">
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <TypeIcon className="w-3 h-3" />
              {formatBannerSize(banner.banner_size)}
            </div>
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-2 right-2">
              <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                Featured
              </div>
            </div>
          )}

          {/* Promotion Badge */}
          {banner.promotion_tier && banner.promotion_tier !== 'standard' && (
            <div className="absolute top-2 right-2">
              <div className={`bg-${promotionInfo.color}-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center`}>
                <PromotionIcon className="w-3 h-3 mr-1" />
                {promotionInfo.label}
              </div>
            </div>
          )}

          {/* Status Badge */}
          {banner.status === 'active' && !featured && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                Active
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{banner.title}</h3>
            {banner.business_logo_url && (
              <img
                src={banner.business_logo_url}
                alt="Business Logo"
                className="w-8 h-8 object-contain ml-2"
              />
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{banner.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{banner.business_name}</span>
          </div>

          {banner.country && (
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{banner.country}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {banner.views_count || 0}
              </span>
              <span className="flex items-center">
                <MousePointer className="w-3 h-3 mr-1" />
                {banner.clicks_count || 0}
              </span>
              <span className="flex items-center">
                <BarChart3 className="w-3 h-3 mr-1" />
                {getCTR(banner.views_count, banner.clicks_count)}%
              </span>
            </div>
            <div className="flex items-center text-blue-600">
              <ExternalLink className="w-3 h-3 mr-1" />
              <span className="text-xs">Visit</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const BannerListItem = ({ banner }) => {
    const typeInfo = bannerTypes[banner.banner_type] || bannerTypes.image;
    const promotionInfo = promotionTiers[banner.promotion_tier] || promotionTiers.standard;
    const TypeIcon = typeInfo.icon;

    return (
      <motion.div
        className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleBannerClick(banner)}
      >
        <div className="flex items-center gap-4">
          <img
            src={banner.banner_image_url || banner.image_url || banner.banner_image || banner.image || '/img/banner/default-banner.jpg'}
            alt={banner.title || banner.business_name || 'Banner'}
            className="w-24 h-16 object-cover rounded"
            onError={(e) => {
              e.target.src = '/img/banner/default-banner.jpg';
            }}
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{banner.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{banner.business_name}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <TypeIcon className="w-3 h-3" />
                  {formatBannerSize(banner.banner_size)}
                </div>
                {banner.promotion_tier && banner.promotion_tier !== 'standard' && (
                  <div className={`bg-${promotionInfo.color}-500 text-white px-2 py-1 rounded text-xs`}>
                    {promotionInfo.label}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {banner.views_count || 0} views
                </span>
                <span className="flex items-center">
                  <MousePointer className="w-3 h-3 mr-1" />
                  {banner.clicks_count || 0} clicks
                </span>
                <span className="flex items-center">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  {getCTR(banner.views_count, banner.clicks_count)}% CTR
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
  };

  if (loading && banners.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Banners</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBanners}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeBanners}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <MousePointer className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banner Advertisements</h2>
          <p className="text-gray-600">Discover and manage banner advertisements</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {showCreateButton && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Banner
            </button>
          )}
        </div>
      </div>

      {/* Featured Banners */}
      {featuredBanners.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Featured Banners</h3>
            <Crown className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBanners.map((banner) => (
              <BannerCard key={banner.id} banner={banner} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
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
              {sortOptions.map(option => {
                const Icon = option.icon;
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Banners Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        <AnimatePresence mode="wait">
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'grid' ? (
                <BannerCard banner={banner} />
              ) : (
                <BannerListItem banner={banner} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {banners.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
          {showCreateButton && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Banner
            </button>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Banner Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <BannerSubmissionForm
            onSuccess={handleBannerSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerDisplay;
