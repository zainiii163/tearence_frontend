# Events & Venues Posting Form - Integration Guide

## Overview

A comprehensive React form system for posting Events, Venues, and Venue Services with dynamic UI, smart add-ons, and promotion upsell features.

## 🚀 IMPORTANT - Use Updated Version

**NEW UNIFIED FORM**: `/src/Component/events/EventVenuePostForm.jsx`  
**NEW ROUTE**: `/events-venues/post`  
**STATUS**: ✅ **Current Version - Use This**

**OLD DEPRECATED**: `/src/Component/EventsVenues/`  
**STATUS**: ⚠️ **Deprecated - Do Not Use**

## Component Structure

```
src/Component/events/                    # ✅ NEW - Use This
├── EventVenuePostForm.jsx           # Main orchestrator component
├── PostTypeSelector.jsx             # Post type selection (Event/Venue/Service)
├── EventForm.jsx                   # Event-specific form fields
├── VenueForm.jsx                   # Venue-specific form fields  
├── VenueServiceForm.jsx            # Service/promotional event form
├── SmartAddons.jsx                 # Dynamic add-ons based on post type
├── PromotionUpsell.jsx             # 4-tier promotion system
├── FormSummary.jsx                 # Sticky cost summary panel
└── TestPage.jsx                   # Test page for verification

src/Component/EventsVenues/          # ⚠️ DEPRECATED - Do Not Use
├── PostEventForm.jsx               # DEPRECATED
├── PostVenueForm.jsx               # DEPRECATED
└── DEPRECATED.md                  # Deprecation notice
```

## Features

### ✅ Dynamic Form System
- Three post types: Event, Venue, Service
- Form fields adapt based on selection
- Real-time form validation
- File upload support (images, PDFs, videos)

### ✅ Smart Add-ons
- **Events**: Venue matching service
- **Venues**: Event promotion cross-sell
- **Services**: Additional service bundles

### ✅ Promotion Tiers
1. **Promoted Listing** - $29
2. **Featured Listing** - $79  
3. **Sponsored Listing** - $149
4. **Spotlight Listing** - $299

### ✅ Modern UI/UX
- Responsive design (desktop, tablet, mobile)
- Tailwind CSS styling
- Lucide React icons
- Smooth animations and transitions
- Sticky summary panel

## API Integration

### Submit Endpoint
```javascript
POST /api/events/submit
Content-Type: application/json
Authorization: Bearer {token}

{
  "postType": "event|venue|service",
  "eventData": { ... },           // Only for events
  "venueData": { ... },           // Only for venues  
  "serviceData": { ... },         // Only for services
  "addons": { ... },
  "promotionTier": "promoted|featured|sponsored|spotlight",
  "submittedAt": "2024-01-01T00:00:00.000Z"
}
```

### Response Format
```javascript
// Success (200 OK)
{
  "success": true,
  "listingId": "uuid",
  "message": "Listing submitted successfully"
}

// Error (4xx/5xx)
{
  "success": false,
  "error": "Error message"
}
```

## Usage

### Basic Integration (NEW - Recommended)
```jsx
import EventVenuePostForm from './Component/events/EventVenuePostForm';

function App() {
  return (
    <div>
      <EventVenuePostForm />
    </div>
  );
}
```

### Route Configuration (NEW)
```jsx
// In App.jsx - Already configured
{logIn ? (
  <Route
    path="/events-venues/post"
    element={
      <EmailVerifiedRoute>
        <EventVenuePostForm />
      </EmailVerifiedRoute>
    }
  />
) : (
  <Route path="/events-venues/post" element={<Navigate to="/Login" />} />
)}
```

### With Custom API
```jsx
// In EventVenuePostForm.jsx - update handleSubmit method
const handleSubmit = async (e) => {
  // ... existing code ...
  
  const response = await fetch('/your-custom-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${yourAuthToken}`
    },
    body: JSON.stringify(payload)
  });
  
  // ... handle response ...
};
```

## Form Fields

### Event Form
- Event Title, Category, Date/Time
- Country, City, Venue Name
- Ticket Type (Free/Paid/Donation), Price
- Media Uploads (Poster, Gallery, Video)
- Description, Schedule, Age Restrictions
- Contact & Social Links

### Venue Form  
- Venue Name, Type, Capacity
- Country, City, Price Range
- Media Uploads (Images, Floor Plan, Video)
- Amenities (WiFi, Parking, Catering, etc.)
- Environment (Indoor/Outdoor/Both)
- Contact & Social Links

### Service Form
- Service Name, Category
- Country, City, Price Range
- Portfolio Images, Promo Video
- Package Tiers (Basic/Standard/Premium)
- Availability, Working Hours
- Contact & Social Links

## Migration from Old Forms

### From PostEventForm.jsx (DEPRECATED)
```jsx
// OLD - Don't Use
import PostEventForm from './Component/EventsVenues/PostEventForm';

// NEW - Use This Instead
import EventVenuePostForm from './Component/events/EventVenuePostForm';
```

### From PostVenueForm.jsx (DEPRECATED)
```jsx
// OLD - Don't Use
import PostVenueForm from './Component/EventsVenues/PostVenueForm';

// NEW - Use This Instead  
import EventVenuePostForm from './Component/events/EventVenuePostForm';
```

## Styling

The form uses Tailwind CSS with a consistent color scheme:
- **Primary**: Blue (blue-600)
- **Success**: Green (green-600)  
- **Warning**: Orange (orange-600)
- **Error**: Red (red-600)
- **Neutral**: Gray (gray-600)

## Responsive Design

- **Desktop**: 3-column grid layout
- **Tablet**: 2-column grid layout
- **Mobile**: Single column layout
- Sticky summary panel on desktop
- Collapsible sections on mobile

## Performance Optimizations

- Lazy loading of media upload components
- Optimized image upload handling
- Prevented unnecessary re-renders
- Debounced form inputs where appropriate

## Testing

### Test Page
Access `TestPage.jsx` to verify all components work together:

```jsx
import TestPage from './Component/events/TestPage';
```

### Manual Testing Checklist
- [ ] Post type selection works
- [ ] Form fields appear correctly for each type
- [ ] File uploads handle properly
- [ ] Add-ons display based on post type
- [ ] Promotion tiers selectable
- [ ] Form validation works
- [ ] Submit button enables/disables correctly
- [ ] Summary panel updates in real-time

## Customization

### Adding New Post Types
1. Create new form component (e.g., `NewTypeForm.jsx`)
2. Update `PostTypeSelector.jsx` with new option
3. Add case in `EventVenuePostForm.jsx` renderForm()
4. Update form submission payload structure

### Modifying Promotion Tiers
Edit `promotionTiers` array in `PromotionUpsell.jsx`:
```javascript
{
  id: 'new-tier',
  name: 'New Tier Name',
  price: 199,
  icon: YourIcon,
  color: 'purple',
  benefits: [...],
  features: {...}
}
```

### Custom Styling
Override Tailwind classes in your CSS or modify component classes directly.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure API endpoints are configured
4. Test with `TestPage.jsx` first

## Future Enhancements

- [ ] Multi-step form with progress indicator
- [ ] Form draft auto-save
- [ ] Advanced image editor
- [ ] Real-time availability calendar
- [ ] Integration with payment gateways
- [ ] Social media sharing previews
- [ ] Analytics tracking integration

---

**Last Updated**: March 6, 2026  
**Version**: 2.0 (Unified Form)  
**Previous Version**: 1.0 (Separate Forms - Deprecated)
