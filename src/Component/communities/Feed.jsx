import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  TrendingUp, 
  Clock, 
  Star,
  MapPin,
  ChevronDown,
  Grid,
  List,
  Search
} from 'lucide-react';
import AdThreadCard from './AdThreadCard';
import DiscussionThreadCard from './DiscussionThreadCard';
import { communitiesAPI } from '../../api/communities';

const Feed = ({ view = 'mixed' }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('trending');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterPriceRange, setFilterPriceRange] = useState({ min: 0, max: 10000000 });
  const [showOnlyAds, setShowOnlyAds] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const mockThreads = useMemo(() => [
    {
      id: 1,
      type: 'ad',
      title: '3-Bed Apartment for Rent - City Centre',
      description: 'Beautiful 3-bedroom apartment in the heart of the city. Modern amenities, great location, perfect for professionals.',
      category: 'property',
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/avatar-1.jpg',
        type: 'business',
        reputation: 4.8,
        verified: true
      },
      location: 'Manchester, UK',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      images: ['/images/property-1.jpg', '/images/property-2.jpg'],
      price: '£1,200/month',
      type: 'rent',
      bedrooms: 3,
      availability: 'Available Now',
      verified: true,
      community_verified: true,
      communities: [
        { id: 1, name: 'UK Property Deals' },
        { id: 2, name: 'Manchester Rentals' }
      ],
      comments_count: 12,
      comments: [
        {
          id: 1,
          author: { name: 'Mike Chen', avatar: '/images/avatar-2.jpg' },
          content: 'Is this still available? I\'m looking for a 3-bed in the city centre.',
          type: 'question',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          author: { name: 'Emma Wilson', avatar: '/images/avatar-3.jpg' },
          content: 'I viewed this property last week - it\'s in excellent condition and the location is fantastic!',
          type: 'review',
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 2,
      type: 'discussion',
      title: 'Best property investment strategies for 2024?',
      content: 'Looking for advice on property investment strategies for the upcoming year. What are your thoughts on buy-to-let vs commercial properties? Interested in hearing from experienced investors about market trends, financing options, and risk management. Any tips for first-time investors would be greatly appreciated!',
      category: 'property',
      author: {
        name: 'Alex Thompson',
        avatar: '/images/avatar-4.jpg',
        type: 'individual'
      },
      location: 'Global',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      tags: ['investment', 'property', 'advice'],
      verified: true,
      pinned: true,
      community: { id: 1, name: 'UK Property Deals' },
      comments_count: 28,
      views: 156,
      participants: 12,
      helpful_count: 8,
      comments: [
        {
          id: 1,
          author: { name: 'David Lee', avatar: '/images/avatar-5.jpg' },
          content: 'Buy-to-let is still strong in major cities. Focus on areas with good transport links and universities.',
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 3,
      type: 'ad',
      title: 'Funding needed for Tech Startup - £50k Seed Round',
      description: 'Early-stage SaaS company seeking £50,000 seed investment for product development and market expansion. Already have MVP and first paying customers.',
      category: 'funding',
      author: {
        name: 'TechVentures Ltd',
        avatar: '/images/avatar-6.jpg',
        type: 'business',
        reputation: 4.5,
        verified: true
      },
      location: 'London, UK',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      images: ['/images/funding-1.jpg'],
      ticket_size: '£50,000',
      stage: 'Seed',
      sector: 'SaaS',
      region: 'UK',
      verified: true,
      communities: [
        { id: 3, name: 'UK Startups' },
        { id: 4, name: 'Tech Funding' }
      ],
      comments_count: 8,
      comments: [
        {
          id: 1,
          author: { name: 'InvestorPro', avatar: '/images/avatar-7.jpg' },
          content: 'Interesting concept. What\'s your current revenue run rate?',
          type: 'question',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 4,
      type: 'discussion',
      title: 'Remote work policies - What\'s working for your team?',
      content: 'With the shift to hybrid/remote work, I\'m curious about what policies and tools are working well for different companies. Are you offering stipends for home office setup? How do you maintain team culture? Share your experiences and best practices!',
      category: 'business',
      author: {
        name: 'Maria Garcia',
        avatar: '/images/avatar-8.jpg',
        type: 'individual'
      },
      location: 'Global',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      tags: ['remote-work', 'policy', 'culture'],
      community: { id: 2, name: 'Business & Companies' },
      comments_count: 45,
      views: 234,
      participants: 18,
      helpful_count: 12,
      comments: [
        {
          id: 1,
          author: { name: 'HR Manager', avatar: '/images/avatar-9.jpg' },
          content: 'We provide £500 home office stipend and monthly co-working space budget.',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ], []);

  // Filter and sort threads
  const filteredAndSortedThreads = useMemo(() => {
    let filtered = mockThreads;

    // Apply filters
    if (filterCategory !== 'all') {
      filtered = filtered.filter(thread => thread.category === filterCategory);
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(thread => 
        thread.location?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (view === 'ads') {
      filtered = filtered.filter(thread => thread.type === 'ad');
    } else if (view === 'discussions') {
      filtered = filtered.filter(thread => thread.type === 'discussion');
    }

    // Apply price filter for ads
    if (filterPriceRange.min > 0 || filterPriceRange.max < 10000000) {
      filtered = filtered.filter(thread => {
        if (thread.type !== 'ad') return true;
        const price = parseInt(thread.price?.replace(/[^0-9]/g, '')) || 0;
        return price >= filterPriceRange.min && price <= filterPriceRange.max;
      });
    }

    // Apply sorting
    switch (sortOption) {
      case 'trending':
        return filtered.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
      case 'newest':
        return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'top-rated':
        return filtered.sort((a, b) => (b.author?.reputation || 0) - (a.author?.reputation || 0));
      case 'near-me':
        // In a real app, this would use user's location
        return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return filtered;
    }
  }, [mockThreads, filterCategory, filterLocation, filterPriceRange, view, sortOption]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setThreads(filteredAndSortedThreads);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [filteredAndSortedThreads]);

  const handleThreadAction = (action, thread) => {
    console.log(`${action} on thread:`, thread);
  };

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Community Feed</h2>
          
          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium capitalize">{sortOption}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showFilters && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    {['trending', 'newest', 'top-rated', 'near-me'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                          sortOption === option ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Show:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setShowOnlyAds(false)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    !showOnlyAds ? 'bg-white text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setShowOnlyAds(true)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    showOnlyAds ? 'bg-white text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ads Only
                </button>
              </div>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="property">Property</option>
                  <option value="funding">Funding</option>
                  <option value="jobs">Jobs</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="services">Services</option>
                  <option value="business">Business</option>
                  <option value="charities">Charities</option>
                  <option value="events">Events</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Location:</span>
                <div className="relative">
                  <input
                    type="text"
                    value={filterLocation === 'all' ? '' : filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value || 'all')}
                    placeholder="Enter location..."
                    className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm w-40"
                  />
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={filterPriceRange.min}
                    onChange={(e) => setFilterPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                    placeholder="Min"
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={filterPriceRange.max}
                    onChange={(e) => setFilterPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                    placeholder="Max"
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Clear all */}
            <button
              onClick={() => {
                setFilterCategory('all');
                setFilterLocation('all');
                setFilterPriceRange({ min: 0, max: 10000000 });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AnimatePresence>
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {thread.type === 'ad' ? (
                <AdThreadCard 
                  ad={thread}
                  onDiscuss={(ad) => handleThreadAction('discuss', ad)}
                  onSave={(ad) => handleThreadAction('save', ad)}
                  onShare={(ad) => handleThreadAction('share', ad)}
                  onContact={(ad) => handleThreadAction('contact', ad)}
                />
              ) : (
                <DiscussionThreadCard 
                  discussion={thread}
                  onSave={(discussion) => handleThreadAction('save', discussion)}
                  onShare={(discussion) => handleThreadAction('share', discussion)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* No Results */}
      {!loading && threads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No threads found</h3>
            <p className="text-sm">Try adjusting your filters or check back later for new content.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
