# WorldwideAdverts Services Marketplace - Backend Integration Documentation

## Overview

This document provides comprehensive backend API specifications for integrating the enhanced Services Marketplace frontend with your backend infrastructure. The frontend has been transformed into a modern, Fiverr-style marketplace with advanced features including service posting, provider profiles, upsell management, and real-time analytics.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Services Management](#services-management)
3. [Categories Management](#categories-management)
4. [Provider Management](#provider-management)
5. [Upsell & Promotion System](#upsell--promotion-system)
6. [Analytics & Reporting](#analytics--reporting)
7. [Search & Filtering](#search--filtering)
8. [Reviews & Ratings](#reviews--ratings)
9. [File Upload & Media Management](#file-upload--media-management)
10. [Real-time Features](#real-time-features)
11. [Database Schema](#database-schema)
12. [API Response Formats](#api-response-formats)

---

## Authentication & Authorization

### Endpoints

#### POST `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "provider",
      "verification_status": "verified",
      "profile_photo": "https://example.com/photos/user1.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

#### POST `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "provider",
  "business_name": "Creative Studio Pro",
  "country": "United States",
  "city": "New York"
}
```

#### POST `/api/auth/refresh`
```json
{
  "refresh_token": "refresh_token_here"
}
```

#### POST `/api/auth/logout`
Headers: `Authorization: Bearer {token}`

---

## Services Management

### GET `/api/services`
**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20)
- `category_id` (integer): Filter by category
- `country` (string): Filter by country
- `min_price` (float): Minimum price filter
- `max_price` (float): Maximum price filter
- `service_type` (string): "freelance" | "local" | "business"
- `promotion_type` (string): "promoted" | "featured" | "sponsored" | "network_boost"
- `verified_only` (boolean): Filter verified providers only
- `sort_by` (string): "created_at" | "rating" | "starting_price" | "views" | "enquiries"
- `search` (string): Search query

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Professional Logo Design",
      "tagline": "Stunning logos that make your brand stand out",
      "description": "Full service description here...",
      "category": {
        "id": 1,
        "name": "Graphic Design",
        "slug": "graphic-design",
        "icon": "🎨"
      },
      "service_provider": {
        "id": 1,
        "business_name": "Creative Studio Pro",
        "user": {
          "name": "John Doe",
          "profile_photo": "https://example.com/photos/user1.jpg"
        }
      },
      "starting_price": 50,
      "delivery_time": "3 days",
      "country": "United States",
      "city": "New York",
      "skills": ["Logo Design", "Brand Identity", "UI/UX Design"],
      "rating": 4.9,
      "review_count": 45,
      "views": 1250,
      "enquiries": 89,
      "orders": 342,
      "is_verified": true,
      "promotion_type": "featured",
      "media": [
        {
          "id": 1,
          "file_path": "https://example.com/services/service1-thumb.jpg",
          "is_thumbnail": true
        }
      ],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T15:45:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 25,
    "total_items": 500,
    "items_per_page": 20,
    "has_next": true,
    "has_prev": false,
    "next_page_url": "/api/services?page=2",
    "prev_page_url": null
  }
}
```

### POST `/api/services`
**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Form Data:**
- `service_type` (string): "freelance" | "local" | "business"
- `provider_info[business_name]` (string)
- `provider_info[description]` (text)
- `provider_info[website]` (string)
- `provider_info[phone]` (string)
- `service_details[title]` (string)
- `service_details[tagline]` (string)
- `service_details[category]` (string)
- `service_details[subcategory]` (string)
- `service_details[starting_price]` (float)
- `service_details[delivery_time]` (integer)
- `description[full_description]` (text)
- `description[whats_included]` (text)
- `description[whats_not_included]` (text)
- `description[requirements]` (text)
- `description[experience]` (text)
- `description[languages]` (string)
- `service_media[thumbnail]` (file)
- `service_media[portfolio_images][]` (files)
- `service_media[video_link]` (string)
- `service_media[pdf_portfolio]` (file)
- `promotion[tier]` (string): "promoted" | "featured" | "sponsored" | "network_boost"
- `promotion[duration]` (integer): 7 | 30 | 90 | 365
- `terms[accurate]` (boolean)
- `terms[agree]` (boolean)

### GET `/api/services/{id}`
**Response:** Single service object with full details

### PUT `/api/services/{id}`
**Headers:** `Authorization: Bearer {token}`
Update service details

### DELETE `/api/services/{id}`
**Headers:** `Authorization: Bearer {token}`
Delete service

---

## Categories Management

### GET `/api/categories`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Graphic Design",
      "slug": "graphic-design",
      "icon": "🎨",
      "description": "Logo design, branding, and visual identity services",
      "active_services_count": 1250,
      "is_trending": true,
      "growth_percentage": 15.5
    }
  ]
}
```

### GET `/api/categories/{slug}/services`
Services filtered by category

---

## Provider Management

### GET `/api/providers/{id}`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "business_name": "Creative Studio Pro",
    "email": "john@example.com",
    "phone": "+1 234 567 8900",
    "website": "https://johndesigner.com",
    "country": "United States",
    "city": "New York",
    "bio": "Professional graphic designer with 8+ years of experience...",
    "skills": ["Logo Design", "Brand Identity", "UI/UX Design"],
    "languages": ["English (Native)", "Spanish (Fluent)"],
    "member_since": "2022-01-15",
    "response_time": "1 hour",
    "last_delivery": "2 days ago",
    "total_orders": 342,
    "total_earnings": 45230.50,
    "average_rating": 4.9,
    "total_reviews": 128,
    "verification_status": "verified",
    "profile_photo": "https://example.com/photos/user1.jpg",
    "cover_photo": "https://example.com/covers/user1.jpg",
    "services": [
      {
        "id": 1,
        "title": "Professional Logo Design",
        "price": 50,
        "delivery_time": "3 days",
        "rating": 4.9,
        "reviews": 45
      }
    ],
    "reviews": [
      {
        "id": 1,
        "buyer": "Sarah Johnson",
        "rating": 5,
        "comment": "Absolutely fantastic work!",
        "service": "Professional Logo Design",
        "created_at": "2024-01-10T10:30:00Z"
      }
    ]
  }
}
```

### GET `/api/providers/{id}/services`
Services by specific provider

### POST `/api/providers/{id}/follow`
**Headers:** `Authorization: Bearer {token}`

### DELETE `/api/providers/{id}/follow`
**Headers:** `Authorization: Bearer {token}`

---

## Upsell & Promotion System

### GET `/api/promotions/tiers`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "promoted",
      "name": "Promoted",
      "price": 29.00,
      "duration_days": [7, 30, 90, 365],
      "features": [
        "Highlighted listing",
        "Appears above standard services",
        "\"Promoted\" badge",
        "2× more visibility"
      ],
      "is_popular": false
    },
    {
      "id": "featured",
      "name": "Featured",
      "price": 59.00,
      "duration_days": [7, 30, 90, 365],
      "features": [
        "Top of category pages",
        "Larger service card",
        "Priority in search results",
        "Weekly \"Featured Services\" email",
        "\"Featured\" badge"
      ],
      "is_popular": true
    },
    {
      "id": "sponsored",
      "name": "Sponsored",
      "price": 99.00,
      "duration_days": [7, 30, 90, 365],
      "features": [
        "Homepage placement",
        "Category top placement",
        "Homepage slider inclusion",
        "Social media promotion",
        "\"Sponsored\" badge"
      ],
      "is_popular": false
    },
    {
      "id": "network_boost",
      "name": "Network-Wide Boost",
      "price": 199.00,
      "duration_days": [7, 30, 90, 365],
      "features": [
        "Appears across all pages",
        "Homepage, category & search",
        "Newsletter inclusion",
        "Push notifications",
        "\"Top Spotlight\" badge"
      ],
      "is_popular": false
    }
  ]
}
```

### POST `/api/promotions/purchase`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "service_id": 1,
  "tier": "featured",
  "duration": 30,
  "payment_method": "stripe"
}
```

### POST `/api/promotions/calculate-total`
**Request:**
```json
{
  "tier": "featured",
  "duration": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "base_price": 59.00,
    "duration": 30,
    "total": 59.00,
    "currency": "USD"
  }
}
```

---

## Analytics & Reporting

### GET `/api/analytics/dashboard`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_services": 10000,
      "active_providers": 2500,
      "total_orders": 50000,
      "total_revenue": 1250000.00,
      "satisfaction_rate": 98.5
    },
    "recent_activity": [
      {
        "id": 1,
        "activity_type": "view",
        "message": "A user from Germany viewed a graphic design service in London",
        "country": "Germany",
        "location": "Berlin",
        "created_at": "2024-01-15T14:30:00Z"
      },
      {
        "id": 2,
        "activity_type": "enquiry",
        "message": "New enquiry received for web development service in Dubai",
        "country": "UAE",
        "location": "Dubai",
        "created_at": "2024-01-15T14:25:00Z"
      }
    ],
    "trending_services": [
      {
        "id": 1,
        "title": "Professional Logo Design",
        "category": {
          "id": 1,
          "name": "Graphic Design",
          "icon": "🎨"
        },
        "provider": {
          "name": "John Doe"
        },
        "activities_count": 450,
        "growth_percentage": 25.5
      }
    ],
    "trending_countries": [
      {
        "country": "United States",
        "count": 2500,
        "growth_percentage": 12.5
      },
      {
        "country": "United Kingdom",
        "count": 1800,
        "growth_percentage": 18.2
      }
    ]
  }
}
```

### GET `/api/analytics/provider/{id}`
Provider-specific analytics

### GET `/api/analytics/service/{id}`
Service-specific analytics

---

## Search & Filtering

### GET `/api/search/services`
**Advanced search with filters:**
```json
{
  "query": "logo design",
  "filters": {
    "category_id": 1,
    "price_range": {
      "min": 50,
      "max": 500
    },
    "location": "United States",
    "service_type": "freelance",
    "delivery_time": {
      "max": 7
    },
    "rating": {
      "min": 4.0
    },
    "verified_only": true
  },
  "sort": {
    "field": "rating",
    "order": "desc"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

### GET `/api/search/suggestions`
**Query parameter:** `q` (string)

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      "logo design",
      "brand identity",
      "graphic design"
    ],
    "categories": [
      "Graphic Design",
      "Brand Identity"
    ],
    "providers": [
      "John Designer",
      "Creative Studio Pro"
    ]
  }
}
```

---

## Reviews & Ratings

### GET `/api/reviews/service/{service_id}`
**Query Parameters:**
- `page` (integer)
- `limit` (integer)
- `sort` (string): "newest" | "oldest" | "highest" | "lowest"

### POST `/api/reviews/service/{service_id}`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "rating": 5,
  "comment": "Excellent work, delivered on time!",
  "service_title": "Professional Logo Design"
}
```

