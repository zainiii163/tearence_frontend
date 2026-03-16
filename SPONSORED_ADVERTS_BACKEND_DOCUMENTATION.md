# Sponsored Adverts Backend API Documentation

## Overview

This document provides comprehensive backend API specifications for the Sponsored Adverts system in WorldwideAdverts platform. The API follows RESTful conventions and supports full CRUD operations, authentication, analytics, and premium features.

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Database Schema](#database-schema)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Security](#security)
8. [File Upload](#file-upload)
9. [Backend-Frontend Integration](#backend-frontend-integration)

## Base URL

```
https://api.worldwideadverts.com/v1/sponsored
```

For development:
```
http://localhost:8000/v1/sponsored
```

## Authentication

### JWT Token Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Token Refresh

Tokens expire after 24 hours. Use the refresh endpoint to get a new token:

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "<refresh_token>"
}
```

## API Endpoints

### 1. Statistics and Analytics

#### Get Homepage Statistics
```http
GET /stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sponsored_ads": "12,456",
    "countries": 142,
    "total_views": "45.2M",
    "satisfaction": "98%",
    "active_users": "45.2K",
    "revenue": "$125,430"
  }
}
```

#### Get Live Activity Feed
```http
GET /activity?limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "view",
      "message": "Someone viewed a Premium Property in Dubai",
      "timestamp": "2024-01-15T10:30:00Z",
      "icon": "👁️",
      "user_id": 12345,
      "advert_id": 678
    }
  ]
}
```

### 2. Categories

#### Get Sponsored Categories
```http
GET /categories
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Real Estate",
      "slug": "real-estate",
      "icon": "🏠",
      "count": 2341,
      "color": "from-blue-500 to-blue-600",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 3. Sponsored Adverts Management

#### Get All Sponsored Adverts
```http
GET /adverts?page=1&per_page=12&sort=created_at&order=desc
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 12, max: 50)
- `sort` (string): Sort field (created_at, views, rating, price)
- `order` (string): Sort order (asc, desc)
- `category` (string): Filter by category slug
- `country` (string): Filter by country code
- `min_price` (float): Minimum price filter
- `max_price` (float): Maximum price filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Luxury Villa with Ocean View",
      "description": "Stunning 5-bedroom villa with panoramic ocean views",
      "price": 2500000,
      "currency": "USD",
      "category": {
        "id": 1,
        "name": "Real Estate",
        "slug": "real-estate"
      },
      "country": "United Arab Emirates",
      "city": "Dubai",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "seller": {
        "id": 1,
        "name": "Premium Properties",
        "avatar": "https://example.com/avatar.jpg",
        "verified": true,
        "rating": 4.8,
        "reviews": 127
      },
      "views": 15420,
      "rating": 4.9,
      "featured": true,
      "promoted": true,
      "sponsored": true,
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 12,
    "total": 36,
    "has_more": true
  }
}
```

#### Search Sponsored Adverts
```http
GET /search?keyword=luxury&category=real-estate&country=US
Authorization: Bearer <token>
```

**Query Parameters:**
- `keyword` (string): Search keyword
- `category` (string): Category slug
- `country` (string): Country code
- `min_price` (float): Minimum price
- `max_price` (float): Maximum price
- `verified_only` (boolean): Filter verified sellers only
- `page` (integer): Page number
- `per_page` (integer): Items per page

#### Get Single Sponsored Advert
```http
GET /adverts/{id}
Authorization: Bearer <token>
```

#### Create New Sponsored Advert
```http
POST /adverts
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
title: "Luxury Villa with Ocean View"
description: "Stunning 5-bedroom villa..."
price: 2500000
currency: "USD"
category_id: 1
country: "United Arab Emirates"
city: "Dubai"
images: [file1, file2, file3]
video_url: "https://youtube.com/watch?v=..."
seller_info: {
  "business_name": "Premium Properties",
  "contact_email": "contact@premium.com",
  "phone": "+971501234567",
  "website": "https://premiumproperties.com"
}
promotion_plan: "sponsored"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "Luxury Villa with Ocean View",
    "status": "pending_review",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Advert created successfully. It will be reviewed within 24 hours."
}
```

