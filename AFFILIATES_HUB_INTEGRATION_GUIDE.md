# Affiliates Hub - Backend Integration Guide

## 🎯 Overview

This guide provides step-by-step instructions for integrating the comprehensive Laravel backend with the React frontend, ensuring all API endpoints work seamlessly with the existing components.

## 🔄 Integration Steps

### **1. Backend Setup**

#### **A. Laravel Project Setup**
```bash
# Create new Laravel project
laravel new affiliates-hub-backend
cd affiliates-hub-backend

# Install required packages
composer require laravel/sanctum
composer require laravel/cors
composer require intervention/image
composer require spatie/laravel-medialibrary

# Install Node dependencies
npm install
npm install axios react-hot-toast

# Generate application key
php artisan key:generate
```

#### **B. Database Configuration**
```env
# .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=affiliates_hub
DB_USERNAME=root
DB_PASSWORD=

# API Configuration
API_BASE_URL=http://localhost:8000/api
FRONTEND_URL=http://localhost:3000

# File Storage
FILESYSTEM_DISK=local
UPLOAD_PATH=storage/app/public
```

#### **C. Run Migrations**
```bash
# Create database tables
php artisan migrate

# Seed categories and sample data
php artisan db:seed --class=AffiliateSeeder
```

### **2. API Routes Configuration**

#### **A. Create API Routes File**
```php
// routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AffiliateController;
use App\Http\Controllers\Api\AffiliateUpsellController;

// Public routes (no authentication required)
Route::prefix('v1/affiliates')->group(function () {
    // Categories
    Route::get('/categories', [AffiliateController::class, 'categories']);
    
    // Business Offers
    Route::get('/business-offers', [AffiliateController::class, 'businessOffers']);
    Route::get('/business-offers/{id}', [AffiliateController::class, 'showBusinessOffer']);
    
    // User Posts
    Route::get('/user-posts', [AffiliateController::class, 'userPosts']);
    Route::get('/user-posts/{id}', [AffiliateController::class, 'showUserPost']);
    
    // Search
    Route::get('/search', [AffiliateController::class, 'search']);
    
    // Analytics (public)
    Route::get('/stats', [AffiliateController::class, 'platformStats']);
    Route::post('/track-click', [AffiliateController::class, 'trackClick']);
    
    // Upsell Plans
    Route::get('/upsell-plans', [AffiliateController::class, 'upsellPlans']);
    
    // Featured/Trending Content
    Route::get('/featured', [AffiliateController::class, 'featuredContent']);
    Route::get('/trending', [AffiliateController::class, 'trendingContent']);
    Route::get('/by-location', [AffiliateController::class, 'contentByLocation']);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->prefix('v1/affiliates')->group(function () {
    // File Uploads
    Route::post('/upload-image', [AffiliateController::class, 'uploadImage']);
    Route::post('/upload-asset', [AffiliateController::class, 'uploadAsset']);
    
    // Business Offers CRUD
    Route::post('/business-offers', [AffiliateController::class, 'createBusinessOffer']);
    Route::put('/business-offers/{id}', [AffiliateController::class, 'updateBusinessOffer']);
    Route::delete('/business-offers/{id}', [AffiliateController::class, 'deleteBusinessOffer']);
    Route::put('/business-offers/{id}/moderate', [AffiliateController::class, 'moderateBusinessOffer']);
    Route::post('/business-offers/{id}/duplicate', [AffiliateController::class, 'duplicateBusinessOffer']);
    
    // User Posts CRUD
    Route::post('/user-posts', [AffiliateController::class, 'createUserPost']);
    Route::put('/user-posts/{id}', [AffiliateController::class, 'updateUserPost']);
    Route::delete('/user-posts/{id}', [AffiliateController::class, 'deleteUserPost']);
    Route::put('/user-posts/{id}/moderate', [AffiliateController::class, 'moderateUserPost']);
    Route::post('/user-posts/{id}/duplicate', [AffiliateController::class, 'duplicateUserPost']);
    
    // Applications
    Route::post('/business-offers/{offerId}/apply', [AffiliateController::class, 'applyToBusinessOffer']);
    Route::get('/my-applications', [AffiliateController::class, 'myApplications']);
    Route::put('/applications/{id}', [AffiliateController::class, 'updateApplication']);
    Route::post('/applications/{id}/respond', [AffiliateController::class, 'respondToApplication']);
    
    // User Content Management
    Route::get('/my-business-offers', [AffiliateController::class, 'myBusinessOffers']);
    Route::get('/my-user-posts', [AffiliateController::class, 'myUserPosts']);
    Route::get('/my-upsells', [AffiliateController::class, 'myUpsells']);
    
    // Analytics
    Route::get('/analytics/{type}/{id}', [AffiliateController::class, 'getAnalytics']);
    Route::get('/analytics-summary', [AffiliateController::class, 'analyticsSummary']);
    Route::get('/analytics/{type}/{id}/export', [AffiliateController::class, 'exportAnalytics']);
    
    // Payment Processing
    Route::post('/payment', [AffiliateController::class, 'processPayment']);
    
    // Notifications
    Route::get('/notifications', [AffiliateController::class, 'getNotifications']);
    Route::put('/notifications/{id}/read', [AffiliateController::class, 'markNotificationRead']);
    
    // Bulk Operations
    Route::post('/bulk-update-status', [AffiliateController::class, 'bulkUpdateStatus']);
    Route::post('/bulk-delete', [AffiliateController::class, 'bulkDelete']);
});
```

