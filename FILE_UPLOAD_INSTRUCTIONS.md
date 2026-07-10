# File Upload Instructions for Hostinger Shared Hosting

## Quick Summary

**Upload Location**: `public_html/` (or your specified subdirectory)
**Source Folder**: `build/` (created after running `npm run build`)

---

## Step-by-Step Upload Process

### Step 1: Build the Application

Open terminal in your project directory and run:

```bash
npm run build
```

This creates a `build/` folder with production-ready files.

---

### Step 2: Prepare Files for Upload

From the `build/` folder, you need to upload:

#### ✅ REQUIRED FILES:

```
build/
├── index.html              # MUST UPLOAD - Entry point
├── static/                 # MUST UPLOAD - All assets
│   ├── css/               # All CSS files
│   ├── js/                # All JavaScript files
│   └── media/             # All images/media
├── favicon.ico             # Upload if present
├── logo192.png             # Upload if present
├── logo512.png             # Upload if present
├── manifest.json           # Upload if present
├── robots.txt              # Upload if present
└── .htaccess              # MUST UPLOAD - Apache configuration
```

#### ❌ DO NOT UPLOAD:

- Source code (src/, public/ folders)
- Configuration files (.env files, package.json, etc.)
- Development files (test files, debug scripts)
- Git files (.git/, .gitignore)
- Node modules (node_modules/)
- Build tools (webpack config, etc.)

---

### Step 3: Upload Using Hostinger File Manager

#### Option A: Upload to Root Domain (public_html)

1. **Log in to Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com
   - Login with your credentials

2. **Navigate to File Manager**
   - In the left sidebar, click **"Files"**
   - Click **"File Manager"**

3. **Go to public_html**
   - Navigate to: `public_html/`
   - This is your root domain directory

4. **Backup Existing Files** (IMPORTANT!)
   - Select all files in `public_html/`
   - Click **"Download"** to backup
   - Or rename `public_html` to `public_html_backup`

5. **Delete Existing Files** (for clean deployment)
   - Select all files in `public_html/`
   - Click **"Delete"**
   - Confirm deletion

6. **Upload Build Files**
   - Click **"Upload"** button (top right)
   - Select all files from your local `build/` folder
   - Wait for upload to complete

7. **Verify .htaccess**
   - Ensure `.htaccess` is in the root of `public_html/`
   - If not visible, enable "Show hidden files" in File Manager settings

#### Option B: Upload to Subdirectory

If deploying to a subdirectory (e.g., `public_html/live/`):

1. Navigate to `public_html/live/`
2. Follow steps 4-7 above

---

### Step 4: Upload Using FTP (Alternative Method)

#### Using FileZilla:

1. **Download FileZilla** (if not installed)
   - https://filezilla-project.org/

2. **Get FTP Credentials from Hostinger**
   - Go to hPanel > **Hosting** > **FTP Accounts**
   - Copy FTP host, username, and password

3. **Connect to Hostinger**
   - Open FileZilla
   - Enter FTP credentials
   - Click **"Quickconnect"**

4. **Navigate to Deployment Directory**
   - Remote site: `public_html/` (or your subdirectory)

5. **Delete Existing Files** (for clean deployment)
   - Select all files in remote directory
   - Right-click > Delete

6. **Upload Build Files**
   - Local site: Navigate to your `build/` folder
   - Select all files
   - Right-click > Upload
   - Wait for upload to complete

---

### Step 5: Verify Deployment

1. **Clear Browser Cache**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Or use incognito/private mode

2. **Visit Your Website**
   - Open: https://worldwideadverts.info
   - Check if homepage loads

3. **Test Critical Functionality**
   - ✅ Homepage loads
   - ✅ Navigation works (click menu items)
   - ✅ **Page refresh does NOT give 404** (critical test)
   - ✅ Direct URL access works (type URL manually)
   - ✅ Back/forward browser buttons work
   - ✅ API calls work (check browser console for errors)

4. **Check Browser Console**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for red errors
   - Check Network tab for failed requests

---

## File Upload Checklist

Before uploading:
- [ ] Ran `npm run build` successfully
- [ ] `build/` folder created
- [ ] Backup existing files on server
- [ ] Know deployment directory (public_html or subdirectory)

After uploading:
- [ ] All files from build/ uploaded
- [ ] .htaccess uploaded to correct location
- [ ] index.html is in root directory
- [ ] static/ folder uploaded with all contents
- [ ] Cleared browser cache
- [ ] Tested homepage loads
- [ ] Tested page refresh (no 404)
- [ ] Tested navigation
- [ ] Checked browser console for errors
- [ ] Verified API calls work

