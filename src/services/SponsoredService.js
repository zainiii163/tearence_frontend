// Mock SponsoredAdvertsService for development
const SponsoredAdvertsService = {
  homepage: {
    getLiveActivity: async (params = {}) => {
      // Mock implementation
      return {
        success: true,
        data: [
          {
            id: 1,
            type: 'service_posted',
            user: 'John Doe',
            advert_title: 'Web Development Services',
            timestamp: new Date().toISOString(),
            location: 'United States'
          },
          {
            id: 2,
            type: 'service_purchased',
            user: 'Jane Smith',
            advert_title: 'Logo Design',
            timestamp: new Date().toISOString(),
            location: 'United Kingdom'
          },
          {
            id: 3,
            type: 'service_viewed',
            user: 'Bob Johnson',
            advert_title: 'Premium Web Development',
            timestamp: new Date().toISOString(),
            location: 'Canada'
          }
        ]
      };
    },
    getTrendingServices: async (params = {}) => {
      // Mock implementation
      return {
        success: true,
        data: [
          {
            id: 1,
            title: 'Web Development',
            views: 1250,
            enquiries: 45,
            trending: true
          },
          {
            id: 2,
            title: 'Logo Design',
            views: 980,
            enquiries: 32,
            trending: true
          }
        ]
      };
    },
    getStats: async (params = {}) => {
      // Mock implementation
      return {
        success: true,
        data: {
          totalAdverts: 1250,
          activeAdverts: 980,
          pendingAdverts: 45,
          totalViews: 50000,
          totalClicks: 2500,
          revenue: 12500
        }
      };
    },
    getCategories: async (params = {}) => {
      // Mock implementation
      return {
        success: true,
        data: [
          { id: 1, name: 'Technology', count: 350 },
          { id: 2, name: 'Business', count: 280 },
          { id: 3, name: 'Marketing', count: 220 },
          { id: 4, name: 'Design', count: 180 },
          { id: 5, name: 'Services', count: 220 }
        ]
      };
    }
  },
  browse: {
    getAll: async (params = {}) => {
      // Mock implementation
      return {
        success: true,
        data: [
          {
            id: 1,
            title: 'Premium Web Development',
            description: 'Professional web development services',
            price: 500,
            category: 'Technology',
            location: 'United States',
            featured: true,
            promoted: true,
            views: 1250
          },
          {
            id: 2,
            title: 'Logo Design Services',
            description: 'Creative logo design for your brand',
            price: 200,
            category: 'Design',
            location: 'United Kingdom',
            featured: false,
            promoted: true,
            views: 980
          }
        ],
        pagination: {
          current_page: 1,
          per_page: 12,
          total: 50,
          last_page: 5
        }
      };
    },
    search: async (params = {}) => {
      // Mock search implementation - returns same data as getAll for now
      return {
        success: true,
        data: [
          {
            id: 1,
            title: 'Premium Web Development',
            description: 'Professional web development services',
            price: 500,
            category: 'Technology',
            location: 'United States',
            featured: true,
            promoted: true,
            views: 1250
          },
          {
            id: 2,
            title: 'Logo Design Services',
            description: 'Creative logo design for your brand',
            price: 200,
            category: 'Design',
            location: 'United Kingdom',
            featured: false,
            promoted: true,
            views: 980
          }
        ],
        meta: {
          current_page: 1,
          per_page: 12,
          total: 50,
          last_page: 5
        }
      };
    }
  },
  manage: {
    create: async (formData) => {
      // Mock implementation
      return {
        success: true,
        data: {
          id: Date.now(),
          status: 'active',
          ...formData
        },
        message: 'Sponsored advert created successfully'
      };
    }
  },
  utils: {
    trackEvent: async (advertId, eventType, metadata = {}) => {
      // Mock analytics tracking - silently succeed
      console.log(`Analytics event tracked: ${eventType} for advert ${advertId}`, metadata);
      return {
        success: true,
        message: 'Event tracked successfully'
      };
    },
    saveAdvert: async (advertId) => {
      // Mock save advert functionality
      console.log(`Mock: Saving advert ${advertId}`);
      return {
        success: true,
        message: 'Advert saved successfully'
      };
    }
  }
};

export default SponsoredAdvertsService;
