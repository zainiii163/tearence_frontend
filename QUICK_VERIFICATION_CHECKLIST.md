# Quick Verification Checklist

A condensed checklist for quick verification of all 8 feature areas. Use this for daily checks and regression testing.

---

## 🚀 Quick Start

1. **Start your development server**: `npm start`
2. **Open browser DevTools** (F12) → Network & Console tabs
3. **Follow this checklist** in order

---

## ✅ Feature Verification Status

### 1. Category Pages Redesign
- [ ] Jobs page (`/jobs`) loads without errors
- [ ] Filters work (Job Type, Salary, Location)
- [ ] Sorting works (Newest, Salary High/Low)
- [ ] Pagination works (page numbers, prev/next)
- [ ] Search works (keyword search)
- [ ] Featured jobs highlighted
- [ ] Responsive (mobile/tablet/desktop)
- [ ] API call made: `GET /v1/listing` with correct parameters

### 2. Dashboard Redesign

#### User Dashboard (`/dashboard`)
- [ ] Requires login (redirects if not logged in)
- [ ] Stats cards display (Jobs, Alerts, Upsells, Profile Views)
- [ ] Tabs work (Overview, My Jobs, Job Alerts, Upsells)
- [ ] Featured jobs section displays
- [ ] Can create/edit/delete job alerts
- [ ] Can view/edit/delete own jobs
- [ ] Active upsells display
- [ ] Responsive design

#### Super Admin Dashboard (`/admin/dashboard`)
- [ ] Requires admin login
- [ ] All tabs work (Overview, Jobs, Candidates, Users, Analytics)
- [ ] Can search/filter jobs
- [ ] Can manage users (change role, activate/deactivate)
- [ ] Analytics display (revenue, job stats, candidate stats)
- [ ] Responsive design

### 3. Job Posting Form
- [ ] Form loads (`/post-job` or similar)
- [ ] All 3 steps work (Basic Info → Details → Upsells)
- [ ] Required fields validated
- [ ] Can upload company logo
- [ ] Location dropdown/search works
- [ ] Can select upsells (Featured, Suggested)
- [ ] Form submits successfully
- [ ] Job created in database (verify in admin dashboard)
- [ ] Payment flow works (if upsells selected)
- [ ] Job appears in listings after creation

### 4. Candidate Profile Features
- [ ] Profile form loads (`/candidate/profile` or similar)
- [ ] All fields work (Headline, Summary, Skills, CV URL, Location, Visibility)
- [ ] Can add/remove skills
- [ ] Can select upsells (Featured Profile, Job Alerts Boost)
- [ ] Form submits successfully
- [ ] Profile created (verify in admin dashboard)
- [ ] Public profiles visible to others
- [ ] Private profiles only visible to owner
- [ ] Featured profiles highlighted

### 5. Backend APIs

#### Quick API Tests (use Browser DevTools → Network tab)
- [ ] `GET /v1/listing` - Returns jobs with pagination
- [ ] `GET /v1/listing/:id` - Returns single job
- [ ] `POST /v1/listing` - Creates job
- [ ] `PUT /v1/listing/:id` - Updates job
- [ ] `DELETE /v1/listing/:id` - Deletes job
- [ ] `POST /v1/candidate-profile` - Creates profile
- [ ] `GET /v1/candidate-profile` - Lists profiles
- [ ] `POST /v1/job-upsell` - Creates job upsell
- [ ] `POST /v1/candidate-upsell` - Creates candidate upsell
- [ ] `GET /v1/dashboard/user` - Returns user dashboard data
- [ ] `GET /v1/dashboard/admin` - Returns admin dashboard data
- [ ] `GET /v1/analytics/revenue` - Returns revenue data

**Check for each API**:
- [ ] Returns correct status code (200, 201, etc.)
- [ ] Response structure matches expected format
- [ ] Error handling works (400, 401, 403, 404, 500)

### 6. Database Schema

#### Quick Database Checks (use database client)
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('jobs', 'candidate_profiles', 'job_upsells', 'candidate_upsells', 'revenue_tracking');

