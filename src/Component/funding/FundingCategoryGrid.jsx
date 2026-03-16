import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Sparkles, 
  HandHeart, 
  Briefcase, 
  Heart, 
  BookOpen, 
  Home, 
  Globe,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';
import fundingService from '../../services/FundingService';

const FundingCategoryGrid = ({ categories, selectedCategory, onCategorySelect }) => {
  const getIconForCategory = (icon) => {
    // Handle both string names and React component icons
    if (typeof icon === 'string') {
      switch (icon) {
        case 'Zap': return <Zap className="w-6 h-6" />;
        case 'Sparkles': return <Sparkles className="w-6 h-6" />;
        case 'HandHeart': return <HandHeart className="w-6 h-6" />;
        case 'Briefcase': return <Briefcase className="w-6 h-6" />;
        case 'Heart': return <Heart className="w-6 h-6" />;
        case 'BookOpen': return <BookOpen className="w-6 h-6" />;
        case 'Home': return <Home className="w-6 h-6" />;
        case 'Globe': return <Globe className="w-6 h-6" />;
        default: return <Zap className="w-6 h-6" />;
      }
    }
    
    // If icon is a React component, return it directly
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    // Fallback
    return <Zap className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover projects across different categories and find the ones that match your interests
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.name;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <button
                onClick={() => onCategorySelect(category.name)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Category Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-r ${category.color} text-white`}>
                  {getIconForCategory(category.icon)}
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-left">
                  {category.name}
                </h3>

                {/* Stats */}
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Total Projects</span>
                    <span className="font-medium text-gray-900">{category.count}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-gray-500">Trending</span>
                    </div>
                    <span className="font-medium text-green-600">{category.trending}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-500">Most Funded</span>
                    </div>
                    <span className="font-medium text-blue-600">{category.mostFunded}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500" />
                      <span className="text-gray-500">New This Week</span>
                    </div>
                    <span className="font-medium text-purple-600">{category.newThisWeek}</span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {/* Active Filter Display */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg"
        >
          <span className="text-sm text-blue-700">
            Filtering by: <strong>{selectedCategory}</strong>
          </span>
          <button
            onClick={() => onCategorySelect(null)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
          >
            Clear filter
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FundingCategoryGrid;
