# Hostinger Shared Hosting Deployment Guide
## React (Create React App) - Production Deployment

### Project Information
- **Frontend**: React (Create React App)
- **Backend API**: https://api.worldwideadverts.info/api/v1
- **Frontend Domain**: https://worldwideadverts.info
- **Deployment Location**: Hostinger Shared Hosting (public_html or subdirectory)

---

## Pre-Deployment Checklist

### ✅ Configuration Files Verified

1. **Environment Variables**
   - `.env.development` - Configured for local development
   - `.env.production` - Configured for production (uses production API)
   - `.env.example` - Updated to match production URL

2. **Package.json**
   - Removed `"proxy": "http://localhost:8000"` (development-only setting)
   - Build script: `"build": "cross-env GENERATE_SOURCEMAP=false react-scripts build"`
   - Source maps disabled for production security

3. **API Configuration**
   - All API calls use `process.env.REACT_APP_API_BASE_URL`
   - Fallback to production API: `https://api.worldwideadverts.info/api/v1`
   - No hardcoded localhost URLs in production code

4. **React Router**
   - Uses `BrowserRouter` from react-router-dom
   - Client-side routing configured correctly

5. **.htaccess**
   - React Router rewrite rules configured
   - Compression enabled (mod_deflate)
   - Cache headers for static assets (1 year)
   - Security headers added
   - HTTPS enforcement enabled

---

## Deployment Steps

### Step 1: Build the Production Bundle

Run this command in your project root:

```bash
npm run build
```

This creates an optimized `build/` folder with:
- Minified JavaScript and CSS
- Optimized assets
- No source maps (for security)
- Production-ready static files

**Expected output**: A `build` folder containing:
- `index.html` (entry point)
- `static/` (JS, CSS, media files)
- Asset files (favicon, etc.)

---

### Step 2: Files to Upload to Hostinger

#### ✅ UPLOAD THESE FILES (from build/ folder):

```
build/
├── index.html              # Main HTML file
├── static/                 # All static assets
│   ├── css/               # Minified CSS files
│   ├── js/                # Minified JavaScript files
│   └── media/             # Images and media files
├── favicon.ico            # (if present)
├── logo192.png            # (if present)
├── logo512.png            # (if present)
├── manifest.json          # (if present)
└── robots.txt             # (if present)
```

#### ✅ ALSO UPLOAD:

```
.htaccess                  # Apache configuration (in build/ folder root)
```

#### ❌ DO NOT UPLOAD:

- Source code files (src/, public/, node_modules/, etc.)
- Configuration files (.env, .env.development, .env.production, package.json, etc.)
- Development files (test files, debug scripts, etc.)
- Git files (.git/, .gitignore, etc.)
- Build tools (webpack config, etc.)
- Documentation files (README.md, etc.)

---

### Step 3: Upload to Hostinger

#### Option A: Using File Manager (Recommended for small deployments)

1. Log in to Hostinger hPanel
2. Go to **Files** > **File Manager**
3. Navigate to your deployment directory:
   - For main domain: `public_html`
   - For subdirectory: `public_html/your-subdirectory`
4. **Delete all existing files** in the target directory (if redeploying)
5. Upload all files from the `build/` folder
6. Ensure `.htaccess` is uploaded to the root of the deployment directory

#### Option B: Using FTP/SFTP

1. Use FileZilla or WinSCP
2. Connect to Hostinger using FTP/SFTP credentials
3. Navigate to deployment directory
4. Upload all files from `build/` folder
5. Ensure `.htaccess` is uploaded

#### Option C: Using Git (Advanced)

If Hostinger supports Git deployment:
1. Push to your Git repository
2. Use Hostinger's Git deployment feature
3. Configure deployment to use `build/` folder

---

### Step 4: Verify Deployment

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. Visit your domain: `https://worldwideadverts.info`
3. **Check**:
   - Homepage loads correctly
   - Navigation works (click links)
   - **Page refresh** does not give 404 (critical test)
   - API calls work (check browser console)
   - No mixed-content warnings (HTTP/HTTPS)
   - All assets load (check Network tab)

4. **Test routing**:
   - Navigate to different pages
   - Refresh each page (should not 404)
   - Direct URL access (type URL manually)
   - Back/forward browser buttons

---

## Troubleshooting Common Issues

### Issue 1: Page Refresh Gives 404

**Cause**: Apache not configured for client-side routing

**Solution**:
- Ensure `.htaccess` is uploaded to the correct location
- Verify `.htaccess` contains the React Router rewrite rules
- Check that mod_rewrite is enabled on Hostinger (usually enabled by default)

