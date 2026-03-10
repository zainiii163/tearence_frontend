import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Heart, Star, MapPin, Crown, Zap, Shield } from 'lucide-react';

const PromotedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const featuredAdverts = [
    {
      id: 1,
      title: 'Luxury Penthouse overlooking Manhattan Skyline',
      price: '$2,850,000',
      location: 'New York, USA',
      category: 'Property',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
      country: 'US',
      views: 45234,
      rating: 4.9,
      badge: 'Sponsored',
      badgeColor: 'bg-purple-600',
      description: 'Exclusive penthouse with panoramic city views'
    },
    {
      id: 2,
      title: '2023 Tesla Model S Plaid - Like New',
      price: '$89,999',
      location: 'Los Angeles, USA',
      category: 'Cars & Vehicles',
      image: 'https://images.unsplash.com/photo-1617654112368-307921295f85?w=600&h=400&fit=crop',
      country: 'US',
      views: 38456,
      rating: 4.8,
      badge: 'Featured',
      badgeColor: 'bg-orange-600',
      description: 'Fully loaded with autopilot and premium features'
    },
    {
      id: 3,
      title: 'Professional Web Development Services',
      price: '$75/hour',
      location: 'London, UK',
      category: 'Jobs & Services',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
      country: 'GB',
      views: 29876,
      rating: 5.0,
      badge: 'Promoted',
      badgeColor: 'bg-blue-600',
      description: 'Expert full-stack developer with 10+ years experience'
    },
    {
      id: 4,
      title: 'Beachfront Resort Investment Opportunity',
      price: '$1,250,000',
      location: 'Miami, USA',
      category: 'Business Opportunities',
      image: 'https://images.unsplash.com/photo-1520250498154-602280037054?w=600&h=400&fit=crop',
      country: 'US',
      views: 56789,
      rating: 4.7,
      badge: 'Sponsored',
      badgeColor: 'bg-purple-600',
      description: 'High ROI beachfront property with guaranteed returns'
    },
    {
      id: 5,
      title: 'Latest iPhone 15 Pro Max - Brand New',
      price: '$1,199',
      location: 'Toronto, Canada',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop',
      country: 'CA',
      views: 67890,
      rating: 4.9,
      badge: 'Featured',
      badgeColor: 'bg-orange-600',
      description: 'Brand new sealed box with warranty'
    },
    {
      id: 6,
      title: 'European Luxury Fashion Collection',
      price: '$5,500',
      location: 'Paris, France',
      category: 'Fashion & Beauty',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      country: 'FR',
      views: 34567,
      rating: 4.8,
      badge: 'Promoted',
      badgeColor: 'bg-blue-600',
      description: 'Exclusive designer pieces from top European brands'
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredAdverts.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, featuredAdverts.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredAdverts.length) % featuredAdverts.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredAdverts.length);
  };

  const goToSlide = (index) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Crown className="h-6 w-6 text-orange-500" />
          Featured Promoted Adverts
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl overflow-hidden shadow-xl border border-gray-200"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-96 md:h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="relative h-full">
                {/* Background Image */}
                <img
                  src={featuredAdverts[currentIndex].image}
                  alt={featuredAdverts[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="max-w-4xl">
                    {/* Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`${featuredAdverts[currentIndex].badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                        {featuredAdverts[currentIndex].badge === 'Sponsored' && <Shield className="h-3 w-3" />}
                        {featuredAdverts[currentIndex].badge === 'Featured' && <Star className="h-3 w-3" />}
                        {featuredAdverts[currentIndex].badge === 'Promoted' && <Zap className="h-3 w-3" />}
                        {featuredAdverts[currentIndex].badge}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        {featuredAdverts[currentIndex].category}
                      </span>
                    </div>

                    {/* Title and Price */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {featuredAdverts[currentIndex].title}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl md:text-3xl font-bold text-orange-400">
                        {featuredAdverts[currentIndex].price}
                      </span>
                      <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="h-4 w-4" />
                        <span>{featuredAdverts[currentIndex].location}</span>
                        <span className="text-lg">{getCountryFlag(featuredAdverts[currentIndex].country)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/90 mb-4 max-w-2xl">
                      {featuredAdverts[currentIndex].description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-white/80 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{featuredAdverts[currentIndex].views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{featuredAdverts[currentIndex].rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>Save</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pause Indicator */}
          {isPaused && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              Paused
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        <div className="bg-white/90 backdrop-blur-sm p-4">
          <div className="flex gap-2 overflow-x-auto">
            {featuredAdverts.map((advert, index) => (
              <button
                key={advert.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200 ${
                  index === currentIndex ? 'ring-2 ring-orange-500 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={advert.image}
                  alt={advert.title}
                  className="w-20 h-16 object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-orange-500/20"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Button */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
          Quick View Current Advert
        </button>
      </div>
    </div>
  );
};

export default PromotedCarousel;
