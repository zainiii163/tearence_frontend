import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { 
  Search, 
  MapPin, 
  Home, 
  Building, 
  Factory, 
  Trees, 
  Hotel, 
  Store, 
  Briefcase,
  TrendingUp,
  Globe,
  Filter,
  Grid,
  List,
  ChevronDown,
  Plus,
  Star,
  Heart,
  Share2,
  Eye,
  Calendar,
  DollarSign,
  BedDouble,
  Bath,
  Square,
  Car,
  ArrowLeft,
  Wifi,
  Shield,
  Award,
  Phone,
  Mail,
  User,
  Camera,
  Video,
  FileText,
  Check,
  X,
  ArrowRight,
  Menu,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Flag,
  MessageSquare
} from 'lucide-react';

// Import CSS
import '../../styles/property.css';

// Component Imports
import PropertyNavbar from '../../Component/property/PropertyNavbar';
import PropertyHero from '../../Component/property/PropertyHero';
import PropertyWorldMap from '../../Component/property/PropertyWorldMap';
import PropertyCategoryGrid from '../../Component/property/PropertyCategoryGrid';
import PropertyFilters from '../../Component/property/PropertyFilters';
import PropertyGrid from '../../Component/property/PropertyGrid';
import PropertyActivityFeed from '../../Component/property/PropertyActivityFeed';
import PropertyPostForm from '../../Component/property/PropertyPostForm';
import PropertyFooter from '../../Component/property/PropertyFooter';

// Custom Hooks
import { 
  useProperties, 
  useFeaturedProperties, 
  usePromotedProperties, 
  useSponsoredProperties,
  usePropertyData 
} from '../../hooks/useProperties';

const PropertyHub = () => {
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  
  // Custom hooks for API data
  const {
    properties,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    loadPage,
  } = useProperties({
    sort: 'newest',
    perPage: 12,
  });

  const { properties: featuredProperties } = useFeaturedProperties();
  const { properties: promotedProperties } = usePromotedProperties();
  const { properties: sponsoredProperties } = useSponsoredProperties();
  const { categories, propertyTypes } = usePropertyData();

  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/property?postForm=true', 'You must be logged in to post a property.')) {
      setShowPostForm(true);
    }
  };

  // Handle URL parameter for post form
  useEffect(() => {
    const postFormParam = urlSearchParams.get('postForm');
    if (postFormParam === 'true') {
      // Only show form if authenticated
      if (isAuthenticated) {
        setShowPostForm(true);
      } else {
        // Clear the parameter and redirect to login
        navigate('/property', { replace: true });
        requireAuth('/property?postForm=true', 'You must be logged in to post a property.');
      }
    }
  }, [urlSearchParams, isAuthenticated, requireAuth, navigate]);

  // Handle search
  const handleSearch = (searchData) => {
    const apiFilters = {
      search: searchData.keyword,
      location: searchData.location,
      category: searchData.category,
    };
    updateFilters(apiFilters);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    const apiFilters = {
      propertyTypes: newFilters.propertyType,
      minPrice: newFilters.priceRange?.min,
      maxPrice: newFilters.priceRange?.max,
      bedrooms: newFilters.bedrooms,
      bathrooms: newFilters.bathrooms,
      features: newFilters.amenities,
    };
    updateFilters(apiFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    loadPage(page);
  };

  // Handle property actions
  const handlePropertyView = (property) => {
    setSelectedProperty(property);
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== property.id);
      return [property, ...filtered].slice(0, 10);
    });
  };

  const handlePropertySave = (property) => {
    // Toggle saved property (would need authentication check)
    setSavedProperties(prev => {
      const isSaved = prev.some(p => p.id === property.id);
      if (isSaved) {
        return prev.filter(p => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  const handlePropertyShare = (property) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.origin + `/property/${property.id}`,
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.origin + `/property/${property.id}`);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    updateFilters({
      propertyTypes: [],
      minPrice: 0,
      maxPrice: 10000000,
      bedrooms: '',
      bathrooms: '',
      features: [],
    });
  };

  // Handle form submission
  const handleFormSubmit = (formData) => {
    console.log('Property submitted:', formData);
    setShowPostForm(false);
    // Here you would send data to backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <PropertyNavbar 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPostProperty={handlePostClick}
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

      {/* Hero Section */}
      <PropertyHero 
        onSearch={handleSearch}
      />

      {/* Interactive World Map */}
      <PropertyWorldMap />

      {/* Property Categories Grid */}
      <PropertyCategoryGrid 
        onCategorySelect={(category) => updateFilters({ propertyTypes: [category] })}
        categories={categories}
        propertyTypes={propertyTypes}
      />

      {/* Filters and Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <PropertyFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              showMobile={showMobileFilters}
              setShowMobile={setShowMobileFilters}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error loading properties: {error}</p>
              </div>
            ) : (
              <PropertyGrid 
                properties={properties}
                loading={loading}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onView={handlePropertyView}
                onSave={handlePropertySave}
                onShare={handlePropertyShare}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Properties</h2>
        <PropertyGrid 
          properties={featuredProperties}
          loading={loading}
          viewMode="grid"
          onView={handlePropertyView}
          onSave={handlePropertySave}
          onShare={handlePropertyShare}
          showPagination={false}
        />
      </section>

      {/* Activity Feed */}
      <PropertyActivityFeed />

      {/* Footer */}
      <PropertyFooter />

      {/* Floating Post Property Button */}
      <motion.button
        onClick={handlePostClick}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors floating-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Post Property Modal */}
      <AnimatePresence>
        {showPostForm && (
          <PropertyPostForm 
            onClose={() => setShowPostForm(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyHub;
