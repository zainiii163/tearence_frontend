import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, 
  ExternalLink, 
  Eye, 
  MapPin, 
  Flag,
  Star,
  Maximize2,
  Share2
} from 'lucide-react';

// Import API services
import { trackBannerClick } from '../../api/banner';
import { resolveBannerImageUrl } from './BannerCarousel';

const BannerCard = ({ 
  banner, 
  viewMode = 'grid', 
  onClick, 
  onBusinessClick, 
  onSave, 
  isSaved = false,
  onShare,
  onBuy,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const imageUrl = resolveBannerImageUrl(banner);

  // Track banner click (skip local catalog packs — not stored in API)
  const handleBannerClick = async (e) => {
    try {
      if (banner.slug && !banner.is_catalog) {
        await trackBannerClick(banner.slug);
      }
    } catch (error) {
      console.warn('Failed to track click:', error);
      // Don't fail the user action if tracking fails
    }
    
    // Call the original onClick handler
    if (onClick) {
      onClick(banner);
    }
  };

  // Track destination link click
  const handleDestinationClick = async (e) => {
    e.stopPropagation();
    try {
      if (banner.slug && !banner.is_catalog) {
        await trackBannerClick(banner.slug);
      }
    } catch (error) {
      console.warn('Failed to track click:', error);
    }
    // Let the default link behavior proceed
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'promoted':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'featured':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'sponsored':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'UAE': '🇦🇪',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Maldives': '🇲🇻',
      'Brazil': '🇧🇷'
    };
    return flags[country] || '🌍';
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = `https://picsum.photos/seed/${banner.id}/400/200.jpg`;
    setIsImageLoading(false);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(banner);
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: banner.title,
          text: banner.description,
          url: banner.destinationLink
        });
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        <div className="flex flex-col md:flex-row">
          {/* Banner Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto">
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            <img
              src={imageUrl || ''}
              alt={banner.title}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(banner.promotion_tier)}`}>
                {banner.promotion_badge || banner.promotion_tier?.charAt(0).toUpperCase() + banner.promotion_tier?.slice(1)}
              </span>
            </div>

            {/* Country Flag */}
            <div className="absolute top-3 right-3">
              <span className="text-xl">{getCountryFlag(banner.country)}</span>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerClick(e);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors cursor-pointer break-words leading-snug"
                  onClick={handleBannerClick}
                  title={banner.title}
                >
                  {banner.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBusinessClick(banner.business_name);
                  }}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {banner.business_name}
                </button>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(banner.id);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">{banner.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{banner.city}, {banner.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{banner.views_count || banner.views?.toLocaleString() || '0'} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className="w-4 h-4" />
                <span>{banner.ctr || '0'}% CTR</span>
              </div>
              {banner.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{banner.rating}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-500">Size:</span>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {banner.banner_size_display || banner.banner_size}
                </span>
                {(banner.price != null || banner.promotion_price != null) && (
                  <span className="text-sm font-bold text-indigo-700">
                    ${Number(banner.price ?? banner.promotion_price).toFixed(0)}
                  </span>
                )}
              </div>

              {banner.is_catalog || banner.price != null ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof onBuy === 'function') onBuy(banner);
                    else handleBannerClick(e);
                  }}
                  className="inline-flex items-center gap-2 bg-indigo-700 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-800 transition-colors text-sm font-semibold"
                >
                  Buy
                </button>
              ) : (
                <a
                  href={banner.destination_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDestinationClick}
                  className="inline-flex items-center gap-2 bg-indigo-700 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-800 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </a>
              )}
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
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={imageUrl || ''}
          alt={banner.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(banner.promotion_tier)}`}>
            {banner.promotion_badge || banner.promotion_tier?.charAt(0).toUpperCase() + banner.promotion_tier?.slice(1)}
          </span>
        </div>

        {/* Country Flag */}
        <div className="absolute top-3 right-3">
          <span className="text-xl">{getCountryFlag(banner.country)}</span>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBannerClick(e);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(banner.id);
          }}
          className={`absolute top-3 left-1/2 transform -translate-x-1/2 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
            isSaved 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-100 hover:text-red-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3
            className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors cursor-pointer text-sm sm:text-base leading-snug break-words line-clamp-2 min-h-[2.5rem]"
            onClick={handleBannerClick}
            title={banner.title}
          >
            {banner.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBusinessClick?.(banner.business_name || banner.businessName);
            }}
            className="text-sm text-gray-600 hover:text-indigo-700 transition-colors"
          >
            {banner.business_name || banner.businessName}
          </button>
        </div>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{banner.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{banner.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{banner.views_count || banner.views?.toLocaleString() || '0'}</span>
          </div>
          {(banner.price != null || banner.promotion_price != null) && (
            <span className="font-bold text-indigo-700">
              ${Number(banner.price ?? banner.promotion_price).toFixed(0)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shrink-0">
            {banner.banner_size_display || banner.banner_size}
          </span>

          {banner.is_catalog || banner.price != null ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onBuy === 'function') onBuy(banner);
                else handleBannerClick(e);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-all text-xs font-semibold"
            >
              Buy
            </button>
          ) : (
            <a
              href={banner.destination_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-all text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              Visit
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BannerCard;
