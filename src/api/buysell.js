import api from './index';
import { apiUtils } from './index';
import toast from 'react-hot-toast';

// Buy & Sell API Service
export const buysellAPI = {
  // Get all buy-sell adverts with filtering and pagination
  getAdverts: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 20,
        category = '',
        subcategory = '',
        search = '',
        condition = '',
        priceMin = '',
        priceMax = '',
        country = '',
        city = '',
        sortBy = 'created_at',
        sortOrder = 'desc',
        featured = false,
        promoted = false,
        sponsored = false,
        urgent = false
      } = params;

      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add filters
      if (category && category !== 'all') queryParams.append('category', category);
      if (subcategory) queryParams.append('subcategory', subcategory);
      if (search) queryParams.append('search', search);
      if (condition && condition !== 'all') queryParams.append('condition', condition);
      if (priceMin) queryParams.append('price_min', priceMin);
      if (priceMax) queryParams.append('price_max', priceMax);
      if (country) queryParams.append('country', country);
      if (city) queryParams.append('city', city);
      if (sortBy) queryParams.append('sort_by', sortBy);
      if (sortOrder) queryParams.append('sort_order', sortOrder);
      if (featured) queryParams.append('featured', featured);
      if (promoted) queryParams.append('promoted', promoted);
      if (sponsored) queryParams.append('sponsored', sponsored);
      if (urgent) queryParams.append('urgent', urgent);

      const response = await api.get(`/buysell?${queryParams.toString()}`);
      return apiUtils.handlePaginatedResponse(response);
    } catch (error) {
      console.error('Error fetching buy-sell adverts:', error);
      throw error;
    }
  },

  // Get single advert by slug or ID
  getAdvert: async (identifier) => {
    try {
      const response = await api.get(`/buysell/${identifier}`);
      return apiUtils.validateResponse(response, ['id', 'title', 'price']);
    } catch (error) {
      console.error('Error fetching advert:', error);
      throw error;
    }
  },

  // Get featured adverts
  getFeaturedAdverts: async (limit = 10) => {
    try {
      const response = await api.get(`/buysell/featured?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching featured adverts:', error);
      return [];
    }
  },

  // Get recent adverts
  getRecentAdverts: async (limit = 10) => {
    try {
      const response = await api.get(`/buysell/recent?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching recent adverts:', error);
      return [];
    }
  },

  // Search adverts
  searchAdverts: async (params = {}) => {
    try {
      const { q, category, priceMin, priceMax } = params;
      const queryParams = new URLSearchParams();
      
      if (q) queryParams.append('q', q);
      if (category) queryParams.append('category', category);
      if (priceMin) queryParams.append('price_min', priceMin);
      if (priceMax) queryParams.append('price_max', priceMax);

      const response = await api.get(`/buysell/search?${queryParams.toString()}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching adverts:', error);
      return [];
    }
  },

  // Create new buy-sell advert
  createAdvert: async (advertData) => {
    try {
      const formData = new FormData();
      
      // Basic information
      formData.append('title', advertData.title);
      formData.append('description', advertData.description);
      formData.append('price', advertData.price);
      formData.append('currency', advertData.currency || 'USD');
      formData.append('condition', advertData.condition);
      formData.append('negotiable', advertData.negotiable ? '1' : '0');
      
      // Category information
      if (advertData.category) formData.append('category_id', advertData.category);
      if (advertData.subcategory) formData.append('subcategory_id', advertData.subcategory);
      
      // Location information
      formData.append('country', advertData.country);
      if (advertData.city) formData.append('city', advertData.city);
      if (advertData.address) formData.append('address', advertData.address);
      if (advertData.postalCode) formData.append('postal_code', advertData.postalCode);
      
      // Contact information
      formData.append('seller_name', advertData.sellerName || advertData.contactName);
      formData.append('seller_email', advertData.sellerEmail || advertData.contactEmail);
      if (advertData.phone || advertData.contactPhone) {
        formData.append('phone', advertData.phone || advertData.contactPhone);
      }
      if (advertData.whatsapp) formData.append('whatsapp', advertData.whatsapp);
      if (advertData.preferredContact) formData.append('preferred_contact', advertData.preferredContact);
      if (advertData.showPhone !== undefined) formData.append('show_phone', advertData.showPhone ? '1' : '0');
      
      // Additional details
      if (advertData.brand) formData.append('brand', advertData.brand);
      if (advertData.model) formData.append('model', advertData.model);
      if (advertData.color) formData.append('color', advertData.color);
      if (advertData.dimensions) formData.append('dimensions', advertData.dimensions);
      if (advertData.weight) formData.append('weight', advertData.weight);
      if (advertData.material) formData.append('material', advertData.material);
      if (advertData.usageDuration) formData.append('usage_duration', advertData.usageDuration);
      if (advertData.reasonForSelling) formData.append('reason_for_selling', advertData.reasonForSelling);
      
      // Promotion options
      if (advertData.promotionPlan) {
        formData.append('promotion_plan_id', advertData.promotionPlan);
        formData.append('promotion_duration', advertData.promotionDuration || '30');
      }
      
      // Images
      if (advertData.images && advertData.images.length > 0) {
        advertData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          } else if (typeof image === 'string') {
            formData.append(`existing_images[${index}]`, image);
          }
        });
      }
      
      // Video
      if (advertData.videoUrl) {
        formData.append('video_url', advertData.videoUrl);
      }

      const response = await api.post('/buysell', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Advert posted successfully!');
      return response.data.data;
    } catch (error) {
      console.error('Error creating advert:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to post advert. Please try again.');
      throw error;
    }
  },

  // Update existing advert
  updateAdvert: async (id, advertData) => {
    try {
      const formData = new FormData();
      
      // Add all fields that can be updated
      Object.entries(advertData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await api.post(`/buysell/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Advert updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating advert:', error);
      toast.error('Failed to update advert. Please try again.');
      throw error;
    }
  },

  // Delete advert
  deleteAdvert: async (id) => {
    try {
      await api.delete(`/buysell/${id}`);
      toast.success('Advert deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting advert:', error);
      toast.error('Failed to delete advert. Please try again.');
      throw error;
    }
  },

  // Get categories with counts
  getCategories: async () => {
    try {
      const response = await api.get('/buysell-categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get featured categories
  getFeaturedCategories: async () => {
    try {
      const response = await api.get('/buysell-categories/featured');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      return [];
    }
  },

  // Get popular categories
  getPopularCategories: async () => {
    try {
      const response = await api.get('/buysell-categories/popular');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      return [];
    }
  },

  // Get category tree
  getCategoryTree: async () => {
    try {
      const response = await api.get('/buysell-categories/tree');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching category tree:', error);
      return [];
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await api.get(`/buysell-categories/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Get category adverts
  getCategoryAdverts: async (slug, params = {}) => {
    try {
      const { page = 1, limit = 20 } = params;
      const queryParams = new URLSearchParams({ page, limit });
      
      const response = await api.get(`/buysell-categories/${slug}/adverts?${queryParams.toString()}`);
      return response.data.data || { items: [], meta: {} };
    } catch (error) {
      console.error('Error fetching category adverts:', error);
      return { items: [], meta: {} };
    }
  },

  // Get subcategories
  getSubcategories: async (categoryId) => {
    try {
      const response = await api.get(`/buysell-categories/${categoryId}/subcategories`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  },

  // Get user's adverts
  getUserAdverts: async (params = {}) => {
    try {
      const { page = 1, limit = 20, status = 'all' } = params;
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(status !== 'all' && { status })
      });

      const response = await api.get(`/buysell/my-adverts?${queryParams.toString()}`);
      return apiUtils.handlePaginatedResponse(response);
    } catch (error) {
      console.error('Error fetching user adverts:', error);
      throw error;
    }
  },

  // Save/unsave advert
  saveAdvert: async (id) => {
    try {
      const response = await api.post(`/buysell/${id}/save`);
      toast.success('Advert saved successfully!');
      return response.data.data;
    } catch (error) {
      console.error('Error saving advert:', error);
      toast.error('Failed to save advert. Please try again.');
      throw error;
    }
  },

  // Unsave advert
  unsaveAdvert: async (id) => {
    try {
      const response = await api.delete(`/buysell/${id}/unsave`);
      toast.success('Advert removed from saved items!');
      return response.data.data;
    } catch (error) {
      console.error('Error unsaving advert:', error);
      toast.error('Failed to remove saved advert. Please try again.');
      throw error;
    }
  },

  // Get saved adverts
  getSavedAdverts: async (params = {}) => {
    try {
      const { page = 1, limit = 20 } = params;
      const queryParams = new URLSearchParams({ page, limit });

      const response = await api.get(`/buysell/saved-adverts?${queryParams.toString()}`);
      return response.data.data || { items: [], meta: {} };
    } catch (error) {
      console.error('Error fetching saved adverts:', error);
      return { items: [], meta: {} };
    }
  },

  // Contact seller
  contactSeller: async (id, contactData) => {
    try {
      const response = await api.post(`/buysell/${id}/contact`, contactData);
      toast.success('Message sent to seller!');
      return response.data.data;
    } catch (error) {
      console.error('Error contacting seller:', error);
      toast.error('Failed to send message. Please try again.');
      throw error;
    }
  },

  // Report advert
  reportAdvert: async (id, reportData) => {
    try {
      const response = await api.post(`/buysell/${id}/report`, reportData);
      toast.success('Advert reported successfully!');
      return response.data.data;
    } catch (error) {
      console.error('Error reporting advert:', error);
      toast.error('Failed to report advert. Please try again.');
      throw error;
    }
  },

  // Track advert view
  trackView: async (id, metadata = {}) => {
    try {
      await api.post(`/buysell/${id}/view`, {
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        ...metadata
      });
    } catch (error) {
      // Silent fail for view tracking
      console.error('Error tracking view:', error);
    }
  },

  // Get advert analytics
  getAdvertAnalytics: async (id) => {
    try {
      const response = await api.get(`/buysell/${id}/analytics`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching advert analytics:', error);
      throw error;
    }
  },

  // Search suggestions
  getSearchSuggestions: async (query) => {
    try {
      const response = await api.get(`/buysell/search-suggestions?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return [];
    }
  },

  // Get trending items
  getTrendingItems: async (limit = 10) => {
    try {
      const response = await api.get(`/buysell/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending items:', error);
      return [];
    }
  },

  // Get recently viewed items
  getRecentlyViewed: async (limit = 10) => {
    try {
      const response = await api.get(`/buysell/recently-viewed?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recently viewed items:', error);
      return [];
    }
  },

  // Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await api.get('/buysell/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      throw error;
    }
  },

  // Get promotion plans
  getPromotionPlans: async () => {
    try {
      const response = await api.get('/buysell/promotion-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion plans:', error);
      throw error;
    }
  },

  // Purchase promotion for advert
  purchasePromotion: async (id, planId, duration) => {
    try {
      const response = await api.post(`/buysell/${id}/promote`, {
        plan_id: planId,
        duration: duration
      });
      toast.success('Promotion purchased successfully!');
      return response.data;
    } catch (error) {
      console.error('Error purchasing promotion:', error);
      toast.error('Failed to purchase promotion. Please try again.');
      throw error;
    }
  },

  // Get user's promotions
  getMyPromotions: async () => {
    try {
      const response = await api.get('/buysell-promotions/my-promotions');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching my promotions:', error);
      return [];
    }
  },

  // Extend promotion
  extendPromotion: async (promotionId, days) => {
    try {
      const response = await api.post(`/buysell-promotions/${promotionId}/extend`, { days });
      toast.success('Promotion extended successfully!');
      return response.data.data;
    } catch (error) {
      console.error('Error extending promotion:', error);
      toast.error('Failed to extend promotion. Please try again.');
      throw error;
    }
  },

  // Cancel promotion
  cancelPromotion: async (promotionId) => {
    try {
      const response = await api.delete(`/buysell-promotions/${promotionId}/cancel`);
      toast.success('Promotion cancelled successfully!');
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling promotion:', error);
      toast.error('Failed to cancel promotion. Please try again.');
      throw error;
    }
  },

  // File Upload Methods
  uploadImages: async (files, onProgress = null) => {
    try {
      return await apiUtils.uploadMultipleFiles(files, '/buysell-upload/images', onProgress);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
      throw error;
    }
  },

  uploadSingleImage: async (file, onProgress = null) => {
    try {
      return await apiUtils.uploadFile(file, '/buysell-upload/image', onProgress);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      throw error;
    }
  },

  uploadVideo: async (file, thumbnail = null, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('video', file);
      if (thumbnail) formData.append('thumbnail', thumbnail);

      const response = await api.post('/buysell-upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video. Please try again.');
      throw error;
    }
  },

  deleteFile: async (filename, type = 'image') => {
    try {
      await api.delete('/buysell-upload/file', {
        data: { filename, type }
      });
      toast.success('File deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file. Please try again.');
      throw error;
    }
  }
};

export default buysellAPI;
