# Books Marketplace Backend Integration Guide

## Overview
This document explains how the Books Marketplace frontend components work and what backend API endpoints and database structure are needed to support them.

## Frontend Architecture

### Main Components
1. **BooksPage.jsx** - Main marketplace page
2. **BooksGrid.jsx** - Book listings with pagination
3. **BooksCard.jsx** - Individual book display cards
4. **BooksFilters.jsx** - Advanced filtering system
5. **BooksPostForm.jsx** - Multi-step book posting form
6. **BooksActivityFeed.jsx** - Live activity feed

### API Service Layer
- **booksAPI.js** - Centralized API service with all endpoints

---

## Backend API Requirements

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All endpoints (except GET) require JWT authentication:
```
Authorization: Bearer <token>
```

---

## API Endpoints

### 1. Books Management

#### GET /books-adverts
Get books list with advanced filtering and pagination.

**Query Parameters:**
```javascript
{
  search: "string",           // Search in title, author, description
  genre: "string",            // Filter by genre
  country: "string",          // Filter by country
  format: "string",           // Filter by format (paperback, ebook, etc.)
  book_type: "string",        // Filter by type (fiction, non-fiction, etc.)
  language: "string",         // Filter by language
  min_price: "number",        // Minimum price filter
  max_price: "number",        // Maximum price filter
  verified_only: "boolean",   // Only verified authors
  promoted_only: "boolean",   // Only promoted books
  sort_by: "string",          // Sort field (created_at, title, price, views_count, saves_count, rating)
  sort_order: "string",        // Sort direction (asc, desc)
  per_page: "number",         // Items per page (default: 12)
  page: "number"              // Page number (default: 1)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "The Great Adventure",
        "subtitle": "An Epic Journey",
        "slug": "the-great-adventure",
        "description": "Book description...",
        "short_description": "Brief description",
        "author_name": "John Smith",
        "author_bio": "Author bio...",
        "publisher": "Acme Publishing",
        "isbn": "978-0123456789",
        "pages": 350,
        "language": "en",
        "genre": "Fiction",
        "format": "paperback",
        "book_type": "fiction",
        "price": "19.99",
        "currency": "USD",
        "country": "United States",
        "publication_date": "2024-01-15",
        "cover_image_url": "https://example.com/cover.jpg",
        "additional_images": ["url1", "url2"],
        "trailer_video_url": "https://youtube.com/watch?v=...",
        "sample_files": ["url1", "url2"],
        "purchase_links": [
          {
            "platform": "Amazon",
            "url": "https://amazon.com/..."
          }
        ],
        "location_address": "123 Main St, New York, NY",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "views_count": 1250,
        "saves_count": 89,
        "rating": 4.5,
        "reviews_count": 23,
        "verified_author": true,
        "advert_type": "featured", // basic, promoted, featured, sponsored
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "current_page": 1,
    "last_page": 10,
    "per_page": 12,
    "total": 120,
    "filters": {
      "genres": ["Fiction", "Non-Fiction", "Mystery", "Romance"],
      "formats": ["paperback", "hardcover", "ebook", "audiobook"],
      "book_types": ["fiction", "non-fiction", "children", "academic"],
      "languages": ["en", "es", "fr", "de"],
      "countries": ["United States", "United Kingdom", "Canada"]
    }
  }
}
```

