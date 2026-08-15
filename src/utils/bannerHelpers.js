// Banner helper utilities
import { WORLD_COUNTRY_OPTIONS, isoToFlagEmoji } from '../data/worldCountries';

// Banner size configurations
export const BANNER_SIZES = {
  '728x90': {
    name: 'Leaderboard',
    width: 728,
    height: 90,
    description: 'Standard horizontal banner, perfect for headers and footers',
    common: true
  },
  '300x250': {
    name: 'Medium Rectangle',
    width: 300,
    height: 250,
    description: 'Versatile rectangle, ideal for sidebars and content areas',
    common: true
  },
  '160x600': {
    name: 'Wide Skyscraper',
    width: 160,
    height: 600,
    description: 'Tall vertical banner, great for side columns',
    common: true
  },
  '970x250': {
    name: 'Billboard',
    width: 970,
    height: 250,
    description: 'Large horizontal banner, maximum visibility',
    common: true
  },
  '468x60': {
    name: 'Classic Banner',
    width: 468,
    height: 60,
    description: 'Traditional web banner size',
    common: true
  },
  '1080x1080': {
    name: 'Square Social',
    width: 1080,
    height: 1080,
    description: 'Perfect for social media platforms',
    common: true
  },
  '150x150': {
    name: 'Small Square',
    width: 150,
    height: 150,
    description: 'Compact square badge / sidebar tile',
    common: true
  },
  '200x400': {
    name: 'Half Page / Tall',
    width: 200,
    height: 400,
    description: 'Tall sidebar promotional unit',
    common: true
  },
  '100x600': {
    name: 'Narrow Skyscraper',
    width: 100,
    height: 600,
    description: 'Narrow vertical skyscraper',
    common: true
  },
  '100x400': {
    name: 'Narrow Tall',
    width: 100,
    height: 400,
    description: 'Narrow tall sidebar unit',
    common: true
  },
  '100x200': {
    name: 'Narrow Button',
    width: 100,
    height: 200,
    description: 'Narrow button / micro tower',
    common: true
  }
};

