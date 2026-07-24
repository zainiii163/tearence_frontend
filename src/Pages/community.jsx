import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaPlus, FaHeart, FaBookmark, FaShare, FaFlag, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { communitiesAPI } from '../api/communities';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import CommunityPostCard from '../Component/communities/CommunityPostCard';
import CommentSection from '../Component/communities/CommentSection';
import { useAuth } from '../context/AuthContext';

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, [id, activeTab]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [communityResponse, feedResponse] = await Promise.all([
        communitiesAPI.getCommunity(id),
        communitiesAPI.getCommunityPosts(id, { type: activeTab === 'feed' ? 'all' : activeTab })
      ]);
      setCommunity(communityResponse.data);
      setFeedData(feedResponse.data);
      setIsJoined(communityResponse.data?.is_joined || false);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    try {
      if (isJoined) {
        await communitiesAPI.leaveCommunity(id);
      } else {
        await communitiesAPI.joinCommunity(id);
      }
      setIsJoined(!isJoined);
      loadCommunityData();
    } catch (error) {
      console.error('Error joining/leaving community:', error);
    }
  };

  const tabs = [
    { id: 'feed', label: 'Feed', icon: FaUsers },
    { id: 'ads', label: 'Ads', icon: FaUsers },
    { id: 'discussions', label: 'Discussions', icon: FaUsers },
    { id: 'top-rated', label: 'Top Rated', icon: FaStar },
    { id: 'about', label: 'About', icon: FaInfoCircle },
  ];

  if (loading && !community) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavbar />
        <div className="page-container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavbar />
      
      {/* Enhanced Community Header */}
      {community && (
        <div className="border-b bg-gradient-to-b from-primary/5 to-card">
          {/* Cover Image */}
          {community.cover_image && (
            <div className="h-48 sm:h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${community.cover_image})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                    {community.category?.name || 'Community'}
                  </span>
                  {community.is_verified && (
                    <span className="px-2 py-1 rounded-full bg-green-500/20 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
                      <FaCheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                    {community.scope || 'Global'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="page-container py-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1">
                <Link to="/communities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
                  <FaArrowBack className="h-3 w-3" />
                  Back to Communities
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{community.name}</h1>
                <p className="text-muted-foreground mb-4">{community.description}</p>
                
                {/* Community Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{community.members_count?.toLocaleString() || '0'}</span>
                    <span className="text-muted-foreground">members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{community.posts_today || '0'}</span>
                    <span className="text-muted-foreground">posts today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{community.total_posts?.toLocaleString() || '0'}</span>
                    <span className="text-muted-foreground">total posts</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {community.category?.name || community.category}
                  </span>
                  <span className="text-muted-foreground">
                    {community.scope === 'Global' ? '🌍 Global' : community.scope === 'Region' ? `📍 ${community.region}` : '🏙️ City'}
                  </span>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div>
                    <span className="font-semibold">{community.members_count?.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">members</span>
                  </div>
                  <div>
                    <span className="font-semibold">{community.posts_today}</span>
                    <span className="text-muted-foreground ml-1">posts today</span>
                  </div>
                  <div>
                    <span className="font-semibold">{community.active_ads || 0}</span>
                    <span className="text-muted-foreground ml-1">active ads</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={handleJoinLeave}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 ${
                    isJoined
                      ? 'border border-input bg-background hover:bg-accent'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isJoined ? 'Leave Community' : 'Join Community'}
                </button>
                
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent h-10 px-4">
                  <FaUsers className="h-4 w-4 mr-2" />
                  Start Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Tabs */}
      {community && (
        <div className="border-b bg-gradient-to-b from-card to-muted/10 sticky top-16 z-10 shadow-sm">
          <div className="page-container">
            <nav className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5 -mb-px'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === 'feed' && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                      New
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="page-container py-6">
        
        {/* Rules Banner */}
        {activeTab !== 'about' && community && (
          <div className="mb-6 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Community Rules</h3>
                <p className="text-sm text-muted-foreground">
                  No scams, must include price/location for ads, be respectful to other members. 
                  Verified businesses only for certain posts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'about' && community && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">About {community.name}</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{community.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Community Guidelines</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Be respectful and constructive in all discussions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Include accurate information in all posts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Report suspicious activity to moderators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>No spam or self-promotion without permission</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Moderation</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1">
                        <FaShieldAlt className="h-3 w-3" />
                        Strict Moderation
                      </span>
                      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                        <FaCheckCircle className="h-3 w-3" />
                        Verified Businesses Only
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Community Level</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-600 flex items-center gap-1">
                        <FaGraduationCap className="h-3 w-3" />
                        Beginner-Friendly
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t text-sm text-muted-foreground">
                    <p>Created: {new Date(community.created_at).toLocaleDateString()}</p>
                    <p>Category: {community.category?.name || community.category}</p>
                    <p>Scope: {community.scope} {community.region && `(${community.region})`}</p>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab === 'feed' || activeTab === 'ads' || activeTab === 'discussions' || activeTab === 'top-rated') && (
              <div className="space-y-4">
                {feedData?.items && feedData.items.length > 0 ? (
                  feedData.items.map((item) => {
                    if (item.type === 'ad' || item.ad_id) {
                      return <AdThreadCard key={item.id} ad={item} />;
                    } else {
                      return <DiscussionThreadCard key={item.id} discussion={item} />;
                    }
                  })
                ) : (
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <FaUsers className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">No posts yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Be the first to start a discussion in this community!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
