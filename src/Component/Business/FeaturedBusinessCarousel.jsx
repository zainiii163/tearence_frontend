import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt, FaHeart, FaShare } from 'react-icons/fa';

const FeaturedBusinessCarousel = ({ businesses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % businesses.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + businesses.length) % businesses.length);
  };

  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Businesses</h2>
              <p className="text-gray-600">Premium listings from top businesses worldwide</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {businesses.slice(currentIndex, currentIndex + 3).map((business, index) => (
                  <motion.div
                    key={business.id || index}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={business.image || "/img/NoImage.png"}
                        alt={business.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                          Featured
                        </span>
                        {business.verified && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                          <FaHeart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                        </button>
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                          <FaShare className="h-4 w-4 text-gray-600 hover:text-purple-500" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 w-fit">
                          <FaStar className="h-3 w-3 text-yellow-400" />
                          {business.rating || '4.8'}
                          <span className="text-gray-500">({business.reviews || '128'})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={business.logo || business.image || "/img/NoImage.png"}
                          alt={business.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{business.title}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaMapMarkerAlt className="h-3 w-3 mr-1 text-purple-500" />
                            {business.location || 'Global'}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {business.description || 'Premium business offering exceptional services'}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          {business.price && (
                            <span className="text-lg font-bold text-purple-600">
                              {business.price}
                            </span>
                          )}
                          {business.category && (
                            <span className="text-sm text-gray-500 ml-2">
                              {business.category}
                            </span>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {businesses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-purple-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedBusinessCarousel;
