# 📋 Categories & Upselling System Workflow

## 🎯 Overview
This document explains the complete workflow of the categories and upselling system implementation in the WWA frontend.

---

## 🔄 Complete User Journey

### 1. **User Browsing Categories**

#### **Step 1: Homepage Category Sections**
```
User visits homepage → Sees category sections → Clicks "View All" → Navigates to CategoryPage
```

**Components Involved:**
- `CategorySection.jsx` - Displays category previews
- `CategoryPage.jsx` - Full category display

**API Calls:**
```javascript
// Fetch category tree
GET /api/v1/categories/tree

// Fetch category listings
GET /api/v1/listings/category/{slug}?sort=priority
```

**UI Flow:**
1. Homepage shows 4-8 featured categories
2. Each section shows 4-8 listings with upsell badges
3. "View All" button leads to full category page
4. Listings auto-sorted by priority (promoted first)

---

### 2. **User Viewing Category Page**

#### **Step 2: Hierarchical Category Navigation**
```
User lands on CategoryPage → Sees breadcrumbs → Views subcategories → Applies filters
```

**Components Involved:**
- `CategoryPage.jsx` - Main category page
- `CategoryItem.jsx` - Individual listing cards

**API Calls:**
```javascript
// Get category details
GET /api/v1/categories/{slug}

// Get category filters
GET /api/v1/categories/{id}/filters

// Get listings with priority sorting
GET /api/v1/listings/category/{slug}?sort=priority&page=1
```

**UI Flow:**
1. Breadcrumb navigation: Home > Parent > Current
2. Category header with icon and description
3. Subcategory grid (if any)
4. Sort controls (Priority, Newest, Price, etc.)
5. Grid/List view toggle
6. Listings with upsell badges prominently displayed

---

### 3. **User Purchasing Upsell**

#### **Step 3: Upsell Purchase Flow**
```
User sees listing → Clicks "Promote" → Opens UpsellModal → Selects upsell → Completes payment
```

**Components Involved:**
- `CategoryItem.jsx` - Listing card with promote button
- `UpsellModal.jsx` - Purchase interface

**API Calls:**
```javascript
// Get upsell options
GET /api/v1/upsell/options

// Purchase upsell
POST /api/v1/upsell/purchase
{
  "listing_id": 123,
  "upsell_type": "premium",
  "duration_days": 30,
  "payment_method": "stripe"
}

// Get updated listings
GET /api/v1/listings/category/{slug}?sort=priority
```

**UI Flow:**
1. User browsing listings sees "Promote" button
2. Click opens modal with 4 upsell options
3. Each option shows:
   - Icon and badge style
   - Price and duration
   - Priority score points
   - Description
4. User selects option and clicks "Purchase"
5. Payment gateway integration (Stripe/PayPal)
6. Success message and automatic listing refresh

---

### 4. **Priority Scoring System**

#### **Step 4: How Priority Works**
```
Listing gets upsell → Priority score calculated → Listings sorted by score → Higher scores appear first
```

**Priority Scores:**
- **Premium**: 1000 points ($50, 30 days)
- **Sponsored**: 800 points ($25, 21 days)
- **Featured**: 600 points ($15, 14 days)
- **Priority**: 400 points ($10, 7 days)

**Sorting Algorithm:**
```javascript
const sortListings = (listings, sortBy = 'priority') => {
  return listings.sort((a, b) => {
    const scoreA = a.upsells?.reduce((sum, upsell) => sum + upsell.priority_score, 0) || 0;
    const scoreB = b.upsells?.reduce((sum, upsell) => sum + upsell.priority_score, 0) || 0;
    
    return scoreB - scoreA; // Highest first
  });
};
```

**Visual Indicators:**
- Multiple upsells can be purchased
- Cumulative priority scores
- Multiple badges displayed
- Expiration tracking

---

## 🎨 Component Interaction Flow

### **Data Flow Diagram**
```
API Services → Components → UI → User Interaction → API Services
```

### **Component Hierarchy**
```
App.jsx
├── CategorySection.jsx
│   ├── CategoryItem.jsx
│   └── UpsellModal.jsx
├── CategoryPage.jsx
│   ├── CategoryItem.jsx
│   └── UpsellModal.jsx
└── AllSearchResult.jsx
    ├── CategoryItem.jsx
    └── UpsellModal.jsx
```

---

## 🔧 Technical Implementation Flow

### **1. Initialization Flow**
```javascript
// App.jsx loads
useEffect(() => {
  // Fetch categories on app start
  fetchCategories();
}, []);
```

### **2. Category Loading Flow**
```javascript
// CategoryPage.jsx
useEffect(() => {
  if (slug) {
    fetchCategoryData();  // Category details + listings
  }
}, [slug, sortBy, filters]);
```

### **3. Upsell Modal Flow**
```javascript
// CategoryItem.jsx
const handleUpsellClick = (listing, closeModal) => {
  setUpsellModal({ isOpen: true, listing });
  
  return (
    <UpsellModal
      listing={listing}
      onSuccess={() => {
        // Refresh listings to show new badge
        fetchListings();
      }}
    />
  );
};
```

---

## 📱 Mobile vs Desktop Flow

### **Mobile Flow**
```
Touch listing → See promote button → Tap promote → Modal opens → Select upsell → Complete payment
```

**Mobile Optimizations:**
- Larger touch targets
- Full-screen modals
- Simplified pricing display
- Mobile payment integration

### **Desktop Flow**
```
Hover listing → See promote button → Click promote → Modal opens → Select upsell → Complete payment
```

**Desktop Features:**
- Hover effects
- Keyboard navigation
- Multiple modals support
- Quick purchase options

---

## 🔄 State Management Flow

