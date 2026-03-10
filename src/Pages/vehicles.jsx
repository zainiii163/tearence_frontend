import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, Menu, X, Home, Grid, Plus, LogIn, UserPlus, ChevronDown, Filter, ArrowUpDown, MapPin, Phone, Mail, Star, Heart, Eye, Clock, TrendingUp, Users, Globe } from 'lucide-react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

// Import Components
import VehicleNavbar from '../Component/vehicles/VehicleNavbar';
import VehicleHero from '../Component/vehicles/VehicleHero';
import VehicleCategoryGrid from '../Component/vehicles/VehicleCategoryGrid';
import VehicleFilters from '../Component/vehicles/VehicleFilters';
import VehicleGrid from '../Component/vehicles/VehicleGrid';
import VehicleActivityFeed from '../Component/vehicles/VehicleActivityFeed';
import VehicleFooter from '../Component/vehicles/VehicleFooter';
import VehiclePostForm from '../Component/vehicles/VehiclePostForm';

// Import CSS
import '../styles/vehicles.css';

// Sample Data
import { sampleVehicles, vehicleCategories, activityFeed } from '../data/mockVehicleData';

const VehiclesPage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState(sampleVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(sampleVehicles);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    country: '',
    city: '',
    priceRange: [0, 100000],
    verifiedSellers: false,
    category: ''
  });
  const [sortBy, setSortBy] = useState('mostRecent');
  const [viewMode, setViewMode] = useState('grid');
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/vehicles?postForm=true', 'You must be logged in to post a vehicle advertisement.')) {
      setShowPostForm(true);
    }
  };

  // Check for postForm parameter and show form if present (only if authenticated)
  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  // Handle scroll for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...vehicles];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(vehicle => vehicle.category === selectedCategory);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (key === 'priceRange') {
        filtered = filtered.filter(vehicle => 
          vehicle.price >= filters.priceRange[0] && vehicle.price <= filters.priceRange[1]
        );
      } else if (key === 'verifiedSellers') {
        if (filters.verifiedSellers) {
          filtered = filtered.filter(vehicle => vehicle.seller.verified);
        }
      } else if (filters[key]) {
        filtered = filtered.filter(vehicle => 
          vehicle[key]?.toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });

    // Apply sorting
    switch (sortBy) {
      case 'mostRecent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'mostViewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'lowestPrice':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'highestPrice':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'trending':
        filtered.sort((a, b) => b.saves - a.saves);
        break;
      default:
        break;
    }

    setFilteredVehicles(filtered);
  }, [vehicles, filters, sortBy, selectedCategory, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearAllFilters = () => {
    setFilters({
      make: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      bodyType: '',
      country: '',
      city: '',
      priceRange: [0, 100000],
      verifiedSellers: false,
      category: ''
    });
    setSelectedCategory('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <VehicleNavbar showPostForm={showPostForm} setShowPostForm={setShowPostForm} />

      {/* Hero Section */}
      <VehicleHero onSearch={handleSearch} onCategorySelect={handleCategorySelect} />

      {/* Sticky Search Bar (appears on scroll) */}
      {isScrolled && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handlePostClick}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Vehicle</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Grid */}
        <VehicleCategoryGrid 
          categories={vehicleCategories} 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {/* Filters and Results Header */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <VehicleFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
            />
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? `${selectedCategory} Vehicles` : 'All Vehicles'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredVehicles.length} vehicles found
                </p>
              </div>
              
              {/* View Mode and Sort */}
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="mostRecent">Most Recent</option>
                    <option value="mostViewed">Most Viewed</option>
                    <option value="lowestPrice">Lowest Price</option>
                    <option value="highestPrice">Highest Price</option>
                    <option value="trending">Trending</option>
                  </select>
                  <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Vehicle Grid */}
            <VehicleGrid 
              vehicles={filteredVehicles}
              viewMode={viewMode}
            />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-12">
          <VehicleActivityFeed activities={activityFeed} />
        </div>
      </main>

      {/* Footer */}
      <VehicleFooter />

      {/* Post Form Modal */}
      {showPostForm && <VehiclePostForm onClose={() => setShowPostForm(false)} />}
    </div>
  );
};

export default VehiclesPage;
