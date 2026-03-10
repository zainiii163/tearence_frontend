import React, { useState, useEffect } from 'react';
import { 
  FaArrowUp, 
  FaGlobe, 
  FaTag, 
  FaEye, 
  FaHeart,
  FaFire,
  FaChartLine,
  FaArrowRight,
  FaFlag
} from 'react-icons/fa';

const TrendingSection = () => {
  const [trendingCountries, setTrendingCountries] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState('countries');

  // Sample trending countries data
  const sampleTrendingCountries = [
    {
      id: 1,
      country: 'United States',
      flag: '🇺🇸',
      featuredCount: 3421,
      views: 125000,
      saves: 892,
      growth: '+15%',
      topCategories: ['Property', 'Vehicles', 'Jobs'],
      trending: true
    },
    {
      id: 2,
      country: 'United Kingdom',
      flag: '🇬🇧',
      featuredCount: 2856,
      views: 98000,
      saves: 734,
      growth: '+12%',
      topCategories: ['Business', 'Fashion', 'Travel'],
      trending: true
    },
    {
      id: 3,
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      featuredCount: 1567,
      views: 76000,
      saves: 523,
      growth: '+28%',
      topCategories: ['Property', 'Luxury', 'Travel'],
      trending: true,
      hot: true
    },
    {
      id: 4,
      country: 'Singapore',
      flag: '🇸🇬',
      featuredCount: 1234,
      views: 65000,
      saves: 412,
      growth: '+18%',
      topCategories: ['Business', 'Education', 'Electronics'],
      trending: true
    },
    {
      id: 5,
      country: 'Germany',
      flag: '🇩🇪',
      featuredCount: 987,
      views: 54000,
      saves: 298,
      growth: '+8%',
      topCategories: ['Vehicles', 'Home & Garden', 'Electronics'],
      trending: false
    },
    {
      id: 6,
      country: 'France',
      flag: '🇫🇷',
      featuredCount: 876,
      views: 48000,
      saves: 267,
      growth: '+10%',
      topCategories: ['Fashion', 'Travel', 'Food'],
      trending: true
    }
  ];

  // Sample trending categories data
  const sampleTrendingCategories = [
    {
      id: 1,
      name: 'Property',
      icon: '🏠',
      featuredCount: 3421,
      views: 156000,
      saves: 1234,
      growth: '+22%',
      topCountries: ['USA', 'UAE', 'UK'],
      trending: true,
      hot: true
    },
    {
      id: 2,
      name: 'Vehicles',
      icon: '🚗',
      featuredCount: 2890,
      views: 134000,
      saves: 987,
      growth: '+18%',
      topCountries: ['Germany', 'USA', 'Japan'],
      trending: true
    },
    {
      id: 3,
      name: 'Business Opportunities',
      icon: '💼',
      featuredCount: 2156,
      views: 98000,
      saves: 654,
      growth: '+35%',
      topCountries: ['Singapore', 'UK', 'USA'],
      trending: true,
      hot: true
    },
    {
      id: 4,
      name: 'Fashion & Beauty',
      icon: '👗',
      featuredCount: 1678,
      views: 76000,
      saves: 543,
      growth: '+25%',
      topCountries: ['France', 'Italy', 'UK'],
      trending: true
    },
    {
      id: 5,
      name: 'Travel & Experiences',
      icon: '✈️',
      featuredCount: 1234,
      views: 89000,
      saves: 789,
      growth: '+40%',
      topCountries: ['UAE', 'Maldives', 'Thailand'],
      trending: true,
      hot: true
    },
    {
      id: 6,
      name: 'Electronics',
      icon: '💻',
      featuredCount: 1567,
      views: 67000,
      saves: 432,
      growth: '+12%',
      topCountries: ['Japan', 'South Korea', 'China'],
      trending: false
    }
  ];

  useEffect(() => {
    setTrendingCountries(sampleTrendingCountries);
    setTrendingCategories(sampleTrendingCategories);
  }, []);

  const renderTrendingCountry = (country) => (
    <div
      key={country.id}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{country.flag}</span>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {country.country}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{country.featuredCount} featured</span>
              <span>•</span>
              <span>{country.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          {country.hot && (
            <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
              <FaFire className="h-3 w-3" />
              <span>HOT</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-green-600 font-bold text-sm">
            <FaArrowUp className="h-3 w-3" />
            <span>{country.growth}</span>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="space-y-2">
        <div className="text-xs text-gray-500 font-medium">Top Categories</div>
        <div className="flex flex-wrap gap-1">
          {country.topCategories.map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <FaEye className="h-3 w-3" />
            <span>{country.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaHeart className="h-3 w-3" />
            <span>{country.saves}</span>
          </div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1">
          <span>Explore</span>
          <FaArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );

  const renderTrendingCategory = (category) => (
    <div
      key={category.id}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {category.name}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{category.featuredCount} featured</span>
              <span>•</span>
              <span>{category.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          {category.hot && (
            <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
              <FaFire className="h-3 w-3" />
              <span>HOT</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-green-600 font-bold text-sm">
            <FaArrowUp className="h-3 w-3" />
            <span>{category.growth}</span>
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="space-y-2">
        <div className="text-xs text-gray-500 font-medium">Top Countries</div>
        <div className="flex flex-wrap gap-1">
          {category.topCountries.map((country, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
            >
              {country}
            </span>
          ))}
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <FaEye className="h-3 w-3" />
            <span>{category.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaHeart className="h-3 w-3" />
            <span>{category.saves}</span>
          </div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1">
          <span>Browse</span>
          <FaArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaChartLine className="h-6 w-6 text-orange-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Trending Now</h3>
              <p className="text-sm text-gray-600">Based on views and saves</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-4">
          <button
            onClick={() => setSelectedTab('countries')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTab === 'countries'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaGlobe className="h-4 w-4" />
              <span>Trending Countries</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('categories')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTab === 'categories'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaTag className="h-4 w-4" />
              <span>Trending Categories</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'countries' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCountries.map(renderTrendingCountry)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCategories.map(renderTrendingCategory)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaFire className="h-4 w-4 text-orange-500" />
            <span>Updated every 5 minutes</span>
          </div>
          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center space-x-1">
            <span>View All Trends</span>
            <FaArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
