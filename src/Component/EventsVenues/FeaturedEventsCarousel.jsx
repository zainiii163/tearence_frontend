import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star, Eye, Heart, ExternalLink } from 'lucide-react';

const FeaturedEventsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featuredEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      time: "18:00",
      location: "Central Park, New York",
      city: "New York",
      price: "$45",
      image: "https://picsum.photos/seed/music-fest/400/300.jpg",
      category: "Concerts & Music",
      badge: "featured",
      rating: 4.8,
      views: 2341,
      likes: 189
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      date: "2024-08-20",
      time: "09:00",
      location: "Convention Center, San Francisco",
      city: "San Francisco",
      price: "$299",
      image: "https://picsum.photos/seed/tech-summit/400/300.jpg",
      category: "Business Conferences",
      badge: "sponsored",
      rating: 4.9,
      views: 3421,
      likes: 267
    },
    {
      id: 3,
      title: "Food & Wine Festival",
      date: "2024-09-10",
      time: "12:00",
      location: "Harbor Front, Miami",
      city: "Miami",
      price: "$75",
      image: "https://picsum.photos/seed/food-fest/400/300.jpg",
      category: "Food & Drink",
      badge: "promoted",
      rating: 4.7,
      views: 1876,
      likes: 143
    },
    {
      id: 4,
      title: "International Art Exhibition",
      date: "2024-10-05",
      time: "10:00",
      location: "Modern Art Gallery, London",
      city: "London",
      price: "Free",
      image: "https://picsum.photos/seed/art-expo/400/300.jpg",
      category: "Cultural Events",
      badge: "featured",
      rating: 4.6,
      views: 1234,
      likes: 98
    },
    {
      id: 5,
      title: "Marathon Championship",
      date: "2024-11-12",
      time: "07:00",
      location: "City Center, Boston",
      city: "Boston",
      price: "$35",
      image: "https://picsum.photos/seed/marathon/400/300.jpg",
      category: "Sports Events",
      badge: "promoted",
      rating: 4.9,
      views: 2987,
      likes: 234
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredEvents.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused, featuredEvents.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredEvents.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'featured':
        return 'bg-gradient-to-r from-purple-600 to-purple-700 text-white';
      case 'sponsored':
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
      case 'promoted':
        return 'bg-gradient-to-r from-teal-600 to-teal-700 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
            <p className="text-gray-600 mt-2">Discover the most popular events happening worldwide</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredEvents.map((event) => (
                <div key={event.id} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Event Image */}
                      <div className="relative h-64 lg:h-96">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeColor(event.badge)}`}>
                            {event.badge}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{event.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-8 flex flex-col justify-between">
                        <div>
                          <div className="text-sm text-purple-600 font-medium mb-2">{event.category}</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              <span className="mx-2">•</span>
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <span className="text-3xl font-bold text-gray-900">{event.price}</span>
                              <span className="text-gray-600 ml-2">per ticket</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{event.views.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{event.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                            View Details
                          </button>
                          <button className="flex-1 border border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                            Save Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'w-8 bg-purple-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEventsCarousel;