#### GET /books-adverts/{slug}
Get single book details by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    // Same book object as above with full details
  }
}
```

#### POST /books-adverts
Create new book advert.

**Request:** `multipart/form-data`
```javascript
{
  book_type: "fiction",
  title: "Book Title",
  subtitle: "Optional subtitle",
  description: "Full description",
  short_description: "Brief description",
  author_name: "Author Name",
  author_bio: "Author biography",
  author_photo: File,
  author_social_links: JSON.stringify(["https://twitter.com/...", "https://facebook.com/..."]),
  publisher: "Publisher Name",
  publication_date: "2024-01-15",
  isbn: "978-0123456789",
  pages: "350",
  language: "en",
  genre: "Fiction",
  format: "paperback",
  price: "19.99",
  currency: "USD",
  age_range: "18+",
  series_name: "Series Name",
  edition: "First Edition",
  cover_image: File,
  additional_images: File[],
  trailer_video_url: "https://youtube.com/watch?v=...",
  sample_files: File[],
  purchase_links: JSON.stringify([{platform: "Amazon", url: "https://..."}]),
  country: "United States",
  location_address: "123 Main St, New York, NY",
  latitude: "40.7128",
  longitude: "-74.0060",
  upsell_tier: "2", // 1=basic, 2=promoted, 3=featured, 4=sponsored
  agreed_to_terms: "true",
  verified_author: "false"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": 123,
    "slug": "book-title",
    "payment_required": true,
    "amount": 29.00
  }
}
```

#### PUT /books-adverts/{id}
Update book advert (same format as create).

#### DELETE /books-adverts/{id}
Delete book advert.

### 2. Featured Books

#### GET /books-adverts/featured
Get featured books for homepage display.

**Query Parameters:**
```javascript
{
  per_page: "number", // default: 12
  page: "number"      // default: 1
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of book objects with advert_type in ['featured', 'promoted', 'sponsored']
  ]
}
```

### 3. User Books

#### GET /books-adverts/my-books
Get current user's books.

**Query Parameters:**
```javascript
{
  per_page: "number", // default: 12
  page: "number"      // default: 1
}
```

### 4. Book Interactions

#### POST /books-adverts/{id}/save
Save/bookmark a book.

**Response:**
```json
{
  "success": true,
  "message": "Book saved successfully",
  "data": {
    "is_saved": true,
    "saves_count": 90
  }
}
```

#### POST /books-adverts/{id}/views
Increment book view count (no response needed).

### 5. Genre-based Books

#### GET /books-adverts/genre/{genre}
Get books by specific genre.

**Query Parameters:**
```javascript
{
  per_page: "number", // default: 12
  page: "number"      // default: 1
}
```

### 6. Pricing Plans

#### GET /books-adverts/pricing-plans
Get available promotion pricing plans.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic Listing",
      "price": 0,
      "features": [
        "Standard visibility",
        "7 days listing",
        "Basic support"
      ],
      "recommended": false
    },
    {
      "id": 2,
      "name": "Promoted",
      "price": 29,
      "features": [
        "Enhanced visibility",
        "30 days listing",
        "Priority support",
        "Promoted badge"
      ],
      "recommended": false
    },
    {
      "id": 3,
      "name": "Featured",
      "price": 79,
      "features": [
        "Premium placement",
        "60 days listing",
        "Featured badge",
        "Analytics access"
      ],
      "recommended": true
    },
    {
      "id": 4,
      "name": "Sponsored",
      "price": 149,
      "features": [
        "Homepage placement",
        "90 days listing",
        "Sponsored badge",
        "Advanced analytics",
        "Social media promotion"
      ],
      "recommended": false
    }
  ]
}
```

### 7. Payment Processing

#### POST /books-adverts/{id}/payment
Process payment for book promotion.

**Request:**
```javascript
{
  plan_id: "3",
  payment_method: "stripe", // stripe, paypal, etc.
  payment_token: "tok_..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "payment_id": "pay_123",
    "status": "completed",
    "expires_at": "2024-03-15T10:00:00Z"
  }
}
```

### 8. Statistics

#### GET /books-adverts/statistics
Get platform statistics (admin endpoint).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 15420,
    "totalAuthors": 3280,
    "totalViews": 2450000,
    "totalSaves": 125000,
    "activeCountries": 142,
    "topGenres": [
      { name: "Fiction", count: 5230 },
      { name: "Non-Fiction", count: 4120 },
      { name: "Mystery", count: 2890 }
    ],
    "trendingBooks": [
      { title: "The Great Adventure", views: 15420 },
      { title: "Mystery Tales", views: 12350 }
    ]
  }
}
```

---

## Database Schema

### books_adverts Table
```sql
CREATE TABLE books_adverts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  short_description TEXT,
  author_name VARCHAR(255) NOT NULL,
  author_bio TEXT,
  author_photo_url VARCHAR(500),
  author_social_links JSON,
  publisher VARCHAR(255),
  publication_date DATE,
  isbn VARCHAR(20),
  pages INT,
  language VARCHAR(10),
  genre VARCHAR(100),
  format VARCHAR(50),
  book_type VARCHAR(50),
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  age_range VARCHAR(20),
  series_name VARCHAR(255),
  edition VARCHAR(100),
  cover_image_url VARCHAR(500),
  additional_images JSON,
  trailer_video_url VARCHAR(500),
  sample_files JSON,
  purchase_links JSON,
  country VARCHAR(100),
  location_address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  views_count BIGINT DEFAULT 0,
  saves_count BIGINT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  verified_author BOOLEAN DEFAULT FALSE,
  advert_type ENUM('basic', 'promoted', 'featured', 'sponsored') DEFAULT 'basic',
  upsell_tier INT DEFAULT 1,
  promoted_until DATETIME NULL,
  status ENUM('active', 'inactive', 'pending', 'rejected') DEFAULT 'pending',
  agreed_to_terms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_genre (genre),
  INDEX idx_country (country),
  INDEX idx_format (format),
  INDEX idx_book_type (book_type),
  INDEX idx_language (language),
  INDEX idx_advert_type (advert_type),
  INDEX idx_status (status),
  INDEX idx_price (price),
  INDEX idx_views_count (views_count),
  INDEX idx_saves_count (saves_count),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_search (title, subtitle, description, author_name)
);
```

### book_saves Table
```sql
CREATE TABLE book_saves (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_book (user_id, book_id),
  INDEX idx_user_id (user_id),
  INDEX idx_book_id (book_id),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books_adverts(id) ON DELETE CASCADE
);
```

### book_views Table
```sql
CREATE TABLE book_views (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  book_id BIGINT NOT NULL,
  user_id BIGINT NULL, -- NULL for anonymous views
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_book_id (book_id),
  INDEX idx_created_at (created_at),
  
  FOREIGN KEY (book_id) REFERENCES books_adverts(id) ON DELETE CASCADE
);
```

### pricing_plans Table
```sql
CREATE TABLE pricing_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features JSON NOT NULL,
  recommended BOOLEAN DEFAULT FALSE,
  duration_days INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### book_payments Table
