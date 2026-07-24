import React from 'react';
import { motion } from 'framer-motion';
import { Car, Truck, Bike, Bus, Zap, Crown, Home, Ship, Tractor, HardHat } from 'lucide-react';

const VehicleCategoryGrid = ({ vehicleTypes = {}, selectedCategoryId, onCategorySelect }) => {
  const getCategoryIcon = (type) => {
    const iconMap = {
      car: Car,
      van: Truck,
      motorbike: Bike,
      truck: Truck,
      bus: Bus,
      coach: Bus,
      electric_vehicle: Zap,
      classic_car: Crown,
      luxury_vehicle: Crown,
      caravan: Home,
      motorhome: Home,
      boat: Ship,
      jet_ski: Ship,
      agricultural: Tractor,
      construction: HardHat,
      other: Car,
    };
    return iconMap[type] || Car;
  };

  const GRID_CLASS =
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5 mb-6';

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Explore Categories</h2>
        <span className="text-xs text-gray-500">{Object.keys(vehicleTypes).length} total</span>
      </div>
      <div className={GRID_CLASS}>
        {Object.entries(vehicleTypes).map(([key, label]) => {
          const Icon = getCategoryIcon(key);
          const active = selectedCategoryId === key;
          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategorySelect(key)}
              className={`bg-white rounded-lg border p-2.5 sm:p-3 text-center transition-all ${
                active
                  ? 'border-red-500 ring-2 ring-red-100 shadow-md'
                  : 'border-gray-200 hover:border-red-300 hover:shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                  active ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className={`text-[11px] sm:text-xs font-semibold line-clamp-2 ${active ? 'text-red-700' : 'text-gray-900'}`}>
                {label}
              </h3>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default VehicleCategoryGrid;
