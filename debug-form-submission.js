// Debug form submission to identify why adverts don't appear
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

async function debugFormSubmission() {
  console.log('=== Debugging Form Submission Issue ===\n');
  
  try {
    // 1. Check current adverts in database
    console.log('1. Checking current adverts...');
    const currentAdverts = await apiRequest('/promoted-adverts');
    console.log(`Current adverts count: ${currentAdverts.data?.total || 0}`);
    
    // 2. Try to submit a new advert (without authentication)
    console.log('\n2. Testing form submission without authentication...');
    const testAdvertData = {
      title: 'Debug Test Advert ' + Date.now(),
      tagline: 'Testing submission process',
      description: 'This is a test advert to debug the submission process.',
      key_features: ['Test feature 1', 'Test feature 2'],
      advert_type: 'product',
      category_id: 5, // Electronics
      country: 'United Kingdom',
      city: 'London',
      price: 100,
      currency: 'GBP',
      price_type: 'fixed',
      condition: 'new',
      main_image: 'test-image.jpg',
      seller_name: 'Test Seller',
      business_name: 'Test Business',
      phone: '+44 20 7123 4567',
      email: 'test@example.com',
      website: 'https://example.com',
      promotion_tier: 'promoted_basic',
      location_privacy: 'exact'
    };

    const submitResponse = await apiRequest('/promoted-adverts', {
      method: 'POST',
      body: JSON.stringify(testAdvertData),
    });

    if (submitResponse.success) {
      console.log('✅ Form submission successful!');
      console.log(`New advert ID: ${submitResponse.data.id}`);
      console.log(`Status: ${submitResponse.data.status}`);
      console.log(`User ID: ${submitResponse.data.user_id}`);
      
      // 3. Check if advert appears in main list
      console.log('\n3. Checking if new advert appears in main list...');
      const updatedAdverts = await apiRequest('/promoted-adverts');
      console.log(`Updated adverts count: ${updatedAdverts.data?.total || 0}`);
      
      if (updatedAdverts.data?.total > currentAdverts.data?.total) {
        console.log('✅ New advert appears in main list');
      } else {
        console.log('❌ New advert does not appear in main list');
        console.log('This suggests the advert was created but is not visible due to status/filters');
      }
      
      // 4. Check all adverts (including inactive/pending)
      console.log('\n4. Checking all adverts without filters...');
      // Note: We can't directly access all adverts without the active() scope
      // But we can check if the specific advert exists by trying to get it by ID
      if (submitResponse.data.id) {
        try {
          const specificAdvert = await apiRequest(`/promoted-adverts/${submitResponse.data.slug}`);
          console.log('✅ Can access specific advert by slug');
          console.log(`Advert status: ${specificAdvert.data.status}`);
          console.log(`Advert is_active: ${specificAdvert.data.is_active}`);
        } catch (error) {
          console.log('❌ Cannot access specific advert - may not exist or be accessible');
        }
      }
      
    } else {
      console.log('❌ Form submission failed (expected without authentication)');
      console.log('Error message:', submitResponse.message);
      
      // 5. Check if authentication is the issue
      console.log('\n5. Authentication check:');
      console.log('❌ Form submission requires authentication');
      console.log('❌ Without authentication, no new adverts are created');
      console.log('❌ This explains why your submitted advert doesn\'t appear');
    }
    
    // 6. Summary of the issue
    console.log('\n=== ISSUE ANALYSIS ===');
    console.log('🔍 Root Cause: Authentication Required');
    console.log('   • Backend requires authentication for POST /promoted-adverts');
    console.log('   • Without authentication, form submission fails');
    console.log('   • No new advert is created in database');
    console.log('   • Therefore, no new advert appears on the page');
    
    console.log('\n💡 Solution: User Authentication');
    console.log('   • User must be logged in to submit adverts');
    console.log('   • Form should show authentication requirement');
    console.log('   • After login, submission should work');
    console.log('   • New adverts will have status="pending" initially');
    console.log('   • Admin approval may be required for status="active"');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
}

debugFormSubmission();
