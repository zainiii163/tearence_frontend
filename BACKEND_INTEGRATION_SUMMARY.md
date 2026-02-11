# Backend Integration Summary

This document summarizes the frontend integration with the new backend features.

## Overview

The frontend has been updated to integrate with the following new backend features:

1. **User Dashboard - Advert Posts Management**
2. **Category-Specific Filters and Posting Forms**
3. **User Role Management for Business/Store Users**
4. **Enhanced Super Admin Dashboard**
5. **User Post Analytics**
6. **Analytics Event Tracking**

---

## 1. User Dashboard - Advert Posts Management

### Backend Endpoints Used
- `GET /api/v1/dashboard/user` - Enhanced with `posted_ads`, `paid_ads`, `expiring_ads`

### Frontend Implementation
- **Component**: `src/Component/AdvertPostsManagement.jsx`
- **Integration**: 
  - Fetches data from `getUserDashboard()` which now includes:
    - `posted_ads` - All active ads
    - `paid_ads` - Ads with paid/featured/promoted/sponsored flags
    - `expiring_ads` - Ads expiring within 7 days
  - Falls back to `getMyAds` API if dashboard data not available
- **Location**: User Dashboard → "Advert Posts" tab

### Data Structure
```javascript
{
  posted_ads: Array,  // Active ads
  paid_ads: Array,     // Paid/featured/promoted ads
  expiring_ads: Array, // Ads expiring soon
  // ... other dashboard data
}
```

---

## 2. Category-Specific Filters and Posting Forms

### Backend Endpoints Used
- `GET /api/v1/category/{id}/posting-form` - Get category-specific posting form configuration

### Frontend Implementation
- **Service**: `src/services/CategoryService.js`
- **Method**: `getPostingForm(categoryId)`
- **Usage**: Can be called when user navigates to posting form for a specific category

### Data Structure
```javascript
{
  fields: Array,    // Form fields configuration
  filters: Array,   // Filter configuration
  // ... other form config
}
```

### Current Status
- Service created and ready to use
- Components can be updated to use category-specific forms when needed
- Existing `PostEvents.js` component can be enhanced to use this API

---

## 3. User Role Management for Business/Store Users

### Backend Endpoints Used
- `GET /api/v1/staff` - Get staff members
- `GET /api/v1/staff/my-memberships` - Get user's staff memberships
- `POST /api/v1/staff` - Add staff member
- `PUT /api/v1/staff/{id}` - Update staff member
- `DELETE /api/v1/staff/{id}` - Remove staff member

### Frontend Implementation
- **Service**: `src/services/StaffService.js`
- **Slice**: `src/slice/StaffSlice.js`
- **Redux Store**: Added `staff` reducer
- **Components**: 
  - `BusinessMembersManager.jsx` - Already exists, can be updated to use new API
  - `StoreMembersManager.jsx` - Already exists, can be updated to use new API

### Data Structure
```javascript
{
  id: number,
  email: string,
  role: string, // "admin", "editor", "viewer"
  business_id?: number,
  store_id?: number,
  permissions: {
    post_ads: boolean,
    edit_ads: boolean,
    delete_ads: boolean,
    manage_payments: boolean,
    view_analytics: boolean,
    manage_staff: boolean,
  },
  status: string,
  created_at: string,
}
```

### Usage Example
```javascript
import { getStaff, addStaff, updateStaff, removeStaff } from "../slice/StaffSlice";

// Get staff for a business
dispatch(getStaff({ business_id: 123 }));

// Add staff member
dispatch(addStaff({
  email: "staff@example.com",
  role: "editor",
  business_id: 123,
  permissions: {
    post_ads: true,
    edit_ads: true,
    delete_ads: false,
    // ...
  }
}));
```

---

## 4. Enhanced Super Admin Dashboard

### Backend Endpoints Used
- `GET /api/v1/dashboard/admin` - Enhanced with comprehensive analytics

### Frontend Implementation
- **Component**: `src/Pages/SuperAdminDashboard.jsx`
- **Integration**: 
  - Uses `getAdminDashboard()` which now includes:
    - User statistics (total users, businesses, stores, staff)
    - Payment system statistics
    - Admin staff management
    - Platform activity metrics
    - Recent user registrations
    - Enhanced revenue and analytics tracking

### Data Structure
```javascript
{
  statistics: {
    total_users: number,
    total_businesses: number,
    total_stores: number,
    total_staff: number,
    // ... other stats
  },
  payment_systems: {
    total_transactions: number,
    successful_payments: number,
    pending_payments: number,
    failed_payments: number,
    payment_methods: Array,
  },
  admin_staff: Array,
  platform_activity: {
    last_7_days: Object,
    recent_registrations: Array,
  },
  // ... other dashboard data
}
```

---

## 5. User Post Analytics

### Backend Endpoints Used
- `GET /api/v1/analytics/user-posts` - Get user post analytics

### Frontend Implementation
- **Service**: `src/services/AnalyticsService.js` - Added `getUserPostAnalytics()`
- **Slice**: `src/slice/AnalyticsSlice.js` - Added `getUserPostAnalytics` thunk
- **Component**: `src/Component/PostAnalytics.jsx`
- **Location**: User Dashboard → "Analytics" tab

