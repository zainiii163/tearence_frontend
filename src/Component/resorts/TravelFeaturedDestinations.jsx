import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  DollarSign, 
  Heart, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Hotel,
  Plane,
  Camera
} from 'lucide-react';

const TravelFeaturedDestinations = ({ destinations = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Use real destinations if available, otherwise fall back to defaults
  const displayDestinations = destinations.length > 0 ? destinations : [
    // Default destinations (fallback)
    {
      id: 1,
      name: 'Dubai',
      country: 'United Arab Emirates',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea2666bbbff?w=800&h=600&fit=crop',
      avgPrice: 180,
      listings: 1234,
      rating: 4.8,
      description: 'Luxury city with stunning architecture and world-class resorts',
      highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall'],
      category: 'luxury'
    },
    {
      id: 2,
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773277-9e5c3d50d9c8?w=800&h=600&fit=crop',
      avgPrice: 65,
      listings: 892,
      rating: 4.9,
      description: 'Tropical paradise with beautiful beaches and cultural experiences',
      highlights: ['Ubud', 'Seminyak', 'Tanah Lot'],
      category: 'beach'
    },
    {
      id: 3,
      name: 'London',
      country: 'United Kingdom',
      image: 'https://images.unsplash.com/photo-1513635269945-9a2e8c35b9bd?w=800&h=600&fit=crop',
      avgPrice: 145,
      listings: 1567,
      rating: 4.7,
      description: 'Historic city with modern attractions and luxury hotels',
      highlights: ['Big Ben', 'Tower Bridge', 'Buckingham Palace'],
      category: 'city'
    },
    {
      id: 4,
      name: 'Cape Town',
      country: 'South Africa',
      image: 'https://images.unsplash.com/photo-1579722791206-5ebcd7b11d07?w=800&h=600&fit=crop',
      avgPrice: 95,
      listings: 456,
      rating: 4.8,
      description: 'Stunning coastal city with mountains and beaches',
      highlights: ['Table Mountain', 'V&A Waterfront', 'Cape Point'],
      category: 'adventure'
    },
    {
      id: 5,
      name: 'New York',
      country: 'United States',
      image: 'https://images.unsplash.com/photo-1496442226666-8a4d6928f166?w=800&h=600&fit=crop',
      avgPrice: 195,
      listings: 2341,
      rating: 4.6,
      description: 'The city that never sleeps with endless attractions',
      highlights: ['Times Square', 'Central Park', 'Statue of Liberty'],
      category: 'city'
    },
    {
      id: 6,
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
      avgPrice: 155,
      listings: 234,
      rating: 4.9,
      description: 'Romantic island with stunning sunsets and white-washed buildings',
      highlights: ['Oia', 'Fira', 'Red Beach'],
      category: 'romantic'
    },
    {
      id: 7,
      name: 'Marrakech',
      country: 'Morocco',
      image: 'https://images.unsplash.com/photo-1528702748617-7525f8165f46?w=800&h=600&fit=crop',
      avgPrice: 75,
      listings: 345,
      rating: 4.7,
      description: 'Exotic city with vibrant markets and traditional riads',
      highlights: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Medina'],
      category: 'cultural'
    }
  ];

  const visibleDestinations = 3; // Number of destinations visible at once

  useEffect(() => {
    if (isAutoPlay) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === displayDestinations.length - visibleDestinations ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [isAutoPlay, displayDestinations.length, visibleDestinations]);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayDestinations.length - visibleDestinations : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === displayDestinations.length - visibleDestinations ? 0 : currentIndex + 1);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getCategoryColor = (category) => {
    const colors = {
      luxury: 'from-purple-500 to-purple-600',
      beach: 'from-cyan-500 to-cyan-600',
      city: 'from-blue-500 to-blue-600',
      adventure: 'from-green-500 to-green-600',
      romantic: 'from-pink-500 to-pink-600',
      cultural: 'from-orange-500 to-orange-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular travel destinations around the world
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
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

          {/* Destinations Carousel */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -currentIndex * (100 / visibleDestinations) + '%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex gap-6"
            >
              {displayDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-none w-full md:w-1/2 lg:w-1/3"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(destination.category)}`}>
                          {destination.category}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-bold text-gray-900">${destination.avgPrice}</span>
                            <span className="text-xs text-gray-600">avg/night</span>
                          </div>
                        </div>
                      </div>

                      {/* Location Info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                        <div className="flex items-center space-x-2 text-white/90 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{destination.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Rating and Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">{destination.rating}</span>
                          <span className="text-gray-600 text-sm">(423 reviews)</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Hotel className="w-4 h-4" />
                            <span className="text-sm">{destination.listings}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{Math.floor(Math.random() * 10000 + 1000)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {destination.description}
                      </p>

                      {/* Highlights */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights.slice(0, 3).map((highlight, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View All {destination.listings} Listings
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
              ))}
            </motion.div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: displayDestinations.length - visibleDestinations + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-8 bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isAutoPlay
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                {isAutoPlay ? 'Auto-playing' : 'Paused'}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {destinationsToUse.length}
            </div>
            <div className="text-gray-600">Featured Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {destinationsToUse.reduce((sum, d) => sum + d.listings, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Listings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${Math.round(destinationsToUse.reduce((sum, d) => sum + d.avgPrice, 0) / destinationsToUse.length)}
            </div>
            <div className="text-gray-600">Average Price/Night</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(destinationsToUse.reduce((sum, d) => sum + d.rating, 0) / destinationsToUse.length).toFixed(1)}
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelFeaturedDestinations;
