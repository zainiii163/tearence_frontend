import React from 'react';
import { Briefcase, Users, Globe, TrendingUp } from 'lucide-react';

const ServicesCategories = ({ categories, onCategorySelect, loading }) => {
  // Handle loading state
  if (loading && categories.length === 0) {
    return (
      <div className="py-12 bg-white">
        <div className="page-container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
            <p className="text-gray-600">Find services by category</p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded mx-auto w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!loading && categories.length === 0) {
    return (
      <div className="py-12 bg-white">
        <div className="page-container">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Categories Available</h2>
            <p className="text-gray-600">Categories will appear here once they are added to the system.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find services by category or explore trending areas
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category)}
              className="group relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-gray-100 hover:border-blue-200 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">{category.icon || '📦'}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-lg">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  {category.serviceCount || 0} services
                </p>
                <div className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore Services →
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-colors duration-300"></div>
            </button>
          ))}
        </div>
        
        {/* Enhanced Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {categories.reduce((total, cat) => total + (cat.serviceCount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Services</div>
              <div className="text-xs text-green-600 mt-1">+12% this month</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2,500+</div>
              <div className="text-sm text-gray-600 font-medium">Active Providers</div>
              <div className="text-xs text-green-600 mt-1">+8% this month</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">150+</div>
              <div className="text-sm text-gray-600 font-medium">Countries</div>
              <div className="text-xs text-green-600 mt-1">Global reach</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-sm text-gray-600 font-medium">Satisfaction Rate</div>
              <div className="text-xs text-green-600 mt-1">Industry leading</div>
            </div>
          </div>
        </div>
        
        {/* Trending Categories */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <span className="mr-2">🔥</span> Trending Categories
            </h3>
            <p className="text-gray-600">Most popular services this month</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category, index) => (
              <div key={category.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">#{index + 1}</div>
                    <div className="text-xs text-green-600 font-medium">+{Math.floor(Math.random() * 30 + 10)}%</div>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {category.serviceCount || 0} active services
                </p>
                <button
                  onClick={() => onCategorySelect(category)}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Browse Services
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCategories;
