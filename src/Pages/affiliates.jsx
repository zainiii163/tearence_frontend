import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import '../styles/affiliates.css';
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
  const [searchParams] = useSearchParams();
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

  // Check for postForm parameter to automatically open form
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true') {
      setShowPostForm(true);
    }
  }, [searchParams]);

  // Sample data for demonstration
  const [affiliateOffers] = useState([
    {
      id: 1,
      type: 'business',
      title: 'Premium SaaS Marketing Platform',
      tagline: 'Earn 40% recurring commission on all plans',
      category: 'Technology & Gadgets',
      commission: 40,
      cookieDuration: 90,
      country: 'United States',
      description: 'Join our affiliate program and promote the leading marketing automation platform.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      businessName: 'TechCorp Solutions',
      verified: true,
      rating: 4.8,
      reviews: 234,
      views: 15420,
      promoted: true,
      featured: false,
      sponsored: false,
      postedDate: '2024-01-15',
      allowedTraffic: ['Social Media', 'Email', 'PPC', 'Blogging'],
      assets: ['Banners', 'Product Images', 'Videos'],
      contactEmail: 'affiliates@techcorp.com',
      website: 'https://techcorp.com'
    },
    {
      id: 2,
      type: 'promoter',
      title: 'Fashion & Beauty Affiliate Links',
      tagline: 'Curated fashion products with 25% commission',
      category: 'Fashion & Beauty',
      commission: 25,
      cookieDuration: 30,
      country: 'United Kingdom',
      description: 'Promote the latest fashion trends and earn generous commissions.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      promoterName: 'Style Guru',
      verified: false,
      rating: 4.5,
      reviews: 89,
      views: 8920,
      promoted: false,
      featured: true,
      sponsored: false,
      postedDate: '2024-01-20',
      hashtags: ['fashion', 'beauty', 'style'],
      targetAudience: 'Fashion enthusiasts aged 18-35',
      affiliateLink: 'https://example.com/affiliate/style123'
    },
    {
      id: 3,
      type: 'business',
      title: 'Travel Booking Platform',
      tagline: '15% commission on hotel and flight bookings',
      category: 'Travel & Tourism',
      commission: 15,
      cookieDuration: 45,
      country: 'Global',
      description: 'Partner with the fastest-growing travel booking platform.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?w=400',
      businessName: 'Global Travel Inc',
      verified: true,
      rating: 4.9,
      reviews: 567,
      views: 23450,
      promoted: false,
      featured: false,
      sponsored: true,
      postedDate: '2024-01-10',
      allowedTraffic: ['Social Media', 'Email', 'Influencer'],
      assets: ['Banners', 'Logos', 'Videos'],
      contactEmail: 'partners@globaltravel.com',
      website: 'https://globaltravel.com'
    },
    {
      id: 4,
      type: 'promoter',
      title: 'Health & Wellness Products',
      tagline: 'Organic supplements with 30% commission',
      category: 'Health & Wellness',
      commission: 30,
      cookieDuration: 60,
      country: 'Canada',
      description: 'Promote premium health and wellness products.',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
      promoterName: 'Wellness Expert',
      verified: true,
      rating: 4.7,
      reviews: 156,
      views: 12340,
      promoted: false,
      featured: false,
      sponsored: false,
      postedDate: '2024-01-25',
      hashtags: ['health', 'wellness', 'organic'],
      targetAudience: 'Health-conscious individuals',
      affiliateLink: 'https://example.com/affiliate/health456'
    },
    {
      id: 5,
      type: 'business',
      title: 'Educational Courses Platform',
      tagline: '20% commission on online courses',
      category: 'Education & Courses',
      commission: 20,
      cookieDuration: 30,
      country: 'Australia',
      description: 'Promote high-quality online courses across various subjects.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      businessName: 'EduLearn Academy',
      verified: true,
      rating: 4.6,
      reviews: 445,
      views: 19870,
      promoted: true,
      featured: true,
      sponsored: false,
      postedDate: '2024-01-18',
      allowedTraffic: ['Social Media', 'Email', 'Blogging', 'Influencer'],
      assets: ['Banners', 'Product Images', 'Videos'],
      contactEmail: 'affiliates@edulearn.com',
      website: 'https://edulearn.com'
    },
    {
      id: 6,
      type: 'promoter',
      title: 'Home & Garden Essentials',
      tagline: 'Smart home products with 35% commission',
      category: 'Home & Garden',
      commission: 35,
      cookieDuration: 90,
      country: 'Germany',
      description: 'Promote innovative home and garden products.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      promoterName: 'Home Pro',
      verified: false,
      rating: 4.4,
      reviews: 78,
      views: 6780,
      promoted: false,
      featured: false,
      sponsored: false,
      postedDate: '2024-01-22',
      hashtags: ['home', 'garden', 'smart'],
      targetAudience: 'Homeowners and DIY enthusiasts',
      affiliateLink: 'https://example.com/affiliate/home789'
    }
  ]);

  const categories = [
    { id: 1, name: 'Technology & Gadgets', icon: '💻', count: 145, color: 'blue' },
    { id: 2, name: 'Fashion & Beauty', icon: '👗', count: 234, color: 'pink' },
    { id: 3, name: 'Travel & Tourism', icon: '✈️', count: 189, color: 'green' },
    { id: 4, name: 'Finance & Insurance', icon: '💰', count: 167, color: 'yellow' },
    { id: 5, name: 'Health & Wellness', icon: '🏥', count: 298, color: 'red' },
    { id: 6, name: 'Education & Courses', icon: '📚', count: 312, color: 'purple' },
    { id: 7, name: 'Home & Garden', icon: '🏡', count: 176, color: 'orange' },
    { id: 8, name: 'Automotive', icon: '🚗', count: 134, color: 'indigo' },
    { id: 9, name: 'Real Estate', icon: '🏢', count: 98, color: 'teal' },
    { id: 10, name: 'Software & SaaS', icon: '⚡', count: 267, color: 'cyan' },
    { id: 11, name: 'Food & Lifestyle', icon: '🍔', count: 423, color: 'amber' },
    { id: 12, name: 'Business Services', icon: '💼', count: 189, color: 'gray' },
    { id: 13, name: 'Entertainment & Media', icon: '🎬', count: 156, color: 'rose' }
  ];

  const stats = {
    totalOffers: 2847,
    totalPromoters: 15420,
    totalCategories: 13,
    verifiedBusinesses: 892,
    avgCommission: 28,
    totalEarnings: '$2.4M'
  };

  const handleSaveItem = (itemId) => {
    setSavedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

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
  };

  const filteredOffers = affiliateOffers.filter(offer => {
    let matchesSearch = searchQuery === '' || 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = !selectedCategory || offer.category === selectedCategory;
    
    let matchesFilters = true;
    if (filters.verified && !offer.verified) matchesFilters = false;
    if (filters.trending && !(offer.promoted || offer.featured || offer.sponsored)) matchesFilters = false;
    if (filters.newest) {
      const offerDate = new Date(offer.postedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (offerDate < weekAgo) matchesFilters = false;
    }
    if (filters.highEarning && offer.commission < 25) matchesFilters = false;
    
    return matchesSearch && matchesCategory && matchesFilters;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate) - new Date(a.postedDate);
      case 'views':
        return b.views - a.views;
      case 'commission':
        return b.commission - a.commission;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AffiliateNavbar 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPostClick={() => setShowPostForm(true)}
      />
      
      <AffiliateHero 
        stats={stats}
        onPostBusiness={() => setShowPostForm(true)}
        onPostPromoter={() => setShowPostForm(true)}
      />
      
      <AffiliateDualPath />
      
      <AffiliateCategoryGrid 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
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
            />
          </div>
          
          <div className="lg:w-3/4">
            <AffiliateGrid 
              offers={sortedOffers}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              savedItems={savedItems}
              onSaveItem={handleSaveItem}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      </div>
      
      <AffiliateActivityFeed />
      
      <AffiliateFooter />
      
      <AnimatePresence>
        {showPostForm && (
          <AffiliatePostForm onClose={() => setShowPostForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AffiliatesPage;
