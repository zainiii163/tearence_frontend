import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Heart, Star, MapPin, Tag, ExternalLink } from 'lucide-react';

const PromotedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const promotedAds = [
    {
      id: 1,
      title: "Luxury Penthouse with Ocean View",
      category: "Property",
      price: "$2,500,000",
      location: "Miami Beach, Florida",
      country: "United States",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      seller: "Elite Properties",
      rating: 4.9,
      views: 15234,
      saves: 892,
      featured: true
    },
    {
      id: 2,
      title: "2023 Ferrari F8 Tributo",
      category: "Cars & Vehicles",
      price: "$450,000",
      location: "Dubai, UAE",
      country: "United Arab Emirates",
      countryFlag: "🇦🇪",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      seller: "Luxury Motors",
      rating: 4.8,
      views: 28456,
      saves: 1234,
      featured: true
    },
    {
      id: 3,
      title: "Executive Business Opportunity",
      category: "Business Opportunities",
      price: "$750,000",
      location: "London, UK",
      country: "United Kingdom",
      countryFlag: "🇬🇧",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop",
      seller: "Business Brokers Ltd",
      rating: 4.7,
      views: 9876,
      saves: 567,
      featured: true
    },
    {
      id: 4,
      title: "Latest MacBook Pro 16\"",
      category: "Electronics",
      price: "$2,499",
      location: "Tokyo, Japan",
      country: "Japan",
      countryFlag: "🇯🇵",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
      seller: "TechStore Japan",
      rating: 4.9,
      views: 32145,
      saves: 1876,
      featured: true
    },
    {
      id: 5,
      title: "Exclusive Fashion Collection",
      category: "Fashion & Beauty",
      price: "$12,500",
      location: "Paris, France",
      country: "France",
      countryFlag: "🇫🇷",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      seller: "Haute Couture",
      rating: 5.0,
      views: 19876,
      saves: 2341,
      featured: true
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === promotedAds.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPaused, promotedAds.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? promotedAds.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === promotedAds.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentAd = promotedAds[currentIndex];

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Tag className="w-4 h-4" />
              PROMOTED
            </div>
            <div className="text-white/90 text-sm">
              Featured Listing {currentIndex + 1} of {promotedAds.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              {isPaused ? '▶' : '⏸'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Carousel */}
      <div 
        className="relative h-96 lg:h-[500px] overflow-hidden"
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
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={currentAd.image}
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-10">
              <div className="max-w-3xl">
                {/* Category and Location */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {currentAd.category}
                  </div>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{currentAd.location}</span>
                    <span className="ml-2">{currentAd.countryFlag}</span>
                  </div>
                </div>

                {/* Title and Price */}
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                  {currentAd.title}
                </h2>
                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-6">
                  {currentAd.price}
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentAd.seller.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{currentAd.seller}</div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-white/90 text-sm">{currentAd.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{currentAd.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{currentAd.saves.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      // Quick view modal
                      console.log('Quick view:', currentAd.id);
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Quick View
                  </button>
                  <button
                    onClick={() => {
                      // Navigate to advert
                      window.location.href = `/ads-detail/${currentAd.id}`;
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Advert
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {promotedAds.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-amber-500 w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotedCarousel;