### **3. Frontend Integration**

#### **A. Update Environment Variables**
```env
# .env (React frontend)
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_API_VERSION=v1
REACT_APP_AFFILIATES_ENDPOINT=/affiliates
```

#### **B. Update API Configuration**
```javascript
// src/api/index.js (already updated)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
```

#### **C. Test API Connection**
```javascript
// src/test-api-connection.js
import affiliateService from './services/AffiliateService';

const testConnection = async () => {
  try {
    // Test public endpoint
    const categories = await affiliateService.getCategories();
    console.log('✅ Categories loaded:', categories.data);
    
    // Test business offers
    const offers = await affiliateService.getBusinessOffers({ per_page: 5 });
    console.log('✅ Business offers loaded:', offers.data);
    
    // Test user posts
    const posts = await affiliateService.getUserPosts({ per_page: 5 });
    console.log('✅ User posts loaded:', posts.data);
    
    // Test search
    const searchResults = await affiliateService.searchAffiliateContent('technology');
    console.log('✅ Search results:', searchResults.data);
    
    console.log('🎉 All API tests passed!');
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
};

export default testConnection;
```

### **4. Component Integration Updates**

#### **A. Update BusinessAffiliateForm.jsx**
```javascript
// src/Component/affiliates/forms/BusinessAffiliateForm.jsx
import affiliateService from '../../services/AffiliateService';
import { apiUtils } from '../../api';

const BusinessAffiliateForm = ({ formData, updateFormData, categories, onSubmit, loading }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedAssets, setUploadedAssets] = useState([]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const response = await apiUtils.uploadFile(file, '/v1/affiliates/upload-image');
        return {
          file,
          preview: URL.createObjectURL(file),
          url: response.url,
          id: response.id
        };
      });
      
      const newImages = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...newImages].slice(0, 5));
      
      // Update form data with image URLs
      const imageUrls = newImages.map(img => img.url);
      updateFormData('images', [...(formData.images || []), ...imageUrls]);
      
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Map form data to backend format
      const businessData = {
        business_name: formData.businessName,
        product_service_title: formData.productTitle,
        tagline: formData.tagline,
        description: formData.description,
        affiliate_category_id: parseInt(formData.affiliateCategoryId),
        country: formData.country,
        region: formData.region,
        commission_type: formData.commissionType,
        commission_rate: parseFloat(formData.commissionRate),
        cookie_duration: parseInt(formData.cookieDuration),
        allowed_traffic_types: formData.allowedTrafficTypes,
        restrictions: formData.restrictions,
        tracking_link: formData.trackingLink,
        promotional_assets: formData.promotionalAssets || [],
        business_email: formData.businessEmail,
        website_url: formData.websiteUrl,
      };

      const result = await affiliateService.createBusinessOffer(businessData);
      onSubmit(result);
      
      toast.success('Business offer created successfully!');
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // Rest of component remains the same...
};
```

