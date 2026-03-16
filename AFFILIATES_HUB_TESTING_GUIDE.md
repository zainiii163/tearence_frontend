# Affiliates Hub Testing Guide

## 🚀 Quick Start

This guide will help you test the complete Affiliates Hub implementation with real API integration.

## 📋 Prerequisites

1. **Backend API** running on `http://localhost:8000` (or configured URL)
2. **Frontend** running on `http://localhost:3000`
3. **Database** with affiliate tables populated
4. **Authentication** system configured

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
```

### API Endpoints Configuration
All API endpoints are configured in `src/config/affiliateConfig.js`

## 🧪 Testing Scenarios

### 1. **Basic Functionality Testing**

#### A. Page Loading
- [ ] Navigate to `/affiliates`
- [ ] Check if page loads without errors
- [ ] Verify all components render correctly
- [ ] Check loading states

#### B. Categories Display
- [ ] Categories are loaded from API
- [ ] Category cards display correctly
- [ ] Category counts are accurate
- [ ] Click on category filters content

#### C. Content Display
- [ ] Business offers load correctly
- [ ] User posts load correctly
- [ ] Pagination works
- [ ] Sorting options work

### 2. **Authentication Testing**

#### A. Login Flow
```javascript
// Test credentials (adjust based on your setup)
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};
```

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token is stored in localStorage
- [ ] User data is stored correctly
- [ ] Logout clears storage

#### B. Protected Routes
- [ ] Try accessing protected content without login
- [ ] Redirect to login page
- [ ] After login, access protected content

### 3. **Business Offer Testing**

#### A. Create Business Offer
- [ ] Click "Post Business Offer"
- [ ] Fill all required fields
- [ ] Upload promotional assets
- [ ] Select upsell plan
- [ ] Submit form
- [ ] Verify success message
- [ ] Check if offer appears in listings

#### B. Business Offer Validation
- [ ] Try submitting empty form
- [ ] Try with invalid email
- [ ] Try with invalid URL
- [ ] Try with commission > 100%
- [ ] Verify error messages

#### C. Business Offer Management
- [ ] View own business offers
- [ ] Edit existing offer
- [ ] Delete offer
- [ ] Verify changes reflect in listings

### 4. **User Post Testing**

#### A. Create User Post
- [ ] Click "Post Affiliate Link"
- [ ] Fill all required fields
- [ ] Upload image
- [ ] Add hashtags
- [ ] Submit form
- [ ] Verify success message
- [ ] Check if post appears in listings

#### B. User Post Validation
- [ ] Try with invalid affiliate link
- [ ] Try with too many hashtags
- [ ] Try with oversized image
- [ ] Verify error messages

### 5. **Search and Filtering Testing**

#### A. Search Functionality
- [ ] Search by business name
- [ ] Search by product title
- [ ] Search with partial matches
- [ ] Search with no results
- [ ] Search debouncing works

#### B. Filtering
- [ ] Filter by category
- [ ] Filter by country
- [ ] Filter by commission rate
- [ ] Filter by promotion tier
- [ ] Multiple filters work together

#### C. Sorting
- [ ] Sort by newest
- [ ] Sort by most views
- [ ] Sort by highest commission
- [ ] Sort by rating

### 6. **Analytics Testing**

#### A. Click Tracking
- [ ] Click on business offer
- [ ] Click on user post
- [ ] Verify analytics API is called
- [ ] Check if click count updates

#### B. View Tracking
- [ ] View business offer details
- [ ] View user post details
- [ ] Verify view count updates

### 7. **Upsell System Testing**

#### A. Upsell Plans
- [ ] View upsell plans
- [ ] Compare features
- [ ] Select different tiers
- [ ] Verify pricing is correct

#### B. Upsell Purchase
- [ ] Select upsell plan
- [ ] Proceed to payment
- [ ] Complete purchase
- [ ] Verify promotion badge appears

### 8. **Application System Testing**

#### A. Apply to Business Offer
- [ ] Click "Apply to Promote"
- [ ] Fill application form
- [ ] Upload portfolio
- [ ] Submit application
- [ ] Verify success message

#### B. Application Management
- [ ] View my applications
- [ ] Check application status
- [ ] View business responses

### 9. **Error Handling Testing**

#### A. Network Errors
- [ ] Disconnect network
- [ ] Try API calls
- [ ] Verify error messages
- [ ] Reconnect and retry

#### B. API Errors
- [ ] Invalid endpoints
- [ ] Server errors
- [ ] Timeout errors
- [ ] Verify graceful handling

### 10. **Performance Testing**

#### A. Loading Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 2 seconds
- [ ] Image loading optimization
- [ ] Lazy loading works

#### B. Large Data Sets
- [ ] Test with 100+ items
- [ ] Pagination performance
- [ ] Search performance
- [ ] Filter performance

## 🔍 API Testing

### Manual API Testing

Use Postman or curl to test endpoints directly:

#### Categories
```bash
curl -X GET "http://localhost:8000/api/v1/affiliates/categories"
```

#### Business Offers
```bash
curl -X GET "http://localhost:8000/api/v1/affiliates/business-offers"
```

#### Authentication
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Automated Testing

#### Unit Tests
```javascript
// Example test for API service
import affiliateService from '../services/AffiliateService';

