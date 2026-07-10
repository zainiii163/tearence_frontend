import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  getVehicles, 
  getVehicleCategories, 
  getVehicleMakes, 
  getVehicleModels,
  getFeaturedVehicles,
  getRecentVehicles,
  getVehicleStatistics,
  getPopularMakes,
  getMyVehicles
} from '../../services/vehiclesAPI';
import VehicleCard from './VehicleCard';
import VehicleFilters from './VehicleFilters';
import VehicleGrid from './VehicleGrid';

const VehiclesListing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [popularMakes, setPopularMakes] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMyVehicles, setShowMyVehicles] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 12,
    category: '',
    make: '',
    model: '',
    advert_type: '',
    condition: '',
    min_price: '',
    max_price: '',
    min_year: '',
    max_year: '',
    country: '',
    city: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    featured: false,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch data using real API endpoints
      let vehiclesData;
      if (showMyVehicles) {
        vehiclesData = await getMyVehicles();
        // For my vehicles, we need to adapt the response format
        vehiclesData = {
          data: Array.isArray(vehiclesData) ? vehiclesData : (vehiclesData.data || []),
          meta: { current_page: 1, last_page: 1, per_page: 12, total: vehiclesData?.length || 0 }
        };
      } else {
        vehiclesData = await getVehicles(filters);
        // Handle different response formats
        if (Array.isArray(vehiclesData)) {
          vehiclesData = {
            data: vehiclesData,
            meta: { current_page: 1, last_page: 1, per_page: vehiclesData.length, total: vehiclesData.length }
          };
        } else if (!vehiclesData.data) {
          vehiclesData = {
            data: vehiclesData,
            meta: { current_page: 1, last_page: 1, per_page: vehiclesData?.length || 0, total: vehiclesData?.length || 0 }
          };
        }
      }
      
      if (vehiclesData.data && Array.isArray(vehiclesData.data)) {
        setVehicles(vehiclesData.data);
        
        // Handle pagination data
        const meta = vehiclesData.meta || {};
        const paginationData = {
          current_page: meta.current_page || 1,
          last_page: meta.last_page || 1,
          per_page: meta.per_page || 12,
          total: meta.total || 0,
          from: meta.from || 0,
          to: meta.to || 0,
        };
        setPagination(paginationData);
      } else {
        console.error('VehiclesListing - invalid data format:', vehiclesData);
        throw new Error('Invalid vehicles data format');
      }
      
      // Fetch additional data in parallel with better error handling
      const additionalDataPromises = [
        getFeaturedVehicles().catch(err => { console.warn('Failed to fetch featured vehicles:', err); return { data: [] }; }),
        getRecentVehicles().catch(err => { console.warn('Failed to fetch recent vehicles:', err); return { data: [] }; }),
        getVehicleCategories().catch(err => { console.warn('Failed to fetch categories:', err); return { data: [] }; }),
        getVehicleMakes().catch(err => { console.warn('Failed to fetch makes:', err); return { data: [] }; }),
        getVehicleStatistics().catch(err => { console.warn('Failed to fetch statistics:', err); return { data: null }; }),
        getPopularMakes().catch(err => { console.warn('Failed to fetch popular makes:', err); return { data: [] }; })
      ];
      
      const [featuredData, recentData, categoriesData, makesData, statsData, popularMakesData] = await Promise.all(additionalDataPromises);
      
      // Handle different response formats for each API
      if (featuredData && (Array.isArray(featuredData) || (featuredData.data && Array.isArray(featuredData.data)))) {
        setFeaturedVehicles(Array.isArray(featuredData) ? featuredData : featuredData.data);
      }
      
      if (recentData && (Array.isArray(recentData) || (recentData.data && Array.isArray(recentData.data)))) {
        setRecentVehicles(Array.isArray(recentData) ? recentData : recentData.data);
      }
      
      if (categoriesData && (Array.isArray(categoriesData) || (categoriesData.data && Array.isArray(categoriesData.data)))) {
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data);
      }
      
      if (makesData && (Array.isArray(makesData) || (makesData.data && Array.isArray(makesData.data)))) {
        setMakes(Array.isArray(makesData) ? makesData : makesData.data);
      }
      
      if (statsData && statsData.data) {
        setStatistics(statsData.data);
      }
      
      if (popularMakesData && (Array.isArray(popularMakesData) || (popularMakesData.data && Array.isArray(popularMakesData.data)))) {
        setPopularMakes(Array.isArray(popularMakesData) ? popularMakesData : popularMakesData.data);
      }
      
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      
      // Handle rate limiting specifically
      if (error.status === 429) {
        const retryAfter = error.retryAfter || 60;
        setError(`Too many requests. Retrying in ${retryAfter} seconds...`);
        setRetryCountdown(retryAfter);
        
        // Start countdown
        const countdown = setInterval(() => {
          setRetryCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              // Auto retry when countdown reaches 0
              setTimeout(() => {
                fetchInitialData();
              }, 1000);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Failed to load vehicle data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, showMyVehicles]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Refresh data when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && Date.now() - lastRefresh > 5000) { // Refresh if more than 5 seconds ago
        fetchInitialData();
        setLastRefresh(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchInitialData, lastRefresh]);

  const handleSearch = useCallback((searchTerm) => {
    // Debounce search to prevent rate limiting
    const timeoutId = setTimeout(() => {
      handleFilterChange('search', searchTerm);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleMakeChange = async (makeId) => {
    handleFilterChange('make', makeId);
    handleFilterChange('model', ''); // Reset model when make changes
    
    if (makeId) {
      try {
        const response = await getVehicleModels(makeId);
        if (response.data && Array.isArray(response.data)) {
          setModels(response.data);
        } else {
          setModels([]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
      }
    } else {
      setModels([]);
    }
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      per_page: 12,
      category: '',
      make: '',
      model: '',
      advert_type: '',
      condition: '',
      min_price: '',
      max_price: '',
      min_year: '',
      max_year: '',
      country: '',
      city: '',
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      featured: false,
    });
    setModels([]);
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  console.log('🔍 Render: vehicles array:', vehicles);

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          {retryCountdown > 0 && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span className="text-sm">Auto-retrying in {retryCountdown} seconds...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle for My Vehicles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {showMyVehicles ? 'My Vehicles' : 'All Vehicles'}
        </h2>
        <button
          onClick={() => {
            setShowMyVehicles(!showMyVehicles);
            // Reset filters when toggling
            setFilters(prev => ({
              ...prev,
              page: 1,
              status: !showMyVehicles ? '' : 'active'
            }));
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showMyVehicles ? 'Show All Vehicles' : 'Show My Vehicles'}
        </button>
      </div>

      {/* Statistics Dashboard */}
      {statistics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
            <p className="text-2xl font-bold text-gray-900">{statistics.total_vehicles}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Vehicles</h3>
            <p className="text-2xl font-bold text-green-600">{statistics.active_vehicles}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Featured Vehicles</h3>
            <p className="text-2xl font-bold text-indigo-600">{statistics.featured_vehicles}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
          </div>
        </motion.div>
      )}

      {/* Featured Vehicles */}
      {featuredVehicles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} featured />
            ))}
          </div>
        </motion.div>
      )}

      {/* Popular Makes */}
      {popularMakes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Makes</h2>
          <div className="flex flex-wrap gap-2">
            {popularMakes.map((make) => (
              <button
                key={make.id}
                onClick={() => handleMakeChange(make.id)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                {make.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters and Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <VehicleFilters
            filters={filters}
            categories={categories}
            makes={makes}
            models={models}
            onFilterChange={handleFilterChange}
            onMakeChange={handleMakeChange}
            onSearch={handleSearch}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Vehicle Listings */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              All Vehicles ({pagination.total || 0})
            </h2>
            <div className="flex items-center gap-4">
              <select
                value={`${filters.sort_by}_${filters.sort_order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('_');
                  handleFilterChange('sort_by', sort);
                  handleFilterChange('sort_order', order);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="created_at_desc">Latest First</option>
                <option value="created_at_asc">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest First</option>
                <option value="year_asc">Year: Oldest First</option>
                <option value="views_desc">Most Viewed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : vehicles.length > 0 ? (
            <>
              <VehicleGrid vehicles={vehicles} />
              
              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded-lg ${
                          page === pagination.current_page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Vehicles */}
      {recentVehicles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VehiclesListing;
