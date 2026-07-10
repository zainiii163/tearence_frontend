import React from 'react';
import { motion } from 'framer-motion';
import { Home, Car, BookOpen, Plane, ShoppingCart, Briefcase, Calendar, Zap, Heart, PawPrint, Flower, Gamepad2, ArrowRight } from 'lucide-react';

const PromotedCategoryGrid = ({ categories = [], onCategorySelect, selectedCategory }) => {
  // Debug: Log categories data
  console.log('PromotedCategoryGrid - categories:', categories);
  
  // Icon mapping for categories
  const getIcon = (categoryName) => {
    const iconMap = {
      'property': Home,
      'cars & vehicles': Car,
      'vehicles': Car,
      'jobs & services': Briefcase,
      'services': Briefcase,
      'business opportunities': Zap,
      'business': Zap,
      'electronics': Gamepad2,
      'fashion & beauty': Heart,
      'fashion': Heart,
      'travel & experiences': Plane,
      'travel': Plane,
      'education & learning': BookOpen,
      'education': BookOpen,
      'events': Calendar,
      'pets & animals': PawPrint,
      'pets': PawPrint,
      'home & garden': Flower,
      'home': Flower,
      'shopping': ShoppingCart,
    };
    return iconMap[categoryName.toLowerCase()] || Home;
  };

  // Color mapping for categories
  const getColorScheme = (index) => {
    const schemes = [
      { color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
      { color: 'from-red-500 to-red-600', bgColor: 'bg-red-50' },
      { color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
      { color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
      { color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50' },
      { color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50' },
      { color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50' },
      { color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50' },
      { color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
      { color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50' },
      { color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
      { color: 'from-rose-500 to-rose-600', bgColor: 'bg-rose-50' },
    ];
    return schemes[index % schemes.length];
  };

  // Show empty state when no categories
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Categories</h2>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No categories available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const Icon = getIcon(category.name);
          const colorScheme = getColorScheme(index);
          const isSelected = selectedCategory === category.name || selectedCategory === category.slug;
          
          return (
            <motion.div
              key={category.id || category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onCategorySelect && onCategorySelect(category.slug || category.name)}
              className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <div className={`aspect-square ${colorScheme.bgColor} p-4 flex flex-col items-center justify-center`}>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorScheme.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2 mb-1">
                  {category.name}
                </h3>
                
                <p className="text-xs text-gray-500 text-center">
                  {category.promoted_adverts_count || 0} adverts
                </p>
                
                {category.trending && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    Trending
                  </div>
                )}
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute bottom-2 right-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Show All Categories Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => onCategorySelect && onCategorySelect('')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === ''
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {selectedCategory ? 'Clear Filter' : 'All Categories'}
        </button>
      </div>
    </div>
  );
};

export default PromotedCategoryGrid;
