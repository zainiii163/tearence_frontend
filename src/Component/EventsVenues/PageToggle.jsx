import React from 'react';
import { useSelector } from 'react-redux';
import { Calendar, MapPin } from 'lucide-react';

const PageToggle = ({ activeTab, onTabChange }) => {
  const { logIn } = useSelector((store) => store.auth);

  const handlePostEvent = () => {
    if (!logIn) {
      window.location.href = '/login';
      return;
    }
    window.dispatchEvent(new CustomEvent('openEventForm'));
  };

  const handlePostVenue = () => {
    if (!logIn) {
      window.location.href = '/login';
      return;
    }
    window.dispatchEvent(new CustomEvent('openVenueForm'));
  };
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="page-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onTabChange('events')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'events'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Explore Events</span>
            </button>
            
            <button
              onClick={() => onTabChange('venues')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'venues'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Explore Venues</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handlePostEvent}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Post an Event</span>
            </button>
            
            <button
              onClick={handlePostVenue}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Post a Venue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToggle;