### PUT `/api/reviews/{review_id}`
Update own review

### DELETE `/api/reviews/{review_id}`
Delete own review

---

## File Upload & Media Management

### POST `/api/upload/service-media`
**Headers:** `Authorization: Bearer {token}`

**Form Data:**
- `file` (file)
- `type` (string): "thumbnail" | "portfolio" | "pdf"
- `service_id` (integer, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "file_id": "abc123def456",
    "file_path": "https://example.com/uploads/services/abc123def456.jpg",
    "file_name": "service-image.jpg",
    "file_size": 1024000,
    "mime_type": "image/jpeg",
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
}
```

### DELETE `/api/upload/{file_id}`
**Headers:** `Authorization: Bearer {token}`

### GET `/api/upload/{file_id}`
Get file information

---

## Real-time Features

### WebSocket Connection
**Endpoint:** `wss://your-domain.com/ws/marketplace`

**Authentication:** Send token after connection
```json
{
  "type": "auth",
  "token": "Bearer {token}"
}
```

### Real-time Events
**Service Activity:**
```json
{
  "type": "service_activity",
  "data": {
    "service_id": 1,
    "activity_type": "view",
    "user_id": 123,
    "country": "Germany",
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

**New Enquiry:**
```json
{
  "type": "new_enquiry",
  "data": {
    "service_id": 1,
    "enquiry_id": 456,
    "provider_id": 1,
    "buyer_id": 123,
    "message": "Interested in your service",
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

**Live Activity Feed:**
```json
{
  "type": "live_activity",
  "data": {
    "activities": [
      {
        "id": 1,
        "activity_type": "view",
        "message": "A user from Germany viewed a graphic design service",
        "country": "Germany",
        "location": "Berlin",
        "created_at": "2024-01-15T14:30:00Z"
      }
    ]
  }
}
```

---

## Database Schema

### Services Table
```sql
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    service_type ENUM('freelance', 'local', 'business') NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    category_id BIGINT,
    subcategory VARCHAR(100),
    starting_price DECIMAL(10,2) NOT NULL,
    delivery_time INT,
    country VARCHAR(100),
    city VARCHAR(100),
    skills JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    views INT DEFAULT 0,
    enquiries INT DEFAULT 0,
    orders INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    promotion_type ENUM('standard', 'promoted', 'featured', 'sponsored', 'network_boost') DEFAULT 'standard',
    promotion_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_country (country),
    INDEX idx_price (starting_price),
    INDEX idx_rating (rating),
    INDEX idx_promotion (promotion_type),
    INDEX idx_created (created_at)
);
```

### Service Media Table
```sql
CREATE TABLE service_media (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    is_thumbnail BOOLEAN DEFAULT FALSE,
    file_type ENUM('image', 'video', 'pdf') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

### Promotions Table
```sql
CREATE TABLE promotions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    tier ENUM('promoted', 'featured', 'sponsored', 'network_boost') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id),
    INDEX idx_service (service_id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_provider (provider_id)
);
```

### Activity Log Table
```sql
CREATE TABLE activity_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    service_id BIGINT,
    activity_type ENUM('view', 'enquiry', 'order', 'add', 'update') NOT NULL,
    message TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_activity_type (activity_type),
    INDEX idx_created (created_at)
);
```

---

## API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Email format is invalid"
    }
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 25,
    "total_items": 500,
    "items_per_page": 20,
    "has_next": true,
    "has_prev": false,
    "next_page_url": "/api/services?page=2",
    "prev_page_url": null
  }
}
```