-- Check recent data
SELECT COUNT(*) FROM jobs;
SELECT COUNT(*) FROM candidate_profiles;
SELECT COUNT(*) FROM job_upsells WHERE status = 'active';
SELECT COUNT(*) FROM revenue_tracking WHERE status = 'completed';
```

- [ ] All required tables exist
- [ ] Can insert test data
- [ ] Can query data
- [ ] Foreign keys work
- [ ] Upsell flags update correctly (`is_featured`, `is_suggested`)

### 7. Monetization & Analytics

#### Payment Integration
- [ ] Payment modal appears when upsell selected
- [ ] Payment amount displays correctly
- [ ] Payment provider (PayPal) integration works (test mode)
- [ ] Payment success updates upsell status
- [ ] Payment transaction recorded in database
- [ ] Job/profile flags update after payment

#### Analytics
- [ ] Revenue statistics display in admin dashboard
- [ ] Period selector works (7d, 30d, 90d, all)
- [ ] Revenue breakdown by type displays
- [ ] Job statistics accurate
- [ ] Candidate statistics accurate

### 8. Testing & Deployment

#### Functional Testing
- [ ] All pages load without errors
- [ ] No console errors (check DevTools Console)
- [ ] Forms submit successfully
- [ ] Data persists (refreshing page keeps data)
- [ ] Navigation works (links, buttons, menus)

#### Responsive Testing
- [ ] Desktop view works (> 1024px)
- [ ] Tablet view works (640px - 1024px)
- [ ] Mobile view works (< 640px)

#### Cross-Browser Testing (Priority Browsers)
- [ ] Chrome (latest) ✅
- [ ] Firefox (latest) ✅
- [ ] Safari (latest) ✅
- [ ] Mobile Chrome (Android) ✅
- [ ] Mobile Safari (iOS) ✅

#### Pre-Deployment
- [ ] Environment variables configured
- [ ] API endpoints point to correct environment
- [ ] Payment providers configured (sandbox for testing)
- [ ] Database migrations run
- [ ] No console errors in production build
- [ ] Build completes successfully (`npm run build`)

---

## 🔍 Common Issues to Check

### API Issues
- [ ] **CORS errors**: Check API server CORS configuration
- [ ] **401 Unauthorized**: Check authentication token
- [ ] **404 Not Found**: Verify endpoint URL and method
- [ ] **500 Server Error**: Check backend logs

### Data Issues
- [ ] **Missing data**: Check API response structure
- [ ] **Incorrect filters**: Verify filter parameters sent correctly
- [ ] **Pagination not working**: Check page/per_page parameters

### UI Issues
- [ ] **Layout breaks**: Check responsive CSS classes
- [ ] **Buttons not working**: Check event handlers
- [ ] **Forms not submitting**: Check validation and API calls
- [ ] **Loading states**: Verify loading indicators display

### Payment Issues
- [ ] **Payment modal not appearing**: Check upsell selection logic
- [ ] **Payment amount incorrect**: Verify calculation
- [ ] **Payment not completing**: Check payment provider configuration
- [ ] **Upsell not activating**: Check payment completion callback

---

## 📝 Quick Test Scenarios

### Scenario 1: Post a Job with Upsell
1. Login as employer
2. Navigate to job posting form
3. Fill in all required fields
4. Select "Featured Job" upsell
5. Submit form
6. Complete payment (test mode)
7. Verify job appears in listings as featured
8. Verify upsell status is "active" in dashboard

### Scenario 2: Create Candidate Profile
1. Login as candidate
2. Navigate to profile creation
3. Fill in all required fields
4. Add skills
5. Set visibility to "public"
6. Submit form
7. Verify profile appears in candidate search
8. Verify profile visible to other users (if public)

### Scenario 3: Filter Jobs
1. Navigate to `/jobs`
2. Select "Full Time" job type filter
3. Set salary range: $50k - $100k
4. Select location
5. Verify results filter correctly
6. Verify active filters show as badges
7. Clear all filters
8. Verify all jobs show again

### Scenario 4: Admin Analytics
1. Login as super admin
2. Navigate to admin dashboard
3. Go to Analytics tab
4. Select "30 days" period
5. Verify revenue statistics display
6. Verify job statistics display
7. Verify candidate statistics display

---

## 🛠️ Quick Commands

### Start Development
```bash
npm install    # Install dependencies
npm start      # Start dev server
```

### Build for Production
```bash
npm run build  # Build production bundle
```

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Fix any errors found

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions in app
4. Check API calls:
   - Status codes (should be 200, 201, etc.)
   - Request payloads
   - Response data

### Database Quick Check
```bash
# Connect to database
psql -h localhost -U username -d database_name

# Quick queries
SELECT COUNT(*) FROM jobs;
SELECT COUNT(*) FROM job_upsells WHERE status = 'active';
```

---

## 📊 Verification Status Tracker

### Daily Checks
- Date: _______________
- Verified by: _______________
- [ ] All critical features working
- [ ] No console errors
- [ ] No API errors
- [ ] Payment flow works

### Weekly Deep Check
- Week of: _______________
- [ ] Full verification guide completed
- [ ] All 8 feature areas verified
- [ ] Issues documented
- [ ] Fixes implemented

---

## 🚨 Critical Issues Found

Document any critical issues here:

1. **Issue**: _________________________________________
   **Severity**: Critical / High / Medium / Low
   **Status**: Open / Fixed / Verified

2. **Issue**: _________________________________________
   **Severity**: Critical / High / Medium / Low
   **Status**: Open / Fixed / Verified

---

**Use this checklist daily** for quick verification. For comprehensive testing, refer to `VERIFICATION_GUIDE.md`.