### Data Structure
```javascript
{
  overview: {
    total_listings: number,
    active_listings: number,
    paid_listings: number,
    total_views: number,
    total_favorites: number,
    total_revenue: number,
    expiring_soon: number,
  },
  by_listing: Array, // Analytics per listing
  by_event_type: {
    views: number,
    clicks: number,
    favorites: number,
    shares: number,
    contacts: number,
    applications: number,
  },
  daily_trends: Array, // Daily analytics data
  top_performing: Array, // Top performing listings
}
```

### Usage
```javascript
import { getUserPostAnalytics } from "../slice/AnalyticsSlice";

// Get analytics for last 30 days
dispatch(getUserPostAnalytics({
  start_date: "2024-01-01",
  end_date: "2024-01-31",
}));
```

---

## 6. Analytics Event Tracking

### Backend Endpoints Used
- `POST /api/v1/analytics/track-event` - Track analytics events

### Frontend Implementation
- **Service**: `src/services/AnalyticsService.js` - Added `trackEvent()`
- **Slice**: `src/slice/AnalyticsSlice.js` - Added `trackEvent` thunk
- **Utility**: `src/utils/analyticsTracker.js` - Helper functions for tracking

### Available Tracking Functions
```javascript
import {
  trackView,        // Track listing views
  trackClick,       // Track listing clicks
  trackFavorite,    // Track favorite/unfavorite
  trackShare,       // Track shares
  trackContact,     // Track contact events
  trackApplication, // Track job applications
  trackListingEvent, // Generic event tracker
} from "../utils/analyticsTracker";

// Example usage
trackView(listingId, { source: "category_page" });
trackFavorite(listingId, true, { method: "button_click" });
```

### Event Types
- `view` - Listing viewed (can be tracked without auth)
- `click` - Listing clicked
- `favorite` - Listing favorited/unfavorited
- `share` - Listing shared
- `contact` - Contact initiated
- `application` - Job application submitted

### Integration Points
- **Listing Detail Page**: `src/Component/DetailsPages/AdsDetail.js`
  - Automatically tracks views when listing is loaded
- **Category Items**: Can be updated to track clicks
- **Favorite Buttons**: Can be updated to track favorites
- **Share Buttons**: Can be updated to track shares
- **Contact Forms**: Can be updated to track contacts
- **Application Forms**: Can be updated to track applications

---

## Redux Store Updates

### New Reducer
- `staff` - Staff management state
  - `staffList` - List of staff members
  - `myMemberships` - User's staff memberships
  - `loading` - Loading state
  - `error` - Error state
  - `message` - Success/error messages

### Updated Reducers
- `analytics` - Added `userPostAnalytics` state
- `dashboard` - Uses enhanced user/admin dashboard data

---

## Files Created

1. `src/services/StaffService.js` - Staff management API service
2. `src/services/CategoryService.js` - Category posting form API service
3. `src/slice/StaffSlice.js` - Staff management Redux slice
4. `src/utils/analyticsTracker.js` - Analytics tracking utility functions
5. `src/Component/AdvertPostsManagement.jsx` - Advert posts management component
6. `src/Component/PostAnalytics.jsx` - Post analytics component

## Files Modified

1. `src/services/AnalyticsService.js` - Added user post analytics and track event
2. `src/slice/AnalyticsSlice.js` - Added user post analytics and track event thunks
3. `src/store.js` - Added staff reducer
4. `src/Pages/UserDashboard.jsx` - Added advert posts and analytics tabs
5. `src/Pages/SuperAdminDashboard.jsx` - Added payment systems tab
6. `src/Component/DetailsPages/AdsDetail.js` - Added view tracking

---

## Next Steps

1. **Update BusinessMembersManager/StoreMembersManager**: 
   - Optionally migrate to use new StaffService API
   - Keep backward compatibility with existing StoreSlice actions

2. **Category Posting Forms**:
   - Update `PostEvents.js` to fetch and use category-specific form configurations
   - Dynamically render form fields based on category

3. **Analytics Tracking**:
   - Add tracking to more components (clicks, favorites, shares, contacts)
   - Implement tracking for job applications

4. **Testing**:
   - Test all new API integrations
   - Verify analytics tracking is working
   - Test staff management functionality

5. **Error Handling**:
   - Ensure all API calls have proper error handling
   - Add user-friendly error messages

---

## API Response Examples

### User Dashboard Response
```json
{
  "data": {
    "posted_ads": [...],
    "paid_ads": [...],
    "expiring_ads": [...],
    "my_listings": [...],
    "statistics": {...},
    // ... other dashboard data
  }
}
```

### User Post Analytics Response
```json
{
  "data": {
    "overview": {
      "total_listings": 50,
      "active_listings": 45,
      "total_views": 1250,
      "total_favorites": 89,
      "total_revenue": 299.50
    },
    "by_listing": [...],
    "daily_trends": [...],
    "top_performing": [...]
  }
}
```

### Staff List Response
```json
{
  "data": {
    "members": [
      {
        "id": 1,
        "email": "staff@example.com",
        "role": "editor",
        "permissions": {...},
        "status": "active"
      }
    ],
    "available_roles": ["admin", "editor", "viewer"],
    "can_manage": true
  }
}
```

---

## Notes

- All API calls include proper error handling
- Analytics tracking fails silently to not disrupt user experience
- Components gracefully handle missing data
- Backward compatibility maintained where possible
- All new features are integrated into existing dashboard structure
