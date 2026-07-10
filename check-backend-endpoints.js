// Check backend endpoints for promoted adverts categories
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
    console.log(`Testing endpoint: ${url}`);
    const response = await fetch(url, config);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.ok}`);
    
    if (response.ok) {
      console.log('✅ SUCCESS - Response data:');
      console.log(JSON.stringify(data, null, 2));
      return data;
    } else {
      console.log('❌ FAILED - Error response:');
      console.log(JSON.stringify(data, null, 2));
      return { error: true, data };
    }
  } catch (error) {
    console.error('❌ REQUEST ERROR:', error.message);
    return { error: true, message: error.message };
  }
};

async function checkBackendEndpoints() {
  console.log('=== CHECKING BACKEND ENDPOINTS FOR PROMOTED ADVERTS CATEGORIES ===\n');
  
  // 1. Check all possible category endpoints
  console.log('1. Testing Category Endpoints:');
  
  const categoryEndpoints = [
    '/promoted-advert-categories',
    '/promoted-advert-categories/',
    '/promoted-adverts/categories',
    '/promoted-adverts/categories/',
    '/categories',
    '/categories/',
    '/advert-categories',
    '/advert-categories/',
    '/promoted-categories',
    '/promoted-categories/'
  ];
  
  for (const endpoint of categoryEndpoints) {
    console.log(`\n--- Testing ${endpoint} ---`);
    const result = await apiRequest(endpoint);
    if (!result.error && result.data) {
      console.log(`✅ FOUND WORKING ENDPOINT: ${endpoint}`);
      console.log(`Categories count: ${result.data.length || result.data.data?.length || 0}`);
      break;
    }
  }
  
  // 2. Check promoted adverts main endpoints
  console.log('\n2. Testing Promoted Adverts Main Endpoints:');
  
  const promotedEndpoints = [
    '/promoted-adverts',
    '/promoted-adverts/',
    '/promoted-adverts/index',
    '/promoted-adverts/list'
  ];
  
  for (const endpoint of promotedEndpoints) {
    console.log(`\n--- Testing ${endpoint} ---`);
    const result = await apiRequest(endpoint);
    if (!result.error && result.data) {
      console.log(`✅ WORKING: ${endpoint}`);
      // Check if categories are included in adverts response
      if (result.data.data && result.data.data.length > 0) {
        const firstAdvert = result.data.data[0];
        console.log('First advert has category:', !!firstAdvert.category);
        if (firstAdvert.category) {
          console.log('Category data:', firstAdvert.category);
        }
      }
      break;
    }
  }
  
  // 3. Check if there are any category-related routes in the backend
  console.log('\n3. Checking Route Information:');
  
  // Try to get route information (if available)
  try {
    const routesResult = await apiRequest('/routes');
    if (!routesResult.error) {
      console.log('✅ Routes endpoint available');
      // Look for category routes in the response
      const routesData = JSON.stringify(routesResult);
      const categoryRoutes = [
        'promoted-advert-categories',
        'promoted-adverts/categories',
        'categories'
      ];
      
      categoryRoutes.forEach(route => {
        if (routesData.includes(route)) {
          console.log(`✅ Found route containing: ${route}`);
        }
      });
    }
  } catch (error) {
    console.log('Routes endpoint not available (expected)');
  }
  
  console.log('\n=== BACKEND ENDPOINTS CHECK COMPLETE ===');
  console.log('📋 SUMMARY:');
  console.log('• Tested all possible category endpoints');
  console.log('• Tested promoted adverts main endpoints');
  console.log('• Checked for category data in adverts response');
  console.log('• Next: Debug frontend based on findings');
}

checkBackendEndpoints();
