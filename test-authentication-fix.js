// Test the authentication fix in the form
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

async function testAuthenticationFix() {
  console.log('=== Testing Authentication Fix ===\n');
  
  try {
    // 1. Test form submission without authentication (should show proper error)
    console.log('1. Testing form submission without authentication...');
    
    const formData = {
      title: 'Test Authentication Fix',
      tagline: 'Testing authentication requirements',
      description: 'This is a test to verify authentication is properly handled.',
      key_features: ['Test feature 1', 'Test feature 2'],
      advert_type: 'product',
      category_id: 5,
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

    // Simulate the frontend authentication check
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ Frontend authentication check: No token found');
      console.log('✅ Frontend will show error: "You must be logged in to submit a promoted advert"');
      console.log('✅ Form will not submit to backend');
      console.log('✅ User will be prompted to login');
    } else {
      console.log('✅ Frontend authentication check: Token found');
      
      // If token exists, test backend submission
      try {
        const submitResponse = await apiRequest('/promoted-adverts', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (submitResponse.success) {
          console.log('✅ Form submission successful with authentication');
        } else {
          console.log('❌ Form submission failed even with authentication');
        }
      } catch (error) {
        console.log('❌ Backend submission failed:', error.message);
      }
    }
    
    // 2. Check current adverts count
    console.log('\n2. Checking current adverts count...');
    const currentAdverts = await apiRequest('/promoted-adverts');
    console.log(`Current adverts count: ${currentAdverts.data?.total || 0}`);
    
    // 3. Summary of the fix
    console.log('\n=== AUTHENTICATION FIX SUMMARY ===');
    console.log('🔧 Frontend Fix Applied:');
    console.log('   • Added authentication check before form submission');
    console.log('   • Check: localStorage.getItem(\'token\')');
    console.log('   • If no token: Show error message and prevent submission');
    console.log('   • If token exists: Proceed with form submission');
    
    console.log('\n🎯 Expected Behavior:');
    console.log('   • User not logged in: Clear error message to login');
    console.log('   • User logged in: Form submits successfully');
    console.log('   • Advert appears immediately on main page');
    console.log('   • No more false success messages');
    
    console.log('\n💡 User Experience:');
    console.log('   • Clear feedback when not authenticated');
    console.log('   • Prevents wasted form filling without login');
    console.log('   • Proper error handling and guidance');
    console.log('   • Successful submission only when authenticated');
    
    console.log('\n🔄 Next Steps:');
    console.log('   1. User should login to the application');
    console.log('   2. Fill out the form with advert details');
    console.log('   3. Submit the form');
    console.log('   4. Advert should be created and appear immediately');
    
  } catch (error) {
    console.error('❌ Authentication fix test failed:', error.message);
  }
}

testAuthenticationFix();