```sql
CREATE TABLE book_payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  book_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  plan_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_book_id (book_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  
  FOREIGN KEY (book_id) REFERENCES books_adverts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES pricing_plans(id)
);
```

---

## File Upload Structure

### Cover Images
```
/uploads/books/covers/
  ├── user123/
  │   ├── book_456_cover.jpg
  │   └── book_457_cover.jpg
  └── user124/
      └── book_458_cover.jpg
```

### Additional Images
```
/uploads/books/images/
  ├── user123/
  │   ├── book_456_img_1.jpg
  │   ├── book_456_img_2.jpg
  │   └── book_457_img_1.jpg
  └── user124/
      └── book_458_img_1.jpg
```

### Author Photos
```
/uploads/books/authors/
  ├── user123_author.jpg
  ├── user124_author.jpg
  └── user125_author.jpg
```

### Sample Files
```
/uploads/books/samples/
  ├── user123/
  │   ├── book_456_sample.pdf
  │   └── book_457_sample.pdf
  └── user124/
      └── book_458_sample.pdf
```

---

## Frontend-Backend Data Flow

### 1. Page Load Flow
```
BooksPage.jsx
  ↓
loadStats() → GET /books-adverts/statistics
  ↓
loadFeaturedBooks() → GET /books-adverts/featured
  ↓
loadTrendingGenres() → GET /books-adverts?per_page=1
  ↓
BooksGrid.loadBooks() → GET /books-adverts
```

### 2. Book Posting Flow
```
BooksPostForm.jsx
  ↓
loadPricingPlans() → GET /books-adverts/pricing-plans
  ↓
handleSubmit() → POST /books-adverts (multipart/form-data)
  ↓
If payment_required → Redirect to payment page
  ↓
Payment processing → POST /books-adverts/{id}/payment
```

### 3. Book Interaction Flow
```
BooksCard.jsx
  ↓
handleView() → POST /books-adverts/{id}/views
  ↓
handleSave() → POST /books-adverts/{id}/save
  ↓
onShare() → Native share functionality
```

### 4. Filtering Flow
```
BooksFilters.jsx
  ↓
loadFilterOptions() → GET /books-adverts?per_page=1
  ↓
onFiltersChange() → BooksGrid.loadBooks() with new filters
  ↓
GET /books-adverts?filter=values
```

---

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **422**: Validation Error (detailed field errors)
- **500**: Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

---

## Security Considerations

### 1. Authentication
- JWT tokens with expiration
- Token refresh mechanism
- Protected routes middleware

### 2. File Upload Security
- File type validation (images: jpg, png, gif; documents: pdf)
- File size limits (images: 5MB, documents: 10MB)
- Virus scanning
- Secure file naming (prevent directory traversal)

### 3. Input Validation
- Sanitize all user inputs
- Validate book data (ISBN format, price range, etc.)
- SQL injection prevention (parameterized queries)

### 4. Rate Limiting
- API rate limiting per user
- File upload rate limiting
- Search query limiting

---

## Performance Optimization

### 1. Database Indexing
- Proper indexes on frequently queried fields
- Full-text search index for book search
- Composite indexes for complex queries

### 2. Caching
- Redis cache for featured books
- Cache for pricing plans (rarely changes)
- CDN for static file uploads

### 3. Pagination
- Limit per_page to maximum 50
- Efficient pagination with cursor-based for large datasets

### 4. Image Optimization
- Automatic image resizing and compression
- Multiple thumbnail sizes
- Lazy loading in frontend

---

## Testing

### 1. API Testing
- Unit tests for each endpoint
- Integration tests for complete workflows
- Load testing for high traffic scenarios

### 2. Frontend Testing
- Component testing for forms
- Integration testing for API calls
- E2E testing for complete user flows

### 3. Test Data
- Seed database with sample books
- Test file upload functionality
- Test payment processing (sandbox mode)

---

This comprehensive guide provides everything needed to implement the backend for the Books Marketplace frontend. All components are designed to work with these API endpoints and data structures.
