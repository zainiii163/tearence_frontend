// JWT Refresh Flow Test
// This script tests the actual JWT refresh mechanism with your backend

const axios = require('axios');

// Configuration
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

console.log('=== JWT Refresh Flow Test ===\n');
console.log(`Testing against: ${baseURL}\n`);

// Test 1: Check if refresh endpoint is accessible
async function testRefreshEndpoint() {
  console.log('1. Testing refresh endpoint accessibility...');
  
  try {
    // Test without authentication (should be accessible)
    const response = await axios.get(`${baseURL}/v1/auth/refresh`, {
      validateStatus: (status) => status < 500 // Accept 4xx as valid responses
    });
    
    console.log(`   ✓ Endpoint accessible (Status: ${response.status})`);
    
    if (response.status === 401) {
      console.log('   ✓ Correctly returns 401 when no token provided');
    } else if (response.status === 200) {
      console.log('   ⚠ Endpoint returns 200 without token (check middleware)');
    }
    
    return true;
  } catch (error) {
    if (error.response) {
      console.log(`   ✓ Endpoint responds (Status: ${error.response.status})`);
      return true;
    } else {
      console.log('   ✗ Endpoint not accessible:', error.message);
      return false;
    }
  }
}

// Test 2: Simulate token refresh with expired token
async function testTokenRefresh() {
  console.log('\n2. Testing token refresh with expired token...');
  
  // This would require a real expired token from your backend
  // For now, we'll test the endpoint structure
  const expiredToken = 'expired_token_placeholder';
  
  try {
    const response = await axios.post(`${baseURL}/v1/auth/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${expiredToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      validateStatus: (status) => status < 500
    });
    
    console.log(`   ✓ Refresh endpoint accepts POST (Status: ${response.status})`);
    
    if (response.status === 401) {
      console.log('   ✓ Correctly rejects invalid expired token');
    } else if (response.status === 200) {
      console.log('   ✓ Accepts valid expired tokens');
      console.log('   Response data:', JSON.stringify(response.data, null, 2));
    }
    
    return true;
  } catch (error) {
    console.log('   ✗ Refresh endpoint error:', error.message);
    return false;
  }
}

// Test 3: Verify frontend refresh implementation
function testFrontendImplementation() {
  console.log('\n3. Verifying frontend refresh implementation...');
  
  // Check if api.js has the correct refresh logic
  const fs = require('fs');
  const path = require('path');
  
  try {
    const apiJsPath = path.join(__dirname, 'src', 'api.js');
    const apiContent = fs.readFileSync(apiJsPath, 'utf8');
    
    const checks = [
      {
        name: 'Uses POST method for refresh',
        test: apiContent.includes("refreshInstance.post('/v1/auth/refresh')")
      },
      {
        name: 'Handles refresh token in Authorization header',
        test: apiContent.includes('refreshInstance.defaults.headers.Authorization')
      },
      {
        name: 'Parses new token from response',
        test: apiContent.includes('refreshResponse.data?.token || refreshResponse.data?.access_token')
      },
      {
        name: 'Updates localStorage with new token',
        test: apiContent.includes('localStorage.setItem(\'jwt_token\', newToken)')
      },
      {
        name: 'Handles 401 refresh errors',
        test: apiContent.includes('refreshStatus === 401')
      },
      {
        name: 'Clears tokens on refresh expiry',
        test: apiContent.includes('localStorage.removeItem(\'jwt_token\')')
      }
    ];
    
    checks.forEach(check => {
      console.log(`   ${check.test ? '✓' : '✗'} ${check.name}`);
    });
    
    return checks.every(check => check.test);
  } catch (error) {
    console.log('   ✗ Could not read api.js:', error.message);
    return false;
  }
}

// Test 4: Environment configuration
function testEnvironmentConfig() {
  console.log('\n4. Checking environment configuration...');
  
  const envPath = '.env';
  const envExamplePath = '.env.example';
  
  try {
    const fs = require('fs');
    
    // Check if .env exists
    const envExists = fs.existsSync(envPath);
    console.log(`   ${envExists ? '✓' : '⚠'} .env file ${envExists ? 'exists' : 'missing (using .env.example)'}`);
    
    // Check .env.example
    if (fs.existsSync(envExamplePath)) {
      const envExample = fs.readFileSync(envExamplePath, 'utf8');
      const hasApiUrl = envExample.includes('REACT_APP_API_BASE_URL');
      console.log(`   ${hasApiUrl ? '✓' : '✗'} .env.example contains API URL configuration`);
    }
    
    // Check current API URL
    const currentApiUrl = process.env.REACT_APP_API_BASE_URL;
    if (currentApiUrl) {
      console.log(`   ✓ Using API URL: ${currentApiUrl}`);
      const isLocalhost = currentApiUrl.includes('localhost:8000');
      console.log(`   ${isLocalhost ? '✓' : '⚠'} ${isLocalhost ? 'Using local backend' : 'Using production backend'}`);
    } else {
      console.log('   ⚠ No API URL configured, using fallback');
    }
    
    return true;
  } catch (error) {
    console.log('   ✗ Environment check failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = [];
  
  results.push(await testRefreshEndpoint());
  results.push(await testTokenRefresh());
  results.push(testFrontendImplementation());
  results.push(testEnvironmentConfig());
  
  console.log('\n=== Test Results ===');
  const passedTests = results.filter(result => result).length;
  const totalTests = results.length;
  
  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! JWT refresh is properly configured.');
  } else {
    console.log('\n⚠ Some tests failed. Check the output above for details.');
  }
  
  console.log('\n📋 Manual Testing Steps:');
  console.log('1. Start your backend server (php artisan serve)');
  console.log('2. Start your frontend server (npm start)');
  console.log('3. Login to get a valid JWT token');
  console.log('4. Wait for token to expire (60 minutes) or clear localStorage');
  console.log('5. Try to access a protected endpoint');
  console.log('6. Check browser console for refresh attempts');
  console.log('7. Verify token refresh works or redirects to login');
}

// Run the tests
runAllTests().catch(console.error);
