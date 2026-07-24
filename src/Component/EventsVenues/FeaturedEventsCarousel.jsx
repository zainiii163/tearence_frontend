import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star, Eye, Heart, ExternalLink } from 'lucide-react';
import eventsApi from '../../services/eventsApi';

const FeaturedEventsCarousel = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use passed events or fetch from API
  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        setLoading(true);
        let eventsData;
        
        if (events && events.data) {
          // Use passed events data
          eventsData = events.data;
        } else {
          // Fetch from API
          const response = await eventsApi.getFeaturedEvents();
          eventsData = response.data || [];
        }
        
        setFeaturedEvents(eventsData);
      } catch (error) {
        console.error('Failed to load featured events:', error);
        setFeaturedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedEvents();
  }, [events]);

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
      case 'Featured':
        return 'bg-gradient-to-r from-purple-600 to-purple-700 text-white';
      case 'Sponsored':
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
      case 'Promoted':
        return 'bg-gradient-to-r from-teal-600 to-teal-700 text-white';
      case 'Spotlight':
        return 'bg-gradient-to-r from-pink-600 to-pink-700 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatPrice = (event) => {
    if (event.price_type === 'free') return 'Free';
    if (event.price_type === 'donation') return 'Donation';
    if (event.ticket_price) return `$${event.ticket_price}`;
    return 'Free';
  };

  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'concert': 'Concerts & Music',
      'conference': 'Business Conferences',
      'workshop': 'Workshops',
      'festival': 'Festivals',
      'party': 'Parties & Nightlife',
      'sports': 'Sports Events',
      'cultural': 'Cultural Events',
      'food_drink': 'Food & Drink',
      'charity': 'Charity Events',
      'other': 'Other'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="page-container">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredEvents || featuredEvents.length === 0) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="page-container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-gray-600">No featured events available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="page-container">
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
                          src={event.images && event.images.length > 0 ? event.images[0] : '/api/placeholder/400/300'}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeColor(event.promotion_badge)}`}>
                            {event.promotion_badge}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-900">{event.views || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-8 flex flex-col justify-between">
                        <div>
                          <div className="text-sm text-purple-600 font-medium mb-2">{getCategoryDisplay(event.category)}</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                              <span>{event.date_time ? new Date(event.date_time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBD'}</span>
                              {event.date_time && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{new Date(event.date_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                              <span>{event.venue_name || 'Venue TBD'}, {event.city}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <span className="text-3xl font-bold text-gray-900">{formatPrice(event)}</span>
                              {event.price_type === 'paid' && <span className="text-gray-600 ml-2">per ticket</span>}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{(event.views || 0).toLocaleString()}</span>
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
