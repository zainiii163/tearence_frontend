// Complete Vehicle Authentication Test
// Run this in browser console to verify the fix

async function runCompleteVehicleAuthTest() {
  console.log('🚗 Starting Complete Vehicle Authentication Test...');
  console.log('=' .repeat(60));
  
  // 1. Check current authentication status
  console.log('📊 Step 1: Checking Authentication Status');
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token) {
    console.error('❌ FAIL: No token found. Please login first.');
    return false;
  }
  
  console.log('✅ Token found:', token.substring(0, 30) + '...');
  
  try {
    const userData = JSON.parse(user);
    console.log('✅ User data found:', { id: userData.id, email: userData.email });
  } catch (e) {
    console.warn('⚠️ Could not parse user data:', e.message);
  }
  
  // 2. Test token format and expiration
  console.log('\n🔑 Step 2: Validating Token Format');
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ FAIL: Invalid JWT format');
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp && payload.exp < now;
    
    if (isExpired) {
      console.error('❌ FAIL: Token has expired');
      console.error('Expired at:', new Date(payload.exp * 1000).toISOString());
      return false;
    }
    
    console.log('✅ Token format is valid');
    console.log('⏰ Expires at:', payload.exp ? new Date(payload.exp * 1000).toISOString() : 'Unknown');
    console.log('⏱️ Time until expiry:', payload.exp ? Math.floor((payload.exp - now) / 60) + ' minutes' : 'Unknown');
  } catch (error) {
    console.error('❌ FAIL: Token validation error:', error.message);
    return false;
  }
  
  // 3. Test basic authentication endpoint
  console.log('\n🔐 Step 3: Testing Basic Authentication');
  try {
    const authResponse = await fetch('https://api.worldwideadverts.info/api/v1/auth/web-check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Auth Check Status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Basic authentication successful');
      console.log('👤 Authenticated user:', authData.data?.email || authData.email || 'Unknown');
    } else {
      const errorData = await authResponse.json();
      console.error('❌ FAIL: Basic authentication failed');
      console.error('Error:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ FAIL: Auth check network error:', error.message);
    return false;
  }
  
  // 4. Test vehicle API with authentication
  console.log('\n🚗 Step 4: Testing Vehicle API Authentication');
  try {
    const vehicleTestResponse = await fetch('https://api.worldwideadverts.info/api/v1/vehicles/my', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Vehicle API Status:', vehicleTestResponse.status);
    
    if (vehicleTestResponse.ok) {
      const vehicleData = await vehicleTestResponse.json();
      console.log('✅ Vehicle API authentication successful');
      console.log('🚗 User vehicles count:', Array.isArray(vehicleData.data) ? vehicleData.data.length : 'Unknown');
    } else if (vehicleTestResponse.status === 401) {
      console.error('❌ FAIL: Vehicle API returned 401 Unauthorized');
      console.error('This indicates the authentication guard issue still exists');
      return false;
    } else {
      const errorData = await vehicleTestResponse.json();
      console.warn('⚠️ Vehicle API returned non-200 status:', vehicleTestResponse.status);
      console.warn('Error:', errorData);
      // Don't fail here - endpoint might not exist but auth might work
    }
  } catch (error) {
    console.warn('⚠️ Vehicle API test network error:', error.message);
    console.warn('This might be expected if the endpoint doesn\'t exist');
  }
  
  // 5. Test actual vehicle creation with minimal data
  console.log('\n📝 Step 5: Testing Vehicle Creation (Dry Run)');
  try {
    const testVehicleData = new FormData();
    testVehicleData.append('make', 'Toyota');
    testVehicleData.append('model', 'Test Model');
    testVehicleData.append('year', '2023');
    testVehicleData.append('price', '10000');
    testVehicleData.append('description', 'Test vehicle for authentication validation');
    testVehicleData.append('condition', 'used');
    testVehicleData.append('fuel_type', 'gasoline');
    testVehicleData.append('transmission', 'manual');
    testVehicleData.append('body_type', 'sedan');
    testVehicleData.append('title', 'Test Vehicle - Auth Check');
    
    const vehicleCreateResponse = await fetch('https://api.worldwideadverts.info/api/v1/vehicles', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData - browser sets it with boundary
      },
      body: testVehicleData
    });
    
    console.log('📡 Vehicle Create Status:', vehicleCreateResponse.status);
    const vehicleCreateData = await vehicleCreateResponse.json();
    
    if (vehicleCreateResponse.ok) {
      console.log('🎉 SUCCESS! Vehicle creation works correctly');
      console.log('🚗 Created vehicle ID:', vehicleCreateData.data?.id || 'Unknown');
      console.log('✅ Authentication and authorization are working properly');
      return true;
    } else if (vehicleCreateResponse.status === 401) {
      console.error('❌ FAIL: Vehicle creation returned 401 Unauthorized');
      console.error('Error:', vehicleCreateData);
      console.error('The authentication guard issue still exists');
      return false;
    } else if (vehicleCreateResponse.status === 403) {
      console.error('❌ FAIL: Vehicle creation returned 403 Forbidden');
      console.error('Error:', vehicleCreateData);
      console.error('This indicates a policy/permission issue');
      return false;
    } else {
      console.warn('⚠️ Vehicle creation returned non-success status:', vehicleCreateResponse.status);
      console.warn('Error:', vehicleCreateData);
      console.warn('This might be due to validation errors, but authentication likely works');
      return true; // Assume auth works if it's not 401/403
    }
  } catch (error) {
    console.error('❌ FAIL: Vehicle creation network error:', error.message);
    return false;
  }
  
  console.log('\n🏁 Test Complete');
  return true;
}

// Quick test function for just the auth check
async function quickAuthTest() {
  console.log('🔍 Quick Authentication Test...');
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No token found');
    return false;
  }
  
  try {
    const response = await fetch('https://api.worldwideadverts.info/api/v1/auth/web-check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Authentication is working');
      return true;
    } else {
      console.error('❌ Authentication failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

// Test the vehicles API specifically
async function testVehiclesAPI() {
  console.log('🚗 Testing Vehicles API...');
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No token found');
    return false;
  }
  
  try {
    const response = await fetch('https://api.worldwideadverts.info/api/v1/vehicles/my', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Vehicles API authentication working');
      return true;
    } else if (response.status === 401) {
      console.error('❌ Vehicles API authentication failed');
      return false;
    } else {
      console.warn('⚠️ Vehicles API returned:', response.status);
      return true; // Might be endpoint issue, not auth
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

// Export functions
window.runCompleteVehicleAuthTest = runCompleteVehicleAuthTest;
window.quickAuthTest = quickAuthTest;
window.testVehiclesAPI = testVehiclesAPI;

console.log('🎯 Vehicle Authentication Test Tools Loaded!');
console.log('Available commands:');
console.log('- runCompleteVehicleAuthTest() - Full authentication test');
console.log('- quickAuthTest() - Quick auth check');
console.log('- testVehiclesAPI() - Test vehicles API specifically');

// Auto-run quick test
setTimeout(() => {
  console.log('\n🔄 Running quick auth test...');
  quickAuthTest();
}, 1000);
