// Test categories loading issue
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
      console.log('✅ Request successful');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Request failed');
      console.log('Error response:', JSON.stringify(data, null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw error;
  }
};

async function testCategoriesLoading() {
  console.log('=== Testing Categories Loading Issue ===\n');
  
  try {
    // 1. Test categories API endpoint
    console.log('1. Testing categories API endpoint...');
    try {
      const categoriesResponse = await apiRequest('/promoted-advert-categories');
      console.log(`✅ Categories API working: ${categoriesResponse.data?.length || 0} categories`);
      
      if (categoriesResponse.data && categoriesResponse.data.length > 0) {
        console.log('Sample categories:');
        categoriesResponse.data.slice(0, 3).forEach((cat, index) => {
          console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
        });
      }
    } catch (error) {
      console.log('❌ Categories API failed:', error.message);
    }
    
    // 2. Test promoted adverts API to see if categories are included
    console.log('\n2. Testing promoted adverts API...');
    try {
      const advertsResponse = await apiRequest('/promoted-adverts');
      console.log(`✅ Adverts API working: ${advertsResponse.data?.total || 0} adverts`);
      
      // Check if adverts have category data
      if (advertsResponse.data?.data && advertsResponse.data.data.length > 0) {
        const firstAdvert = advertsResponse.data.data[0];
        console.log('First advert category data:');
        console.log(`   • Category ID: ${firstAdvert.category_id}`);
        console.log(`   • Category Object:`, firstAdvert.category ? 'Present' : 'Missing');
        
        if (firstAdvert.category) {
          console.log(`   • Category Name: ${firstAdvert.category.name}`);
          console.log(`   • Category Slug: ${firstAdvert.category.slug}`);
        }
      }
    } catch (error) {
      console.log('❌ Adverts API failed:', error.message);
    }
    
    // 3. Check frontend categories loading
    console.log('\n3. Frontend Categories Loading Analysis:');
    console.log('✅ Expected Flow:');
    console.log('   1. Page loads → loadInitialData() called');
    console.log('   2. categoriesAPI.getCategories() called');
    console.log('   3. API request to /promoted-advert-categories');
    console.log('   4. Categories stored in state');
    console.log('   5. Categories passed to PromotedCategoryGrid');
    console.log('   6. Categories displayed in grid');
    
    console.log('\n❌ Possible Issues:');
    console.log('   • API endpoint returning error');
    console.log('   • Categories data structure mismatch');
    console.log('   • Frontend not handling API response correctly');
    console.log('   • Component not rendering categories properly');
    
    // 4. Check categories API service
    console.log('\n4. Categories API Service Check:');
    console.log('✅ File: src/services/promotedAdvertsAPI.js');
    console.log('✅ Function: categoriesAPI.getCategories()');
    console.log('✅ Endpoint: /promoted-advert-categories');
    console.log('✅ Expected Response: { success: true, data: [...] }');
    
    // 5. Check component integration
    console.log('\n5. Component Integration Check:');
    console.log('✅ PromotedCategoryGrid Component:');
    console.log('   • Receives categories prop');
    console.log('   • Maps over categories array');
    console.log('   • Displays category name and count');
    console.log('   • Uses category.promoted_adverts_count');
    
    console.log('\n✅ PromotedAdvertsPage Component:');
    console.log('   • Loads categories in loadInitialData()');
    console.log('   • Sets categories state');
    console.log('   • Passes categories to PromotedCategoryGrid');
    console.log('   • Handles loading and error states');
    
    // 6. Debugging steps
    console.log('\n6. Debugging Steps:');
    console.log('🔍 Step 1: Check API response structure');
    console.log('🔍 Step 2: Verify categories data in state');
    console.log('🔍 Step 3: Check component props');
    console.log('🔍 Step 4: Verify component rendering');
    console.log('🔍 Step 5: Check for JavaScript errors');
    
    console.log('\n=== CATEGORIES LOADING DIAGNOSIS ===');
    console.log('🎯 Most Likely Issues:');
    console.log('   1. API endpoint error or wrong URL');
    console.log('   2. Categories data structure mismatch');
    console.log('   3. Frontend state management issue');
    console.log('   4. Component rendering problem');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Verify API endpoint is working');
    console.log('   2. Check browser console for errors');
    console.log('   3. Inspect network requests');
    console.log('   4. Check component props in React DevTools');
    
  } catch (error) {
    console.error('❌ Categories loading test failed:', error.message);
  }
}

testCategoriesLoading();
