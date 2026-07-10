import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, Plus, Check, Award, Zap, Crown, Star } from 'lucide-react';
import ServicesHero from '../Component/Services/ServicesHero';
import ServicesCategories from '../Component/Services/ServicesCategories';
import ServicesGrid from '../Component/Services/ServicesGrid';
import ServicesPostForm from '../Component/Services/ServicesPostForm';
import Footer from '../Component/Footer';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import BusinessCalculators from '../Component/calculators/BusinessCalculators';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { servicesApi } from '../services/servicesSolutionsApi';

const ServicesPage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();
  const { logIn: isLoggedIn } = useSelector((store) => store.auth);
  const [searchParams] = useSearchParams();

  const [showPostForm, setShowPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [filters, setFilters] = useState({
    category_id: '',
    country: '',
    min_price: '',
    max_price: '',
    service_type: '',
    verified_only: false,
    promotion_type: ''
  });
  const [servicesData, setServicesData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const pagination = paginationData || { current_page: 1, per_page: 20, total: 0, last_page: 1 };

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/services?postForm=true', 'You must be logged in to post a service.')) {
      setShowPostForm(true);
    }
  };

  // Handle URL parameter for post form
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true') {
      if (!isAuthenticated) {
        sessionStorage.setItem('redirectAfterLogin', '/services?postForm=true');
        navigate('/login');
        return;
      }
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated, navigate]);

  // Load categories and analytics from API on mount
  useEffect(() => {
    const loadMeta = async () => {
      setLoadingCategories(true);
      try {
        const catRes = await servicesApi.getCategories().catch(() => ({ data: [] }));
        // Handle various response shapes: { data: [...] }, { data: { data: [...] } }, or [...]
        let cats = [];
        if (Array.isArray(catRes)) {
          cats = catRes;
        } else if (Array.isArray(catRes?.data?.data)) {
          cats = catRes.data.data;
        } else if (Array.isArray(catRes?.data)) {
          cats = catRes.data;
        }
        console.log('Categories loaded:', cats.length, cats);
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoadingCategories(false);
      }
      try {
        const analyticsRes = await servicesApi.getAnalytics().catch(() => null);
        if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Error loading analytics:', err);
      }
    };
    loadMeta();
  }, []);

  // Fetch services from API
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        per_page: 20,
        sort_by: sortBy,
      };
      if (searchQuery) params.search = searchQuery;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.country) params.country = filters.country;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.service_type) params.service_type = filters.service_type;
      if (filters.verified_only) params.verified_only = true;
      if (filters.promotion_type) params.promotion_type = filters.promotion_type;

      const response = await servicesApi.getServices(params);
      const data = response?.data || response;
      if (Array.isArray(data)) {
        setServicesData(data);
        setPaginationData(response?.meta || response?.pagination || {});
      } else if (data?.data) {
        setServicesData(data.data);
        setPaginationData(data.meta || data.pagination || data);
      } else {
        setServicesData([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, searchQuery, filters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Helper function to get country flag
  const getCountryFlag = (country) => {
    const flags = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'Mexico': '🇲🇽',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Belgium': '🇧🇪',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'New Zealand': '🇳🇿',
      'Singapore': '🇸🇬',
      'UAE': '🇦🇪',
      'South Africa': '🇿🇦',
      'Russia': '🇷🇺',
      'Turkey': '🇹🇷',
      'Poland': '🇵🇱',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Peru': '🇵🇪',
      'Venezuela': '🇻🇪',
      'Egypt': '🇪🇬',
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'Morocco': '🇲🇦',
      'South Korea': '🇰🇷',
      'Thailand': '🇹🇭',
      'Malaysia': '🇲🇾',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Vietnam': '🇻🇳',
      'Pakistan': '🇵🇰',
      'Bangladesh': '🇧🇩',
      'Saudi Arabia': '🇸🇦',
      'Israel': '🇮🇱',
      'Greece': '🇬🇷',
      'Portugal': '🇵🇹',
      'Ireland': '🇮🇪',
      'Czech Republic': '🇨🇿',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Ukraine': '🇺🇦',
      'Belarus': '🇧🇾',
      'Croatia': '🇭🇷',
      'Serbia': '🇷🇸',
      'Bulgaria': '🇧🇬',
      'Slovakia': '🇸🇰',
      'Slovenia': '🇸🇮',
      'Estonia': '🇪🇪',
      'Latvia': '🇱🇻',
      'Lithuania': '🇱🇹',
      'Luxembourg': '🇱🇺',
      'Malta': '🇲🇹',
      'Cyprus': '🇨🇾',
      'Iceland': '🇮🇸'
    };
    return flags[country] || '🌍';
  };

  // Handler functions
  const handleFilterChange = (filterObj) => {
    setFilters(prev => ({ ...prev, ...filterObj }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePostServiceClick = () => {
    if (isLoggedIn) {
      setShowPostForm(true);
    } else {
      navigate('/login');
    }
  };

  const handlePostFormSubmit = (serviceData) => {
    console.log('Service submitted:', serviceData);
    setShowPostForm(false);
    fetchServices();
  };

  // Data variables - use real data only
  const servicesDataList = Array.isArray(servicesData) ? servicesData : [];
  const displayCategories = Array.isArray(categories) ? categories : [];

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

  // Data computed from real API state
  const paginationInfo = pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navbar */}
      <UnifiedNavbar showBackButton={true} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      </div>

      {/* Hero Section */}
      <ServicesHero onSearch={(searchData) => {
        setSearchQuery(searchData.search);
        handleFilterChange({ country: searchData.location });
        setCurrentPage(1);
      }} />

      {/* Main Content */}
      <main>
        {/* Service Categories */}
        <ServicesCategories 
          categories={displayCategories}
          loading={loadingCategories}
          onCategorySelect={(category) => {
            setSelectedCategory(category.name);
            handleFilterChange({ category_id: category.id });
          }}
        />

        {/* Services Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Upsell Section */}
            <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">
                    Want Your Service at the Top?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8">
                    Upgrade to Featured or Sponsored and get <span className="text-yellow-300 font-bold">4× more enquiries</span>
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {/* Promoted */}
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="w-8 h-8 text-yellow-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Promoted</h3>
                      <div className="text-3xl font-bold text-yellow-300 mb-6">$29</div>
                      <ul className="text-left space-y-3 mb-8">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Highlighted listing</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Appears above standard services</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">"Promoted" badge</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">2× more visibility</span>
                        </li>
                      </ul>
                      <button className="w-full px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                        Get Started
                      </button>
                    </div>
                  </div>
                  
                  {/* Featured */}
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-yellow-400 hover:bg-white/20 transition-all relative">
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="w-8 h-8 text-yellow-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Featured</h3>
                      <div className="text-3xl font-bold text-yellow-300 mb-6">$59</div>
                      <ul className="text-left space-y-3 mb-8">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Top of category pages</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Larger service card</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Priority in search results</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Weekly "Featured Services" email</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">"Featured" badge</span>
                        </li>
                      </ul>
                      <button className="w-full px-6 py-3 bg-yellow-400 text-blue-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors">
                        Get Featured
                      </button>
                    </div>
                  </div>
                  
                  {/* Sponsored */}
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-8 h-8 text-yellow-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Sponsored</h3>
                      <div className="text-3xl font-bold text-yellow-300 mb-6">$99</div>
                      <ul className="text-left space-y-3 mb-8">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Homepage placement</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Category top placement</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Homepage slider inclusion</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Social media promotion</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">"Sponsored" badge</span>
                        </li>
                      </ul>
                      <button className="w-full px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                        Go Sponsored
                      </button>
                    </div>
                  </div>
                  
                  {/* Network-Wide Boost */}
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-yellow-400 hover:bg-white/20 transition-all relative">
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                      ULTIMATE
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Crown className="w-8 h-8 text-yellow-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Network-Wide Boost</h3>
                      <div className="text-3xl font-bold text-yellow-300 mb-6">$199</div>
                      <ul className="text-left space-y-3 mb-8">
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Appears across all pages</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Homepage, category & search</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Newsletter inclusion</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">Push notifications</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-100">"Top Spotlight" badge</span>
                        </li>
                      </ul>
                      <button className="w-full px-6 py-3 bg-yellow-400 text-blue-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors">
                        Boost Network-Wide
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Comparison Table */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white text-center mb-8">Compare All Features</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/30">
                          <th className="text-left py-3 px-4">Features</th>
                          <th className="text-center py-3 px-4">Promoted<br/>$29</th>
                          <th className="text-center py-3 px-4">Featured<br/>$59<br/><span className="text-yellow-300 text-xs">Most Popular</span></th>
                          <th className="text-center py-3 px-4">Sponsored<br/>$99</th>
                          <th className="text-center py-3 px-4">Network-Wide<br/>$199<br/><span className="text-yellow-300 text-xs">Ultimate</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/20">
                          <td className="py-3 px-4">Highlighted listing</td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <td className="py-3 px-4">Top of category pages</td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <td className="py-3 px-4">Homepage placement</td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <td className="py-3 px-4">Social media promotion</td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Push notifications</td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><span className="text-white/50">—</span></td>
                          <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-300 mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* CTA Section */}
                <div className="text-center mt-12">
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                  <p className="text-blue-100 mb-8">Choose the promotion package that works best for your business goals</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Available Services
                </h2>
                <p className="text-gray-600">
                  {pagination.total || 0} services found
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              </div>
              
              {/* Enhanced Filters and Sort */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="created_at">Most Recent</option>
                    <option value="rating">Highest Rated</option>
                    <option value="starting_price">Price: Low to High</option>
                    <option value="starting_price_desc">Price: High to Low</option>
                    <option value="views">Most Popular</option>
                    <option value="enquiries">Most Enquiries</option>
                    <option value="featured">Featured First</option>
                    <option value="verified">Verified First</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">View:</label>
                  <select
                    value="grid"
                    onChange={(e) => {
                      // Handle view change (grid/list)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                  </select>
                </div>
                
              </div>
            </div>

            {/* Enhanced Filters Bar */}
            <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                </div>
                <button
                  onClick={() => handleFilterChange({
                    category_id: '',
                    country: '',
                    min_price: '',
                    max_price: '',
                    service_type: '',
                    verified_only: false,
                    promotion_type: ''
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.country}
                    onChange={(e) => handleFilterChange({ country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.min_price || ''}
                      onChange={(e) => handleFilterChange({ min_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.max_price || ''}
                      onChange={(e) => handleFilterChange({ max_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={filters.service_type}
                    onChange={(e) => handleFilterChange({ service_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="freelance">Freelance</option>
                    <option value="local">Local</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Type</label>
                  <select
                    value={filters.promotion_type}
                    onChange={(e) => handleFilterChange({ promotion_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Services</option>
                    <option value="promoted">Promoted</option>
                    <option value="featured">Featured</option>
                    <option value="sponsored">Sponsored</option>
                    <option value="network_boost">Network-Wide Boost</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verified_only}
                    onChange={(e) => handleFilterChange({ verified_only: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Verified Providers Only</span>
                </label>
                
                <div className="text-sm text-gray-500">
                  Showing {servicesDataList.length} of {paginationInfo.total || 0} services
                </div>
              </div>
            </div>

            {/* Services Grid */}
            {servicesDataList.length > 0 ? (
              <ServicesGrid services={servicesDataList} loading={loading} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms, or be the first to post a service in this category.
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="mt-12 flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.prev_page_url ? pagination.current_page - 1 : 1)}
                  disabled={!pagination.prev_page_url}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.current_page === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {pagination.last_page > 5 && (
                  <span className="px-4 py-2">...</span>
                )}
                
                <button
                  onClick={() => handlePageChange(pagination.next_page_url ? pagination.current_page + 1 : pagination.last_page)}
                  disabled={!pagination.next_page_url}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Analytics Sections - Only show if data is available */}
        {analytics && (
          <>
            {/* Live Activity Feed */}
            {analytics.recentActivity && analytics.recentActivity.length > 0 && (
              <div className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                      <span className="mr-2">🌍</span> Live Activity Feed
                    </h3>
                    <p className="text-gray-600">See what's happening in our global marketplace right now</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analytics.recentActivity.slice(0, 6).map((activity, index) => (
                      <div key={activity.id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full animate-pulse mt-1 ${
                            activity.activity_type === 'view' ? 'bg-green-500' :
                            activity.activity_type === 'add' ? 'bg-blue-500' : 
                            activity.activity_type === 'enquiry' ? 'bg-purple-500' :
                            activity.activity_type === 'order' ? 'bg-orange-500' : 'bg-gray-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span>{getCountryFlag(activity.country)}</span>
                              <span className="ml-1">{activity.location}</span>
                              <span className="ml-2">{new Date(activity.created_at).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                      View All Activity
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Trending Services & Countries */}
            {(analytics.trendingServices || analytics.trendingCountries) && (
              <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                      <span className="mr-2">🔥</span> What's Trending Now
                    </h3>
                    <p className="text-gray-600">Discover the most popular services and locations</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Trending Services */}
                    {analytics.trendingServices && analytics.trendingServices.length > 0 && (
                      <div>
                        <div className="flex items-center mb-6">
                          <h4 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-2">�</span> Trending Services
                          </h4>
                          <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            HOT
                          </span>
                        </div>
                        <div className="space-y-4">
                          {analytics.trendingServices.slice(0, 5).map((service, index) => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all cursor-pointer group">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">{service.category?.icon || '⭐'}</div>
                                <div>
                                  <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</h5>
                                  <p className="text-sm text-gray-600">{service.provider?.name || 'Provider'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{service.activities_count || service.views}</div>
                                <div className="text-xs text-green-600 font-medium">+{Math.floor(Math.random() * 30 + 10)}%</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Countries */}
                    {analytics.trendingCountries && analytics.trendingCountries.length > 0 && (
                      <div>
                        <div className="flex items-center mb-6">
                          <h4 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-2">🌍</span> Trending Countries
                          </h4>
                          <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            GLOBAL
                          </span>
                        </div>
                        <div className="space-y-4">
                          {analytics.trendingCountries.slice(0, 5).map((country, index) => (
                            <div key={country.country} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-pink-50 transition-all cursor-pointer group">
                              <div className="flex items-center space-x-3">
                                <span className="text-3xl">{getCountryFlag(country.country)}</span>
                                <div>
                                  <h5 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{country.country}</h5>
                                  <p className="text-sm text-gray-600">Growing marketplace</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{country.count} services</div>
                                <div className="text-xs text-green-600 font-medium">+{Math.floor(Math.random() * 20 + 5)}%</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Stats */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white text-center">
                      <div className="text-3xl font-bold mb-2">24/7</div>
                      <div className="text-blue-100">Active Support</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white text-center">
                      <div className="text-3xl font-bold mb-2">98%</div>
                      <div className="text-green-100">Client Satisfaction</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white text-center">
                      <div className="text-3xl font-bold mb-2">150+</div>
                      <div className="text-purple-100">Countries Served</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <BusinessCalculators />

      {/* Footer */}
      <Footer />

      {/* Post Service Modal */}
      {showPostForm && (
        <ServicesPostForm
          onClose={() => setShowPostForm(false)}
          onSubmit={handlePostFormSubmit}
        />
      )}

    </div>
  );
};

export default ServicesPage;
