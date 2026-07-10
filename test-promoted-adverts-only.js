// Test promoted adverts endpoint specifically
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
    if (response.ok) {
      console.log('Success! Data count:', data.data?.data?.length || data.data?.length || 'N/A');
      if (data.data?.data?.length > 0) {
        console.log('Sample advert:', JSON.stringify(data.data.data[0], null, 2));
      }
    } else {
      console.log('Error response:', JSON.stringify(data, null, 2));
    }
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

async function testPromotedAdverts() {
  console.log('=== Testing Promoted Adverts Endpoints ===\n');
  
  try {
    // Test promoted adverts list
    console.log('1. Testing /promoted-adverts');
    await apiRequest('/promoted-adverts');
    console.log('');
    
    // Test featured adverts
    console.log('2. Testing /promoted-adverts/featured');
    await apiRequest('/promoted-adverts/featured');
    console.log('');
    
    // Test promotion options
    console.log('3. Testing /promoted-adverts/promotion-options');
    await apiRequest('/promoted-adverts/promotion-options');
    console.log('');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPromotedAdverts();
