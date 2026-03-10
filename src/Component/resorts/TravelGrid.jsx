import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Wifi, 
  Car,
  Hotel,
  Users,
  Calendar,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const TravelGrid = ({ adverts, viewMode, onSaveAdvert, savedAdverts, onBusinessProfile }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const getPromotionBadge = (promotion) => {
    const badges = {
      promoted: { text: 'Promoted', color: 'from-blue-500 to-blue-600' },
      featured: { text: 'Featured', color: 'from-purple-500 to-purple-600' },
      sponsored: { text: 'Sponsored', color: 'from-orange-500 to-orange-600' },
      standard: { text: '', color: '' }
    };
    return badges[promotion] || badges.standard;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      accommodation: <Hotel className="w-4 h-4" />,
      transport: <Car className="w-4 h-4" />
    };
    return icons[category] || <Hotel className="w-4 h-4" />;
  };

  const handleSaveToggle = (advertId, e) => {
    e.stopPropagation();
    onSaveAdvert(advertId);
  };

  const handleBusinessClick = (business, e) => {
    e.stopPropagation();
    onBusinessProfile(business);
  };

  const handleCardClick = (advert) => {
    // Handle card click - could open detail modal or navigate to detail page
    console.log('Card clicked:', advert);
  };

  if (adverts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">
          <Hotel />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No travel services found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
      "space-y-4"
    }>
      {adverts.map((advert, index) => {
        const promotionBadge = getPromotionBadge(advert.promotion);
        const isSaved = savedAdverts.has(advert.id);
        
        return (
          <motion.div
            key={advert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredCard(advert.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(advert)}
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Image Container */}
            <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} overflow-hidden`}>
              <img
                src={advert.image}
                alt={advert.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Promotion Badge */}
              {promotionBadge.text && (
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${promotionBadge.color}`}>
                    {promotionBadge.text}
                  </span>
                </div>
              )}

              {/* Verified Badge */}
              {advert.verified && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleSaveToggle(advert.id, e)}
                className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isSaved 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/90 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Quick Actions Overlay */}
              {hoveredCard === advert.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-3 flex space-x-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white"
                  >
                    <Phone className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Location Badge */}
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center space-x-1 text-white text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{advert.location}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              {/* Category and Rating */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                    {getCategoryIcon(advert.category)}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{advert.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">{advert.rating}</span>
                  <span className="text-xs text-gray-500">({advert.reviews})</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                {advert.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {advert.description}
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-3">
                {advert.amenities.slice(0, viewMode === 'list' ? 4 : 3).map((amenity, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {advert.amenities.length > (viewMode === 'list' ? 4 : 3) && (
                  <span className="text-xs text-gray-500">+{advert.amenities.length - (viewMode === 'list' ? 4 : 3)}</span>
                )}
              </div>

              {/* Business Info */}
              <div 
                className="flex items-center space-x-2 mb-3 cursor-pointer group"
                onClick={(e) => handleBusinessClick(advert.business, e)}
              >
                <img
                  src={advert.business.logo}
                  alt={advert.business.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {advert.business.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {advert.business.listings} listings
                  </div>
                </div>
                {advert.business.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>

              {/* Price and Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    ${advert.price}
                    <span className="text-sm text-gray-500 font-normal">
                      {advert.category === 'accommodation' ? '/night' : '/trip'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-500 text-xs">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{advert.views.toLocaleString()}</span>
                  </div>
                  {advert.trending && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{advert.trending}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TravelGrid;
