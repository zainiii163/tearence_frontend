// CORS Debugging Script
// Run this in your browser console to test CORS issues

async function testCORS() {
  console.log('🔍 Testing CORS Configuration...');
  
  const testURL = 'https://api.worldwideadverts.info/api/v1/category?is_parent=yes';
  const frontendOrigin = 'https://worldwideadverts.info';
  
  try {
    // Test 1: Simple fetch request
    console.log('\n📡 Test 1: Simple fetch request');
    const response1 = await fetch(testURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': frontendOrigin,
      },
      mode: 'cors'
    });
    
    console.log('✅ Simple fetch successful:', response1.status);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': response1.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response1.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response1.headers.get('Access-Control-Allow-Headers'),
    });
    
  } catch (error) {
    console.error('❌ Simple fetch failed:', error.message);
  }
  
  try {
    // Test 2: Preflight request (OPTIONS)
    console.log('\n📡 Test 2: Preflight OPTIONS request');
    const response2 = await fetch(testURL, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': frontendOrigin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      },
      mode: 'cors'
    });
    
    console.log('✅ Preflight successful:', response2.status);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': response2.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response2.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response2.headers.get('Access-Control-Allow-Headers'),
    });
    
  } catch (error) {
    console.error('❌ Preflight failed:', error.message);
  }
  
  try {
    // Test 3: Authenticated request
    console.log('\n📡 Test 3: Authenticated request');
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const response3 = await fetch(testURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': frontendOrigin,
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors'
      });
      
      console.log('✅ Authenticated request successful:', response3.status);
      const data = await response3.json();
      console.log('Response data:', data);
    } else {
      console.log('⚠️ No JWT token found for authenticated test');
    }
    
  } catch (error) {
    console.error('❌ Authenticated request failed:', error.message);
  }
  
  // Test 4: Check current environment
  console.log('\n🌍 Environment Info:');
  console.log('Current URL:', window.location.href);
  console.log('Frontend Origin:', frontendOrigin);
  console.log('API Base URL:', 'https://api.worldwideadverts.info');
  console.log('User Agent:', navigator.userAgent);
  
  // Test 5: Check localStorage
  console.log('\n💾 LocalStorage:');
  console.log('JWT Token exists:', !!localStorage.getItem('jwt_token'));
  console.log('Refresh Token exists:', !!localStorage.getItem('refresh_token'));
  
  console.log('\n🎯 CORS Diagnosis Complete!');
  console.log('If all tests failed, the backend needs CORS configuration.');
  console.log('If only authenticated tests failed, check JWT token format.');
}

// Alternative: Test with different origins
async function testDifferentOrigins() {
  console.log('\n🔄 Testing with different origins...');
  
  const origins = [
    'https://worldwideadverts.info',
    'https://www.worldwideadverts.info',
    'http://localhost:3000',
    '*'
  ];
  
  for (const origin of origins) {
    try {
      const response = await fetch('https://api.worldwideadverts.info/api/v1/category?is_parent=yes', {
        headers: { 'Origin': origin },
        mode: 'cors'
      });
      console.log(`✅ Origin ${origin}: ${response.status}`);
    } catch (error) {
      console.log(`❌ Origin ${origin}: ${error.message}`);
    }
  }
}

// Export for use in browser console
window.testCORS = testCORS;
window.testDifferentOrigins = testDifferentOrigins;

console.log('🔧 CORS Debug Tools Loaded!');
console.log('Run testCORS() to diagnose CORS issues');
console.log('Run testDifferentOrigins() to test different origins');
