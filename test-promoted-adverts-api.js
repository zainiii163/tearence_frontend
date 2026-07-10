// Test promoted adverts API endpoint
const API_BASE_URL = 'http://localhost:8000/api/v1';

const testPromotedAdvertsAPI = async () => {
  console.log('=== TESTING PROMOTED ADVERTS API ===\n');
  
  try {
    // Test basic promoted adverts endpoint
    console.log('1. Testing /promoted-adverts endpoint...');
    
    const response = await fetch(`${API_BASE_URL}/promoted-adverts`, {
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
      console.log('✅ SUCCESS - Adverts loaded:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.success && data.data) {
        console.log(`\n📊 Adverts Summary:`);
        console.log(`• Total adverts: ${data.data.total || 0}`);
        console.log(`• Current page: ${data.data.current_page || 1}`);
        console.log(`• Per page: ${data.data.per_page || 12}`);
        console.log(`• Last page: ${data.data.last_page || 1}`);
        console.log(`• Data array length: ${data.data.data?.length || 0}`);
        
        if (data.data.data && data.data.data.length > 0) {
          console.log(`\n📝 Sample advert:`);
          console.log(JSON.stringify(data.data.data[0], null, 2));
        }
        
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

testPromotedAdvertsAPI();
