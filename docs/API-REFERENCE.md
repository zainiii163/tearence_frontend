# Book Marketplace API Reference

## Base URL
```
https://api.worldwideadverts.info/api
```

## Authentication
All protected endpoints require a Bearer token:
```http
Authorization: Bearer {token}
```

## Response Format

### Success Response
```json
{
  "status": "Success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "Error",
  "message": "Error description",
  "error_code": "BM001",
  "data": null
}
```

---

## Book Marketplace Endpoints

### 1. Get Marketplace Books

**Endpoint**: `GET /v1/books/marketplace`

**Description**: Retrieve paginated list of books available in the marketplace

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 20 | Number of items per page (max: 100) |
| genre | string | No | - | Filter by book genre |
| format | string | No | - | Filter by book format (pdf, physical, website, ebook, audiobook) |
| search | string | No | - | Search in title, author, description |
| minPrice | number | No | - | Minimum price filter |
| maxPrice | number | No | - | Maximum price filter |
| sortBy | string | No | newest | Sort option (newest, oldest, price_low, price_high, title_az, title_za, rating, popular) |
| user_id | number | No | - | Filter by specific user's books |

**Example Request**:
```http
GET /v1/books/marketplace?page=1&limit=20&genre=fiction&format=pdf&sortBy=price_low
```

**Example Response**:
```json
{
  "status": "Success",
  "data": {
    "items": [
      {
        "book_id": 123,
        "user_id": 456,
        "title": "Sample Book Title",
        "author": "John Doe",
        "description": "A comprehensive guide to modern web development...",
        "isbn": "978-3-16-148410-0",
        "publisher": "Tech Publications",
        "language": "english",
        "genre": "technology",
        "pages": 350,
        "year_published": 2023,
        "format": "pdf",
        "price": 29.99,
        "condition": null,
        "cover_image": "https://example.com/covers/book123.jpg",
        "pdf_file": "https://example.com/pdfs/book123.pdf",
        "external_url": null,
        "is_active": true,
        "is_featured": false,
        "sales_count": 15,
        "total_revenue": 449.85,
        "rating": 4.5,
        "rating_count": 12,
        "is_purchased": false,
        "created_at": "2023-12-01T10:00:00Z",
        "updated_at": "2023-12-01T10:00:00Z",
        "user": {
          "customer_id": 456,
          "name": "Jane Smith",
          "avatar": "https://example.com/avatars/user456.jpg"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 2. Create Book Listing

**Endpoint**: `POST /v1/books/create-listing`

**Description**: Create a new book listing in the marketplace

**Authentication**: Required

**Content-Type**: `multipart/form-data`

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Book title (max: 255 chars) |
| author | string | Yes | Author name (max: 255 chars) |
| description | string | Yes | Book description |
| isbn | string | No | ISBN number (max: 20 chars) |
| publisher | string | No | Publisher name (max: 255 chars) |
| language | string | No | Language (default: english) |
| genre | string | Yes | Book genre |
| pages | number | No | Number of pages |
| year_published | number | No | Publication year |
| format | string | Yes | Book format (pdf, physical, website, ebook, audiobook) |
| price | number | Yes | Book price (decimal, max: 99999.99) |
| condition | string | No | Book condition (for physical books) |
| cover_image | file | Yes | Cover image file |
| pdf_file | file | No | PDF file (required for PDF format) |
| external_url | string | No | External website URL (required for website format) |
| user_id | number | Yes | User ID (from authenticated session) |
| location_id | number | Yes | User's location ID |

**Example Request**:
```http
POST /v1/books/create-listing
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="title"
Advanced JavaScript Guide

Content-Disposition: form-data; name="author"
Jane Developer

Content-Disposition: form-data; name="description"
A comprehensive guide to modern JavaScript development...

Content-Disposition: form-data; name="genre"
technology

Content-Disposition: form-data; name="format"
pdf

Content-Disposition: form-data; name="price"
29.99

Content-Disposition: form-data; name="cover_image"; filename="cover.jpg"
Content-Type: image/jpeg
[image data]

Content-Disposition: form-data; name="pdf_file"; filename="book.pdf"
Content-Type: application/pdf
[pdf data]

------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Example Response**:
```json
{
  "status": "Success",
  "message": "Book listing created successfully",
  "data": {
    "book_id": 124,
    "title": "Advanced JavaScript Guide",
    "author": "Jane Developer",
    "description": "A comprehensive guide to modern JavaScript development...",
    "genre": "technology",
    "format": "pdf",
    "price": 29.99,
    "cover_image": "https://example.com/covers/book124.jpg",
    "pdf_file": "https://example.com/pdfs/book124.pdf",
    "is_active": true,
    "sales_count": 0,
    "total_revenue": 0,
    "created_at": "2023-12-01T15:30:00Z"
  }
}
```

