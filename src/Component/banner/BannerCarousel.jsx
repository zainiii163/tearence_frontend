import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Eye, 
  Clock,
  Flag,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

// Import API services
import { trackBannerClick } from '../../api/banner';

const BannerCarousel = ({ banners, loading, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedBanner, setExpandedBanner] = useState(null);

  // Safety check: ensure banners is an array
  const safeBanners = Array.isArray(banners) ? banners : [];

  useEffect(() => {
    if (!isPlaying || isPaused || !safeBanners?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, safeBanners?.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + safeBanners.length) % safeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
  };

  const handleBannerClick = async (banner) => {
    try {
      // Track banner click via API
      await trackBannerClick(banner.slug);
    } catch (error) {
      console.warn('Failed to track click:', error);
      // Don't fail user action if tracking fails
    }
    
    setExpandedBanner(banner);
    if (onBannerClick) {
      onBannerClick(banner);
    }
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

  if (loading || !safeBanners.length) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <div className="text-gray-500">{loading ? 'Loading banners...' : 'No banners available at the moment.'}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Banner Adverts</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {safeBanners[currentIndex] && (
          <div 
            className="relative overflow-hidden rounded-xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={safeBanners[currentIndex].id || currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
              {/* Banner Image */}
              <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <img
                  src={safeBanners[currentIndex]?.banner_image || safeBanners[currentIndex]?.bannerImage}
                  alt={safeBanners[currentIndex]?.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Badge */}
                {safeBanners[currentIndex]?.promotion_badge && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(safeBanners[currentIndex].promotion_badge || safeBanners[currentIndex].promotion_tier || 'standard')}`}>
                      {(() => {
                        const badge = safeBanners[currentIndex].promotion_badge || safeBanners[currentIndex].promotion_tier;
                        return badge ? badge.charAt(0).toUpperCase() + badge.slice(1) : '';
                      })()}
                    </span>
                  </div>
                )}

                {/* Country Flag */}
                <div className="absolute top-4 right-4">
                  <span className="text-2xl">{getCountryFlag(safeBanners[currentIndex]?.country)}</span>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => handleBannerClick(safeBanners[currentIndex])}
                  className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Banner Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{safeBanners[currentIndex]?.title || 'Untitled'}</h3>
                  <p className="text-sm md:text-base text-blue-100 mb-3">{safeBanners[currentIndex]?.businessName || safeBanners[currentIndex]?.business_name || ''}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{(safeBanners[currentIndex]?.views_count || safeBanners[currentIndex]?.views || 0).toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{safeBanners[currentIndex]?.created_at ? new Date(safeBanners[currentIndex].created_at).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    {safeBanners[currentIndex]?.rating != null && !isNaN(Number(safeBanners[currentIndex].rating)) && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{Number(safeBanners[currentIndex].rating)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {safeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
        )}

        {/* Banner Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
          {safeBanners.map((banner, index) => (
            <button
              key={banner.id || index}
              onClick={() => setCurrentIndex(index)}
              className={`relative rounded-lg overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
              }`}
            >
              <img
                src={banner.banner_image || banner.bannerImage}
                alt={banner.title || 'Banner'}
                className="w-full h-20 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              {index === currentIndex && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Banner Modal */}
      <AnimatePresence>
        {expandedBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setExpandedBanner(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Banner Image */}
                <div className="relative h-64 md:h-80 lg:h-96 bg-gray-100">
                  <img
                    src={expandedBanner.banner_image || expandedBanner.bannerImage}
                    alt={expandedBanner.title || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setExpandedBanner(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Banner Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{expandedBanner.title || 'Untitled'}</h2>
                      <p className="text-lg text-gray-600">{expandedBanner.business_name || ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedBanner.promotion_badge && (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(expandedBanner.promotion_badge || expandedBanner.promotion_tier || 'standard')}`}>
                          {(() => {
                            const badge = expandedBanner.promotion_badge || expandedBanner.promotion_tier;
                            return badge ? badge.charAt(0).toUpperCase() + badge.slice(1) : '';
                          })()}
                        </span>
                      )}
                      <span className="text-2xl">{getCountryFlag(expandedBanner.country)}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{expandedBanner.description || ''}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">{(expandedBanner.views_count || expandedBanner.views || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">{(expandedBanner.clicks_count || expandedBanner.clicks || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Clicks</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Flag className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">
                        {(() => {
                          const views = expandedBanner.views_count || expandedBanner.views || 0;
                          const clicks = expandedBanner.clicks_count || expandedBanner.clicks || 0;
                          // Use backend CTR if available and valid, otherwise calculate
                          if (expandedBanner.ctr != null && !isNaN(Number(expandedBanner.ctr))) {
                            return Number(expandedBanner.ctr).toFixed(1);
                          }
                          const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';
                          return ctr;
                        })()}%
                      </div>
                      <div className="text-sm text-gray-600">CTR</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">
                        {expandedBanner.rating != null && !isNaN(Number(expandedBanner.rating)) ? Number(expandedBanner.rating) : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={expandedBanner.destination_link || expandedBanner.destinationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                    <button
                      onClick={() => setExpandedBanner(null)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BannerCarousel;
