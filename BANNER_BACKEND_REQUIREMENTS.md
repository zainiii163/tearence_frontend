# Banner Adverts Backend Requirements

## Database Schema

### Tables Needed:

#### 1. banner_categories
```sql
CREATE TABLE banner_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  active_banners_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. banner_ads
```sql
CREATE TABLE banner_ads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  banner_image VARCHAR(500),
  destination_link VARCHAR(500),
  business_name VARCHAR(255),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(500),
  country VARCHAR(100),
  city VARCHAR(100),
  banner_category_id BIGINT,
  banner_size VARCHAR(50),
  promotion_tier ENUM('free', 'promoted', 'featured', 'sponsored'),
  is_verified_business BOOLEAN DEFAULT FALSE,
  is_currently_promoted BOOLEAN DEFAULT FALSE,
  is_currently_valid BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0.00,
  status ENUM('active', 'pending', 'expired') DEFAULT 'pending',
  user_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (banner_category_id) REFERENCES banner_categories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 3. banner_clicks
```sql
CREATE TABLE banner_clicks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  banner_id BIGINT,
  user_id BIGINT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (banner_id) REFERENCES banner_ads(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 4. banner_uploads
```sql
CREATE TABLE banner_uploads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  banner_id BIGINT,
  file_type ENUM('banner_image', 'business_logo', 'animated_banner', 'html5_banner', 'video_banner'),
  filename VARCHAR(500),
  file_path VARCHAR(500),
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (banner_id) REFERENCES banner_ads(id)
);
```

## API Endpoints Implementation

### Authentication Middleware
```php
// middleware/auth.php
function authenticate() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Authentication required']);
        exit;
    }
    
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    // Validate JWT token
    $user = validateJWT($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid token']);
        exit;
    }
    
    return $user;
}
```

### Banner Categories Controller
```php
// controllers/BannerCategoriesController.php
class BannerCategoriesController {
    public function getAll() {
        $categories = DB::table('banner_categories')->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }
    
    public function getTrending($limit = 10) {
        $categories = DB::table('banner_categories')
            ->orderBy('active_banners_count', 'desc')
            ->limit($limit)
            ->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }
    
