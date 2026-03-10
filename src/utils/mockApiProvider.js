// Development Data Provider for Banner System
// Provides realistic mock data when backend API is not available

import { bannerCategories, bannerAds, promotionOptions } from '../data/bannerDataSeeder';

// Simulate API delays and responses
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockBannerApi = {
  // Banner Categories API
  bannerCategories: {
    getAll: async () => {
      await delay(800); // Simulate network delay
      return {
        success: true,
        data: bannerCategories
      };
    },
    
    getTrending: async (limit = 10) => {
      await delay(600);
      return {
        success: true,
        data: bannerCategories
          .sort((a, b) => b.active_banners_count - a.active_banners_count)
          .slice(0, limit)
      };
    },
    
    getBySlug: async (slug) => {
      await delay(400);
      const category = bannerCategories.find(cat => cat.slug === slug);
      if (!category) {
        throw new Error('Category not found');
      }
      return {
        success: true,
        data: category
      };
    },
    
    getCategoryBanners: async (slug, params = {}) => {
      await delay(1000);
      const category = bannerCategories.find(cat => cat.slug === slug);
      if (!category) {
        throw new Error('Category not found');
      }
      
      const categoryBanners = bannerAds.filter(banner => 
        banner.category.slug === slug && banner.status === 'active'
      );
      
      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBanners = categoryBanners.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedBanners,
        meta: {
          count: paginatedBanners.length,
          total: categoryBanners.length,
          per_page: limit,
          current_page: page,
          last_page: Math.ceil(categoryBanners.length / limit)
        }
      };
    }
  },

  // Banner Ads API
  bannerAds: {
    getAll: async (params = {}) => {
      await delay(1200); // Simulate API delay
      
      let filteredBanners = [...bannerAds];
      
      // Apply filters
      if (params.category_id) {
        filteredBanners = filteredBanners.filter(banner => 
          banner.banner_category_id === parseInt(params.category_id)
        );
      }
      
      if (params.country && params.country !== 'all') {
        filteredBanners = filteredBanners.filter(banner => 
          banner.country === params.country
        );
      }
      
      if (params.banner_size && params.banner_size !== 'all') {
        filteredBanners = filteredBanners.filter(banner => 
          banner.banner_size === params.banner_size
        );
      }
      
      if (params.promotion_tier && params.promotion_tier !== 'all') {
        filteredBanners = filteredBanners.filter(banner => 
          banner.promotion_tier === params.promotion_tier
        );
      }
      
      if (params.verified_only) {
        filteredBanners = filteredBanners.filter(banner => 
          banner.is_verified_business === true
        );
      }
      
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredBanners = filteredBanners.filter(banner => 
          banner.title.toLowerCase().includes(searchLower) ||
          banner.business_name.toLowerCase().includes(searchLower) ||
          banner.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      if (params.sort_by) {
        switch (params.sort_by) {
          case 'created_at':
            filteredBanners.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case 'views_count':
            filteredBanners.sort((a, b) => b.views_count - a.views_count);
            break;
          case 'ctr':
            filteredBanners.sort((a, b) => b.ctr - a.ctr);
            break;
          case 'title':
            filteredBanners.sort((a, b) => a.title.localeCompare(b.title));
            break;
          default:
            break;
        }
      }
      
      if (params.sort_order === 'asc') {
        filteredBanners.reverse();
      }
      
      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBanners = filteredBanners.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedBanners,
        meta: {
          count: paginatedBanners.length,
          total: filteredBanners.length,
          per_page: limit,
          current_page: page,
          last_page: Math.ceil(filteredBanners.length / limit)
        }
      };
    },
    
    getFeatured: async (limit = 10) => {
      await delay(800);
      const featuredBanners = bannerAds
        .filter(banner => banner.status === 'active' && banner.promotion_tier === 'featured')
        .slice(0, limit);
      
      return {
        success: true,
        data: featuredBanners
      };
    },
    
    getMostViewed: async (limit = 10) => {
      await delay(600);
      const mostViewed = bannerAds
        .filter(banner => banner.status === 'active')
        .sort((a, b) => b.views_count - a.views_count)
        .slice(0, limit);
      
      return {
        success: true,
        data: mostViewed
      };
    },
    
    getRecent: async (limit = 10) => {
      await delay(600);
      const recent = bannerAds
        .filter(banner => banner.status === 'active')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);
      
      return {
        success: true,
        data: recent
      };
    },
    
    getBySlug: async (slug) => {
      await delay(400);
      const banner = bannerAds.find(b => b.slug === slug);
      if (!banner) {
        throw new Error('Banner not found');
      }
      
      // Increment view count (simulate)
      banner.views_count += 1;
      
      return {
        success: true,
        data: banner
      };
    },
    
    trackClick: async (slug) => {
      await delay(200);
      const banner = bannerAds.find(b => b.slug === slug);
      if (!banner) {
        throw new Error('Banner not found');
      }
      
      // Increment click count (simulate)
      banner.clicks_count += 1;
      banner.ctr = ((banner.clicks_count / banner.views_count) * 100).toFixed(2);
      
      return {
        success: true,
        message: 'Click tracked successfully'
      };
    },
    
    getPromotionOptions: async () => {
      await delay(300);
      return {
        success: true,
        data: promotionOptions
      };
    },
    
    create: async (bannerData) => {
      await delay(1500);
      const newBanner = {
        id: Math.max(...bannerAds.map(b => b.id)) + 1,
        slug: bannerData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'pending',
        is_active: false,
        views_count: 0,
        clicks_count: 0,
        ctr: 0,
        is_currently_promoted: false,
        is_currently_valid: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...bannerData
      };
      
      bannerAds.push(newBanner);
      
      return {
        success: true,
        data: newBanner,
        message: 'Banner submitted for approval'
      };
    },
    
    getMyBanners: async (params = {}) => {
      await delay(800);
      // Simulate user's banners (in real app, this would be filtered by user ID)
      const userBanners = bannerAds.slice(0, 5);
      
      return {
        success: true,
        data: userBanners,
        meta: {
          count: userBanners.length,
          total: userBanners.length,
          per_page: params.limit || 20,
          current_page: params.page || 1,
          last_page: 1
        }
      };
    }
  },

  // Banner Marketplace API
  bannerMarketplace: {
    getHomepage: async () => {
      await delay(1000);
      return {
        success: true,
        data: {
          featured_banners: bannerAds.filter(b => b.promotion_tier === 'featured').slice(0, 6),
          trending_categories: bannerCategories.sort((a, b) => b.active_banners_count - a.active_banners_count).slice(0, 8),
          recent_banners: bannerAds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10),
          stats: {
            total_banners: bannerAds.length,
            active_categories: bannerCategories.length,
            total_views: bannerAds.reduce((sum, b) => sum + b.views_count, 0),
            total_clicks: bannerAds.reduce((sum, b) => sum + b.clicks_count, 0)
          }
        }
      };
    },
    
    getCarousel: async () => {
      await delay(600);
      return {
        success: true,
        data: bannerAds
          .filter(b => b.status === 'active' && b.promotion_tier !== 'standard')
          .sort((a, b) => {
            const tierOrder = { 'network_boost': 4, 'sponsored': 3, 'featured': 2, 'promoted': 1 };
            return tierOrder[b.promotion_tier] - tierOrder[a.promotion_tier];
          })
          .slice(0, 8)
      };
    },
    
    getCategories: async () => {
      await delay(400);
      return {
        success: true,
        data: bannerCategories
      };
    },
    
    getAnalytics: async () => {
      await delay(800);
      return {
        success: true,
        data: {
          total_banners: bannerAds.length,
          active_banners: bannerAds.filter(b => b.status === 'active').length,
          total_views: bannerAds.reduce((sum, b) => sum + b.views_count, 0),
          total_clicks: bannerAds.reduce((sum, b) => sum + b.clicks_count, 0),
          average_ctr: (bannerAds.reduce((sum, b) => sum + parseFloat(b.ctr), 0) / bannerAds.length).toFixed(2),
          promotion_stats: {
            standard: bannerAds.filter(b => b.promotion_tier === 'standard').length,
            promoted: bannerAds.filter(b => b.promotion_tier === 'promoted').length,
            featured: bannerAds.filter(b => b.promotion_tier === 'featured').length,
            sponsored: bannerAds.filter(b => b.promotion_tier === 'sponsored').length,
            network_boost: bannerAds.filter(b => b.promotion_tier === 'network_boost').length
          },
          category_stats: bannerCategories.map(cat => ({
            ...cat,
            banner_count: bannerAds.filter(b => b.banner_category_id === cat.id).length
          }))
        }
      };
    }
  }
};

// Development mode detection
const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

// API wrapper that uses mock data in development mode
export const getApiProvider = () => {
  if (isDevelopmentMode()) {
    console.log('🔧 Using Development Data Provider (Mock API)');
    return mockBannerApi;
  }
  
  // In production, this would return the real API
  console.log('🌐 Using Production API');
  return null; // This would be replaced with actual API calls
};

// Export for direct use in components
export { mockBannerApi };
