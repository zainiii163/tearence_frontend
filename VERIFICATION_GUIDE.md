# Feature Verification Guide

This guide provides step-by-step procedures to verify that all 8 major feature areas are correctly implemented and working as expected.

---

## How to Use This Guide

1. **Follow each section sequentially** - Features depend on each other
2. **Use checkboxes** to track your progress
3. **Document issues** found during verification
4. **Test in both development and staging** environments before production

---

## Verification Checklist Summary

- [ ] 1. Category Pages Redesign
- [ ] 2. Dashboard Redesign (User & Super Admin)
- [ ] 3. Job Posting Form
- [ ] 4. Candidate Profile Features & Upsells
- [ ] 5. Backend APIs
- [ ] 6. Database Schema Updates
- [ ] 7. Monetization & Analytics
- [ ] 8. Testing & Deployment Readiness

---

## 1. Category Pages Redesign Verification

### 1.1 Visual & Layout Checks

#### Jobs Page (`/jobs`)
- [ ] **Page loads without errors** (check browser console)
- [ ] **Modern layout** displays correctly:
  - [ ] Header with search bar visible
  - [ ] Filter sidebar on the left (desktop) or collapsible (mobile)
  - [ ] Job listings grid/list view in center
  - [ ] Pagination controls visible at bottom
- [ ] **Responsive design**:
  - [ ] Desktop (> 1024px): All elements visible, sidebar fixed
  - [ ] Tablet (640px - 1024px): Layout adapts, filters collapsible
  - [ ] Mobile (< 640px): Stacked layout, hamburger menu for filters
- [ ] **Design consistency**: Matches your design system (colors, fonts, spacing)

#### Services Page (`/services`)
- [ ] All Jobs page checks apply
- [ ] Service-specific styling is applied
- [ ] Price information displays correctly

#### Other Category Pages
- [ ] Property page uses ModernCategoryPage component
- [ ] Classified Ads page uses ModernCategoryPage component
- [ ] Business page uses ModernCategoryPage component
- [ ] All category pages share the same modern design

### 1.2 Functional Checks

#### Filters Testing
- [ ] **Job Type filter**:
  - [ ] Dropdown shows: Full Time, Part Time, Contract, Freelance, Internship
  - [ ] Selecting a job type filters results immediately
  - [ ] Filter badge appears showing active filter
  - [ ] Multiple job types can be selected (if applicable)
- [ ] **Salary Range filter**:
  - [ ] Predefined ranges work (e.g., $0-50k, $50k-100k)
  - [ ] Custom min/max inputs work
  - [ ] Validation prevents min > max
  - [ ] Results filter correctly based on salary range
- [ ] **Location filter**:
  - [ ] Country dropdown populates from backend
  - [ ] City/Zone search works (autocomplete)
  - [ ] Selecting location filters results
  - [ ] Location badge displays correctly
- [ ] **Multiple filters**:
  - [ ] Can apply job type + salary + location simultaneously
  - [ ] All active filters show as badges
  - [ ] "Clear all filters" button works
  - [ ] Individual filter badges can be removed

#### Sorting Testing
- [ ] **Newest First**: Most recent jobs appear first
- [ ] **Oldest First**: Oldest jobs appear first
- [ ] **Salary: Low to High**: Sorted by minimum salary ascending
- [ ] **Salary: High to Low**: Sorted by maximum salary descending
- [ ] **Most Relevant**: Uses keyword matching or algorithm
- [ ] URL updates when sorting changes
- [ ] Sort persists on page refresh

#### Pagination Testing
- [ ] **Page numbers** display correctly
- [ ] **Previous/Next buttons** work
- [ ] Clicking page number navigates to that page
- [ ] URL updates with page parameter (e.g., `?page=2`)
- [ ] Page state persists on refresh
- [ ] Loading indicator shows during page transition
- [ ] Results per page option works (if implemented)

