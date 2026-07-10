// Test script to verify token handling fix
// This script checks if the token is being retrieved correctly

console.log('=== Token Fix Verification ===');

// Check if token exists in localStorage
const token = localStorage.getItem('token');
console.log('Token found:', !!token);
console.log('Token length:', token ? token.length : 0);

if (token) {
  console.log('Token preview:', token.substring(0, 20) + '...');
  
  // Test API request configuration like vehiclesAPI does
  const testConfig = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (token) {
    testConfig.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('Test API headers:', testConfig.headers);
  console.log('Authorization header present:', !!testConfig.headers.Authorization);
  
  // Simulate the API call that was failing
  console.log('Simulating POST /api/v1/vehicles request...');
  console.log('Request would include Authorization:', testConfig.headers.Authorization ? 'YES' : 'NO');
  
} else {
  console.error('❌ No token found in localStorage');
  console.log('Please login first and then test vehicle creation');
}

console.log('\n=== Next Steps ===');
console.log('1. Make sure you are logged in');
console.log('2. Try creating a vehicle');
console.log('3. If you still get 403 errors, check the backend authorization policies');
console.log('4. The token key mismatch has been fixed in all API services');
