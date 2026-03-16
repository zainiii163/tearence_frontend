// Test script to verify Affiliates Hub backend integration
import affiliateService from './src/services/AffiliateService';
import { apiUtils } from './src/api';

const testBackendIntegration = async () => {
  console.log('🧪 Testing Affiliates Hub Backend Integration...');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const runTest = async (name, testFn) => {
    try {
      console.log(`\n📋 Running: ${name}`);
      const result = await testFn();
      console.log(`✅ PASSED: ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'PASSED', result });
      return true;
    } catch (error) {
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error.message}`);
      results.failed++;
      results.tests.push({ name, status: 'FAILED', error: error.message });
      return false;
    }
  };

  // Test 1: Categories
  await runTest('Get Categories', async () => {
    const response = await affiliateService.getCategories();
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Categories response is not an array');
    }
    return response.data;
  });

  // Test 2: Business Offers
  await runTest('Get Business Offers', async () => {
    const response = await affiliateService.getBusinessOffers({ per_page: 5 });
    if (!response.data || !response.data.data) {
      throw new Error('Business offers response missing data');
    }
    return response.data.data;
  });

  // Test 3: Single Business Offer
  await runTest('Get Single Business Offer', async () => {
    const offers = await affiliateService.getBusinessOffers({ per_page: 1 });
    if (!offers.data.data.length) {
      throw new Error('No business offers found for single test');
    }
    const offerId = offers.data.data[0].id;
    const singleOffer = await affiliateService.getBusinessOffer(offerId);
    if (!singleOffer.data || !singleOffer.data.id) {
      throw new Error('Single business offer response invalid');
    }
    return singleOffer.data;
  });

  // Test 4: User Posts
  await runTest('Get User Posts', async () => {
    const response = await affiliateService.getUserPosts({ per_page: 5 });
    if (!response.data || !response.data.data) {
      throw new Error('User posts response missing data');
    }
    return response.data.data;
  });

  // Test 5: Single User Post
  await runTest('Get Single User Post', async () => {
    const posts = await affiliateService.getUserPosts({ per_page: 1 });
    if (!posts.data.data.length) {
      throw new Error('No user posts found for single test');
    }
    const postId = posts.data.data[0].id;
    const singlePost = await affiliateService.getUserPost(postId);
    if (!singlePost.data || !singlePost.data.id) {
      throw new Error('Single user post response invalid');
    }
    return singlePost.data;
  });

  // Test 6: Search Functionality
  await runTest('Search Affiliate Content', async () => {
    const response = await affiliateService.searchAffiliateContent('technology', 'all');
    if (!response.data || (!response.data.business_offers && !response.data.user_posts)) {
      throw new Error('Search response missing expected fields');
    }
    return response.data;
  });

  // Test 7: Upsell Plans
  await runTest('Get Upsell Plans', async () => {
    const response = await affiliateService.getUpsellPlans();
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Upsell plans response is not an array');
    }
    return response.data;
  });

  // Test 8: Platform Stats
  await runTest('Get Platform Stats', async () => {
    const response = await affiliateService.getPlatformStats();
    if (!response.data) {
      throw new Error('Platform stats response missing data');
    }
    return response.data;
  });

  // Test 9: Click Tracking
  await runTest('Track Click', async () => {
    const response = await affiliateService.trackClick('business', 1);
    if (!response.data || !response.data.success) {
      throw new Error('Click tracking response invalid');
    }
    return response.data;
  });

  // Test 10: Featured Content
  await runTest('Get Featured Content', async () => {
    const response = await affiliateService.getFeaturedContent('all', 5);
    if (!response.data) {
      throw new Error('Featured content response missing data');
    }
    return response.data;
  });

  // Test 11: Trending Content
  await runTest('Get Trending Content', async () => {
    const response = await affiliateService.getTrendingContent('all', '7days', 5);
    if (!response.data) {
      throw new Error('Trending content response missing data');
    }
    return response.data;
  });

  // Test 12: Location-based Content
  await runTest('Get Content by Location', async () => {
    const response = await affiliateService.getContentByLocation('United States');
    if (!response.data) {
      throw new Error('Location-based content response missing data');
    }
    return response.data;
  });

  // Test 13: Analytics Summary
  await runTest('Get Analytics Summary', async () => {
    const response = await affiliateService.getAnalyticsSummary('all', '30days');
    if (!response.data) {
      throw new Error('Analytics summary response missing data');
    }
    return response.data;
  });

  // Test 14: API Utilities
  await runTest('API Utilities - Pagination Helper', async () => {
    const mockResponse = {
      data: {
        data: [{ id: 1 }, { id: 2 }],
        current_page: 1,
        last_page: 3,
        total: 6,
        per_page: 2
      }
    };
    const paginated = apiUtils.handlePaginatedResponse(mockResponse);
    if (!paginated.items || paginated.items.length !== 2) {
      throw new Error('Pagination helper not working correctly');
    }
    return paginated;
  });

  // Test 15: API Utilities - Error Formatting
  await runTest('API Utilities - Error Formatting', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Test error',
          errors: {
            field1: ['Error 1'],
            field2: ['Error 2']
          }
        }
      }
    };
    const formattedError = apiUtils.formatError(mockError);
    if (!formattedError.includes('Error 1') || !formattedError.includes('Error 2')) {
      throw new Error('Error formatting not working correctly');
    }
    return formattedError;
  });

  // Results Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests.filter(test => test.status === 'FAILED').forEach(test => {
      console.log(`   - ${test.name}: ${test.error}`);
    });
  }

  if (results.passed === results.tests.length) {
    console.log('\n🎉 All backend integration tests passed!');
    console.log('✅ Affiliates Hub backend is properly integrated');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }

  return {
    total: results.tests.length,
    passed: results.passed,
    failed: results.failed,
    successRate: ((results.passed / (results.passed + results.failed)) * 100).toFixed(1),
    tests: results.tests
  };
};

// Export for use in browser console or as module
if (typeof window !== 'undefined') {
  window.testAffiliatesBackend = testBackendIntegration;
  console.log('💡 Run testAffiliatesBackend() in browser console to test backend integration');
}

export default testBackendIntegration;