---

### 3. Update Book Listing

**Endpoint**: `PUT /v1/books/{bookId}/update`

**Description**: Update an existing book listing

**Authentication**: Required

**Request Body** (JSON):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | Updated book title |
| author | string | No | Updated author name |
| description | string | No | Updated description |
| price | number | No | Updated price |
| genre | string | No | Updated genre |
| external_url | string | No | Updated external URL |
| condition | string | No | Updated condition |

**Example Request**:
```http
PUT /v1/books/124/update
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Advanced JavaScript Guide - Second Edition",
  "price": 34.99,
  "description": "Updated comprehensive guide to modern JavaScript development..."
}
```

**Example Response**:
```json
{
  "status": "Success",
  "message": "Book listing updated successfully",
  "data": {
    "book_id": 124,
    "title": "Advanced JavaScript Guide - Second Edition",
    "price": 34.99,
    "updated_at": "2023-12-01T16:00:00Z"
  }
}
```

---

### 4. Delete Book Listing

**Endpoint**: `DELETE /v1/books/{bookId}/delete`

**Description**: Delete a book listing from the marketplace

**Authentication**: Required

**Example Request**:
```http
DELETE /v1/books/124/delete
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Response**:
```json
{
  "status": "Success",
  "message": "Book listing deleted successfully",
  "data": {
    "book_id": 124,
    "deleted_at": "2023-12-01T17:00:00Z"
  }
}
```

---

### 5. Purchase Book

**Endpoint**: `POST /v1/books/{bookId}/purchase`

**Description**: Purchase a book and process payment

**Authentication**: Required

**Request Body** (JSON):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| payment_method | string | Yes | Payment method (paypal, credit_card) |
| payment_token | string | Yes | Payment processing token |
| amount | number | Yes | Purchase amount |

**Example Request**:
```http
POST /v1/books/123/purchase
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "payment_method": "paypal",
  "payment_token": "PAY-1234567890",
  "amount": 29.99
}
```

**Example Response**:
```json
{
  "status": "Success",
  "message": "Purchase completed successfully",
  "data": {
    "purchase_id": 789,
    "book_id": 123,
    "user_id": 456,
    "price": 29.99,
    "payment_method": "paypal",
    "payment_status": "completed",
    "payment_transaction_id": "PAY-1234567890",
    "download_available": true,
    "download_limit": 5,
    "purchased_at": "2023-12-01T18:00:00Z",
    "expires_at": "2024-12-01T18:00:00Z"
  }
}
```

---

### 6. Download PDF Book

**Endpoint**: `GET /v1/books/{bookId}/download`

**Description**: Download a purchased PDF book

**Authentication**: Required

**Headers**:
- `Authorization: Bearer {token}`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| purchase_id | number | No | Specific purchase ID (if multiple purchases) |

**Example Request**:
```http
GET /v1/books/123/download?purchase_id=789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="book-title.pdf"`
- **Body**: PDF file content

**Error Response**:
```json
{
  "status": "Error",
  "message": "Download not authorized",
  "error_code": "BM005"
}
```

---

### 7. Get User's Book Listings

**Endpoint**: `GET /v1/books/my-listings`

**Description**: Retrieve all book listings for the authenticated user

**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page |
| status | string | No | active | Filter by status (active, inactive, all) |
| format | string | No | - | Filter by format |

**Example Request**:
```http
GET /v1/books/my-listings?page=1&limit=10&status=active
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Response**:
```json
{
  "status": "Success",
  "data": [
    {
      "book_id": 123,
      "title": "Advanced JavaScript Guide",
      "author": "Jane Developer",
      "format": "pdf",
      "price": 29.99,
      "sales_count": 15,
      "total_revenue": 449.85,
      "is_active": true,
      "created_at": "2023-12-01T10:00:00Z",
      "cover_image": "https://example.com/covers/book123.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

---

### 8. Get User's Purchased Books

**Endpoint**: `GET /v1/books/my-purchases`

**Description**: Retrieve all books purchased by the authenticated user

**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page |
| format | string | No | - | Filter by format |
| download_available | boolean | No | - | Filter by download availability |

**Example Request**:
```http
GET /v1/books/my-purchases?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Response**:
```json
{
  "status": "Success",
  "data": [
    {
      "purchase_id": 789,
      "book_id": 123,
      "title": "Advanced JavaScript Guide",
      "author": "Jane Developer",
      "format": "pdf",
      "price": 29.99,
      "payment_status": "completed",
      "download_count": 2,
      "download_limit": 5,
      "download_available": true,
      "purchased_at": "2023-12-01T18:00:00Z",
      "expires_at": "2024-12-01T18:00:00Z",
      "cover_image": "https://example.com/covers/book123.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

---

### 9. Upload PDF File

**Endpoint**: `POST /v1/books/upload-pdf`

**Description**: Upload a PDF file for a book listing

**Authentication**: Required

**Content-Type**: `multipart/form-data`

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pdf_file | file | Yes | PDF file to upload |
| book_id | number | No | Book ID to associate with (optional) |

**Example Request**:
```http
POST /v1/books/upload-pdf
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="pdf_file"; filename="book.pdf"
Content-Type: application/pdf
[pdf data]

