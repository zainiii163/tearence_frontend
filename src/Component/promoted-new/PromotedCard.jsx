import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, MapPin, Phone, Mail, ExternalLink, Crown, Zap, Shield, Check } from 'lucide-react';

const PromotedCard = ({ advert, onView, onSave, onContact }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const getCountryFlag = (countryCode) => {
    const flags = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'CA': '🇨🇦',
      'FR': '🇫🇷',
      'DE': '🇩🇪',
      'AU': '🇦🇺',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'MX': '🇲🇽',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'NL': '🇳🇱',
      'AE': '🇦🇪',
      'SG': '🇸🇬',
      'MY': '🇲🇾',
      'ZA': '🇿🇦'
    };
    return flags[advert.country] || '🌍';
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Sponsored':
        return <Shield className="h-3 w-3" />;
      case 'Featured':
        return <Star className="h-3 w-3" />;
      case 'Promoted':
        return <Zap className="h-3 w-3" />;
      default:
        return <Crown className="h-3 w-3" />;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Sponsored':
        return 'bg-purple-600';
      case 'Featured':
        return 'bg-orange-600';
      case 'Promoted':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(advert);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onView?.(advert);
  };

  const handleContact = (e) => {
    e.stopPropagation();
    onContact?.(advert);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
      onClick={() => onView?.(advert)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={advert.image}
          alt={advert.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={`${getBadgeColor(advert.badge)} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg`}>
            {getBadgeIcon(advert.badge)}
            {advert.badge}
          </span>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isSaved 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 hover:bg-white text-gray-700 shadow-md'
          }`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions (appear on hover) */}
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={handleQuickView}
              className="flex-1 bg-white/90 hover:bg-white text-gray-800 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 shadow-lg backdrop-blur-sm"
            >
              Quick View
            </button>
            <button
              onClick={handleContact}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 shadow-lg"
            >
              Contact
            </button>
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {advert.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-orange-600">{advert.price}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{advert.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{advert.location}</span>
          <span className="text-lg">{getCountryFlag(advert.country)}</span>
        </div>

        {/* Category and Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
            {advert.category}
          </span>
          {advert.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">{advert.rating}</span>
              {advert.reviews && (
                <span className="text-xs text-gray-500">({advert.reviews})</span>
              )}
            </div>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {advert.seller.avatar ? (
                <img src={advert.seller.avatar} alt={advert.seller.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  {advert.seller.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{advert.seller.name}</p>
              {advert.seller.verified && (
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">Verified</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Buttons */}
          <div className="flex gap-1">
            {advert.seller.phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${advert.seller.phone}`);
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
                title="Call"
              >
                <Phone className="h-4 w-4" />
              </button>
            )}
            {advert.seller.email && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`mailto:${advert.seller.email}`);
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </button>
            )}
            {advert.seller.website && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(advert.seller.website, '_blank');
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
                title="Visit Website"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromotedCard;
