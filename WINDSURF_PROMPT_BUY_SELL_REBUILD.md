# Windsurf Prompt — Comprehensive Buy & Sell Platform (WorldwideAdverts)

## TASK:
Rebuild **Buy & Sell Platform** for WorldwideAdverts from scratch to match quality, modularity, and premium feel of Funding Hub and Property Hub. Remove any previous Buy & Sell pages and datasets. Ensure new page is **fully responsive**, visually modern, and includes **all core features**. Integrate a **floating "Post Item" button** that opens multi-step posting form immediately.

---

## PAGE STRUCTURE:

### **Navbar:**
Complete navigation including Home, Categories, Vehicles, Electronics, Property, Fashion & Accessories, Books & Media, Gaming, Sports & Fitness, Baby & Kids, Home & Garden, Tools & Hardware, Musical Instruments, Cameras & Photo, Pets & Supplies, Other Items, Promoted Listings, Featured Items, Sponsored Posts, Affiliates Hub, Funding Hub, Property Hub, Post Item, Login, Register. Responsive and sticky.

### **Hero Section:**
- Bold headline: "Buy, Sell, Swap & Give Away — Globally"
- Subheadline: "Discover new and used items across categories or list your item instantly"
- Search bar: Keyword search, Category, Price range, Location (auto-complete)
- Featured categories carousel

### **Category Grid:**
- 15 main categories with cards and icons
- Hover effects: Scale & shadow transitions
- Quick filters per category
- "View All" links

### **Featured & Trending Items Section:**
- Rotating carousel for Promoted/Featured/Sponsored items
- Dynamic badges (New, Promoted, Featured)
- Price, location, short description, category icon

### **Real-Time Item Feed:**
- Infinite scroll with lazy loading
- Quick actions: Save, Share, Contact Seller

---

## POSTING FORM STRUCTURE:

### **Step 1 — Item Type Selector:**
- For Sale / For Swap / Give Away

### **Step 2 — Item Information:**
- Title, Condition, Brand, Model, Color, Dimensions, Weight
- Category selection with dynamic fields based on category

### **Step 3 — Media Upload:**
- Drag & drop, multiple images (up to 10), video support
- Validation: file type, max size 10MB
- Preview gallery with remove option

### **Step 4 — Rich Text Description:**
- WYSIWYG editor (React Quill)
- Sections: Overview, Key Features, Usage Notes
- Character limits, auto-save draft

### **Step 5 — Pricing & Payment:**
- Price input, multi-currency selection
- Conditional display for "Give Away" items
- Upsell options: Promoted ($29), Featured ($49), Sponsored ($99), Network Boost ($199)

### **Step 6 — Seller / Agent Info:**
- Name, Company, Phone, Email, Website
- Logo upload, Verified Badge (optional upsell)

### **Step 7 — Location Integration:**
- Optional map pin drop
- Approximate location for privacy

### **Step 8 — Final Submission:**
- Terms & conditions checkbox
- Accuracy confirmation checkbox
- Submit button → Payment flow if upsell selected

---

## FILTER & SEARCH SYSTEM:

### **Dynamic Category Filters:**
Vehicles, Property, Electronics, Clothing, etc.

### **Real-Time Filtering:**
Instant result updates, URL persistence, active filter count

### **Sorting Options:**
Newest, Price Low→High, Price High→Low, Most Popular, Nearest First

### **Search Functionality:**
Full-text, Auto-complete, Search history, No results messaging

---

## DESIGN STYLE:

- Clean white background, soft green/blue gradients for interactive elements
- Rounded input fields, soft shadows, subtle animations
- Step-by-step progress bar for multi-step forms
- Premium card layouts, mobile-first swipeable carousels
- Touch-optimized buttons & inputs
- Responsive: 1-4 column grids depending on device

---

## TECHNICAL REQUIREMENTS:

### **State Management:**
Redux for global state, local component state for forms

### **API Integration:**
Real-time data fetching, filtering, search

### **Performance:**
Lazy loading, memoization, debounced search, virtual scrolling

### **Security:**
Input sanitization, required fields validation, file type & size checks, KYC verification for sellers

---

## MONETIZATION & UPSALE SYSTEM:

- Promoted Listings ($29)
- Featured Items ($49)
- Sponsored Posts ($99)
- Network Boost ($199)
- Subscription plans (optional) with secure payment gateway

---

## ADDITIONAL FEATURES:

- User analytics: Views, searches, filter usage, posting completions
- Interactive cards: Save, Share, Contact, Badges
- Mobile optimization: Swipe gestures, sticky headers, collapsible filters
- Future-ready: AI suggestions, AR previews, Chat integration

---

## GOAL:
Recreate Buy & Sell platform to **match comprehensiveness and premium UX** of your Property and Funding pages, ensuring **full modularity, dynamic forms, real-time filters, upsell integration, and global marketplace feel**.

---

## OPTIONAL NEXT STEP:
Merge all marketplace modules (Buy & Sell, Property, Funding, Affiliates) into **one universal multi-category marketplace** with a single floating "Post" button that dynamically opens correct posting form based on category.
