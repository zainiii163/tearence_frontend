# Banner System Integration Guide

## Overview

This guide provides comprehensive documentation for integrating the WWA Banner Advertisement System into your frontend application. The system includes complete CRUD operations, real-time data display, analytics tracking, and submission forms.

## Backend API Endpoints

### Banner Ads API
- **Base URL**: `http://localhost:8000/api/banner-ads`

#### Public Endpoints
- `GET /` - Get all banner ads with filtering
- `GET /featured` - Get featured banner ads
- `GET /most-viewed` - Get most viewed banner ads
- `GET /recent` - Get recent banner ads
- `GET /promotion-options` - Get promotion options and pricing
- `GET /{slug}` - Get banner ad by slug
- `POST /{slug}/track-click` - Track banner click

#### Authenticated Endpoints (JWT Required)
- `POST /` - Create new banner ad
- `PUT /{id}` - Update banner ad
- `DELETE /{id}` - Delete banner ad
- `GET /my-banners` - Get user's banner ads

### Banner Categories API
- **Base URL**: `http://localhost:8000/api/banner-categories`

#### Public Endpoints
- `GET /` - Get all banner categories
- `GET /trending` - Get trending categories
- `GET /{slug}` - Get category by slug
- `GET /{slug}/banner-ads` - Get ads in specific category

#### Authenticated Endpoints
- `POST /` - Create category
- `PUT /{id}` - Update category
- `DELETE /{id}` - Delete category

### Banner Upload API
- **Base URL**: `http://localhost:8000/api/banner-upload`

#### Authenticated Endpoints
- `POST /banner-image` - Upload banner image
- `POST /business-logo` - Upload business logo
- `POST /animated-banner` - Upload animated banner
- `POST /html5-banner` - Upload HTML5 banner
- `POST /video-banner` - Upload video banner
- `DELETE /file` - Delete uploaded file

## Frontend Components

### 1. BannerDisplay Component
**Location**: `src/Component/Banner/BannerDisplay.jsx`

**Features**:
- Grid/List view modes
- Real-time search and filtering
- Category-based filtering
- Statistics overview
- Click tracking
- Responsive design
- Loading states and error handling

**Usage**:
```jsx
import BannerDisplay from '../Component/Banner/BannerDisplay';

function MyPage() {
  return (
    <BannerDisplay 
      showCreateButton={true}
      maxHeight="auto"
    />
  );
}
```

**Props**:
- `showCreateButton` (boolean): Show/hide create banner button
- `maxHeight` (string): Maximum height for the component

### 2. BannerSubmissionForm Component
**Location**: `src/Component/Banner/BannerSubmissionForm.jsx`

**Features**:
- Multi-step form (4 steps)
- File upload for banner images and logos
- Real-time validation
- Progress indicators
- Preview functionality
- Multiple banner types support
- Promotion tier selection

**Usage**:
```jsx
import BannerSubmissionForm from '../Component/Banner/BannerSubmissionForm';

function CreateBannerPage() {
  const handleSuccess = (bannerData) => {
    console.log('Banner created:', bannerData);
    // Handle successful submission
  };

  const handleCancel = () => {
    // Handle cancellation
  };

  return (
    <BannerSubmissionForm
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      initialData={null} // For editing: pass banner data
    />
  );
}
```

**Props**:
- `onSuccess` (function): Callback on successful submission
- `onCancel` (function): Callback on cancellation
- `initialData` (object): Initial data for editing

### 3. BannerManagement Page
**Location**: `src/Pages/BannerManagement.jsx`

**Features**:
- Overview dashboard with statistics
- All banners management
- Analytics section
- Settings configuration
- Tab-based navigation

**Usage**:
```jsx
import BannerManagement from '../Pages/BannerManagement';

function App() {
  return (
    <Router>
      <Route path="/banner-management" component={BannerManagement} />
    </Router>
  );
}
```

## API Service Functions

**Location**: `src/api/banner.js`

### Key Functions

