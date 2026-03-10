import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
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
  ArrowLeft,
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

// Sample Data
import { sampleProperties } from '../../data/mockPropertyData';

const PropertyHub = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    category: 'buy',
    priceRange: '',
    keyword: ''
  });
  const [filters, setFilters] = useState({
    propertyType: [],
    priceRange: { min: 0, max: 10000000 },
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    region: '',
    purpose: 'buy'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [urlSearchParams] = useSearchParams();

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/property?postForm=true', 'You must be logged in to post a property listing.')) {
      setShowPostForm(true);
    }
  };

  // Handle URL parameter for post form (only if authenticated)
  useEffect(() => {
    const postFormParam = urlSearchParams.get('postForm');
    if (postFormParam === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [urlSearchParams, isAuthenticated]);

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    return sampleProperties.filter(property => {
      const matchesSearch = !searchParams.keyword || 
        property.title.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        property.description.toLowerCase().includes(searchParams.keyword.toLowerCase());
      
      const matchesLocation = !searchParams.location || 
        property.location.toLowerCase().includes(searchParams.location.toLowerCase());
      
      const matchesCategory = !searchParams.category || 
        property.category === searchParams.category;
      
      const matchesPropertyType = !filters.propertyType.length || 
        filters.propertyType.includes(property.type);
      
      const matchesPrice = property.price >= filters.priceRange.min && 
        property.price <= filters.priceRange.max;
      
      const matchesBedrooms = !filters.bedrooms || 
        property.specifications.bedrooms >= parseInt(filters.bedrooms);
      
      const matchesBathrooms = !filters.bathrooms || 
        property.specifications.bathrooms >= parseInt(filters.bathrooms);

      return matchesSearch && matchesLocation && matchesCategory && 
             matchesPropertyType && matchesPrice && matchesBedrooms && matchesBathrooms;
    });
  }, [sampleProperties, searchParams, filters]);

  // Handle search
  const handleSearch = (searchData) => {
    setSearchParams(prev => ({ ...prev, ...searchData }));
  };

  // Handle filter change
  const handleFilterChange = (filterData) => {
    setFilters(prev => ({ ...prev, ...filterData }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      propertyType: [],
      priceRange: { min: 0, max: 10000000 },
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      region: '',
      purpose: 'buy'
    });
    setSearchParams({
      location: '',
      propertyType: '',
      category: 'buy',
      priceRange: '',
      keyword: ''
    });
  };

  // Handle property view
  const handlePropertyView = (property) => {
    setSelectedProperty(property);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== property.id);
      return [property, ...filtered].slice(0, 10);
    });
  };

  // Handle save property
  const handleSaveProperty = (propertyId) => {
    setSavedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      }
      return [...prev, propertyId];
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
        onPostProperty={() => setShowPostForm(true)}
      />

      {/* Hero Section */}
      <PropertyHero 
        onSearch={handleSearch}
        searchParams={searchParams}
      />

      {/* Interactive World Map */}
      <PropertyWorldMap 
        onLocationSelect={(location) => setSearchParams(prev => ({ ...prev, location }))}
      />

      {/* Property Categories Grid */}
      <PropertyCategoryGrid 
        onCategorySelect={(category) => setFilters(prev => ({ ...prev, propertyType: [category] }))}
      />

      {/* Main Content */}
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
            {/* Results Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredProperties.length} Properties Found
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchParams.location && `in ${searchParams.location}`}
                  {searchParams.category && ` • ${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)}`}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Properties Grid/List */}
            <PropertyGrid 
              properties={filteredProperties}
              viewMode={viewMode}
              onPropertyView={handlePropertyView}
              onSaveProperty={handleSaveProperty}
              savedProperties={savedProperties}
            />

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">1</button>
                <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">2</button>
                <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">3</button>
                <button className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-12">
          <PropertyActivityFeed />
        </div>
      </div>

      {/* Floating Post Property Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePostClick}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold">Post Property</span>
      </motion.button>

      {/* Property Post Form Modal */}
      <AnimatePresence>
        {showPostForm && (
          <PropertyPostForm 
            onClose={() => setShowPostForm(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <PropertyFooter />
    </div>
  );
};

export default PropertyHub;
