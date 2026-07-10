import React, { useState, useEffect } from 'react';
import { Search, CalendarDays, Building2, MapPin, Users, TrendingUp } from 'lucide-react';
import eventsVenuesAPI from '../../services/eventsVenuesAPI';

const EventsVenuesHero = ({ viewType, setViewType, onSearch, statistics }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ search: searchQuery, location: locationQuery });
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Events & Venues Worldwide
          </h1>
          <p className="text-xl text-purple-100">
            Find the perfect venue, explore upcoming events, or promote your own
          </p>
        </div>

        {/* Toggle between Events and Venues */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 flex gap-2">
            <button
              onClick={() => setViewType('event')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                viewType === 'event'
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <CalendarDays className="h-5 w-5" />
              Explore Events
            </button>
            <button
              onClick={() => setViewType('venue')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                viewType === 'venue'
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="h-5 w-5" />
              Explore Venues
            </button>
          </div>
        </div>

        {/* Dual Search Bar */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-2">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={viewType === 'event' ? 'Search events...' : 'Search venues...'}
                className="w-full text-gray-800 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2 border-t md:border-t-0 md:border-l border-gray-200">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Location (city, country)"
                className="w-full text-gray-800 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {viewType === 'event' ? statistics.total_events : statistics.total_venues}
              </div>
              <div className="text-purple-100 text-sm">
                {viewType === 'event' ? 'Active Events' : 'Available Venues'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{statistics.total_views.toLocaleString()}</div>
              <div className="text-purple-100 text-sm">Total Views</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{statistics.total_categories}</div>
              <div className="text-purple-100 text-sm">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{statistics.verified_count}</div>
              <div className="text-purple-100 text-sm">Verified Listings</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsVenuesHero;