---

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=worldwideadverts
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# File Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Payment (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Redis (for real-time features)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

---

## Integration Steps

### 1. Backend Setup
1. Set up database with provided schema
2. Configure environment variables
3. Implement authentication middleware
4. Set up file upload handling
5. Configure WebSocket server for real-time features

### 2. Frontend Integration
1. Update API base URLs in environment files
2. Configure authentication token storage
3. Set up WebSocket client
4. Test all API endpoints
5. Implement error handling

### 3. Testing
1. Test service creation flow
2. Test search and filtering
3. Test promotion purchases
4. Test real-time features
5. Load testing for performance

---

## Security Considerations

1. **Authentication:** Use JWT tokens with proper expiration
2. **File Upload:** Validate file types, sizes, and scan for malware
3. **Input Validation:** Sanitize all user inputs
4. **Rate Limiting:** Implement API rate limiting
5. **HTTPS:** Enforce HTTPS in production
6. **CORS:** Configure proper CORS policies
7. **SQL Injection:** Use parameterized queries
8. **XSS:** Sanitize user-generated content

---

## Performance Optimization

1. **Database Indexing:** Proper indexes on frequently queried fields
2. **Caching:** Redis for frequently accessed data
3. **CDN:** Use CDN for file uploads
4. **Pagination:** Efficient pagination for large datasets
5. **Lazy Loading:** Implement for images and content
6. **Compression:** Gzip compression for API responses

---

## Monitoring & Logging

1. **API Logs:** Log all API requests and responses
2. **Error Tracking:** Implement error monitoring (Sentry, etc.)
3. **Performance Metrics:** Track response times and throughput
4. **User Analytics:** Track user behavior and engagement
5. **System Health:** Monitor server resources and uptime

---

This documentation provides a comprehensive foundation for building a robust backend that supports all the advanced features of your enhanced Services Marketplace frontend. The APIs are designed to be RESTful, secure, and scalable, with proper error handling and real-time capabilities.
