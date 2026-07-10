import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Plus,
  Filter,
  TrendingUp,
  MapPin,
  Users,
  Heart,
  Share2,
  MessageCircle,
  Star,
  ChevronDown,
  Home,
  Compass,
  Bookmark,
  Globe,
  Hash
} from 'lucide-react';

// Import components
import LeftRail from './LeftRail';
import Feed from './Feed';
import RightRail from './RightRail';
import CreateMenuDropdown from './CreateMenuDropdown';

const CommunitiesHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState('ads');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock data for demonstration
  const currentUser = {
    name: 'John Doe',
    handle: '@johndoe',
    avatar: '/images/default-avatar.png',
    country: 'GB',
    stats: {
      posts: 42,
      communities: 8,
      reputation: 4.8
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery, 'in tab:', searchTab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Communities Label */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">WA</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">World Wide Adverts</span>
              </div>
              <span className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                Communities
              </span>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <Search className="w-5 h-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ads, communities, people..."
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                  />
                  <div className="flex items-center">
                    {/* Search Tabs */}
                    <div className="flex items-center space-x-1 mr-2">
                      {['ads', 'communities', 'people', 'categories'].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setSearchTab(tab)}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            searchTab === tab
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Create + Notifications + Profile */}
            <div className="flex items-center space-x-3">
              {/* Create Menu */}
              <CreateMenuDropdown />
              
              {/* Messages */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{currentUser.name}</p>
                          <p className="text-sm text-gray-500">{currentUser.handle}</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                      View Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                      Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-[280px_minmax(0,1fr)_320px] gap-6">
          {/* Left Rail */}
          <LeftRail user={currentUser} />
          
          {/* Center Feed */}
          <Feed />
          
          {/* Right Rail */}
          <RightRail />
        </div>
      </main>
    </div>
  );
};

export default CommunitiesHome;
