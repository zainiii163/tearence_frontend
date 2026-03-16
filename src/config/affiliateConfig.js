// Affiliate Hub Configuration
export const AFFILIATE_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api',
    TIMEOUT: 10000,
    ENDPOINTS: {
      // Categories
      CATEGORIES: '/v1/affiliates/categories',
      
      // Business Offers
      BUSINESS_OFFERS: '/v1/affiliates/business-offers',
      BUSINESS_OFFER_DETAIL: (id) => `/v1/affiliates/business-offers/${id}`,
      MY_BUSINESS_OFFERS: '/v1/affiliates/my-business-offers',
      
      // User Posts
      USER_POSTS: '/v1/affiliates/user-posts',
      USER_POST_DETAIL: (id) => `/v1/affiliates/user-posts/${id}`,
      MY_USER_POSTS: '/v1/affiliates/my-user-posts',
      
      // Applications
      APPLICATIONS: '/v1/affiliates/my-applications',
      APPLY_TO_OFFER: (offerId) => `/v1/affiliates/business-offers/${offerId}/apply`,
      
      // Upsell Plans
      UPSELL_PLANS: '/v1/affiliates/upsell-plans',
      PURCHASE_UPSELL: '/v1/affiliates/purchase-upsell',
      MY_UPSELLS: '/v1/affiliates/my-upsells',
      
      // Search
      SEARCH: '/v1/affiliates/search',
      
      // Analytics
      TRACK_CLICK: '/v1/affiliates/track-click',
      ANALYTICS: (type, id) => `/v1/affiliates/analytics/${type}/${id}`,
      PLATFORM_STATS: '/v1/affiliates/stats',
      
      // Authentication
      LOGIN: '/v1/auth/login',
      REGISTER: '/v1/auth/register',
      LOGOUT: '/v1/auth/logout',
      PROFILE: '/v1/auth/profile',
      CHANGE_PASSWORD: '/v1/auth/password',
      FORGOT_PASSWORD: '/v1/auth/forgot-password',
      RESET_PASSWORD: (token) => `/v1/auth/reset-password/${token}`,
      VERIFY_EMAIL: (token) => `/v1/auth/verify-email/${token}`,
      RESEND_VERIFICATION: '/v1/auth/resend-verification',
    },
  },

  // UI Configuration
  UI: {
    // Pagination
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,
    
    // Search
    MIN_SEARCH_LENGTH: 2,
    SEARCH_DEBOUNCE_MS: 300,
    
    // Uploads
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    
    // Commission
    MIN_COMMISSION_RATE: 0,
    MAX_COMMISSION_RATE: 100,
    DEFAULT_COOKIE_DURATION: 30,
    
    // Character limits
    MAX_TITLE_LENGTH: 100,
    MAX_TAGLINE_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 5000,
    MAX_HASHTAGS: 10,
    MAX_PROMOTIONAL_ASSETS: 5,
  },

  // Business Logic
  BUSINESS: {
    // Commission types
    COMMISSION_TYPES: {
      PERCENTAGE: 'percentage',
      FIXED: 'fixed',
    },
    
    // Traffic types
    TRAFFIC_TYPES: [
      'social_media',
      'email',
      'blogging',
      'ppc',
      'influencer',
      'content_marketing',
      'comparison_sites',
      'coupon_sites',
    ],
    
    // Offer statuses
    STATUSES: {
      PENDING: 'pending',
      APPROVED: 'approved',
      REJECTED: 'rejected',
      EXPIRED: 'expired',
      INACTIVE: 'inactive',
    },
    
    // Promotion tiers
    PROMOTION_TIERS: {
      BASIC: 'basic',
      PROMOTED: 'promoted',
      FEATURED: 'featured',
      SPONSORED: 'sponsored',
    },
  },

  // Categories (default structure)
  DEFAULT_CATEGORIES: [
    {
      id: 1,
      name: 'Technology & Gadgets',
      slug: 'technology-gadgets',
      description: 'Latest technology products and gadgets',
      icon: 'CpuChip',
      color: 'blue',
    },
    {
      id: 2,
      name: 'Fashion & Beauty',
      slug: 'fashion-beauty',
      description: 'Clothing, accessories, and beauty products',
      icon: 'Sparkles',
      color: 'pink',
    },
    {
      id: 3,
      name: 'Health & Fitness',
      slug: 'health-fitness',
      description: 'Health products, supplements, and fitness equipment',
      icon: 'Heart',
      color: 'green',
    },
    {
      id: 4,
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home decor, furniture, and garden supplies',
      icon: 'Home',
      color: 'orange',
    },
    {
      id: 5,
      name: 'Travel & Leisure',
      slug: 'travel-leisure',
      description: 'Travel packages, hotels, and leisure activities',
      icon: 'Plane',
      color: 'teal',
    },
    {
      id: 6,
      name: 'Education & Learning',
      slug: 'education-learning',
      description: 'Online courses, books, and educational materials',
      icon: 'BookOpen',
      color: 'purple',
    },
    {
      id: 7,
      name: 'Business & Finance',
      slug: 'business-finance',
      description: 'Business tools, financial services, and investments',
      icon: 'Briefcase',
      color: 'gray',
    },
    {
      id: 8,
      name: 'Food & Dining',
      slug: 'food-dining',
      description: 'Food delivery, restaurants, and cooking products',
      icon: 'Utensils',
      color: 'red',
    },
  ],

  // Upsell Plans (default structure)
  DEFAULT_UPSELL_PLANS: [
    {
      id: 1,
      name: 'Promoted Post',
      slug: 'promoted',
      description: 'Get your affiliate post highlighted with enhanced visibility',
      price: 19.99,
      duration_days: 7,
      features: [
        'Highlighted background',
        'Appears above standard posts',
        '2× more visibility',
        'Promoted badge',
      ],
      badge_color: '#3B82F6',
      sort_order: 1,
    },
    {
      id: 2,
      name: 'Featured Post',
      slug: 'featured',
      description: 'Maximum visibility with top placement and premium features',
      price: 49.99,
      duration_days: 30,
      features: [
        'Top of category pages',
        'Larger card size',
        'Priority in search results',
        'Featured badge',
        'Included in weekly email blast',
        '5× more visibility',
      ],
      badge_color: '#10B981',
      sort_order: 2,
    },
    {
      id: 3,
      name: 'Sponsored Post',
      slug: 'sponsored',
      description: 'Ultimate visibility with homepage placement and social promotion',
      price: 99.99,
      duration_days: 30,
      features: [
        'Homepage placement',
        'Category top placement',
        'Included in homepage slider',
        'Social media promotion',
        'Sponsored badge',
        'Maximum visibility',
        '10× more visibility',
      ],
      badge_color: '#F59E0B',
      sort_order: 3,
    },
  ],

  // Countries (for dropdowns)
  COUNTRIES: [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'RU', name: 'Russia' },
    { code: 'OTHER', name: 'Other' },
  ],

  // Validation Rules
  VALIDATION: {
    // Business Offer
    BUSINESS_OFFER: {
      business_name: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      product_service_title: {
        required: true,
        minLength: 5,
        maxLength: 100,
      },
      tagline: {
        maxLength: 200,
      },
      description: {
        required: true,
        minLength: 20,
        maxLength: 5000,
      },
      commission_rate: {
        required: true,
        min: 0,
        max: 100,
      },
      cookie_duration: {
        required: true,
        min: 1,
        max: 365,
      },
      business_email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      website_url: {
        required: true,
        pattern: /^https?:\/\/.+/,
      },
    },
    
    // User Post
    USER_POST: {
      title: {
        required: true,
        minLength: 5,
        maxLength: 100,
      },
      description: {
        required: true,
        minLength: 20,
        maxLength: 5000,
      },
      affiliate_link: {
        required: true,
        pattern: /^https?:\/\/.+/,
      },
      hashtags: {
        maxItems: 10,
        itemPattern: /^#[a-zA-Z0-9_]+$/,
      },
    },
  },

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTHENTICATION_ERROR: 'Please login to continue.',
    AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
    NOT_FOUND_ERROR: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    BUSINESS_OFFER_CREATED: 'Business offer created successfully!',
    BUSINESS_OFFER_UPDATED: 'Business offer updated successfully!',
    BUSINESS_OFFER_DELETED: 'Business offer deleted successfully!',
    USER_POST_CREATED: 'Affiliate post created successfully!',
    USER_POST_UPDATED: 'Affiliate post updated successfully!',
    USER_POST_DELETED: 'Affiliate post deleted successfully!',
    APPLICATION_SUBMITTED: 'Application submitted successfully!',
    UPSELL_PURCHASED: 'Promotion upgrade purchased successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PASSWORD_CHANGED: 'Password changed successfully!',
  },
};

export default AFFILIATE_CONFIG;
