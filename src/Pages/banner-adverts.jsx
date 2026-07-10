import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown, 
  ChevronUp,
  X,
  ArrowUpDown,
  ExternalLink,
  Heart,
  Eye,
  MapPin,
  Target,
  Star,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react';

// Import API hooks and services
import { 
  useBannerAds, 
  useFeaturedBanners, 
  useBannerCategories, 
  useMarketplaceHomepage 
} from '../hooks/useBannerData';
// Remove bannerApi import - no longer needed

// Import custom styles
import '../styles/banner-adverts.css';

// Import Components
import UnifiedNavbar from '../Component/UnifiedNavbar';
import BannerHero from '../Component/banner/BannerHero';
import BannerCarousel from '../Component/banner/BannerCarousel';
import BannerCategoryGrid from '../Component/banner/BannerCategoryGrid';
import BannerCard from '../Component/banner/BannerCard';
import BannerFilters from '../Component/banner/BannerFilters';
import BannerActivityFeed from '../Component/banner/BannerActivityFeed';
import BannerFooter from '../Component/banner/BannerFooter';

const BannerAdvertsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logIn, token } = useSelector((store) => store.auth);
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  
  // State for filters and UI
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showBusinessProfile, setShowBusinessProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiError, setApiError] = useState(null);

  const itemsPerPage = 12;

  // API hooks for data fetching
  const { data: banners, loading: bannersLoading, error: bannersError, pagination, refetch: refetchBanners } = useBannerAds({
    category_id: selectedCategory !== "all" ? selectedCategory : undefined,
    country: selectedCountry !== "all" ? selectedCountry : undefined,
    banner_size: selectedSize !== "all" ? selectedSize : undefined,
    promotion_tier: selectedBadge !== "all" ? selectedBadge : undefined,
    verified_only: verifiedOnly,
    search: searchQuery || undefined,
    sort_by: sortBy === 'recent' ? 'created_at' : sortBy === 'views' ? 'views_count' : sortBy === 'ctr' ? 'ctr' : 'created_at',
    sort_order: 'desc',
    page: currentPage,
    limit: itemsPerPage
  });

  const { data: featuredBanners, loading: featuredLoading } = useFeaturedBanners(6);
  const { data: categories, loading: categoriesLoading } = useBannerCategories();
  const { data: homepageData, loading: homepageLoading } = useMarketplaceHomepage();

  // Handle API errors
  useEffect(() => {
    if (bannersError) {
      setApiError(bannersError.message || 'Failed to load banners');
    }
  }, [bannersError]);

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/postbanner', 'You must be logged in to post a banner advert.')) {
      navigate('/postbanner');
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCountry, selectedSize, selectedBadge, verifiedOnly, searchQuery, sortBy]);

  // Handle banner interactions
  const handleBannerClick = (banner) => {
    setSelectedBanner(banner);
    // Track recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewedBanners') || '[]');
    const filtered = recentlyViewed.filter(b => b.id !== banner.id);
    filtered.unshift({
      id: banner.id,
      title: banner.title,
      banner_image: banner.banner_image,
      business_name: banner.business_name,
      viewed_at: new Date().toISOString()
    });
    const limited = filtered.slice(0, 10);
    localStorage.setItem('recentlyViewedBanners', JSON.stringify(limited));
  };

  const handleBusinessProfileClick = (businessName) => {
    setShowBusinessProfile(businessName);
  };

  const handleSaveBanner = (bannerId) => {
    const savedBanners = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
    if (!savedBanners.includes(bannerId)) {
      savedBanners.push(bannerId);
      localStorage.setItem('favoriteBanners', JSON.stringify(savedBanners));
    }
  };

  const handleUnsaveBanner = (bannerId) => {
    const savedBanners = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
    const filtered = savedBanners.filter(id => id !== bannerId);
    localStorage.setItem('favoriteBanners', JSON.stringify(filtered));
  };

  const isBannerSaved = (bannerId) => {
    const savedBanners = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
    return savedBanners.includes(bannerId);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'category':
        setSelectedCategory(value);
        break;
      case 'country':
        setSelectedCountry(value);
        break;
      case 'size':
        setSelectedSize(value);
        break;
      case 'badge':
        setSelectedBadge(value);
        break;
      case 'verified':
        setVerifiedOnly(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedCountry("all");
    setSelectedSize("all");
    setSelectedBadge("all");
    setVerifiedOnly(false);
    setSortBy("recent");
    setSearchQuery("");
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedCountry !== "all") count++;
    if (selectedSize !== "all") count++;
    if (selectedBadge !== "all") count++;
    if (verifiedOnly) count++;
    if (searchQuery) count++;
    return count;
  };

  // Loading state
  if (bannersLoading && !banners) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Banner Marketplace...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Banners</h2>
          <p className="text-gray-600 mb-4">{apiError}</p>
          <button
            onClick={() => {
              setApiError(null);
              refetchBanners();
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render main component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <UnifiedNavbar showBackButton={true} />
      
      <BannerHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onPostBanner={handlePostClick}
      />
      
      <BannerCarousel 
        banners={featuredBanners || []}
        loading={featuredLoading}
        onBannerClick={handleBannerClick}
      />
      
      <BannerCategoryGrid 
        categories={categories || []}
        loading={categoriesLoading}
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => handleFilterChange('category', category)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <BannerFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedBadge={selectedBadge}
              setSelectedBadge={setSelectedBadge}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories || []}
              loading={categoriesLoading}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
              activeFiltersCount={getActiveFiltersCount()}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Banner Adverts</h1>
                <p className="text-gray-600 mt-1">
                  {pagination?.total || 0} banner adverts found
                  {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()} filters applied)`}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="views">Most Viewed</option>
                    <option value="ctr">Highest CTR</option>
                    <option value="title">Alphabetical</option>
                  </select>
                  <ArrowUpDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Banner Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {banners?.map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  viewMode={viewMode}
                  onClick={() => handleBannerClick(banner)}
                  onBusinessProfileClick={() => handleBusinessProfileClick(banner.business_name)}
                  onSave={() => handleSaveBanner(banner.id)}
                  onUnsave={() => handleUnsaveBanner(banner.id)}
                  isSaved={isBannerSaved(banner.id)}
                />
              ))}
            </div>
            
            {/* Loading State */}
            {bannersLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {/* Empty State */}
            {!bannersLoading && (!banners || banners.length === 0) && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Target className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No banner adverts found</h3>
                <p className="text-gray-600 mb-4">
                  {getActiveFiltersCount() > 0 
                    ? 'Try adjusting your filters or search terms' 
                    : 'Be the first to post a banner advert!'
                  }
                </p>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
            
            {/* Pagination */}
            {pagination && pagination.total > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.last_page}
                    className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="mt-12">
          <BannerActivityFeed />
        </div>
      </div>
      
      <BannerFooter />
      
      {/* Modals */}
      <AnimatePresence>
        {selectedBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBanner(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Banner Detail Modal */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBanner.title}</h2>
                  <button
                    onClick={() => setSelectedBanner(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={selectedBanner.banner_image} 
                      alt={selectedBanner.title}
                      className="w-full rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
                      <p className="text-gray-700">{selectedBanner.business_name}</p>
                      {selectedBanner.contact_person && (
                        <p className="text-gray-600">Contact: {selectedBanner.contact_person}</p>
                      )}
                      {selectedBanner.email && (
                        <p className="text-gray-600">Email: {selectedBanner.email}</p>
                      )}
                      {selectedBanner.phone && (
                        <p className="text-gray-600">Phone: {selectedBanner.phone}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                      <p className="text-gray-700">{selectedBanner.description}</p>
                      {selectedBanner.key_selling_points && (
                        <p className="text-gray-600 mt-2">Key Points: {selectedBanner.key_selling_points}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {selectedBanner.views_count || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {selectedBanner.clicks_count || 0} clicks
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {selectedBanner.ctr || 0}% CTR
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <a
                        href={selectedBanner.destination_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                      
                      <button
                        onClick={() => {
                          handleSaveBanner(selectedBanner.id);
                          setSelectedBanner(null);
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerAdvertsPage;
