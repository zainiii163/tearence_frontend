// Test Promoted Adverts API Integration - Fixed
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Test API endpoints
async function testPromotedAPI() {
  console.log('=== Testing Promoted Adverts API Integration ===\n');

  try {
    // Test 1: Get promotion options
    console.log('1. Testing promotion options endpoint...');
    const promotionOptions = await apiRequest('/promoted-adverts/promotion-options');
    console.log('✅ Promotion Options:', JSON.stringify(promotionOptions, null, 2));
    console.log('');

    // Test 2: Get all promoted adverts
    console.log('2. Testing get adverts endpoint...');
    const adverts = await apiRequest('/promoted-adverts');
    console.log('✅ Adverts Response:', JSON.stringify(adverts, null, 2));
    console.log('');

    // Test 3: Get featured adverts
    console.log('3. Testing featured adverts endpoint...');
    const featured = await apiRequest('/promoted-adverts/featured');
    console.log('✅ Featured Adverts:', JSON.stringify(featured, null, 2));
    console.log('');

    // Test 4: Get categories
    console.log('4. Testing categories endpoint...');
    const categories = await apiRequest('/promoted-advert-categories');
    console.log('✅ Categories:', JSON.stringify(categories, null, 2));
    console.log('');

    console.log('=== API Tests Completed Successfully ===');

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testPromotedAPI();
