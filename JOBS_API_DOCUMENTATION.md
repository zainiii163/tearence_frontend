# Jobs & Vacancies API Documentation

## Overview
This document provides comprehensive API documentation for the Jobs & Vacancies system in WorldwideAdverts platform. The system supports job postings, job seeker profiles, applications, and premium promotion features.

## Base URL
```
Production: https://api.worldwideadverts.com
Development: https://dev-api.worldwideadverts.com
```

## Authentication
All protected endpoints require JWT authentication:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Get All Jobs
```http
GET /public/jobs
```

**Query Parameters:**
- `page` (integer, optional): Page number for pagination (default: 1)
- `per_page` (integer, optional): Items per page (default: 20, max: 100)
- `search` (string, optional): Search keyword for job titles, descriptions, or company names
- `location` (string, optional): Filter by location
- `category` (string, optional): Filter by industry category
- `work_type` (string, optional): Filter by work type (Full-time, Part-time, Contract, etc.)
- `salary_range` (string, optional): Filter by salary range (e.g., "50000-75000")
- `remote_only` (boolean, optional): Filter for remote-only jobs
- `experience_level` (string, optional): Filter by experience level (entry, mid, senior, executive)
- `education_level` (string, optional): Filter by education requirements
- `sort_by` (string, optional): Sort options (most_recent, salary_high_low, salary_low_high, most_viewed, trending)
- `country` (string, optional): Filter by country

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Senior Frontend Developer",
      "company_name": "TechCorp Solutions",
      "description": "We are looking for an experienced frontend developer...",
      "responsibilities": "Develop responsive web applications...",
      "requirements": "5+ years of experience with React...",
      "country": "United States",
      "city": "New York",
      "work_type": "Full-time",
      "salary_range": "75000-100000",
      "currency": "USD",
      "experience_level": "senior",
      "education_level": "bachelor",
      "benefits": "Health Insurance, Paid Leave, Stock Options",
      "application_method": "email",
      "application_email": "careers@techcorp.com",
      "company_website": "https://techcorp.com",
      "logo_url": "https://cdn.example.com/logos/techcorp.png",
      "verified_employer": true,
      "views": 1250,
      "applications_count": 45,
      "posted_at": "2024-01-15T10:30:00Z",
      "expires_at": "2024-02-15T10:30:00Z",
      "status": "active",
      "promotion_type": "featured",
      "skills_needed": "React, JavaScript, CSS, Node.js",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:25:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 1250,
    "total_pages": 63,
    "has_next": true,
    "has_prev": false
  }
}
```

#### 2. Get Job Details
```http
GET /public/jobs/{jobId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Senior Frontend Developer",
    "company_name": "TechCorp Solutions",
    // ... all job fields from get jobs endpoint
    "company_description": "TechCorp Solutions is a leading technology company...",
    "company_size": "100-500",
    "company_industry": "Technology",
    "company_founded": "2010",
    "social_links": {
      "linkedin": "https://linkedin.com/company/techcorp",
      "twitter": "https://twitter.com/techcorp",
      "website": "https://techcorp.com"
    },
    "gallery": [
      "https://cdn.example.com/jobs/office1.jpg",
      "https://cdn.example.com/jobs/office2.jpg"
    ]
  }
}
```

#### 3. Get Job Categories
```http
GET /public/jobs/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "technology",
      "name": "Technology & IT",
      "description": "Software development, IT support, and tech roles",
      "icon": "💻",
      "job_count": 450,
      "trending": true
    },
    {
      "id": "healthcare",
      "name": "Healthcare & Medical",
      "description": "Medical professionals and healthcare roles",
      "icon": "🏥",
      "job_count": 320,
      "trending": false
    }
  ]
}
```

#### 4. Get Job Statistics
```http
GET /public/jobs/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_jobs": 45234,
    "active_companies": 8456,
    "total_applications": 125000,
    "success_rate": 98,
    "popular_categories": [
      {
        "category": "Technology & IT",
        "count": 8500,
        "growth": 15.5
      }
    ],
    "top_locations": [
      {
        "city": "New York",
        "country": "United States",
        "job_count": 1200
      }
    ],
    "average_salary": {
      "USD": 75000,
      "EUR": 65000,
      "GBP": 55000
    }
  }
}
```

#### 5. Get Job Seekers (Public)
```http
GET /public/jobs/seekers
```

**Query Parameters:**
- `page` (integer, optional): Page number
- `per_page` (integer, optional): Items per page
- `search` (string, optional): Search by skills, profession, or location
- `profession` (string, optional): Filter by profession
- `location` (string, optional): Filter by location
- `remote_available` (boolean, optional): Filter for remote availability
- `experience_level` (string, optional): Filter by experience
- `skills` (string, optional): Filter by skills (comma-separated)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "John Doe",
      "profession": "Frontend Developer",
      "location": "New York, USA",
      "years_of_experience": "6-10",
      "key_skills": "React, JavaScript, CSS, Node.js",
      "education_level": "bachelor",
      "remote_availability": true,
      "bio": "Experienced frontend developer with 6+ years...",
      "profile_photo_url": "https://cdn.example.com/profiles/john.jpg",
      "portfolio_link": "https://johndoe.dev",
      "linkedin_link": "https://linkedin.com/in/johndoe",
      "desired_role": "Senior Frontend Developer",
      "salary_expectation": "80000-120000",
      "work_type_preference": "Full-time",
      "views": 850,
      "contact_count": 25,
      "created_at": "2024-01-10T09:15:00Z",
      "promotion_type": "featured"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 15420,
    "total_pages": 771
  }
}
```

