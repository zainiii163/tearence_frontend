import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Shield, 
  Flag,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Filter,
  Grid,
  List,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  AlertTriangle,
  Home,
  Building,
  Briefcase,
  DollarSign,
  Car,
  Calendar as CalendarIcon,
  Hotel
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdThreadCard from './AdThreadCard';
import DiscussionThreadCard from './DiscussionThreadCard';
import { communitiesAPI } from '../../api/communities';

const CommunityPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('trending');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  // Mock community data
  const mockCommunity = {
    id: communityId,
    name: 'Property & Real Estate - UK',
    description: 'Connect with property investors, landlords, tenants, and real estate professionals across the United Kingdom. Share listings, market insights, investment opportunities, and local regulations.',
    category: 'property',
    categoryLabel: 'Property & Real Estate',
    scope: 'Regional',
    coverImage: '/images/community-property.jpg',
    rules: [
      'No spam or duplicate listings',
      'Must include accurate pricing and location',
      'Be respectful in all discussions',
      'No discriminatory language or content',
      'Commercial posts must be clearly marked as such'
    ],
    stats: {
      members: 42000,
      postsToday: 312,
      activeNow: 89,
      totalPosts: 15678
    },
    moderators: [
      { id: 1, name: 'Property Expert', avatar: '/images/mod-1.jpg' },
      { id: 2, name: 'Legal Advisor', avatar: '/images/mod-2.jpg' }
    ],
    tags: ['property', 'real-estate', 'uk', 'investment', 'rentals'],
    verificationLevel: 'strict',
    beginnerFriendly: true,
    createdAt: '2024-01-15'
  };

  // Mock posts data
  const mockPosts = [
    {
      id: 1,
      type: 'ad',
      title: 'Luxury 2-Bed Apartment in Knightsbridge',
      description: 'Stunning apartment in prime London location with modern amenities and excellent transport links.',
      category: 'property',
      author: {
        name: 'Premium Properties Ltd',
        avatar: '/images/avatar-1.jpg',
        type: 'business',
        reputation: 4.9,
        verified: true
      },
      location: 'London, UK',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      images: ['/images/property-1.jpg', '/images/property-2.jpg'],
      price: '£2,500/month',
      type: 'rent',
      bedrooms: 2,
      bathrooms: 2,
      verified: true,
      community_verified: true,
      comments_count: 23,
      likes: 45
    },
    {
      id: 2,
      type: 'discussion',
      title: 'Best areas for property investment in 2024?',
      content: 'Looking for insights on which UK areas offer the best ROI for property investment this year. Considering factors like rental yields, capital appreciation, transport links, and regeneration projects. What are your predictions and experiences?',
      category: 'property',
      author: {
        name: 'Investment Analyst',
        avatar: '/images/avatar-2.jpg',
        type: 'individual',
        reputation: 4.7
      },
      location: 'Manchester, UK',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      tags: ['investment', 'property', 'roi', '2024'],
      verified: true,
      pinned: true,
      comments_count: 67,
      views: 234,
      participants: 18,
      helpful_count: 12
    },
    {
      id: 3,
      type: 'ad',
      title: 'Commercial Property for Sale - Birmingham City Centre',
      description: 'Prime commercial space perfect for retail or office use in Birmingham\'s business district.',
      category: 'property',
      author: {
        name: 'Commercial Real Estate',
        avatar: '/images/avatar-3.jpg',
        type: 'business',
        reputation: 4.6,
        verified: true
      },
      location: 'Birmingham, UK',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      images: ['/images/property-3.jpg'],
      price: '£850,000',
      type: 'sale',
      bedrooms: 0,
      bathrooms: 2,
      verified: true,
      community_verified: true,
      comments_count: 15,
      likes: 28
    }
  ];

  useEffect(() => {
    // Simulate loading community data
    const timer = setTimeout(() => {
      setCommunity(mockCommunity);
      setMemberCount(mockCommunity.stats.members);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [communityId]);

  const handleJoinCommunity = async () => {
    try {
      await communitiesAPI.joinCommunity(communityId);
      setIsMember(true);
      setMemberCount(prev => prev + 1);
      console.log('Joined community successfully');
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      await communitiesAPI.leaveCommunity(communityId);
      setIsMember(false);
      setMemberCount(prev => prev - 1);
      console.log('Left community successfully');
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handlePostInCommunity = () => {
    navigate(`/post?community=${communityId}&category=property`);
  };

  const handleStartDiscussion = () => {
    navigate(`/communities/${communityId}/start-discussion`);
  };

  const handleReport = () => {
    navigate(`/communities/${communityId}/report`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: community?.name,
        text: community?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Community link copied to clipboard!');
    }
  };

  const filteredPosts = mockPosts.filter(post => {
    if (filterType === 'ads') return post.type === 'ad';
    if (filterType === 'discussions') return post.type === 'discussion';
    return true;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.comments_count || 0) - (a.comments_count || 0);
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'top-rated':
        return (b.likes || 0) - (a.likes || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Community Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-b from-primary/20 to-primary/40">
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">{community.description}</p>
            </div>
          </div>
        </div>

        {/* Community Actions Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">{memberCount.toLocaleString()}</span>
                <span className="text-gray-600">members</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{community.stats.postsToday}</span>
                <span className="text-gray-600">posts today</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{community.stats.activeNow}</span>
                <span className="text-gray-600">active now</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isMember ? (
                <button
                  onClick={handleLeaveCommunity}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Leave Community
                </button>
              ) : (
                <button
                  onClick={handleJoinCommunity}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Join Community
                </button>
              )}
              
              <button
                onClick={handlePostInCommunity}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Post in Community
              </button>
              
              <button
                onClick={handleStartDiscussion}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Start Discussion
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleReport}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Rules & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">About Community</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{community.categoryLabel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Scope:</span>
                  <span className="font-medium">{community.scope}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{community.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Verification:</span>
                  <span className={`font-medium capitalize ${community.verificationLevel === 'strict' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {community.verificationLevel}
                  </span>
                </div>
                {community.beginnerFriendly && (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-600">Beginner Friendly</span>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {community.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Community Rules</h3>
              </div>
              <ul className="space-y-2 text-sm">
                {community.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-gray-600 mt-0.5">{index + 1}.</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Strict Moderation</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  This community has strict moderation to ensure quality discussions and listings.
                </p>
              </div>
            </div>

            {/* Moderators */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Moderators</h3>
              <div className="space-y-3">
                {community.moderators.map((moderator) => (
                  <div key={moderator.id} className="flex items-center space-x-3">
                    <img
                      src={moderator.avatar}
                      alt={moderator.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900">{moderator.name}</span>
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Community Moderator</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Tabs & Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex space-x-1 p-1">
                {['feed', 'ads', 'discussions', 'top-rated'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'feed' && (
                <div>
                  {/* Feed Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Sort:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        >
                          <option value="trending">Trending</option>
                          <option value="newest">Newest</option>
                          <option value="top-rated">Top Rated</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Filter:</span>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        >
                          <option value="all">All Posts</option>
                          <option value="ads">Ads Only</option>
                          <option value="discussions">Discussions Only</option>
                        </select>
                      </div>

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

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium">Advanced Filters</span>
                    </button>
                  </div>

                  {/* Posts Grid/List */}
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                    <AnimatePresence>
                      {sortedPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {post.type === 'ad' ? (
                            <AdThreadCard 
                              ad={post}
                              onDiscuss={(ad) => console.log('Discuss ad:', ad)}
                              onSave={(ad) => console.log('Save ad:', ad)}
                              onShare={(ad) => console.log('Share ad:', ad)}
                              onContact={(ad) => console.log('Contact ad:', ad)}
                            />
                          ) : (
                            <DiscussionThreadCard 
                              discussion={post}
                              onSave={(discussion) => console.log('Save discussion:', discussion)}
                              onShare={(discussion) => console.log('Share discussion:', discussion)}
                            />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {activeTab === 'ads' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedPosts.filter(post => post.type === 'ad').map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <AdThreadCard 
                        ad={post}
                        onDiscuss={(ad) => console.log('Discuss ad:', ad)}
                        onSave={(ad) => console.log('Save ad:', ad)}
                        onShare={(ad) => console.log('Share ad:', ad)}
                        onContact={(ad) => console.log('Contact ad:', ad)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="space-y-4">
                  {sortedPosts.filter(post => post.type === 'discussion').map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <DiscussionThreadCard 
                        discussion={post}
                        onSave={(discussion) => console.log('Save discussion:', discussion)}
                        onShare={(discussion) => console.log('Share discussion:', discussion)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'top-rated' && (
                <div className="space-y-4">
                  {sortedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0)).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {post.type === 'ad' ? (
                        <AdThreadCard 
                          ad={post}
                          onDiscuss={(ad) => console.log('Discuss ad:', ad)}
                          onSave={(ad) => console.log('Save ad:', ad)}
                          onShare={(ad) => console.log('Share ad:', ad)}
                          onContact={(ad) => console.log('Contact ad:', ad)}
                        />
                      ) : (
                        <DiscussionThreadCard 
                          discussion={post}
                          onSave={(discussion) => console.log('Save discussion:', discussion)}
                          onShare={(discussion) => console.log('Share discussion:', discussion)}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Similar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Members</span>
                  <span className="text-lg font-semibold text-gray-900">{memberCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Posts</span>
                  <span className="text-lg font-semibold text-gray-900">{community.stats.totalPosts.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posts Today</span>
                  <span className="text-lg font-semibold text-primary">{community.stats.postsToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Now</span>
                  <span className="text-lg font-semibold text-green-600">{community.stats.activeNow}</span>
                </div>
              </div>
            </div>

            {/* Similar Communities */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Similar Communities</h3>
              <div className="space-y-3">
                {[
                  { name: 'Property Investment - Global', members: '28k', category: 'funding' },
                  { name: 'London Property Network', members: '15k', category: 'property' },
                  { name: 'UK Landlords Association', members: '12k', category: 'property' },
                  { name: 'Real Estate Professionals', members: '8k', category: 'business' }
                ].map((similarCommunity, index) => (
                  <Link
                    key={index}
                    to={`/communities/${index + 100}`}
                    className="block p-3 border border-gray-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{similarCommunity.name}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>{similarCommunity.members} members</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
