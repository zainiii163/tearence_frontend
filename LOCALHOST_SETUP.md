# Localhost Development Setup Guide

## Why You're Seeing 404 Errors

You're seeing 404 errors because:
1. **Your frontend is pointing to production API** (`https://api.worldwideadverts.info`)
2. **Those routes don't exist yet on production** (need to be deployed)
3. **You want to test with your local backend** instead

## Solution: Configure Frontend to Use Localhost API

### Step 1: Create `.env` file in project root

Create a file named `.env` in the root directory (same level as `package.json`):

```env
# Point to your local Laravel backend
REACT_APP_API_BASE_URL=http://localhost:8000/api

# Or if your backend runs on a different port, use:
# REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```

### Step 2: Make sure your local backend is running

Start your Laravel backend server:
```bash
cd /path/to/your/laravel/backend
php artisan serve
# Should be running on http://localhost:8000
```

### Step 3: Verify routes exist on local backend

Make sure these routes exist in your local `routes/api.php`:

```php
Route::middleware('auth:api')->group(function () {
    // Dashboard routes
    Route::get('/dashboard/user', [DashboardController::class, 'userDashboard']);
    
    // Job Alert routes
    Route::get('/job-alert', [JobAlertController::class, 'index']);
    
    // Job Upsell routes
    Route::get('/job-upsell', [JobUpsellController::class, 'index']);
    
    // Listing routes
    Route::get('/listing/my-listing', [ListingController::class, 'myListing']);
    
    // Chat routes
    Route::get('/chat/unread-count', [ChatController::class, 'getUnreadCount']);
});
```

### Step 4: Clear Laravel route cache (local backend)

```bash
cd /path/to/your/laravel/backend
php artisan route:clear
php artisan cache:clear
php artisan config:clear
```

### Step 5: Restart React development server

After creating `.env` file, restart your React app:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

## Verify It's Working

1. Check browser console - you should see API calls going to `localhost:8000` instead of `api.worldwideadverts.info`
2. Network tab should show successful 200 responses (not 404) if routes are working
3. If you still see 404s, check:
   - Is your Laravel backend running?
   - Are the routes registered? (Run `php artisan route:list`)
   - Did you clear route cache?

## Switch Back to Production

To test against production API again:
1. Remove or comment out the line in `.env`:
   ```env
   # REACT_APP_API_BASE_URL=http://localhost:8000/api
   ```
2. Restart React dev server

## Common Issues

### "Network Error" when calling localhost
- Make sure Laravel backend is running (`php artisan serve`)
- Check CORS configuration in Laravel (should allow `http://localhost:3000`)

### Still seeing production API calls
- Make sure `.env` file is in the root directory (not in `src/`)
- Restart React dev server after creating `.env`
- Variable name must start with `REACT_APP_` (React requirement)

### Routes return 404 even on localhost
- Clear Laravel route cache: `php artisan route:clear`
- Verify routes exist: `php artisan route:list | grep chat`
- Check middleware is correct (routes need `auth:api`)

## Current API Configuration

The frontend now uses:
- **Production (default)**: `https://api.worldwideadverts.info/api`
- **Localhost (if .env set)**: `http://localhost:8000/api` (or whatever you set)

This is configured in `src/api.js` line 3.
