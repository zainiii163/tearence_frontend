// Test Affiliate System Integration
import affiliateService from './src/services/AffiliateService.js';

const testAffiliateSystem = async () => {
  console.log('🧪 Testing Affiliate System Integration...\n');

  try {
    // Test 1: Get Categories
    console.log('📂 Testing Categories API...');
    const categories = await affiliateService.getCategories();
    console.log('✅ Categories loaded:', categories.data?.length || 0, 'categories');

    // Test 2: Get Business Offers
    console.log('\n💼 Testing Business Offers API...');
    const businessOffers = await affiliateService.getBusinessOffers({ per_page: 5 });
    console.log('✅ Business offers loaded:', businessOffers.data?.data?.length || 0, 'offers');

    // Test 3: Get User Posts
    console.log('\n👤 Testing User Posts API...');
    const userPosts = await affiliateService.getUserPosts({ per_page: 5 });
    console.log('✅ User posts loaded:', userPosts.data?.data?.length || 0, 'posts');

    // Test 4: Test Search
    console.log('\n🔍 Testing Search API...');
    const searchResults = await affiliateService.search('business', 'all');
    console.log('✅ Search results loaded:', 
      Object.keys(searchResults.data || {}).length, 'result types');

    // Test 5: Test Upsell Plans
    console.log('\n💰 Testing Upsell Plans API...');
    const upsellPlans = await affiliateService.getUpsellPlans();
    console.log('✅ Upsell plans loaded:', upsellPlans.data?.length || 0, 'plans');

    console.log('\n🎉 All API tests passed! Affiliate system is working correctly.');
    
    return {
      success: true,
      categories: categories.data?.length || 0,
      businessOffers: businessOffers.data?.data?.length || 0,
      userPosts: userPosts.data?.data?.length || 0,
      searchResults: Object.keys(searchResults.data || {}).length,
      upsellPlans: upsellPlans.data?.length || 0
    };

  } catch (error) {
    console.error('❌ API Test Failed:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

// Test form submission (requires authentication)
const testFormSubmission = async () => {
  console.log('\n📝 Testing Form Submission (requires auth)...');
  
  // Test Business Offer Creation
  const businessData = {
    business_name: 'Test Business',
    product_service_title: 'Test Product',
    tagline: 'Test Tagline',
    affiliate_category_id: 1,
    country: 'United States',
    description: 'Test description for affiliate offer',
    commission_type: 'percentage',
    commission_rate: 10.00,
    cookie_duration: 30,
    allowed_traffic_types: ['social_media', 'email'],
    restrictions: 'Test restrictions',
    tracking_link: 'https://example.com/track',
    promotional_assets: [],
    business_email: 'test@example.com',
    website_url: 'https://example.com'
  };

  try {
    const result = await affiliateService.createBusinessOffer(businessData);
    console.log('✅ Business offer created successfully:', result.data);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Business offer creation failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Export for use in browser console or testing
window.testAffiliateSystem = testAffiliateSystem;
window.testFormSubmission = testFormSubmission;

console.log('🔧 Affiliate system test functions loaded!');
console.log('Run: testAffiliateSystem() to test APIs');
console.log('Run: testFormSubmission() to test form submission (requires login)');