**Required .htaccess content**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### Issue 2: Mixed Content Warnings

**Cause**: HTTP resources on HTTPS page

**Solution**:
- Ensure all API calls use HTTPS
- Check for hardcoded HTTP URLs in code
- Verify backend API uses HTTPS
- The .htaccess now enforces HTTPS

---

### Issue 3: CORS Errors

**Cause**: Backend not configured to allow requests from your domain

**Solution**:
- Backend must include CORS headers:
  ```
  Access-Control-Allow-Origin: https://worldwideadverts.info
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```
- Backend CORS configuration is on the server side (Laravel)
- Contact backend developer to verify CORS settings

---

### Issue 4: API Not Working

**Cause**: Environment variables not set in production

**Solution**:
- React build bakes in environment variables at build time
- Ensure `.env.production` was present during build
- Rebuild if environment variables changed:
  ```bash
  npm run build
  ```
- Upload new build folder

---

### Issue 5: White Screen / Blank Page

**Cause**: JavaScript error or missing files

**Solution**:
- Open browser console (F12)
- Check for JavaScript errors
- Verify all files uploaded correctly
- Check that index.html path is correct
- Verify static/ folder structure

---

### Issue 6: Old Cache Showing

**Cause**: Browser or CDN cache

**Solution**:
- Clear browser cache
- Use incognito/private mode
- If using CDN, purge cache
- Rename build folder to force cache bust (temporary solution)

---

## Environment Variables Reference

### Current Configuration

**.env.production** (already configured):
```env
REACT_APP_API_BASE_URL=https://api.worldwideadverts.info/api/v1
REACT_APP_API_URL=https://api.worldwideadverts.info/api/v1
REACT_APP_FRONTEND_URL=https://worldwideadverts.info
REACT_APP_ENV=production
REACT_APP_DISABLE_CORS_WARNINGS=false
REACT_APP_DEBUG_API=false
```

### How to Change Environment Variables

1. Edit `.env.production` file
2. Rebuild the application:
   ```bash
   npm run build
   ```
3. Upload new build folder to Hostinger

**Important**: Environment variables are baked into the build at build time. You cannot change them without rebuilding.

---

## Security Best Practices

### ✅ Implemented

1. **No Source Maps**: Disabled in production build
2. **HTTPS Enforced**: .htaccess redirects HTTP to HTTPS
3. **Security Headers**: Added to .htaccess
4. **CORS Configuration**: Backend must be configured
5. **Environment Variables**: Sensitive data not in client code

### 🔒 Recommended Additional Security

1. **Content Security Policy (CSP)**: Add CSP headers in .htaccess
2. **Subresource Integrity (SRI)**: For external scripts
3. **Rate Limiting**: Configure on backend
4. **API Authentication**: JWT tokens already implemented
5. **HTTPS Only**: Ensure SSL certificate is valid

---

## Performance Optimization

### ✅ Implemented

1. **Minification**: JavaScript and CSS minified by CRA
2. **Compression**: Gzip compression enabled in .htaccess
3. **Cache Headers**: 1-year cache for static assets
4. **Code Splitting**: React lazy loading implemented
5. **Image Optimization**: Use optimized images

### 🚀 Additional Optimization

1. **CDN**: Use CDN for static assets (Cloudflare, AWS CloudFront)
2. **Service Worker**: Implement for offline support
3. **Lazy Loading**: Already implemented for routes
4. **Image Optimization**: Use WebP format
5. **Bundle Analysis**: Use webpack-bundle-analyzer

---

## Maintenance & Updates

### How to Update the Application

1. Make changes to source code
2. Test locally: `npm start`
3. Build for production: `npm run build`
4. Upload new build folder to Hostinger
5. Clear browser cache and verify

### Rollback Procedure

If deployment breaks the site:

1. Keep previous build folder as backup
2. Rename current build folder to `build-backup-[date]`
3. Restore previous build folder
4. Verify site works
5. Debug the issue locally

---

## API Architecture Decision

### Current Setup: Subdomain API

**Configuration**:
- Frontend: https://worldwideadverts.info
- Backend API: https://api.worldwideadverts.info/api/v1

**Advantages**:
- ✅ **Scalability**: Can scale API independently
- ✅ **Security**: API on separate domain/subdomain
- ✅ **CDN Friendly**: Can use CDN for API
- ✅ **Isolation**: API issues don't affect frontend
- ✅ **Flexibility**: Can move API to different server
- ✅ **CORS Control**: Explicit CORS configuration
- ✅ **Load Balancing**: Easy to add load balancer for API
- ✅ **Monitoring**: Separate monitoring for API

