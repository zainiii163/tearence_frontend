import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import ServicesNavbar from '../Component/ServicesMarketplace/ServicesNavbar';
import ServicesHero from '../Component/ServicesMarketplace/ServicesHero';
import ServiceCategoriesGrid from '../Component/ServicesMarketplace/ServiceCategoriesGrid';
import { ServicesGrid } from '../Component/ServicesMarketplace/ServicesGrid';
import ServiceFilters from '../Component/ServicesMarketplace/ServiceFilters';
import ServicePostForm from '../Component/ServicesMarketplace/PostForm/ServicePostForm';
import ServicesFooter from '../Component/ServicesMarketplace/ServicesFooter';
import { servicesApi } from '../services/servicesApi';

const ServicesMarketplacePage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const { logIn } = useSelector((store) => store.auth);
  const [searchParams] = useSearchParams();
  // State management
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
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
    if (postFormParam === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  // Mock data for development
  const mockServices = [
    {
      id: 1,
      title: 'Professional Web Development',
      category: 'Web Development',
      provider: {
        name: 'John Smith',
        photo: '/img/default-avatar.png',
        country: 'US',
        verified: true,
        rating: 4.8
      },
      startingPrice: 299,
      description: 'Custom website development with modern technologies',
      badges: ['featured', 'verified'],
      views: 1250,
      reviewCount: 47,
      deliveryTime: '7 days',
      image: null
    },
    {
      id: 2,
      title: 'Creative Logo Design',
      category: 'Graphic Design',
      provider: {
        name: 'Sarah Johnson',
        photo: '/img/default-avatar.png',
        country: 'UK',
        verified: true,
        rating: 4.9
      },
      startingPrice: 99,
      description: 'Creative logo designs for businesses and brands',
      badges: ['promoted'],
      views: 890,
      reviewCount: 32,
      deliveryTime: '3 days',
      image: null
    },
    {
      id: 3,
      title: 'Content Writing Services',
      category: 'Writing & Translation',
      provider: {
        name: 'Emily Chen',
        photo: '/img/default-avatar.png',
        country: 'CA',
        verified: false,
        rating: 4.7
      },
      startingPrice: 149,
      description: 'High-quality content writing for blogs and websites',
      badges: [],
      views: 567,
      reviewCount: 18,
      deliveryTime: '5 days',
      image: null
    },
    {
      id: 4,
      title: 'Digital Marketing Expert',
      category: 'Marketing & SEO',
      provider: {
        name: 'Michael Brown',
        photo: '/img/default-avatar.png',
        country: 'AU',
        verified: true,
        rating: 4.6
      },
      startingPrice: 399,
      description: 'Comprehensive digital marketing and SEO strategies',
      badges: ['sponsored'],
      views: 2100,
      reviewCount: 89,
      deliveryTime: '14 days',
      image: null
    },
    {
      id: 5,
      title: 'Virtual Assistant Services',
      category: 'Virtual Assistants',
      provider: {
        name: 'Lisa Wang',
        photo: '/img/default-avatar.png',
        country: 'SG',
        verified: true,
        rating: 4.9
      },
      startingPrice: 199,
      description: 'Professional virtual assistant for administrative tasks',
      badges: ['featured'],
      views: 1450,
      reviewCount: 56,
      deliveryTime: '1 day',
      image: null
    },
    {
      id: 6,
      title: 'Mobile App Development',
      category: 'Web Development',
      provider: {
        name: 'David Kumar',
        photo: '/img/default-avatar.png',
        country: 'IN',
        verified: false,
        rating: 4.5
      },
      startingPrice: 599,
      description: 'Native and cross-platform mobile app development',
      badges: [],
      views: 780,
      reviewCount: 23,
      deliveryTime: '30 days',
      image: null
    },
    {
      id: 7,
      title: 'Business Consulting',
      category: 'Business Support',
      provider: {
        name: 'Robert Taylor',
        photo: '/img/default-avatar.png',
        country: 'US',
        verified: true,
        rating: 4.8
      },
      startingPrice: 799,
      description: 'Strategic business consulting and growth planning',
      badges: ['sponsored', 'verified'],
      views: 3200,
      reviewCount: 124,
      deliveryTime: '21 days',
      image: null
    },
    {
      id: 8,
      title: 'Photography Services',
      category: 'Photography & Video',
      provider: {
        name: 'Anna Martinez',
        photo: '/img/default-avatar.png',
        country: 'ES',
        verified: false,
        rating: 4.7
      },
      startingPrice: 249,
      description: 'Professional photography for events and portraits',
      badges: [],
      views: 920,
      reviewCount: 41,
      deliveryTime: '2 days',
      image: null
    }
  ];

  const mockCategories = [
    { id: 1, name: 'Graphic Design', icon: 'Palette', serviceCount: 2847 },
    { id: 2, name: 'Web Development', icon: 'Code', serviceCount: 3521 },
    { id: 3, name: 'Writing & Translation', icon: 'PenTool', serviceCount: 1923 },
    { id: 4, name: 'Marketing & SEO', icon: 'TrendingUp', serviceCount: 2156 },
    { id: 5, name: 'Business Support', icon: 'Briefcase', serviceCount: 1678 },
    { id: 6, name: 'Virtual Assistants', icon: 'Users', serviceCount: 1234 },
    { id: 7, name: 'Photography & Video', icon: 'Camera', serviceCount: 987 },
    { id: 8, name: 'Music & Audio', icon: 'Music', serviceCount: 756 },
    { id: 9, name: 'Lifestyle Services', icon: 'Heart', serviceCount: 1456 },
    { id: 10, name: 'Fitness & Coaching', icon: 'Dumbbell', serviceCount: 834 },
    { id: 11, name: 'Trades & Repairs', icon: 'Wrench', serviceCount: 567 },
    { id: 12, name: 'Cleaning & Domestic', icon: 'Sparkles', serviceCount: 445 },
    { id: 13, name: 'Event Services', icon: 'Calendar', serviceCount: 678 },
    { id: 14, name: 'Transport & Delivery', icon: 'Truck', serviceCount: 323 }
  ];

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load services from backend API
        const servicesResponse = await servicesApi.getServices({
          page: 1,
          per_page: 20,
          sort_by: sortBy
        });
        
        // Load categories from backend API
        const categoriesResponse = await servicesApi.getCategories();
        
        // Load featured and popular services
        const [featuredResponse, popularResponse] = await Promise.all([
          servicesApi.getFeaturedServices({ limit: 6 }),
          servicesApi.getPopularServices({ limit: 6 })
        ]);
        
        setServices(servicesResponse.data || []);
        setCategories(categoriesResponse.data || []);
        
      } catch (error) {
        console.error('Error initializing data:', error);
        setError(error.message || 'Failed to load services');
        // Fallback to mock data if API fails
        setServices(mockServices);
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    // Check for postForm parameter and authentication
    if (searchParams.get('postForm') === 'true') {
      if (!logIn) {
        window.location.href = '/login';
        return;
      }
      setShowPostForm(true);
    }

    initializeData();
  }, [searchParams, logIn]);

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
      {/* Navbar */}
      <ServicesNavbar />

      {/* Hero Section */}
      <ServicesHero 
        onSearch={handleSearch}
        categories={categories}
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
      <ServicesFooter />

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
