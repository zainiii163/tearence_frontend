// Test simple API endpoints
const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiRequest = async (endpoint) => {
  try {
    console.log(`Testing: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

async function testSimpleEndpoints() {
  console.log('=== Testing Simple Endpoints ===\n');
  
  try {
    // Test basic promoted adverts list
    console.log('1. Testing /promoted-adverts');
    await apiRequest('/promoted-adverts');
    console.log('');
    
    // Test promotion options
    console.log('2. Testing /promoted-adverts/promotion-options');
    await apiRequest('/promoted-adverts/promotion-options');
    console.log('');
    
    // Test categories
    console.log('3. Testing /promoted-advert-categories');
    await apiRequest('/promoted-advert-categories');
    console.log('');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSimpleEndpoints();
