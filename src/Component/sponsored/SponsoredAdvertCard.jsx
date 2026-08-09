import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, MapPin, Star, Crown, Zap, TrendingUp, ExternalLink, Phone, MessageCircle, CheckCircle, Shield } from 'lucide-react';
import { trackSponsoredEvent, saveAdvert } from '../../api/sponsored';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const SponsoredAdvertCard = ({ advert, viewMode, isSaved, onSave, onView, onSellerClick }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const imageSrc =
    resolveStorageUrl(advert.main_image_url || advert.main_image || advert.image) ||
    '/img/NoImage.png';

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewedSponsored');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recently viewed:', error);
      }
    }
  }, []);

  // Save recently viewed to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('recentlyViewedSponsored', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const getCountryFlag = (country) => {
    const flags = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'UAE': '🇦🇪',
      'Singapore': '🇸🇬',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽'
    };
    return flags[country] || '🌍';
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Sponsored Premium': 'bg-gradient-to-r from-yellow-500 to-amber-500',
      'Sponsored Plus': 'bg-gradient-to-r from-blue-500 to-indigo-500',
      'Sponsored Basic': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'Featured': 'bg-purple-500',
      'Trending': 'bg-orange-500',
      'Hot Deal': 'bg-red-500',
      'Exclusive': 'bg-pink-500',
      'Limited': 'bg-indigo-500',
      'New Tech': 'bg-cyan-500',
      'Top Rated': 'bg-emerald-500',
      'Premium': 'bg-gradient-to-r from-purple-500 to-pink-500'
    };
    return colors[badge] || 'bg-gray-500';
  };

  const formatViews = (views) => {
    if (!views || views === 0) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleCardClick = () => {
    trackSponsoredEvent(advert.id, 'click', {
      source: 'card_click',
      device: 'desktop'
    });

    if (onView) {
      onView(advert);
      return;
    }

    const href = advert.href || `/sponsored-adverts/${advert.slug || advert.id}`;
    window.location.href = href;
  };

  
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="relative h-48 lg:h-full rounded-lg overflow-hidden cursor-pointer" onClick={handleCardClick}>
                <img 
                  src={imageSrc} 
                  alt={advert.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/img/NoImage.png';
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {(advert.badges || []).map((badge, index) => (
                    <div key={index} className={`${getBadgeColor(badge)} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
                      {badge}
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave();
                  }}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer" onClick={handleCardClick}>
                    {advert.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="font-medium text-2xl text-gray-900">{advert.price}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{getCountryFlag(advert.country)} {advert.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(advert.views)} views</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{advert.description}</p>

              {/* Seller Info */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSellerClick(advert.seller || {})}
                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {advert.seller?.verified ? (
                      <Shield className="w-5 h-5 text-blue-600" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {advert.seller?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{advert.seller?.name || 'Unknown'}</span>
                      {advert.seller?.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{advert.seller?.rating || '0'}</span>
                      </div>
                      <span>•</span>
                      <span>{advert.seller?.adsCount || advert.seller?.reviews || 0} ads</span>
                    </div>
                  </div>
                </button>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <img 
          src={imageSrc} 
          alt={advert.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/img/NoImage.png';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {(advert.badges || []).map((badge, index) => (
            <div key={index} className={`${getBadgeColor(badge)} text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1`}>
              {badge.includes('Premium') && <Crown className="w-3 h-3" />}
              {badge.includes('Plus') && <Zap className="w-3 h-3" />}
              {badge.includes('Trending') && <TrendingUp className="w-3 h-3" />}
              {badge}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            try {
              const response = await saveAdvert(advert.id);
              if (response.success) {
                // Update saved state in parent component
                if (onSave) {
                  onSave(advert.id);
                }
              } else {
                console.error('Failed to save advert:', response.message);
              }
            } catch (error) {
              console.error('Save advert failed:', error);
            }
          }}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
            <Phone className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
            <MessageCircle className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={handleCardClick}>
          {advert.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">{advert.price}</span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Eye className="w-3 h-3" />
            <span>{formatViews(advert.views)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span>{getCountryFlag(advert.country)}</span>
          <span>{advert.city}</span>
          <span>•</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{advert.category}</span>
        </div>

        {/* Seller Info */}
        <button
          onClick={() => onSellerClick(advert.seller || {})}
          className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              {advert.seller?.verified ? (
                <Shield className="w-3 h-3 text-blue-600" />
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  {advert.seller?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900 truncate">{advert.seller?.name || 'Unknown'}</span>
                {advert.seller?.verified && (
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{advert.seller?.rating || '0'}</span>
                <span>•</span>
                <span>{advert.seller?.adsCount || advert.seller?.reviews || 0} ads</span>
              </div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </button>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuickView(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{advert.title}</h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={imageSrc} 
                    alt={advert.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/img/NoImage.png';
                    }}
                  />
                </div>
                <div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">{advert.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{getCountryFlag(advert.country)} {advert.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{(advert.views || 0).toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">{advert.category}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{advert.condition || 'Available'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{advert.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => onSellerClick(advert.seller || {})}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {advert.seller?.verified ? (
                      <Shield className="w-5 h-5 text-blue-600" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {advert.seller?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{advert.seller?.name || 'Unknown'}</span>
                      {advert.seller?.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{advert.seller?.rating || '0'}</span>
                      <span>•</span>
                      <span>{advert.seller?.adsCount || advert.seller?.reviews || 0} ads</span>
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4 text-gray-600 mr-2" />
                    Contact
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                    View Full Ad
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SponsoredAdvertCard;