// Banner type configurations
export const BANNER_TYPES = {
  'image': {
    name: 'Standard Image',
    extensions: ['jpg', 'jpeg', 'png', 'webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    description: 'Static image banner'
  },
  'animated': {
    name: 'Animated GIF',
    extensions: ['gif'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Animated GIF banner'
  },
  'html5': {
    name: 'HTML5 Banner',
    extensions: ['zip'],
    maxSize: 20 * 1024 * 1024, // 20MB
    description: 'Interactive HTML5 banner (ZIP package)'
  },
  'video': {
    name: 'Video Banner',
    extensions: ['mp4', 'webm'],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Video banner with sound'
  }
};

// Promotion tier configurations
export const PROMOTION_TIERS = {
  'standard': {
    name: 'Standard Banner',
    price: 25,
    currency: 'GBP',
    duration: 30,
    badge: null,
    color: 'gray',
    benefits: [
      'Standard banner placement',
      'Basic visibility',
      '30 days duration',
      'Basic analytics'
    ],
    popular: false
  },
  'promoted': {
    name: 'Promoted Banner',
    price: 50,
    currency: 'GBP',
    duration: 30,
    badge: 'Promoted',
    color: 'blue',
    benefits: [
      'Highlighted banner',
      'Appears above standard banners',
      'Promoted badge',
      '2× more visibility',
      'Enhanced analytics'
    ],
    popular: false
  },
  'featured': {
    name: 'Featured Banner',
    price: 100,
    currency: 'GBP',
    duration: 30,
    badge: 'Featured',
    color: 'purple',
    benefits: [
      'Top of category pages',
      'Larger banner preview',
      'Priority in search results',
      'Weekly Featured Banners email',
      'Featured badge',
      '4× more visibility',
      'Advanced analytics'
    ],
    popular: true
  },
  'sponsored': {
    name: 'Sponsored Banner',
    price: 200,
    currency: 'GBP',
    duration: 30,
    badge: 'Sponsored',
    color: 'orange',
    benefits: [
      'Homepage placement',
      'Category top placement',
      'Homepage slider inclusion',
      'Social media promotion',
      'Sponsored badge',
      'Maximum visibility',
      'Premium analytics',
      'Dedicated support'
    ],
    popular: false
  },
  'network_boost': {
    name: 'Network-Wide Boost',
    price: 500,
    currency: 'GBP',
    duration: 30,
    badge: 'Network Boost',
    color: 'red',
    benefits: [
      'Appears across multiple pages',
      'Banner Ads page',
      'Homepage',
      'Category pages',
      'Related search pages',
      'Email newsletters',
      'Push notifications',
      'Top Spotlight badge',
      'Ultimate visibility',
      'Enterprise analytics',
      'Priority support'
    ],
    popular: false
  }
};

// Banner status configurations
export const BANNER_STATUS = {
  'draft': {
    name: 'Draft',
    color: 'gray',
    description: 'Banner is being created'
  },
  'pending': {
    name: 'Pending Approval',
    color: 'yellow',
    description: 'Banner is waiting for admin approval'
  },
  'active': {
    name: 'Active',
    color: 'green',
    description: 'Banner is live and visible'
  },
  'rejected': {
    name: 'Rejected',
    color: 'red',
    description: 'Banner was rejected by admin'
  },
  'expired': {
    name: 'Expired',
    color: 'gray',
    description: 'Banner promotion period has ended'
  }
};

// Validation functions
export const validateBannerImage = (file, bannerSize) => {
  const errors = [];
  
  // Check file size
  const maxSize = BANNER_TYPES.image.maxSize;
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }
  
  // Check file extension
  const extension = file.name.split('.').pop().toLowerCase();
  if (!BANNER_TYPES.image.extensions.includes(extension)) {
    errors.push(`File must be one of: ${BANNER_TYPES.image.extensions.join(', ')}`);
  }
  
  // Check image dimensions (if we can read them)
  // This would need additional implementation for actual dimension checking
  
  return errors;
};

export const validateBannerFile = (file, bannerType, bannerSize) => {
  const typeConfig = BANNER_TYPES[bannerType];
  const errors = [];
  
  // Check file size
  if (file.size > typeConfig.maxSize) {
    errors.push(`File size must be less than ${typeConfig.maxSize / (1024 * 1024)}MB`);
  }
  
  // Check file extension
  const extension = file.name.split('.').pop().toLowerCase();
  if (!typeConfig.extensions.includes(extension)) {
    errors.push(`File must be one of: ${typeConfig.extensions.join(', ')}`);
  }
  
  return errors;
};

// Format functions
export const formatPrice = (price, currency = 'GBP') => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatCTR = (clicks, views) => {
  if (views === 0) return '0%';
  return ((clicks / views) * 100).toFixed(2) + '%';
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDaysRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Expires today';
  if (diffDays === 1) return '1 day left';
  return `${diffDays} days left`;
};

// URL helpers
export const getBannerImageUrl = (filename) => {
  return `${process.env.REACT_APP_STORAGE_URL || '/storage'}/banner-images/${filename}`;
};

export const getBusinessLogoUrl = (filename) => {
  return `${process.env.REACT_APP_STORAGE_URL || '/storage'}/business-logos/${filename}`;
};

export const getCategoryIconUrl = (filename) => {
  return `${process.env.REACT_APP_STORAGE_URL || '/storage'}/banner-categories/${filename}`;
};

// Analytics helpers
export const calculateCTR = (clicks, views) => {
  if (views === 0) return 0;
  return (clicks / views) * 100;
};

export const calculateROI = (revenue, cost) => {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
};

export const getPerformanceLevel = (ctr) => {
  if (ctr >= 5) return { level: 'Excellent', color: 'green' };
  if (ctr >= 3) return { level: 'Good', color: 'blue' };
  if (ctr >= 1) return { level: 'Average', color: 'yellow' };
  return { level: 'Poor', color: 'red' };
};

// Search and filter helpers
export const createSearchQuery = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
  });
  
  return params.toString();
};

export const parseSearchQuery = (queryString) => {
  const params = new URLSearchParams(queryString);
  const filters = {};
  
  for (const [key, value] of params.entries()) {
    if (filters[key]) {
      // Convert to array if multiple values
      if (!Array.isArray(filters[key])) {
        filters[key] = [filters[key]];
      }
      filters[key].push(value);
    } else {
      filters[key] = value;
    }
  }
  
  return filters;
};

// Local storage helpers
export const saveRecentlyViewedBanner = (banner) => {
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewedBanners') || '[]');
  
  // Remove if already exists
  const filtered = recentlyViewed.filter(b => b.id !== banner.id);
  
  // Add to beginning
  filtered.unshift({
    id: banner.id,
    title: banner.title,
    banner_image: banner.banner_image,
    business_name: banner.business_name,
    viewed_at: new Date().toISOString()
  });
  
  // Keep only last 10
  const limited = filtered.slice(0, 10);
  
  localStorage.setItem('recentlyViewedBanners', JSON.stringify(limited));
};

export const getRecentlyViewedBanners = () => {
  return JSON.parse(localStorage.getItem('recentlyViewedBanners') || '[]');
};

export const saveFavoriteBanner = (bannerId) => {
  const favorites = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
  
  if (!favorites.includes(bannerId)) {
    favorites.push(bannerId);
    localStorage.setItem('favoriteBanners', JSON.stringify(favorites));
  }
};

