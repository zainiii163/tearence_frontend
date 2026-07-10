// Test categories endpoint directly
const API_BASE_URL = 'http://localhost:8000/api/v1';

const testCategoriesEndpoint = async () => {
  console.log('=== TESTING CATEGORIES ENDPOINT DIRECTLY ===\n');
  
  try {
    // Test the exact endpoint the frontend is using
    console.log('1. Testing /promoted-advert-categories endpoint...');
    
    const response = await fetch(`${API_BASE_URL}/promoted-advert-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS - Categories loaded:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.success && data.data) {
        console.log(`\n📊 Categories Summary:`);
        console.log(`• Total categories: ${data.data.length}`);
        console.log(`• Sample category: ${data.data[0]?.name || 'N/A'}`);
        console.log(`• All categories: ${data.data.map(c => c.name).join(', ')}`);
        
        return data;
      } else {
        console.log('❌ Invalid response format');
        return null;
      }
    } else {
      const errorData = await response.json();
      console.log('❌ FAILED - Error response:');
      console.log(JSON.stringify(errorData, null, 2));
      return null;
    }
  } catch (error) {
    console.error('❌ REQUEST ERROR:', error.message);
    return null;
  }
};

testCategoriesEndpoint();
