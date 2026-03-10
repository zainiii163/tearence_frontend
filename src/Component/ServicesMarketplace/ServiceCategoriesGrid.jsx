import React from 'react';
import { Palette, Code, PenTool, TrendingUp, Briefcase, Users, Camera, Music, Heart, Dumbbell, Wrench, Sparkles, Calendar, Truck } from 'lucide-react';

const ServiceCategoriesGrid = ({ categories = [], onCategorySelect }) => {
  // Default categories if none provided
  const defaultCategories = [
    { id: 1, name: 'Graphic Design', icon: Palette, serviceCount: 2847, color: 'from-purple-500 to-pink-500' },
    { id: 2, name: 'Web Development', icon: Code, serviceCount: 3521, color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Writing & Translation', icon: PenTool, serviceCount: 1923, color: 'from-green-500 to-teal-500' },
    { id: 4, name: 'Marketing & SEO', icon: TrendingUp, serviceCount: 2156, color: 'from-orange-500 to-red-500' },
    { id: 5, name: 'Business Support', icon: Briefcase, serviceCount: 1678, color: 'from-indigo-500 to-purple-500' },
    { id: 6, name: 'Virtual Assistants', icon: Users, serviceCount: 1234, color: 'from-pink-500 to-rose-500' },
    { id: 7, name: 'Photography & Video', icon: Camera, serviceCount: 987, color: 'from-yellow-500 to-orange-500' },
    { id: 8, name: 'Music & Audio', icon: Music, serviceCount: 756, color: 'from-cyan-500 to-blue-500' },
    { id: 9, name: 'Lifestyle Services', icon: Heart, serviceCount: 1456, color: 'from-red-500 to-pink-500' },
    { id: 10, name: 'Fitness & Coaching', icon: Dumbbell, serviceCount: 834, color: 'from-green-500 to-lime-500' },
    { id: 11, name: 'Trades & Repairs', icon: Wrench, serviceCount: 567, color: 'from-gray-600 to-gray-800' },
    { id: 12, name: 'Cleaning & Domestic', icon: Sparkles, serviceCount: 445, color: 'from-blue-400 to-indigo-500' },
    { id: 13, name: 'Event Services', icon: Calendar, serviceCount: 678, color: 'from-purple-500 to-indigo-500' },
    { id: 14, name: 'Transport & Delivery', icon: Truck, serviceCount: 323, color: 'from-teal-500 to-green-500' }
  ];

  const categoriesToUse = categories.length > 0 ? categories : defaultCategories;

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Service Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect service from our wide range of categories, each with skilled professionals ready to help.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categoriesToUse.map((category) => {
            const IconComponent = category.icon || Palette;
            
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color || 'from-blue-500 to-teal-500'} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color || 'from-blue-500 to-teal-500'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>

                  {/* Service Count */}
                  <p className="text-sm text-gray-500 mb-4">
                    {category.serviceCount || 0} services
                  </p>

                  {/* Explore Button */}
                  <button className="flex items-center space-x-1 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-colors duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <span>View All Categories</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoriesGrid;
