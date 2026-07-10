# Hostinger Deployment Guide

This guide will help you deploy your React frontend to Hostinger with proper environment configuration.

## Prerequisites

- Hostinger hosting account with cPanel access
- Domain name configured (e.g., worldwideadverts.info)
- Backend API running at `https://api.worldwideadverts.info/api/v1`

## Environment Configuration

Your app is now properly configured with separate development and production environments:

### Development Environment (`.env.development`)

```env
# For local backend development, uncomment the line below:
# REACT_APP_API_BASE_URL=http://localhost:8000/api/v1

# For using production API in development (if no local backend):
REACT_APP_API_BASE_URL=https://api.worldwideadverts.info/api/v1
REACT_APP_API_URL=https://api.worldwideadverts.info/api/v1
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_ENV=development

# Development-specific settings
REACT_APP_DISABLE_CORS_WARNINGS=true
REACT_APP_DEBUG_API=true
```

### Production Environment (`.env.production`)

```env
REACT_APP_API_BASE_URL=https://api.worldwideadverts.info/api/v1
REACT_APP_API_URL=https://api.worldwideadverts.info/api/v1
REACT_APP_FRONTEND_URL=https://worldwideadverts.info
REACT_APP_ENV=production

# Production-specific settings
REACT_APP_DISABLE_CORS_WARNINGS=false
REACT_APP_DEBUG_API=false
```

## Deployment Steps

### 1. Build the React App

Run the following command in your project root:

```bash
npm run build
```

This will create a `build/` folder with optimized production files.

### 2. Upload to Hostinger

#### Option A: Using Hostinger File Manager

1. Log in to your Hostinger cPanel
2. Navigate to **File Manager**
3. Go to `public_html/`
4. Upload all contents from your local `build/` folder to `public_html/`
5. **IMPORTANT**: Upload the contents of the `build/` folder, NOT the folder itself

#### Option B: Using FTP

1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your Hostinger FTP account
3. Navigate to `public_html/`
4. Upload all contents from your local `build/` folder

### 3. Upload .htaccess File

The `.htaccess` file is crucial for React Router to work properly. It's already created in your project root.

1. Upload the `.htaccess` file to `public_html/`
2. Ensure it's in the same directory as `index.html`

The `.htaccess` file contains:
- Rewrite rules for React Router (handles client-side routing)
- Compression settings for better performance
- Cache headers for static assets

### 4. Verify Deployment

1. Open your browser and visit your domain: `https://worldwideadverts.info`
2. Test navigation between different pages
3. Refresh pages to ensure React Router is working (should not show 404)
4. Check browser console for any errors
5. Test API calls by logging in and using the application

## Local Development Setup

### Option 1: Using Production API (Default)

Your current setup uses the production API in development:

```bash
npm start
```

This will run at `http://localhost:3000` and use `https://api.worldwideadverts.info/api/v1` for API calls.

### Option 2: Using Local Backend

If you have a local Laravel backend running at `http://localhost:8000`:

1. Edit `.env.development`
2. Uncomment line 3: `REACT_APP_API_BASE_URL=http://localhost:8000/api/v1`
3. Comment out line 6 (production API URL)
4. Restart your development server: `npm start`

## Troubleshooting

### 404 Errors on Page Refresh

**Problem**: Refreshing a page shows 404 error instead of the React page.

**Solution**: Ensure `.htaccess` is uploaded to `public_html/` with the correct rewrite rules.

### API Calls Failing

**Problem**: API requests are failing or showing CORS errors.

**Solution**: 
1. Check that `.env.production` has the correct API URL
2. Verify your backend CORS configuration allows requests from your domain
3. Check browser console for specific error messages

### Mixed Content Errors

**Problem**: Browser blocks requests due to mixed content (HTTP vs HTTPS).

**Solution**: 
- Ensure all URLs use HTTPS
- Your backend API should use HTTPS
- Your frontend domain should have SSL certificate

### Environment Variables Not Working

**Problem**: App is not using production environment variables.

**Solution**: 
- Environment variables are baked into the build during `npm run build`
- Rebuild the app after changing `.env.production`: `npm run build`
- Re-upload the build folder

### Build Errors

**Problem**: `npm run build` fails with errors.

**Solution**: 
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript or linting errors
- Fix any errors before building

## File Structure After Deployment

```
public_html/
├── .htaccess              # React Router rewrite rules
├── index.html             # Main HTML file
├── asset-manifest.json   # Asset manifest
├── manifest.json          # PWA manifest
├── robots.txt             # SEO robots file
├── static/                # Static assets (JS, CSS, images)
│   ├── css/
│   ├── js/
│   └── media/
└── ...                    # Other build files
```

## Important Notes

### What NOT to Upload

Do NOT upload these files/folders to Hostinger:
- `node_modules/`
- `src/`
- `public/` (except files that are already in build/)
- `.git/`
- `.env.development`
- `.env.local`
- `package.json`
- `package-lock.json`
- Any test files
- Any development configuration files

### What TO Upload

Only upload the contents of the `build/` folder:
- All files and folders generated by `npm run build`
- The `.htaccess` file

### Security Best Practices

1. **Never commit sensitive data**: `.env` files should be in `.gitignore`
2. **Use HTTPS**: Ensure SSL is enabled on your domain
3. **API Security**: Your backend should validate requests and use proper authentication
4. **CORS Configuration**: Backend should only allow requests from your domain
5. **Regular Updates**: Keep dependencies updated for security patches

## Backend CORS Configuration

If your backend is Laravel, ensure your CORS configuration allows your frontend domain:

In `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_origins' => [
    'https://worldwideadverts.info',
],

'allowed_methods' => ['*'],

'allowed_headers' => ['*'],
```

## Performance Optimization

Your `.htaccess` file includes:
- **Compression**: Reduces file sizes for faster loading
- **Cache Headers**: Caches static assets for 1 year
- **React Router**: Handles client-side routing properly

## Monitoring

After deployment:
1. Monitor your hosting dashboard for errors
2. Check browser console for client-side errors
3. Monitor API response times
4. Set up error tracking (e.g., Sentry) if needed

## Support

If you encounter issues:
1. Check Hostinger's documentation: https://support.hostinger.com
2. Verify your backend API is working correctly
3. Check browser console for specific error messages
4. Review Hostinger's error logs in cPanel

## Summary

Your React app is now properly configured for development and production:

✅ Development uses localhost with optional local backend
✅ Production uses production API URL
✅ All API files use environment variables
✅ React Router is configured with .htaccess
✅ Build process is optimized for production
✅ No hardcoded URLs in the codebase

Follow this guide to deploy to Hostinger successfully.