#### 6. Get Job Seeker Details (Public)
```http
GET /public/jobs/seekers/{seekerId}
```

#### 7. Get Job Seeker Statistics
```http
GET /public/jobs/seekers/stats
```

#### 8. Get Trending Searches
```http
GET /public/jobs/trending-searches
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "term": "Remote Developer",
      "count": 1234,
      "trend": "+15%",
      "category": "technology"
    },
    {
      "term": "Data Scientist",
      "count": 892,
      "trend": "+22%",
      "category": "technology"
    },
    {
      "term": "Marketing Manager",
      "count": 756,
      "trend": "+8%",
      "category": "business"
    }
  ]
}
```

#### 9. Get Recent Activities
```http
GET /public/jobs/activities
```

**Query Parameters:**
- `limit` (integer, optional): Number of activities to return (default: 20)
- `type` (string, optional): Filter by activity type (application, job_posted, views, save)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "application",
      "message": "A user from Germany applied for a job in Dubai",
      "timestamp": "2024-01-15T10:30:00Z",
      "timestamp_relative": "2 minutes ago",
      "icon": "Users",
      "color": "text-blue-600",
      "bgColor": "bg-blue-100",
      "user_location": "Germany",
      "job_location": "Dubai",
      "job_title": "Senior Frontend Developer"
    },
    {
      "id": 2,
      "type": "job_posted",
      "message": "New vacancy added in London: Senior Frontend Developer",
      "timestamp": "2024-01-15T10:25:00Z",
      "timestamp_relative": "5 minutes ago",
      "icon": "Briefcase",
      "color": "text-green-600",
      "bgColor": "bg-green-100",
      "location": "London",
      "job_title": "Senior Frontend Developer",
      "company": "TechCorp Solutions"
    },
    {
      "id": 3,
      "type": "views",
      "message": "A job in Toronto just got 15 views",
      "timestamp": "2024-01-15T10:20:00Z",
      "timestamp_relative": "8 minutes ago",
      "icon": "Eye",
      "color": "text-purple-600",
      "bgColor": "bg-purple-100",
      "location": "Toronto",
      "view_count": 15,
      "job_title": "UX Designer"
    }
  ]
}
```

### Protected Endpoints (Authentication Required)

#### 1. Create Job Posting
```http
POST /jobs
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "company_name": "TechCorp Solutions",
  "description": "We are looking for an experienced frontend developer...",
  "responsibilities": "Develop responsive web applications...",
  "requirements": "5+ years of experience with React...",
  "country": "United States",
  "city": "New York",
  "work_type": "Full-time",
  "salary_range": "75000-100000",
  "currency": "USD",
  "benefits": "Health Insurance, Paid Leave, Stock Options",
  "application_method": "email",
  "application_email": "careers@techcorp.com",
  "application_website": "https://techcorp.com/careers",
  "company_logo": "base64_encoded_image_or_file_url",
  "company_website": "https://techcorp.com",
  "company_social": {
    "linkedin": "https://linkedin.com/company/techcorp",
    "twitter": "https://twitter.com/techcorp"
  },
  "verified_employer": true,
  "terms_accepted": true,
  "accurate_info": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "id": 1234,
    "title": "Senior Frontend Developer",
    "status": "pending_review",
    "posted_at": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Update Job Posting