```javascript
// Get all banner ads
const banners = await getBannerAds({
  search: 'keyword',
  category_id: 1,
  sort_by: 'created_at',
  limit: 20
});

// Get featured banners
const featured = await getFeaturedBannerAds({ limit: 10 });

// Create new banner ad
const newBanner = await createBannerAd({
  title: 'My Banner',
  business_name: 'My Company',
  banner_type: 'image',
  banner_size: '728x90',
  banner_image: 'image.jpg',
  destination_link: 'https://example.com',
  banner_category_id: 1,
  country: 'United States',
  promotion_tier: 'featured'
});

// Upload banner image
const uploadResult = await uploadBannerImage(file);

// Track banner click
await trackBannerClick('banner-slug');
```

## Data Models

### BannerAd Model
```javascript
{
  id: number,
  title: string,
  slug: string,
  description: string,
  business_name: string,
  contact_person: string,
  email: string,
  phone: string,
  website_url: string,
  business_logo: string,
  banner_type: 'image' | 'animated' | 'html5' | 'video',
  banner_size: string,
  banner_image: string,
  destination_link: string,
  call_to_action: string,
  key_selling_points: string,
  offer_details: string,
  validity_start: string,
  validity_end: string,
  banner_category_id: number,
  country: string,
  city: string,
  target_countries: array,
  target_audience: array,
  promotion_tier: 'standard' | 'promoted' | 'featured' | 'sponsored' | 'network_boost',
  promotion_price: number,
  promotion_start: string,
  promotion_end: string,
  is_verified_business: boolean,
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'expired',
  is_active: boolean,
  views_count: number,
  clicks_count: number,
  approved_at: string,
  user_id: number,
  created_at: string,
  updated_at: string
}
```

### BannerCategory Model
```javascript
{
  id: number,
  name: string,
  slug: string,
  description: string,
  is_active: boolean,
  banner_count: number,
  created_at: string,
  updated_at: string
}
```

## Integration Examples

### Example 1: Display Banners on Homepage
```jsx
import React, { useEffect, useState } from 'react';
import { getFeaturedBannerAds, trackBannerClick } from '../api/banner';

function HomepageBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await getFeaturedBannerAds({ limit: 5 });
        setBanners(response.data || []);
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  const handleBannerClick = async (banner) => {
    await trackBannerClick(banner.slug);
    window.open(banner.destination_link, '_blank');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="banner-carousel">
      {banners.map(banner => (
        <div 
          key={banner.id} 
          className="banner-item"
          onClick={() => handleBannerClick(banner)}
        >
          <img src={banner.banner_image_url} alt={banner.title} />
          <h3>{banner.title}</h3>
          <p>{banner.business_name}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Create Banner Form Integration
```jsx
import React, { useState } from 'react';
import BannerSubmissionForm from '../Component/Banner/BannerSubmissionForm';

