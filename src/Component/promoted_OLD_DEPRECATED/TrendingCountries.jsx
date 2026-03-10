import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, MapPin, Eye, Heart, Star, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const TrendingCountries = () => {
  const [timeRange, setTimeRange] = useState('today');

  const trendingCountries = [
    {
      country: 'United States',
      flag: '🇺🇸',
      totalAdverts: 3421,
      promotedAdverts: 1247,
      views: 452340,
      saves: 23456,
      trend: 'up',
      change: '+12.5%',
      topCategories: ['Property', 'Cars & Vehicles', 'Electronics'],
      hotCities: ['New York', 'Los Angeles', 'Miami', 'San Francisco']
    },
    {
      country: 'United Kingdom',
      flag: '🇬🇧',
      totalAdverts: 2156,
      promotedAdverts: 892,
      views: 284560,
      saves: 18765,
      trend: 'up',
      change: '+8.3%',
      topCategories: ['Property', 'Business Opportunities', 'Fashion & Beauty'],
      hotCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh']
    },
    {
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      totalAdverts: 987,
      promotedAdverts: 456,
      views: 198765,
      saves: 12345,
      trend: 'up',
      change: '+23.7%',
      topCategories: ['Property', 'Cars & Vehicles', 'Luxury Goods'],
      hotCities: ['Dubai', 'Abu Dhabi', 'Sharjah']
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      totalAdverts: 1543,
      promotedAdverts: 678,
      views: 167890,
      saves: 10987,
      trend: 'stable',
      change: '+2.1%',
      topCategories: ['Property', 'Jobs & Services', 'Home & Garden'],
      hotCities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary']
    },
    {
      country: 'Australia',
      flag: '🇦🇺',
      totalAdverts: 1234,
      promotedAdverts: 543,
      views: 145678,
      saves: 9876,
      trend: 'up',
      change: '+6.8%',
      topCategories: ['Property', 'Travel & Experiences', 'Cars & Vehicles'],
      hotCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth']
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-2 rounded-lg">
            <Globe className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Trending Countries</h3>
            <p className="text-sm text-gray-600">Hot markets for promoted adverts</p>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['today', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Countries List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {trendingCountries.map((country, index) => (
          <motion.div
            key={country.country}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              // Navigate to country-specific promoted adverts
              window.location.href = `/promoted?country=${encodeURIComponent(country.country)}`;
            }}
          >
            {/* Country Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{country.country}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{country.promotedAdverts} promoted</span>
                    <span>•</span>
                    <span>{country.totalAdverts} total</span>
                  </div>
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(country.trend)}`}>
                {getTrendIcon(country.trend)}
                <span>{country.change}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {country.views.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {country.saves.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Saves</div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-2">Top Categories</div>
              <div className="flex flex-wrap gap-1">
                {country.topCategories.slice(0, 3).map((category, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Hot Cities */}
            <div>
              <div className="text-xs text-gray-600 mb-2">Hot Cities</div>
              <div className="flex flex-wrap gap-1">
                {country.hotCities.slice(0, 3).map((city, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    <MapPin className="w-3 h-3" />
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/promoted'}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          View All Countries
        </motion.button>
      </div>
    </div>
  );
};

export default TrendingCountries;
