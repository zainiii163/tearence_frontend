import api from '../api';

// ==================== FRIENDSHIPS API SERVICE ====================
// Handles Social Hub friend requests (send/accept/decline) and friend lists

export const friendshipsAPI = {
  // List accepted friends
  getFriends: async () => {
    const response = await api.get('/friendships/friends');
    return response.data;
  },

  // List incoming pending friend requests
  getIncoming: async () => {
    const response = await api.get('/friendships/incoming');
    return response.data;
  },

  // List outgoing pending friend requests
  getOutgoing: async () => {
    const response = await api.get('/friendships/outgoing');
    return response.data;
  },

  // Get friendship status between current user and another user
  getStatus: async (userId) => {
    const response = await api.get(`/friendships/status/${userId}`);
    return response.data;
  },

  // Send a friend request to a user
  sendRequest: async (userId) => {
    const response = await api.post(`/friendships/send/${userId}`);
    return response.data;
  },

  // Accept an incoming friend request
  acceptRequest: async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/accept`);
    return response.data;
  },

  // Decline an incoming friend request
  declineRequest: async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/decline`);
    return response.data;
  },

  // Cancel an outgoing friend request
  cancelRequest: async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/cancel`);
    return response.data;
  },

  // Remove a friend / break friendship
  removeFriend: async (friendshipId) => {
    const response = await api.delete(`/friendships/${friendshipId}`);
    return response.data;
  },
};

export default friendshipsAPI;
