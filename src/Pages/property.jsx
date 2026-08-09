import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyHero from '../Component/property/PropertyHero';
import PropertyFilters from '../Component/property/PropertyFilters';
import PropertyGrid from '../Component/property/PropertyGrid';
import { usePropertyList, useFeaturedProperties } from '../hooks/usePropertyData';
import { Plus, Grid, List, SlidersHorizontal, Building, Check } from 'lucide-react';

const Property = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [filters, setFilters] = useState({
    propertyType: [],
    category: 'buy',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    region: '',
    purpose: 'buy',
    priceRange: { min: 0, max: 10000000 },
  });

  const [searchParams, setSearchParams] = useState({});

  const { properties, meta, loading, error, refetch } = usePropertyList(searchParams);
  const { properties: featuredProperties, loading: featuredLoading } = useFeaturedProperties();

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Build search params from filters
    const searchParams = {};
    if (newFilters.propertyType && newFilters.propertyType.length > 0) {
      searchParams.property_type = newFilters.propertyType.join(',');
    }
    if (newFilters.category) {
      searchParams.category = newFilters.category;
    }
    if (newFilters.bedrooms) {
      searchParams.min_bedrooms = newFilters.bedrooms;
    }
    if (newFilters.bathrooms) {
      searchParams.min_bathrooms = newFilters.bathrooms;
    }
    if (newFilters.priceRange) {
      searchParams.min_price = newFilters.priceRange.min;
      searchParams.max_price = newFilters.priceRange.max;
    }
    if (newFilters.purpose) {
      searchParams.category = newFilters.purpose;
    }
    
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setFilters({
      propertyType: [],
      category: 'buy',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      region: '',
      purpose: 'buy',
      priceRange: { min: 0, max: 10000000 },
    });
    setSearchParams({});
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    // Navigate to property detail page or show modal
    console.log('View property:', property);
  };

  const handleSaveProperty = async (propertyId) => {
    // Toggle save/unsave
    if (savedProperties.includes(propertyId)) {
      setSavedProperties(prev => prev.filter(id => id !== propertyId));
    } else {
      setSavedProperties(prev => [...prev, propertyId]);
    }
    // Call API to save/unsave
    try {
      const propertyApi = (await import('../services/propertyApi')).default;
      await propertyApi.toggleSaveProperty(propertyId);
    } catch (error) {
      console.error('Failed to save property:', error);
    }
  };

  const handlePropertySubmit = async (result) => {
    console.log('Property submitted:', result);
    setSubmitSuccess(true);
    setSubmitError(null);
    setShowPostForm(false);
    // Refetch properties to show the newly created property
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refetch properties:', error);
      setSubmitError('Property submitted but failed to refresh list');
    }
    // Hide success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PropertyHero onSearch={handleSearch} searchParams={searchParams} />

      <div className="page-container py-8">
        <div className="flex lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="font-medium">Options</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block">
            <PropertyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              showMobile={showMobileFilters}
              setShowMobile={setShowMobileFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                <p className="text-sm text-gray-600">
                  {loading ? 'Loading...' : `${meta.total || properties.length} properties found`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Featured Properties */}
            {!loading && featuredProperties.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Properties</h2>
                <PropertyGrid
                  properties={featuredProperties}
                  viewMode="grid"
                  onView={handleViewProperty}
                  onSave={handleSaveProperty}
                  savedProperties={savedProperties}
                />
              </div>
            )}

            {/* All Properties */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                Failed to load properties: {error}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or selection</p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
            ) : (
              <PropertyGrid
                properties={properties}
                viewMode={viewMode}
                onView={handleViewProperty}
                onSave={handleSaveProperty}
                savedProperties={savedProperties}
              />
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handleSearch({ ...searchParams, page: Math.max(1, (meta.current_page || 1) - 1) })}
                  disabled={meta.current_page <= 1}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  onClick={() => handleSearch({ ...searchParams, page: Math.min(meta.last_page, (meta.current_page || 1) + 1) })}
                  disabled={meta.current_page >= meta.last_page}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Property Modal */}
      <AnimatePresence>
        {showPostForm && (
          <PropertyPostForm
            onClose={() => setShowPostForm(false)}
            onSubmit={handlePropertySubmit}
          />
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Property posted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filters */}
      <PropertyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        showMobile={showMobileFilters}
        setShowMobile={setShowMobileFilters}
      />
    </div>
  );
};

// Import PropertyPostForm dynamically to avoid circular dependency
const PropertyPostForm = ({ onClose, onSubmit }) => {
  const [Component, setComponent] = useState(null);
  
  React.useEffect(() => {
    import('../Component/property/PropertyPostForm').then(mod => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) return null;
  return <Component onClose={onClose} onSubmit={onSubmit} />;
};

export default Property;
