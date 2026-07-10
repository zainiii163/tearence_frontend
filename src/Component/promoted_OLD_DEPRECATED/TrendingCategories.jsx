import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Tag, Eye, Heart, Star, ArrowUp, ArrowDown, Minus, BarChart3 } from 'lucide-react';

const TrendingCategories = () => {
  const [timeRange, setTimeRange] = useState('today');

  const trendingCategories = [
    {
      category: 'Property',
      icon: '🏠',
      color: 'from-blue-500 to-cyan-500',
      totalAdverts: 5432,
      promotedAdverts: 2147,
      views: 892340,
      saves: 45678,
      trend: 'up',
      change: '+18.5%',
      averagePrice: '$450,000',
      topSubcategories: ['Apartments', 'Houses', 'Land', 'Commercial'],
      growthRate: 23.4
    },
    {
      category: 'Cars & Vehicles',
      icon: '🚗',
      color: 'from-red-500 to-orange-500',
      totalAdverts: 3876,
      promotedAdverts: 1567,
      views: 678901,
      saves: 34567,
      trend: 'up',
      change: '+12.3%',
      averagePrice: '$35,000',
      topSubcategories: ['Sedans', 'SUVs', 'Sports Cars', 'Motorcycles'],
      growthRate: 15.7
    },
    {
      category: 'Electronics',
      icon: '💻',
      color: 'from-indigo-500 to-blue-500',
      totalAdverts: 6234,
      promotedAdverts: 2890,
      views: 1234567,
      saves: 67890,
      trend: 'up',
      change: '+25.8%',
      averagePrice: '$800',
      topSubcategories: ['Laptops', 'Smartphones', 'Gaming', 'Audio'],
      growthRate: 31.2
    },
    {
      category: 'Fashion & Beauty',
      icon: '👗',
      color: 'from-pink-500 to-rose-500',
      totalAdverts: 4123,
      promotedAdverts: 1876,
      views: 567890,
      saves: 23456,
      trend: 'stable',
      change: '+3.2%',
      averagePrice: '$150',
      topSubcategories: ['Clothing', 'Accessories', 'Cosmetics', 'Shoes'],
      growthRate: 5.6
    },
    {
      category: 'Business Opportunities',
      icon: '💼',
      color: 'from-purple-500 to-pink-500',
      totalAdverts: 1567,
      promotedAdverts: 789,
      views: 234567,
      saves: 12345,
      trend: 'up',
      change: '+31.4%',
      averagePrice: '$125,000',
      topSubcategories: ['Franchises', 'Startups', 'Investments', 'Partnerships'],
      growthRate: 42.1
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

  const getGrowthColor = (growthRate) => {
    if (growthRate >= 30) return 'text-green-600';
    if (growthRate >= 15) return 'text-amber-600';
    if (growthRate >= 5) return 'text-blue-600';
    return 'text-gray-600';
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
            <Tag className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Trending Categories</h3>
            <p className="text-sm text-gray-600">Most popular promoted categories</p>
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

      {/* Categories List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {trendingCategories.map((category, index) => (
          <motion.div
            key={category.category}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              // Navigate to category-specific promoted adverts
              window.location.href = `/promoted?category=${encodeURIComponent(category.category)}`;
            }}
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-lg`}>
                  {React.isValidElement(category.icon) ? category.icon : null}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{category.category}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{category.promotedAdverts} promoted</span>
                    <span>•</span>
                    <span>{category.totalAdverts} total</span>
                  </div>
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(category.trend)}`}>
                {getTrendIcon(category.trend)}
                <span>{category.change}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">
                  {(category.views / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">
                  {(category.saves / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-600">Saves</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">
                  {category.averagePrice}
                </div>
                <div className="text-xs text-gray-600">Avg Price</div>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Growth Rate</span>
                <span className={`text-xs font-bold ${getGrowthColor(category.growthRate)}`}>
                  +{category.growthRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                  style={{ width: `${Math.min(category.growthRate * 2, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Top Subcategories */}
            <div>
              <div className="text-xs text-gray-600 mb-2">Top Subcategories</div>
              <div className="flex flex-wrap gap-1">
                {category.topSubcategories.slice(0, 4).map((subcategory, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {subcategory}
                  </span>
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
          <BarChart3 className="w-4 h-4" />
          View All Categories
        </motion.button>
      </div>
    </div>
  );
};

export default TrendingCategories;
