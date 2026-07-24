import React from 'react';
import { motion } from 'framer-motion';
import { Hotel, Car, Compass } from 'lucide-react';

const COLOR_PALETTE = [
  'from-purple-500 to-purple-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-orange-500 to-orange-600',
  'from-cyan-500 to-cyan-600',
  'from-indigo-500 to-indigo-600',
  'from-red-500 to-red-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
];

const ICON_MAP = {
  star: '⭐',
  'umbrella-beach': '🏖️',
  car: '🚗',
  'map-marked': '🗺️',
  hotel: '🏨',
  plane: '✈️',
  ship: '🚢',
  train: '🚆',
  bus: '🚌',
  taxi: '🚕',
  compass: '🧭',
  mountain: '🏔️',
  city: '🌃',
  beach: '🏖️',
  resort: '🏰',
  villa: '🏡',
  experience: '🎭',
  tour: '🗺️',
  default: '🌍',
};

const TravelCategoryGrid = ({ categories = [], onCategorySelect, selectedCategory }) => {
  const displayCategories = Array.isArray(categories) ? categories : [];

  const getColor = (index) => COLOR_PALETTE[index % COLOR_PALETTE.length];

  const getIcon = (iconName) => {
    if (!iconName) return ICON_MAP.default;
    const key = iconName.toLowerCase().replace(/\s+/g, '-');
    return ICON_MAP[key] || ICON_MAP.default;
  };

  const getTypeLabel = (type) => {
    if (!type) return '';
    if (type === 'accommodation') return 'Stay';
    if (type === 'transport') return 'Transport';
    if (type === 'experience') return 'Experience';
    return type;
  };

  const getCount = (category) => {
    const count = category.active_adverts_count ?? 0;
    return Number(count).toLocaleString();
  };

  if (displayCategories.length === 0) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="page-container text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Explore Travel Categories</h2>
          <p className="text-gray-500">Categories are loading...</p>
        </div>
      </div>
    );
  }

  const accommodationCategories = displayCategories.filter(c => c.type === 'accommodation');
  const transportCategories = displayCategories.filter(c => c.type === 'transport');

  return (
    <div className="bg-gray-50 py-8">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Explore Travel Categories
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Find the perfect accommodation, transport or experience for your journey
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayCategories.map((category, index) => {
            const color = getColor(index);
            const icon = getIcon(category.icon);
            const typeLabel = getTypeLabel(category.type);
            const count = getCount(category);

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategorySelect(category)}
                className={`relative bg-white rounded-lg p-4 text-left transition-all duration-300 ${
                  selectedCategory?.id === category.id
                    ? 'ring-4 ring-blue-500 ring-offset-2 shadow-xl'
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                {typeLabel && (
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${color} text-white`}>
                      {typeLabel}
                    </span>
                  </div>
                )}

                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-3 text-xl shadow-md`}>
                  {icon}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900">{category.name}</h3>
                  {category.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{category.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-blue-600">{count} listings</span>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <span className="text-xs font-medium">Explore</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                <Hotel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Accommodation</h3>
                <p className="text-xs text-gray-600">Find your perfect stay</p>
              </div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{accommodationCategories.length}</div>
              <div className="text-xs text-gray-600">Categories</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Transport</h3>
                <p className="text-xs text-gray-600">Get around with ease</p>
              </div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{transportCategories.length}</div>
              <div className="text-xs text-gray-600">Categories</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <Compass className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Total Categories</h3>
                <p className="text-xs text-gray-600">All services combined</p>
              </div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{displayCategories.length}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelCategoryGrid;
