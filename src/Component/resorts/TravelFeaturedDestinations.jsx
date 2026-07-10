import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTravelImageUrl } from '../../utils/travelFormHelpers';
import { 
  MapPin, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Hotel,
  Car,
  Compass,
  CheckCircle
} from 'lucide-react';

const TIER_COLORS = {
  featured: 'from-purple-500 to-purple-600',
  sponsored: 'from-orange-500 to-orange-600',
  network_wide: 'from-red-500 to-red-600',
  promoted: 'from-blue-500 to-blue-600',
  standard: 'from-gray-500 to-gray-600',
};

const TYPE_COLORS = {
  accommodation: 'from-blue-500 to-blue-600',
  transport: 'from-green-500 to-green-600',
  experience: 'from-purple-500 to-purple-600',
};

const TravelFeaturedDestinations = ({ destinations = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const adverts = Array.isArray(destinations) ? destinations : [];
  const visibleCount = 3;

  useEffect(() => {
    if (!isAutoPlay || adverts.length <= visibleCount) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= adverts.length - visibleCount ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlay, adverts.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, adverts.length - visibleCount) : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= adverts.length - visibleCount ? 0 : prev + 1
    );
  };

  const getImage = (advert) => advert.display_image_url || getTravelImageUrl(advert);

  const getPrice = (advert) => {
    if (advert.price_per_night) return { amount: advert.price_per_night, label: '/night' };
    if (advert.price_per_trip) return { amount: advert.price_per_trip, label: '/trip' };
    if (advert.price_per_service) return { amount: advert.price_per_service, label: '/service' };
    return null;
  };

  const getHighlights = (advert) => {
    if (Array.isArray(advert.amenities) && advert.amenities.length > 0) return advert.amenities.slice(0, 3);
    return [];
  };

  const getTypeIcon = (type) => {
    if (type === 'transport') return <Car className="w-4 h-4" />;
    if (type === 'experience') return <Compass className="w-4 h-4" />;
    return <Hotel className="w-4 h-4" />;
  };

  const getBadgeColor = (advert) =>
    TIER_COLORS[advert.promotion_tier] || TYPE_COLORS[advert.advert_type] || 'from-gray-500 to-gray-600';

  const getBadgeLabel = (advert) => {
    if (advert.promotion_tier && advert.promotion_tier !== 'standard') {
      return advert.promotion_tier.charAt(0).toUpperCase() + advert.promotion_tier.slice(1).replace('_', ' ');
    }
    return advert.advert_type ? advert.advert_type.charAt(0).toUpperCase() + advert.advert_type.slice(1) : '';
  };

  if (adverts.length === 0) {
    return (
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Featured Travel Services</h2>
          <p className="text-gray-500">No featured listings yet. Be the first to post!</p>
        </div>
      </div>
    );
  }

  const dotsCount = Math.max(1, adverts.length - visibleCount + 1);

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Featured Travel Services
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Handpicked premium listings from verified providers worldwide
          </p>
        </motion.div>

        <div className="relative">
          {adverts.length > visibleCount && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex gap-6"
            >
              {adverts.map((advert, index) => {
                const price = getPrice(advert);
                const highlights = getHighlights(advert);
                const badgeColor = getBadgeColor(advert);
                const badgeLabel = getBadgeLabel(advert);

                return (
                  <motion.div
                    key={advert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-none w-full md:w-1/2 lg:w-1/3"
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={getImage(advert)}
                          alt={advert.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1571003123894-1fba9f8f8d59?w=800&h=600&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {badgeLabel && (
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${badgeColor}`}>
                              {badgeLabel}
                            </span>
                          </div>
                        )}

                        {price && (
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                              <span className="text-sm font-bold text-gray-900">
                                {advert.currency || '£'}{Number(price.amount).toFixed(0)}
                              </span>
                              <span className="text-xs text-gray-600">{price.label}</span>
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{advert.title}</h3>
                          <div className="flex items-center space-x-2 text-white/90 text-sm">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{[advert.city, advert.country].filter(Boolean).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-5 h-5 text-blue-600">{getTypeIcon(advert.advert_type)}</div>
                          <span className="text-xs text-gray-500 capitalize">{advert.advert_type}</span>
                          {advert.verified_business && (
                            <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                          )}
                          {advert.business_name && (
                            <span className="text-xs text-gray-600 ml-1 line-clamp-1">{advert.business_name}</span>
                          )}
                        </div>

                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                          {advert.tagline || advert.description || advert.overview}
                        </p>

                        {highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {highlights.map((h, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            View Details
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {dotsCount > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: dotsCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {adverts.length > visibleCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isAutoPlay ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">{isAutoPlay ? 'Auto-playing' : 'Paused'}</span>
              </button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-center"
        >
          <div>
            <div className="text-xl font-bold text-gray-900 mb-1">{adverts.length}</div>
            <div className="text-xs text-gray-600">Featured Listings</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600 mb-1">
              {new Set(adverts.map(a => a.country).filter(Boolean)).size}
            </div>
            <div className="text-xs text-gray-600">Countries</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600 mb-1">
              {adverts.filter(a => a.verified_business).length}
            </div>
            <div className="text-xs text-gray-600">Verified Providers</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelFeaturedDestinations;