### **Component State**
```javascript
// CategoryPage.jsx
const [listings, setListings] = useState([]);
const [sortBy, setSortBy] = useState('priority');
const [upsellModal, setUpsellModal] = useState({ isOpen: false, listing: null });

// CategoryItem.jsx
const [showUpsellModal, setShowUpsellModal] = useState(false);

// UpsellModal.jsx
const [upsellOptions, setUpsellOptions] = useState([]);
const [purchasing, setPurchasing] = useState(false);
```

### **Data Flow**
```
API Response → Component State → UI Render → User Action → API Call → State Update → UI Re-render
```

---

## 💾 Data Models

### **Category Model**
```javascript
{
  category_id: 1,
  name: "Buy and Sell",
  slug: "buy-and-sell",
  description: "General selling posts",
  parent_id: null,
  is_active: true,
  sort_order: 4,
  posting_form_config: {},
  filter_config: {},
  children: [subcategories]
}
```

### **Listing Model**
```javascript
{
  listing_id: 123,
  title: "iPhone 13 Pro",
  description: "Like new iPhone",
  price: 899.00,
  currency: { symbol: "$", code: "USD" },
  images: [{ image_path: "/path/to/image.jpg" }],
  location: { city: "New York", country: "USA" },
  category: { category_id: 1, name: "Electronics" },
  upsells: [
    {
      upsell_type: "premium",
      expires_at: "2024-02-15T10:30:00Z",
      priority_score: 1000
    }
  ],
  priority_score: 1000, // Calculated total
  slug: "iphone-13-pro-123",
  created_at: "2024-01-15T10:30:00Z"
}
```

### **Upsell Model**
```javascript
{
  upsell_id: 456,
  listing_id: 123,
  upsell_type: "premium",
  status: "active",
  price: 50.00,
  duration_days: 30,
  starts_at: "2024-01-15T10:30:00Z",
  expires_at: "2024-02-15T10:30:00Z",
  priority_score: 1000
}
```

---

## 🎯 User Experience Flow

### **First-Time User**
1. Lands on homepage
2. Browses categories
3. Sees promoted listings with badges
4. Clicks on interesting listing
5. Sees "Promote" button on own listings
6. Understands value proposition through badges

### **Returning User**
1. Checks their listings
2. Monitors upsell performance
3. Purchases additional upsells
4. Tracks priority placement
5. Renews successful upsells

### **Power User**
1. Uses category filters
2. Sorts by priority to see competition
3. Strategically purchases upsells
4. Monitors analytics
5. Optimizes listing placement

---

## 🔍 Search Integration Flow

### **Search with Priority**
```
User searches → API returns results → Auto-sorted by priority → Promoted listings appear first
```

**Search Flow:**
```javascript
// AllSearchResult.jsx
const enhancedListings = sortListings(
  searchDataList?.listing?.items?.map(item => ({
    ...item,
    upsells: item.upsells || [],
    priority_score: item.priority_score || 0
  })) || []
);
```

---

## 💰 Payment Integration Flow

### **Payment Process**
```
User selects upsell → Payment gateway opens → User completes payment → Webhook confirms → Upsell activated
```

**Payment Steps:**
1. User clicks purchase
2. Frontend calls purchase API
3. Backend creates payment intent
4. Frontend opens payment modal
5. User completes payment
6. Payment gateway sends webhook
7. Backend activates upsell
8. Frontend refreshes listings

---

## 📊 Analytics Flow

### **Tracking Events**
```javascript
// Upsell purchase tracking
analytics.track('upsell_purchase', {
  listing_id: 123,
  upsell_type: 'premium',
  price: 50.00,
  user_id: 456
});

// Badge impression tracking
analytics.track('badge_impression', {
  listing_id: 123,
  upsell_types: ['premium', 'featured']
});
```

---

## 🚀 Performance Optimization Flow

### **Loading Strategy**
```
Initial load → Skeleton screens → Data fetch → Priority sorting → Render with badges
```

**Optimizations:**
- Lazy loading for images
- Infinite scroll for large categories
- Caching for category trees
- Debounced search input
- Optimized sorting algorithms

---

## 🔄 Error Handling Flow

### **Error States**
```javascript
// API Error handling
try {
  const response = await upsellService.purchaseUpsell(data);
  onSuccess(response);
} catch (error) {
  setError(error.message);
  // Show user-friendly error message
}

// UI Error states
if (error) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600">{error}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  );
}
```

---

## 🎯 Success Metrics Flow

### **Key Performance Indicators**
- **Upsell Conversion Rate**: % of users who purchase upsells
- **Priority Effectiveness**: How much priority improves visibility
- **Revenue per User**: Average upsell revenue per active user
- **Badge Engagement**: Click-through rates on promoted listings

### **Measurement Flow**
```javascript
// Track conversion
const trackConversion = (listingId, upsellType) => {
  analytics.track('conversion', {
    listing_id: listingId,
    upsell_type: upsellType,
    timestamp: new Date()
  });
};
```

---

## 📋 Testing Flow

### **End-to-End Test Scenario**
```
1. Create test listing
2. Purchase premium upsell
3. Verify badge appears
4. Check category page priority
5. Test search ranking
6. Verify expiration
7. Test renewal flow
```

### **Component Testing**
```javascript
// Test CategoryItem with upsell
test('CategoryItem shows upsell badges', () => {
  const listing = {
    upsells: [{ upsell_type: 'premium', priority_score: 1000 }]
  };
  
  render(<CategoryItem item={listing} onUpsellClick={mockFn} />);
  
  expect(screen.getByText('Premium')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Promote' })).toBeInTheDocument();
});
```

---

This workflow document provides a complete understanding of how the categories and upselling system works from user interaction to technical implementation.