```http
PUT /jobs/{jobId}
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

#### 3. Delete Job Posting
```http
DELETE /jobs/{jobId}
Authorization: Bearer <jwt_token>
```

#### 4. Get My Job Postings
```http
GET /jobs/my-jobs
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status` (string, optional): Filter by status (active, expired, pending_review, draft)
- `page` (integer, optional): Page number
- `per_page` (integer, optional): Items per page

#### 5. Apply for Job
```http
POST /jobs/{jobId}/apply
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 234 567 8900",
  "cover_letter": "I am very interested in this position...",
  "cv_file": "base64_encoded_pdf_or_file_url",
  "portfolio_links": ["https://johndoe.dev", "https://github.com/johndoe"],
  "expected_salary": "80000-100000",
  "available_start_date": "2024-02-01",
  "additional_notes": "I have 6+ years of experience..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application_id": 5678,
    "job_id": 1234,
    "status": "submitted",
    "submitted_at": "2024-01-16T14:30:00Z"
  }
}
```

#### 6. Get Applications
```http
GET /jobs/applications
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `job_id` (integer, optional): Filter applications for specific job
- `status` (string, optional): Filter by status (submitted, viewed, shortlisted, rejected, hired)
- `page` (integer, optional): Page number
- `per_page` (integer, optional): Items per page

#### 7. Get Application Details
```http
GET /jobs/applications/{applicationId}
Authorization: Bearer <jwt_token>
```

#### 8. Update Application Status
```http
PUT /jobs/applications/{applicationId}/status
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "shortlisted",
  "employer_notes": "Strong candidate, schedule interview",
  "next_steps": "Schedule technical interview"
}
```

#### 9. Get Application Statistics
```http
GET /jobs/applications/stats
Authorization: Bearer <jwt_token>
```

### Job Seeker Profile Management

#### 1. Create Seeker Profile
```http
POST /jobs/seekers
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "profession": "Frontend Developer",
  "country": "United States",
  "city": "New York",
  "remote_availability": true,
  "years_of_experience": "6-10",
  "key_skills": "React, JavaScript, CSS, Node.js",
  "education": "Bachelor of Science in Computer Science",
  "desired_role": "Senior Frontend Developer",
  "salary_expectation": "80000-120000",
  "work_type": "Full-time",
  "bio": "Experienced frontend developer with 6+ years...",
  "profile_photo": "base64_encoded_image_or_file_url",
  "portfolio_link": "https://johndoe.dev",
  "linkedin_link": "https://linkedin.com/in/johndoe",
  "cv_file": "base64_encoded_pdf_or_file_url",
  "terms_accepted": true,
  "accurate_info": true
}
```