---

## Common Upload Issues & Solutions

### Issue 1: .htaccess Not Visible

**Cause**: File Manager hides hidden files by default

**Solution**:
1. In File Manager, click **"Settings"** (gear icon)
2. Enable **"Show hidden files"**
3. .htaccess should now be visible

---

### Issue 2: Upload Fails or Times Out

**Cause**: File too large or connection issue

**Solution**:
1. Upload files in smaller batches
2. Use FTP instead of File Manager for large uploads
3. Check internet connection
4. Try uploading during off-peak hours

---

### Issue 3: Files Not Appearing After Upload

**Cause**: Upload not completed or wrong directory

**Solution**:
1. Verify upload completed (check progress bar)
2. Confirm you're in the correct directory
3. Refresh File Manager
4. Check file permissions (should be 644 for files, 755 for directories)

---

### Issue 4: White Screen After Upload

**Cause**: Missing files or incorrect .htaccess

**Solution**:
1. Verify all files uploaded
2. Check .htaccess is in root directory
3. Verify index.html exists
4. Check browser console for errors
5. Re-upload if necessary

---

### Issue 5: Page Refresh Gives 404

**Cause**: .htaccess not configured or not uploaded

**Solution**:
1. Verify .htaccess uploaded to root directory
2. Check .htaccess contains React Router rules
3. Ensure mod_rewrite is enabled (contact Hostinger if needed)
4. Clear browser cache and try again

---

## Directory Structure After Upload

### If uploading to public_html:

```
public_html/
├── index.html              # React entry point
├── static/                 # Static assets
│   ├── css/
│   │   └── main.[hash].css
│   ├── js/
│   │   └── main.[hash].js
│   └── media/
│       └── [images]
├── favicon.ico
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
└── .htaccess              # Apache configuration
```

### If uploading to subdirectory (e.g., live/):

```
public_html/
└── live/
    ├── index.html
    ├── static/
    ├── favicon.ico
    ├── .htaccess
    └── ...
```

---

## File Permissions

After upload, verify file permissions:

- **Files**: 644 (rw-r--r--)
- **Directories**: 755 (rwxr-xr-x)
- **.htaccess**: 644

To change permissions in File Manager:
1. Right-click file/directory
2. Select **"Permissions"**
3. Set appropriate permission
4. Click **"Save"**

---

## Automated Upload (Advanced)

### Using Git (if Hostinger supports it):

1. Push your code to Git repository
2. Use Hostinger's Git deployment
3. Configure to deploy `build/` folder

### Using Deployment Scripts:

Create a deployment script (deploy.sh):

```bash
#!/bin/bash

# Build the application
npm run build

# Upload using FTP (requires lftp)
lftp -u username,password -e "
  mirror -R build/ /public_html/
  bye
" ftp.hostname.com
```

Run: `bash deploy.sh`

---

## Rollback Procedure

If deployment breaks the site:

### Option A: Restore from Backup

1. In File Manager, navigate to deployment directory
2. If you backed up files, restore them
3. Or rename current folder to `build-failed-[date]`
4. Restore previous backup

### Option B: Re-upload Previous Build

1. Keep previous `build/` folder as backup
2. Re-upload previous build
3. Verify site works

### Option C: Quick Fix

If only a few files are broken:
1. Re-upload only the broken files
2. Clear browser cache
3. Test

---

## Post-Upload Verification Commands

### Check if files exist:

In browser console:
```javascript
// Check if index.html loads
fetch('/').then(r => r.text()).then(console.log)

// Check if static files load
fetch('/static/js/main.js').then(r => console.log('JS loads'))
fetch('/static/css/main.css').then(r => console.log('CSS loads'))
```

### Check .htaccess rules:

```javascript
// Try accessing a non-existent route
// Should return index.html, not 404
window.location.href = '/test-route-12345'
```

---

## Summary

**Key Points**:
1. Only upload files from `build/` folder
2. Upload .htaccess to root directory
3. Clear browser cache after upload
4. Test page refresh (critical for React Router)
5. Backup existing files before upload
6. Verify all files uploaded successfully

**Critical Files**:
- ✅ index.html (entry point)
- ✅ static/ folder (all assets)
- ✅ .htaccess (Apache configuration)

**Critical Tests**:
- ✅ Homepage loads
- ✅ Page refresh works (no 404)
- ✅ Navigation works
- ✅ API calls work
- ✅ No console errors

Your React application is now ready for production deployment to Hostinger shared hosting!