#### **B. Update PromoterAffiliateForm.jsx**
```javascript
// src/Component/affiliates/forms/PromoterAffiliateForm.jsx
const PromoterAffiliateForm = ({ formData, updateFormData, categories, onSubmit, loading }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const response = await apiUtils.uploadFile(file, '/v1/affiliates/upload-image');
      setUploadedImage({
        file,
        preview: URL.createObjectURL(file),
        url: response.url,
        id: response.id
      });
      
      updateFormData('image', response.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const promoterData = {
        title: formData.title,
        description: formData.description,
        affiliate_category_id: parseInt(formData.affiliateCategoryId),
        country: formData.country,
        region: formData.region,
        affiliate_link: formData.affiliateLink,
        image: formData.image,
        hashtags: formData.hashtags,
        target_audience: formData.targetAudience,
      };

      const result = await affiliateService.createUserPost(promoterData);
      onSubmit(result);
      
      toast.success('User post created successfully!');
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // Rest of component remains the same...
};
```

#### **C. Update AffiliateGrid.jsx**
```javascript
// src/Component/affiliates/AffiliateGrid.jsx
const AffiliateGrid = ({ offers, onItemClick, trackClick }) => {
  const handleOfferClick = async (offer) => {
    try {
      // Extract clean ID for API
      const offerType = offer.contentType === 'user' ? 'user' : 'business';
      const offerId = offer.contentType === 'user' 
        ? offer.id.replace('user-', '') 
        : offer.id.replace('business-', '');
      
      // Track analytics
      await trackClick(offerType, parseInt(offerId));
      
      // Open affiliate link
      window.open(offer.tracking_link || offer.affiliate_link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error handling offer click:', error);
      // Still open link even if tracking fails
      window.open(offer.tracking_link || offer.affiliate_link, '_blank', 'noopener,noreferrer');
    }
  };

  // Rest of component remains the same...
};
```

### **5. Authentication Integration**

#### **A. Login Component Update**
```javascript
// src/Component/Auth/Login.jsx
import api from '../api';

const handleLogin = async (email, password) => {
  try {
    const response = await api.post('/login', {
      email,
      password
    });
    
    // Store JWT token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Set default auth header
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    toast.success('Login successful!');
    navigate('/affiliates');
  } catch (error) {
    toast.error('Login failed: ' + error.message);
  }
};
```

#### **B. Auth Service Update**
```javascript
// src/services/AuthService.js
import api from '../api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
```

### **6. Testing the Integration**

#### **A. Backend Testing**
```bash
# Start Laravel development server
php artisan serve

# Test API endpoints
curl -X GET "http://localhost:8000/api/v1/affiliates/categories"
curl -X GET "http://localhost:8000/api/v1/affiliates/business-offers"
curl -X GET "http://localhost:8000/api/v1/affiliates/user-posts"
```

#### **B. Frontend Testing**
```javascript
// src/test-affiliates-integration.js
import affiliateService from './services/AffiliateService';

const runIntegrationTests = async () => {
  console.log('🧪 Running Affiliates Hub Integration Tests...');
  
  try {
    // Test 1: Get Categories
    const categories = await affiliateService.getCategories();
    console.log('✅ Test 1 Passed: Categories loaded', categories.data.length);
    
    // Test 2: Get Business Offers
    const businessOffers = await affiliateService.getBusinessOffers({ per_page: 5 });
    console.log('✅ Test 2 Passed: Business offers loaded', businessOffers.data.data.length);
    
    // Test 3: Get User Posts
    const userPosts = await affiliateService.getUserPosts({ per_page: 5 });
    console.log('✅ Test 3 Passed: User posts loaded', userPosts.data.data.length);
    
    // Test 4: Search Functionality
    const searchResults = await affiliateService.searchAffiliateContent('technology', 'all');
    console.log('✅ Test 4 Passed: Search works', searchResults.data);
    
    // Test 5: Analytics Tracking
    const trackResult = await affiliateService.trackClick('business', 1);
    console.log('✅ Test 5 Passed: Click tracking works', trackResult);
    
    // Test 6: Platform Stats
    const stats = await affiliateService.getPlatformStats();
    console.log('✅ Test 6 Passed: Platform stats loaded', stats.data);
    
    console.log('🎉 All integration tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
};

export default runIntegrationTests;
```

