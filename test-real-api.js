// Test the exact API call that the frontend makes
const API_BASE_URL = 'http://localhost:8000/api/v1';

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

    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.ok}`);
    
    if (response.ok) {
      console.log('Response structure:', {
        success: data.success,
        hasData: !!data.data,
        dataKeys: data.data ? Object.keys(data.data) : 'none',
        total: data.data?.total,
        current_page: data.data?.current_page,
        dataLength: data.data?.data?.length
      });
      
      if (data.data?.data?.length > 0) {
        console.log('Sample advert:', JSON.stringify(data.data.data[0], null, 2));
      }
    } else {
      console.log('Error response:', JSON.stringify(data, null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw error;
  }
};

async function testRealAPI() {
  console.log('=== Testing Real API Calls ===\n');
  
  try {
    // Test the exact call the frontend makes
    console.log('1. Testing getAdverts with pagination...');
    const params = {
      page: 1,
      per_page: 12,
      sort_by: 'created_at',
      sort_order: 'desc',
    };
    
    const queryString = new URLSearchParams(params).toString();
    const advertsResponse = await apiRequest(`/promoted-adverts?${queryString}`);
    console.log('');
    
    // Test categories
    console.log('2. Testing categories...');
    const categoriesResponse = await apiRequest('/promoted-advert-categories');
    console.log('');
    
    // Test featured
    console.log('3. Testing featured adverts...');
    const featuredResponse = await apiRequest('/promoted-adverts/featured');
    console.log('');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testRealAPI();
