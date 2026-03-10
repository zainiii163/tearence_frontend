// Test script to verify Services Marketplace API integration
// Run this script in the browser console to test API connections

// Test Services API endpoints
const testServicesApi = async () => {
  console.log('🧪 Testing Services Marketplace API Integration...');
  
  try {
    // Test 1: Get categories
    console.log('📂 Test 1: Getting categories...');
    const categories = await servicesApi.getCategories();
    console.log('✅ Categories loaded:', categories);
    
    // Test 2: Get services
    console.log('📂 Test 2: Getting services...');
    const services = await servicesApi.getServices({
      page: 1,
      per_page: 10
    });
    console.log('✅ Services loaded:', services);
    
    // Test 3: Get featured services
    console.log('📂 Test 3: Getting featured services...');
    const featuredServices = await servicesApi.getFeaturedServices({ limit: 5 });
    console.log('✅ Featured services loaded:', featuredServices);
    
    // Test 4: Get popular services
    console.log('📂 Test 4: Getting popular services...');
    const popularServices = await servicesApi.getPopularServices({ limit: 5 });
    console.log('✅ Popular services loaded:', popularServices);
    
    // Test 5: Create service (mock data)
    console.log('📂 Test 5: Creating test service...');
    const testService = {
      title: 'Test Service',
      serviceType: 'freelance',
      category: 'Web Development',
      description: 'This is a test service for API integration testing',
      startingPrice: 99,
      country: 'US',
      termsAccepted: true,
      accurateInfo: true
    };
    
    try {
      const createdService = await servicesApi.createService(testService);
      console.log('✅ Test service created:', createdService);
    } catch (error) {
      console.error('❌ Error creating test service:', error);
    }
    
    // Test 6: Save draft
    console.log('📂 Test 6: Saving draft...');
    try {
      const draftResponse = await servicesApi.saveDraft(testService);
      console.log('✅ Draft saved:', draftResponse);
    } catch (error) {
      console.error('❌ Error saving draft:', error);
    }
    
    console.log('🎉 All API tests completed!');
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
};

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  testServicesApi();
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testServicesApi };
}
