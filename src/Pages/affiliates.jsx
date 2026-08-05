import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import '../styles/affiliates.css';
import useAuthRedirect from '../hooks/useAuthRedirect';
import affiliateService from '../services/AffiliateService';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import { 
  ArrowLeft,
  Plus
} from 'lucide-react';
import AffiliateHero from '../Component/affiliates/AffiliateHero';
import AffiliateCategoryGrid from '../Component/affiliates/AffiliateCategoryGrid';
import AffiliateDualPath from '../Component/affiliates/AffiliateDualPath';
import AffiliateModalForm from '../Component/affiliates/AffiliateModalForm';
import AffiliateFilters from '../Component/affiliates/AffiliateFilters';
import AffiliateGrid from '../Component/affiliates/AffiliateGrid';
import AffiliateActivityFeed from '../Component/affiliates/AffiliateActivityFeed';

const API_STORAGE_BASE = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')
  : 'https://api.worldwideadverts.info';

const isValidImageValue = (val) => {
  if (!val || typeof val !== 'string' || !val.trim()) return false;
  const v = val.trim();
  // Must start with http(s):// or look like a relative file path (contains . for extension)
  return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/storage/') || /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(v);
};

const resolveImageUrl = (item) => {
  const candidates = [
    item?.image_url,
    item?.logo_url,
    item?.banner_url,
    item?.thumbnail_url,
    item?.cover_image,
    item?.image,
    item?.photo,
  ];

  // Check images array (business offers use this field)
  if (Array.isArray(item?.images) && item.images.length > 0) {
    const first = item.images[0];
    if (typeof first === 'string') candidates.unshift(first);
    else if (first?.url) candidates.unshift(first.url);
  }

  // Check promotional_assets: array of objects {url} or array of strings
  if (Array.isArray(item?.promotional_assets) && item.promotional_assets.length > 0) {
    const first = item.promotional_assets[0];
    if (typeof first === 'string') candidates.unshift(first);
    else if (first?.url) candidates.unshift(first.url);
    else if (first?.path) candidates.unshift(first.path);
  }

  for (const val of candidates) {
    if (!isValidImageValue(val)) continue;
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    return `${API_STORAGE_BASE}/storage/${val.replace(/^\//, '')}`;
  }
  return null;
};

const AffiliatesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requireAuth } = useAuthRedirect();
  
  // Custom handlePostClick for modal instead of navigation
  const [postFormMode, setPostFormMode] = useState('user'); // default: User Promotion (affiliate links)

  const openPostForm = (mode = 'user') => {
    if (requireAuth(`/affiliates?postForm=true&mode=${mode}`, 'You must be logged in to post an affiliate listing.')) {
      setPostFormMode(mode);
      setShowPostForm(true);
    }
  };

  const handlePostPromoter = () => openPostForm('user');
  const handlePostBusiness = () => openPostForm('business');
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [businessOffers, setBusinessOffers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [upsellPlans, setUpsellPlans] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    commissionRate: '',
    country: '',
    verified: false,
    trending: false,
    newest: false,
    highEarning: false
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedItems, setSavedItems] = useState([]);
  const [contentType, setContentType] = useState('all'); // 'all', 'business', 'user'

  // Check for postForm parameter to automatically open form
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    const modeParam = searchParams.get('mode');
    if (postFormParam === 'true') {
      if (modeParam === 'business' || modeParam === 'user') {
        setPostFormMode(modeParam);
      }
      setShowPostForm(true);
    }
  }, [searchParams]);

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle successful submission and show new post
  const handleSubmissionSuccess = (newPostData) => {
    // Refresh data
    loadInitialData();
    
    // Show success message
    toast.success('Affiliate listing created successfully!', {
      duration: 4000,
      position: 'top-center'
    });
    
    // Close form
    setShowPostForm(false);
    
    // Scroll to top to show the new content
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // If we have the new post data, we could highlight it
    if (newPostData) {
      console.log('New post created:', newPostData);
      // You could implement highlighting logic here
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories
      const categoriesResponse = await affiliateService.getCategories();
      setCategories(categoriesResponse.data || []);
      
      // Load business offers
      const businessResponse = await affiliateService.getBusinessOffers();
      const businessData = businessResponse?.data || businessResponse;
      const businessArr = Array.isArray(businessData) ? businessData : (businessData?.data || []);
      setBusinessOffers(businessArr);
      
      // Load user posts
      const userResponse = await affiliateService.getUserPosts();
      const userData = userResponse?.data || userResponse;
      const userArr = Array.isArray(userData) ? userData : (userData?.data || []);
      setUserPosts(userArr);
      
      // Load upsell plans
      const upsellResponse = await affiliateService.getUpsellPlans();
      setUpsellPlans(upsellResponse.data || []);
      
      // Load platform stats
      try {
        const statsResponse = await affiliateService.getPlatformStats();
        setPlatformStats(statsResponse.data || null);
      } catch (statsError) {
        // Stats endpoint might not be implemented yet
        console.warn('Platform stats not available:', statsError);
      }
      
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Failed to load affiliate data');
      toast.error('Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch business offers with filters
  const fetchBusinessOffers = async (filters = {}) => {
    try {
      const response = await affiliateService.getBusinessOffers(filters);
      const bData = response?.data || response;
      setBusinessOffers(Array.isArray(bData) ? bData : (bData?.data || []));
    } catch (err) {
      console.error('Error fetching business offers:', err);
      toast.error('Failed to load business offers');
    }
  };

  // Fetch user posts with filters
  const fetchUserPosts = async (filters = {}) => {
    try {
      const response = await affiliateService.getUserPosts(filters);
      const uData = response?.data || response;
      setUserPosts(Array.isArray(uData) ? uData : (uData?.data || []));
    } catch (err) {
      console.error('Error fetching user posts:', err);
      toast.error('Failed to load user posts');
    }
  };

  // Search affiliate content
  const searchAffiliateContent = async (query, type = 'all') => {
    try {
      const response = await affiliateService.searchAffiliateContent(query, type);
      
      if (type === 'all' || type === 'business') {
        const bOffers = response?.data?.business_offers ?? response?.business_offers ?? [];
        setBusinessOffers(Array.isArray(bOffers) ? bOffers : []);
      }
      if (type === 'all' || type === 'user') {
        const uPosts = response?.data?.user_posts ?? response?.user_posts ?? [];
        setUserPosts(Array.isArray(uPosts) ? uPosts : []);
      }
    } catch (err) {
      console.error('Error searching content:', err);
      toast.error('Search failed');
    }
  };

  // Track click analytics
  const trackClick = async (type, id) => {
    try {
      await affiliateService.trackClick(type, id);
    } catch (err) {
      console.error('Error tracking click:', err);
      // Don't show error toast for tracking failures
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchAffiliateContent(query, contentType);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    // Refetch data with category filter
    if (contentType === 'business' || contentType === 'all') {
      fetchBusinessOffers({ category_id: categoryId, per_page: 12 });
    }
    if (contentType === 'user' || contentType === 'all') {
      fetchUserPosts({ category_id: categoryId, per_page: 12 });
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    
    // Build filter parameters
    const filterParams = { per_page: 12 };
    if (selectedCategory) filterParams.category_id = selectedCategory;
    if (filters.commissionRate) filterParams.min_commission = filters.commissionRate;
    if (filters.country) filterParams.country = filters.country;
    if (filters.verified) filterParams.verified = true;
    if (filters.trending) filterParams.trending = true;
    if (filters.newest) filterParams.sort = 'created_at';
    if (filters.highEarning) filterParams.min_commission = 25;

    // Refetch data with filters
    if (contentType === 'business' || contentType === 'all') {
      fetchBusinessOffers(filterParams);
    }
    if (contentType === 'user' || contentType === 'all') {
      fetchUserPosts(filterParams);
    }
  };

  // Clear all
  const clearFilters = () => {
    setFilters({
      commissionRate: '',
      country: '',
      verified: false,
      trending: false,
      newest: false,
      highEarning: false
    });
    setSelectedCategory(null);
    setCurrentPage(1);
    
    // Refetch data without filters
    fetchBusinessOffers({ per_page: 12 });
    fetchUserPosts({ per_page: 12 });
  };

  // Handle content type switch
  const handleContentTypeChange = (type) => {
    setContentType(type);
    setCurrentPage(1);
  };

  // Handle save item
  const handleSaveItem = (itemId) => {
    setSavedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle click tracking
  const handleItemClick = async (type, id) => {
    await trackClick(type, id);
  };

  // Combine business offers and user posts for display
  const getAllContent = () => {
    const content = [];
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000); // Posts from last 5 minutes
    
    const safeBusinessOffers = Array.isArray(businessOffers) ? businessOffers : [];
    const safeUserPosts = Array.isArray(userPosts) ? userPosts : [];
    if (contentType === 'business' || contentType === 'all') {
      safeBusinessOffers.forEach(offer => {
        const createdAt = new Date(offer.created_at);
        const isNew = createdAt > fiveMinutesAgo;
        
        content.push({
          ...offer,
          contentType: 'business',
          id: `business-${offer.id}`,
          type: 'business',
          title: offer.product_service_title || offer.title,
          tagline: offer.tagline || '',
          commission: offer.commission_rate || offer.commission || 0,
          category: offer.affiliate_category?.name || offer.category || '',
          country: offer.country || '',
          verified: offer.is_verified || false,
          promoted: offer.is_promoted || false,
          featured: offer.is_featured || false,
          sponsored: offer.is_sponsored || false,
          views: offer.views || 0,
          rating: offer.rating || 0,
          reviews: offer.reviews || 0,
          image: resolveImageUrl(offer),
          tracking_link: offer.tracking_link,
          affiliate_link: offer.affiliate_link,
          isNew: isNew
        });
      });
    }
    
    if (contentType === 'user' || contentType === 'all') {
      safeUserPosts.forEach(post => {
        const createdAt = new Date(post.created_at);
        const isNew = createdAt > fiveMinutesAgo;
        
        content.push({
          ...post,
          contentType: 'user',
          id: `user-${post.id}`,
          type: 'user',
          title: post.title,
          tagline: post.description ? post.description.substring(0, 80) + '...' : '',
          commission: 0, // User posts don't have commission
          category: post.affiliate_category?.name || post.category || '',
          country: post.country || '',
          verified: false,
          promoted: post.is_promoted || false,
          featured: post.is_featured || false,
          sponsored: post.is_sponsored || false,
          views: post.views || 0,
          rating: post.rating || 0,
          reviews: post.reviews || 0,
          image: resolveImageUrl(post),
          tracking_link: post.affiliate_link,
          affiliate_link: post.affiliate_link,
          isNew: isNew
        });
      });
    }
    
    return content;
  };

  // Get stats for hero section
  const getHeroStats = () => {
    if (platformStats) {
      return {
        totalOffers: platformStats.total_business_offers || 2847,
        totalPromoters: platformStats.total_user_posts || 15420,
        totalCategories: categories?.length || 13,
        verifiedBusinesses: platformStats.verified_businesses || 892,
        avgCommission: platformStats.avg_commission_rate || 28,
        totalEarnings: platformStats.total_earnings || '$2.4M'
      };
    }
    
    // Fallback stats
    return {
      totalOffers: 2847,
      totalPromoters: 15420,
      totalCategories: categories?.length || 13,
      verifiedBusinesses: 892,
      avgCommission: 28,
      totalEarnings: '$2.4M'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      
      <AffiliateHero 
        stats={getHeroStats()}
        onPostBusiness={handlePostBusiness}
        onPostPromoter={handlePostPromoter}
      />
      
      <AffiliateDualPath 
        onPostBusiness={handlePostBusiness}
        onPostPromoter={handlePostPromoter}
      />
      
      <AffiliateCategoryGrid 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      <div className="page-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <AffiliateFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              contentType={contentType}
              onContentTypeChange={handleContentTypeChange}
            />
          </div>
          
          <div className="lg:w-3/4">
            <AffiliateGrid 
              offers={getAllContent()}
              businessOffers={businessOffers}
              userPosts={userPosts}
              contentType={contentType}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              savedItems={savedItems}
              onSaveItem={handleSaveItem}
              searchQuery={searchQuery}
              setSearchQuery={handleSearch}
              loading={loading}
              onItemClick={handleItemClick}
              trackClick={trackClick}
            />
          </div>
        </div>
      </div>
      
      <AffiliateActivityFeed showRealData={true} />
      
      <Footer />
      
      <AnimatePresence>
        {showPostForm && (
          <AffiliateModalForm 
            onClose={() => setShowPostForm(false)} 
            categories={categories}
            onSubmissionSuccess={handleSubmissionSuccess}
            initialMode={postFormMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AffiliatesPage;