function CreateBannerPage() {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = (bannerData) => {
    console.log('Banner created successfully:', bannerData);
    setShowForm(false);
    // Redirect to banner management or show success message
  };

  return (
    <div className="create-banner-page">
      <h1>Create Banner Advertisement</h1>
      
      <button onClick={() => setShowForm(true)}>
        Create New Banner
      </button>

      {showForm && (
        <BannerSubmissionForm
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

### Example 3: Banner Analytics Dashboard
```jsx
import React, { useEffect, useState } from 'react';
import { getBannerStats, getMyBannerAds } from '../api/banner';

function BannerAnalytics() {
  const [stats, setStats] = useState(null);
  const [myBanners, setMyBanners] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, bannersResponse] = await Promise.all([
          getBannerStats(),
          getMyBannerAds()
        ]);
        
        setStats(statsResponse.data);
        setMyBanners(bannersResponse.data || []);
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="analytics-dashboard">
      <h2>Banner Analytics</h2>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Banners</h3>
            <p>{stats.total_banners}</p>
          </div>
          <div className="stat-card">
            <h3>Total Impressions</h3>
            <p>{stats.total_impressions}</p>
          </div>
          <div className="stat-card">
            <h3>Total Clicks</h3>
            <p>{stats.total_clicks}</p>
          </div>
          <div className="stat-card">
            <h3>Avg. CTR</h3>
            <p>{stats.avg_ctr}%</p>
          </div>
        </div>
      )}

      <div className="my-banners">
        <h3>My Banners</h3>
        {myBanners.map(banner => (
          <div key={banner.id} className="banner-analytics-item">
            <h4>{banner.title}</h4>
            <p>Views: {banner.views_count}</p>
            <p>Clicks: {banner.clicks_count}</p>
            <p>CTR: {((banner.clicks_count / banner.views_count) * 100).toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Configuration

### Environment Variables
```env
# Backend (Laravel)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wwa_backend
DB_USERNAME=root
DB_PASSWORD=

# File Upload
FILESYSTEM_DISK=public
UPLOAD_PATH=uploads/images/banner

# API Configuration
API_PREFIX=api
JWT_SECRET=your_jwt_secret
```

### Frontend Configuration
```javascript
// src/api/index.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
```

## File Upload Guidelines

### Supported Image Formats
- JPEG, PNG, GIF
- Maximum file size: 5MB
- Recommended dimensions based on banner size

### Banner Sizes
- **Leaderboard**: 728×90px
- **Medium Rectangle**: 300×250px
- **Skyscraper**: 160×600px
- **Billboard**: 970×250px
- **Classic Banner**: 468×60px
- **Square Social**: 1080×1080px

### Upload Example
```javascript
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('banner_image', file);

  try {
    const response = await api.post('/banner-upload/banner-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

## Error Handling

### Common Error Responses
```javascript
// Validation Error (422)
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."],
    "email": ["The email must be a valid email address."]
  }
}

// Not Found (404)
{
  "message": "Banner not found."
}

// Unauthorized (401)
{
  "message": "Unauthenticated."
}

// Server Error (500)
{
  "message": "Internal server error."
}
```

### Error Handling Example
```javascript
const createBanner = async (bannerData) => {
  try {
    const response = await createBannerAd(bannerData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 422) {
      // Validation errors
      const validationErrors = error.response.data.errors;
      // Handle validation errors
    } else if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else {
      // Generic error
      console.error('Error creating banner:', error);
      throw error;
    }
  }
};
```

## Testing

### Unit Testing Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import BannerDisplay from '../Component/Banner/BannerDisplay';
import * as bannerApi from '../api/banner';

jest.mock('../api/banner');

test('renders banner display', async () => {
  const mockBanners = [
    {
      id: 1,
      title: 'Test Banner',
      business_name: 'Test Company',
      banner_image: 'test.jpg',
      views_count: 100,
      clicks_count: 10
    }
  ];

  bannerApi.getBannerAds.mockResolvedValue({ data: mockBanners });

  render(<BannerDisplay />);
  
  expect(screen.getByText('Loading Banners...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Test Banner')).toBeInTheDocument();
  });
});
```

### API Testing
```bash
# Test getting all banners
curl -X GET "http://localhost:8000/api/banner-ads" \
  -H "Accept: application/json"

# Test creating a banner (with authentication)
curl -X POST "http://localhost:8000/api/banner-ads" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Banner",
    "business_name": "Test Company",
    "email": "test@example.com",
    "banner_type": "image",
    "banner_size": "728x90",
    "banner_image": "test.jpg",
    "destination_link": "https://example.com",
    "banner_category_id": 1,
    "country": "United States"
  }'
```

## Deployment

### Backend Deployment
1. Set up Laravel environment
2. Configure database
3. Run migrations: `php artisan migrate`
4. Seed sample data: `php artisan db:seed`
5. Set up file storage permissions
6. Configure queue workers for processing

### Frontend Deployment
1. Set environment variables
2. Build the application: `npm run build`
3. Configure API endpoints
4. Set up routing
5. Deploy to hosting platform

## Support

For issues and questions:
1. Check the API documentation
2. Review the error logs
3. Test with the provided examples
4. Contact the development team

## Changelog

### v1.0.0
- Initial release
- Complete CRUD operations
- File upload functionality
- Analytics tracking
- Multi-step submission form
- Responsive design
- Real-time filtering and search
