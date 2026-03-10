import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Globe } from 'lucide-react';

const BannerCategoryGrid = ({ categories, selectedCategory, setSelectedCategory }) => {
  const categoryData = [
    {
      name: "Real Estate",
      icon: "🏢",
      count: 1247,
      color: "from-blue-500 to-cyan-600",
      description: "Property listings and real estate services",
      sampleBanner: "/img/banner/real-estate-sample.jpg"
    },
    {
      name: "Vehicles",
      icon: "🚗",
      count: 892,
      color: "from-red-500 to-orange-600",
      description: "Cars, motorcycles, and automotive services",
      sampleBanner: "/img/banner/vehicle-sample.jpg"
    },
    {
      name: "Travel & Resorts",
      icon: "✈️",
      count: 756,
      color: "from-teal-500 to-green-600",
      description: "Tourism, hotels, and travel packages",
      sampleBanner: "/img/banner/travel-sample.jpg"
    },
    {
      name: "Jobs & Recruitment",
      icon: "💼",
      count: 634,
      color: "from-purple-500 to-pink-600",
      description: "Employment opportunities and recruitment",
      sampleBanner: "/img/banner/jobs-sample.jpg"
    },
    {
      name: "Books & Authors",
      icon: "📚",
      count: 523,
      color: "from-indigo-500 to-blue-600",
      description: "Books, publishing, and literary services",
      sampleBanner: "/img/banner/books-sample.jpg"
    },
    {
      name: "Services",
      icon: "🔧",
      count: 891,
      color: "from-yellow-500 to-red-600",
      description: "Professional services and consulting",
      sampleBanner: "/img/banner/services-sample.jpg"
    },
    {
      name: "Events",
      icon: "🎉",
      count: 445,
      color: "from-pink-500 to-rose-600",
      description: "Conferences, workshops, and gatherings",
      sampleBanner: "/img/banner/events-sample.jpg"
    },
    {
      name: "Food & Hospitality",
      icon: "🍽️",
      count: 678,
      color: "from-orange-500 to-yellow-600",
      description: "Restaurants, catering, and food services",
      sampleBanner: "/img/banner/food-sample.jpg"
    },
    {
      name: "Fashion & Beauty",
      icon: "👗",
      count: 389,
      color: "from-purple-600 to-indigo-600",
      description: "Clothing, cosmetics, and fashion services",
      sampleBanner: "/img/banner/fashion-sample.jpg"
    },
    {
      name: "Tech & Electronics",
      icon: "💻",
      count: 923,
      color: "from-cyan-500 to-blue-600",
      description: "Technology products and IT services",
      sampleBanner: "/img/banner/tech-sample.jpg"
    },
    {
      name: "Health & Wellness",
      icon: "🏥",
      count: 567,
      color: "from-green-500 to-teal-600",
      description: "Medical services and wellness products",
      sampleBanner: "/img/banner/health-sample.jpg"
    },
    {
      name: "Business & Finance",
      icon: "📈",
      count: 712,
      color: "from-blue-600 to-purple-600",
      description: "Financial services and business solutions",
      sampleBanner: "/img/banner/business-sample.jpg"
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? "all" : category);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explore Banner Categories</h2>
          <p className="text-gray-600 mt-1">Discover banner adverts by category</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Globe className="w-4 h-4" />
          <span>12 Categories</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryData.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleCategoryClick(category.name)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
              selectedCategory === category.name 
                ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' 
                : 'hover:shadow-lg hover:scale-105'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`}></div>
            
            {/* Banner Preview */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={category.sampleBanner}
                alt={category.name}
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${category.name}/400/200.jpg`;
                }}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Category Icon */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl">
                {category.icon}
              </div>
              
              {/* Selected Indicator */}
              {selectedCategory === category.name && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full animate-pulse"></div>
              )}
            </div>

            {/* Category Info */}
            <div className="relative p-4 bg-white">
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {category.count.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">banners</span>
                </div>
                
                <button className={`p-2 rounded-lg transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      {/* Active Filter Display */}
      {selectedCategory !== "all" && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">Active Filter:</span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                {selectedCategory}
              </span>
            </div>
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerCategoryGrid;
