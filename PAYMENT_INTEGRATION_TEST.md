# Payment Integration Testing Guide

## Overview

This guide provides step-by-step instructions for testing the complete payment integration flow for banner ads, affiliate ads, and classified ads.

---

## 🧪 Test Environment Setup

### 1. Environment Configuration
```bash
# Ensure development environment is running
npm start

# Verify API endpoints are accessible
curl -X GET "http://localhost:8000/api/v1/banner/pricing-plans"
```

### 2. Authentication Setup
```javascript
// Set test token in localStorage
localStorage.setItem('token', 'your_test_token_here');
localStorage.setItem('customer_id', '1');
```

---

## 💳 Banner Ads Payment Testing

### Test Case 1: Get Pricing Plans
```javascript
// Test in browser console
PaymentService.getBannerPricingPlans().then(response => {
  console.log('Banner Pricing Plans:', response);
  // Expected: Array of pricing plans with id, name, price, duration_days
}).catch(error => {
  console.error('Failed to get banner pricing plans:', error);
});
```

### Test Case 2: Process Payment
```javascript
const paymentData = {
  pricing_plan_id: 1,
  payment_method: 'paypal',
  transaction_id: 'TEST_BANNER_' + Date.now(),
  banner_id: 1
};

PaymentService.processBannerPayment(paymentData).then(response => {
  console.log('Banner Payment Success:', response);
  // Expected: Success message with payment details
}).catch(error => {
  console.error('Banner Payment Failed:', error);
});
```

### Test Case 3: Create Banner with Payment
```javascript
// Navigate to /postbanner
// Fill form and submit
// Verify payment processing flow
// Check if banner appears in dashboard
```

---

## 🤝 Affiliate Ads Payment Testing

### Test Case 1: Get Pricing Plans
```javascript
PaymentService.getAffiliatePricingPlans().then(response => {
  console.log('Affiliate Pricing Plans:', response);
  // Expected: Array of pricing plans for affiliate ads
}).catch(error => {
  console.error('Failed to get affiliate pricing plans:', error);
});
```

### Test Case 2: Process Payment
```javascript
const paymentData = {
  pricing_plan_id: 1,
  payment_method: 'paypal',
  transaction_id: 'TEST_AFFILIATE_' + Date.now(),
  affiliate_id: 1
};

PaymentService.processAffiliatePayment(paymentData).then(response => {
  console.log('Affiliate Payment Success:', response);
}).catch(error => {
  console.error('Affiliate Payment Failed:', error);
});
```

### Test Case 3: Create Affiliate with Payment
```javascript
// Navigate to /postaffiliate
// Fill form and submit
// Verify payment processing
// Check analytics dashboard
```

---

## 📄 Classified Ads Payment Testing

### Test Case 1: Get Pricing Plans
```javascript
PaymentService.getAllAdPricingPlans().then(response => {
  const classifiedPlans = response.data?.filter(plan => plan.ad_type === 'classified');
  console.log('Classified Pricing Plans:', classifiedPlans);
}).catch(error => {
  console.error('Failed to get classified pricing plans:', error);
});
```

### Test Case 2: Process Payment
```javascript
const paymentData = {
  pricing_plan_id: 1,
  payment_method: 'paypal',
  transaction_id: 'TEST_CLASSIFIED_' + Date.now(),
  classified_id: 1
};

// Note: This endpoint needs to be implemented in backend
PaymentService.processClassifiedPayment(paymentData).then(response => {
  console.log('Classified Payment Success:', response);
}).catch(error => {
  console.error('Classified Payment Failed:', error);
});
```

### Test Case 3: Create Classified with Payment
```javascript
// Navigate to /postclassified
// Fill form with images
// Submit and verify payment flow
// Check dashboard for new classified
```

---

## 🎯 Dashboard Integration Testing

### Test Case 1: Banner Ads Management
```javascript
// Navigate to /dashboard
// Click "Banner Ads" tab
// Verify:
// - List of user's banner ads
// - Status badges (Active, Pending, Expired)
// - Edit/Delete functionality
// - Renewal modal for expired ads
```

### Test Case 2: Affiliate Ads Management
```javascript
// Navigate to /dashboard
// Click "Affiliate Ads" tab
// Verify:
// - List of affiliate ads
// - Performance analytics (clicks, impressions, CTR)
// - External link functionality
// - Edit/Delete functionality
```

### Test Case 3: Classified Ads Management
```javascript
// Navigate to /dashboard
// Click "Classified Ads" tab
// Verify:
// - List of classified ads
// - Category filtering
// - Mark as sold functionality
// - Performance stats
// - Image management
```

---

## 🔧 API Endpoint Testing

