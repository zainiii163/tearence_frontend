import React from 'react';
import { motion } from 'framer-motion';
import { Home, Car, Briefcase, Cpu, ShoppingBag, Plane, Calendar, Heart, TreePine, HeartPulse, GraduationCap, ArrowRight, TrendingUp } from 'lucide-react';

const SponsoredCategoryGrid = ({ categories, trendingCategories, selectedCategory, onSelectCategory }) => {
  // Icon mapping for different categories
  const getIconForCategory = (categoryName) => {
    const iconMap = {
      'Property': Home,
      'Cars & Vehicles': Car,
      'Vehicles': Car,
      'Jobs & Services': Briefcase,
      'Business Opportunities': Cpu,
      'Electronics': Cpu,
      'Fashion & Beauty': ShoppingBag,
      'Travel & Experiences': Plane,
      'Events & Tickets': Calendar,
      'Events & Entertainment': Calendar,
      'Pets & Animals': Heart,
      'Home & Garden': TreePine,
      'Health & Wellness': HeartPulse,
      'Education & Courses': GraduationCap,
      'default': Home
    };
    return iconMap[categoryName] || iconMap['default'];
  };

  // Color mapping for categories
  const getColorForCategory = (categoryName) => {
    const colorMap = {
      'Property': 'from-blue-500 to-blue-600',
      'Cars & Vehicles': 'from-red-500 to-red-600',
      'Vehicles': 'from-red-500 to-red-600',
      'Jobs & Services': 'from-green-500 to-green-600',
      'Business Opportunities': 'from-purple-500 to-purple-600',
      'Electronics': 'from-indigo-500 to-indigo-600',
      'Fashion & Beauty': 'from-pink-500 to-pink-600',
      'Travel & Experiences': 'from-cyan-500 to-cyan-600',
      'Events & Tickets': 'from-orange-500 to-orange-600',
      'Events & Entertainment': 'from-orange-500 to-orange-600',
      'Pets & Animals': 'from-amber-500 to-amber-600',
      'Home & Garden': 'from-emerald-500 to-emerald-600',
      'Health & Wellness': 'from-teal-500 to-teal-600',
      'Education & Courses': 'from-violet-500 to-violet-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colorMap[categoryName] || colorMap['default'];
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

  // Loading state (when no categories yet)
  if (!categories) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Empty state (when categories array exists but is empty)
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <p className="text-gray-600">No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
        {trendingCategories && trendingCategories.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-2 text-yellow-500" />
            <span>Trending Categories</span>
          </div>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        {/* All Categories */}
        <motion.div
          variants={itemVariants}
          onClick={() => onSelectCategory('all')}
          className={`
            cursor-pointer rounded-xl p-4 transition-all duration-200
            ${selectedCategory === 'all'
              ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg'
              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }
          `}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mb-3
              ${selectedCategory === 'all' ? 'bg-white/20' : 'bg-gray-200'}
            `}>
              <Home className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">All</span>
          </div>
        </motion.div>

        {/* Categories from API */}
        {categories.map((category) => {
          const Icon = getIconForCategory(category.name || category.category_name);
          const colorGradient = getColorForCategory(category.name || category.category_name);
          const isSelected = selectedCategory === (category.id || category.category_id);
          
          return (
            <motion.div
              key={category.id || category.category_id}
              variants={itemVariants}
              onClick={() => onSelectCategory(category.id || category.category_id)}
              className={`
                cursor-pointer rounded-xl p-4 transition-all duration-200
                ${isSelected
                  ? `bg-gradient-to-br ${colorGradient} text-white shadow-lg`
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-3
                  ${isSelected ? 'bg-white/20' : 'bg-gray-200'}
                `}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm line-clamp-2">
                  {category.name || category.category_name}
                </span>
                {category.sponsored_adverts_count !== undefined && (
                  <span className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {category.sponsored_adverts_count} ads
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Trending Categories */}
      {trendingCategories && trendingCategories.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
            Trending Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingCategories.map((category) => (
              <button
                key={category.id || category.category_id}
                onClick={() => onSelectCategory(category.id || category.category_id)}
                className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 transition-colors text-sm font-medium"
              >
                {category.name || category.category_name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredCategoryGrid;
