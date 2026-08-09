import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, MapPin, Phone, Mail, ExternalLink, Crown, Zap, Shield, Check } from 'lucide-react';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const PromotedCard = ({ advert, viewMode = 'grid', onView, onAdvertClick, onSave, onToggleFavorite, onContact }) => {
  const [isSaved, setIsSaved] = useState(advert.is_favorited || false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleOpen = () => {
    (onAdvertClick || onView)?.(advert);
  };

  const getCountryFlag = (countryName) => {
    const flags = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'Netherlands': '🇳🇱',
      'UAE': '🇦🇪',
      'Singapore': '🇸🇬',
      'Malaysia': '🇲🇾',
      'South Africa': '🇿🇦'
    };
    return flags[countryName] || '🌍';
  };

  const getPromotionTierIcon = (tier) => {
    switch (tier) {
      case 'network_wide_boost': return <Crown className="h-3 w-3" />;
      case 'promoted_premium': return <Shield className="h-3 w-3" />;
      case 'promoted_plus': return <Star className="h-3 w-3" />;
      case 'promoted_basic': return <Zap className="h-3 w-3" />;
      default: return <Zap className="h-3 w-3" />;
    }
  };

  const getPromotionTierColor = (tier) => {
    switch (tier) {
      case 'network_wide_boost': return 'bg-red-600';
      case 'promoted_premium': return 'bg-purple-600';
      case 'promoted_plus': return 'bg-orange-600';
      case 'promoted_basic': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getPromotionTierName = (tier) => {
    const names = {
      'network_wide_boost': 'Network Boost',
      'promoted_premium': 'Premium',
      'promoted_plus': 'Plus',
      'promoted_basic': 'Basic'
    };
    return names[tier] || 'Promoted';
  };

  const formatPrice = (price, currency = 'GBP') => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(advert);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    handleOpen();
  };

  const handleContact = (e) => {
    e.stopPropagation();
    onContact?.(advert);
  };

  const imageUrl =
    resolveStorageUrl(
      advert.main_image_url ||
        advert.main_image ||
        advert.image ||
        advert.image_url
    ) || null;

  const logoUrl =
    resolveStorageUrl(advert.logo_url || advert.logo || advert.seller?.avatar) || null;

  const location = advert.city ? `${advert.city}, ${advert.country}` : advert.country;

  // List View Mode
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
        onClick={handleOpen}
      >
        <div className="flex gap-4">
          <div className="relative w-48 h-32 flex-shrink-0">
            <img
              src={imageUrl}
              alt={advert.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <span className={`${getPromotionTierColor(advert.promotion_tier)} text-white px-2 py-1 rounded-full text-xs font-semibold absolute top-2 left-2`}>
              {getPromotionTierName(advert.promotion_tier)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {advert.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                  <span>{getCountryFlag(advert.country)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-600">{formatPrice(advert.price, advert.currency)}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500 justify-end">
                  <Eye className="h-4 w-4" />
                  <span>{advert.views_count || 0}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{advert.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {logoUrl && (
                  <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                )}
                <span className="text-sm text-gray-700">{advert.seller_name}</span>
                {advert.verified_seller && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <a href={`tel:${advert.phone}`} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <Phone className="h-4 w-4" />
                </a>
                <a href={`mailto:${advert.email}`} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View Mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
      onClick={handleOpen}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={advert.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Promotion Tier Badge */}
        <div className="absolute top-3 left-3">
          <span className={`${getPromotionTierColor(advert.promotion_tier)} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg`}>
            {getPromotionTierIcon(advert.promotion_tier)}
            {getPromotionTierName(advert.promotion_tier)}
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
            <span className="text-xl font-bold text-orange-600">{formatPrice(advert.price, advert.currency)}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{advert.views_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
          <span>{getCountryFlag(advert.country)}</span>
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
              {advert.seller?.avatar ? (
                <img src={advert.seller.avatar} alt={advert.seller.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  {advert.seller_name?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{advert.seller_name}</p>
              {advert.verified_seller && (
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">Verified</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Buttons */}
          <div className="flex gap-1">
            {advert.phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${advert.phone}`);
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
                title="Call"
              >
                <Phone className="h-4 w-4" />
              </button>
            )}
            {advert.email && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`mailto:${advert.email}`);
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </button>
            )}
            {advert.website && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(advert.website, '_blank');
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
