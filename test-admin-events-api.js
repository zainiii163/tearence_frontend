// Test file to verify admin events API integration
import axios from 'axios';

// Create local API instance for testing admin endpoints
const adminApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/admin/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

const testAdminEventsApi = async () => {
  console.log('🧪 Testing Admin Events API...');
  
  try {
    // Test 1: Get events dashboard
    console.log('1. Testing GET /admin/api/events/dashboard...');
    const dashboardResponse = await adminApi.get('/events/dashboard');
    console.log('✅ Dashboard Response:', dashboardResponse.data);
    
    // Test 2: Get all events (admin)
    console.log('2. Testing GET /admin/api/events...');
    const eventsResponse = await adminApi.get('/events');
    console.log('✅ Events Response:', eventsResponse.data);
    console.log('📊 Events Count:', eventsResponse.data.data?.total || 0);
    
    // Test 3: Get events analytics
    console.log('3. Testing GET /admin/api/events/analytics...');
    const analyticsResponse = await adminApi.get('/events/analytics');
    console.log('✅ Analytics Response:', analyticsResponse.data);
    
    // Test 4: Get events categories (admin)
    console.log('4. Testing GET /admin/api/events/categories...');
    const categoriesResponse = await adminApi.get('/events/categories');
    console.log('✅ Categories Response:', categoriesResponse.data);
    
    // Test 5: Get venues dashboard
    console.log('5. Testing GET /admin/api/events/venues/dashboard...');
    const venuesDashboardResponse = await adminApi.get('/events/venues/dashboard');
    console.log('✅ Venues Dashboard Response:', venuesDashboardResponse.data);
    
    // Test 6: Get all venues (admin)
    console.log('6. Testing GET /admin/api/events/venues...');
    const venuesResponse = await adminApi.get('/events/venues');
    console.log('✅ Venues Response:', venuesResponse.data);
    console.log('📊 Venues Count:', venuesResponse.data.data?.total || 0);
    
    // Test 7: Test event creation (without auth - should fail)
    console.log('7. Testing POST /admin/api/events (should fail without auth)...');
    try {
      const testEventData = {
        title: 'Admin Test Event',
        category: 'concert',
        date_time: '2024-12-31T20:00:00',
        country: 'United States',
        city: 'New York',
        venue_name: 'Test Venue',
        price_type: 'free',
        description: 'This is a test event created by admin',
        contact_email: 'admin@test.com'
      };
      
      const createResponse = await adminApi.post('/events', testEventData);
      console.log('ℹ️ Event Creation Response (unexpected):', createResponse.data);
    } catch (createError) {
      console.log('ℹ️ Event Creation Failed (Expected without auth):', createError.response?.status);
    }
    
    // Test 8: Test bulk operations
    console.log('8. Testing POST /admin/api/events/bulk-update...');
    try {
      const bulkUpdateResponse = await adminApi.post('/events/bulk-update', {
        event_ids: [1, 2, 3],
        updates: { is_active: true }
      });
      console.log('✅ Bulk Update Response:', bulkUpdateResponse.data);
    } catch (bulkError) {
      console.log('ℹ️ Bulk Update Failed (Expected without data):', bulkError.response?.status);
    }
    
    // Test 9: Test export functionality
    console.log('9. Testing GET /admin/api/events/export...');
    const exportResponse = await adminApi.get('/events/export');
    console.log('✅ Export Response:', exportResponse.data);
    
    // Test 10: Test reports
    console.log('10. Testing GET /admin/api/events/reports...');
    const reportsResponse = await adminApi.get('/events/reports');
    console.log('✅ Reports Response:', reportsResponse.data);
    
    console.log('🎉 Admin Events API tests completed!');
    
    // Test data structure verification
    if (eventsResponse.data.data && eventsResponse.data.data.data) {
      const sampleEvent = eventsResponse.data.data.data[0];
      if (sampleEvent) {
        console.log('📋 Sample Admin Event Structure:', {
          id: sampleEvent.id,
          title: sampleEvent.title,
          category: sampleEvent.category,
          date_time: sampleEvent.date_time,
          venue_name: sampleEvent.venue_name,
          price_type: sampleEvent.price_type,
          ticket_price: sampleEvent.ticket_price,
          promotion_tier: sampleEvent.promotion_tier,
          is_active: sampleEvent.is_active,
          user: sampleEvent.user,
          venue: sampleEvent.venue,
          created_at: sampleEvent.created_at
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Admin Events API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🔥 Backend server not running. Please start: php artisan serve');
    } else if (error.response) {
      console.error('📄 Server Response Error:', error.response.status, error.response.data);
    }
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testAdminEventsApi;
} else {
  window.testAdminEventsApi = testAdminEventsApi;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 Running admin events API test...');
  testAdminEventsApi();
}