#### 2. Update Seeker Profile
```http
PUT /jobs/seekers/{seekerId}
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

#### 3. Delete Seeker Profile
```http
DELETE /jobs/seekers/{seekerId}
Authorization: Bearer <jwt_token>
```

#### 4. Get My Seeker Profile
```http
GET /jobs/seekers/my-profile
Authorization: Bearer <jwt_token>
```

### Premium Upsells

#### 1. Get Upsell Pricing
```http
GET /jobs/upsells/pricing
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "promoted": {
      "id": "promoted",
      "name": "Promoted",
      "price": 29.00,
      "currency": "USD",
      "period": "month",
      "features": [
        "Highlighted listing",
        "Appears above standard posts",
        "Promoted badge",
        "2x visibility",
        "Basic analytics"
      ]
    },
    "featured": {
      "id": "featured",
      "name": "Featured",
      "price": 49.00,
      "currency": "USD",
      "period": "month",
      "features": [
        "Top of category pages",
        "Larger listing card",
        "Priority search placement",
        "Featured badge",
        "Included in weekly email",
        "Advanced analytics",
        "3x visibility"
      ],
      "recommended": true
    },
    "sponsored": {
      "id": "sponsored",
      "name": "Sponsored",
      "price": 99.00,
      "currency": "USD",
      "period": "month",
      "features": [
        "Homepage placement",
        "Category top placement",
        "Homepage slider inclusion",
        "Sponsored badge",
        "Email newsletters",
        "Priority support",
        "5x visibility",
        "Social media promotion"
      ]
    },
    "network": {
      "id": "network",
      "name": "Network-Wide Boost",
      "price": 199.00,
      "currency": "USD",
      "period": "month",
      "features": [
        "Appears across all pages",
        "Homepage spotlight",
        "Category pages",
        "Related adverts",
        "Email newsletters",
        "Push notifications",
        "Top Spotlight badge",
        "Dedicated support",
        "10x visibility",
        "Premium analytics"
      ]
    }
  }
}
```

#### 2. Create Upsell
```http
POST /jobs/upsells
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "upsellable_type": "job_listing",
  "upsellable_id": 1234,
  "upsell_type": "featured",
  "price": 49.00,
  "currency": "USD",
  "duration_months": 1
}
```

#### 3. Activate Upsell
```http
POST /jobs/upsells/{upsellId}/activate
Authorization: Bearer <jwt_token>
```

#### 4. Cancel Upsell
```http
POST /jobs/upsells/{upsellId}/cancel
Authorization: Bearer <jwt_token>
```

#### 5. Get My Upsells
```http
GET /jobs/upsells?my_upsells=true
Authorization: Bearer <jwt_token>
```

#### 6. Get Upsell Statistics
```http
GET /jobs/upsells/stats
Authorization: Bearer <jwt_token>
```

### Job Alerts

#### 1. Create Job Alert
```http
POST /jobs/alerts
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Frontend Developer Alerts",
  "keywords": "React, JavaScript, Frontend",
  "location": "New York",
  "category": "technology",
  "work_type": "Full-time",
  "salary_range": "75000-100000",
  "remote_only": false,
  "frequency": "daily"
}
```

#### 2. Get My Job Alerts
```http
GET /jobs/alerts
Authorization: Bearer <jwt_token>
```

#### 3. Update Job Alert
```http
PUT /jobs/alerts/{alertId}
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

#### 4. Test Job Alert
```http
POST /jobs/alerts/{alertId}/test
Authorization: Bearer <jwt_token>
```

#### 5. Delete Job Alert
```http
DELETE /jobs/alerts/{alertId}
Authorization: Bearer <jwt_token>
```

#### 6. Get Alert Statistics
```http
GET /jobs/alerts/stats
Authorization: Bearer <jwt_token>
```

### Saved Jobs

#### 1. Save a Job
```http
POST /jobs/{jobId}/save
Authorization: Bearer <jwt_token>
```

#### 2. Unsave a Job
```http
DELETE /jobs/{jobId}/save
Authorization: Bearer <jwt_token>
```

#### 3. Get Saved Jobs
```http
GET /jobs/saved
Authorization: Bearer <jwt_token>
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_REQUIRED`: No or invalid JWT token
- `AUTHORIZATION_FAILED`: User not authorized for this action
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting
- Public endpoints: 100 requests per minute per IP
- Protected endpoints: 1000 requests per minute per authenticated user

