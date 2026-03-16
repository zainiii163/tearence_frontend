import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../Component/Navbar';
import ServicesHero from '../Component/ServicesMarketplace/ServicesHero';
import ServiceCategoriesGrid from '../Component/ServicesMarketplace/ServiceCategoriesGrid';
import { ServicesGrid } from '../Component/ServicesMarketplace/ServicesGrid';
import ServiceFilters from '../Component/ServicesMarketplace/ServiceFilters';
import ServicePostForm from '../Component/ServicesMarketplace/PostForm/ServicePostForm';
import Footer from '../Component/Footer';
import { servicesApi } from '../services/servicesApi';

const ServicesMarketplacePage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();
  const { logIn } = useSelector((store) => store.auth);
  const [searchParams] = useSearchParams();
  // State management
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    priceRange: '',
    deliveryTime: '',
    rating: '',
    verifiedOnly: false
  });
  const [sortBy, setSortBy] = useState('most_recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/services?postForm=true', 'You must be logged in to post a service.')) {
      setShowPostForm(true);
    }
  };

  // Handle URL parameter for post form (only if authenticated)
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true') {
      if (!isAuthenticated) {
        // Store redirect URL for after login
        sessionStorage.setItem('redirectAfterLogin', '/services?postForm=true');
        navigate('/login');
        return;
      }
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated, navigate]);


  // Load initial data from API
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load services data with proper error handling
      const servicesResponse = await servicesApi.getServices({
        sort_by: sortBy,
        per_page: 20
      });
      
      // Load categories
      const categoriesResponse = await servicesApi.getCategories();
      
      // Set data from API responses
      setServices(servicesResponse.data || []);
      setCategories(categoriesResponse.data || []);
      
      // Set stats from API response or calculate from services
      setStats({
        totalServices: servicesResponse.meta?.total || servicesResponse.data?.length || 0,
        totalProviders: new Set(servicesResponse.data?.map(s => s.provider_id)).size || 0,
        totalCountries: new Set(servicesResponse.data?.map(s => s.provider?.country)).size || 0,
        satisfactionRate: 98 // This could come from API in future
      });
      
    } catch (err) {
      console.error('Error loading services data:', err);
      // Handle different error types
      if (err.response?.status === 401) {
        setError('Authentication required. Please login to continue.');
      } else if (err.response?.status === 404) {
        setError('Services API not found. Please check backend configuration.');
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to load services');
      }
      // Set empty arrays on error
      setServices([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data on component mount and when sortBy changes
  useEffect(() => {
    loadInitialData();
  }, [sortBy]);


  // Apply filters to services
  const filteredServices = services.filter(service => {
    // Category filter
    if (filters.category && service.category !== filters.category) {
      return false;
    }
    
    // Country filter
    if (filters.country && service.provider?.country !== filters.country) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (service.startingPrice < min || service.startingPrice > max) {
        return false;
      }
    }
    
    // Verified only filter
    if (filters.verifiedOnly && !service.provider?.verified) {
      return false;
    }
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = service.title.toLowerCase().includes(query);
      const descMatch = service.description.toLowerCase().includes(query);
      const categoryMatch = service.category.toLowerCase().includes(query);
      if (!titleMatch && !descMatch && !categoryMatch) {
        return false;
      }
    }
    
    return true;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'most_recent':
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      case 'price_low_high':
        return a.startingPrice - b.startingPrice;
      case 'price_high_low':
        return b.startingPrice - a.startingPrice;
      case 'rating_high_low':
        return (b.provider?.rating || 0) - (a.provider?.rating || 0);
      case 'most_viewed':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  // Handle search and filter changes
  useEffect(() => {
    const loadFilteredServices = async () => {
      try {
        setLoading(true);
        
        const params = {
          sort_by: sortBy,
          per_page: 20,
          search: searchQuery || undefined,
          category: filters.category || undefined,
          country: filters.country || undefined,
          verified_only: filters.verifiedOnly || undefined,
        };
        
        // Add price range filter if specified
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          params.min_price = min;
          params.max_price = max;
        }
        
        const servicesResponse = await servicesApi.getServices(params);
        setServices(servicesResponse.data || []);
        
      } catch (err) {
        console.error('Error loading filtered services:', err);
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    // Load filtered services when filters change
    if (searchQuery || filters.category || filters.country || filters.priceRange || filters.verifiedOnly) {
      const timeoutId = setTimeout(() => {
        loadFilteredServices();
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      // Load default services if no filters
      loadInitialData();
    }
  }, [searchQuery, filters, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Services</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Event handlers
  const handleSearch = async (keyword, location, category) => {
    try {
      setLoading(true);
      setSearchQuery(keyword);
      setSelectedLocation(location);
      if (category) {
        setFilters(prev => ({ ...prev, category }));
      }
      
      // Call API with search parameters
      const searchParams = {
        search: keyword,
        location,
        category: category || filters.category,
        sort_by: sortBy
      };
      
      const response = await servicesApi.getServices(searchParams);
      setServices(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    try {
      setLoading(true);
      setFilters(prev => ({ ...prev, ...newFilters }));
      
      // Call API with filter parameters
      const filterParams = {
        ...newFilters,
        search: searchQuery,
        sort_by: sortBy
      };
      
      const response = await servicesApi.getServices(filterParams);
      setServices(response.data || []);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = async (sortOption) => {
    try {
      setLoading(true);
      setSortBy(sortOption);
      
      // Call API with sort parameters
      const sortParams = {
        ...filters,
        search: searchQuery,
        sort_by: sortOption
      };
      
      const response = await servicesApi.getServices(sortParams);
      setServices(response.data || []);
    } catch (error) {
      console.error('Sort error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setFilters(prev => ({ ...prev, category: category.id }));
    // Scroll to services section
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickView = (service) => {
    console.log('Quick view:', service);
    // Implement quick view modal
  };

  const handleSave = (serviceId, isSaved) => {
    console.log('Save service:', serviceId, isSaved);
    // Implement save functionality
  };

  const handleContact = async (service) => {
    try {
      console.log('Contact service:', service);
      
      // Check if user is logged in
      if (!logIn) {
        // Redirect to login page
        window.location.href = '/login';
        return;
      }
      
      // Send enquiry via API
      const enquiryData = {
        message: `Hi ${service.provider?.name || 'Service Provider'},\n\nI'm interested in your service: "${service.title}"\n\nPlease let me know more details about your service.\n\nThank you!`,
        name: '', // Will be collected in a real form
        email: '', // Will be collected in a real form
        phone: '' // Will be collected in a real form
      };
      
      await servicesApi.sendEnquiry(service.id, enquiryData);
      
      // Show success message
      alert('Enquiry sent successfully! The service provider will contact you soon.');
      
    } catch (error) {
      console.error('Error sending enquiry:', error);
      alert('Failed to send enquiry. Please try again.');
    }
  };

  const handlePostService = () => {
    if (!logIn) {
      window.location.href = '/login';
      return;
    }
    setShowPostForm(true);
  };

  const handlePostFormSubmit = async (formData) => {
    try {
      console.log('Submitting service:', formData);
      // In a real app, this would send data to API
      
      // Show success message
      setShowPostForm(false);
      
      // Optionally refresh services list
      // await fetchServices();
      
    } catch (error) {
      console.error('Error submitting service:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navbar */}
      <Navbar />

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
      <ServicesHero 
        onSearch={handleSearch}
        categories={categories}
        stats={stats}
      />

      {/* Main Content */}
      <main>
        {/* Service Categories */}
        <ServiceCategoriesGrid 
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />

        {/* Services Section */}
        <div id="services-section" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <ServiceFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                  sortBy={sortBy}
                  categories={categories}
                />
              </div>

              {/* Services Grid */}
              <div className="lg:col-span-3">
                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">!</span>
                      </div>
                      <div>
                        <h3 className="text-red-800 font-medium">Error Loading Services</h3>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Available Services
                    </h2>
                    <p className="text-gray-600">
                      {loading ? 'Loading...' : `${services.length} services found`}
                    </p>
                  </div>
                  
                  {/* Post Service Button */}
                  <button
                    onClick={handlePostClick}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Post Your Service</span>
                  </button>
                </div>

                {/* Services Grid */}
                <ServicesGrid
                  services={services}
                  loading={loading}
                  onQuickView={handleQuickView}
                  onSave={handleSave}
                  onContact={handleContact}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed (Optional) */}
        <div className="py-8 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>A user from Germany viewed a graphic design service in London</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>A web development service was posted in Dubai</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Someone saved a content writing service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Post Service Modal */}
      {showPostForm && (
        <ServicePostForm
          onClose={() => setShowPostForm(false)}
          onSubmit={handlePostFormSubmit}
        />
      )}

      {/* Floating Post Service Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={handlePostClick}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServicesMarketplacePage;