    public function create(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:banner_categories',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10'
        ]);
        
        $category = BannerCategory::create($validated);
        return response()->json(['success' => true, 'data' => $category], 201);
    }
}
```

### Banner Ads Controller
```php
// controllers/BannerAdsController.php
class BannerAdsController {
    public function getAll(Request $request) {
        $query = BannerAd::with('category');
        
        // Apply filters
        if ($request->category_id) {
            $query->where('banner_category_id', $request->category_id);
        }
        
        if ($request->country && $request->country !== 'all') {
            $query->where('country', $request->country);
        }
        
        if ($request->banner_size && $request->banner_size !== 'all') {
            $query->where('banner_size', $request->banner_size);
        }
        
        if ($request->promotion_tier && $request->promotion_tier !== 'all') {
            $query->where('promotion_tier', $request->promotion_tier);
        }
        
        if ($request->verified_only) {
            $query->where('is_verified_business', true);
        }
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('business_name', 'like', '%' . $request->search . '%');
            });
        }
        
        // Apply sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);
        
        // Pagination
        $perPage = $request->limit ?? 20;
        $page = $request->page ?? 1;
        $total = $query->count();
        
        $banners = $query->offset(($page - 1) * $perPage)
                      ->limit($perPage)
                      ->get();
        
        return response()->json([
            'success' => true,
            'data' => $banners,
            'meta' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => ceil($total / $perPage)
            ]
        ]);
    }
    
    public function create(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'banner_category_id' => 'required|exists:banner_categories,id',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'banner_size' => 'required|string',
            'destination_link' => 'required|url',
            'business_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:50',
            'promotion_tier' => 'required|in:free,promoted,featured,sponsored',
            'terms_accepted' => 'required|boolean',
            'privacy_accepted' => 'required|boolean'
        ]);
        
        $validated['user_id'] = auth()->id();
        $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        
        $banner = BannerAd::create($validated);
        
        return response()->json(['success' => true, 'data' => $banner], 201);
    }
    
    public function trackClick($slug) {
        $banner = BannerAd::where('slug', $slug)->firstOrFail();
        
        // Increment click count
        $banner->increment('clicks_count');
        
        // Update CTR
        $ctr = $banner->views_count > 0 
            ? ($banner->clicks_count / $banner->views_count) * 100 
            : 0;
        $banner->update(['ctr' => round($ctr, 2)]);
        
        // Log click
        BannerClick::create([
            'banner_id' => $banner->id,
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
        
        return response()->json(['success' => true, 'message' => 'Click tracked successfully']);
    }
}
```

### File Upload Controller
```php
// controllers/BannerUploadController.php
class BannerUploadController {
    public function uploadBannerImage(Request $request) {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            'banner_size' => 'required|string'
        ]);
        
        $file = $request->file('image');
        $filename = 'banner_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('banners', $filename, 'public');
        
        return response()->json([
            'success' => true,
            'data' => [
                'filename' => $filename,
                'url' => Storage::url($path),
                'size' => $file->getSize()
            ]
        ]);
    }
}
```

## Component Interaction Flow

### BannerCard Component
```javascript
// User clicks banner card
const handleBannerClick = async (banner) => {
  try {
    // 1. Track click via API
    await bannerAdsApi.trackClick(banner.slug);
    
    // 2. Update local state
    setSelectedBanner(banner);
    
    // 3. Track recently viewed
    trackRecentlyViewed(banner);
    
    // 4. Show modal or navigate
    setShowBannerModal(true);
  } catch (error) {
    console.error('Failed to track click:', error);
    // Still show modal even if tracking fails
    setSelectedBanner(banner);
    setShowBannerModal(true);
  }
};
```

### BannerPostForm Component
```javascript
// Form submission flow
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    // 1. Validate form
    if (!validateStep(9)) return;
    
    // 2. Prepare data
    const bannerData = {
      title: formData.title,
      description: formData.description,
      banner_category_id: formData.category,
      country: formData.country,
      // ... other fields
    };
    
    // 3. Create banner via API
    const response = await bannerAdsApi.create(bannerData);
    
    // 4. Handle file uploads
    if (formData.bannerFile) {
      await bannerUploadApi.uploadBannerImage(formData.bannerFile, formData.bannerSize);
    }
    
    // 5. Show success message
    toast.success('Banner created successfully!');
    
    // 6. Close form and refresh data
    onClose();
    refetchBanners();
    
  } catch (error) {
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
```

### BannerFilters Component
```javascript
// Category filtering
const handleCategoryChange = (category) => {
  // 1. Update local state
  setSelectedCategory(category);
  
  // 2. Trigger API refetch
  refetchBanners({
    category_id: category !== 'all' ? category : undefined,
    // ... other filters
  });
  
  // 3. Update URL params
  updateSearchParams({ category });
};
```

## Required Backend Features

### 1. Authentication System
- JWT token generation and validation
- User registration and login
- Token refresh mechanism
- Role-based permissions

### 2. File Storage
- Cloud storage integration (AWS S3, etc.)
- File validation and virus scanning
- Image optimization and resizing
- CDN integration for fast delivery

### 3. Analytics System
- Real-time click tracking
- View counting
- CTR calculation
- Geographic analytics
- Device breakdown

### 4. Search and Filtering
- Full-text search capability
- Advanced filtering options
- Pagination with metadata
- Sorting and ordering

### 5. Security Features
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting

### 6. Performance Optimization
- Database indexing
- Query optimization
- Caching strategies
- CDN implementation

## Technology Stack Recommendations

### Backend Frameworks
- **PHP**: Laravel (recommended)
- **Node.js**: Express.js
- **Python**: Django/FastAPI
- **Java**: Spring Boot

### Database
- **MySQL**: Primary choice
- **PostgreSQL**: Advanced features
- **MongoDB**: Document storage

### File Storage
- **AWS S3**: Cloud storage
- **Cloudinary**: Image optimization
- **Local Storage**: Development only

### Search
- **Elasticsearch**: Advanced search
- **MySQL Full-Text**: Basic search
- **Algolia**: Managed search

### Analytics
- **Google Analytics**: Web analytics
- **Mixpanel**: User behavior
- **Custom Analytics**: Detailed tracking

## Deployment Considerations

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=banner_adverts
DB_USER=banner_user
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-very-secure-jwt-secret-key
JWT_EXPIRY=86400

# File Storage
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AWS_BUCKET=banner-uploads

# API
API_URL=https://api.worldwideadverts.com
CORS_ORIGIN=https://worldwideadverts.com
```

### Docker Setup
```dockerfile
FROM php:8.1-fpm

# Install extensions
RUN docker-php-ext-install pdo_mysql gd zip

# Copy application
COPY . /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000
CMD ["php-fpm"]
```

This backend specification provides everything needed to support the comprehensive Banner Adverts system with real-time data, analytics, and user interactions.
