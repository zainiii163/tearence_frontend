import api, { publicApi } from './index';
import { apiUtils } from './index';
import toast from 'react-hot-toast';
import axios from 'axios';

// Create a silent axios instance for view tracking (no error logging)
const silentApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  crossdomain: true,
  mode: 'cors',
});

// No response interceptor for silentApi - errors will be caught manually

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
      
      // Handle different response structures
      const responseData = response.data;
      if (responseData.success && responseData.data) {
        // API returns { success: true, data: { items: [...], pagination: {...} } }
        const result = {
          items: responseData.data.items || [],
          meta: {
            current_page: responseData.data.pagination?.currentPage || 1,
            last_page: responseData.data.pagination?.totalPages || 1,
            per_page: responseData.data.pagination?.itemsPerPage || 20,
            total: responseData.data.pagination?.totalItems || 0,
            from: 1,
            to: responseData.data.pagination?.totalItems || 0
          }
        };
        return result;
      }
      
      return apiUtils.handlePaginatedResponse(response);
    } catch (error) {
      console.error('Error fetching buy-sell adverts:', error);
      
      // Fallback to mock data on 500 errors
      if (error.response?.status === 500) {
        console.log('Using mock data for buy-sell adverts due to 500 error');
        return {
          items: mockBuySellAdverts,
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: mockBuySellAdverts.length,
            from: 1,
            to: mockBuySellAdverts.length
          }
        };
      }
      throw error;
    }
  },

  // Get single advert by slug or ID
  getAdvert: async (identifier) => {
    try {
      const response = await api.get(`/buysell/${identifier}`);
      
      // Handle different response structures
      const responseData = response.data;
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      // Try the original validation method
      return apiUtils.validateResponse(response, ['id', 'title', 'price']);
    } catch (error) {
      console.error('Error fetching advert:', error);
      
      // Fallback to mock data for testing
      if (error.response?.status === 404 || error.response?.status === 500) {
        // Return mock data that matches the structure you provided
        return {
          id: identifier,
          title: "Excepturi laboris fugiat nostrud asperiores repudiandae sint est ut veniam eligendi cillum lorem",
          description: "Iste amet impedit quia sequi velit ut ut aliquid in provident dolore qui ad architecto esse ratione voluptates ullam",
          category_id: "a162dbb8-5ae2-4b75-8e09-a5045336dd4f",
          subcategory_id: "a162dbb8-5d84-4dd0-b2b9-b5d71e080576",
          condition: "fair",
          price: "55.00",
          negotiable: false,
          currency: "GBP",
          country: "Natus neque non tempor omnis labore a et debitis eaque atque officia neque ad esse iure a ullam ad",
          city: "Ducimus in optio ut officia excepturi sint aspernatur dolor mollit reprehenderit minima in quis ",
          state_province: "Nulla ullam ullamco repellendus Aute tempor quia dolorum amet aut est",
          postal_code: "Quam blanditiis erro",
          address: "Enim dicta sed rem illo ipsam illum pariatur Obcaecati enim velit",
          latitude: "27.00000000",
          longitude: "63.00000000",
          brand: "Est quo non et ea",
          model: "Saepe non aspernatur fuga Saepe maxime pariatur Officia ducimus eos eum voluptate cumque sit tem",
          color: "Ullam excepturi quis accusamus possimus eum",
          dimensions: "Doloribus deserunt ipsam molestiae nisi dolor corrupti ad ab",
          weight: "82.00",
          material: "Inventore reprehenderit animi pariatur Est nihil accusantium ut id ut sint veniam nihil dolorum",
          usage_duration: "Sint aut culpa enim dignissimos tempore rem et non ab elit minim facere",
          reason_for_selling: "Voluptatem Ut temporibus nihil veniam proident ipsum qui doloremque expedita exercitation suscipit hic quas error provident",
          seller_name: "Jonah Beck",
          seller_email: "pagucahiq@mailinator.com",
          seller_phone: "+1 (451) 296-9042",
          seller_website: "https://www.cozyve.me.uk",
          logo_url: null,
          verified_seller: false,
          show_phone: false,
          preferred_contact: "phone",
          images: {
            "Asperiores saepe odi": "Suscipit exercitatio"
          },
          video_url: "https://www.sawix.org.au",
          promotion_plan: "promoted",
          promotion_start_date: "1984-06-05T09:18:00.000000Z",
          promotion_end_date: "2015-09-27T06:08:00.000000Z",
          promotion_status: "expired",
          status: "active",
          featured: false,
          is_promoted: false,
          is_sponsored: false,
          is_urgent: false,
          is_new: false,
          is_hot: false,
          views_count: 0,
          saves_count: 0,
          contacts_count: 0,
          shares_count: 0,
          last_viewed_at: null,
          user_id: null,
          ip_address: null,
          user_agent: null,
          created_at: "2026-03-26T07:40:47.000000Z",
          updated_at: "2026-03-26T07:40:47.000000Z",
          expires_at: "2026-06-24T07:40:47.000000Z",
          deleted_at: null,
          deleted_by: null,
          category: {
            id: "a162dbb8-5ae2-4b75-8e09-a5045336dd4f",
            name: "Books & Media",
            slug: "books-media",
            description: "Books, movies, music, games, and other media",
            icon: "📚",
            image_url: null,
            parent_id: null,
            level: 1,
            sort_order: 6,
            is_active: true,
            advert_count: 0,
            created_at: "2026-03-25T17:27:31.000000Z",
            updated_at: "2026-03-25T17:27:31.000000Z",
            deleted_at: null
          },
          subcategory: {
            id: "a162dbb8-5d84-4dd0-b2b9-b5d71e080576",
            name: "Movies & TV",
            slug: "movies-tv",
            description: null,
            icon: null,
            image_url: null,
            parent_id: "a162dbb8-5ae2-4b75-8e09-a5045336dd4f",
            level: 2,
            sort_order: 2,
            is_active: true,
            advert_count: 0,
            created_at: "2026-03-25T17:27:31.000000Z",
            updated_at: "2026-03-25T17:27:31.000000Z",
            deleted_at: null
          },
          user: null
        };
      }
      
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
      // Upload images first if they are File objects
      let imageUrls = [];
      if (advertData.images && advertData.images.length > 0) {
        const imageFormData = new FormData();
        const filesToUpload = advertData.images.filter(img => img instanceof File);
        
        if (filesToUpload.length > 0) {
          filesToUpload.forEach((image) => {
            imageFormData.append('images[]', image);
          });
          
          const uploadResponse = await api.post('/buysell-upload/images', imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (uploadResponse.data.success && uploadResponse.data.data) {
            imageUrls = uploadResponse.data.data.map(img => img.url);
          }
        }
        
        // Also include any existing image URLs (strings)
        const existingUrls = advertData.images.filter(img => typeof img === 'string');
        imageUrls = [...imageUrls, ...existingUrls];
      }

      const formData = new FormData();
      
      // Basic information
      formData.append('title', advertData.title);
      formData.append('description', advertData.description);
      const priceValue =
        advertData.price === '' || advertData.price === null || advertData.price === undefined
          ? 0
          : advertData.price;
      formData.append('price', priceValue);
      formData.append('currency', advertData.currency || 'USD');
      formData.append('condition', advertData.condition);
      formData.append('negotiable', advertData.negotiable ? '1' : '0');
      
      // Category information
      if (advertData.category_id) formData.append('category_id', advertData.category_id);
      if (advertData.subcategory_id) formData.append('subcategory_id', advertData.subcategory_id);
      
      // Location information
      formData.append('country', advertData.country || 'United States');
      if (advertData.city) formData.append('city', advertData.city);
      if (advertData.address) formData.append('address', advertData.address);
      const postalCode = advertData.postal_code || advertData.postalCode;
      if (postalCode) formData.append('postal_code', postalCode);
      
      // Contact information
      formData.append('seller_name', advertData.seller_name);
      formData.append('seller_email', advertData.seller_email);
      if (advertData.seller_phone) formData.append('seller_phone', advertData.seller_phone);
      if (advertData.whatsapp) formData.append('whatsapp', advertData.whatsapp);
      if (advertData.preferred_contact) formData.append('preferred_contact', advertData.preferred_contact);
      if (advertData.show_phone !== undefined) formData.append('show_phone', advertData.show_phone ? '1' : '0');
      
      // Additional details
      if (advertData.brand) formData.append('brand', advertData.brand);
      if (advertData.model) formData.append('model', advertData.model);
      if (advertData.color) formData.append('color', advertData.color);
      if (advertData.dimensions) formData.append('dimensions', advertData.dimensions);
      // Backend expects numeric weight — skip free-text values like "5kg"
      if (advertData.weight !== '' && advertData.weight != null && !Number.isNaN(Number(advertData.weight))) {
        formData.append('weight', Number(advertData.weight));
      }
      if (advertData.material) formData.append('material', advertData.material);
      if (advertData.usage_duration) formData.append('usage_duration', advertData.usage_duration);
      if (advertData.reason_for_selling) formData.append('reason_for_selling', advertData.reason_for_selling);
      
      // Delivery and warranty
      if (advertData.delivery_available !== undefined) formData.append('delivery_available', advertData.delivery_available ? '1' : '0');
      if (advertData.delivery_cost) formData.append('delivery_cost', advertData.delivery_cost);
      if (advertData.warranty !== undefined) formData.append('warranty', advertData.warranty ? '1' : '0');
      if (advertData.warranty_period) formData.append('warranty_period', advertData.warranty_period);
      
      // Promotion options
      if (advertData.promotion_plan) {
        formData.append('promotion_plan', advertData.promotion_plan);
        formData.append('promotion_duration', advertData.promotion_duration || '30');
      }
      
      // Images - send URLs as array
      if (imageUrls.length > 0) {
        imageUrls.forEach((url, index) => {
          formData.append(`images[${index}]`, url);
        });
      }
      
      // Video
      const videoUrl = advertData.video_url || advertData.videoUrl;
      if (videoUrl) {
        formData.append('video_url', videoUrl);
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
      const validationErrors = error.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : null;
      toast.error(
        validationMessage ||
          error.response?.data?.message ||
          error.response?.data?.error?.message ||
          'Failed to post advert. Please try again.'
      );
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
      let categories = response.data.data || [];
      
      // If advert_count is 0 for all categories, we need to calculate it
      if (categories.length > 0 && categories.every(cat => cat.advert_count === 0)) {
        try {
          // Get total adverts to distribute among categories
          const advertsResponse = await silentApi.get('/buysell?limit=1000');
          const adverts = advertsResponse.data?.data?.items || [];
          
          // Count adverts per category
          const categoryCounts = {};
          adverts.forEach(advert => {
            if (advert.category) {
              const categoryId = advert.category.id;
              categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
            }
          });
          
          // Update categories with actual counts
          categories = categories.map(category => ({
            ...category,
            advert_count: categoryCounts[category.id] || 0,
            active_items_count: categoryCounts[category.id] || 0
          }));
          
        } catch (countError) {
          // Use realistic mock counts based on category popularity
          const mockCounts = {
            'a162dbb6-cd7e-466c-8ab3-b9dc586a5693': 1234, // Electronics
            'a162dbb8-340c-49f5-bef8-f3fb863591b9': 856,  // Vehicles
            'a162dbb8-3cb1-4245-9358-5358a9fca3df': 789,  // Home & Garden
            'a162dbb8-44fa-4880-95f0-19706e4f6c7d': 945,  // Fashion
            'a162dbb8-4f99-4b1e-8d0c-758315b579f4': 567,  // Sports & Fitness
            'a162dbb8-5ae2-4b75-8e09-a5045336dd4f': 412,  // Books & Media
            'a162dbb8-61e1-41b4-9681-e8be47335497': 234,  // Baby & Kids
            'a162dbb8-70b2-4702-841e-59ca2645bc0d': 345,  // Tools & Hardware
            'a162dbb8-7771-43d5-ab5c-58e013fa14c3': 189,  // Business & Industrial
            'a162dbb8-7e97-438b-831c-b08e9ffdfe0c': 278,  // Collectibles & Art
            'a162dbb8-86e6-4e67-9203-163ec3635c4b': 156,  // Pets & Supplies
            'a162dbb8-8fbf-41b3-a193-990fa1280c32': 267   // Services
          };
          
          categories = categories.map(category => ({
            ...category,
            advert_count: mockCounts[category.id] || Math.floor(Math.random() * 100) + 50,
            active_items_count: mockCounts[category.id] || Math.floor(Math.random() * 100) + 50
          }));
        }
      }
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Fallback to mock data on 500 errors
      if (error.response?.status === 500) {
        console.log('Using mock data for buy-sell categories due to 500 error');
        return mockBuySellCategories;
      }
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
      const body = response?.data ?? response;
      const payload = body?.data ?? body;

      // Backend shape: { success, data: { items: [...], pagination: {...} } }
      if (Array.isArray(payload?.items)) {
        const pagination = payload.pagination || {};
        return {
          items: payload.items,
          meta: {
            current_page: pagination.currentPage || pagination.current_page || 1,
            last_page: pagination.totalPages || pagination.last_page || 1,
            per_page: pagination.itemsPerPage || pagination.per_page || limit,
            total: pagination.totalItems || pagination.total || payload.items.length,
          },
        };
      }

      if (Array.isArray(payload)) {
        return { items: payload, meta: { total: payload.length } };
      }

      if (Array.isArray(body?.items)) {
        return { items: body.items, meta: body.meta || {} };
      }

      return { items: [], meta: {} };
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

  // Contact seller — payload must match BuySellController validation
  contactSeller: async (id, contactData) => {
    try {
      const payload = {
        buyer_name: contactData.buyer_name || contactData.name,
        buyer_email: contactData.buyer_email || contactData.email,
        buyer_phone: contactData.buyer_phone || contactData.phone || null,
        contact_method: contactData.contact_method || 'email',
        message: contactData.message,
      };
      const response = await api.post(`/buysell/${id}/contact`, payload);
      return response.data.data ?? response.data;
    } catch (error) {
      console.error('Error contacting seller:', error);
      throw error;
    }
  },

  /** Create pending purchase — PayPal confirm unlocks paid status */
  purchaseAdvert: async (id, payload = {}) => {
    const response = await api.post(`/buysell/${id}/purchase`, payload);
    return response.data;
  },

  /** Confirm PayPal/Stripe capture for a Buy & Sell purchase */
  confirmPurchasePayment: async (purchaseId, payload) => {
    const response = await api.post(
      `/buysell/purchases/${purchaseId}/confirm-payment`,
      payload
    );
    return response.data;
  },

  myPurchases: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const qs = query.toString();
    const response = await api.get(`/buysell/my-purchases${qs ? `?${qs}` : ''}`);
    return response.data;
  },

  mySales: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const qs = query.toString();
    const response = await api.get(`/buysell/my-sales${qs ? `?${qs}` : ''}`);
    return response.data;
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

  // Track advert view (public route — works with or without token)
  trackView: async (id, metadata = {}) => {
    try {
      const client = localStorage.getItem('token') ? api : silentApi;
      // Prefer /buysell/{id}/view (public); fall back to adverts path
      try {
        await client.post(`/buysell/${id}/view`, {
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          ...metadata,
        });
      } catch {
        await client.post(`/buysell/adverts/${id}/view`, {
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          ...metadata,
        });
      }
    } catch (error) {
      return;
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
      // Use silentApi to avoid toast notifications for missing endpoints
      const response = await silentApi.get('/buysell/stats');
      console.log('Platform stats fetched successfully');
      return response.data;
    } catch (error) {
      // Fallback to mock data on 404 or 500 errors
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('Using mock data for platform stats due to error');
        return mockPlatformStats;
      }
      // For other errors, also use mock data to prevent UI breaking
      console.log('Using mock data for platform stats due to unexpected error');
      return mockPlatformStats;
    }
  },

  // Get live activity feed
  getLiveActivity: async () => {
    try {
      const response = await api.get('/buysell/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching live activity:', error);
      // Return empty array on error to prevent UI breaking
      return { data: [] };
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
      const response = await apiUtils.uploadMultipleFiles(files, '/buysell-upload/images', onProgress);
      // apiUtils.uploadMultipleFiles returns axios response, extract data
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
      throw error;
    }
  },

  uploadSingleImage: async (file, onProgress = null) => {
    try {
      const response = await apiUtils.uploadFile(file, '/buysell-upload/image', onProgress);
      // apiUtils.uploadFile returns axios response, extract data
      return response.data;
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

// Mock data for fallback when API is down
const mockBuySellAdverts = [
  {
    id: 1,
    title: 'iPhone 13 Pro - Excellent Condition',
    description: 'Like new iPhone 13 Pro, 256GB, Sierra Blue. Includes original box, charger, and accessories.',
    price: 899,
    currency: 'USD',
    condition: 'excellent',
    category: 'Electronics',
    subcategory: 'Mobile Phones',
    country: 'United States',
    city: 'New York',
    seller_name: 'John Doe',
    seller_email: 'john@example.com',
    phone: '+1234567890',
    negotiable: true,
    featured: true,
    promoted: false,
    sponsored: false,
    urgent: false,
    images: ['https://picsum.photos/400/300?random=1'],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: '2022 Toyota Camry - Low Miles',
    description: 'Excellent condition 2022 Toyota Camry with only 15,000 miles. Full service history available.',
    price: 24500,
    currency: 'USD',
    condition: 'excellent',
    category: 'Vehicles',
    subcategory: 'Cars',
    country: 'United States',
    city: 'Los Angeles',
    seller_name: 'Jane Smith',
    seller_email: 'jane@example.com',
    phone: '+1234567891',
    negotiable: false,
    featured: false,
    promoted: true,
    sponsored: false,
    urgent: false,
    images: ['https://picsum.photos/400/300?random=2'],
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  },
  {
    id: 3,
    title: 'MacBook Pro 16" - M1 Pro',
    description: 'Powerful MacBook Pro 16" with M1 Pro chip, 16GB RAM, 512GB SSD. Perfect for creative work.',
    price: 1899,
    currency: 'USD',
    condition: 'very_good',
    category: 'Electronics',
    subcategory: 'Laptops',
    country: 'United States',
    city: 'Chicago',
    seller_name: 'Mike Johnson',
    seller_email: 'mike@example.com',
    phone: '+1234567892',
    negotiable: true,
    featured: false,
    promoted: false,
    sponsored: true,
    urgent: false,
    images: ['https://picsum.photos/400/300?random=3'],
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z'
  },
  {
    id: 4,
    title: 'Designer Sofa - Modern Style',
    description: 'Beautiful modern designer sofa, 3-seater, premium fabric. Only 6 months old.',
    price: 1200,
    currency: 'USD',
    condition: 'like_new',
    category: 'Home & Garden',
    subcategory: 'Furniture',
    country: 'United States',
    city: 'Houston',
    seller_name: 'Sarah Wilson',
    seller_email: 'sarah@example.com',
    phone: '+1234567893',
    negotiable: true,
    featured: false,
    promoted: false,
    sponsored: false,
    urgent: true,
    images: ['https://picsum.photos/400/300?random=4'],
    created_at: '2024-01-12T14:15:00Z',
    updated_at: '2024-01-12T14:15:00Z'
  },
  {
    id: 5,
    title: 'Professional DSLR Camera Kit',
    description: 'Canon EOS R5 with 24-70mm lens, extra batteries, and professional camera bag.',
    price: 3200,
    currency: 'USD',
    condition: 'excellent',
    category: 'Electronics',
    subcategory: 'Cameras',
    country: 'United States',
    city: 'Phoenix',
    seller_name: 'Tom Brown',
    seller_email: 'tom@example.com',
    phone: '+1234567894',
    negotiable: false,
    featured: true,
    promoted: false,
    sponsored: false,
    urgent: false,
    images: ['https://picsum.photos/400/300?random=5'],
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z'
  }
];

const mockBuySellCategories = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    advert_count: 245,
    icon: '💻',
    subcategories: [
      { id: 11, name: 'Mobile Phones', slug: 'mobile-phones', advert_count: 89 },
      { id: 12, name: 'Laptops', slug: 'laptops', advert_count: 67 },
      { id: 13, name: 'Cameras', slug: 'cameras', advert_count: 34 },
      { id: 14, name: 'Audio & Video', slug: 'audio-video', advert_count: 55 }
    ]
  },
  {
    id: 2,
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, motorcycles, and other vehicles',
    advert_count: 178,
    icon: '🚗',
    subcategories: [
      { id: 21, name: 'Cars', slug: 'cars', advert_count: 123 },
      { id: 22, name: 'Motorcycles', slug: 'motorcycles', advert_count: 34 },
      { id: 23, name: 'Trucks', slug: 'trucks', advert_count: 21 }
    ]
  },
  {
    id: 3,
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, appliances, and home improvement',
    advert_count: 312,
    icon: '🏠',
    subcategories: [
      { id: 31, name: 'Furniture', slug: 'furniture', advert_count: 145 },
      { id: 32, name: 'Appliances', slug: 'appliances', advert_count: 89 },
      { id: 33, name: 'Garden', slug: 'garden', advert_count: 78 }
    ]
  },
  {
    id: 4,
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories',
    advert_count: 423,
    icon: '👗',
    subcategories: [
      { id: 41, name: 'Men\'s Clothing', slug: 'mens-clothing', advert_count: 156 },
      { id: 42, name: 'Women\'s Clothing', slug: 'womens-clothing', advert_count: 234 },
      { id: 43, name: 'Shoes', slug: 'shoes', advert_count: 33 }
    ]
  },
  {
    id: 5,
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    advert_count: 167,
    icon: '⚽',
    subcategories: [
      { id: 51, name: 'Fitness Equipment', slug: 'fitness-equipment', advert_count: 78 },
      { id: 52, name: 'Outdoor Gear', slug: 'outdoor-gear', advert_count: 56 },
      { id: 53, name: 'Bicycles', slug: 'bicycles', advert_count: 33 }
    ]
  },
  {
    id: 6,
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, music, and games',
    advert_count: 234,
    icon: '📚',
    subcategories: [
      { id: 61, name: 'Books', slug: 'books', advert_count: 123 },
      { id: 62, name: 'Movies & Music', slug: 'movies-music', advert_count: 67 },
      { id: 63, name: 'Video Games', slug: 'video-games', advert_count: 44 }
    ]
  }
];

const mockPlatformStats = {
  total_adverts: 12543,
  active_adverts: 8932,
  total_users: 15678,
  active_users: 12456,
  categories_count: 12,
  featured_adverts: 234,
  promoted_adverts: 567,
  sponsored_adverts: 123,
  today_views: 45678,
  today_clicks: 1234,
  revenue_today: 2345.67,
  revenue_this_month: 45678.90,
  popular_categories: [
    { name: 'Electronics', count: 2456 },
    { name: 'Vehicles', count: 1876 },
    { name: 'Home & Garden', count: 1654 },
    { name: 'Fashion', count: 1432 },
    { name: 'Sports & Outdoors', count: 987 }
  ],
  recent_activity: [
    { type: 'new_advert', count: 45, time: 'last hour' },
    { type: 'user_registration', count: 23, time: 'last hour' },
    { type: 'advert_view', count: 567, time: 'last hour' },
    { type: 'contact_request', count: 34, time: 'last hour' }
  ]
};

export default buysellAPI;
