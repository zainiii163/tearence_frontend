# Property System API Integration Guide

## Overview

This document provides a comprehensive guide for integrating the Property System frontend with the backend API. The integration includes all property-related operations including listing, searching, filtering, posting, and managing properties.

## API Service Layer

### Location: `src/services/propertyApi.js`

The `propertyApi.js` service provides a centralized interface for all property-related API calls. It handles:

- Authentication headers
- Request/response formatting
- Error handling
- File uploads (multipart/form-data)
- Search parameter building

### Key Features

```javascript
// Authentication
propertyApi.setAuthToken(token);

// Property CRUD operations
propertyApi.getProperties(params);
propertyApi.getProperty(id);
propertyApi.createProperty(formData);
propertyApi.updateProperty(id, formData);
propertyApi.deleteProperty(id);

// Specialized endpoints
propertyApi.getFeaturedProperties();
propertyApi.getPromotedProperties();
propertyApi.getSponsoredProperties();
propertyApi.getMyProperties();
propertyApi.getSavedProperties();

// User actions
propertyApi.toggleSaveProperty(id);
propertyApi.contactAgent(id, contactData);
propertyApi.trackPropertyEvent(id, eventType, data);

// Data lookups
propertyApi.getCategories();
propertyApi.getPropertyTypes();
propertyApi.getCommercialTypes();
propertyApi.getLandTypes();
propertyApi.getPlanningPermissions();
propertyApi.getViewTypes();
```

## Custom Hooks

### Location: `src/hooks/useProperties.js`

Custom hooks provide a React-friendly interface for property data management with automatic loading states, error handling, and caching.

### Available Hooks

#### `useProperties(filters)`
Main hook for property listing with pagination and filtering.

```javascript
const {
  properties,
  loading,
  error,
  pagination,
  filters,
  updateFilters,
  resetFilters,
  loadPage,
} = useProperties({
  sort: 'newest',
  perPage: 12,
});
```

#### `useFeaturedProperties()`
Fetches featured properties for homepage display.

```javascript
const {
  properties,
  loading,
  error,
  refetch,
} = useFeaturedProperties();
```

#### `usePromotedProperties()`
Fetches promoted properties for enhanced visibility.

#### `useSponsoredProperties()`
Fetches sponsored properties for premium placement.

#### `useProperty(id)`
Fetches a single property by ID with automatic view tracking.

```javascript
const {
  property,
  loading,
  error,
  refetch,
} = useProperty(propertyId);
```

#### `useMyProperties()`
Fetches properties belonging to the current user.

#### `useSavedProperties()`
Fetches user's saved/favorite properties.

```javascript
const {
  properties,
  loading,
  error,
  refetch,
  toggleSaveProperty,
} = useSavedProperties();
```

#### `usePropertyData()`
Fetches lookup data for forms and filters.

```javascript
const {
  categories,
  propertyTypes,
  commercialTypes,
  landTypes,
  planningPermissions,
  viewTypes,
  loading,
  error,
  refetch,
} = usePropertyData();
```

#### `usePropertySubmission()`
Handles property form submission with loading states.

```javascript
const {
  submitProperty,
  loading,
  error,
  success,
  reset,
} = usePropertySubmission();
```

#### `usePropertyContact()`
Handles agent contact form submission.

```javascript
const {
  contactAgent,
  loading,
  error,
  success,
  reset,
} = usePropertyContact();
```

## Component Integration

### Property Hub (`src/Pages/property/index.jsx`)

The main property marketplace page integrates multiple hooks and components:

```javascript
// API data hooks
const {
  properties,
  loading,
  error,
  pagination,
  updateFilters,
  loadPage,
} = useProperties({ sort: 'newest', perPage: 12 });

const { properties: featuredProperties } = useFeaturedProperties();
const { categories, propertyTypes } = usePropertyData();

// Event handlers
const handleSearch = (searchData) => {
  const apiFilters = {
    search: searchData.keyword,
    location: searchData.location,
    category: searchData.category,
  };
  updateFilters(apiFilters);
};

const handleFilterChange = (newFilters) => {
  const apiFilters = {
    propertyTypes: newFilters.propertyType,
    minPrice: newFilters.priceRange?.min,
    maxPrice: newFilters.priceRange?.max,
    bedrooms: newFilters.bedrooms,
    bathrooms: newFilters.bathrooms,
    features: newFilters.amenities,
  };
  updateFilters(apiFilters);
};
```

