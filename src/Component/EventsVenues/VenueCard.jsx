import React, { useState } from 'react';
import { MapPin, Users, Wifi, Car, Utensils, Star, Eye, Heart, Share2, ExternalLink, Shield } from 'lucide-react';

const VenueCard = ({ venue }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: `Check out this venue: ${venue.name}`,
        url: window.location.href
      });
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'featured':
        return 'bg-gradient-to-r from-purple-600 to-purple-700 text-white';
      case 'sponsored':
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
      case 'promoted':
        return 'bg-gradient-to-r from-teal-600 to-teal-700 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatPrice = (priceRange) => {
    if (priceRange === 'Free' || priceRange === 'Contact for pricing') return priceRange;
    return priceRange;
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'catering':
        return <Utensils className="w-4 h-4" />;
      case 'accessible':
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Venue Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-teal-400" />
          </div>
        )}
        
        {/* Badge */}
        {venue.badge && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeColor(venue.badge)}`}>
              {venue.badge}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleSave}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors group/save"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'text-red-500 fill-current' : 'text-gray-600 group-hover/save:text-red-500'
              }`} 
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-600 hover:text-teal-600" />
          </button>
        </div>

        {/* Capacity Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
            <Users className="w-3 h-3 text-teal-600" />
            <span className="text-xs font-medium text-gray-900">Up to {venue.capacity}</span>
          </div>
        </div>
      </div>

      {/* Venue Details */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-teal-600 font-medium uppercase tracking-wide">
            {venue.category}
          </span>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{venue.views || 0}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {venue.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0" />
            <span className="line-clamp-1">{venue.city}, {venue.country}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">{formatPrice(venue.priceRange)}</span>
            <span className="text-xs text-gray-500">per event</span>
          </div>
        </div>

        {/* Amenities */}
        {venue.amenities && venue.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {venue.amenities.slice(0, 3).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                >
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
              {venue.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  +{venue.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rating */}
        {venue.rating && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-900">{venue.rating}</span>
              <span className="text-xs text-gray-500">({venue.reviews || 0} reviews)</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-1">
            <ExternalLink className="w-4 h-4" />
            <span>View Details</span>
          </button>
          <button className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className={`w-4 h-4 ${isSaved ? 'text-red-500 fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
