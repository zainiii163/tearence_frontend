# Affiliates Hub API Integration Testing Guide

## 🎯 Overview

This guide provides comprehensive testing scenarios for the Affiliates Hub API integration. All mock data has been replaced with real API calls, and proper error handling and loading states have been implemented.

## 📋 Prerequisites

1. **Backend API Server** running at `http://localhost:8000/api` (or configured via `REACT_APP_API_BASE_URL`)
2. **Authentication endpoints** working (`/api/v1/auth/login`, `/api/v1/auth/register`)
3. **Database migrations** run for affiliates tables
4. **File upload endpoints** configured and working

## 🧪 Testing Scenarios

### 1. **Main Affiliates Page Loading**

**Test Steps:**
1. Navigate to `/affiliates`
2. Verify page loads without errors
3. Check browser console for any API errors
4. Verify loading states are shown

**Expected Results:**
- Categories load from `/api/v1/affiliates/categories`
- Business offers load from `/api/v1/affiliates/business-offers`
- User posts load from `/api/v1/affiliates/user-posts`
- Upsell plans load from `/api/v1/affiliates/upsell-plans`
- Platform stats load from `/api/v1/affiliates/stats`
- Loading indicators show during data fetching
- Error handling works if API calls fail

**API Calls to Verify:**
```javascript
// Check Network tab in browser dev tools
GET /api/v1/affiliates/categories
GET /api/v1/affiliates/business-offers?per_page=12
GET /api/v1/affiliates/user-posts?per_page=12
GET /api/v1/affiliates/upsell-plans
GET /api/v1/affiliates/stats
```

### 2. **Business Affiliate Form Submission**

**Test Steps:**
1. Navigate to `/affiliates`
2. Click "Post Affiliate Listing"
3. Select "Business" path
4. Fill in all required fields:
   - Business Name: "Test Business Inc"
   - Product Title: "Test Product"
   - Tagline: "Best test product ever"
   - Category: Select any category
   - Country: "United States"
   - Commission Type: "percentage"
   - Commission Rate: "15"
   - Description: "Test description"
   - Tracking Link: "https://example.com/track"
   - Business Email: "test@example.com"
5. Upload product images (test file upload)
6. Click "Next" through all steps
7. Submit form

**Expected Results:**
- File uploads work correctly
- Form validation catches missing required fields
- API call to `POST /api/v1/affiliates/business-offers`
- Success message shows on successful submission
- Error handling works for API failures
- Loading states show during submission

**API Call to Verify:**
```javascript
POST /api/v1/affiliates/business-offers
{
  "business_name": "Test Business Inc",
  "product_service_title": "Test Product",
  "tagline": "Best test product ever",
  "affiliate_category_id": 1,
  "country": "United States",
  "commission_type": "percentage",
  "commission_rate": 15.0,
  "description": "Test description",
  "tracking_link": "https://example.com/track",
  "business_email": "test@example.com"
}
```

### 3. **Promoter/User Affiliate Form Submission**

**Test Steps:**
1. Navigate to `/affiliates`
2. Click "Post Affiliate Listing"
3. Select "Promoter" path
4. Fill in all required fields:
   - Post Title: "My Favorite Products"
   - Description: "Check out these amazing products"
   - Category: Select any category
   - Country: "United States"
   - Affiliate Link: "https://amazon.com/example?tag=test"
   - Target Audience: "Tech enthusiasts"
5. Upload promotional image
6. Add some hashtags
7. Click "Next" through all steps
8. Submit form

**Expected Results:**
- Image upload works correctly
- Hashtag functionality works
- API call to `POST /api/v1/affiliates/user-posts`
- Success message shows on submission
- Form validation works
- Error handling for API failures

**API Call to Verify:**
```javascript
POST /api/v1/affiliates/user-posts
{
  "title": "My Favorite Products",
  "description": "Check out these amazing products",
  "affiliate_category_id": 1,
  "country": "United States",
  "affiliate_link": "https://amazon.com/example?tag=test",
  "hashtags": ["tech", "products"],
  "target_audience": "Tech enthusiasts"
}
```