#### Update Sponsored Advert
```http
PUT /adverts/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Sponsored Advert
```http
DELETE /adverts/{id}
Authorization: Bearer <token>
```

### 4. Seller Management

#### Get Seller Profile
```http
GET /sellers/{id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Premium Properties",
    "avatar": "https://example.com/avatar.jpg",
    "verified": true,
    "rating": 4.8,
    "reviews": 127,
    "total_ads": 45,
    "active_ads": 12,
    "member_since": "2023-01-15T00:00:00Z",
    "contact_info": {
      "email": "contact@premium.com",
      "phone": "+971501234567",
      "website": "https://premiumproperties.com"
    },
    "business_info": {
      "license_number": "BR-2023-12345",
      "description": "Premium real estate agency specializing in luxury properties"
    }
  }
}
```

### 5. User Interactions

#### Save/Unsave Advert
```http
POST /save/{advert_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "saved": true,
    "total_saved": 23
  }
}
```

#### Get Saved Adverts
```http
GET /saved?page=1&per_page=12
Authorization: Bearer <token>
```

#### Contact Seller
```http
POST /contact/{advert_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "I'm interested in this property. Please provide more details.",
  "phone": "+1234567890",
  "email": "user@example.com"
}
```

### 6. Analytics and Tracking

#### Track Event
```http
POST /track/{advert_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "event_type": "view",
  "metadata": {
    "source": "search_results",
    "device": "desktop",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
  }
}
```

**Event Types:**
- `view`: Advert viewed
- `click`: Advert clicked
- `save`: Advert saved
- `contact`: Seller contacted
- `share`: Advert shared

#### Get Advert Analytics
```http
GET /analytics/{advert_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_views": 15420,
    "unique_views": 8934,
    "total_clicks": 1245,
    "contact_requests": 67,
    "saves": 234,
    "shares": 89,
    "conversion_rate": 0.54,
    "daily_stats": [
      {
        "date": "2024-01-15",
        "views": 234,
        "clicks": 45,
        "contacts": 3
      }
    ],
    "top_countries": [
      {
        "country": "United States",
        "views": 3456,
        "percentage": 22.4
      }
    ]
  }
}
```

### 7. Premium Features

#### Upgrade Advert
```http
POST /upgrade/{advert_id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "plan_type": "sponsored",
  "duration": 30,
  "payment_method": "credit_card"
}
```

**Plan Types:**
- `promoted`: $29/month - Enhanced visibility, promoted badge
- `featured`: $49/month - Premium placement, featured badge
- `sponsored`: $99/month - Homepage placement, sponsored badge

**Response:**
```json
{
  "success": true,
  "data": {
    "upgrade_id": "up_123456789",
    "plan_type": "sponsored",
    "amount": 99.00,
    "currency": "USD",
    "duration": 30,
    "expires_at": "2024-02-14T10:30:00Z",
    "payment_url": "https://payment.worldwideadverts.com/pay/up_123456789"
  }
}
```

#### Get User's Sponsored Adverts
```http
GET /user-adverts?page=1&per_page=12&status=active
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string): Filter by status (active, pending, expired, paused)

## Database Schema

### sponsored_adverts Table
```sql
CREATE TABLE sponsored_adverts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  category_id INT NOT NULL,
  country VARCHAR(100),
  city VARCHAR(100),
  images JSON,
  video_url VARCHAR(500),
  seller_info JSON,
  views BIGINT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  promoted BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'pending', 'expired', 'paused', 'rejected') DEFAULT 'pending',
  promotion_plan ENUM('free', 'promoted', 'featured', 'sponsored') DEFAULT 'free',
  promotion_expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES sponsored_categories(id),
  INDEX idx_status (status),
  INDEX idx_category (category_id),
  INDEX idx_country (country),
  INDEX idx_price (price),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_search (title, description)
);
```

### sponsored_categories Table
```sql
CREATE TABLE sponsored_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sponsored_analytics Table
```sql
CREATE TABLE sponsored_analytics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  advert_id BIGINT NOT NULL,
  user_id BIGINT,
  event_type ENUM('view', 'click', 'save', 'contact', 'share') NOT NULL,
  metadata JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (advert_id) REFERENCES sponsored_adverts(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_advert_event (advert_id, event_type),
  INDEX idx_created_at (created_at)
);
```

### saved_adverts Table
```sql
CREATE TABLE saved_adverts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  advert_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (advert_id) REFERENCES sponsored_adverts(id),
  UNIQUE KEY unique_user_advert (user_id, advert_id)
);
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "title": ["Title is required"],
      "price": ["Price must be greater than 0"]
    }
  }
}
```

### Error Codes
- `AUTHENTICATION_REQUIRED` (401): User not authenticated
- `AUTHORIZATION_FAILED` (403): User not authorized
- `VALIDATION_ERROR` (400): Input validation failed
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

### Rate Limits
- **Unauthenticated users**: 100 requests per hour
- **Authenticated users**: 1000 requests per hour
- **Premium users**: 5000 requests per hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

## Security

### Input Validation
- All inputs are sanitized and validated
- SQL injection protection via parameterized queries
- XSS protection via content sanitization
- CSRF protection via tokens

### File Upload Security
- Allowed file types: jpg, jpeg, png, gif, webp
- Maximum file size: 5MB per image
- Maximum images per advert: 10
- Virus scanning on all uploads
- Image optimization and compression

### Data Protection
- All sensitive data encrypted at rest
- HTTPS/TLS 1.3 required for all communications
- GDPR compliant data handling
- Regular security audits

## File Upload

### Image Upload Specifications
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```
file: [image_file]
type: "advert_image"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.worldwideadverts.com/images/advert_123.jpg",
    "filename": "advert_123.jpg",
    "size": 1024000,
    "dimensions": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