------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Example Response**:
```json
{
  "status": "Success",
  "message": "PDF file uploaded successfully",
  "data": {
    "file_id": "pdf_123456",
    "file_name": "book.pdf",
    "file_size": 5242880,
    "file_url": "https://example.com/pdfs/pdf_123456.pdf",
    "uploaded_at": "2023-12-01T19:00:00Z"
  }
}
```

---

### 10. Get Book Details

**Endpoint**: `GET /v1/books/{bookId}`

**Description**: Get detailed information about a specific book

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bookId | number | Yes | Book ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| include_user | boolean | No | Include user information |
| include_reviews | boolean | No | Include book reviews |

**Example Request**:
```http
GET /v1/books/123?include_user=true&include_reviews=true
```

**Example Response**:
```json
{
  "status": "Success",
  "data": {
    "book_id": 123,
    "title": "Advanced JavaScript Guide",
    "author": "Jane Developer",
    "description": "A comprehensive guide to modern JavaScript development...",
    "isbn": "978-3-16-148410-0",
    "publisher": "Tech Publications",
    "language": "english",
    "genre": "technology",
    "pages": 350,
    "year_published": 2023,
    "format": "pdf",
    "price": 29.99,
    "cover_image": "https://example.com/covers/book123.jpg",
    "is_active": true,
    "sales_count": 15,
    "total_revenue": 449.85,
    "rating": 4.5,
    "rating_count": 12,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z",
    "user": {
      "customer_id": 456,
      "name": "Jane Developer",
      "email": "jane@example.com",
      "avatar": "https://example.com/avatars/user456.jpg"
    },
    "reviews": [
      {
        "review_id": 101,
        "user_id": 789,
        "rating": 5,
        "review_text": "Excellent book! Very comprehensive.",
        "is_verified_purchase": true,
        "helpful_count": 3,
        "created_at": "2023-12-01T20:00:00Z"
      }
    ]
  }
}
```

---

## Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| BM001 | 400 | Invalid file type |
| BM002 | 400 | File too large |
| BM003 | 400 | Upload failed |
| BM004 | 400 | Payment failed |
| BM005 | 403 | Download not authorized |
| BM006 | 404 | Book not found |
| BM007 | 403 | Access denied |
| BM008 | 400 | Invalid request data |
| BM009 | 429 | Rate limit exceeded |
| BM010 | 500 | Internal server error |

## Rate Limiting

| Endpoint | Requests | Time Window |
|----------|----------|-------------|
| GET /books/marketplace | 100 | 15 minutes |
| POST /books/create-listing | 10 | 15 minutes |
| POST /books/{id}/purchase | 20 | 15 minutes |
| GET /books/{id}/download | 50 | 15 minutes |

## File Upload Limits

| File Type | Max Size | Allowed Formats |
|-----------|----------|-----------------|
| Cover Image | 10MB | JPEG, PNG, GIF |
| PDF File | 50MB | PDF only |

## Webhook Events

### Purchase Completed
```json
{
  "event": "purchase.completed",
  "data": {
    "purchase_id": 789,
    "book_id": 123,
    "user_id": 456,
    "amount": 29.99,
    "timestamp": "2023-12-01T18:00:00Z"
  }
}
```

### Book Listed
```json
{
  "event": "book.listed",
  "data": {
    "book_id": 124,
    "user_id": 456,
    "title": "New Book Title",
    "format": "pdf",
    "price": 19.99,
    "timestamp": "2023-12-01T19:00:00Z"
  }
}
```

## Testing

### Test Environment
```
https://api-test.worldwideadverts.info/api
```

### Test Credentials
```javascript
// Test user token
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";

// Test book ID
const testBookId = 123;
```

### Sample cURL Commands

