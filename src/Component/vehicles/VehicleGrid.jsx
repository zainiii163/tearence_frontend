import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, MapPin, Phone, Mail, Star, Calendar, Fuel, Settings, Users, BadgeCheck, ExternalLink } from 'lucide-react';
import { incrementVehicleViews, toggleVehicleFavourite } from '../../services/vehiclesAPI';

const VehicleGrid = ({ vehicles, viewMode = 'grid' }) => {
  const [savedVehicles, setSavedVehicles] = useState(new Set());
  const navigate = useNavigate();

  console.log('VehicleGrid received vehicles:', vehicles);
  console.log('VehicleGrid vehicles length:', vehicles?.length);

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === '') return '/img/NoImage.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_STORAGE_URL || 'https://api.worldwideadverts.info/storage'}/${imagePath}`;
  };

  // Safety check for vehicles array
  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No vehicles available</div>
        <p className="text-gray-400 mt-2">Check back later for new listings</p>
      </div>
    );
  }

  const toggleSave = async (vehicleId) => {
    try {
      await toggleVehicleFavourite(vehicleId);
      setSavedVehicles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(vehicleId)) {
          newSet.delete(vehicleId);
        } else {
          newSet.add(vehicleId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const handleViewVehicle = async (vehicleId) => {
    try {
      await incrementVehicleViews(vehicleId);
      navigate(`/vehicle/${vehicleId}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
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
      'lease': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'For Lease' },
      'transport_service': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Transport Service' }
    };
    return badges[category] || badges['sale'];
  };

  const getConditionBadge = (condition) => {
    const badges = {
      'new': { bg: 'bg-green-100', text: 'text-green-800', label: 'New' },
      'excellent': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Excellent' },
      'good': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Good' },
      'fair': { bg: 'bg-red-100', text: 'text-red-800', label: 'Fair' },
      'used': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Used' }
    };
    return badges[condition] || badges['good'];
  };

  const getPromotionBadge = (vehicle) => {
    if (vehicle.is_featured) return { bg: 'bg-red-100', text: 'text-red-800', label: 'Featured', icon: '🔥' };
    if (vehicle.is_sponsored) return { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Sponsored', icon: '💎' };
    if (vehicle.is_promoted) return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Promoted', icon: '⭐' };
    return null;
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
            onClick={() => handleViewVehicle(vehicle.id)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/3 relative">
                <img
                  src={getImageUrl(vehicle.main_image)}
                  alt={vehicle.title || 'Vehicle'}
                  className="w-full h-48 md:h-full object-cover"
                  onError={(e) => {
                    if (!e.target.src.includes('NoImage.png')) {
                      e.target.src = '/img/NoImage.png';
                    }
                  }}
                />
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(vehicle.advert_type || 'sale').bg} ${getCategoryBadge(vehicle.advert_type || 'sale').text}`}>
                    {getCategoryBadge(vehicle.advert_type || 'sale').label}
                  </span>
                  {getConditionBadge(vehicle.condition) && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionBadge(vehicle.condition).bg} ${getConditionBadge(vehicle.condition).text}`}>
                      {getConditionBadge(vehicle.condition).label}
                    </span>
                  )}
                  {getPromotionBadge(vehicle) && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPromotionBadge(vehicle).bg} ${getPromotionBadge(vehicle).text}`}>
                      {getPromotionBadge(vehicle).icon} {getPromotionBadge(vehicle).label}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.title || 'Untitled Vehicle'}</h3>
                    {vehicle.tagline && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{vehicle.tagline}</p>
                    )}
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
                        <span>{vehicle.fuel_type}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Settings className="w-4 h-4" />
                        <span>{vehicle.transmission}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{vehicle.description || 'No description available'}</p>
                    
                    {/* Seller Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{vehicle.contact_name || 'Unknown Seller'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{vehicle.contact_email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ${vehicle.price ? vehicle.price.toLocaleString() : '0'}
                    </div>
                    {vehicle.is_negotiable && (
                      <div className="text-sm text-green-600 font-medium">Negotiable</div>
                    )}
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
          onClick={() => handleViewVehicle(vehicle.id)}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          {/* Image Container */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-12 bg-gray-100">
              <img
                src={getImageUrl(vehicle.main_image)}
                alt={vehicle.title || 'Vehicle'}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(vehicle.advert_type || 'sale').bg} ${getCategoryBadge(vehicle.advert_type || 'sale').text}`}>
                {getCategoryBadge(vehicle.advert_type || 'sale').label}
              </span>
              {getConditionBadge(vehicle.condition) && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionBadge(vehicle.condition).bg} ${getConditionBadge(vehicle.condition).text}`}>
                  {getConditionBadge(vehicle.condition).label}
                </span>
              )}
              {getPromotionBadge(vehicle) && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPromotionBadge(vehicle).bg} ${getPromotionBadge(vehicle).text}`}>
                  {getPromotionBadge(vehicle).icon} {getPromotionBadge(vehicle).label}
                </span>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(vehicle.id);
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <Heart className={`w-4 h-4 ${savedVehicles.has(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title and Price */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{vehicle.title || 'Untitled Vehicle'}</h3>
              {vehicle.tagline && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-1">{vehicle.tagline}</p>
              )}
              <div className="text-xl font-bold text-red-600">${vehicle.price ? vehicle.price.toLocaleString() : '0'}</div>
              {vehicle.is_negotiable && (
                <div className="text-sm text-green-600 font-medium">Negotiable</div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Year</span>
                <span className="font-medium text-gray-900">{vehicle.year || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Mileage</span>
                <span className="font-medium text-gray-900">{vehicle.mileage ? vehicle.mileage.toLocaleString() : '0'} mi</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fuel</span>
                <span className="font-medium text-gray-900">{vehicle.fuel_type || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transmission</span>
                <span className="font-medium text-gray-900">{vehicle.transmission || 'N/A'}</span>
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
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users className="w-3 h-3 text-gray-500" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-900 truncate max-w-20">
                    {vehicle.contact_name || 'Unknown Seller'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Mail className="w-3 h-3" />
                <span>{vehicle.contact_email ? 'Contact' : 'N/A'}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{vehicle.views || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{vehicle.saves || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{vehicle.created_at ? new Date(vehicle.created_at).toLocaleDateString() : 'N/A'}</span>
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VehicleGrid;