### Video Upload Specifications
```http
POST /upload/video
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Specifications:**
- Allowed formats: mp4, avi, mov, wmv
- Maximum file size: 100MB
- Maximum duration: 5 minutes
- Automatic transcoding to multiple formats

## Testing

### Postman Collection
A complete Postman collection is available at:
`WWA_Sponsored_Adverts_API.postman_collection.json`

### Test Environment
- **Base URL**: `https://api-staging.worldwideadverts.com/v1/sponsored`
- **Test User**: `test@worldwideadverts.com`
- **Test Password**: `TestPassword123!`

## Deployment

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=worldwideadverts_sponsored
DB_USER=wwa_user
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# File Storage
UPLOAD_PATH=/var/www/uploads/sponsored
CDN_URL=https://cdn.worldwideadverts.com

# Email
SMTP_HOST=smtp.worldwideadverts.com
SMTP_PORT=587
SMTP_USER=noreply@worldwideadverts.com
SMTP_PASSWORD=email_password

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
```

### Deployment Checklist
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] File permissions set
- [ ] Redis cache configured
- [ ] Load balancer configured
- [ ] Monitoring tools installed
- [ ] Backup procedures tested

## Support

### API Support
- **Email**: api-support@worldwideadverts.com
- **Documentation**: https://docs.worldwideadverts.com/sponsored
- **Status Page**: https://status.worldwideadverts.com

### Changelog
- **v1.0.0** (2024-01-15): Initial release
- **v1.1.0** (2024-01-20): Added analytics endpoints
- **v1.2.0** (2024-01-25): Enhanced search functionality
- **v1.3.0** (2024-02-01): Added premium features

## Backend-Frontend Integration

### Overview

This section explains how the backend should integrate with the frontend components that have been updated to use real API data instead of mock data.

### Frontend Components Integration

The following frontend components have been updated to use real API endpoints:

#### 1. SponsoredActivityFeed
- **API Endpoint**: `GET /v1/sponsored/activity`
- **Data Flow**: Fetches real-time activity data every 4 seconds
- **Backend Requirements**: Must return activity data with user actions, timestamps, and metadata
- **Response Format**: 
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "view",
      "user_name": "John Doe",
      "advert_title": "Luxury Property",
      "advert_country": "USA",
      "advert_city": "New York",
      "created_at": "2024-01-15T10:30:00Z",
      "icon": "👁️",
      "message": "viewed sponsored advert"
    }
  ]
}
```

#### 2. SponsoredCategoryGrid
- **API Endpoint**: `GET /v1/sponsored/categories`
- **Data Flow**: Loads categories dynamically on component mount
- **Backend Requirements**: Must return category list with icons, counts, and colors
- **Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Property",
      "slug": "real-estate",
      "icon": "🏠",
      "count": 2341,
      "color": "from-blue-500 to-blue-600",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 3. SponsoredHero
- **API Endpoint**: `GET /v1/sponsored/categories`
- **Data Flow**: Uses same categories endpoint as grid component
- **Backend Requirements**: Categories must include search-friendly metadata

#### 4. SponsoredFilters
- **API Endpoint**: `GET /v1/sponsored/categories`
- **Data Flow**: Dynamic category loading for filter options
- **Backend Requirements**: Categories should be filterable by country, price range, etc.

#### 5. SponsoredAdvertCard
- **API Endpoints**: 
  - `POST /v1/sponsored/track/{advert_id}` - Event tracking
  - `POST /v1/sponsored/save/{advert_id}` - Save/unsave functionality
- **Data Flow**: Tracks user interactions (views, clicks, saves) in real-time
- **Backend Requirements**: Must handle analytics events and update engagement metrics
- **Event Tracking Format**:
```json
{
  "event_type": "view",
  "metadata": {
    "source": "card_click",
    "device": "desktop",
    "category": "real-estate",
    "price": 2500000
  }
}
```