```bash
# Get marketplace books
curl -X GET "https://api.worldwideadverts.info/api/v1/books/marketplace?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create book listing
curl -X POST "https://api.worldwideadverts.info/api/v1/books/create-listing" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Book" \
  -F "author=Test Author" \
  -F "description=Test description" \
  -F "genre=technology" \
  -F "format=pdf" \
  -F "price=9.99" \
  -F "cover_image=@cover.jpg" \
  -F "pdf_file=@book.pdf"

# Purchase book
curl -X POST "https://api.worldwideadverts.info/api/v1/books/123/purchase" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"payment_method":"paypal","payment_token":"PAY-123","amount":29.99}'
```

---

## SDK Examples

### JavaScript/Node.js

```javascript
import axios from 'axios';

class BookMarketplaceAPI {
  constructor(baseURL, token) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getMarketplaceBooks(params = {}) {
    try {
      const response = await this.client.get('/v1/books/marketplace', { params });
      return response.data;
    } catch (error) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async createBookListing(bookData) {
    try {
      const formData = new FormData();
      Object.keys(bookData).forEach(key => {
        formData.append(key, bookData[key]);
      });

      const response = await this.client.post('/v1/books/create-listing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async purchaseBook(bookId, paymentData) {
    try {
      const response = await this.client.post(`/v1/books/${bookId}/purchase`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async downloadBook(bookId, purchaseId) {
    try {
      const response = await this.client.get(`/v1/books/${bookId}/download`, {
        params: purchaseId ? { purchase_id: purchaseId } : {},
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Usage
const api = new BookMarketplaceAPI('https://api.worldwideadverts.info/api', 'YOUR_TOKEN');

// Get books
const books = await api.getMarketplaceBooks({ genre: 'technology', limit: 10 });

// Create listing
const newBook = await api.createBookListing({
  title: 'My Book',
  author: 'John Doe',
  description: 'A great book about...',
  genre: 'technology',
  format: 'pdf',
  price: 29.99,
  cover_image: fileObject,
  pdf_file: pdfFileObject
});

// Purchase book
const purchase = await api.purchaseBook(123, {
  payment_method: 'paypal',
  payment_token: 'PAY-123',
  amount: 29.99
});

// Download book
const pdfBlob = await api.downloadBook(123, purchase.data.purchase_id);
```

### Python

```python
import requests

class BookMarketplaceAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_marketplace_books(self, params=None):
        response = requests.get(
            f'{self.base_url}/v1/books/marketplace',
            headers=self.headers,
            params=params or {}
        )
        response.raise_for_status()
        return response.json()
    
    def create_book_listing(self, book_data):
        headers = {**self.headers, 'Content-Type': 'multipart/form-data'}
        response = requests.post(
            f'{self.base_url}/v1/books/create-listing',
            headers=headers,
            files=book_data
        )
        response.raise_for_status()
        return response.json()
    
    def purchase_book(self, book_id, payment_data):
        response = requests.post(
            f'{self.base_url}/v1/books/{book_id}/purchase',
            headers=self.headers,
            json=payment_data
        )
        response.raise_for_status()
        return response.json()
    
    def download_book(self, book_id, purchase_id=None):
        params = {'purchase_id': purchase_id} if purchase_id else {}
        response = requests.get(
            f'{self.base_url}/v1/books/{book_id}/download',
            headers=self.headers,
            params=params,
            stream=True
        )
        response.raise_for_status()
        return response.content

# Usage
api = BookMarketplaceAPI('https://api.worldwideadverts.info/api', 'YOUR_TOKEN')

# Get books
books = api.get_marketplace_books({'genre': 'technology', 'limit': 10})

# Purchase book
purchase = api.purchase_book(123, {
    'payment_method': 'paypal',
    'payment_token': 'PAY-123',
    'amount': 29.99
})

# Download book
pdf_content = api.download_book(123, purchase['data']['purchase_id'])
with open('book.pdf', 'wb') as f:
    f.write(pdf_content)
```

---

## Support

For API support and questions:
- **Email**: api-support@worldwideadverts.info
- **Documentation**: https://docs.worldwideadverts.info
- **Status Page**: https://status.worldwideadverts.info
- **GitHub Issues**: https://github.com/wwa/api/issues

## Changelog

### v1.0.0 (2023-12-01)
- Initial release of Book Marketplace API
- Support for PDF, physical, and website book formats
- Payment processing with PayPal and credit cards
- File upload and download functionality
- User dashboard endpoints

### v1.1.0 (Planned)
- Book reviews and ratings
- Advanced search and filtering
- Bulk operations
- Webhook support
- Enhanced analytics endpoints
