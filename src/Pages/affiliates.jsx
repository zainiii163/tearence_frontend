import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/affiliates.css';
import useAuthRedirect from '../hooks/useAuthRedirect';
import affiliateService from '../services/AffiliateService';
import toast from 'react-hot-toast';
import { 
  Search, 
  Plus, 
  Globe, 
  Users, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Filter,
  ChevronDown,
  Menu,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Shield,
  Clock,
  DollarSign,
  Target,
  Zap,
  Crown,
  Award,
  Eye,
  Heart,
  Share2,
  Flag,
  MapPin,
  Calendar,
  BarChart3,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import AffiliateNavbar from '../Component/affiliates/AffiliateNavbar';
import AffiliateHero from '../Component/affiliates/AffiliateHero';
import AffiliateCategoryGrid from '../Component/affiliates/AffiliateCategoryGrid';
import AffiliateDualPath from '../Component/affiliates/AffiliateDualPath';
import AffiliatePostForm from '../Component/affiliates/AffiliatePostForm';
import AffiliateFilters from '../Component/affiliates/AffiliateFilters';
import AffiliateGrid from '../Component/affiliates/AffiliateGrid';
import AffiliateActivityFeed from '../Component/affiliates/AffiliateActivityFeed';
import AffiliateFooter from '../Component/affiliates/AffiliateFooter';

const AffiliatesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handlePostClick } = useAuthRedirect();
  
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
    if (postFormParam === 'true') {
      handlePostClick(() => setShowPostForm(true));
    }
  }, [searchParams, handlePostClick]);

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
      setBusinessOffers(businessResponse.data || []);
      
      // Load user posts
      const userResponse = await affiliateService.getUserPosts();
      setUserPosts(userResponse.data || []);
      
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
      setBusinessOffers(response.data || []);
    } catch (err) {
      console.error('Error fetching business offers:', err);
      toast.error('Failed to load business offers');
    }
  };

  // Fetch user posts with filters
  const fetchUserPosts = async (filters = {}) => {
    try {
      const response = await affiliateService.getUserPosts(filters);
      setUserPosts(response.data || []);
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
        setBusinessOffers(response.data.business_offers || []);
      }
      if (type === 'all' || type === 'user') {
        setUserPosts(response.data.user_posts || []);
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

  // Clear filters
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
    
    if (contentType === 'business' || contentType === 'all') {
      businessOffers.forEach(offer => {
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
          image: offer.image_url || offer.image || '/placeholder-image.jpg',
          tracking_link: offer.tracking_link,
          affiliate_link: offer.affiliate_link,
          isNew: isNew
        });
      });
    }
    
    if (contentType === 'user' || contentType === 'all') {
      userPosts.forEach(post => {
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
          image: post.image_url || post.image || '/placeholder-image.jpg',
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
      <AffiliateNavbar 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPostClick={() => handlePostClick(() => setShowPostForm(true))}
      />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>
      
      <AffiliateHero 
        stats={getHeroStats()}
        onPostBusiness={() => handlePostClick(() => setShowPostForm(true))}
        onPostPromoter={() => handlePostClick(() => setShowPostForm(true))}
      />
      
      <AffiliateDualPath />
      
      <AffiliateCategoryGrid 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      
      <AffiliateActivityFeed />
      
      <AffiliateFooter />
      
      <AnimatePresence>
        {showPostForm && (
          <AffiliatePostForm 
            onClose={() => setShowPostForm(false)} 
            categories={categories}
            upsellPlans={upsellPlans}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AffiliatesPage;