#### Search Testing
- [ ] **Keyword search** works in search bar
- [ ] Search is debounced (doesn't fire on every keystroke)
- [ ] Results update based on search query
- [ ] Empty state shows when no results found
- [ ] Search query appears in URL
- [ ] Clear search button works

#### View Modes
- [ ] **Grid view** toggle works
- [ ] **List view** toggle works
- [ ] View preference persists (localStorage)
- [ ] Both views display all job information

#### Featured/Suggested Jobs
- [ ] **Featured jobs** are highlighted (e.g., badge, border, icon)
- [ ] Featured jobs appear at top of listings (if applicable)
- [ ] **Suggested jobs** are marked with indicator
- [ ] Visual distinction is clear

### 1.3 Backend Integration Checks

#### API Integration
- [ ] **Open browser DevTools** → Network tab
- [ ] Navigate to `/jobs`
- [ ] Verify API call made to: `GET /v1/listing` or similar
- [ ] **Check request parameters**:
  - [ ] `page` parameter sent
  - [ ] `per_page` parameter sent
  - [ ] `keyword` parameter sent (when searching)
  - [ ] Filter parameters sent correctly (`job_type`, `salary_min`, `salary_max`, `location_id`)
  - [ ] Sort parameter sent correctly
- [ ] **Check response**:
  - [ ] Response structure matches expected format
  - [ ] Jobs array returned
  - [ ] Pagination metadata included (`total`, `per_page`, `current_page`, `last_page`)
  - [ ] Featured/suggested flags present

#### Data Verification
- [ ] All job fields display correctly:
  - [ ] Title
  - [ ] Company name
  - [ ] Location
  - [ ] Salary range
  - [ ] Job type
  - [ ] Posted date
  - [ ] Apply button/link
- [ ] No data loss: All fields from backend appear in UI
- [ ] Handle missing data gracefully (no crashes if optional fields are null)

### 1.4 Performance Checks

- [ ] **Page load time** < 3 seconds (check Network tab)
- [ ] **API response time** < 500ms
- [ ] **Smooth scrolling** and interactions
- [ ] **No console errors** or warnings
- [ ] **Lazy loading** works (if implemented for images)

### 1.5 Error Handling

- [ ] **Network error**: Displays user-friendly message
- [ ] **Empty results**: Shows "No jobs found" message
- [ ] **API error (500)**: Shows error message, doesn't crash
- [ ] **Invalid filter combination**: Handled gracefully

---

## 2. Dashboard Redesign Verification

### 2.1 User Dashboard (`/dashboard`)

#### Access & Authentication
- [ ] **Requires login**: Redirects to login if not authenticated
- [ ] **Loads without errors**: Check console
- [ ] User data loads correctly

#### Stats Cards
- [ ] **Four stats cards** display:
  - [ ] Active Jobs (with icon)
  - [ ] Job Alerts (with count)
  - [ ] Active Upsells (with count)
  - [ ] Profile Views (if candidate)
- [ ] **Values are accurate**: Match actual data from backend
- [ ] **Trend indicators** display (if implemented)
- [ ] **Icons** render correctly
- [ ] Cards are clickable/link to relevant sections

#### Tab Navigation
- [ ] **Overview tab**:
  - [ ] Featured jobs section displays
  - [ ] Recommended jobs section displays
  - [ ] Quick stats visible
- [ ] **My Jobs tab**:
  - [ ] Lists user's job postings
  - [ ] Shows job status (active, inactive, pending)
  - [ ] Edit button works (navigates to edit form)
  - [ ] Delete button works (with confirmation dialog)
  - [ ] Job details display correctly
- [ ] **Job Alerts tab**:
  - [ ] Lists active job alerts
  - [ ] "Create Alert" button works
  - [ ] Edit alert works
  - [ ] Delete alert works
  - [ ] Toggle active/inactive works
  - [ ] Alert form validation works
- [ ] **Upsells tab**:
  - [ ] Lists active upsells
  - [ ] Shows upsell type, duration, expiry date
  - [ ] "Purchase Upsell" button works
  - [ ] Expired upsells marked correctly

#### Data Integration
- [ ] **API calls**:
  - [ ] `GET /v1/dashboard/user` called on load
  - [ ] Response data populates dashboard correctly
  - [ ] Featured jobs data correct
  - [ ] Recommended jobs data correct
  - [ ] Statistics accurate

#### Responsive Design
- [ ] **Mobile**: Stacked layout, tabs scrollable
- [ ] **Tablet**: Grid adapts appropriately
- [ ] **Desktop**: Full layout visible
- [ ] All features accessible on all screen sizes

### 2.2 Super Admin Dashboard (`/admin/dashboard`)

#### Access & Authorization
- [ ] **Requires admin login**: Regular users can't access
- [ ] **Admin authentication** verified
- [ ] Redirects non-admin users appropriately

#### Overview Tab
- [ ] **Stats cards** display:
  - [ ] Total Jobs
  - [ ] Total Candidates
  - [ ] Total Revenue
  - [ ] Active Upsells
- [ ] **Recent activity** section displays
- [ ] Values are accurate and up-to-date

#### Jobs Tab
- [ ] **Job list** displays all jobs (or paginated)
- [ ] **Search** filters jobs by keyword
- [ ] **Status filter** works (active, inactive, pending, expired)
- [ ] **View job details** works (modal or new page)
- [ ] **Edit job** button works
- [ ] **Delete job** button works (with confirmation)
- [ ] **Featured jobs** highlighted in list

#### Candidates Tab
- [ ] **Candidate list** displays
- [ ] **Search** filters candidates
- [ ] **View profile** works
- [ ] **Visibility filter** works (public, private)
- [ ] **Featured candidates** highlighted

#### Users Tab
- [ ] **User list** displays with pagination
- [ ] **Search users** works
- [ ] **Role filter** works (admin, employer, candidate)
- [ ] **Change user role** works (dropdown or button)
- [ ] **Activate/Deactivate** user works
- [ ] **Delete user** works (with confirmation)

#### Analytics Tab
- [ ] **Revenue statistics** display:
  - [ ] Total revenue
  - [ ] Revenue by period (7d, 30d, 90d, all)
  - [ ] Revenue breakdown by upsell type
- [ ] **Period selector** works (7d, 30d, 90d, all)
- [ ] **Job statistics**:
  - [ ] Total jobs
  - [ ] Active jobs
  - [ ] Pending jobs
  - [ ] Featured jobs count
- [ ] **Candidate statistics**:
  - [ ] Total candidates
  - [ ] Featured candidates
  - [ ] Visibility breakdown
- [ ] **Charts/Graphs** display (if implemented)
- [ ] **Export functionality** works (if implemented)

#### Backend Integration
- [ ] **API calls**:
  - [ ] `GET /v1/dashboard/admin` called
  - [ ] `GET /v1/analytics/revenue` called (Analytics tab)
  - [ ] `GET /v1/analytics/jobs` called
  - [ ] `GET /v1/analytics/candidates` called
- [ ] All data populates correctly
- [ ] Real-time updates work (if implemented)

#### Responsive Design
- [ ] **Mobile**: All tabs accessible, data scrollable
- [ ] **Tablet**: Layout adapts
- [ ] **Desktop**: Full functionality visible

---

## 3. Job Posting Form Verification

### 3.1 Form Structure

#### Step 1: Basic Information
- [ ] **Job Title** field:
  - [ ] Required validation works
  - [ ] Character limit enforced (if applicable)
  - [ ] Error message displays on invalid input
- [ ] **Company Name** field:
  - [ ] Required validation works
  - [ ] Error message displays
- [ ] **Company Logo** upload:
  - [ ] File picker opens
  - [ ] Image preview displays
  - [ ] File size validation works (e.g., max 2MB)
  - [ ] File type validation works (images only)
  - [ ] Upload progress shows (if applicable)

#### Step 2: Details
- [ ] **Description** field:
  - [ ] Required validation works
  - [ ] Rich text editor works (if implemented)
  - [ ] Character count displays (if applicable)
- [ ] **Location**:
  - [ ] Country dropdown populates from backend
  - [ ] Zone/City search works
  - [ ] Selection works
  - [ ] Required validation works
- [ ] **Category**:
  - [ ] Category search/select works
  - [ ] Required validation works
- [ ] **Job Type**:
  - [ ] Dropdown displays options
  - [ ] Selection works
- [ ] **Salary Range**:
  - [ ] Min salary input works
  - [ ] Max salary input works
  - [ ] Validation (max > min) works
  - [ ] Currency selector works
- [ ] **Apply URL**:
  - [ ] URL validation works
  - [ ] Optional field works correctly
- [ ] **End Date**:
  - [ ] Date picker works
  - [ ] Future date validation works
  - [ ] Date format correct

#### Step 3: Upsells
- [ ] **Upsell section** displays:
  - [ ] Featured Job option
  - [ ] Suggested Jobs option
- [ ] **Featured Job upsell**:
  - [ ] Checkbox works
  - [ ] Price displays correctly (e.g., $29.99)
  - [ ] Description/benefits display
- [ ] **Suggested Jobs upsell**:
  - [ ] Checkbox works
  - [ ] Price displays correctly (e.g., $49.99)
  - [ ] Description/benefits display
- [ ] **Total price** calculates correctly
- [ ] Multiple upsells can be selected

### 3.2 Form Navigation

- [ ] **Progress indicator** shows current step (1/3, 2/3, 3/3)
- [ ] **Next button**:
  - [ ] Progresses to next step
  - [ ] Disabled if validation fails
  - [ ] Shows validation errors inline
- [ ] **Back button**:
  - [ ] Returns to previous step
  - [ ] Preserves entered data
- [ ] **Step data persists** when navigating back/forth

### 3.3 Form Submission

#### Without Upsells
- [ ] **Form submits** successfully
- [ ] **API call** made: `POST /v1/listing`
- [ ] **Request payload** includes all fields:
  - [ ] title, description, company_name
  - [ ] category_id, location_id
  - [ ] job_type, salary_min, salary_max
  - [ ] apply_url, end_date
- [ ] **Job created** in database (verify in admin dashboard)
- [ ] **Success message** displays
- [ ] **Redirect** to dashboard works

#### With Upsells
- [ ] **Job created first** (`POST /v1/listing`)
- [ ] **Upsells created** (`POST /v1/job-upsell`):
  - [ ] One call per selected upsell
  - [ ] Payload includes: `listing_id`, `upsell_type`, `duration_days`
- [ ] **Payment flow**:
  - [ ] Payment modal/component appears
  - [ ] Payment amount is correct
  - [ ] Payment provider integration works
  - [ ] Payment success updates upsell status
  - [ ] Job marked as featured/suggested after payment

### 3.4 Error Handling

- [ ] **Validation errors**:
  - [ ] Display inline next to fields
  - [ ] Clear and helpful messages
  - [ ] Prevent submission if invalid
- [ ] **API errors**:
  - [ ] Network errors handled gracefully
  - [ ] 400 errors show validation messages
  - [ ] 401 errors redirect to login
  - [ ] 500 errors show generic error message
- [ ] **Payment errors**:
  - [ ] Payment failure shows error message
  - [ ] User can retry payment
  - [ ] Job still created (upsell pending)

### 3.5 Edit Job Form

- [ ] **Edit form** loads existing job data
- [ ] All fields pre-populated correctly
- [ ] Form submission updates job (`PUT /v1/listing/:id`)
- [ ] Changes saved successfully
- [ ] Can add upsells to existing job

---

## 4. Candidate Profile Features & Upsells Verification

### 4.1 Profile Form

#### Form Fields
- [ ] **Professional Headline**:
  - [ ] Required validation works
  - [ ] Character limit enforced (if applicable)
- [ ] **Professional Summary**:
  - [ ] Required validation works
  - [ ] Text area expands correctly
- [ ] **Skills**:
  - [ ] Add skill button works
  - [ ] Remove skill button works (x icon)
  - [ ] Skills display as tags/chips
  - [ ] Duplicate skills prevented
  - [ ] Skills list stored correctly
- [ ] **CV URL**:
  - [ ] URL validation works
  - [ ] Optional field works
- [ ] **Location**:
  - [ ] Country dropdown populates
  - [ ] Zone/City search works
  - [ ] Selection works
- [ ] **Visibility**:
  - [ ] Public/Private toggle works
  - [ ] Selection persists

### 4.2 Upsells

- [ ] **Featured Profile upsell**:
  - [ ] Checkbox works
  - [ ] Price displays correctly
  - [ ] Description displays
- [ ] **Job Alerts Boost upsell**:
  - [ ] Checkbox works
  - [ ] Price displays correctly
  - [ ] Description displays
- [ ] **Total price** calculates correctly

### 4.3 Form Submission

#### Without Upsells
- [ ] **Form submits** successfully
- [ ] **API call**: `POST /v1/candidate-profile`
- [ ] **Profile created** in database
- [ ] **Success message** displays
- [ ] **Redirect** to dashboard works

#### With Upsells
- [ ] **Profile created first**
- [ ] **Upsells created**: `POST /v1/candidate-upsell`
- [ ] **Payment flow** works
- [ ] **Profile marked** as featured after payment

### 4.4 Profile Display

- [ ] **Public profiles** visible to employers/recruiters
- [ ] **Private profiles** only visible to owner
- [ ] **Featured profiles** highlighted in search results
- [ ] **Profile page** displays all information:
  - [ ] Headline
  - [ ] Summary
  - [ ] Skills
  - [ ] Location
  - [ ] CV download link

### 4.5 Edit Profile

- [ ] **Edit form** loads existing profile data
- [ ] All fields pre-populated
- [ ] Updates work (`PUT /v1/candidate-profile/:id`)
- [ ] Changes saved successfully

---

## 5. Backend APIs Verification

### 5.1 API Endpoint Testing

#### Job APIs

##### GET `/v1/listing`
- [ ] **Pagination works**:
  - [ ] `page` parameter works
  - [ ] `per_page` parameter works
  - [ ] Response includes pagination metadata
- [ ] **Search works**: `keyword` parameter filters results
- [ ] **Filters work**:
  - [ ] `job_type` parameter filters
  - [ ] `salary_min` and `salary_max` filter
  - [ ] `location_id` filters
  - [ ] `category_id` filters
  - [ ] Multiple filters combined work
- [ ] **Sorting works**:
  - [ ] `sort` parameter works (newest, oldest, salary_low, salary_high)
  - [ ] `order` parameter works (asc, desc)
- [ ] **Featured jobs** appear first (if applicable)
- [ ] **Response format**:
  ```json
  {
    "data": [...],
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "last_page": 5
  }
  ```

##### GET `/v1/listing/:id`
- [ ] Returns correct job data
- [ ] Includes upsell information (`is_featured`, `is_suggested`)
- [ ] Handles invalid ID (404 error)
- [ ] Includes all required fields

##### POST `/v1/listing`
- [ ] Creates job successfully
- [ ] Validates required fields (returns 400 if missing)
- [ ] Returns job ID
- [ ] Handles errors correctly

##### PUT `/v1/listing/:id`
- [ ] Updates job successfully
- [ ] Validates user ownership (403 if not owner)
- [ ] Handles errors correctly

##### DELETE `/v1/listing/:id`
- [ ] Deletes job successfully
- [ ] Validates user ownership
- [ ] Handles errors correctly

##### GET `/v1/listing/my-listing`
- [ ] Returns only authenticated user's jobs
- [ ] Pagination works
- [ ] Filtering works (if applicable)

#### Candidate Profile APIs

##### POST `/v1/candidate-profile`
- [ ] Creates profile successfully
- [ ] Validates required fields
- [ ] Returns profile ID
- [ ] Associates with authenticated user

##### PUT `/v1/candidate-profile/:id`
- [ ] Updates profile successfully
- [ ] Validates user ownership
- [ ] Handles errors correctly

##### GET `/v1/candidate-profile/:id`
- [ ] Returns profile data
- [ ] Respects visibility settings (403 if private and not owner)
- [ ] Includes all fields

##### GET `/v1/candidate-profile`
- [ ] Returns public profiles only (for non-owners)
- [ ] Returns all profiles (for owner/admin)
- [ ] Pagination works
- [ ] Filtering works (visibility, featured, etc.)

#### Upsell APIs

##### POST `/v1/job-upsell`
- [ ] Creates upsell successfully
- [ ] Validates job ownership
- [ ] Returns payment URL if payment required
- [ ] Returns upsell ID
- [ ] Payload: `{ listing_id, upsell_type, duration_days }`

##### GET `/v1/job-upsell`
- [ ] Returns user's upsells only
- [ ] Filtering by status works
- [ ] Filtering by type works
- [ ] Pagination works

##### POST `/v1/job-upsell/:id/complete-payment`
- [ ] Updates upsell status to "active"
- [ ] Sets expiry date
- [ ] Updates job flags (`is_featured`, `is_suggested`)
- [ ] Payload: `{ payment_id, payment_method }`

##### POST `/v1/candidate-upsell`
- [ ] Creates candidate upsell successfully
- [ ] Validates profile ownership
- [ ] Returns payment URL if payment required
- [ ] Payload: `{ candidate_profile_id, upsell_type, duration_days }`

##### GET `/v1/candidate-upsell`
- [ ] Returns user's candidate upsells
- [ ] Filtering works

##### POST `/v1/candidate-upsell/:id/complete-payment`
- [ ] Updates upsell status to "active"
- [ ] Updates profile flags (`is_featured`, `has_job_alerts_boost`)

#### Analytics APIs

##### GET `/v1/analytics/revenue`
- [ ] Returns revenue data
- [ ] Date range filtering works (`start_date`, `end_date`)
- [ ] Grouping works (by day, week, month, upsell_type)
- [ ] Response format:
  ```json
  {
    "total_revenue": 1000.00,
    "by_period": [...],
    "by_type": {...}
  }
  ```

##### GET `/v1/analytics/jobs`
- [ ] Returns job statistics
- [ ] Date range filtering works
- [ ] Includes: total, active, pending, expired, featured

##### GET `/v1/analytics/candidates`
- [ ] Returns candidate statistics
- [ ] Date range filtering works
- [ ] Includes: total, featured, visibility breakdown

##### GET `/v1/analytics/upsells`
- [ ] Returns upsell performance data
- [ ] Date range filtering works
- [ ] Includes: active, expired, revenue by type

##### GET `/v1/analytics/overview`
- [ ] Returns overview statistics
- [ ] Includes all key metrics

#### Dashboard APIs

##### GET `/v1/dashboard/user`
- [ ] Returns user dashboard data
- [ ] Includes featured jobs
- [ ] Includes recommended jobs
- [ ] Includes job alerts
- [ ] Includes statistics

##### GET `/v1/dashboard/admin`
- [ ] Returns admin dashboard data
- [ ] Requires admin authentication (403 if not admin)
- [ ] Includes all statistics
- [ ] Includes recent activity

### 5.2 API Testing Tools

#### Using Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions in the app
4. Inspect API calls:
   - [ ] Request URL correct
   - [ ] Request method correct (GET, POST, PUT, DELETE)
   - [ ] Request headers include authentication token
   - [ ] Request payload correct (for POST/PUT)
   - [ ] Response status code (200, 201, 400, 401, 403, 404, 500)
   - [ ] Response data structure correct

#### Using Postman/Thunder Client
1. Import API collection (if available)
2. Test each endpoint:
   - [ ] Set authentication token in headers
   - [ ] Test with valid data
   - [ ] Test with invalid data (validation errors)
   - [ ] Test without authentication (401 error)
   - [ ] Test with wrong user (403 error)

#### API Response Verification
- [ ] **Status codes**:
  - [ ] 200 OK for successful GET/PUT
  - [ ] 201 Created for successful POST
  - [ ] 400 Bad Request for validation errors
  - [ ] 401 Unauthorized for missing/invalid auth
  - [ ] 403 Forbidden for authorization errors
  - [ ] 404 Not Found for missing resources
  - [ ] 500 Internal Server Error handled gracefully
- [ ] **Response format** consistent across endpoints
- [ ] **Error messages** are user-friendly and descriptive

---

## 6. Database Schema Updates Verification

### 6.1 Schema Verification Checklist

#### Jobs/Listings Table
- [ ] **Required fields exist**:
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key to users)
  - [ ] `title`
  - [ ] `description`
  - [ ] `category_id`
  - [ ] `location_id`
  - [ ] `job_type`
  - [ ] `salary_min`
  - [ ] `salary_max`
  - [ ] `currency_id` (if applicable)
  - [ ] `apply_url`
  - [ ] `end_date`
  - [ ] `company_name`
  - [ ] `company_logo`
  - [ ] `status`
  - [ ] `is_featured`
  - [ ] `is_suggested`
  - [ ] `created_at`
  - [ ] `updated_at`
  - [ ] `deleted_at` (soft delete)