test('should fetch categories', async () => {
  const categories = await affiliateService.getCategories();
  expect(categories).toBeDefined();
  expect(Array.isArray(categories.data)).toBe(true);
});
```

#### Integration Tests
```javascript
// Example integration test
import { render, screen, waitFor } from '@testing-library/react';
import AffiliatesPage from '../Pages/affiliates';

test('should load and display affiliates page', async () => {
  render(<AffiliatesPage />);
  
  await waitFor(() => {
    expect(screen.getByText('Affiliates Hub')).toBeInTheDocument();
  });
});
```

## 📱 Mobile Testing

### Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Touch interactions work
- [ ] Mobile navigation works

### Mobile Performance
- [ ] Page load time on mobile
- [ ] Image optimization
- [ ] Touch-friendly buttons
- [ ] Mobile form usability

## 🔒 Security Testing

### Authentication Security
- [ ] Token expiration
- [ ] Invalid token handling
- [ ] Protected route access
- [ ] Role-based access

### Data Validation
- [ ] Input sanitization
- [ ] XSS protection
- [ ] CSRF protection
- [ ] SQL injection protection

## 🐛 Debugging

### Common Issues

#### 1. **CORS Errors**
```javascript
// Check backend CORS configuration
// Ensure API base URL is correct
```

#### 2. **Authentication Issues**
```javascript
// Check token storage
// Verify token format
// Check API headers
```

#### 3. **Network Issues**
```javascript
// Check API connectivity
// Verify endpoint URLs
// Check timeout settings
```

### Debug Tools

#### Browser Console
- Check for JavaScript errors
- Monitor network requests
- Verify API responses

#### React DevTools
- Inspect component state
- Check props flow
- Debug hooks

#### Network Tab
- Monitor API calls
- Check response codes
- Verify payload format

## 📊 Test Results Documentation

### Test Checklist
Create a spreadsheet to track test results:

| Feature | Status | Notes | Tester | Date |
|---------|--------|-------|--------|------|
| Page Load | ✅ Pass | Loads in 2.3s | John | 2024-01-01 |
| Login | ✅ Pass | Works correctly | John | 2024-01-01 |
| Create Offer | ❌ Fail | Image upload issue | Jane | 2024-01-01 |

### Bug Reports
Document any bugs found:

```markdown
## Bug Report

**Title:** Image upload fails on business offer creation

**Steps to Reproduce:**
1. Go to /affiliates
2. Click "Post Business Offer"
3. Fill form fields
4. Try to upload image
5. Submit form

**Expected Result:** Image uploads successfully

**Actual Result:** Upload fails with error

**Severity:** High

**Priority:** P1
```

## 🚀 Deployment Testing

### Staging Environment
- [ ] Test on staging server
- [ ] Verify all features work
- [ ] Performance testing
- [ ] Load testing

### Production Deployment
- [ ] Smoke tests
- [ ] Critical path testing
- [ ] Monitoring setup
- [ ] Rollback plan

## 📞 Support

### Test Support Contact
- **Development Team:** dev-team@example.com
- **QA Team:** qa-team@example.com
- **Project Manager:** pm@example.com

### Resources
- [API Documentation](./API_DOCUMENTATION.md)
- [Component Documentation](./COMPONENT_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

**Note:** This testing guide should be updated as new features are added or existing features are modified.
