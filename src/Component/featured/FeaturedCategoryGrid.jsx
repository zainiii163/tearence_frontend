import React from 'react';
import { Home, Car, Briefcase, Rocket, Laptop, Shirt, Plane, Ticket, Paw, Sprout, Heart, GraduationCap, ArrowUp, ArrowRight, TrendingUp } from 'lucide-react';

const FeaturedCategoryGrid = ({ categories, selectedCategory, onCategorySelect }) => {
  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Explore Global Categories
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover premium listings from every corner of the world, organized by popular categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : ''
              }`}
            >
              {/* Trending Badge */}
              {category.trending && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <ArrowUp className="h-3 w-3" />
                    <span>Trending</span>
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Selected</span>
                  </div>
                </div>
              )}

              {/* Image Background */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Category Icon */}
                <div className="absolute bottom-4 left-4">
                  <div className={`h-12 w-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`} />
                  </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-purple-600' : 'text-gray-600'}`}>
                    {category.featuredCount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Featured Ads</span>
                  <button className={`flex items-center space-x-2 font-medium text-sm transition-colors ${
                    isSelected ? 'text-purple-600' : 'text-purple-600 hover:text-purple-700'
                  }`}>
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Hover Stats */}
                <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Active listings</span>
                    <span>{Math.floor(category.featuredCount * 1.2).toLocaleString()} total</span>
                  </div>
                  {category.trending && (
                    <div className="mt-2 text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>High demand</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Category Stats Bar */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {categories.reduce((sum, cat) => sum + cat.featuredCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Featured Ads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {categories.filter(cat => cat.trending).length}
            </div>
            <div className="text-sm text-gray-600">Trending Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">142</div>
            <div className="text-sm text-gray-600">Countries Covered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Active Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategoryGrid;
