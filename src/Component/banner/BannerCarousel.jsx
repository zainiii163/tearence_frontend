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

const BannerCarousel = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedBanner, setExpandedBanner] = useState(null);

  useEffect(() => {
    if (!isPlaying || isPaused || !banners.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, banners.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = (banner) => {
    setExpandedBanner(banner);
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
      'Italy': '🇮🇹'
    };
    return flags[country] || '🌍';
  };

  if (!banners.length) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <div className="text-gray-500">No banners available at the moment.</div>
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

        <div 
          className="relative overflow-hidden rounded-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Banner Image */}
              <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <img
                  src={banners[currentIndex].bannerImage}
                  alt={banners[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(banners[currentIndex].badge)}`}>
                    {banners[currentIndex].badge?.charAt(0).toUpperCase() + banners[currentIndex].badge?.slice(1)}
                  </span>
                </div>

                {/* Country Flag */}
                <div className="absolute top-4 right-4">
                  <span className="text-2xl">{getCountryFlag(banners[currentIndex].country)}</span>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => handleBannerClick(banners[currentIndex])}
                  className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Banner Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{banners[currentIndex].title}</h3>
                  <p className="text-sm md:text-base text-blue-100 mb-3">{banners[currentIndex].businessName}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{banners[currentIndex].views?.toLocaleString() || '0'} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{banners[currentIndex].postedDate ? new Date(banners[currentIndex].postedDate).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    {banners[currentIndex].rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{banners[currentIndex].rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
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

        {/* Banner Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative rounded-lg overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
              }`}
            >
              <img
                src={banner.bannerImage}
                alt={banner.title}
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
                    src={expandedBanner.bannerImage}
                    alt={expandedBanner.title}
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{expandedBanner.title}</h2>
                      <p className="text-lg text-gray-600">{expandedBanner.businessName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(expandedBanner.badge)}`}>
                        {expandedBanner.badge?.charAt(0).toUpperCase() + expandedBanner.badge?.slice(1)}
                      </span>
                      <span className="text-2xl">{getCountryFlag(expandedBanner.country)}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{expandedBanner.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">{expandedBanner.views?.toLocaleString() || '0'}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">{expandedBanner.clicks || '0'}</div>
                      <div className="text-sm text-gray-600">Clicks</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Flag className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">{expandedBanner.ctr || '0'}%</div>
                      <div className="text-sm text-gray-600">CTR</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold">{expandedBanner.rating || '0'}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={expandedBanner.destinationLink}
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
