import React, { useState, useEffect } from 'react';
import { FaFire, FaHashtag, FaChevronRight, FaStar, FaTrophy, FaBolt } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';

const CommunitiesRightRail = () => {
  const [trendingCommunities, setTrendingCommunities] = useState([]);
  const [hotTopics, setHotTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingData();
  }, []);

  const loadTrendingData = async () => {
    try {
      const [communitiesResponse] = await Promise.all([
        communitiesAPI.getTrendingCommunities(5)
      ]);
      setTrendingCommunities(communitiesResponse.data?.data || []);
      
      // Mock hot topics
      setHotTopics([
        { id: 1, name: '#StartupFunding', count: 1250 },
        { id: 2, name: '#StudentHousing', count: 890 },
        { id: 3, name: '#UsedCarsUK', count: 756 },
        { id: 4, name: '#CharityDrives', count: 543 },
        { id: 5, name: '#RemoteJobs', count: 432 },
      ]);
    } catch (error) {
      console.error('Error loading trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      await communitiesAPI.joinCommunity(communityId);
      // Refresh the list
      loadTrendingData();
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleHotTopicClick = (topic) => {
    // This would filter the feed by the selected hashtag
    // For now, we'll just log it - in a real implementation, this would update the feed
    console.log(`Filtering by topic: ${topic.name}`);
    // TODO: Implement hashtag filtering in the main feed
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sticky top-20">
      
      {/* Trending Communities */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <FaFire className="h-4 w-4 text-orange-500" />
          <h3 className="font-semibold">Trending Communities</h3>
        </div>
        
        <div className="space-y-3">
          {trendingCommunities.map((community) => (
            <div
              key={community.id}
              className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{community.name}</h4>
                  <p className="text-xs text-muted-foreground">{community.category?.name || community.category}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {community.members_count?.toLocaleString()} members • {community.posts_today} posts today
                  </p>
                </div>
                {!community.is_joined && (
                  <button
                    onClick={() => handleJoinCommunity(community.id)}
                    className="flex-shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-7 px-2"
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 w-full text-sm text-primary hover:underline">
          View all communities
        </button>
      </div>

      {/* Hot Topics */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaHashtag className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold">Trending Topics</h3>
          </div>
          <button className="text-xs text-primary hover:underline">
            View all
          </button>
        </div>
        
        <div className="space-y-2">
          {hotTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleHotTopicClick(topic)}
              className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-accent/50 to-accent/30 hover:from-accent/70 hover:to-accent/50 text-sm transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-semibold">{topic.name}</span>
                <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                  {topic.count.toLocaleString()} posts
                </span>
              </div>
              <FaChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Popular in your communities:</p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">#PropertyDeals</span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">#StartupFunding</span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">#RemoteWork</span>
          </div>
        </div>
      </div>

      {/* Featured Campaigns & Ads */}
      <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-card text-card-foreground shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaStar className="h-4 w-4 text-yellow-500" />
            <h3 className="font-semibold">Featured Campaigns</h3>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
            Sponsored
          </span>
        </div>
        
        <div className="space-y-3">
          {/* Premium Ad Placement */}
          <div className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <FaTrophy className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-yellow-700">PREMIUM</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">HOT</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">Luxury Apartments - City Centre</h4>
                <p className="text-xs text-muted-foreground mb-2">Premium 2-bed apartments with city views</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">£2,500/month</span>
                  <span className="text-xs text-muted-foreground">London, UK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promoted Business */}
          <div className="border border-blue-200 bg-gradient-to-r from-blue-50 to-transparent rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <FaBolt className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700">PROMOTED</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">VERIFIED</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">Tech Startup - Seeking Investors</h4>
                <p className="text-xs text-muted-foreground mb-2">AI-powered logistics platform</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">£500K Series A</span>
                  <span className="text-xs text-muted-foreground">Manchester, UK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Ad */}
          <div className="border border-purple-200 bg-gradient-to-r from-purple-50 to-transparent rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                <FaStar className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-purple-700">FEATURED</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">LIMITED</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">Charity Fundraising Event</h4>
                <p className="text-xs text-muted-foreground mb-2">Support local education initiatives</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">Goal: £50K</span>
                  <span className="text-xs text-muted-foreground">Birmingham, UK</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Promote your listing</p>
            <button className="text-xs text-primary hover:underline font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommunitiesRightRail;
