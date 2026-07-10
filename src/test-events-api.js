// Test file to verify events API integration
import eventsApi from './services/eventsApi';

// Test the API endpoints
const testEventsApi = async () => {
  console.log('Testing Events API...');
  
  try {
    // Test 1: Get all events
    console.log('1. Testing getEvents()...');
    const allEvents = await eventsApi.getEvents();
    console.log('✅ getEvents() success:', allEvents);
    
    // Test 2: Get featured events
    console.log('2. Testing getFeaturedEvents()...');
    const featuredEvents = await eventsApi.getFeaturedEvents();
    console.log('✅ getFeaturedEvents() success:', featuredEvents);
    
    // Test 3: Get event categories
    console.log('3. Testing getEventCategories()...');
    const categories = await eventsApi.getEventCategories();
    console.log('✅ getEventCategories() success:', categories);
    
    // Test 4: Test data validation
    console.log('4. Testing data validation...');
    const testData = {
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
    
    const validation = eventsApi.validateEventData(testData);
    console.log('✅ Validation result:', validation);
    
    // Test 5: Test data formatting
    console.log('5. Testing data formatting...');
    const formattedData = eventsApi.formatEventData(testData);
    console.log('✅ Formatted data:', formattedData);
    
    console.log('🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
};

// Export for use in browser console or component
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testEventsApi;
} else {
  window.testEventsApi = testEventsApi;
}
