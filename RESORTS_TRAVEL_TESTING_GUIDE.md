# Resorts & Travel System - Testing Guide

## 🧪 How to Test the Complete System

### 1. Start the Application

**Backend**:
```bash
cd d:\live\WWA-backend-New_main
php artisan serve
```

**Frontend**:
```bash
cd d:\live\WWA-Frontend-New-main
npm start
```

---

## 2. Access the Resorts & Travel Page

**URL**: `http://localhost:3000/resorts-travel`

**What You Should See**:
- ✅ Hero section with search bar
- ✅ Interactive world map
- ✅ Category grid (loaded from API)
- ✅ Featured destinations carousel
- ✅ Travel adverts grid
- ✅ Floating "Post Travel Advert" button (bottom-right)

---

## 3. Test the Modal Form

### Opening the Form
**Click**: Blue floating button at bottom-right that says "Post Travel Advert"

**Expected**:
- ✅ Modal overlay appears
- ✅ Form loads in center of screen
- ✅ Blue gradient header
- ✅ All form sections visible in one scrollable view
- ✅ Loading spinner while fetching data
- ✅ Form populates with:
  - Advert types (Accommodation, Transport, Experience)
  - Categories from database
  - Amenities checkboxes
  - Promotion tier cards

### Form Sections (All in One View)

#### Section 1: Basic Information
- Title (required)
- Tagline
- Advert Type dropdown (required)
- Subtype dropdown (changes based on type)
- Category dropdown
- Country (required)
- City (required)
- Address
- Latitude/Longitude
- Approximate location checkbox

#### Section 2: Type-Specific Details

**If Accommodation Selected**:
- Price per Night
- Guest Capacity
- Check-in Time
- Check-out Time
- Distance to City Centre
- Room Types (comma-separated)
- Amenities (checkboxes - scrollable)

**If Transport Selected**:
- Price per Trip
- Vehicle Type
- Passenger Capacity
- Luggage Capacity
- Service Area
- Operating Hours
- Airport Pickup checkbox

**If Experience Selected**:
- Price per Service
- Duration
- Group Size
- What's Included (textarea)
- What to Bring (textarea)

#### Section 3: Pricing & Availability
- Currency (GBP/USD/EUR)
- Available From (date)
- Available Until (date)

#### Section 4: Description & Details
- Description (required, textarea)
- Overview (textarea)
- Key Features (textarea)
- Why Travellers Love This (textarea)
- Nearby Attractions (textarea)
- Additional Notes (textarea)

#### Section 5: Contact Information
- Contact Name (required)
- Business Name
- Phone Number (required)
- Email (required)
- Website
- Verified Business checkbox

#### Section 6: Media Upload
- Main Image (file upload)
  - Upload → See preview immediately
- Additional Images (multiple files)
  - Upload → See grid of previews
  - X button to remove
- Business Logo (file upload)
  - Upload → See preview
- Video Link (URL)

#### Section 7: Promotion Options
- 4 visual cards showing tiers
- Click to select
- Shows price, features, "Most Popular" badge
- Standard, Promoted, Featured, Sponsored, Network-Wide

---

## 4. Test Form Submission

### Minimum Required Fields
1. Title
2. Advert Type
3. Subtype (accommodation_type/transport_type/experience_type)
4. Country
5. City
6. Description
7. Contact Name
8. Phone Number
9. Email

### Steps to Submit
1. Fill in all required fields (marked with red *)
2. Upload at least main image (optional but recommended)
3. Select promotion tier (defaults to Standard)
4. Click "Create Advert" button at bottom

### Expected Behavior
**While Submitting**:
- ✅ Button shows "Creating..." with spinner
- ✅ Button disabled
- ✅ Cannot close modal

**On Success**:
- ✅ Green success message appears
- ✅ "Travel advert created successfully!"
- ✅ Modal stays open for 1.5 seconds
- ✅ Modal closes automatically
- ✅ Page reloads data
- ✅ New advert appears in grid

**On Error**:
- ✅ Red error message appears
- ✅ Shows validation errors
- ✅ Modal stays open
- ✅ Can fix and resubmit

---

## 5. Test Image Upload

### Main Image
1. Click "Choose File" under Main Image
2. Select an image (JPEG, PNG, GIF, max 2MB)
3. **Expected**: 
   - Upload starts immediately
   - Preview appears below input
   - Image stored at `https://api.worldwideadverts.info/storage/resorts-travel/...`

### Additional Images
1. Click "Choose File" under Additional Images
2. Select multiple images
3. **Expected**:
   - All upload at once
   - Grid of previews appears
   - Each has X button to remove
   - Can upload more

### Logo
1. Click "Choose File" under Business Logo
2. Select logo image (max 1MB)
3. **Expected**:
   - Upload starts
   - Preview appears
   - Stored at `https://api.worldwideadverts.info/storage/resorts-travel/logos/...`

---

## 6. Test Dynamic Form Sections

### Change Advert Type
1. Select "Accommodation"
   - **Expected**: Accommodation section appears (blue background)
   - Shows: price_per_night, guest_capacity, check-in/out, amenities

2. Select "Transport"
   - **Expected**: Transport section appears (green background)
   - Shows: price_per_trip, vehicle_type, passenger_capacity, etc.

3. Select "Experience"
   - **Expected**: Experience section appears (purple background)
   - Shows: price_per_service, duration, group_size, etc.

---

## 7. Test Amenities Selection

