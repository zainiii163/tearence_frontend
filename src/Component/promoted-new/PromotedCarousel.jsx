import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Heart, Star, MapPin, Crown, Zap, Shield } from 'lucide-react';
import { promotedAdvertsUtils } from '../../services/promotedAdvertsAPI';

const PromotedCarousel = ({ adverts = [], onAdvertClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused && adverts.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % adverts.length);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, adverts.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? adverts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % adverts.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

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
    return flags[countryCode] || '🌍';
  };

  // Show loading state
  if (adverts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  const currentAdvert = adverts[currentIndex];

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        {/* Main Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={currentAdvert.main_image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={currentAdvert.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Badge */}
          {currentAdvert.promotion_tier && (
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold ${
              currentAdvert.promotion_tier === 'network_wide_boost' ? 'bg-yellow-500' :
              currentAdvert.promotion_tier === 'promoted_premium' ? 'bg-purple-600' :
              currentAdvert.promotion_tier === 'promoted_plus' ? 'bg-blue-600' :
              'bg-gray-600'
            }`}>
              {promotedAdvertsUtils.getPromotionTierDisplay(currentAdvert.promotion_tier)}
            </div>
          )}
          
          {/* Navigation Arrows */}
          {adverts.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{currentAdvert.title}</h3>
                {currentAdvert.tagline && (
                  <p className="text-sm text-white/90 mb-2">{currentAdvert.tagline}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{currentAdvert.city}, {getCountryFlag(currentAdvert.country)}</span>
                  </div>
                  {currentAdvert.price && (
                    <div className="font-semibold">
                      {promotedAdvertsUtils.formatPrice(currentAdvert.price, currentAdvert.currency)}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => onAdvertClick && onAdvertClick(currentAdvert)}
                className="ml-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{currentAdvert.views_count || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{currentAdvert.saves_count || 0} saves</span>
            </div>
            {currentAdvert.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{currentAdvert.rating}</span>
                <span className="text-gray-400">({currentAdvert.reviews_count || 0})</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>{currentAdvert.verified_seller ? 'Verified' : 'Standard'}</span>
          </div>
        </div>
        
        {/* Dots Indicator */}
        {adverts.length > 1 && (
          <div className="flex items-center justify-center gap-2 pb-4">
            {adverts.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotedCarousel;
