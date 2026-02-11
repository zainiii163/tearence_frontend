import api from '../api';

/**
 * Notification Service
 * 
 * Provides methods to manage user notifications.
 * Matches common notification API patterns.
 */

const notificationService = {
  // Get all notifications for the authenticated user
  getNotifications: async (params = {}) => {
    const { page = 1, per_page = 20, type, read } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });
    
    if (type) queryParams.append('type', type);
    if (read !== undefined) queryParams.append('read', read.toString());
    
    const response = await api.get(`/v1/notifications?${queryParams.toString()}`);
    return response.data;
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    const response = await api.get('/v1/notifications/unread-count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/v1/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (notificationIds) => {
    const response = await api.put('/v1/notifications/mark-read', { notification_ids: notificationIds });
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/v1/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/v1/notifications/${notificationId}`);
    return response.data;
  },

  // Delete multiple notifications
  deleteMultipleNotifications: async (notificationIds) => {
    const response = await api.delete('/v1/notifications/bulk-delete', { 
      data: { notification_ids: notificationIds }
    });
    return response.data;
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    const response = await api.delete('/v1/notifications/delete-all');
    return response.data;
  },

  // Get notification settings
  getNotificationSettings: async () => {
    const response = await api.get('/v1/notifications/settings');
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (settings) => {
    const response = await api.put('/v1/notifications/settings', settings);
    return response.data;
  },

  // Subscribe to push notifications
  subscribeToPush: async (subscriptionData) => {
    const response = await api.post('/v1/notifications/push/subscribe', subscriptionData);
    return response.data;
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: async () => {
    const response = await api.post('/v1/notifications/push/unsubscribe');
    return response.data;
  },

  // Get notification preferences by type
  getNotificationPreferences: async () => {
    const response = await api.get('/v1/notifications/preferences');
    return response.data;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/v1/notifications/preferences', preferences);
    return response.data;
  },

  // Test notification (for development)
  testNotification: async (type = 'info') => {
    const response = await api.post('/v1/notifications/test', { type });
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async () => {
    const response = await api.get('/v1/notifications/stats');
    return response.data;
  },

  // Archive notification
  archiveNotification: async (notificationId) => {
    const response = await api.put(`/v1/notifications/${notificationId}/archive`);
    return response.data;
  },

  // Get archived notifications
  getArchivedNotifications: async (params = {}) => {
    const { page = 1, per_page = 20 } = params;
    const response = await api.get(`/v1/notifications/archived?page=${page}&per_page=${per_page}`);
    return response.data;
  },

  // Restore archived notification
  restoreNotification: async (notificationId) => {
    const response = await api.put(`/v1/notifications/${notificationId}/restore`);
    return response.data;
  },
};

export default notificationService;