#### Candidate Profiles Table
- [ ] **Required fields exist**:
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, unique)
  - [ ] `headline`
  - [ ] `summary`
  - [ ] `skills` (array or JSON)
  - [ ] `cv_url`
  - [ ] `location_id`
  - [ ] `country_id`
  - [ ] `visibility` (public/private)
  - [ ] `is_featured`
  - [ ] `has_job_alerts_boost`
  - [ ] `created_at`
  - [ ] `updated_at`

#### Job Upsells Table
- [ ] **Required fields exist**:
  - [ ] `id` (primary key)
  - [ ] `listing_id` (foreign key to jobs)
  - [ ] `user_id` (foreign key)
  - [ ] `upsell_type` (featured, suggested)
  - [ ] `price`
  - [ ] `status` (pending, active, expired, cancelled)
  - [ ] `duration_days`
  - [ ] `expires_at`
  - [ ] `payment_id`
  - [ ] `payment_method`
  - [ ] `created_at`
  - [ ] `updated_at`

#### Candidate Upsells Table
- [ ] **Required fields exist**:
  - [ ] `id` (primary key)
  - [ ] `candidate_profile_id` (foreign key)
  - [ ] `user_id` (foreign key)
  - [ ] `upsell_type` (featured_profile, job_alerts_boost)
  - [ ] `price`
  - [ ] `status` (pending, active, expired, cancelled)
  - [ ] `duration_days`
  - [ ] `expires_at`
  - [ ] `payment_id`
  - [ ] `payment_method`
  - [ ] `created_at`
  - [ ] `updated_at`

