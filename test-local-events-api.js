// Test file to verify local events API integration
import axios from 'axios';

// Create local API instance for testing
const localApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

const testLocalEventsApi = async () => {
  console.log('🧪 Testing Local Events API...');
  
  try {
    // Test 1: Get all events
    console.log('1. Testing GET /api/events...');
    const eventsResponse = await localApi.get('/events');
    console.log('✅ Events Response:', eventsResponse.data);
    console.log('📊 Events Count:', eventsResponse.data.data?.length || 0);
    
    // Test 2: Get featured events
    console.log('2. Testing GET /api/events/featured...');
    const featuredResponse = await localApi.get('/events/featured');
    console.log('✅ Featured Events Response:', featuredResponse.data);
    console.log('📊 Featured Events Count:', featuredResponse.data.data?.length || 0);
    
    // Test 3: Get event categories
    console.log('3. Testing GET /api/events/categories...');
    const categoriesResponse = await localApi.get('/events/categories');
    console.log('✅ Categories Response:', categoriesResponse.data);
    
    // Test 4: Test event creation (without auth)
    console.log('4. Testing POST /api/events (should fail without auth)...');
    try {
      const testEventData = {
        title: 'Test Event',
        category: 'concert',
        date_time: '2024-12-31T20:00:00',
        country: 'United States',
        city: 'New York',
        venue_name: 'Test Venue',
        price_type: 'free',
        description: 'This is a test event',
        contact_email: 'test@example.com'
      };
      
      const createResponse = await localApi.post('/events', testEventData);
      console.log('✅ Event Creation Response:', createResponse.data);
    } catch (createError) {
      console.log('ℹ️ Event Creation Failed (Expected without auth):', createError.response?.status);
    }
    
    console.log('🎉 Local API tests completed!');
    
    // Test data structure
    if (eventsResponse.data.data && eventsResponse.data.data.length > 0) {
      const sampleEvent = eventsResponse.data.data[0];
      console.log('📋 Sample Event Structure:', {
        id: sampleEvent.id,
        title: sampleEvent.title,
        category: sampleEvent.category,
        date_time: sampleEvent.date_time,
        venue_name: sampleEvent.venue_name,
        price_type: sampleEvent.price_type,
        ticket_price: sampleEvent.ticket_price,
        promotion_tier: sampleEvent.promotion_tier,
        images: sampleEvent.images,
        slug: sampleEvent.slug
      });
    }
    
  } catch (error) {
    console.error('❌ Local API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🔥 Backend server not running. Please start: php artisan serve');
    } else if (error.response) {
      console.error('📄 Server Response Error:', error.response.status, error.response.data);
    }
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testLocalEventsApi;
} else {
  window.testLocalEventsApi = testLocalEventsApi;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 Running local API test...');
  testLocalEventsApi();
}
