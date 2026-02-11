# Quick Fix: Switch to Localhost API

## 🎯 Why You're Seeing 404 Errors on Localhost

Your React frontend is currently pointing to **production API** (`https://api.worldwideadverts.info`), but:
- Those routes return 404 because they haven't been deployed to production yet
- You want to test with your **local backend** instead

## ✅ Quick Solution (3 Steps)

### Step 1: Create `.env` file
In the root directory (same level as `package.json`), create a file named `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

**Important:** The file must be named exactly `.env` (with the dot at the start)

### Step 2: Make sure your local Laravel backend is running
```bash
cd /path/to/your/laravel/backend
php artisan serve
```

### Step 3: Restart React dev server
```bash
# Stop current server (Ctrl+C), then:
npm start
```

## ✅ Done!

Now your frontend will call `http://localhost:8000/api` instead of production.

When you open the browser console, you should see:
```
[API] Using base URL: http://localhost:8000/api
```

## 🔍 Verify It's Working

1. **Check browser console** - Should show localhost URL
2. **Check Network tab** - API calls should go to `localhost:8000`
3. **No more 404 errors** - If your local routes are set up correctly

## ❌ Still Seeing 404s?

If you still see 404 errors after switching to localhost:

1. **Is your Laravel backend running?**
   ```bash
   php artisan serve
   ```

2. **Do the routes exist in your local `routes/api.php`?**
   - `/api/v1/chat/unread-count`
   - `/api/v1/dashboard/user`
   - `/api/v1/job-alert`
   - `/api/v1/job-upsell`
   - `/api/v1/listing/my-listing`

3. **Clear Laravel route cache:**
   ```bash
   php artisan route:clear
   php artisan cache:clear
   ```

4. **Verify routes:**
   ```bash
   php artisan route:list | grep -E "chat|dashboard|job"
   ```

## 🔄 Switch Back to Production

To test against production again, just remove or comment out the line in `.env`:
```env
# REACT_APP_API_BASE_URL=http://localhost:8000/api
```

Then restart React dev server.

## 📝 Notes

- The `.env` file is already in `.gitignore`, so it won't be committed
- Browser Network tab will always show 404s as failed requests, but the app handles them gracefully
- Console will show info messages (not errors) when endpoints aren't available

---

**See `LOCALHOST_SETUP.md` for detailed setup instructions.**
