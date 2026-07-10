// Quick API Test to verify endpoints
import affiliateService from './src/services/AffiliateService.js';

console.log('🧪 Testing Affiliate API Endpoints...\n');

// Test 1: Categories
const testCategories = async () => {
  try {
    console.log('Testing GET /api/affiliates/categories...');
    const response = await affiliateService.getCategories();
    console.log('✅ Categories SUCCESS:', response.data?.length || 0, 'categories loaded');
    return true;
  } catch (error) {
    console.log('❌ Categories FAILED:', error.message);
    console.log('   URL attempted:', 'http://localhost:8000/api/affiliates/categories');
    return false;
  }
};

// Test 2: Business Offers
const testBusinessOffers = async () => {
  try {
    console.log('\nTesting GET /api/affiliates/business-offers...');
    const response = await affiliateService.getBusinessOffers();
    console.log('✅ Business Offers SUCCESS:', response.data?.data?.length || 0, 'offers loaded');
    return true;
  } catch (error) {
    console.log('❌ Business Offers FAILED:', error.message);
    console.log('   URL attempted:', 'http://localhost:8000/api/affiliates/business-offers');
    console.log('   Error details:', error.response?.data);
    return false;
  }
};

// Test 3: Direct fetch test
const testDirectFetch = async () => {
  try {
    console.log('\nTesting direct fetch to verify endpoint...');
    const response = await fetch('http://localhost:8000/api/affiliates/categories');
    console.log('Direct fetch status:', response.status);
    const data = await response.json();
    console.log('✅ Direct fetch SUCCESS:', data);
    return true;
  } catch (error) {
    console.log('❌ Direct fetch FAILED:', error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting API Endpoint Tests\n');
  console.log('Expected Base URL: http://localhost:8000/api');
  console.log('Expected endpoints:');
  console.log('  - GET /api/affiliates/categories');
  console.log('  - GET /api/affiliates/business-offers');
  console.log('  - POST /api/affiliates/business-offers');
  console.log('');
  
  const results = {
    categories: await testCategories(),
    businessOffers: await testBusinessOffers(),
    directFetch: await testDirectFetch()
  };
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Categories API: ${results.categories ? '✅ Working' : '❌ Failed'}`);
  console.log(`Business Offers API: ${results.businessOffers ? '✅ Working' : '❌ Failed'}`);
  console.log(`Direct Fetch: ${results.directFetch ? '✅ Working' : '❌ Failed'}`);
  
  if (results.categories && results.businessOffers) {
    console.log('\n🎉 All API endpoints are working correctly!');
  } else {
    console.log('\n❌ Some API endpoints are not working.');
    console.log('💡 Troubleshooting steps:');
    console.log('1. Ensure Laravel backend is running on http://localhost:8000');
    console.log('2. Check if routes are properly registered in routes/api.php');
    console.log('3. Clear browser cache and reload');
    console.log('4. Check browser console for any JavaScript errors');
  }
};

// Export for use in browser console
window.testAffiliateAPIs = runTests;

console.log('🔧 API test function loaded!');
console.log('Run: testAffiliateAPIs() to test all endpoints');

// Auto-run after 1 second
setTimeout(runTests, 1000);
