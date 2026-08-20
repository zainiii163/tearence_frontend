import React, { useState } from 'react';
import { Search, Calendar, MapPin, Filter, ChevronDown } from 'lucide-react';

const Hero = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [eventSearch, setEventSearch] = useState({
    keyword: '',
    location: '',
    date: ''
  });
  const [venueSearch, setVenueSearch] = useState({
    keyword: '',
    location: '',
    capacity: ''
  });

  const handleEventSearch = (e) => {
    e.preventDefault();
    onSearch({ type: 'events', ...eventSearch });
  };

  const handleVenueSearch = (e) => {
    e.preventDefault();
    onSearch({ type: 'venues', ...venueSearch });
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-teal-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative page-container py-8 sm:py-10 lg:py-12">
        {/* Hero Content */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            Discover Entertainment Worldwide
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-purple-200">
              — Host, Attend, Promote
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Find the perfect venue, explore upcoming events, or promote your own.
          </p>
        </div>

        {/* Search Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 inline-flex">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'events'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Search Events</span>
            </button>
            <button
              onClick={() => setActiveTab('venues')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'venues'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Search Venues</span>
            </button>
          </div>
        </div>

        {/* Search Forms */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'events' ? (
            <form onSubmit={handleEventSearch} className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Event name, keyword..."
                    value={eventSearch.keyword}
                    onChange={(e) => setEventSearch({ ...eventSearch, keyword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="City, country..."
                    value={eventSearch.location}
                    onChange={(e) => setEventSearch({ ...eventSearch, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={eventSearch.date}
                    onChange={(e) => setEventSearch({ ...eventSearch, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">More options</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Events</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVenueSearch} className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Venue name, type..."
                    value={venueSearch.keyword}
                    onChange={(e) => setVenueSearch({ ...venueSearch, keyword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="City, country..."
                    value={venueSearch.location}
                    onChange={(e) => setVenueSearch({ ...venueSearch, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={venueSearch.capacity}
                    onChange={(e) => setVenueSearch({ ...venueSearch, capacity: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none"
                  >
                    <option value="">Any capacity</option>
                    <option value="small">Up to 50</option>
                    <option value="medium">50-200</option>
                    <option value="large">200-500</option>
                    <option value="xlarge">500+</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">More options</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Venues</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">15,234</div>
            <div className="text-purple-200 text-sm">Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">8,456</div>
            <div className="text-purple-200 text-sm">Venues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">142</div>
            <div className="text-purple-200 text-sm">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">98%</div>
            <div className="text-purple-200 text-sm">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