export const removeFavoriteBanner = (bannerId) => {
  const favorites = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
  const filtered = favorites.filter(id => id !== bannerId);
  localStorage.setItem('favoriteBanners', JSON.stringify(filtered));
};

export const isFavoriteBanner = (bannerId) => {
  const favorites = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
  return favorites.includes(bannerId);
};

export const getFavoriteBanners = () => {
  return JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
};

// Country helpers
export const COUNTRIES = WORLD_COUNTRY_OPTIONS.map((c) => ({
  code: c.iso,
  name: c.value,
  flag: isoToFlagEmoji(c.iso),
}));

export const getCountryByCode = (code) => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCountryFlag = (code) => {
  const country = getCountryByCode(code);
  return country ? country.flag : '🏳️';
};

// Category helpers
export const CATEGORIES = [
  {
    id: 1,
    name: 'Real Estate',
    slug: 'real-estate',
    description: 'Property listings, real estate services',
    icon: '🏠',
    color: '#3B82F6',
    bgColor: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Car dealerships, auto services',
    icon: '🚗',
    color: '#EF4444',
    bgColor: 'from-red-500 to-red-600'
  },
  {
    id: 3,
    name: 'Travel & Resorts',
    slug: 'travel-resorts',
    description: 'Travel agencies, hotels, tourism',
    icon: '✈️',
    color: '#10B981',
    bgColor: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    name: 'Jobs & Recruitment',
    slug: 'jobs-recruitment',
    description: 'Job postings, recruitment agencies',
    icon: '💼',
    color: '#8B5CF6',
    bgColor: 'from-purple-500 to-purple-600'
  },
  {
    id: 5,
    name: 'Books & Authors',
    slug: 'books-authors',
    description: 'Book promotions, author services',
    icon: '📚',
    color: '#F59E0B',
    bgColor: 'from-amber-500 to-amber-600'
  },
  {
    id: 6,
    name: 'Services',
    slug: 'services',
    description: 'Professional services, consulting',
    icon: '🔧',
    color: '#6B7280',
    bgColor: 'from-gray-500 to-gray-600'
  },
  {
    id: 7,
    name: 'Events',
    slug: 'events',
    description: 'Event promotions, conferences',
    icon: '🎪',
    color: '#EC4899',
    bgColor: 'from-pink-500 to-pink-600'
  },
  {
    id: 8,
    name: 'Food & Hospitality',
    slug: 'food-hospitality',
    description: 'Restaurants, catering, food services',
    icon: '🍽️',
    color: '#F97316',
    bgColor: 'from-orange-500 to-orange-600'
  },
  {
    id: 9,
    name: 'Fashion & Beauty',
    slug: 'fashion-beauty',
    description: 'Fashion brands, beauty products',
    icon: '👗',
    color: '#F472B6',
    bgColor: 'from-pink-400 to-pink-500'
  },
  {
    id: 10,
    name: 'Tech & Electronics',
    slug: 'tech-electronics',
    description: 'Technology products, IT services',
    icon: '💻',
    color: '#06B6D4',
    bgColor: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 11,
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Healthcare, fitness, wellness',
    icon: '🏥',
    color: '#84CC16',
    bgColor: 'from-lime-500 to-lime-600'
  },
  {
    id: 12,
    name: 'Business & Finance',
    slug: 'business-finance',
    description: 'Financial services, investments',
    icon: '📈',
    color: '#0EA5E9',
    bgColor: 'from-sky-500 to-sky-600'
  }
];

export const getCategoryBySlug = (slug) => {
  return CATEGORIES.find(category => category.slug === slug);
};

export const getCategoryById = (id) => {
  return CATEGORIES.find(category => category.id === id);
};

// Export all helpers as default
export default {
  BANNER_SIZES,
  BANNER_TYPES,
  PROMOTION_TIERS,
  BANNER_STATUS,
  COUNTRIES,
  CATEGORIES,
  validateBannerImage,
  validateBannerFile,
  formatPrice,
  formatFileSize,
  formatCTR,
  formatDate,
  formatDaysRemaining,
  getBannerImageUrl,
  getBusinessLogoUrl,
  getCategoryIconUrl,
  calculateCTR,
  calculateROI,
  getPerformanceLevel,
  createSearchQuery,
  parseSearchQuery,
  saveRecentlyViewedBanner,
  getRecentlyViewedBanners,
  saveFavoriteBanner,
  removeFavoriteBanner,
  isFavoriteBanner,
  getFavoriteBanners,
  getCountryByCode,
  getCountryFlag,
  getCategoryBySlug,
  getCategoryById
};
