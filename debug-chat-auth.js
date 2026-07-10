// Debug script to check authentication state and chat service
console.log('=== Chat Service Debug ===');

// Check authentication state
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const customerId = localStorage.getItem('customer_id');

console.log('Token exists:', !!token);
console.log('User exists:', !!user);
console.log('Customer ID exists:', !!customerId);

if (token) {
  console.log('Token preview:', token.substring(0, 20) + '...');
  console.log('Token length:', token.length);
}

if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('User data:', userData);
    console.log('User ID:', userData.id);
    console.log('User email:', userData.email);
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }
}

// Test API request configuration
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

// Simulate the problematic API call
console.log('\n=== Simulating API Call ===');
console.log('URL: http://localhost:8000/api/v1/chat/unread-count');
console.log('Method: GET');
console.log('Headers:', testConfig.headers);

console.log('\n=== Possible Issues ===');
console.log('1. User not logged in (no token)');
console.log('2. Token expired or invalid');
console.log('3. Backend authentication middleware not working');
console.log('4. Backend user_id property missing in authenticated user object');
console.log('5. Backend chat controller expecting different user property');

console.log('\n=== Recommendations ===');
console.log('1. Ensure user is logged in with valid token');
console.log('2. Check backend authentication middleware');
console.log('3. Verify backend chat controller user access');
console.log('4. The frontend now handles 500 errors gracefully');
