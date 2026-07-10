// Debug API base URL configuration
console.log('=== API Base URL Debug ===\n');

// Check current API configuration
const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1';

console.log('Current API Base URL:', apiBaseURL);
console.log('Environment Variable REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
console.log('Development Mode:', isDevelopment);

// Determine what the base URL should be for local development
const expectedLocalBaseURL = 'http://127.0.0.1:8000/api/v1';
console.log('Expected Local Base URL:', expectedLocalBaseURL);

console.log('\n=== Analysis ===');
if (isDevelopment && apiBaseURL !== expectedLocalBaseURL) {
    console.log('❌ ISSUE: Local development is using production API URL');
    console.log('🔧 SOLUTION: Set REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1');
} else if (isDevelopment && apiBaseURL === expectedLocalBaseURL) {
    console.log('✅ OK: Local development is using correct API URL');
} else {
    console.log('ℹ️  Production mode - using production API URL');
}

console.log('\n=== Fix Required ===');
console.log('The duplicate prefix issue is caused by:');
console.log('1. Base URL: https://api.worldwideadverts.info/api/v1');
console.log('2. Endpoint: /api/v1/affiliates/user-posts');
console.log('3. Result: https://api.worldwideadverts.info/api/v1/api/v1/affiliates/user-posts');
console.log('\nSolution: Fix base URL for local development');