1. Scroll to Accommodation Details section
2. Find Amenities checkboxes (scrollable box)
3. Click multiple amenities
4. **Expected**:
   - Checkboxes toggle on/off
   - Selected amenities stored in array
   - Submitted as array to backend

---

## 8. Test Promotion Tier Selection

1. Scroll to Promotion Options section
2. See 4 cards: Standard, Promoted, Featured, Sponsored, Network-Wide
3. Click different cards
4. **Expected**:
   - Selected card has blue border and blue background
   - Others have gray border
   - Price and features visible
   - "Most Popular" badge on Featured

---

## 9. Verify Data on Page

### After Successful Submission
1. Modal closes
2. Page reloads
3. **Check**:
   - New advert appears in grid
   - Images display correctly
   - Title, location, price visible
   - Promotion badge shows if not Standard

### Filter the New Advert
1. Use filters sidebar
2. Select category
3. Select country
4. **Expected**: Your advert appears in filtered results

---

## 10. Test Error Handling

### Missing Required Fields
1. Leave Title empty
2. Click "Create Advert"
3. **Expected**: Browser validation error "Please fill out this field"

### Invalid Email
1. Enter "notanemail" in Email field
2. Submit
3. **Expected**: Validation error

### Network Error
1. Stop backend server
2. Try to submit
3. **Expected**: "Network error. Please check your connection."

---

## 11. Backend Verification

### Check Database
```sql
SELECT * FROM resorts_travel_adverts ORDER BY created_at DESC LIMIT 1;
```

**Expected**:
- New row with your data
- Images stored as JSON array
- Amenities stored as JSON array
- All fields populated correctly

### Check Storage
```bash
ls public/storage/resorts-travel/
ls public/storage/resorts-travel/logos/
```

**Expected**:
- Uploaded images present
- Filenames match database paths

---

## 12. API Testing (Optional)

### Using Postman/Insomnia

**Get All Adverts**:
```
GET https://api.worldwideadverts.info/api/v1/resorts-travel
```

**Get Featured**:
```
GET https://api.worldwideadverts.info/api/v1/resorts-travel/featured
```

**Get Advert Types**:
```
GET https://api.worldwideadverts.info/api/v1/resorts-travel/advert-types
```

**Get Amenities**:
```
GET https://api.worldwideadverts.info/api/v1/resorts-travel/amenities
```

**Get Promotion Tiers**:
```
GET https://api.worldwideadverts.info/api/v1/resorts-travel/promotion-tiers
```

**Create Advert** (requires JWT token):
```
POST https://api.worldwideadverts.info/api/v1/resorts-travel
Headers:
  Authorization: Bearer {your-jwt-token}
  Content-Type: application/json
Body: {
  "title": "Test Resort",
  "advert_type": "accommodation",
  "accommodation_type": "resort",
  "country": "UK",
  "city": "London",
  "description": "Test description",
  "contact_name": "John Doe",
  "phone_number": "+44 123 456 7890",
  "email": "john@example.com"
}
```

---

## ✅ Success Criteria

### Form Functionality
- [x] Modal opens on button click
- [x] All sections visible in one view
- [x] Form loads data from API
- [x] Dynamic sections show/hide based on type
- [x] Image upload works with preview
- [x] Logo upload works with preview
- [x] Amenities checkboxes work
- [x] Promotion tier selection works
- [x] Form validates required fields
- [x] Submit button shows loading state
- [x] Success message appears
- [x] Modal closes after success
- [x] Page reloads data

### Data Persistence
- [x] Data saves to database
- [x] Images save to storage
- [x] New advert appears in list
- [x] All fields populated correctly
- [x] Arrays stored as JSON
- [x] Dates formatted correctly

### Error Handling
- [x] Validation errors display
- [x] Network errors display
- [x] Upload errors display
- [x] Form stays open on error
- [x] Can retry after error

### No Mock Data
- [x] Advert types from API
- [x] Categories from API
- [x] Amenities from API
- [x] Promotion tiers from API
- [x] Adverts list from API
- [x] Featured adverts from API
- [x] No hardcoded data anywhere

---

## 🐛 Common Issues & Solutions

### Issue: Modal doesn't open
**Solution**: Check console for errors, ensure button onClick is wired correctly

### Issue: Form data doesn't load
**Solution**: Check API is running, check network tab for failed requests

### Issue: Images don't upload
**Solution**: 
- Check file size (max 2MB for images, 1MB for logo)
- Check file format (JPEG, PNG, GIF only)
- Check storage symlink: `php artisan storage:link`

### Issue: Form submission fails
**Solution**:
- Check all required fields filled
- Check JWT token in localStorage
- Check backend validation rules
- Check console for error details

### Issue: New advert doesn't appear
**Solution**:
- Check database for new row
- Check is_active = true
- Refresh page manually
- Check filters not hiding it

---

## 🎉 Expected Final Result

After successful testing, you should have:
1. ✅ Working modal form that opens on click
2. ✅ All fields in one scrollable view (not multi-step)
3. ✅ Real-time image uploads with previews
4. ✅ Dynamic form sections based on advert type
5. ✅ Visual promotion tier selection
6. ✅ Form submits to real API
7. ✅ Data saves to database
8. ✅ Images save to storage
9. ✅ New adverts appear immediately
10. ✅ No mock data anywhere
11. ✅ Production-ready system

**The Resorts & Travel system is complete and functional!** 🌍✈️🏖️