### **7. Production Deployment**

#### **A. Backend Production Setup**
```bash
# Install production dependencies
composer install --optimize-autoloader --no-dev

# Optimize configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set file permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Run production migrations
php artisan migrate --force

# Seed production data
php artisan db:seed --class=AffiliateSeeder --force
```

#### **B. Frontend Production Build**
```bash
# Install production dependencies
npm ci

# Build for production
npm run build

# Test production build
serve -s build
```

#### **C. Environment Configuration**
```env
# Production .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=affiliates_hub_prod
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password

API_BASE_URL=https://your-domain.com/api
FRONTEND_URL=https://your-domain.com

# Security
SANCTUM_STATEFUL_DOMAINS=your-domain.com
SESSION_DOMAIN=your-domain.com
```

## 🔧 Troubleshooting Guide

### **Common Issues & Solutions**

#### **1. CORS Issues**
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'https://your-domain.com'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

#### **2. Authentication Issues**
```javascript
// Check if token is being sent
console.log('Auth Token:', localStorage.getItem('token'));

// Check API headers
console.log('API Headers:', api.defaults.headers);
```

#### **3. File Upload Issues**
```php
// php.ini settings
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
```

#### **4. Database Connection Issues**
```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
```

#### **5. API Response Issues**
```javascript
// Check response structure
console.log('API Response:', response.data);
console.log('Response Status:', response.status);
```

## 📊 Performance Optimization

### **Backend Optimization**
```php
// Enable query logging (development only)
DB::enableQueryLog();

// Use eager loading
$offers = BusinessAffiliateOffer::with(['user', 'affiliateCategory'])->get();

// Implement caching
$categories = Cache::remember('affiliate_categories', 3600, function () {
    return AffiliateCategory::active()->ordered()->get();
});
```

### **Frontend Optimization**
```javascript
// Use React.memo for expensive components
const AffiliateCard = React.memo(({ offer }) => {
  // Component implementation
});

// Use useMemo for expensive calculations
const filteredOffers = useMemo(() => {
  return offers.filter(offer => offer.category === selectedCategory);
}, [offers, selectedCategory]);

// Implement virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';
```

## 🎯 Integration Checklist

### **Backend Setup**
- [ ] Laravel project created and configured
- [ ] Database migrations run successfully
- [ ] API routes configured
- [ ] CORS settings configured
- [ ] File storage configured
- [ ] Authentication middleware set up
- [ ] Validation rules implemented
- [ ] Error handling implemented

### **Frontend Integration**
- [ ] API service layer updated
- [ ] Authentication integrated
- [ ] File upload functionality working
- [ ] All forms submitting correctly
- [ ] Data display working
- [ ] Search and filtering working
- [ ] Analytics tracking working
- [ ] Error handling implemented

### **Testing**
- [ ] All API endpoints tested
- [ ] Frontend-backend connection verified
- [ ] File upload tested
- [ ] Authentication flow tested
- [ ] Error scenarios tested
- [ ] Performance tested

### **Production Ready**
- [ ] Environment variables configured
- [ ] Security measures implemented
- [ ] Performance optimizations applied
- [ ] Monitoring and logging set up
- [ ] Backup strategies implemented
- [ ] Deployment process documented

## 🚀 Next Steps

1. **Run Integration Tests**: Execute the test suite to verify all functionality
2. **Performance Testing**: Load test the API endpoints
3. **Security Audit**: Review authentication and authorization
4. **User Acceptance Testing**: Test complete user workflows
5. **Production Deployment**: Deploy to production environment
6. **Monitoring Setup**: Implement logging and monitoring
7. **Documentation**: Update API documentation for consumers

This comprehensive integration guide ensures that the Laravel backend and React frontend work together seamlessly, providing a complete affiliate marketplace experience.
