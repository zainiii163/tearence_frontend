import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Eye, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Car, 
  Star, 
  Phone, 
  Mail, 
  Globe,
  Calendar,
  DollarSign,
  Building,
  Home,
  Flag,
  ExternalLink,
  Check,
  Award,
  TrendingUp,
  Zap,
  User
} from 'lucide-react';

const PropertyCard = ({ 
  property, 
  onView, 
  onSave, 
  isSaved, 
  viewMode = 'grid' 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(property.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href + `/property/${property.id}`
      });
    }
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Promoted': 'bg-blue-500',
      'Featured': 'bg-purple-500',
      'Sponsored': 'bg-green-500',
      'Urgent': 'bg-red-500',
      'New': 'bg-yellow-500',
      'Hot': 'bg-orange-500'
    };
    return colors[badge] || 'bg-gray-500';
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onClick={() => onView(property)}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {property.badges.slice(0, 2).map((badge, index) => (
                <span
                  key={index}
                  className={`${getBadgeColor(badge)} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>

            {/* View Count */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              <Eye className="w-3 h-3" />
              {property.views}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                <div className="text-sm text-gray-500">{property.category}</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{property.country}</span>
            </div>

            {/* Specifications */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <BedDouble className="w-4 h-4" />
                <span>{property.specifications.bedrooms} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.specifications.bathrooms} baths</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{property.specifications.size} sq ft</span>
              </div>
              {property.specifications.parking && (
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>Parking</span>
                </div>
              )}
            </div>

            {/* Agent Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{property.agent.name}</div>
                  <div className="text-xs text-gray-500">
                    {property.agent.verified && <Check className="w-3 h-3 inline text-green-500" />} Verified Agent
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onView(property)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <Building className="w-12 h-12 text-gray-400" />
        </div>
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
        >
          <div className="text-white">
            <div className="text-sm font-medium mb-1">Quick View</div>
            <div className="text-xs opacity-90">Click to see full details</div>
          </div>
        </motion.div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {property.badges.slice(0, 2).map((badge, index) => (
            <span
              key={index}
              className={`${getBadgeColor(badge)} text-white text-xs px-2 py-1 rounded-full`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* View Count */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
          <Eye className="w-3 h-3" />
          {property.views}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price and Category */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{formatPrice(property.price)}</div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{property.category}</span>
          </div>
          {property.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-900">{property.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{property.description}</p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{property.location}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">{property.country}</span>
        </div>

        {/* Specifications */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>{property.specifications.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.specifications.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.specifications.size}</span>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-sm text-gray-700">{property.agent.name}</span>
            {property.agent.verified && (
              <Check className="w-3 h-3 text-green-500" />
            )}
          </div>
          
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Contact
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PropertyGrid = ({ 
  properties, 
  viewMode, 
  onPropertyView, 
  onSaveProperty, 
  savedProperties 
}) => {
  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
        : 'space-y-4'
    }>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onView={onPropertyView}
          onSave={onSaveProperty}
          isSaved={savedProperties.includes(property.id)}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