#### 6. SponsoredPostForm
- **API Endpoint**: `POST /v1/sponsored/adverts`
- **Data Flow**: Submits new sponsored adverts with comprehensive data
- **Backend Requirements**: Must handle multipart form data and file uploads
- **Submission Format**:
```json
{
  "advert_type": "property",
  "title": "Luxury Villa",
  "description": "Stunning 5-bedroom villa...",
  "category_id": 1,
  "country": "United Arab Emirates",
  "city": "Dubai",
  "price": 2500000,
  "video_url": "https://youtube.com/watch?v=...",
  "seller_info": {
    "business_name": "Premium Properties",
    "contact_email": "contact@premium.com",
    "phone": "+971501234567"
  },
  "location": {
    "address": "Palm Jumeirah",
    "coordinates": [25.2048, 55.2708]
  },
  "sponsored_tier": "sponsored",
  "status": "pending_payment"
}
```

#### 7. SponsoredSellerProfile
- **API Endpoints**: 
  - `GET /v1/sponsored/sellers/{seller_id}` - Seller profile data
  - `POST /v1/sponsored/contact/{advert_id}` - Contact seller
- **Data Flow**: Loads detailed seller information and handles messaging
- **Backend Requirements**: Must return comprehensive seller data with verification status
- **Seller Profile Format**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Premium Properties",
    "avatar": "https://example.com/avatar.jpg",
    "verified": true,
    "rating": 4.8,
    "reviews": 127,
    "total_ads": 45,
    "active_ads": 12,
    "member_since": "2023-01-15T00:00:00Z",
    "contact_info": {
      "email": "contact@premium.com",
      "phone": "+971501234567",
      "website": "https://premiumproperties.com"
    },
    "business_info": {
      "license_number": "BR-2023-12345",
      "description": "Premium real estate agency"
    }
  }
}
```

### API Implementation Requirements

#### 1. Response Format Standardization
All API responses must follow this consistent format:

```json
{
  "success": boolean,
  "data": object|array,
  "message": string (optional, for errors),
  "meta": {
    "current_page": number,
    "last_page": number,
    "per_page": number,
    "total": number
  }
}
```

#### 2. Error Handling
- **400 Bad Request**: Validation errors with detailed field messages
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server**: Server error with generic message

#### 3. Real-time Features
- **Activity Feed**: Must support Server-Sent Events (SSE) or WebSocket connections
- **Analytics Tracking**: Must process events immediately and update metrics
- **Live Updates**: Should push new activities to connected clients

#### 4. Caching Strategy
- **Categories**: Cache for 1 hour (categories don't change frequently)
- **Activity**: Cache for 30 seconds (real-time data)
- **Seller Profiles**: Cache for 15 minutes (user data changes occasionally)
- **Adverts**: Cache for 5 minutes (dynamic pricing and availability)

#### 5. Database Optimization
- **Indexes**: Ensure proper indexes on frequently queried fields
  ```sql
  CREATE INDEX idx_sponsored_adverts_category ON sponsored_adverts(category_id);
  CREATE INDEX idx_sponsored_adverts_country ON sponsored_adverts(country);
  CREATE INDEX idx_sponsored_adverts_price ON sponsored_adverts(price);
  CREATE INDEX idx_sponsored_adverts_status ON sponsored_adverts(status);
  CREATE INDEX idx_sponsored_analytics_event ON sponsored_analytics(event_type, created_at);
  ```

- **Partitions**: Consider partitioning large tables by date for analytics

#### 6. Security Implementation
- **Input Validation**: Sanitize all inputs and validate data types
- **SQL Injection Prevention**: Use parameterized queries exclusively
- **File Upload Security**: Scan uploads for malware, validate file types
- **Rate Limiting**: Implement per-user and per-IP rate limits

### Testing Requirements

#### 1. API Testing
- **Postman Collection**: Use provided `WWA_Sponsored_Adverts_API.postman_collection.json`
- **Unit Tests**: Test all endpoints with various input scenarios
- **Integration Tests**: Test frontend-backend communication

#### 2. Performance Testing
- **Load Testing**: Test with 1000+ concurrent users
- **Response Time**: API responses should be <200ms for cached data
- **Database Queries**: Optimize slow queries (>100ms)

### Deployment Considerations

#### 1. Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=worldwideadverts_sponsored
DB_USER=wwa_user
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# File Storage
UPLOAD_PATH=/var/www/uploads/sponsored
CDN_URL=https://cdn.worldwideadverts.com

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
```

#### 2. Scaling Considerations
- **Horizontal Scaling**: Load balance multiple API servers
- **Database Scaling**: Read replicas for analytics queries
- **Cache Layer**: Redis cluster for session and data caching
- **CDN Integration**: Serve static assets via CDN globally

---

This documentation provides a complete reference for implementing the Sponsored Adverts backend system with full frontend integration. All endpoints are designed to be scalable, secure, and follow RESTful best practices.
