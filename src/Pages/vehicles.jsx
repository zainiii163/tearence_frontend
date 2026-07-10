import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { 
  Search, 
  Plus,
  Car,
  MapPin,
  TrendingUp,
  Activity
} from 'lucide-react';

// Import Components
import UnifiedNavbar from '../Component/UnifiedNavbar';
import VehicleHero from '../Component/vehicles/VehicleHero';
import VehicleCategoryGrid from '../Component/vehicles/VehicleCategoryGrid';
import VehicleFilters from '../Component/vehicles/VehicleFilters';
import VehicleGrid from '../Component/vehicles/VehicleGrid';
import VehicleActivityFeed from '../Component/vehicles/VehicleActivityFeed';

// Import API
import { 
  getVehicles, 
  getFeaturedVehicles, 
  getVehicleStatistics,
  getVehicleCategoriesForFilters,
  getVehicleTypes
} from '../services/vehiclesAPI';

// Import CSS
import '../styles/vehicles.css';

const VehiclesPage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State for data
  const [vehicles, setVehicles] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters
  const [filters, setFilters] = useState({
    vehicle_type: '',
    category: '',
    country: '',
    city: '',
    make: '',
    model: '',
    min_price: '',
    max_price: '',
    min_year: '',
    max_year: '',
    fuel_type: '',
    transmission: '',
    body_type: '',
    condition: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load vehicles when filters change
  useEffect(() => {
    if (!loading) {
      loadVehicles();
    }
  }, [loading, filters.vehicle_type, filters.category, filters.country, filters.city, filters.make, filters.model, filters.min_price, filters.max_price, filters.min_year, filters.max_year, filters.fuel_type, filters.transmission, filters.body_type, filters.condition, filters.search, filters.sort_by, filters.sort_order]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, categoriesData, typesData, featuredData] = await Promise.all([
        getVehicleStatistics(),
        getVehicleCategoriesForFilters(),
        getVehicleTypes(),
        getFeaturedVehicles(),
      ]);

      setStatistics(statsData.data?.data || statsData.data);
      setCategories(categoriesData.data?.data || categoriesData.data);
      setVehicleTypes(typesData.data?.data || typesData.data);
      setFeaturedVehicles(featuredData.data?.data || featuredData.data);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await getVehicles(filters);
      // Handle both response formats: {data: [...]} and {data: {data: [...]}}
      const vehiclesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePostClick = () => {
    if (requireAuth('/vehicles?postForm=true', 'You must be logged in to post a vehicle advertisement.')) {
      navigate('/post-vehicles');
    }
  };

  // Check for postForm parameter and redirect if present (only if authenticated)
  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      navigate('/post-vehicles');
    }
  }, [searchParams, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <UnifiedNavbar showBackButton={true} />

      {/* Hero Section */}
      <VehicleHero 
        statistics={statistics} 
        onPostClick={handlePostClick}
      />

      {/* Vehicle Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VehicleCategoryGrid 
          categories={categories}
          vehicleTypes={vehicleTypes}
          onCategorySelect={(type) => handleFilterChange('vehicle_type', type)}
        />
      </div>

      {/* Filters and Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <VehicleFilters
              filters={filters}
              categories={categories}
              vehicleTypes={vehicleTypes}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Vehicle Listings */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {vehicles.length} Vehicles Found
              </h2>
              <div className="flex gap-2">
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="created_at">Most Recent</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest First</option>
                  <option value="view_count">Most Viewed</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <VehicleGrid vehicles={vehicles} />
          </div>
        </div>
      </div>

      {/* Featured Vehicles */}
      {featuredVehicles.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Vehicles</h2>
            </div>
            <VehicleGrid vehicles={featuredVehicles} featured={true} />
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Activity className="w-6 h-6 text-red-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <VehicleActivityFeed />
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Vehicle Listings</h2>
          <p className="text-xl mb-8 text-red-100">Get notified when new vehicles matching your criteria are posted</p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-red-800 text-white px-6 py-3 rounded-r-lg hover:bg-red-900 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