### Complete Test Script
```javascript
// Test all payment-related endpoints
const testPaymentEndpoints = async () => {
  console.log('🧪 Starting Payment Integration Tests...');
  
  try {
    // Test 1: Get banner pricing plans
    console.log('📋 Test 1: Banner Pricing Plans');
    const bannerPlans = await PaymentService.getBannerPricingPlans();
    console.log('✅ Banner Plans:', bannerPlans.data?.length || 0, 'plans found');
    
    // Test 2: Get affiliate pricing plans
    console.log('📋 Test 2: Affiliate Pricing Plans');
    const affiliatePlans = await PaymentService.getAffiliatePricingPlans();
    console.log('✅ Affiliate Plans:', affiliatePlans.data?.length || 0, 'plans found');
    
    // Test 3: Get all ad pricing plans
    console.log('📋 Test 3: All Ad Pricing Plans');
    const allPlans = await PaymentService.getAllAdPricingPlans();
    console.log('✅ All Plans:', allPlans.data?.length || 0, 'plans found');
    
    // Test 4: Get payment history
    console.log('📋 Test 4: Payment History');
    const paymentHistory = await PaymentService.getPaymentHistory();
    console.log('✅ Payment History:', paymentHistory.data?.length || 0, 'payments found');
    
    // Test 5: Get revenue analytics (admin only)
    console.log('📋 Test 5: Revenue Analytics');
    try {
      const revenueAnalytics = await PaymentService.getRevenueAnalytics();
      console.log('✅ Revenue Analytics:', revenueAnalytics.data ? 'Success' : 'Failed');
    } catch (error) {
      console.log('⚠️ Revenue Analytics (expected for admin):', error.message);
    }
    
    console.log('🎉 All Payment Integration Tests Completed!');
    
  } catch (error) {
    console.error('❌ Payment Integration Test Failed:', error);
  }
};

// Run tests
testPaymentEndpoints();
```

---

## 📱 UI Component Testing

### Test BannerAdsManagement Component
```javascript
// Test in React DevTools
const testBannerComponent = () => {
  // Test 1: Component renders
  const component = document.querySelector('[data-testid="banner-ads-management"]');
  console.log('📱 Banner Component Rendered:', !!component);
  
  // Test 2: Stats cards display
  const statsCards = document.querySelectorAll('[data-testid="stats-card"]');
  console.log('📊 Stats Cards:', statsCards.length);
  
  // Test 3: Filter functionality
  const filterSelect = document.querySelector('[data-testid="status-filter"]');
  console.log('🔍 Filter Select:', !!filterSelect);
  
  // Test 4: Search functionality
  const searchInput = document.querySelector('[data-testid="search-input"]');
  console.log('🔍 Search Input:', !!searchInput);
  
  // Test 5: Action buttons
  const actionButtons = document.querySelectorAll('[data-testid="action-button"]');
  console.log('⚡ Action Buttons:', actionButtons.length);
};
```

### Test AffiliateAdsManagement Component
```javascript
const testAffiliateComponent = () => {
  // Test analytics toggle
  const analyticsButtons = document.querySelectorAll('[data-testid="analytics-toggle"]');
  console.log('📈 Analytics Buttons:', analyticsButtons.length);
  
  // Test performance display
  const performanceStats = document.querySelectorAll('[data-testid="performance-stat"]');
  console.log('📊 Performance Stats:', performanceStats.length);
  
  // Test external links
  const externalLinks = document.querySelectorAll('[data-testid="external-link"]');
  console.log('🔗 External Links:', externalLinks.length);
};
```

### Test ClassifiedAdsManagement Component
```javascript
const testClassifiedComponent = () => {
  // Test category filter
  const categorySelect = document.querySelector('[data-testid="category-filter"]');
  console.log('🏷️ Category Filter:', !!categorySelect);
  
  // Test sold status
  const soldBadges = document.querySelectorAll('[data-testid="sold-badge"]');
  console.log('💰 Sold Badges:', soldBadges.length);
  
  // Test image previews
  const imagePreviews = document.querySelectorAll('[data-testid="image-preview"]');
  console.log('🖼️ Image Previews:', imagePreviews.length);
};
```

---

## 🚨 Error Handling Tests

### Test Network Errors
```javascript
const testErrorHandling = async () => {
  // Test 1: Invalid pricing plan ID
  try {
    await PaymentService.processBannerPayment({
      pricing_plan_id: 999999,
      payment_method: 'paypal',
      transaction_id: 'TEST_ERROR'
    });
  } catch (error) {
    console.log('✅ Invalid Plan ID Error Handled:', error.message);
  }
  
  // Test 2: Network timeout
  // Simulate network issues
  const originalFetch = window.fetch;
  window.fetch = () => Promise.reject(new Error('Network timeout'));
  
  try {
    await PaymentService.getBannerPricingPlans();
  } catch (error) {
    console.log('✅ Network Error Handled:', error.message);
  }
  
  // Restore original fetch
  window.fetch = originalFetch;
};
```

