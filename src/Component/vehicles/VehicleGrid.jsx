import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, MapPin, Phone, Mail, Star, Calendar, Fuel, Settings, Users, BadgeCheck, ExternalLink } from 'lucide-react';

const VehicleGrid = ({ vehicles, viewMode }) => {
  const [savedVehicles, setSavedVehicles] = useState(new Set());
  const [hoveredVehicle, setHoveredVehicle] = useState(null);

  const toggleSave = (vehicleId) => {
    setSavedVehicles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vehicleId)) {
        newSet.delete(vehicleId);
      } else {
        newSet.add(vehicleId);
      }
      return newSet;
    });
  };

  const getCountryFlag = (country) => {
    const flagMap = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸'
    };
    return flagMap[country] || '🌍';
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'sale': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'For Sale' },
      'hire': { bg: 'bg-green-100', text: 'text-green-800', label: 'For Hire' },
      'lease': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'For Lease' }
    };
    return badges[category] || badges['sale'];
  };

  const getPromotionBadge = (promotion) => {
    if (!promotion) return null;
    
    const badges = {
      'promoted': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Promoted', icon: '⭐' },
      'featured': { bg: 'bg-red-100', text: 'text-red-800', label: 'Featured', icon: '🔥' },
      'sponsored': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Sponsored', icon: '💎' }
    };
    return badges[promotion];
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/3 relative">
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                  className="w-full h-48 md:h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(vehicle.category).bg} ${getCategoryBadge(vehicle.category).text}`}>
                    {getCategoryBadge(vehicle.category).label}
                  </span>
                  {getPromotionBadge(vehicle.promotion) && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPromotionBadge(vehicle.promotion).bg} ${getPromotionBadge(vehicle.promotion).text}`}>
                      {getPromotionBadge(vehicle.promotion).icon} {getPromotionBadge(vehicle.promotion).label}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleSave(vehicle.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Heart className={`w-4 h-4 ${savedVehicles.has(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center space-x-1">
                        <span>{getCountryFlag(vehicle.country)}</span>
                        <span>{vehicle.city}, {vehicle.country}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{vehicle.year}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Fuel className="w-4 h-4" />
                        <span>{vehicle.mileage.toLocaleString()} miles</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{vehicle.description}</p>
                    
                    {/* Seller Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={vehicle.seller.avatar}
                        alt={vehicle.seller.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{vehicle.seller.name}</span>
                          {vehicle.seller.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{vehicle.seller.rating}</span>
                          <span>({vehicle.seller.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ${vehicle.price.toLocaleString()}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Contact Seller
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle, index) => (
        <motion.div
          key={vehicle.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onMouseEnter={() => setHoveredVehicle(vehicle.id)}
          onMouseLeave={() => setHoveredVehicle(null)}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          {/* Image Container */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-12 bg-gray-100">
              <img
                src={vehicle.image}
                alt={vehicle.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(vehicle.category).bg} ${getCategoryBadge(vehicle.category).text}`}>
                {getCategoryBadge(vehicle.category).label}
              </span>
              {getPromotionBadge(vehicle.promotion) && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPromotionBadge(vehicle.promotion).bg} ${getPromotionBadge(vehicle.promotion).text}`}>
                  {getPromotionBadge(vehicle.promotion).icon} {getPromotionBadge(vehicle.promotion).label}
                </span>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={() => toggleSave(vehicle.id)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <Heart className={`w-4 h-4 ${savedVehicles.has(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>

            {/* Quick Actions Overlay */}
            {hoveredVehicle === vehicle.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 left-2 right-2 flex space-x-2"
              >
                <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Contact
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title and Price */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{vehicle.title}</h3>
              <div className="text-xl font-bold text-red-600">${vehicle.price.toLocaleString()}</div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Year</span>
                <span className="font-medium text-gray-900">{vehicle.year}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Mileage</span>
                <span className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} mi</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fuel</span>
                <span className="font-medium text-gray-900">{vehicle.fuelType}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <span>{getCountryFlag(vehicle.country)}</span>
              <span>{vehicle.city}, {vehicle.country}</span>
            </div>

            {/* Seller Info */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <img
                  src={vehicle.seller.avatar}
                  alt={vehicle.seller.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-900 truncate max-w-20">
                    {vehicle.seller.name}
                  </span>
                  {vehicle.seller.verified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{vehicle.seller.rating}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{vehicle.views}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{vehicle.saves}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(vehicle.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VehicleGrid;
