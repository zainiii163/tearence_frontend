# Book Marketplace Feature Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Installation & Setup](#installation--setup)
4. [User Guide](#user-guide)
5. [Technical Documentation](#technical-documentation)
6. [API Reference](#api-reference)
7. [Database Schema](#database-schema)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)
10. [Future Enhancements](#future-enhancements)

---

## Overview

The Book Marketplace feature enables users to sell books in various formats including PDF downloads, physical books, and external website links. It provides a complete e-commerce solution with secure payment processing, file management, and user-friendly interfaces.

### Key Capabilities
- **PDF Book Sales**: Upload and sell PDF books with secure post-purchase downloads
- **Multiple Formats**: Support for PDF, physical, website, e-book, and audiobook formats
- **Secure Payments**: Integrated PayPal and credit card processing
- **User Management**: Complete dashboard for managing book listings
- **Advanced Search**: Filter by genre, format, price, and search functionality

---

## Features

### 1. Marketplace Browsing
- **Advanced Filtering**: Genre, format, price range, and keyword search
- **Responsive Grid Layout**: Optimized for all device sizes
- **Book Details Modal**: Comprehensive book information display
- **Format-Specific Actions**: Different purchase flows for each format

### 2. Book Upload System
- **Multi-Step Form**: Guided process for creating listings
- **Drag & Drop Upload**: Intuitive file upload for covers and PDFs
- **File Validation**: Size and type checking for security
- **Preview Functionality**: Real-time preview of uploaded images

### 3. Purchase & Download Flow
- **Secure Payment Processing**: PayPal and credit card integration
- **Purchase Verification**: Automatic access to downloads after payment
- **Download Management**: Secure file serving with access control
- **Purchase History**: Track all book purchases

### 4. User Dashboard
- **Listing Management**: Edit, delete, and monitor book listings
- **Sales Analytics**: Revenue and sales statistics
- **Format Statistics**: Breakdown by book format
- **Purchase History**: View all purchased books

---

## Installation & Setup

### Prerequisites
- React 18.2.0+
- Redux Toolkit
- Axios for API calls
- React Router DOM
- Tailwind CSS
- React Hot Toast

### Environment Variables

Create a `.env` file in your project root:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api

# File Upload Configuration
REACT_APP_MAX_FILE_SIZE=52428800  # 50MB in bytes
REACT_APP_SUPPORTED_IMAGE_TYPES=image/jpeg,image/png,image/gif
REACT_APP_SUPPORTED_PDF_TYPE=application/pdf

# Payment Configuration
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
REACT_APP_ENABLE_PAYPAL=true
REACT_APP_ENABLE_CREDIT_CARD=true

# Feature Flags
REACT_APP_ENABLE_BOOK_MARKETPLACE=true
REACT_APP_ENABLE_PDF_DOWNLOAD=true
REACT_APP_ENABLE_EXTERNAL_LINKS=true
```

### Installation Steps

1. **Install Dependencies**
```bash
npm install @reduxjs/toolkit react-redux axios react-router-dom
npm install react-hot-toast react-quill
npm install @headlessui/react @heroicons/react
```

2. **Add Redux Slice**
```javascript
// src/store.js
import BookMarketplaceSlice from "./slice/BookMarketplaceSlice";

const reducer = {
  // ... existing reducers
  bookMarketplace: BookMarketplaceSlice,
};
```

3. **Add Routes**
```javascript
// src/App.jsx
import BookMarketplacePage from "./Component/BookMarketplace/BookMarketplacePage";
import BookUploadForm from "./Component/BookMarketplace/BookUploadForm";
import MyBookListings from "./Component/BookMarketplace/MyBookListings";

// Add routes:
<Route path="/book-marketplace" Component={BookMarketplacePage} />
<Route path="/book-marketplace/upload" Component={BookUploadForm} />
<Route path="/book-marketplace/my-listings" Component={MyBookListings} />
```

4. **Configure File Upload Directory**
```bash
# Create upload directories
mkdir -p public/uploads/books/covers
mkdir -p public/uploads/books/pdfs
```

---

## User Guide

### For Book Sellers

#### Creating a Book Listing

1. **Navigate to Upload Page**
   - Go to `/book-marketplace/upload`
   - Login if required

2. **Step 1: Basic Information**
   - Enter book title and author
   - Write detailed description
   - Select genre and language
   - Choose book format (PDF, Physical, Website, etc.)

3. **Step 2: File Upload**
   - Upload cover image (required)
   - Upload PDF file (for PDF format)
   - Use drag & drop or click to browse

4. **Step 3: Pricing & Review**
   - Set book price
   - Review all information
   - Submit listing

#### Managing Listings

1. **Access Dashboard**
   - Go to `/book-marketplace/my-listings`
   - View all your book listings

2. **Edit Listings**
   - Click "Edit" on any book
   - Update information
   - Save changes

3. **Delete Listings**
   - Click "Delete" on any book
   - Confirm deletion
   - Listing removed permanently

### For Book Buyers

#### Browsing and Purchasing

1. **Browse Marketplace**
   - Go to `/book-marketplace`
   - Use filters to find books
   - Click on books for details

2. **Purchase Books**
   - Click "Purchase" or "Order Now"
   - Select payment method (PayPal/Credit Card)
   - Complete secure payment

3. **Download PDF Books**
   - After purchase, click "Download"
   - PDF file downloads automatically
   - Access purchased books anytime

---

## Technical Documentation

### Component Architecture

```
src/Component/BookMarketplace/
├── BookMarketplacePage.jsx     # Main marketplace browsing
├── BookUploadForm.jsx          # Multi-step upload form
├── MyBookListings.jsx          # User dashboard
├── BookPurchaseFlow.jsx        # Payment & download flow
└── index.js                    # Component exports
```

### Redux State Management

```javascript
// BookMarketplaceSlice.js
const initialState = {
  books: [],              // All marketplace books
  userBooks: [],          // User's book listings
  purchasedBooks: [],     // User's purchased books
  loading: false,         // Loading states
  uploading: false,       // File upload state
  downloading: false,     // Download state
  purchasing: false,      // Purchase processing state
  error: null,           // Error messages
  pagination: {},         // Pagination info
  filters: {},           // Search filters
};
```

### File Upload System

#### Supported File Types
- **Images**: JPEG, PNG, GIF (max 10MB)
- **PDF**: PDF files (max 50MB)

#### Upload Process
1. Client-side validation (file type, size)
2. Convert to base64 for preview
3. FormData preparation
4. API upload with progress tracking
5. Server-side storage and validation

### Payment Integration

#### PayPal Integration
```javascript
// PayPal configuration
const paypalOptions = {
  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
};
```

#### Credit Card Processing
```javascript
// Credit card form validation
const validateCardForm = (cardData) => {
  // Card number validation
  // Expiry date validation
  // CVV validation
  // Return validation result
};
```

---

## API Reference

### Book Marketplace Endpoints

#### Get Marketplace Books
```http
GET /api/v1/books/marketplace
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- genre: string
- format: string
- search: string
- minPrice: number
- maxPrice: number
- sortBy: string

Response:
{
  "status": "Success",
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200
    }
  }
}
```

#### Create Book Listing
```http
POST /api/v1/books/create-listing
Content-Type: multipart/form-data

Body:
- title: string
- author: string
- description: string
- genre: string
- format: string
- price: number
- cover_image: File
- pdf_file: File (if format is pdf)
- external_url: string (if format is website)
- user_id: number
- location_id: number

Response:
{
  "status": "Success",
  "data": {
    "book_id": 123,
    "title": "Sample Book",
    // ... other book data
  }
}
```

#### Purchase Book
```http
POST /api/v1/books/{bookId}/purchase
Content-Type: application/json

Body:
{
  "payment_method": "paypal|card",
  "payment_token": "string"
}

Response:
{
  "status": "Success",
  "data": {
    "purchase_id": 456,
    "book_id": 123,
    "purchase_status": "completed",
    "download_available": true
  }
}
```

#### Download PDF Book
```http
GET /api/v1/books/{bookId}/download
Headers:
- Authorization: Bearer {token}

Response:
Content-Type: application/pdf
Content-Disposition: attachment; filename="book.pdf"
[PDF file content]
```

#### Get User's Book Listings
```http
GET /api/v1/books/my-listings
Headers:
- Authorization: Bearer {token}

Response:
{
  "status": "Success",
  "data": [...]
}
```

#### Get User's Purchased Books
```http
GET /api/v1/books/my-purchases
Headers:
- Authorization: Bearer {token}

Response:
{
  "status": "Success",
  "data": [...]
}
```

---

## Database Schema

### Books Table
```sql
CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  isbn VARCHAR(20),
  publisher VARCHAR(255),
  language VARCHAR(50) DEFAULT 'english',
  genre VARCHAR(100),
  pages INT,
  year_published INT,
  format ENUM('pdf', 'physical', 'website', 'ebook', 'audiobook') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  condition VARCHAR(50), -- for physical books
  cover_image VARCHAR(255),
  pdf_file VARCHAR(255),
  external_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sales_count INT DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_format (format),
  INDEX idx_genre (genre),
  INDEX idx_price (price),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(customer_id)
);
```

### Book Purchases Table
```sql
CREATE TABLE book_purchases (
  purchase_id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payment_method ENUM('paypal', 'credit_card', 'other') NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_transaction_id VARCHAR(255),
  download_count INT DEFAULT 0,
  download_limit INT DEFAULT 5,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  refund_reason TEXT,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT NULL,
  
  INDEX idx_book_id (book_id),
  INDEX idx_user_id (user_id),
  INDEX idx_payment_status (payment_status),
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (user_id) REFERENCES users(customer_id)
);
```

### Book Categories Table
```sql
CREATE TABLE book_categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Book Reviews Table
```sql
CREATE TABLE book_reviews (
  review_id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_book (user_id, book_id),
  INDEX idx_book_id (book_id),
  INDEX idx_rating (rating),
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (user_id) REFERENCES users(customer_id)
);
```

---

## Security

### File Upload Security

#### Client-Side Validation
```javascript
// File type validation
const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// File size validation
const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// File name sanitization
const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
};
```

#### Server-Side Security
- File type verification using magic numbers
- Virus scanning integration
- File size limits enforced
- Secure file storage with restricted permissions
- Regular security audits of uploaded files

### Payment Security

#### PCI Compliance
- Never store raw credit card numbers
- Use tokenization for card data
- Encrypt sensitive payment information
- Regular security audits

#### Fraud Prevention
```javascript
// Purchase validation
const validatePurchase = (bookId, userId) => {
  // Check if user already purchased
  // Validate book availability
  // Check for suspicious activity
  // Rate limiting
};
```

### Download Security

#### Access Control
```javascript
// Download authorization check
const authorizeDownload = async (bookId, userId) => {
  const purchase = await getPurchaseRecord(bookId, userId);
  return purchase && purchase.payment_status === 'completed';
};
```

#### Download Limits
- Maximum download attempts per purchase
- Time-limited access for rentals
- IP-based download tracking
- Automatic link expiration

---

## Troubleshooting

### Common Issues

#### File Upload Problems

**Problem**: PDF upload fails
```
Error: File type not supported
```

**Solution**:
1. Check file is valid PDF format
2. Verify file size is under 50MB
3. Ensure browser supports File API
4. Check network connectivity

**Problem**: Cover image not displaying
```
Error: Image failed to load
```

**Solution**:
1. Verify image format (JPEG, PNG, GIF)
2. Check file size is under 10MB
3. Ensure proper file permissions
4. Clear browser cache

#### Payment Issues

**Problem**: PayPal payment fails
```
Error: Payment processing failed
```

**Solution**:
1. Verify PayPal client ID configuration
2. Check PayPal account status
3. Ensure proper currency settings
4. Verify redirect URLs

**Problem**: Credit card payment declined
```
Error: Card declined
```

**Solution**:
1. Verify card details are correct
2. Check card expiration date
3. Ensure sufficient funds
4. Contact bank if issue persists

#### Download Issues

**Problem**: Cannot download purchased PDF
```
Error: Download not authorized
```

**Solution**:
1. Verify purchase was completed
2. Check user authentication
3. Ensure download limit not exceeded
4. Verify download link hasn't expired

### Debug Mode

Enable debug logging:
```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Book Marketplace Debug:', {
    action: 'upload',
    fileType: file.type,
    fileSize: file.size,
    timestamp: new Date().toISOString()
  });
}
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| BM001 | Invalid file type | Check supported formats |
| BM002 | File too large | Reduce file size |
| BM003 | Upload failed | Check network connection |
| BM004 | Payment failed | Verify payment details |
| BM005 | Download unauthorized | Check purchase status |
| BM006 | Book not found | Verify book ID |
| BM007 | Access denied | Check user permissions |

---

## Future Enhancements

### Planned Features

#### Advanced Marketplace Features
- **Book Preview**: Sample chapters or pages
- **User Reviews**: Rating and review system
- **Recommendation Engine**: AI-powered book suggestions
- **Author Profiles**: Dedicated author pages
- **Book Clubs**: Community features
- **Reading Lists**: Curated collections

#### Technical Improvements
- **Real-time Notifications**: WebSocket integration
- **Advanced Search**: Elasticsearch integration
- **Mobile App**: React Native application
- **Progressive Web App**: Offline functionality
- **API Rate Limiting**: Prevent abuse
- **Caching Optimization**: Redis integration

#### Payment Enhancements
- **Multiple Currencies**: International support
- **Subscription Model**: Book rental service
- **Bundle Pricing**: Multi-book discounts
- **Gift Purchases**: Send books as gifts
- **Payment Plans**: Installment options

#### Content Management
- **Bulk Upload**: CSV/Excel import
- **Content Management System**: Advanced editing
- **Version Control**: Book edition tracking
- **Metadata Management**: ISBN integration
- **Analytics Dashboard**: Detailed insights

### Implementation Roadmap

#### Phase 1 (Current)
- ✅ Basic marketplace functionality
- ✅ PDF upload and download
- ✅ Payment processing
- ✅ User dashboard

#### Phase 2 (Next 3 months)
- 🔄 User reviews and ratings
- 🔄 Book preview functionality
- 🔄 Advanced search and filtering
- 🔄 Mobile optimization

#### Phase 3 (6 months)
- 📋 Author profiles and pages
- 📋 Recommendation engine
- 📋 Book clubs and community features
- 📋 Mobile app development

#### Phase 4 (12 months)
- 📋 Subscription services
- 📋 International markets
- 📋 Advanced analytics
- 📋 API for third-party integrations

### Performance Optimization

#### Frontend Optimizations
- **Code Splitting**: Lazy load components
- **Image Optimization**: WebP format, lazy loading
- **Bundle Size**: Tree shaking, compression
- **Caching**: Service worker implementation

#### Backend Optimizations
- **Database Indexing**: Optimize queries
- **CDN Integration**: Global file distribution
- **Load Balancing**: Handle high traffic
- **Caching Strategy**: Redis implementation

---

## Support and Maintenance

### Monitoring

### Key Performance Indicators
- **User Engagement**: Daily active users, time spent
- **Conversion Rate**: Purchase completion percentage
- **Upload Success Rate**: File upload success percentage
- **Download Success Rate**: Download completion percentage
- **Revenue Tracking**: Daily/weekly/monthly revenue

### Error Tracking
- **Sentry Integration**: Error monitoring
- **Log Analysis**: Identify common issues
- **Performance Monitoring**: Page load times
- **User Feedback**: Bug reports and suggestions

### Maintenance Tasks

#### Daily
- Monitor system performance
- Check error logs
- Verify file storage capacity
- Review payment processing

#### Weekly
- Update security patches
- Backup database
- Clean up temporary files
- Review user feedback

#### Monthly
- Performance optimization
- Security audits
- Feature usage analysis
- Capacity planning

### Support Channels

#### User Support
- **Email Support**: support@worldwideadverts.info
- **Help Documentation**: Comprehensive guides
- **FAQ Section**: Common questions and answers
- **Video Tutorials**: Step-by-step guides

#### Developer Support
- **API Documentation**: Complete reference
- **SDK Documentation**: Integration guides
- **GitHub Issues**: Bug tracking and feature requests
- **Developer Forum**: Community support

---

## Conclusion

The Book Marketplace feature provides a comprehensive solution for selling books online with special emphasis on PDF uploads and secure downloads. The implementation follows industry best practices for security, user experience, and scalability.

### Key Benefits
- **Revenue Generation**: New income stream for users
- **User Engagement**: Increased platform usage
- **Content Variety**: Diverse book offerings
- **Secure Transactions**: Safe payment and download system
- **Scalable Architecture**: Ready for growth and expansion

### Success Metrics
- User adoption rate
- Transaction volume
- Customer satisfaction
- Technical performance
- Revenue growth

This documentation serves as a comprehensive guide for developers, administrators, and users to understand, implement, and maintain the Book Marketplace feature effectively.