## File Upload Guidelines
- Maximum file size: 5MB
- Supported formats: PDF, DOC, DOCX for CVs
- Supported formats: JPG, PNG, GIF for images
- Files are base64 encoded for JSON requests
- For larger files, use multipart/form-data

## Webhook Support
### Application Status Updates
Configure webhook URLs to receive real-time notifications:

```http
POST /webhooks/job-application
```

**Payload:**
```json
{
  "event": "application.status_changed",
  "data": {
    "application_id": 5678,
    "job_id": 1234,
    "old_status": "submitted",
    "new_status": "viewed",
    "timestamp": "2024-01-16T15:30:00Z"
  }
}
```

## Search Functionality
### Advanced Search Parameters
```http
GET /public/jobs?search=react&location=new+york&category=technology&remote_only=true&sort_by=most_recent
```

### Full-Text Search
The search supports full-text search across:
- Job titles
- Company names
- Job descriptions
- Requirements
- Skills needed

### Faceted Search
Combine multiple filters for precise results:
- Location + Category + Salary Range
- Skills + Experience Level
- Work Type + Remote Availability

## Analytics & Reporting

### Job Performance Metrics
```http
GET /jobs/{jobId}/analytics
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "views": 1250,
    "unique_views": 980,
    "applications": 45,
    "clicks": 89,
    "shares": 12,
    "conversion_rate": 3.6,
    "daily_views": [
      {
        "date": "2024-01-15",
        "views": 85
      }
    ],
    "demographics": {
      "countries": {
        "United States": 65,
        "India": 20,
        "United Kingdom": 15
      },
      "devices": {
        "desktop": 70,
        "mobile": 25,
        "tablet": 5
      }
    }
  }
}
```

## Integration Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Get jobs with filters
const getJobs = async () => {
  try {
    const response = await axios.get('https://api.worldwideadverts.com/public/jobs', {
      params: {
        category: 'technology',
        location: 'New York',
        per_page: 20,
        sort_by: 'most_recent'
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching jobs:', error.response.data);
  }
};

// Create job posting
const createJob = async (jobData, token) => {
  try {
    const response = await axios.post('https://api.worldwideadverts.com/jobs', jobData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Job created:', response.data);
  } catch (error) {
    console.error('Error creating job:', error.response.data);
  }
};
```

### Python
```python
import requests

def get_jobs():
    try:
        response = requests.get('https://api.worldwideadverts.com/public/jobs', params={
            'category': 'technology',
            'location': 'New York',
            'per_page': 20
        })
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching jobs: {e}")
        return None

def create_job(job_data, token):
    try:
        response = requests.post(
            'https://api.worldwideadverts.com/jobs',
            json=job_data,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
        )
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating job: {e}")
        return None
```

## Testing

### Postman Collection
A complete Postman collection is available at:
`WWA_Jobs_API.postman_collection.json`

### Test Environment
Use the development environment for testing:
```
Base URL: https://dev-api.worldwideadverts.com
Test JWT: https://dev-api.worldwideadverts.com/auth/test-token
```

## Best Practices

1. **Pagination**: Always use pagination for large datasets
2. **Error Handling**: Implement proper error handling for all API calls
3. **Rate Limiting**: Respect rate limits and implement exponential backoff
4. **Caching**: Cache static data like categories and statistics
5. **Security**: Never expose JWT tokens in frontend code
6. **Validation**: Validate all input data before sending to API
7. **File Uploads**: Compress images before uploading
8. **Search**: Use specific search parameters for better performance

## Support

For API support and questions:
- Email: api-support@worldwideadverts.com
- Documentation: https://docs.worldwideadverts.com
- Status Page: https://status.worldwideadverts.com

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Core job posting and application functionality
- Basic search and filtering
- Premium upsell system

### v1.1.0 (2024-01-20)
- Added job seeker profiles
- Enhanced search with skills matching
- Improved analytics and reporting
- Webhook support for application updates

### v1.2.0 (2024-02-01)
- Added job alerts system
- Enhanced mobile API responses
- Improved rate limiting
- Added bulk operations for enterprise clients
