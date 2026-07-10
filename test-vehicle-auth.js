// Test script to verify vehicle authentication
// Run this in browser console to debug vehicle submission issues

async function testVehicleAuthentication() {
  console.log('🚗 Testing Vehicle Authentication...');
  
  // 1. Check current auth status
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('📊 Current Auth Status:', {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 50) + '...' : 'null',
    hasUser: !!user,
    userId: user ? JSON.parse(user)?.id : 'N/A'
  });
  
  if (!token) {
    console.error('❌ No token found - please login first');
    return;
  }
  
  // 2. Test basic authentication
  console.log('🔐 Testing basic authentication...');
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
    const authData = await authResponse.json();
    console.log('✅ Auth Check Response:', authData);
    
    if (!authResponse.ok) {
      console.error('❌ Authentication failed:', authData);
      return;
    }
  } catch (error) {
    console.error('❌ Auth check error:', error);
    return;
  }
  
  // 3. Test vehicle store authorization (simulating the actual endpoint)
  console.log('🚗 Testing vehicle store authorization...');
  try {
    const vehicleTestResponse = await fetch('https://api.worldwideadverts.info/api/v1/test-vehicle-store-auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Vehicle Auth Test Status:', vehicleTestResponse.status);
    const vehicleTestData = await vehicleTestResponse.json();
    console.log('✅ Vehicle Auth Test Response:', vehicleTestData);
    
    if (!vehicleTestResponse.ok) {
      console.error('❌ Vehicle authorization failed:', vehicleTestData);
      return;
    }
  } catch (error) {
    console.error('❌ Vehicle auth test error:', error);
    return;
  }
  
  // 4. Test actual vehicle creation with minimal data
  console.log('📝 Testing actual vehicle creation...');
  try {
    const testVehicleData = new FormData();
    testVehicleData.append('make', 'Toyota');
    testVehicleData.append('model', 'Test Model');
    testVehicleData.append('year', '2023');
    testVehicleData.append('price', '10000');
    testVehicleData.append('description', 'Test vehicle for authentication');
    testVehicleData.append('condition', 'used');
    testVehicleData.append('fuel_type', 'gasoline');
    testVehicleData.append('transmission', 'manual');
    testVehicleData.append('body_type', 'sedan');
    
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
    console.log('✅ Vehicle Create Response:', vehicleCreateData);
    
    if (vehicleCreateResponse.ok) {
      console.log('🎉 SUCCESS! Vehicle creation works correctly');
    } else {
      console.error('❌ Vehicle creation failed:', vehicleCreateData);
    }
  } catch (error) {
    console.error('❌ Vehicle creation error:', error);
  }
  
  console.log('🏁 Vehicle Authentication Test Complete');
}

// Test token validation
function testTokenValidation() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No token to validate');
    return;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp && payload.exp < now;
    
    console.log('🔑 Token Details:', {
      subject: payload.sub || payload.id || 'N/A',
      issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'N/A',
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'N/A',
      isExpired: isExpired,
      timeUntilExpiry: payload.exp ? Math.floor((payload.exp - now) / 60) + ' minutes' : 'N/A'
    });
    
    if (isExpired) {
      console.error('❌ Token has expired');
    } else {
      console.log('✅ Token is valid');
    }
  } catch (error) {
    console.error('❌ Token validation error:', error.message);
  }
}

// Test API headers
function testApiHeaders() {
  console.log('🔍 Testing API headers configuration...');
  
  // This simulates what the API interceptor does
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Authorization header would be set:', headers['Authorization'].substring(0, 50) + '...');
  } else {
    console.error('❌ No token available for Authorization header');
  }
  
  console.log('📋 Headers that would be sent:', headers);
}

// Export functions
window.testVehicleAuthentication = testVehicleAuthentication;
window.testTokenValidation = testTokenValidation;
window.testApiHeaders = testApiHeaders;

console.log('🎯 Vehicle auth testing tools loaded!');
console.log('Available commands:');
console.log('- testVehicleAuthentication() - Full authentication test');
console.log('- testTokenValidation() - Token format and expiration check');
console.log('- testApiHeaders() - Check API header configuration');

// Auto-run basic checks
testTokenValidation();
testApiHeaders();
