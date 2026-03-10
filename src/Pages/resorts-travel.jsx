import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  Eye, 
  Phone, 
  Globe, 
  Wifi, 
  Car, 
  Coffee,
  Pool,
  ParkingSquare,
  Wind,
  Dog,
  ChevronRight,
  Menu,
  X,
  User,
  LogIn,
  Plus,
  ChevronDown,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// Import Components
import TravelNavbar from '../Component/resorts/TravelNavbar';
import TravelHero from '../Component/resorts/TravelHero';
import TravelWorldMap from '../Component/resorts/TravelWorldMap';
import TravelCategoryGrid from '../Component/resorts/TravelCategoryGrid';
import TravelFeaturedDestinations from '../Component/resorts/TravelFeaturedDestinations';
import TravelGrid from '../Component/resorts/TravelGrid';
import TravelFilters from '../Component/resorts/TravelFilters';
import TravelBusinessProfile from '../Component/resorts/TravelBusinessProfile';
import TravelActivityFeed from '../Component/resorts/TravelActivityFeed';
import TravelUpsellBanner from '../Component/resorts/TravelUpsellBanner';
import TravelPostForm from '../Component/resorts/TravelPostForm';

// API Service
import resortsTravelApi from '../services/resortsTravelAPI';

const ResortsTravelPage = () => {
  const [searchParams, setSearchParams] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [filteredAdverts, setFilteredAdverts] = useState(travelAdverts);
  const [viewMode, setViewMode] = useState('grid');
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('mostRecent');
  const [savedAdverts, setSavedAdverts] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [travelAdverts, setTravelAdverts] = useState([]);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [travelCategories, setTravelCategories] = useState([]);
  const [pagination, setPagination] = useState({});

  // Check for postForm parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('postForm') === 'true') {
      setShowPostForm(true);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data from API
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load featured adverts
      const featuredResponse = await resortsTravelApi.getFeaturedAdverts({ per_page: 6 });
      setFeaturedDestinations(featuredResponse.data || []);

      // Load categories
      const categoriesResponse = await resortsTravelApi.getCategories();
      setTravelCategories(categoriesResponse.data || []);

      // Load all adverts with initial filters
      const advertsResponse = await resortsTravelApi.getTravelAdverts({ 
        per_page: 20,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      setTravelAdverts(advertsResponse.data || []);
      setFilteredAdverts(advertsResponse.data || []);
      setPagination({
        current_page: advertsResponse.current_page || 1,
        last_page: advertsResponse.last_page || 1,
        per_page: advertsResponse.per_page || 20,
        total: advertsResponse.total || 0
      });

    } catch (err) {
      setError(err.message || 'Failed to load travel data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load filtered adverts from API
  const loadFilteredAdverts = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await resortsTravelApi.getTravelAdverts({
        per_page: 20,
        sort_by: sortBy === 'mostRecent' ? 'created_at' : sortBy,
        sort_order: 'desc',
        ...params
      });
      setTravelAdverts(response.data || []);
      setFilteredAdverts(response.data || []);
      setPagination({
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
        per_page: response.per_page || 20,
        total: response.total || 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load travel adverts');
      console.error('Error loading filtered adverts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter adverts based on search and filters
  useEffect(() => {
    const params = {};

    // Filter by category
    if (selectedCategory) {
      params.category_id = selectedCategory.id;
    }

    // Filter by region (country)
    if (selectedRegion) {
      params.country = selectedRegion;
    }

    // Filter by search
    if (searchParams.destination) {
      params.search = searchParams.destination;
    }

    if (searchParams.priceRange) {
      const [min, max] = searchParams.priceRange.split('-').map(Number);
      params.price_min = min;
      params.price_max = max;
    }

    // Filter by advert type
    if (searchParams.advertType) {
      params.advert_type = searchParams.advertType;
    }

    // Load filtered data
    loadFilteredAdverts(params);
  }, [selectedCategory, selectedRegion, searchParams, sortBy]);

  const handleSearch = (searchData) => {
    setSearchParams(searchData);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const handleSaveAdvert = async (advertId) => {
    try {
      // Call API to save/unsave advert
      await resortsTravelApi.saveTravelAdvert(advertId);
      
      // Update local state
      const newSaved = new Set(savedAdverts);
      if (newSaved.has(advertId)) {
        newSaved.delete(advertId);
      } else {
        newSaved.add(advertId);
      }
      setSavedAdverts(newSaved);
    } catch (error) {
      console.error('Error saving advert:', error);
      // Still update local state for better UX even if API fails
      const newSaved = new Set(savedAdverts);
      if (newSaved.has(advertId)) {
        newSaved.delete(advertId);
      } else {
        newSaved.add(advertId);
      }
      setSavedAdverts(newSaved);
    }
  };

  const handleBusinessProfile = (business) => {
    setSelectedBusiness(business);
  };

  if (showPostForm) {
    return <TravelPostForm onClose={() => setShowPostForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700">Loading travel destinations...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={loadInitialData}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>Featured Destinations: {featuredDestinations.length}</p>
            <p>Categories: {travelCategories.length}</p>
            <p>Travel Adverts: {travelAdverts.length}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <TravelNavbar />

      {/* Hero Section */}
      <TravelHero onSearch={handleSearch} />

      {/* Interactive World Map */}
      <TravelWorldMap onRegionSelect={handleRegionSelect} selectedRegion={selectedRegion} />

      {/* Travel Categories Grid */}
      <TravelCategoryGrid 
        categories={travelCategories} 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Featured Destinations */}
      <TravelFeaturedDestinations destinations={featuredDestinations} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <TravelFilters
              onFilterChange={setSearchParams}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onSortChange={setSortBy}
              sortBy={sortBy}
            />
          </div>

          {/* Main Listings */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? selectedCategory.name : 'All Travel Services'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredAdverts.length} results found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>

            {/* Travel Adverts Grid */}
            <TravelGrid
              adverts={filteredAdverts}
              viewMode={viewMode}
              onSaveAdvert={handleSaveAdvert}
              savedAdverts={savedAdverts}
              onBusinessProfile={handleBusinessProfile}
            />
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <TravelActivityFeed />

      {/* Upsell Banner */}
      <TravelUpsellBanner onUpgrade={() => setShowPostForm(true)} />

      {/* Business Profile Modal */}
      <AnimatePresence>
        {selectedBusiness && (
          <TravelBusinessProfile
            business={selectedBusiness}
            onClose={() => setSelectedBusiness(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <TravelFilters
                onFilterChange={setSearchParams}
                selectedCategory={selectedCategory}
                selectedRegion={selectedRegion}
                onSortChange={setSortBy}
                sortBy={sortBy}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResortsTravelPage;
