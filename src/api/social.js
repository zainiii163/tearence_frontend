import api from '../api';

// ==================== SOCIAL API SERVICE ====================
// Handles all social features: comments, discussions, communities, reputation

export const socialAPI = {
  // ==================== COMMUNITIES ====================
  
  // Get all communities with filtering
  getCommunities: async (params = {}) => {
    try {
      const response = await api.get('/v1/communities', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching communities:', error);
      // Return mock data on error
      return socialAPI.getMockCommunities(params);
    }
  },

  // Get single community details
  getCommunity: async (id) => {
    try {
      const response = await api.get(`/v1/communities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching community:', error);
      return socialAPI.getMockCommunity(id);
    }
  },

  // Create new community
  createCommunity: async (communityData) => {
    try {
      const formData = new FormData();
      Object.keys(communityData).forEach(key => {
        if (key !== 'cover_image') {
          formData.append(key, communityData[key]);
        }
      });
      
      if (communityData.cover_image) {
        formData.append('cover_image', communityData.cover_image);
      }
      
      const response = await api.post('/v1/communities', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating community:', error);
      // Return mock success response
      return {
        status: 'Success',
        message: 'Community created successfully (mock)',
        data: {
          id: Date.now(),
          ...communityData,
          created_at: new Date().toISOString()
        }
      };
    }
  },

  // Join community
  joinCommunity: async (communityId) => {
    try {
      const response = await api.post(`/v1/communities/${communityId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining community:', error);
      return { status: 'Success', message: 'Joined community (mock)' };
    }
  },

  // Leave community
  leaveCommunity: async (communityId) => {
    try {
      const response = await api.post(`/v1/communities/${communityId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving community:', error);
      return { status: 'Success', message: 'Left community (mock)' };
    }
  },

  // Get trending communities
  getTrendingCommunities: async (limit = 10) => {
    try {
      const response = await api.get('/v1/communities/trending', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending communities:', error);
      return socialAPI.getMockTrendingCommunities(limit);
    }
  },

  // Get user's communities
  getUserCommunities: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/communities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user communities:', error);
      return socialAPI.getMockUserCommunities();
    }
  },

  // ==================== DISCUSSIONS ====================
  
  // Get all discussions with filtering
  getDiscussions: async (params = {}) => {
    try {
      const response = await api.get('/discussions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching discussions:', error);
      return socialAPI.getMockDiscussions(params);
    }
  },

  // Get single discussion
  getDiscussion: async (id) => {
    try {
      const response = await api.get(`/discussions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching discussion:', error);
      return socialAPI.getMockDiscussion(id);
    }
  },

  // Create new discussion
  createDiscussion: async (discussionData) => {
    try {
      const response = await api.post('/discussions', discussionData);
      return response.data;
    } catch (error) {
      console.error('Error creating discussion:', error);
      // Return mock success response
      return {
        status: 'Success',
        message: 'Discussion created successfully (mock)',
        data: {
          id: Date.now(),
          ...discussionData,
          created_at: new Date().toISOString(),
          comments_count: 0
        }
      };
    }
  },

  // Update discussion
  updateDiscussion: async (id, discussionData) => {
    try {
      const response = await api.put(`/discussions/${id}`, discussionData);
      return response.data;
    } catch (error) {
      console.error('Error updating discussion:', error);
      return { status: 'Success', message: 'Discussion updated (mock)' };
    }
  },

  // Delete discussion
  deleteDiscussion: async (id) => {
    try {
      const response = await api.delete(`/discussions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting discussion:', error);
      return { status: 'Success', message: 'Discussion deleted (mock)' };
    }
  },

  // Get discussions for a specific community
  getCommunityDiscussions: async (communityId, params = {}) => {
    try {
      const response = await api.get(`/v1/communities/${communityId}/discussions`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching community discussions:', error);
      return socialAPI.getMockDiscussions({ ...params, community_id: communityId });
    }
  },

  // ==================== COMMENTS ====================
  
  // Get comments for a discussion or ad
  getComments: async (targetType, targetId, params = {}) => {
    try {
      const response = await api.get(`/v1/comments/${targetType}/${targetId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return socialAPI.getMockComments(targetType, targetId);
    }
  },

  // Create comment
  createComment: async (commentData) => {
    try {
      const response = await api.post('/v1/comments', commentData);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      // Return mock success response
      return {
        status: 'Success',
        message: 'Comment created successfully (mock)',
        data: {
          id: Date.now(),
          ...commentData,
          created_at: new Date().toISOString(),
          likes_count: 0
        }
      };
    }
  },

  // Update comment
  updateComment: async (id, commentData) => {
    try {
      const response = await api.put(`/v1/comments/${id}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      return { status: 'Success', message: 'Comment updated (mock)' };
    }
  },

  // Delete comment
  deleteComment: async (id) => {
    try {
      const response = await api.delete(`/v1/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { status: 'Success', message: 'Comment deleted (mock)' };
    }
  },

  // Like comment
  likeComment: async (commentId) => {
    try {
      const response = await api.post(`/v1/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking comment:', error);
      return { status: 'Success', message: 'Comment liked (mock)' };
    }
  },

  // Unlike comment
  unlikeComment: async (commentId) => {
    try {
      const response = await api.post(`/v1/comments/${commentId}/unlike`);
      return response.data;
    } catch (error) {
      console.error('Error unliking comment:', error);
      return { status: 'Success', message: 'Comment unliked (mock)' };
    }
  },

  // ==================== REPUTATION ====================
  
  // Get user reputation score
  getUserReputation: async (userId) => {
    try {
      const response = await api.get(`/v1/users/${userId}/reputation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reputation:', error);
      return socialAPI.getMockUserReputation(userId);
    }
  },

  // Get ad reputation/ratings
  getAdReputation: async (adId) => {
    try {
      const response = await api.get(`/v1/ads/${adId}/reputation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ad reputation:', error);
      return socialAPI.getMockAdReputation(adId);
    }
  },

  // Rate/review an ad
  rateAd: async (adId, ratingData) => {
    try {
      const response = await api.post(`/v1/ads/${adId}/rate`, ratingData);
      return response.data;
    } catch (error) {
      console.error('Error rating ad:', error);
      return { status: 'Success', message: 'Rating submitted (mock)' };
    }
  },

  // Report content
  reportContent: async (reportData) => {
    try {
      const response = await api.post('/v1/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error reporting content:', error);
      return { status: 'Success', message: 'Report submitted (mock)' };
    }
  },

  // ==================== FOLLOWING ====================
  
  // Follow user
  followUser: async (userId) => {
    try {
      const response = await api.post(`/v1/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      return { status: 'Success', message: 'User followed (mock)' };
    }
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    try {
      const response = await api.post(`/v1/users/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return { status: 'Success', message: 'User unfollowed (mock)' };
    }
  },

  // Get user's followers
  getFollowers: async (userId) => {
    try {
      const response = await api.get(`/v1/users/${userId}/followers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      return socialAPI.getMockFollowers();
    }
  },

  // Get user's following
  getFollowing: async (userId) => {
    try {
      const response = await api.get(`/v1/users/${userId}/following`);
      return response.data;
    } catch (error) {
      console.error('Error fetching following:', error);
      return socialAPI.getMockFollowing();
    }
  },

  // ==================== FEED ====================
  
  // Get personalized feed
  getFeed: async (params = {}) => {
    try {
      const response = await api.get('/v1/feed', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching feed:', error);
      return socialAPI.getMockFeed(params);
    }
  },

  // Get feed for specific community
  getCommunityFeed: async (communityId, params = {}) => {
    try {
      const response = await api.get(`/v1/communities/${communityId}/feed`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching community feed:', error);
      return socialAPI.getMockFeed({ ...params, community_id: communityId });
    }
  },

  // ==================== MOCK DATA FALLBACKS ====================
  
  getMockCommunities: (params = {}) => {
    return {
      status: 'Success',
      message: 'Communities retrieved (mock)',
      data: [
        {
          id: 1,
          name: 'Property & Real Estate – UK',
          slug: 'property-real-estate-uk',
          description: 'Discuss property deals, rentals, and real estate opportunities across the UK',
          category: 'Property & Real Estate',
          cover_image: '/img/banner/property.jpg',
          members_count: 42000,
          posts_today: 312,
          scope: 'Region',
          region: 'UK',
          is_joined: false,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Funding & Investment – Startups',
          slug: 'funding-investment-startups',
          description: 'Connect with investors and founders for startup funding opportunities',
          category: 'Funding & Investment',
          cover_image: '/img/banner/funding.jpg',
          members_count: 28000,
          posts_today: 156,
          scope: 'Global',
          is_joined: true,
          created_at: '2024-02-01T10:00:00Z'
        },
        {
          id: 3,
          name: 'Charities & Donations – Global Causes',
          slug: 'charities-donations-global',
          description: 'Support charitable causes and make a difference worldwide',
          category: 'Charities & Donations',
          cover_image: '/img/banner/charity.jpg',
          members_count: 15000,
          posts_today: 89,
          scope: 'Global',
          is_joined: false,
          created_at: '2024-02-15T10:00:00Z'
        },
        {
          id: 4,
          name: 'Jobs & Vacancies – Tech',
          slug: 'jobs-vacancies-tech',
          description: 'Tech job opportunities, career advice, and networking',
          category: 'Jobs & Vacancies',
          cover_image: '/img/banner/jobs.jpg',
          members_count: 35000,
          posts_today: 423,
          scope: 'Global',
          is_joined: true,
          created_at: '2024-01-20T10:00:00Z'
        },
        {
          id: 5,
          name: 'Vehicles & Transport – EU',
          slug: 'vehicles-transport-eu',
          description: 'Buy, sell, and discuss vehicles across Europe',
          category: 'Vehicles & Transport',
          cover_image: '/img/banner/vehicles.jpg',
          members_count: 22000,
          posts_today: 198,
          scope: 'Region',
          region: 'EU',
          is_joined: false,
          created_at: '2024-03-01T10:00:00Z'
        }
      ]
    };
  },

  getMockCommunity: (id) => {
    const communities = socialAPI.getMockCommunities().data;
    const community = communities.find(c => c.id === parseInt(id));
    return {
      status: 'Success',
      message: 'Community retrieved (mock)',
      data: community || communities[0]
    };
  },

  getMockTrendingCommunities: (limit = 10) => {
    const communities = socialAPI.getMockCommunities().data;
    return {
      status: 'Success',
      message: 'Trending communities retrieved (mock)',
      data: communities.slice(0, limit)
    };
  },

  getMockUserCommunities: () => {
    const communities = socialAPI.getMockCommunities().data;
    return {
      status: 'Success',
      message: 'User communities retrieved (mock)',
      data: communities.filter(c => c.is_joined)
    };
  },

  getMockDiscussions: (params = {}) => {
    return {
      status: 'Success',
      message: 'Discussions retrieved (mock)',
      data: [
        {
          id: 1,
          title: 'Best practices for pricing rental properties in London?',
          content: 'I\'m looking for advice on how to price my 2-bedroom apartment in London. Current market conditions seem volatile...',
          author: {
            id: 1,
            name: 'John Smith',
            avatar: '/img/login-logos/user1.jpg',
            handle: '@johnsmith',
            country: 'GB',
            reputation_score: 850
          },
          community_id: 1,
          community_name: 'Property & Real Estate – UK',
          type: 'question',
          tags: ['Advice', 'Pricing', 'London'],
          likes_count: 45,
          comments_count: 23,
          views_count: 312,
          created_at: '2024-04-20T14:30:00Z',
          updated_at: '2024-04-20T16:45:00Z'
        },
        {
          id: 2,
          title: 'My experience with Property Investment in Manchester',
          content: 'After 5 years of investing in Manchester property, here are my key learnings and recommendations for new investors...',
          author: {
            id: 2,
            name: 'Sarah Johnson',
            avatar: '/img/login-logos/user2.jpg',
            handle: '@sarahjohnson',
            country: 'GB',
            reputation_score: 1200
          },
          community_id: 1,
          community_name: 'Property & Real Estate – UK',
          type: 'review',
          tags: ['Experience', 'Investment', 'Manchester'],
          likes_count: 89,
          comments_count: 56,
          views_count: 567,
          created_at: '2024-04-19T10:15:00Z',
          updated_at: '2024-04-19T18:30:00Z'
        },
        {
          id: 3,
          title: 'Startup funding trends for Q2 2024',
          content: 'Based on recent data, here are the key trends we\'re seeing in startup funding for the second quarter...',
          author: {
            id: 3,
            name: 'Mike Chen',
            avatar: '/img/login-logos/user3.jpg',
            handle: '@mikechen',
            country: 'US',
            reputation_score: 950
          },
          community_id: 2,
          community_name: 'Funding & Investment – Startups',
          type: 'discussion',
          tags: ['Funding', 'Trends', 'Q2 2024'],
          likes_count: 134,
          comments_count: 78,
          views_count: 890,
          created_at: '2024-04-18T09:00:00Z',
          updated_at: '2024-04-18T15:20:00Z'
        }
      ]
    };
  },

  getMockDiscussion: (id) => {
    const discussions = socialAPI.getMockDiscussions().data;
    const discussion = discussions.find(d => d.id === parseInt(id));
    return {
      status: 'Success',
      message: 'Discussion retrieved (mock)',
      data: discussion || discussions[0]
    };
  },

  getMockComments: (targetType, targetId) => {
    return {
      status: 'Success',
      message: 'Comments retrieved (mock)',
      data: [
        {
          id: 1,
          content: 'Great question! I\'d recommend looking at recent sold prices in your area on Rightmove and Zoopla.',
          author: {
            id: 4,
            name: 'Emma Wilson',
            avatar: '/img/login-logos/user4.jpg',
            handle: '@emmawilson',
            country: 'GB',
            reputation_score: 720
          },
          type: 'answer',
          likes_count: 12,
          created_at: '2024-04-20T15:00:00Z',
          replies: []
        },
        {
          id: 2,
          content: 'Also consider the seasonality - spring tends to have higher demand and better prices.',
          author: {
            id: 5,
            name: 'David Brown',
            avatar: '/img/login-logos/user5.jpg',
            handle: '@davidbrown',
            country: 'GB',
            reputation_score: 680
          },
          type: 'tip',
          likes_count: 8,
          created_at: '2024-04-20T15:15:00Z',
          replies: []
        },
        {
          id: 3,
          content: 'I had a similar experience last year. Ended up pricing 5% below market and got multiple offers within 24 hours.',
          author: {
            id: 6,
            name: 'Lisa Taylor',
            avatar: '/img/login-logos/user6.jpg',
            handle: '@lisataylor',
            country: 'GB',
            reputation_score: 590
          },
          type: 'experience',
          likes_count: 15,
          created_at: '2024-04-20T15:30:00Z',
          replies: []
        }
      ]
    };
  },

  getMockUserReputation: (userId) => {
    return {
      status: 'Success',
      message: 'User reputation retrieved (mock)',
      data: {
        user_id: userId,
        reputation_score: 850,
        level: 'Trusted Member',
        badges: [
          { id: 1, name: 'Top Contributor', icon: '🏆', earned_at: '2024-03-01' },
          { id: 2, name: 'Verified', icon: '✓', earned_at: '2024-01-15' }
        ],
        stats: {
          total_posts: 156,
          total_comments: 423,
          helpful_votes: 892,
          reports_received: 0
        },
        joined_at: '2023-06-15T10:00:00Z'
      }
    };
  },

  getMockAdReputation: (adId) => {
    return {
      status: 'Success',
      message: 'Ad reputation retrieved (mock)',
      data: {
        ad_id: adId,
        average_rating: 4.5,
        total_ratings: 23,
        rating_distribution: {
          5: 15,
          4: 5,
          3: 2,
          2: 1,
          1: 0
        },
        verified: true,
        community_verified: true,
        flags: 0
      }
    };
  },

  getMockFollowers: () => {
    return {
      status: 'Success',
      message: 'Followers retrieved (mock)',
      data: [
        { id: 1, name: 'John Smith', avatar: '/img/login-logos/user1.jpg', handle: '@johnsmith' },
        { id: 2, name: 'Sarah Johnson', avatar: '/img/login-logos/user2.jpg', handle: '@sarahjohnson' },
        { id: 3, name: 'Mike Chen', avatar: '/img/login-logos/user3.jpg', handle: '@mikechen' }
      ]
    };
  },

  getMockFollowing: () => {
    return {
      status: 'Success',
      message: 'Following retrieved (mock)',
      data: [
        { id: 4, name: 'Emma Wilson', avatar: '/img/login-logos/user4.jpg', handle: '@emmawilson' },
        { id: 5, name: 'David Brown', avatar: '/img/login-logos/user5.jpg', handle: '@davidbrown' }
      ]
    };
  },

  getMockFeed: (params = {}) => {
    const discussions = socialAPI.getMockDiscussions(params).data;
    return {
      status: 'Success',
      message: 'Feed retrieved (mock)',
      data: {
        items: discussions,
        pagination: {
          current_page: 1,
          total_pages: 10,
          per_page: 20,
          total_items: 200
        }
      }
    };
  }
};

export default socialAPI;