### 4. **Search and Filtering**

**Test Steps:**
1. Navigate to `/affiliates`
2. Use search bar to search for "laptop"
3. Select a category filter
4. Apply country filter
5. Toggle "Verified" filter
6. Change sort options

**Expected Results:**
- Search API call to `GET /api/v1/affiliates/search?q=laptop&type=all`
- Filter updates trigger API calls with parameters
- Results update correctly
- Loading states show during filtering
- URL parameters update correctly

**API Calls to Verify:**
```javascript
GET /api/v1/affiliates/search?q=laptop&type=all
GET /api/v1/affiliates/business-offers?category_id=1&country=United+States&verified=true
GET /api/v1/affiliates/user-posts?category_id=1&sort=created_at
```

### 5. **Click Tracking**

**Test Steps:**
1. Navigate to `/affiliates`
2. Click on any business offer or user post
3. Check browser network tab
4. Verify affiliate link opens in new tab

**Expected Results:**
- Click tracking API call to `POST /api/v1/affiliates/track-click`
- Affiliate link opens in new tab with proper security attributes
- Error handling doesn't break the user experience if tracking fails

**API Call to Verify:**
```javascript
POST /api/v1/affiliates/track-click
{
  "type": "business", // or "user"
  "id": 123
}
```

### 6. **Error Handling**

**Test Steps:**
1. Disconnect from internet
2. Try to load `/affiliates`
3. Reconnect and submit form with invalid data
4. Try to upload invalid file type
5. Submit form without required fields

**Expected Results:**
- Network errors show user-friendly messages
- Validation errors display properly
- Form doesn't crash on API failures
- Loading states clear appropriately
- Toast notifications show error messages

### 7. **Authentication Integration**

**Test Steps:**
1. Log out of the application
2. Try to access `/affiliates`
3. Click "Post Affiliate Listing"
4. Verify redirect to login
5. Log in with valid credentials
6. Verify redirect back to affiliates page

**Expected Results:**
- Public pages work without authentication
- Protected actions redirect to login
- Post-login redirect works correctly
- JWT tokens are stored and used properly

## 🔍 Debugging Tools

### Browser Console
Check for:
- API call errors
- JavaScript errors
- Network request failures
- Authentication token issues

### Network Tab
Monitor:
- All API endpoints being called
- Request/response payloads
- HTTP status codes
- Response times

### Response Validation
Verify API responses match expected format:
```javascript
// Success response format
{
  "success": true,
  "data": { ... }
}

// Error response format
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

## 📊 Performance Testing

### Load Testing
1. Test with large number of affiliate posts
2. Verify pagination works
3. Check infinite scroll performance
4. Monitor memory usage

### File Upload Testing
1. Test with various file sizes
2. Test with different file types
3. Test upload progress indicators
4. Test upload error handling

## 🚨 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Ensure backend allows requests from frontend domain

### Issue: Authentication Failures
**Solution:** Check JWT token storage and API headers

### Issue: File Upload Failures
**Solution:** Verify multipart/form-data handling on backend

### Issue: Slow Loading
**Solution:** Implement pagination and lazy loading

### Issue: Search Not Working
**Solution:** Check API endpoint and query parameters

## ✅ Success Criteria

All tests pass when:
- [ ] All API endpoints respond correctly
- [ ] Error handling works gracefully
- [ ] Loading states show appropriately
- [ ] File uploads work correctly
- [ ] Search and filtering function properly
- [ ] Click tracking works
- [ ] Authentication integration works
- [ ] UI responds correctly to API responses
- [ ] No console errors
- [ ] Mobile responsiveness maintained

## 📞 Support

If issues arise during testing:
1. Check browser console for errors
2. Verify backend API is running
3. Check network connectivity
4. Review API response formats
5. Test with clean browser cache

## 🔄 Continuous Testing

Run these tests:
- Before each deployment
- After API changes
- After frontend updates
- On different browsers
- On mobile devices