#### Revenue Tracking Table
- [ ] **Required fields exist**:
  - [ ] `id` (primary key)
  - [ ] `upsell_id` (reference to job_upsells or candidate_upsells)
  - [ ] `upsell_type` (job/candidate)
  - [ ] `user_id`
  - [ ] `amount`
  - [ ] `payment_method`
  - [ ] `payment_transaction_id`
  - [ ] `status` (pending, completed, failed, refunded)
  - [ ] `created_at`
  - [ ] `updated_at`

### 6.2 Database Testing Steps

#### Connect to Database
1. **Use database client** (pgAdmin, DBeaver, or psql command line)
2. **Connect** to your PostgreSQL database
3. **Verify connection** successful

#### Check Tables Exist
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify each table exists
SELECT * FROM jobs LIMIT 1;
SELECT * FROM candidate_profiles LIMIT 1;
SELECT * FROM job_upsells LIMIT 1;
SELECT * FROM candidate_upsells LIMIT 1;
SELECT * FROM revenue_tracking LIMIT 1;
```

- [ ] All tables exist
- [ ] No error messages

#### Check Table Structure
For each table, verify columns:
```sql
-- Check columns for jobs table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'jobs'
ORDER BY ordinal_position;

-- Repeat for other tables
```

- [ ] All required columns exist
- [ ] Data types are correct
- [ ] Nullable constraints are correct

#### Check Indexes
```sql
-- Check indexes for jobs table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'jobs';
```

- [ ] Indexes exist for:
  - [ ] `user_id`
  - [ ] `category_id`
  - [ ] `location_id`
  - [ ] `status`
  - [ ] `is_featured`
  - [ ] `is_suggested`
  - [ ] `created_at`

#### Check Foreign Keys
```sql
-- Check foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('jobs', 'candidate_profiles', 'job_upsells', 'candidate_upsells');
```

- [ ] Foreign keys are properly defined
- [ ] Cascade deletes work (if configured)

#### Test Data Insertion
```sql
-- Test inserting a job (use actual IDs from your database)
INSERT INTO jobs (user_id, title, description, category_id, location_id, status)
VALUES (1, 'Test Job', 'Test Description', 1, 1, 'active')
RETURNING id;

