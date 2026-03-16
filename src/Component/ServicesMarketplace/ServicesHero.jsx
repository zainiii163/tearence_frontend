import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ArrowRight, Users, Globe, Star, TrendingUp } from 'lucide-react';

const ServicesHero = ({ onSearch, categories = [], stats = null }) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    category: '',
    location: ''
  });
  const [isSticky, setIsSticky] = useState(false);
  
  // Use provided stats or fallback values
  const heroStats = stats || {
    totalServices: 15234,
    totalProviders: 8456,
    totalCountries: 142,
    satisfactionRate: 98
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchData.keyword, searchData.location, searchData.category);
    }
  };

  const popularCategories = categories.slice(0, 6);

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Headlines */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Services & Skilled
              <span className="block text-yellow-300">Professionals Worldwide</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Hire experts or offer your services across hundreds of categories.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-2xl p-2 md:p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                  {/* Service Keyword */}
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Service keyword"
                      value={searchData.keyword}
                      onChange={(e) => handleInputChange('keyword', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={searchData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none bg-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto mt-4 md:mt-0 md:absolute md:right-4 md:top-1/2 md:transform md:-translate-y-1/2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Services</span>
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">
                  {heroStats.totalServices.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm md:text-base">Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">
                  {heroStats.totalProviders.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm md:text-base">Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">
                  {heroStats.totalCountries}
                </div>
                <div className="text-blue-100 text-sm md:text-base">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">
                  {heroStats.satisfactionRate}%
                </div>
                <div className="text-blue-100 text-sm md:text-base">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Popular Categories</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleInputChange('category', category.id)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Search Bar (appears on scroll) */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ${
        isSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Service keyword"
                value={searchData.keyword}
                onChange={(e) => handleInputChange('keyword', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <select
                value={searchData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Location"
                value={searchData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Spacer for sticky search */}
      {isSticky && <div className="h-20"></div>}
    </>
  );
};

export default ServicesHero;