**Disadvantages**:
- ❌ **CORS Complexity**: Requires CORS configuration
- ❌ **Cookie Restrictions**: Third-party cookie restrictions
- ❌ **DNS Resolution**: Slightly slower (extra DNS lookup)
- ❌ **SSL Certificates**: Need SSL for both domains

### Alternative: Same-Domain API

**Configuration**:
- Frontend: https://worldwideadverts.info
- Backend API: https://worldwideadverts.info/api/v1

**Advantages**:
- ✅ **No CORS**: Same-origin, no CORS needed
- ✅ **Cookies**: No third-party cookie restrictions
- ✅ **Simpler**: Less complex setup
- ✅ **Faster**: No extra DNS lookup

**Disadvantages**:
- ❌ **Coupling**: Frontend and API coupled together
- ❌ **Scalability**: Harder to scale independently
- ❌ **Security**: If frontend compromised, API exposed
- ❌ **Deployment**: Must deploy both together
- ❌ **Load Balancing**: More complex to load balance

### Recommendation

**Keep Current Subdomain API Setup** because:

1. **Your application is large and complex** (multiple systems: books, jobs, vehicles, etc.)
2. **API is already on subdomain** - migration would be complex
3. **Scalability is important** for growing platform
4. **Security isolation** is better with subdomain
5. **CORS is already configured** and working

### CORS Configuration Required

Ensure backend Laravel CORS configuration allows:

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['https://worldwideadverts.info'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

---

## File Structure After Deployment

```
public_html/ (or your subdirectory)
├── index.html              # React entry point
├── static/                 # Static assets
│   ├── css/
│   │   ├── main.[hash].css
│   │   └── main.[hash].css.map (not uploaded)
│   ├── js/
│   │   ├── main.[hash].js
│   │   └── main.[hash].js.map (not uploaded)
│   └── media/
│       └── [images and media]
├── favicon.ico
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
└── .htaccess              # Apache configuration
```

---

## Quick Reference Commands

### Local Development
```bash
npm start                 # Start development server
npm run build            # Build for production
npm test                 # Run tests
```

### Deployment
```bash
npm run build            # Create production build
# Then upload build/ folder to Hostinger
```

### Troubleshooting
```bash
# Check build output
ls -la build/

# Test build locally (optional)
npx serve -s build -l 3000
```

---

## Support & Resources

### Hostinger Resources
- Hostinger Documentation: https://support.hostinger.com
- File Manager Guide: https://support.hostinger.com/en/articles/1376585-how-to-use-file-manager
- FTP Guide: https://support.hostinger.com/en/articles/1376755-how-to-use-ftp

### React Resources
- Create React App Deployment: https://create-react-app.dev/docs/deployment
- React Router Deployment: https://reactrouter.com/web/guides/deployment

### Troubleshooting
- Browser Console: F12 > Console tab
- Network Tab: F12 > Network tab (check failed requests)
- React DevTools: Browser extension for debugging

---

## Deployment Checklist

- [ ] Build production bundle (`npm run build`)
- [ ] Verify build folder created correctly
- [ ] Upload all files from build/ folder
- [ ] Upload .htaccess to correct location
- [ ] Clear browser cache
- [ ] Test homepage loads
- [ ] Test page navigation
- [ ] Test page refresh (no 404)
- [ ] Test direct URL access
- [ ] Test API calls (check console)
- [ ] Check for mixed-content warnings
- [ ] Verify HTTPS enforced
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Monitor for errors in console

---

## Post-Deployment Monitoring

### Key Metrics to Monitor

1. **Page Load Time**: Should be < 3 seconds
2. **API Response Time**: Should be < 1 second
3. **Error Rate**: Should be < 1%
4. **Uptime**: Should be 99.9%+

### Tools for Monitoring

- Google PageSpeed Insights
- GTmetrix
- Hostinger Analytics
- Browser DevTools

---

## Conclusion

Your React application is now configured for production deployment to Hostinger shared hosting. The configuration uses:

- ✅ Environment variables for API configuration
- ✅ Production build optimizations
- ✅ React Router with .htaccess for client-side routing
- ✅ Security headers and HTTPS enforcement
- ✅ Subdomain API architecture for scalability
- ✅ No hardcoded localhost URLs
- ✅ No source maps in production

Follow the deployment steps above to deploy your application successfully.
