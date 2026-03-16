# Banner Adverts Component Interactions Documentation

## Overview

This document details how each banner component interacts with the backend API, what buttons and sections trigger which API calls, and the complete data flow for user interactions.

## Component Interaction Matrix

| Component | API Endpoints | User Interactions | Data Flow |
|-----------|---------------|------------------|a-----------|
| BannerPostForm | POST /banner-ads, POST /banner-upload/* | Form submission, file uploads | Create banner, upload files |
| BannerCard | POST /banner-ads/{slug}/track-click | Click banner, click destination | Track analytics |
| BannerCategoryGrid | GET /banner-categories | Category selection | Filter banners |
| BannerActivityFeed | GET /banner-marketplace/analytics | Live updates | Display stats |
| BannerCarousel | POST /banner-ads/{slug}/track-click | Click carousel item | Track analytics |
| BannerFilters | GET /banner-categories | Filter selection | Apply filters |

## Detailed Component Interactions

### 1. BannerPostForm Component

#### Form Structure (9 Steps)
```
Step 1: Banner Type Selection
Step 2: Business Information
Step 3: Banner Details
Step 4: File Upload
Step 5: Banner Size Selection
Step 6: Description & Offers
Step 7: Targeting Options
Step 8: Premium Upsell
Step 9: Final Submission
```

#### API Interactions by Step:

**Step 1-3: Data Collection**
- No API calls - client-side validation only
- Stores data in local state

**Step 4: File Upload**
```javascript
// When user selects file
const handleFileUpload = async (file, type) => {
  try {
    // 1. Validate file
    validateFile(file, type);
    
    // 2. Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    // 3. Upload via API
    const response = await bannerUploadApi.uploadBannerImage(formData, bannerSize);
    
    // 4. Update state with file URL
    setFormData(prev => ({
      ...prev,
      [type]: response.data.url
    }));
    
    // 5. Show preview
    setFilePreview(response.data.url);
    
  } catch (error) {
    console.error('Upload failed:', error);
    showErrorMessage(error.message);
  }
};
```

**Step 9: Final Submission**
```javascript
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    // 1. Validate all steps
    if (!validateAllSteps()) return;
    
    // 2. Prepare banner data
    const bannerData = {
      banner_type: formData.bannerType,
      business_name: formData.businessName,
      contact_person: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      business_logo: formData.businessLogo,
      verified_badge: formData.verifiedBadge,
      title: formData.title,
      tagline: formData.tagline,
      banner_category_id: formData.category,
      country: formData.country,
      city: formData.city,
      target_audience: formData.targetAudience,
      destination_link: formData.destinationLink,
      call_to_action: formData.callToAction,
      banner_size: formData.bannerSize,
      description: formData.description,
      key_selling_points: formData.keySellingPoints,
      offer_details: formData.offerDetails,
      validity_start: formData.validityStart,
      validity_end: formData.validityEnd,
      target_countries: formData.targetCountries,
      target_categories: formData.targetCategories,
      target_devices: formData.targetDevices,
      promotion_tier: formData.promotionTier,
      terms_accepted: formData.termsAccepted,
      privacy_accepted: formData.privacyAccepted
    };
    
    // 3. Create banner via API
    const response = await bannerAdsApi.create(bannerData);
    
    // 4. Handle success
    toast.success('Banner created successfully!');
    
    // 5. Close form and refresh data
    onClose();
    onSuccess?.(response.data);
    
  } catch (error) {
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
```

#### Button Interactions:
- **"Next Step" Button**: Client-side validation, proceed to next step
- **"Previous Step" Button**: Navigate to previous step
- **"Submit Banner" Button**: Final API call to create banner
- **"Upload File" Button**: File upload API call
- **"Preview Banner" Button**: Client-side preview, no API call

### 2. BannerCard Component

#### Click Interactions:

**Banner Title/Description Click**
```javascript
const handleBannerClick = async (banner) => {
  try {
    // 1. Track click via API
    await bannerAdsApi.trackClick(banner.slug);
    
    // 2. Update local state
    setSelectedBanner(banner);
    
    // 3. Track recently viewed
    trackRecentlyViewed(banner);
    
    // 4. Show modal
    setShowBannerModal(true);
    
    // 5. Notify parent component
    onBannerClick?.(banner);
    
  } catch (error) {
    console.error('Failed to track click:', error);
    // Still show modal even if tracking fails
    setSelectedBanner(banner);
    setShowBannerModal(true);
  }
};
```

**"Visit Website" Button Click**
```javascript
const handleDestinationClick = async (e, banner) => {
  e.stopPropagation();
  
  try {
    // 1. Track destination click via API
    await bannerAdsApi.trackClick(banner.slug);
    
    // 2. Open destination link in new tab
    window.open(banner.destination_link, '_blank', 'noopener,noreferrer');
    
    // 3. Notify parent
    onDestinationClick?.(banner);
    
  } catch (error) {
    console.error('Failed to track destination click:', error);
    // Still open link even if tracking fails
    window.open(banner.destination_link, '_blank', 'noopener,noreferrer');
  }
};
```

**"Save" Button Click**
```javascript
const handleSave = async (e, banner) => {
  e.stopPropagation();
  
  try {
    // 1. Toggle saved state
    setIsSaved(!isSaved);
    
    // 2. Call save API (if implemented)
    await bannerAdsApi.saveBanner(banner.id);
    
    // 3. Show feedback
    toast.success(isSaved ? 'Banner removed from saved' : 'Banner saved successfully');
    
    // 4. Notify parent
    onSave?.(banner);
    
  } catch (error) {
    console.error('Failed to save banner:', error);
    toast.error('Failed to save banner');
  }
};
```

**"Share" Button Click**
```javascript
const handleShare = async (e, banner) => {
  e.stopPropagation();
  
  try {
    // 1. Generate share URL
    const shareUrl = `${window.location.origin}/banner-adverts/${banner.slug}`;
    
    // 2. Use native share API
    if (navigator.share) {
      await navigator.share({
        title: banner.title,
        text: banner.description,
        url: shareUrl
      });
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
    
    // 3. Track share event
    await bannerAdsApi.trackShare(banner.slug);
    
    // 4. Notify parent
    onShare?.(banner);
    
  } catch (error) {
    console.error('Failed to share banner:', error);
    toast.error('Failed to share banner');
  }
};
```

**Business Name Click**
```javascript
const handleBusinessClick = async (e, banner) => {
  e.stopPropagation();
  
  try {
    // 1. Track business click
    await bannerAdsApi.trackBusinessClick(banner.slug);
    
    // 2. Show business profile modal
    setShowBusinessModal(true);
    setSelectedBanner(banner);
    
    // 3. Notify parent
    onBusinessClick?.(banner);
    
  } catch (error) {
    console.error('Failed to track business click:', error);
    // Still show modal even if tracking fails
    setShowBusinessModal(true);
    setSelectedBanner(banner);
  }
};
```

### 3. BannerCategoryGrid Component

#### Category Selection
```javascript
const handleCategoryClick = async (category) => {
  try {
    // 1. Update local state
    setSelectedCategory(category.name);
    
    // 2. Track category selection
    await bannerCategoriesApi.trackCategoryView(category.id);
    
    // 3. Notify parent component
    onCategorySelect?.(category);
    
    // 4. Update URL parameters
    updateSearchParams({ category: category.name });
    
  } catch (error) {
    console.error('Failed to track category view:', error);
    // Still proceed even if tracking fails
    onCategorySelect?.(category);
  }
};
```

#### "View All Categories" Button
```javascript
const handleViewAllCategories = () => {
  // 1. Navigate to categories page
  navigate('/banner-categories');
  
  // 2. Track navigation event
  bannerCategoriesApi.trackCategoriesPageView();
};
```

### 4. BannerActivityFeed Component

#### Live Updates
```javascript
// Polling for live activity
useEffect(() => {
  const fetchActivityData = async () => {
    try {
      // 1. Get platform analytics
      const response = await bannerMarketplaceApi.getAnalytics();
      
      // 2. Update stats
      setPlatformStats(response.data);
      
      // 3. Generate activities based on real data
      const activities = generateRealActivities(response.data);
      setActivities(activities);
      
    } catch (error) {
      console.warn('Failed to fetch activity data:', error);
      // Fallback to mock data
      setActivities(generateMockActivities());
    }
  };
  
  // 2. Set up polling interval
  const interval = setInterval(fetchActivityData, 4000);
  
  // 3. Initial fetch
  fetchActivityData();
  
  return () => clearInterval(interval);
}, []);
```

#### "Live/Paused" Toggle
```javascript
const handleLiveToggle = () => {
  // 1. Update local state
  setIsLive(!isLive);
  
  // 2. Track user preference
  localStorage.setItem('bannerFeedLive', !isLive);
  
  // 3. If pausing, clear interval
  if (isLive) {
    clearInterval(activityInterval);
  } else {
    // Resume polling
    startPolling();
  }
};
```

### 5. BannerCarousel Component

#### Carousel Item Click
```javascript
const handleBannerClick = async (banner) => {
  try {
    // 1. Track carousel click
    await bannerAdsApi.trackClick(banner.slug);
    
    // 2. Update local state
    setExpandedBanner(banner);
    
    // 3. Notify parent
    onBannerClick?.(banner);
    
    // 4. Pause auto-scroll
    setIsPaused(true);
    
  } catch (error) {
    console.error('Failed to track carousel click:', error);
    // Still show banner even if tracking fails
    setExpandedBanner(banner);
    onBannerClick?.(banner);
  }
};
```

#### Navigation Controls
```javascript
const handlePrevious = () => {
  // 1. Update index
  setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  
  // 2. Track navigation
  bannerMarketplaceApi.trackCarouselNavigation('previous');
};

const handleNext = () => {
  // 1. Update index
  setCurrentIndex((prev) => (prev + 1) % banners.length);
  
  // 2. Track navigation
  bannerMarketplaceApi.trackCarouselNavigation('next');
};

const handlePlayPause = () => {
  // 1. Toggle playing state
  setIsPlaying(!isPlaying);
  
  // 2. Track user interaction
  bannerMarketplaceApi.trackCarouselPlayPause(!isPlaying);
};
```

### 6. BannerFilters Component

#### Category Filter
```javascript
const handleCategoryChange = async (category) => {
  try {
    // 1. Update local state
    setSelectedCategory(category);
    
    // 2. Track filter application
    await bannerCategoriesApi.trackCategoryFilter(category);
    
    // 3. Refetch banners with new filter
    refetchBanners({
      category_id: category !== 'all' ? category : undefined
    });
    
    // 4. Update URL
    updateSearchParams({ category });
    
    // 5. Notify parent
    onFilterChange?.('category', category);
    
  } catch (error) {
    console.error('Failed to apply category filter:', error);
    // Still apply filter even if tracking fails
    refetchBanners({
      category_id: category !== 'all' ? category : undefined
    });
  }
};
```

#### Country Filter
```javascript
const handleCountryChange = async (country) => {
  try {
    // 1. Update local state
    setSelectedCountry(country);
    
    // 2. Track filter application
    await bannerAdsApi.trackCountryFilter(country);
    
    // 3. Refetch banners
    refetchBanners({
      country: country !== 'all' ? country : undefined
    });
    
    // 4. Update URL
    updateSearchParams({ country });
    
    // 5. Notify parent
    onFilterChange?.('country', country);
    
  } catch (error) {
    console.error('Failed to apply country filter:', error);
    refetchBanners({
      country: country !== 'all' ? country : undefined
    });
  }
};
```

#### "Clear All Filters" Button
```javascript
const handleClearAllFilters = async () => {
  try {
    // 1. Reset all filter states
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedSize('all');
    setSelectedBadge('all');
    setVerifiedOnly(false);
    setSortBy('recent');
    
    // 2. Track filter clear
    await bannerAdsApi.trackFilterClear();
    
    // 3. Refetch all banners
    refetchBanners();
    
    // 4. Clear URL params
    clearSearchParams();
    
    // 5. Notify parent
    onClearFilters?.();
    
  } catch (error) {
    console.error('Failed to clear filters:', error);
    // Still clear filters even if tracking fails
    refetchBanners();
  }
};
```

## Main Page Integration

### BannerHero Component
```javascript
const handleSearch = async (searchData) => {
  try {
    // 1. Track search query
    await bannerMarketplaceApi.trackSearch(searchData);
    
    // 2. Update filters
    setSearchQuery(searchData.keyword);
    setSelectedCategory(searchData.category);
    setSelectedCountry(searchData.country);
    
    // 3. Refetch banners
    refetchBanners({
      search: searchData.keyword,
      category_id: searchData.category !== 'all' ? searchData.category : undefined,
      country: searchData.country !== 'all' ? searchData.country : undefined
    });
    
    // 4. Update URL
    updateSearchParams({
      search: searchData.keyword,
      category: searchData.category,
      country: searchData.country
    });
    
  } catch (error) {
    console.error('Failed to track search:', error);
    // Still perform search even if tracking fails
    refetchBanners({
      search: searchData.keyword,
      category_id: searchData.category !== 'all' ? searchData.category : undefined,
      country: searchData.country !== 'all' ? searchData.country : undefined
    });
  }
};
```

### Post Banner Button
```javascript
const handlePostBanner = () => {
  // 1. Track post banner click
  bannerMarketplaceApi.trackPostBannerClick();
  
  // 2. Show post form modal
  setShowPostForm(true);
  
  // 3. Update URL
  updateSearchParams({ postForm: true });
};
```

## Error Handling Strategy

### Global Error Handler
```javascript
const handleApiError = (error) => {
  // 1. Log error for debugging
  console.error('API Error:', error);
  
  // 2. Extract error message
  const message = error.response?.data?.error?.message || 
                  error.message || 
                  'An unexpected error occurred';
  
  // 3. Handle specific error types
  if (error.response?.status === 401) {
    // Authentication error
    redirectToLogin();
    return 'Please log in to continue';
  }
  
  if (error.response?.status === 422) {
    // Validation error
    return error.response.data.errors?.[Object.keys(error.response.data.errors)[0]]?.[0] || 
           'Validation failed';
  }
  
  if (error.response?.status === 429) {
    // Rate limit error
    return 'Too many requests. Please try again later';
  }
  
  // 4. Return user-friendly message
  return message;
};
```

### Retry Logic
```javascript
const retryApiCall = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## Performance Optimizations

### API Caching
```javascript
// Cache API responses for 5 minutes
const cache = new Map();

const cachedApiCall = async (key, apiCall) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < 300000) { // 5 minutes
      return data;
    }
  }
  
  const data = await apiCall();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

### Debounced Search
```javascript
const debouncedSearch = useMemo(
  () => debounce((searchTerm) => {
    refetchBanners({ search: searchTerm });
  }, 500),
  [refetchBanners]
);
```

### Lazy Loading
```javascript
// Load banner images lazily
const LazyBannerImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};
```

This comprehensive documentation covers all component interactions, API calls, data flows, and implementation details for the Banner Adverts system.
