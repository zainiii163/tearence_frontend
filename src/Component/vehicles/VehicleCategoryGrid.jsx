import React from 'react';
import { motion } from 'framer-motion';
import { Car, Truck, Bike, Bus, Zap, Crown, Home, Ship, Tractor, HardHat, ArrowRight } from 'lucide-react';

const VehicleCategoryGrid = ({ categories, vehicleTypes, onCategorySelect }) => {
  // Combine categories and vehicle types for display
  const getCategoryIcon = (type) => {
    const iconMap = {
      'car': Car,
      'van': Truck,
      'motorbike': Bike,
      'truck': Truck,
      'bus': Bus,
      'coach': Bus,
      'electric_vehicle': Zap,
      'classic_car': Crown,
      'luxury_vehicle': Crown,
      'caravan': Home,
      'motorhome': Home,
      'boat': Ship,
      'jet_ski': Ship,
      'agricultural': Tractor,
      'construction': HardHat,
      'other': Car
    };
    return iconMap[type] || Car;
  };

  const handleCategoryClick = (type) => {
    if (onCategorySelect && typeof onCategorySelect === 'function') {
      onCategorySelect(type);
    }
  };

  // Use vehicleTypes from API
  const typesToDisplay = vehicleTypes || {};

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Vehicle Categories</h2>
        <p className="text-gray-600 text-lg">Find the perfect vehicle for your needs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(typesToDisplay).map(([key, label], index) => {
          const Icon = getCategoryIcon(key);
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleCategoryClick(key)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 border border-gray-200 hover:border-red-500 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                  <Icon className="w-8 h-8 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
                <div className="flex items-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleCategoryGrid;
