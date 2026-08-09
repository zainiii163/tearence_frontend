import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import UnifiedNavbar from '../Component/UnifiedNavbar';
import TravelHero from '../Component/resorts/TravelHero';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import TravelWorldMap from '../Component/resorts/TravelWorldMap';
import TravelCategoryGrid from '../Component/resorts/TravelCategoryGrid';
import TravelGrid from '../Component/resorts/TravelGrid';
import TravelFilters from '../Component/resorts/TravelFilters';
import TravelBusinessProfile from '../Component/resorts/TravelBusinessProfile';
import TravelPostFormModal from '../Component/resorts/TravelPostFormModal';
import TravelDetails from '../Component/resorts/TravelDetails';
import Footer from '../Component/Footer';
import { getCategoryTheme } from '../constants/categoryThemes';

// API Service
import resortsTravelApi from '../services/resortsTravelAPI';

const ResortsTravelPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [travelAdverts, setTravelAdverts] = useState([]);
  const [filteredAdverts, setFilteredAdverts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showPostFormModal, setShowPostFormModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('mostRecent');
  const [savedAdverts, setSavedAdverts] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [travelCategories, setTravelCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const theme = getCategoryTheme('resorts');

  // Check for postForm parameter in URL
  useEffect(() => {
    const checkPostFormParam = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const postFormParam = urlParams.get('postForm');
      if (postFormParam === 'true') {
        setShowPostFormModal(true);
        // Clean up URL parameter
        const url = new URL(window.location);
        url.searchParams.delete('postForm');
        window.history.replaceState({}, '', url);
      }
    };
    
    checkPostFormParam();
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
      const advertsList = Array.isArray(advertsResponse.data)
        ? advertsResponse.data
        : (advertsResponse.data?.data || []);
      setTravelAdverts(advertsList);
      setFilteredAdverts(advertsList);
      setPagination({
        current_page: advertsResponse.data?.current_page || 1,
        last_page: advertsResponse.data?.last_page || 1,
        per_page: advertsResponse.data?.per_page || 20,
        total: advertsResponse.data?.total || 0
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
      const advertsList = Array.isArray(response.data)
        ? response.data
        : (response.data?.data || []);
      setTravelAdverts(advertsList);
      setFilteredAdverts(advertsList);
      setPagination({
        current_page: response.data?.current_page || 1,
        last_page: response.data?.last_page || 1,
        per_page: response.data?.per_page || 20,
        total: response.data?.total || 0
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

  const handleFormSuccess = (newAdvert) => {
    // Reload data after successful submission
    loadInitialData();
  };

  if (slug) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton />
        <div className="pt-16">
          <TravelDetails />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <CategoryPageShell
      categoryId="resorts"
      backHref="/"
      contentClassName="page-container py-4"
      hero={<TravelHero onSearch={handleSearch} />}
      categoryGrid={
        <>
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4" />
                <p className="text-gray-700">Loading travel destinations...</p>
              </div>
            </div>
          )}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    onClick={loadInitialData}
                    className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
          <TravelWorldMap onRegionSelect={handleRegionSelect} selectedRegion={selectedRegion} />
          <TravelCategoryGrid
            categories={travelCategories}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </>
      }
      premiumReel={
        featuredDestinations.length > 0 ? (
          <CompactPremiumReel
            items={featuredDestinations.map((d) => ({
              ...d,
              featured: true,
              image_url: d.image || d.main_image || d.cover_image,
            }))}
            title="Featured"
            getHref={(item) => `/resorts-travel/${item.slug || item.id}`}
            accentClass={theme.accentText || 'text-cyan-700'}
            borderAccent="hover:border-cyan-300"
          />
        ) : null
      }
      bottomCta={{
        buttonLabel: 'List your service',
        onPostClick: () => setShowPostFormModal(true),
        theme: theme.ctaTheme,
      }}
      afterContent={
        <>
          <TravelPostFormModal
            isOpen={showPostFormModal}
            onClose={() => setShowPostFormModal(false)}
            onSuccess={handleFormSuccess}
          />
          <AnimatePresence>
            {selectedBusiness && (
              <TravelBusinessProfile
                business={selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
                <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button type="button" onClick={() => setShowFilters(false)}>
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
        </>
      }
    >
        <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
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
    </CategoryPageShell>
  );
};

export default ResortsTravelPage;
