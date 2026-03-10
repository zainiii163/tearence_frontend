import React, { useState, useEffect } from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaHeart, 
  FaEye, 
  FaCrown,
  FaGem,
  FaRocket,
  FaExpand,
  FaMapMarkerAlt,
  FaTag
} from 'react-icons/fa';

const FeaturedCarousel = ({ adverts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Premium featured adverts for carousel (highest-tier sponsored ads)
  const premiumAdverts = adverts?.filter(advert => 
    advert.badge === 'Sponsored' || advert.featured
  ) || [];

  useEffect(() => {
    if (!isAutoPlaying || premiumAdverts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === premiumAdverts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, premiumAdverts.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? premiumAdverts.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === premiumAdverts.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (premiumAdverts.length === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-12 text-center">
        <FaCrown className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Premium Featured Ads Yet</h3>
        <p className="text-gray-600">Be the first to feature your advert here!</p>
      </div>
    );
  }

  const currentAdvert = premiumAdverts[currentIndex];

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaGem className="h-8 w-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold">Premium Showcase</h2>
              <p className="text-purple-100">Highest-tier sponsored adverts</p>
            </div>
          </div>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            {isAutoPlaying ? (
              <FaExpand className="h-5 w-5" />
            ) : (
              <FaRocket className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative h-96 overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out h-full"
             style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {premiumAdverts.map((advert, index) => (
            <div key={advert.id} className="min-w-full h-full relative">
              {/* Background Image */}
              <img
                src={advert.image}
                alt={advert.title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-2xl mx-auto px-8 text-white">
                  <div className="space-y-4">
                    {/* Badge and Flag */}
                    <div className="flex items-center space-x-3">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${
                        advert.badge === 'Sponsored' 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}>
                        {advert.badge === 'Sponsored' ? (
                          <FaCrown className="h-4 w-4" />
                        ) : (
                          <FaStar className="h-4 w-4" />
                        )}
                        <span>{advert.badge}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                        <span className="text-xl">{advert.flag}</span>
                        <span className="text-sm font-medium">{advert.location}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                      {advert.title}
                    </h1>

                    {/* Price and Category */}
                    <div className="flex items-center space-x-6">
                      <div className="text-3xl font-bold text-yellow-400">
                        {advert.price}
                      </div>
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <FaTag className="h-4 w-4" />
                        <span className="font-medium">{advert.category}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <FaEye className="h-4 w-4 text-blue-300" />
                        <span>{advert.views?.toLocaleString() || '0'} views</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="h-4 w-4 text-green-300" />
                        <span>{advert.seller}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-4 pt-4">
                      <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2">
                        <FaExpand className="h-4 w-4" />
                        <span>Quick View</span>
                      </button>
                      <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
                        <FaHeart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick View Button (Top Right) */}
              <div className="absolute top-4 right-4">
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all transform hover:scale-105 shadow-lg">
                  <FaExpand className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {premiumAdverts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-lg z-10"
          >
            <FaChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-lg z-10"
          >
            <FaChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {premiumAdverts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {premiumAdverts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedCarousel;
