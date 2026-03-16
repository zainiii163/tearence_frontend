# Backend URL Configuration

## ✅ **Backend API Updated to Local Server**

### **🎯 Configuration Updated:**

#### **1. Main API Configuration (`src/api.js`)**
```javascript
// Updated to use local backend
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";
```

#### **2. Environment Configuration (`src/useEnv.js`)**
```javascript
// Updated to use local backend
const APiData = {
    GoogleApiKey: "AIzaSyA_vUUk7-lthEghuYmzKv2nJSgLSYvZres",
    baseUrl: "http://localhost:8000/api/"
}
```

#### **3. Affiliate Configuration (`src/config/affiliateConfig.js`)**
```javascript
// Already correctly configured
API: {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  // ... rest of config
}
```

### **🔧 Current Backend Setup:**

#### **Primary Backend URL:**
- **URL**: `http://localhost:8000/api`
- **Status**: ✅ Active and configured
- **Usage**: All API calls will now point to local backend

#### **Environment Variable Support:**
- **Variable**: `REACT_APP_API_BASE_URL`
- **Default**: `http://localhost:8000/api`
- **Override**: Can be set in `.env` file if needed

### **📱 API Endpoints Structure:**

#### **Base URL:**
```
http://localhost:8000/api
```

#### **Common Endpoints:**
- **Authentication**: `/api/v1/auth/*`
- **User Profile**: `/api/v1/user/*`
- **Marketplace**: `/api/v1/marketplace/*`
- **Banner Ads**: `/api/v1/banner/*`
- **Jobs**: `/api/v1/jobs/*`
- **Property**: `/api/v1/property/*`
- **Services**: `/api/v1/services/*`
- **Funding**: `/api/v1/funding/*`
- **Vehicles**: `/api/v1/vehicles/*`
- **Donations**: `/api/v1/donations/*`

### **🔄 Request Flow:**

#### **API Call Process:**
1. **Frontend** makes request to `http://localhost:8000/api/endpoint`
2. **JWT Token** automatically added to Authorization header
3. **Backend** processes request with authentication
4. **Response** returned to frontend with data

#### **Authentication Flow:**
1. **Login** → POST `/api/v1/auth/login`
2. **Token Storage** → JWT stored in localStorage
3. **API Calls** → Token added to all subsequent requests
4. **Token Refresh** → Automatic refresh on expiry

### **⚠️ Error Handling:**

#### **Common Issues & Solutions:**

#### **1. "Resource not found" Errors:**
- **Cause**: Backend endpoint not implemented
- **Solution**: Backend needs to implement missing endpoints
- **Temporary Fix**: Mock data returned for expected 404s

#### **2. CORS Issues:**
- **Cause**: Backend CORS configuration
- **Solution**: Ensure backend allows `http://localhost:3000`
- **Backend Config**: Add CORS middleware for frontend origin

#### **3. Connection Refused:**
- **Cause**: Backend server not running
- **Solution**: Start backend server on port 8000
- **Command**: `python manage.py runserver` (if Django)

### **🛠️ Development Setup:**

#### **Backend Requirements:**
- **Server**: Running on `http://localhost:8000`
- **CORS**: Allow frontend origin `http://localhost:3000`
- **API Endpoints**: Implement all marketplace endpoints
- **Authentication**: JWT-based auth system
- **Database**: Proper schema for all marketplace data

#### **Frontend Configuration:**
- **API Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT tokens in localStorage
- **Error Handling**: Graceful fallback to mock data
- **Development Logging**: API calls logged in console

### **📊 Implementation Status:**

#### **✅ Configured Components:**
- **Main API**: `src/api.js` - Updated to local backend
- **Environment**: `src/useEnv.js` - Updated to local backend
- **Affiliate**: `src/config/affiliateConfig.js` - Already correct
- **Banner Ads**: Using local API endpoints
- **All Marketplace Pages**: Point to local backend

#### **🔄 Next Steps:**
1. **Ensure Backend Running**: Start backend server on port 8000
2. **Verify CORS**: Check backend allows frontend origin
3. **Test Endpoints**: Verify all marketplace endpoints work
4. **Monitor Console**: Check for API call logs and errors

### **🚀 Result:**

The frontend is now fully configured to use the local backend at `http://localhost:8000/api`. All API calls from the marketplace pages, authentication, and data fetching will point to the local development server.

**Note**: The "Resource not found" error you saw indicates that the backend needs to implement the specific endpoints that the frontend is trying to access. The frontend will gracefully fall back to mock data for missing endpoints.
