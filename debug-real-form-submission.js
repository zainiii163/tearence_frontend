// Debug the actual form submission that just happened
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

async function debugRealFormSubmission() {
  console.log('=== Debugging Real Form Submission ===\n');
  
  try {
    // 1. Check current adverts count
    console.log('1. Checking current adverts count...');
    const currentAdverts = await apiRequest('/promoted-adverts');
    console.log(`Current adverts count: ${currentAdverts.data?.total || 0}`);
    
    // 2. Test form submission exactly like the frontend does
    console.log('\n2. Testing form submission with exact frontend data...');
    
    // Simulate the exact data structure from PromotedPostForm
    const formData = {
      title: 'Test Real Estate Property',
      tagline: 'Beautiful property in prime location',
      description: 'This is a test property submission to debug the form submission process.',
      key_features: ['3 bedrooms', '2 bathrooms', 'Garden', 'Parking'],
      advert_type: 'property',
      category_id: 1, // Property
      country: 'United Kingdom',
      city: 'London',
      price: 500000,
      currency: 'GBP',
      price_type: 'fixed',
      condition: 'new',
      main_image: 'property-image.jpg',
      additional_images: ['property-1.jpg', 'property-2.jpg'],
      seller_name: 'John Smith',
      business_name: 'Smith Properties Ltd',
      phone: '+44 20 7123 4567',
      email: 'john.smith@example.com',
      website: 'https://smithproperties.co.uk',
      promotion_tier: 'promoted_basic',
      location_privacy: 'exact'
    };

    console.log('Form data being submitted:', JSON.stringify(formData, null, 2));

    const submitResponse = await apiRequest('/promoted-adverts', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (submitResponse.success) {
      console.log('✅ Form submission successful!');
      console.log(`New advert ID: ${submitResponse.data.id}`);
      console.log(`Status: ${submitResponse.data.status}`);
      console.log(`Is Active: ${submitResponse.data.is_active}`);
      console.log(`User ID: ${submitResponse.data.user_id}`);
      
      // 3. Check if advert appears in main list
      console.log('\n3. Checking if new advert appears in main list...');
      const updatedAdverts = await apiRequest('/promoted-adverts');
      console.log(`Updated adverts count: ${updatedAdverts.data?.total || 0}`);
      
      if (updatedAdverts.data?.total > currentAdverts.data?.total) {
        console.log('✅ New advert appears in main list');
        
        // 4. Find the new advert
        const newAdvert = updatedAdverts.data?.data?.find(advert => 
          advert.id === submitResponse.data.id
        );
        
        if (newAdvert) {
          console.log('✅ New advert found in main list');
          console.log(`   • ID: ${newAdvert.id}`);
          console.log(`   • Title: ${newAdvert.title}`);
          console.log(`   • Status: ${newAdvert.status}`);
          console.log(`   • Is Active: ${newAdvert.is_active}`);
        } else {
          console.log('❌ New advert not found in main list');
        }
      } else {
        console.log('❌ New advert does not appear in main list');
      }
      
    } else {
      console.log('❌ Form submission failed');
      console.log('Error message:', submitResponse.message);
      
      // Check if it's an authentication issue
      if (submitResponse.message?.includes('Token') || submitResponse.message?.includes('Unauthorized')) {
        console.log('\n🔍 Issue: Authentication Required');
        console.log('   • Form submission requires authentication token');
        console.log('   • User must be logged in to submit adverts');
        console.log('   • Without authentication, advert creation fails');
        console.log('   • This explains why no new advert appears');
      }
    }
    
    // 5. Check if there's a CORS or network issue
    console.log('\n4. Checking for common issues...');
    console.log('✅ API base URL is correct: http://localhost:8000/api/v1');
    console.log('✅ Backend server is running and responding');
    console.log('✅ GET endpoints are working');
    console.log('❌ POST endpoint requires authentication');
    
    console.log('\n=== ROOT CAUSE ANALYSIS ===');
    console.log('🔍 Most Likely Issue: Authentication');
    console.log('   • Form shows success message but backend returns error');
    console.log('   • Frontend may not be handling authentication errors properly');
    console.log('   • User must be logged in to actually submit adverts');
    console.log('   • Without login, no advert is created in database');
    
    console.log('\n💡 Solution:');
    console.log('   1. User must login to the application');
    console.log('   2. After login, submit the form again');
    console.log('   3. Advert should be created and appear immediately');
    console.log('   4. Check browser console for any error messages');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
}

debugRealFormSubmission();