-- Test inserting a candidate profile
INSERT INTO candidate_profiles (user_id, headline, summary, visibility)
VALUES (1, 'Test Headline', 'Test Summary', 'public')
RETURNING id;

-- Test inserting a job upsell
INSERT INTO job_upsells (listing_id, user_id, upsell_type, price, status)
VALUES (1, 1, 'featured', 29.99, 'active')
RETURNING id;
```

- [ ] Data inserts successfully
- [ ] Required fields enforced (try without required field - should fail)
- [ ] Foreign key constraints work (try with invalid foreign key - should fail)

#### Test Data Queries
```sql
-- Test querying jobs with upsells
SELECT j.*, ju.upsell_type, ju.status as upsell_status
FROM jobs j
LEFT JOIN job_upsells ju ON j.id = ju.listing_id
WHERE ju.status = 'active';

-- Test querying candidate profiles
SELECT * FROM candidate_profiles WHERE visibility = 'public';

-- Test revenue calculation
SELECT 
    upsell_type,
    SUM(amount) as total_revenue
FROM revenue_tracking
WHERE status = 'completed'
GROUP BY upsell_type;
```

- [ ] Queries return expected results
- [ ] Joins work correctly
- [ ] Aggregations work correctly

### 6.3 Database Migration Verification

If using migrations:
- [ ] **Migration files** exist
- [ ] **Migrations run** successfully (no errors)
- [ ] **Migration rollback** works (test if needed)
- [ ] **Production database** has latest schema

---

## 7. Monetization & Analytics Verification

### 7.1 Payment Integration

#### Payment Flow Testing

##### Job Posting with Upsell
1. **Create job posting** with upsell selected
2. **Payment modal/component** appears:
   - [ ] Amount displays correctly
   - [ ] Description shows selected upsells
   - [ ] Payment provider integration visible (PayPal, Stripe, etc.)
3. **Complete payment** (use sandbox/test mode):
   - [ ] Payment processing works
   - [ ] Success callback triggers
   - [ ] Upsell status updates to "active"
   - [ ] Job marked as featured/suggested
   - [ ] Payment transaction recorded in database
4. **Payment failure**:
   - [ ] Error message displays
   - [ ] User can retry
   - [ ] Upsell remains "pending"

##### Candidate Profile with Upsell
- [ ] Same flow as job posting
- [ ] Payment completion updates profile flags

#### Payment Provider Integration

##### PayPal Integration
- [ ] **Client ID** configured (environment variable)
- [ ] **Sandbox mode** works (for testing)
- [ ] **Payment button** renders
- [ ] **Payment approval** works
- [ ] **Webhook** receives payment notifications (backend)
- [ ] **Payment status** updates automatically

##### Stripe Integration (if implemented)
- [ ] **API keys** configured
- [ ] **Payment form** works
- [ ] **Payment processing** works
- [ ] **Webhook** configured and working

#### Payment Data Verification

##### Database Checks
```sql
-- Check payment transactions
SELECT * FROM revenue_tracking 
WHERE status = 'completed'
ORDER BY created_at DESC
LIMIT 10;