### Test Validation Errors
```javascript
const testValidationErrors = () => {
  // Test empty form submission
  const form = document.querySelector('#banner-form');
  const submitButton = form.querySelector('[type="submit"]');
  
  // Submit empty form
  submitButton.click();
  
  // Check for error messages
  setTimeout(() => {
    const errorMessages = document.querySelectorAll('[data-testid="error-message"]');
    console.log('⚠️ Validation Errors:', errorMessages.length);
  }, 1000);
};
```

---

## 📊 Performance Testing

### Load Testing
```javascript
const testPerformance = () => {
  // Test 1: Component render time
  const startTime = performance.now();
  
  // Mount component (in real test)
  const endTime = performance.now();
  console.log('⚡ Render Time:', endTime - startTime, 'ms');
  
  // Test 2: API response time
  const apiStart = performance.now();
  PaymentService.getBannerPricingPlans().then(() => {
    const apiEnd = performance.now();
    console.log('🌐 API Response Time:', apiEnd - apiStart, 'ms');
  });
};
```

### Memory Testing
```javascript
const testMemoryUsage = () => {
  // Check memory before and after operations
  const memoryBefore = performance.memory?.usedJSHeapSize || 0;
  
  // Perform operations (load large dataset)
  PaymentService.getPaymentHistory().then(() => {
    const memoryAfter = performance.memory?.usedJSHeapSize || 0;
    console.log('💾 Memory Usage:', {
      before: memoryBefore,
      after: memoryAfter,
      difference: memoryAfter - memoryBefore
    });
  });
};
```

---

## ✅ Test Checklist

### Frontend Tests
- [ ] PaymentService methods return correct data
- [ ] Error handling displays user-friendly messages
- [ ] Loading states show during API calls
- [ ] Forms validate correctly before submission
- [ ] Image upload works with preview functionality
- [ ] Dashboard tabs switch correctly
- [ ] Status badges display correctly
- [ ] Renewal modals work for expired ads
- [ ] Search and filter functionality works
- [ ] Responsive design on mobile/tablet
- [ ] Toast notifications show for success/error

### Backend Tests
- [ ] Pricing plans endpoints return correct data
- [ ] Payment processing creates transactions
- [ ] Banner/affiliate creation works with payment
- [ ] Classified creation works with images
- [ ] Expiry dates are calculated correctly
- [ ] Revenue tracking updates properly
- [ ] Authentication is enforced correctly

### Integration Tests
- [ ] Complete payment flow works end-to-end
- [ ] Dashboard displays updated data after payments
- [ ] Ad management functions work correctly
- [ ] Analytics data displays properly
- [ ] Error states are handled gracefully
- [ ] Performance is acceptable (< 2s load time)

---

## 🔧 Debug Tools

### Console Commands
```javascript
// Clear all test data
localStorage.clear();
sessionStorage.clear();

// Set test authentication
localStorage.setItem('token', 'test_token');
localStorage.setItem('customer_id', '1');

// Test payment flow
window.testPayment = () => {
  PaymentService.getBannerPricingPlans().then(plans => {
    console.log('Available Plans:', plans);
  });
};

// Run payment tests
window.testPayment();
```

### Network Monitoring
```javascript
// Monitor API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 API Call:', args[0]);
  return originalFetch.apply(this, args).then(response => {
    console.log('📡 API Response:', response.status, response.url);
    return response;
  });
};
```

---

## 📞 Troubleshooting

### Common Issues and Solutions

1. **CORS Errors**
   ```bash
   # Check backend CORS configuration
   # Ensure Allow-Origin includes your frontend URL
   ```

2. **Authentication Failures**
   ```javascript
   // Check token format and expiration
   const token = localStorage.getItem('token');
   console.log('Token:', token);
   ```

3. **Payment Processing Issues**
   ```javascript
   // Check payment gateway configuration
   // Verify transaction IDs are unique
   // Check webhook endpoints
   ```

4. **Component Rendering Issues**
   ```javascript
   // Check React DevTools for errors
   // Verify all required props are passed
   // Check for missing imports
   ```

---

## 📈 Success Metrics

### Performance Targets
- API response time: < 500ms
- Component render time: < 100ms
- Page load time: < 2s
- Memory usage: < 50MB for dashboard

### User Experience Targets
- Form validation: Clear, helpful error messages
- Loading states: Smooth animations
- Error handling: Graceful degradation
- Mobile responsive: All components work on mobile

---

**Test Guide Version**: 1.0.0  
**Last Updated**: January 2026  
**Compatible With**: WWA Frontend v1.0+
