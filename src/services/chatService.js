import api from '../api';

const CHAT_BASE_URL = '/v1/chat';

export const chatService = {
  // Get all conversations for the authenticated user
  getConversations: async () => {
    try {
      const response = await api.get(`${CHAT_BASE_URL}/conversations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Start a new conversation
  startConversation: async (data) => {
    try {
      const response = await api.post(`${CHAT_BASE_URL}/conversations`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId, page = 1, perPage = 50) => {
    try {
      const response = await api.get(
        `${CHAT_BASE_URL}/conversations/${conversationId}/messages`,
        { params: { page, per_page: perPage } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send a message
  sendMessage: async (conversationId, messageData) => {
    try {
      const response = await api.post(
        `${CHAT_BASE_URL}/conversations/${conversationId}/messages`,
        messageData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Close a conversation
  closeConversation: async (conversationId) => {
    try {
      const response = await api.put(
        `${CHAT_BASE_URL}/conversations/${conversationId}/close`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get unread messages count
  getUnreadCount: async () => {
    try {
      const response = await api.get(`${CHAT_BASE_URL}/unread-count`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default chatService;