-- Check upsell status
SELECT * FROM job_upsells 
WHERE status = 'active'
ORDER BY created_at DESC;
```

- [ ] Payment transactions recorded
- [ ] Amount matches expected value
- [ ] Payment method recorded
- [ ] Transaction ID stored
- [ ] Upsell status updated to "active"
- [ ] Job/profile flags updated

### 7.2 Analytics Verification

#### Revenue Analytics

##### In Super Admin Dashboard
- [ ] **Revenue statistics** display:
  - [ ] Total revenue
  - [ ] Revenue by period (7d, 30d, 90d, all)
  - [ ] Revenue breakdown by upsell type
- [ ] **Period selector** works:
  - [ ] 7 days shows last 7 days
  - [ ] 30 days shows last 30 days
  - [ ] 90 days shows last 90 days
  - [ ] All shows all-time revenue
- [ ] **Data accuracy**:
  - [ ] Matches database totals
  - [ ] Calculations correct
  - [ ] Currency formatting correct

##### API Verification
- [ ] `GET /v1/analytics/revenue` returns correct data:
  ```json
  {
    "total_revenue": 1000.00,
    "period": "30d",
    "by_date": [...],
    "by_type": {
      "featured_job": 500.00,
      "suggested_job": 300.00,
      "featured_profile": 200.00
    }
  }
  ```
- [ ] Date range filtering works
- [ ] Grouping works correctly

#### Job Analytics
- [ ] **Statistics display**:
  - [ ] Total jobs
  - [ ] Active jobs
  - [ ] Pending jobs
  - [ ] Expired jobs
  - [ ] Featured jobs count
- [ ] **Data accuracy**: Matches actual counts
- [ ] **API**: `GET /v1/analytics/jobs` returns correct data

#### Candidate Analytics
- [ ] **Statistics display**:
  - [ ] Total candidates
  - [ ] Featured candidates
  - [ ] Public vs Private breakdown
- [ ] **Data accuracy**: Matches actual counts
- [ ] **API**: `GET /v1/analytics/candidates` returns correct data

#### Upsell Analytics
- [ ] **Performance metrics**:
  - [ ] Active upsells count
  - [ ] Expired upsells count
  - [ ] Revenue by upsell type
  - [ ] Conversion rate (if calculated)
- [ ] **API**: `GET /v1/analytics/upsells` returns correct data

#### Visualization (if implemented)
- [ ] **Charts/Graphs** display:
  - [ ] Revenue trend line/bar chart
  - [ ] Pie chart for revenue breakdown
  - [ ] Job status breakdown chart
- [ ] **Charts update** when period changes
- [ ] **Charts are responsive** (mobile, tablet, desktop)

### 7.3 Upsell Expiration

#### Automatic Expiration (Backend)
- [ ] **Cron job/scheduled task** runs:
  - [ ] Checks for expired upsells
  - [ ] Updates status from "active" to "expired"
  - [ ] Updates job flags (`is_featured` = false)
  - [ ] Updates profile flags
- [ ] **Testing**:
  - [ ] Create an upsell with short duration (1 day)
  - [ ] Wait for expiration (or manually trigger cron)
  - [ ] Verify status updated
  - [ ] Verify flags updated

#### Frontend Display
- [ ] **Expired upsells** marked correctly in dashboard
- [ ] **Expiry date** displays for active upsells
- [ ] **Warning** shown when upsell about to expire

---

## 8. Testing & Deployment Readiness Verification

### 8.1 Comprehensive Testing

#### Functional Testing
- [ ] **All features work** as expected:
  - [ ] Category pages functional
  - [ ] Dashboards functional
  - [ ] Forms functional
  - [ ] Upsells functional
  - [ ] Payments functional
  - [ ] Analytics functional

#### Integration Testing
- [ ] **Frontend-Backend integration**:
  - [ ] All API calls work
  - [ ] Data flows correctly
  - [ ] Error handling works
- [ ] **Payment integration**:
  - [ ] End-to-end payment flow works
  - [ ] Webhooks processed correctly
- [ ] **Database integration**:
  - [ ] All CRUD operations work
  - [ ] Data integrity maintained

#### Cross-Browser Testing
- [ ] **Chrome** (latest): All features work
- [ ] **Firefox** (latest): All features work
- [ ] **Safari** (latest): All features work
- [ ] **Edge** (latest): All features work
- [ ] **Mobile Safari** (iOS): All features work
- [ ] **Chrome Mobile** (Android): All features work

#### Responsive Design Testing
- [ ] **Desktop** (> 1024px): Full functionality
- [ ] **Tablet** (640px - 1024px): Adapted layout works
- [ ] **Mobile** (< 640px): All features accessible
- [ ] **Orientation changes** handled (portrait/landscape)

#### Performance Testing
- [ ] **Page load times**:
  - [ ] Initial load < 3 seconds
  - [ ] Subsequent loads < 1 second
  - [ ] API calls < 500ms
- [ ] **Lighthouse scores** (if available):
  - [ ] Performance > 80
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 80

#### Security Testing
- [ ] **Authentication**:
  - [ ] Protected routes require login
  - [ ] Tokens expire correctly
  - [ ] Invalid tokens rejected
- [ ] **Authorization**:
  - [ ] Users can only edit own jobs/profiles
  - [ ] Admin routes require admin role
- [ ] **Input validation**:
  - [ ] XSS prevention (test with `<script>` tags)
  - [ ] SQL injection prevention (backend)
  - [ ] CSRF protection (if applicable)
- [ ] **Data privacy**:
  - [ ] Private profiles not visible to others
  - [ ] User data protected

#### Error Handling Testing
- [ ] **Network errors**: User-friendly messages
- [ ] **API errors**: Appropriate status codes and messages
- [ ] **Form validation**: Clear error messages
- [ ] **Edge cases**:
  - [ ] Empty data handled
  - [ ] Large data sets handled
  - [ ] Special characters handled

### 8.2 Pre-Deployment Checklist

#### Code Quality
- [ ] **No console errors** in production build
- [ ] **No console warnings** (review and fix if possible)
- [ ] **Code review** completed
- [ ] **Linting** passes (ESLint, etc.)
- [ ] **Type checking** passes (if using TypeScript)

#### Configuration
- [ ] **Environment variables** configured:
  - [ ] API base URL
  - [ ] Payment provider keys (PayPal, Stripe)
  - [ ] Database connection strings
  - [ ] Other required variables
- [ ] **API endpoints** point to production
- [ ] **Payment providers** configured for production (not sandbox)

#### Database
- [ ] **Migrations** run on production database
- [ ] **Schema** matches expected structure
- [ ] **Seed data** (if applicable) loaded
- [ ] **Backup strategy** in place
- [ ] **Rollback plan** prepared

#### Infrastructure
- [ ] **Server** configured and ready
- [ ] **SSL certificate** installed (HTTPS)
- [ ] **Domain** configured
- [ ] **CDN** configured (if applicable)
- [ ] **Monitoring** set up (error tracking, performance)
- [ ] **Logging** configured

#### Documentation
- [ ] **API documentation** updated
- [ ] **User guide** updated (if applicable)
- [ ] **Team training** completed
- [ ] **Deployment runbook** prepared

### 8.3 Deployment Steps

#### Staging Deployment (Recommended First)
1. **Deploy to staging** environment
2. **Run all tests** again on staging
3. **UAT (User Acceptance Testing)**:
   - [ ] Stakeholders test all features
   - [ ] Feedback collected
   - [ ] Issues fixed
4. **Performance testing** on staging
5. **Security scan** (if applicable)

#### Production Deployment
1. **Backup production database**
2. **Deploy code** to production
3. **Run database migrations**
4. **Verify deployment**:
   - [ ] Homepage loads
   - [ ] Key pages load
   - [ ] API endpoints respond
5. **Smoke test**:
   - [ ] Create a test job posting
   - [ ] Create a test candidate profile
   - [ ] Test payment flow (use test mode)
   - [ ] Verify data appears in admin dashboard
6. **Monitor**:
   - [ ] Error logs
   - [ ] Performance metrics
   - [ ] User feedback

#### Post-Deployment
- [ ] **Monitor error logs** for 24-48 hours
- [ ] **Monitor performance** metrics
- [ ] **Monitor payment transactions**
- [ ] **Collect user feedback**
- [ ] **Fix any critical issues** immediately
- [ ] **Document any issues** and resolutions

---

## Verification Tools & Commands

### Browser DevTools
```
F12 → Network Tab → Inspect API calls
F12 → Console Tab → Check for errors
F12 → Application Tab → Check localStorage, cookies
```

### Database Connection (PostgreSQL)
```bash
# Using psql
psql -h localhost -U your_username -d your_database

# Common queries
SELECT * FROM jobs LIMIT 10;
SELECT * FROM candidate_profiles LIMIT 10;
SELECT * FROM job_upsells WHERE status = 'active';
```

### API Testing with curl
```bash
# Test GET endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.example.com/v1/listing?page=1&per_page=20

# Test POST endpoint
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","description":"Test"}' \
  https://api.example.com/v1/listing
```

### Build & Run
```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Test production build locally
npm run serve
```

---

## Issue Tracking Template

For each issue found, document:

```
**Issue #**: [Number]
**Feature Area**: [e.g., Category Pages, Job Posting Form]
**Severity**: [Critical, High, Medium, Low]
**Description**: [What's wrong]
**Steps to Reproduce**: 
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happens]
**Screenshots/Logs**: [If applicable]
**Status**: [Open, In Progress, Fixed, Verified]
```

---

## Summary

After completing all verification steps:

1. **Document any issues** found
2. **Prioritize fixes** (Critical → High → Medium → Low)
3. **Fix issues** and re-test
4. **Update this checklist** as features evolve
5. **Get stakeholder sign-off** before deployment

---

**Last Updated**: [Date]
**Version**: 1.0
**Next Review**: [Date]