### Property Post Form (`src/Component/property/PropertyPostForm.jsx`)

Enhanced form with API integration:

```javascript
// API hooks
const { submitProperty, loading, error, success } = usePropertySubmission();
const { categories, propertyTypes } = usePropertyData();

// Form submission
const handleSubmit = async () => {
  try {
    const submissionData = new FormData();
    
    // Add all form fields
    submissionData.append('property_type', formData.propertyType);
    submissionData.append('title', formData.title);
    // ... more fields
    
    // Add files
    if (formData.coverImage) {
      submissionData.append('cover_image', formData.coverImage);
    }
    
    const result = await submitProperty(submissionData);
    onSubmit(result);
  } catch (err) {
    console.error('Submission error:', err);
  }
};
```

## API Endpoints Reference

### Base URL
```
/api/v1/properties
```

### Authentication
All API calls require authentication token in header:
```
Authorization: Bearer {token}
```

### Main Endpoints

#### GET /api/v1/properties
List properties with filtering and pagination.

**Query Parameters:**
- `search` - Search term
- `location` - Location filter
- `category` - Category (buy, rent, lease, invest)
- `propertyTypes[]` - Property type filters
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Minimum bedrooms
- `bathrooms` - Minimum bathrooms
- `features[]` - Feature filters
- `sort` - Sort order (newest, oldest, price_low, price_high, popular)
- `page` - Page number
- `perPage` - Items per page

**Response:**
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "total": 120,
    "per_page": 12
  }
}
```

#### GET /api/v1/properties/{id}
Get single property details.

#### POST /api/v1/properties
Create new property listing.

**Content-Type:** multipart/form-data

**Fields:**
- All property fields as described in documentation
- File uploads: cover_image, additional_images[], seller_logo

#### PUT /api/v1/properties/{id}
Update existing property.

#### DELETE /api/v1/properties/{id}
Delete property.

### Specialized Endpoints

#### GET /api/v1/properties/featured
Get featured properties.

#### GET /api/v1/properties/promoted
Get promoted properties.

#### GET /api/v1/properties/sponsored
Get sponsored properties.

#### GET /api/v1/properties/my
Get current user's properties.

#### GET /api/v1/properties/saved
Get user's saved properties.

#### POST /api/v1/properties/{id}/save
Toggle property save status.

#### POST /api/v1/properties/{id}/contact
Contact property agent.

#### POST /api/v1/properties/{id}/events
Track property events (view, contact, etc.).

### Data Lookup Endpoints

#### GET /api/v1/properties/categories
Get property categories.

#### GET /api/v1/properties/types
Get property types.

#### GET /api/v1/properties/commercial-types
Get commercial property types.

#### GET /api/v1/properties/land-types
Get land types.

#### GET /api/v1/properties/planning-permissions
Get planning permission types.

#### GET /api/v1/properties/view-types
Get view types.

## Error Handling

### API Service Error Handling

The `propertyApi` service automatically handles common HTTP errors:

```javascript
try {
  const response = await propertyApi.getProperties();
  // Handle success
} catch (error) {
  // Error is already formatted and can be displayed to user
  if (error.message) {
    // Show error message
  }
  if (error.status === 401) {
    // Redirect to login
  }
  if (error.status === 403) {
    // Show permission denied
  }
}
```

### Hook Error Handling

Custom hooks provide built-in error handling:

```javascript
const { loading, error } = useProperties();

if (error) {
  // Display error to user
  return <ErrorMessage message={error} />;
}

