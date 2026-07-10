import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { 
  Plus,
  ArrowLeft,
  Menu,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  MessageSquare
} from 'lucide-react';

// Import CSS
import '../../styles/property.css';

// Component Imports
import UnifiedNavbar from '../../Component/UnifiedNavbar';
import PropertyHero from '../../Component/property/PropertyHero';
import PropertyWorldMap from '../../Component/property/PropertyWorldMap';
import PropertyCategoryGrid from '../../Component/property/PropertyCategoryGrid';
import PropertyFilters from '../../Component/property/PropertyFilters';
import PropertyGrid from '../../Component/property/PropertyGrid';
import PropertyActivityFeed from '../../Component/property/PropertyActivityFeed';
import PropertyPostForm from '../../Component/property/PropertyPostForm';
import PropertyFooter from '../../Component/property/PropertyFooter';
import RealEstateCalculators from '../../Component/calculators/RealEstateCalculators';

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
    propertyType: [],
    amenities: [],
    priceRange: {
      min: 0,
      max: 10000000
    },
    purpose: 'buy'
  });

  const { properties: featuredProperties } = useFeaturedProperties();
  const { categories, propertyTypes } = usePropertyData();

  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [submittedProperties, setSubmittedProperties] = useState([]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('showPostForm state changed:', showPostForm);
  }, [showPostForm]);

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
    // Property view handling - could add analytics tracking here
    console.log('Property viewed:', property.id);
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
  const handleFormSubmit = (apiResponse) => {
    console.log('Property submitted:', apiResponse);
    setShowPostForm(false);
    
    // Handle case where API response might be null/undefined or have different structure
    let propertyId = Date.now(); // fallback ID
    let propertyData = {};
    
    if (apiResponse && apiResponse.data) {
      // API returned data with .data property
      propertyData = apiResponse.data;
      propertyId = propertyData.id || Date.now();
    } else if (apiResponse && apiResponse.id) {
      // API returned data directly with id
      propertyData = apiResponse;
      propertyId = apiResponse.id;
    } else {
      // API response is null/undefined, create minimal property data
      propertyData = {
        title: 'New Property Listing',
        description: 'Property submitted successfully',
        category: 'buy',
        property_type: 'residential'
      };
    }
    
    // Create a new property object from the submitted data
    const newProperty = {
      id: propertyId,
      title: propertyData.title || 'Untitled Property',
      description: propertyData.description || 'New property listing',
      price: parseFloat(propertyData.price) || 0,
      category: propertyData.category || 'buy',
      type: propertyData.property_type || 'residential',
      location: propertyData.city || 'Unknown',
      country: propertyData.country || '🇺🇸',
      specifications: {
        bedrooms: parseInt(propertyData.bedrooms) || 0,
        bathrooms: parseInt(propertyData.bathrooms) || 0,
        size: parseFloat(propertyData.size) || 0,
        furnished: propertyData.furnished === '1' || propertyData.furnished === true,
        parking: parseInt(propertyData.parking) || 0
      },
      agent: {
        name: propertyData.seller_name || propertyData.sellerName || 'Property Owner',
        verified: propertyData.verified_agent === '1' || propertyData.verifiedAgent === true
      },
      badges: propertyData.advert_type === 'basic' ? [] : [propertyData.advert_type],
      views: 0,
      rating: 0,
      images: propertyData.images || [],
      postedDate: new Date(),
      featured: propertyData.advert_type === 'featured' || propertyData.advert_type === 'sponsored'
    };
    
    // Add the new property to the submitted properties list
    setSubmittedProperties(prev => [newProperty, ...prev]);
    
    // Refresh the properties from database to get the latest data
    setTimeout(() => {
      loadPage(1); // Load first page to refresh properties
      console.log('Refreshing properties from database...');
    }, 1500);
    
    console.log('New property added to display:', newProperty);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <UnifiedNavbar showBackButton={true} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
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
              <>
                <PropertyGrid 
                  properties={[...submittedProperties, ...properties]}
                  loading={loading}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onView={handlePropertyView}
                  onSave={handlePropertySave}
                  onShare={handlePropertyShare}
                  savedProperties={savedProperties}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </>
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
          savedProperties={savedProperties}
          showPagination={false}
        />
      </section>

      {/* Activity Feed */}
      <PropertyActivityFeed />

      {/* Real Estate Calculators */}
      <RealEstateCalculators />

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
            onClose={() => {
              console.log('setShowPostForm(false) called');
              setShowPostForm(false);
              // Clear URL parameter to prevent re-opening
              navigate('/property', { replace: true });
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyHub;
