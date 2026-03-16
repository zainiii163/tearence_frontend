import React from 'react';
import { motion } from 'framer-motion';
import { 
  Hotel, 
  Car, 
  MapPin, 
  Compass,
  Users,
  Plane,
  Ship,
  Train
} from 'lucide-react';

const TravelCategoryGrid = ({ categories = [], onCategorySelect, selectedCategory }) => {
  // Use real categories if available, otherwise fall back to defaults
  const displayCategories = categories.length > 0 ? categories : [
    // Default categories (fallback)
    {
      id: 'luxury-resorts',
      name: 'Luxury Resorts',
      icon: '🏰',
      count: 2341,
      type: 'accommodation',
      color: 'from-purple-500 to-purple-600',
      description: '5-star luxury resorts and premium accommodations'
    },
    {
      id: 'boutique-hotels',
      name: 'Boutique Hotels',
      icon: '🏨',
      count: 1823,
      type: 'accommodation',
      color: 'from-blue-500 to-blue-600',
      description: 'Unique, stylish hotels with personalized service'
    },
    {
      id: 'budget-hotels',
      name: 'Budget Hotels',
      icon: '🏪',
      count: 3421,
      type: 'accommodation',
      color: 'from-green-500 to-green-600',
      description: 'Affordable accommodations without compromising quality'
    },
    {
      id: 'bed-breakfast',
      name: 'Bed & Breakfasts',
      icon: '🏠',
      count: 1234,
      type: 'accommodation',
      color: 'from-yellow-500 to-yellow-600',
      description: 'Cozy B&Bs with home-cooked breakfast'
    },
    {
      id: 'holiday-homes',
      name: 'Holiday Homes',
      icon: '🏡',
      count: 2891,
      type: 'accommodation',
      color: 'from-orange-500 to-orange-600',
      description: 'Vacation rentals and holiday apartments'
    },
    {
      id: 'beachfront-stays',
      name: 'Beachfront Stays',
      icon: '🏖️',
      count: 1567,
      type: 'accommodation',
      color: 'from-cyan-500 to-cyan-600',
      description: 'Beach resorts and seaside accommodations'
    },
    {
      id: 'mountain-retreats',
      name: 'Mountain Retreats',
      icon: '🏔️',
      count: 892,
      type: 'accommodation',
      color: 'from-gray-500 to-gray-600',
      description: 'Mountain lodges and alpine accommodations'
    },
    {
      id: 'city-breaks',
      name: 'City Breaks',
      icon: '🌃',
      count: 3456,
      type: 'accommodation',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Urban hotels and city center accommodations'
    },
    // Transport Categories
    {
      id: 'airport-transfers',
      name: 'Airport Transfers',
      icon: '✈️',
      count: 1234,
      type: 'transport',
      color: 'from-red-500 to-red-600',
      description: 'Airport pickup and drop-off services'
    },
    {
      id: 'car-hire',
      name: 'Car Hire',
      icon: '🚗',
      count: 2341,
      type: 'transport',
      color: 'from-blue-500 to-blue-600',
      description: 'Car rental and vehicle hire services'
    },
    {
      id: 'chauffeur-services',
      name: 'Chauffeur Services',
      icon: '🚖',
      count: 567,
      type: 'transport',
      color: 'from-purple-500 to-purple-600',
      description: 'Professional chauffeur and luxury transport'
    },
    {
      id: 'taxi-services',
      name: 'Taxi Services',
      icon: '🚕',
      count: 3456,
      type: 'transport',
      color: 'from-yellow-500 to-yellow-600',
      description: 'Local taxi and ride-hailing services'
    },
    {
      id: 'shuttle-buses',
      name: 'Shuttle Buses',
      icon: '🚌',
      count: 890,
      type: 'transport',
      color: 'from-green-500 to-green-600',
      description: 'Shuttle services and group transportation'
    },
    {
      id: 'boat-ferry',
      name: 'Boat & Ferry Services',
      icon: '⛵',
      count: 456,
      type: 'transport',
      color: 'from-cyan-500 to-cyan-600',
      description: 'Water transport and ferry services'
    },
    {
      id: 'tour-buses',
      name: 'Tour Buses',
      icon: '🚐',
      count: 678,
      type: 'transport',
      color: 'from-orange-500 to-orange-600',
      description: 'Sightseeing tours and bus excursions'
    },
    {
      id: 'motorbike-rentals',
      name: 'Motorbike Rentals',
      icon: '🏍️',
      count: 345,
      type: 'transport',
      color: 'from-gray-500 to-gray-600',
      description: 'Motorcycle and scooter rentals'
    }
  ];

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Travel Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect accommodation or transport service for your journey
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category)}
              className={`relative bg-white rounded-xl p-6 text-left transition-all duration-300 ${
                selectedCategory?.id === category.id 
                  ? 'ring-4 ring-blue-500 ring-offset-2 shadow-xl' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Category Badge */}
              {category.type && (
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${category.color} text-white`}>
                    {category.type === 'accommodation' ? 'Stay' : 'Transport'}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 text-3xl shadow-lg`}>
                {category.icon}
              </div>

              {/* Category Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-blue-600">
                    {category.count.toLocaleString()} listings
                  </span>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <span className="text-sm font-medium">Explore</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.button>
          ))}
        </div>

        {/* Category Type Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Hotel className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Accommodation</h3>
                <p className="text-gray-600">Find your perfect stay</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {displayCategories.filter(c => c.type === 'accommodation').reduce((sum, c) => sum + c.count, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Properties</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {displayCategories.filter(c => c.type === 'accommodation').length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Transport</h3>
                <p className="text-gray-600">Get around with ease</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {displayCategories.filter(c => c.type === 'transport').reduce((sum, c) => sum + c.count, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Services</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {displayCategories.filter(c => c.type === 'transport').length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelCategoryGrid;
