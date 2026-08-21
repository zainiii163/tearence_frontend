import api from '../api';

// ==================== COMMUNITIES API SERVICE ====================
// Handles all community-related API calls

export const communitiesAPI = {
  // ==================== COMMUNITIES ====================
  
  // Get all communities with filtering
  getCommunities: async (params = {}) => {
    try {
      const response = await api.get('/communities', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
  },

  // Get trending communities
  getTrendingCommunities: async (limit = 10) => {
    try {
      const response = await api.get('/communities/trending', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending communities:', error);
      throw error;
    }
  },

  // Get featured communities
  getFeaturedCommunities: async (limit = 10) => {
    try {
      const response = await api.get('/communities/featured', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured communities:', error);
      throw error;
    }
  },

  // Get single community details
  getCommunity: async (id) => {
    try {
      const response = await api.get(`/communities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching community:', error);
      throw error;
    }
  },

  /** Social Hub page linked to a customer_business id */
  getBusinessCommunity: async (businessId) => {
    const response = await api.get(`/communities/business/${businessId}`);
    return response.data;
  },

  /** Create or return Social Hub page for a business the user owns */
  ensureBusinessCommunity: async (businessId) => {
    const response = await api.post(`/communities/business/${businessId}/ensure`);
    return response.data;
  },

  /** Business Social Hub pages (owner list, or all for admin) */
  getBusinessPages: async (params = {}) => {
    const response = await api.get('/communities/business-pages', { params });
    return response.data;
  },

  // Create new community
  createCommunity: async (communityData) => {
    try {
      let body = communityData;
      if (!(communityData instanceof FormData)) {
        body = new FormData();
        Object.keys(communityData || {}).forEach((key) => {
          const value = communityData[key];
          if (value === undefined || value === null) return;
          if (key === 'cover_image' && !(value instanceof File) && !(value instanceof Blob)) {
            if (value !== '') body.append(key, value);
            return;
          }
          body.append(key, value);
        });
      }

      const response = await api.post('/communities', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  },

  // Upload photo/video for a community post
  uploadPostMedia: async (file, type = 'media') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await api.post('/community-posts/upload-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update community
  updateCommunity: async (id, communityData) => {
    try {
      const response = await api.put(`/communities/${id}`, communityData);
      return response.data;
    } catch (error) {
      console.error('Error updating community:', error);
      throw error;
    }
  },

  // Delete community
  deleteCommunity: async (id) => {
    try {
      const response = await api.delete(`/communities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting community:', error);
      throw error;
    }
  },

  // Join community
  joinCommunity: async (communityId) => {
    try {
      const response = await api.post(`/communities/${communityId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  },

  // Leave community
  leaveCommunity: async (communityId) => {
    try {
      const response = await api.post(`/communities/${communityId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  },

  // Follow community
  followCommunity: async (communityId) => {
    try {
      const response = await api.post(`/communities/${communityId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Error following community:', error);
      throw error;
    }
  },

  // Unfollow community
  unfollowCommunity: async (communityId) => {
    try {
      const response = await api.post(`/communities/${communityId}/unfollow`);
      return response.data;
    } catch (error) {
      console.error('Error unfollowing community:', error);
      throw error;
    }
  },

  // Get community members
  getCommunityMembers: async (communityId) => {
    try {
      const response = await api.get(`/communities/${communityId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching community members:', error);
      throw error;
    }
  },

  // Get user's communities
  getUserCommunities: async () => {
    try {
      const response = await api.get('/communities/my-communities');
      return response.data;
    } catch (error) {
      console.error('Error fetching user communities:', error);
      throw error;
    }
  },

  // Get communities by category
  getCommunitiesByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/communities/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching communities by category:', error);
      throw error;
    }
  },

  // ==================== COMMUNITY POSTS ====================
  
  // Get community posts feed
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/community-posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get "For You" feed
  getForYouFeed: async (params = {}) => {
    try {
      const response = await api.get('/community-posts/for-you', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching for you feed:', error);
      throw error;
    }
  },

  // Get "Following" feed
  getFollowingFeed: async (params = {}) => {
    try {
      const response = await api.get('/community-posts/following', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching following feed:', error);
      throw error;
    }
  },

  // Get "Local" feed
  getLocalFeed: async (params = {}) => {
    try {
      const response = await api.get('/community-posts/local', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching local feed:', error);
      throw error;
    }
  },

  // Get single post
  getPost: async (id) => {
    try {
      const response = await api.get(`/community-posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await api.post('/community-posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update post
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/community-posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/community-posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // React to post
  reactToPost: async (postId, reactionType) => {
    try {
      const response = await api.post(`/community-posts/${postId}/react`, { reaction_type: reactionType });
      return response.data;
    } catch (error) {
      console.error('Error reacting to post:', error);
      throw error;
    }
  },

  // Vote on a poll post
  voteOnPoll: async (postId, optionId) => {
    const response = await api.post(`/community-posts/${postId}/vote`, {
      option_id: optionId,
    });
    return response.data;
  },

  // Save post
  savePost: async (postId) => {
    try {
      const response = await api.post(`/community-posts/${postId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  },

  // Unsave post
  unsavePost: async (postId) => {
    try {
      const response = await api.delete(`/community-posts/${postId}/save`);
      return response.data;
    } catch (error) {
      // Fallback: POST toggles save/unsave
      try {
        const response = await api.post(`/community-posts/${postId}/save`);
        return response.data;
      } catch (e) {
        console.error('Error unsaving post:', e);
        throw e;
      }
    }
  },

  // Share post (records share + returns URL)
  sharePost: async (postId) => {
    const response = await api.post(`/community-posts/${postId}/share`);
    return response.data;
  },

  saveDiscussion: async (postId) => {
    const response = await api.post(`/community-posts/${postId}/save`);
    return response.data;
  },
  unsaveDiscussion: async (postId) => {
    try {
      const response = await api.delete(`/community-posts/${postId}/save`);
      return response.data;
    } catch (error) {
      const response = await api.post(`/community-posts/${postId}/save`);
      return response.data;
    }
  },
  addCommentToDiscussion: async (postId, payload) => {
    const response = await api.post('/comments', {
      post_id: postId,
      content: typeof payload === 'string' ? payload : payload.content,
      comment_type: payload?.type || payload?.comment_type || 'general',
    });
    return response.data;
  },

  // Search communities + posts + businesses (company → business page)
  searchAll: async (query, { limit = 8 } = {}) => {
    const q = String(query || '').trim();
    if (q.length < 2) return { communities: [], posts: [], businesses: [] };
    const [communitiesRes, postsRes, businessesRes] = await Promise.all([
      api.get('/communities', { params: { search: q, per_page: limit } }).catch(() => null),
      api.get('/community-posts', { params: { search: q, per_page: limit, sort: 'newest' } }).catch(() => null),
      api.get('/business', { params: { search: q, per_page: limit } }).catch(() => null),
    ]);
    const cBody = communitiesRes?.data;
    const pBody = postsRes?.data;
    const bBody = businessesRes?.data;
    const communities =
      cBody?.data?.data || (Array.isArray(cBody?.data) ? cBody.data : []) || [];
    const postsRoot = pBody?.data ?? pBody;
    const posts = Array.isArray(postsRoot?.data)
      ? postsRoot.data
      : Array.isArray(postsRoot)
        ? postsRoot
        : [];
    const businessesRoot = bBody?.data ?? bBody;
    const businessesRaw = Array.isArray(businessesRoot?.data)
      ? businessesRoot.data
      : Array.isArray(businessesRoot?.items)
        ? businessesRoot.items
        : Array.isArray(businessesRoot)
          ? businessesRoot
          : [];
    const businesses = businessesRaw.slice(0, limit);
    return { communities, posts, businesses };
  },

  // Get saved posts
  getSavedPosts: async (params = {}) => {
    try {
      const response = await api.get('/community-posts/saved', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      throw error;
    }
  },

  // Get user's posts
  getUserPosts: async (params = {}) => {
    try {
      const response = await api.get('/community-posts/my-posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Pin post
  pinPost: async (postId) => {
    try {
      const response = await api.post(`/community-posts/${postId}/pin`);
      return response.data;
    } catch (error) {
      console.error('Error pinning post:', error);
      throw error;
    }
  },

  // Flag post
  flagPost: async (postId, reason) => {
    try {
      const response = await api.post(`/community-posts/${postId}/flag`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error flagging post:', error);
      throw error;
    }
  },

  // ==================== COMMENTS ====================
  
  // Get comments for a post
  getComments: async (postId, params = {}) => {
    try {
      const response = await api.get(`/comments/post/${postId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Get single comment
  getComment: async (id) => {
    try {
      const response = await api.get(`/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    }
  },

  // Create comment
  createComment: async (commentData) => {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Update comment
  updateComment: async (id, commentData) => {
    try {
      const response = await api.put(`/comments/${id}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (id) => {
    try {
      const response = await api.delete(`/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // React to comment
  reactToComment: async (commentId, reactionType) => {
    try {
      const response = await api.post(`/comments/${commentId}/react`, { reaction_type: reactionType });
      return response.data;
    } catch (error) {
      console.error('Error reacting to comment:', error);
      throw error;
    }
  },

  // Get comment replies
  getCommentReplies: async (commentId) => {
    try {
      const response = await api.get(`/comments/${commentId}/replies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comment replies:', error);
      throw error;
    }
  },

  // Flag comment
  flagComment: async (commentId, reason) => {
    try {
      const response = await api.post(`/comments/${commentId}/flag`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error flagging comment:', error);
      throw error;
    }
  },

  // Hide comment
  hideComment: async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/hide`);
      return response.data;
    } catch (error) {
      console.error('Error hiding comment:', error);
      throw error;
    }
  }
};

export default communitiesAPI;
