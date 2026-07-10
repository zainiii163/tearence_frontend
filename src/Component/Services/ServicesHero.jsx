import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, Users, Globe, ArrowRight, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedServices, getTrendingServices, getServicesCategories } from '../../slice/ServicesSolutionsSlice';
import { formatCountry } from '../../utils/apiResponseHelpers';

const ServicesHero = ({ onSearch }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const dispatch = useDispatch();
  const { featuredServices, trendingServices, categories } = useSelector((state) => state.servicesSolutions);

  useEffect(() => {
    // Load featured and trending services
    dispatch(getFeaturedServices());
    dispatch(getTrendingServices());
    dispatch(getServicesCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchParams = {
      search: searchQuery,
      location: location,
      category: category
    };
    onSearch(searchParams);
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    onSearch({ search: query });
  };

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Services & Skilled Professionals
              <span className="block text-blue-200">Worldwide</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Hire experts or offer your services across hundreds of categories. 
              Connect with talented professionals worldwide and grow your business.
            </p>
            
            {/* Enhanced Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="What service do you need?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg"
                    />
                  </div>
                  
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg"
                    />
                  </div>
                  
                  <div className="flex-1 relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-lg"
                    >
                      <option value="">All Categories</option>
                      {(Array.isArray(categories) ? categories : []).map((cat) => (
                        <option key={cat.id} value={cat.slug || cat.id}>
                          {cat.icon || ''} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 flex items-center justify-center shadow-lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Services
                  </button>
                </div>
              </div>
            </form>

            {/* Enhanced Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <span className="text-sm text-blue-200 font-medium">Trending Searches:</span>
              {['Web Development', 'Logo Design', 'Digital Marketing', 'Content Writing', 'Video Editing', 'SEO Services', 'Social Media Management', 'Mobile App Development'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickSearch(tag)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white font-medium transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-blue-100">2,500+ Active Providers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-blue-100">10,000+ Services Listed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-blue-100">150+ Countries</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-blue-100">98% Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2,500+</div>
              <div className="text-sm text-gray-600">Active Providers</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">10,000+</div>
              <div className="text-sm text-gray-600">Services Listed</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">150+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Services Section */}
      {((Array.isArray(featuredServices) && featuredServices.length > 0) || (Array.isArray(trendingServices) && trendingServices.length > 0) || (Array.isArray(categories) && categories.length > 0)) && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Services */}
              {(Array.isArray(featuredServices) ? featuredServices : []).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">⭐</span> Featured Services
                  </h3>
                  <div className="space-y-3">
                    {(Array.isArray(featuredServices) ? featuredServices : []).slice(0, 3).map((service) => (
                      <div key={service.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{service.title}</h4>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="text-lg mr-2">{getCountryFlag(service.country)}</span>
                              {service.serviceProvider?.business_name || service.user?.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">${service.starting_price}</div>
                            <div className="text-xs text-gray-500">starting from</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              {(Array.isArray(categories) ? categories : []).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔥</span> Popular Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(Array.isArray(categories) ? categories : []).slice(0, 6).map((category) => (
                      <div key={category.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="font-medium text-gray-900 text-sm">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.active_services_count} services</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Search Bar */}
      {isSticky && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 py-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {(Array.isArray(categories) ? categories : []).map((cat) => (
                    <option key={cat.id} value={cat.slug || cat.id}>
                      {cat.icon || ''} {cat.name}
                    </option>
                  ))}
                </select>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to get country flag
const getCountryFlag = (country) => {
  const countryName = formatCountry(country);
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
  return flags[countryName] || '🌍';
};

export default ServicesHero;