if (loading) {
  // Show loading state
  return <LoadingSpinner />;
}
```

## File Uploads

### Supported File Types
- Images: JPEG, PNG, WebP
- Videos: MP4, WebM (for video tours)

### File Size Limits
- Cover image: 10MB
- Additional images: 5MB each
- Logo: 2MB

### Upload Implementation

```javascript
const handleFileUpload = async (field, files) => {
  const formData = new FormData();
  
  if (field === 'coverImage' && files.length > 0) {
    formData.append('cover_image', files[0]);
  } else if (field === 'additionalImages') {
    Array.from(files).forEach((file, index) => {
      formData.append(`additional_images[${index}]`, file);
    });
  }
  
  try {
    const response = await propertyApi.uploadImages(formData);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Search and Filtering

### Search Implementation

```javascript
const handleSearch = (searchData) => {
  const searchParams = propertyApi.buildSearchParams({
    search: searchData.keyword,
    location: searchData.location,
    category: searchData.category,
  });
  
  updateFilters(searchParams);
};
```

### Filter Implementation

```javascript
const handleFilterChange = (filters) => {
  const apiFilters = {
    propertyTypes: filters.propertyTypes,
    minPrice: filters.priceRange.min,
    maxPrice: filters.priceRange.max,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    features: filters.features,
  };
  
  updateFilters(apiFilters);
};
```

## Pagination

### Pagination Implementation

```javascript
const handlePageChange = (page) => {
  loadPage(page);
};

// In component
<Pagination
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  onPageChange={handlePageChange}
/>
```

## Performance Optimization

### Caching Strategy

- Custom hooks implement basic caching
- API responses are cached to reduce redundant requests
- Lookup data (categories, types) is cached separately

### Lazy Loading

- Property images use lazy loading
- Infinite scroll can be implemented with pagination
- Components are code-split using React.lazy()

### Debouncing

Search inputs are debounced to reduce API calls:

```javascript
const debouncedSearch = useMemo(
  () => debounce((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, 300),
  []
);
```

## Testing

### Unit Testing

```javascript
// Example test for useProperties hook
import { renderHook, act } from '@testing-library/react';
import { useProperties } from '../hooks/useProperties';

test('should fetch properties on mount', async () => {
  const { result } = renderHook(() => useProperties());
  
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.properties).toHaveLength(10);
  });
});
```

### Integration Testing

```javascript
// Example test for API service
import propertyApi from '../services/propertyApi';

test('should fetch properties successfully', async () => {
  const response = await propertyApi.getProperties();
  
  expect(response.data).toBeDefined();
  expect(response.meta).toBeDefined();
});
```

## Deployment Considerations

### Environment Variables

```bash
# API Configuration
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_API_VERSION=v1

# Upload Configuration
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ALLOWED_FILE_TYPES=jpg,jpeg,png,webp
```

### Build Optimization

- Code splitting for property components
- Image optimization and compression
- Bundle analysis to identify large dependencies

### CDN Configuration

- Static assets served from CDN
- API requests proxied through CDN for caching
- Image optimization via CDN

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend allows frontend origin
   - Check preflight request handling

2. **Authentication Issues**
   - Verify token is being sent in headers
   - Check token expiration and refresh logic

3. **File Upload Issues**
   - Verify Content-Type is multipart/form-data
   - Check file size limits
   - Ensure proper field names

4. **Performance Issues**
   - Implement pagination for large datasets
   - Add loading states
   - Optimize image sizes

### Debug Tools

- React DevTools for component state
- Network tab for API requests
- Console logging for error tracking

## Security Considerations

### Data Validation

- Client-side validation for better UX
- Server-side validation for security
- Sanitize user inputs

### File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Store files in secure location

### API Security

- Use HTTPS for all API calls
- Implement rate limiting
- Validate authentication tokens

## Future Enhancements

### Planned Features

1. **Real-time Updates**
   - WebSocket integration for live updates
   - Push notifications for new listings

2. **Advanced Search**
   - Geospatial search
   - AI-powered recommendations
   - Voice search

3. **Offline Support**
   - Service worker implementation
   - Offline property viewing
   - Cached search results

4. **Performance Improvements**
   - GraphQL implementation
   - Advanced caching strategies
   - Image CDN optimization

## Conclusion

This integration provides a robust foundation for the Property System frontend. The modular architecture allows for easy maintenance and future enhancements while maintaining good performance and user experience.

For any questions or issues, refer to the API documentation or contact the development team.
