import React from 'react';
import resortsTravelApi from '../services/resortsTravelAPI';

// Test component for Resorts & Travel API integration
const TravelApiTest = () => {
  const [testResults, setTestResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const addTestResult = (testName, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      testName,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    // Test 1: Get featured adverts
    try {
      const result = await resortsTravelApi.getFeaturedAdverts({ per_page: 3 });
      addTestResult('Get Featured Adverts', true, `Successfully fetched ${result.data?.length || 0} featured adverts`, result);
    } catch (error) {
      addTestResult('Get Featured Adverts', false, error.message);
    }

    // Test 2: Get categories
    try {
      const result = await resortsTravelApi.getCategories();
      addTestResult('Get Categories', true, `Successfully fetched ${result.data?.length || 0} categories`, result);
    } catch (error) {
      addTestResult('Get Categories', false, error.message);
    }

    // Test 3: Get advert types
    try {
      const result = await resortsTravelApi.getAdvertTypes();
      addTestResult('Get Advert Types', true, `Successfully fetched advert types`, result);
    } catch (error) {
      addTestResult('Get Advert Types', false, error.message);
    }

    // Test 4: Get amenities
    try {
      const result = await resortsTravelApi.getAmenities();
      addTestResult('Get Amenities', true, `Successfully fetched amenities`, result);
    } catch (error) {
      addTestResult('Get Amenities', false, error.message);
    }

    // Test 5: Get promotion tiers
    try {
      const result = await resortsTravelApi.getPromotionTiers();
      addTestResult('Get Promotion Tiers', true, `Successfully fetched promotion tiers`, result);
    } catch (error) {
      addTestResult('Get Promotion Tiers', false, error.message);
    }

    // Test 6: Get all adverts with filters
    try {
      const result = await resortsTravelApi.getTravelAdverts({
        per_page: 5,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      addTestResult('Get All Adverts', true, `Successfully fetched ${result.data?.length || 0} adverts`, result);
    } catch (error) {
      addTestResult('Get All Adverts', false, error.message);
    }

    // Test 7: Get category types
    try {
      const result = await resortsTravelApi.getCategoryTypes();
      addTestResult('Get Category Types', true, `Successfully fetched category types`, result);
    } catch (error) {
      addTestResult('Get Category Types', false, error.message);
    }

    // Test 8: Get popular categories
    try {
      const result = await resortsTravelApi.getPopularCategories();
      addTestResult('Get Popular Categories', true, `Successfully fetched popular categories`, result);
    } catch (error) {
      addTestResult('Get Popular Categories', false, error.message);
    }

    // Test 9: Search functionality
    try {
      const result = await resortsTravelApi.getTravelAdverts({
        search: 'dubai',
        per_page: 3
      });
      addTestResult('Search Adverts', true, `Successfully searched for 'dubai', found ${result.data?.length || 0} results`, result);
    } catch (error) {
      addTestResult('Search Adverts', false, error.message);
    }

    // Test 10: Filter by country
    try {
      const result = await resortsTravelApi.getTravelAdverts({
        country: 'UAE',
        per_page: 3
      });
      addTestResult('Filter by Country', true, `Successfully filtered by UAE, found ${result.data?.length || 0} results`, result);
    } catch (error) {
      addTestResult('Filter by Country', false, error.message);
    }

    // Test 11: Filter by price range
    try {
      const result = await resortsTravelApi.getTravelAdverts({
        price_min: 100,
        price_max: 500,
        per_page: 3
      });
      addTestResult('Filter by Price Range', true, `Successfully filtered by price $100-$500, found ${result.data?.length || 0} results`, result);
    } catch (error) {
      addTestResult('Filter by Price Range', false, error.message);
    }

    // Test 12: Get trending destinations
    try {
      const result = await resortsTravelApi.getTrendingDestinations({ per_page: 5 });
      addTestResult('Get Trending Destinations', true, `Successfully fetched ${result.data?.length || 0} trending destinations`, result);
    } catch (error) {
      addTestResult('Get Trending Destinations', false, error.message);
    }

    // Test 13: Get nearby adverts
    try {
      const result = await resortsTravelApi.getNearbyAdverts(25.2048, 55.2708, 50, { per_page: 3 });
      addTestResult('Get Nearby Adverts', true, `Successfully fetched ${result.data?.length || 0} nearby adverts`, result);
    } catch (error) {
      addTestResult('Get Nearby Adverts', false, error.message);
    }

    // Test 14: Get availability
    try {
      const result = await resortsTravelApi.getAvailability(1, {
        start_date: '2024-06-01',
        end_date: '2024-06-05'
      });
      addTestResult('Get Availability', true, 'Successfully fetched availability data', result);
    } catch (error) {
      addTestResult('Get Availability', false, error.message);
    }

    // Test 15: Check availability pricing
    try {
      const result = await resortsTravelApi.checkAvailabilityPricing(1, {
        start_date: '2024-06-01',
        end_date: '2024-06-05',
        guests: 2
      });
      addTestResult('Check Availability Pricing', true, 'Successfully checked availability and pricing', result);
    } catch (error) {
      addTestResult('Check Availability Pricing', false, error.message);
    }

    // Test 16: Get reviews
    try {
      const result = await resortsTravelApi.getReviews(1, { per_page: 5 });
      addTestResult('Get Reviews', true, `Successfully fetched ${result.data?.length || 0} reviews`, result);
    } catch (error) {
      addTestResult('Get Reviews', false, error.message);
    }

    // Test 17: Get statistics (admin only - might fail without proper auth)
    try {
      const result = await resortsTravelApi.getStatistics();
      addTestResult('Get Statistics', true, 'Successfully fetched travel statistics', result);
    } catch (error) {
      addTestResult('Get Statistics', false, error.message);
    }

    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="page-container p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resorts & Travel API Integration Test</h2>
        <p className="text-gray-600">Test the Resorts & Travel API endpoints to verify integration</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={runTests}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </button>
        <button
          onClick={clearResults}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
          
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      result.success ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <h4 className="font-semibold text-gray-900">{result.testName}</h4>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <p className={`text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Tests:</span>
                <span className="ml-2 font-semibold">{testResults.length}</span>
              </div>
              <div>
                <span className="text-green-700">Passed:</span>
                <span className="ml-2 font-semibold">
                  {testResults.filter(r => r.success).length}
                </span>
              </div>
              <div>
                <span className="text-red-700">Failed:</span>
                <span className="ml-2 font-semibold">
                  {testResults.filter(r => !r.success).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && testResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Click "Run All Tests" to test the Resorts & Travel API integration</p>
        </div>
      )}
    </div>
  );
};

export default TravelApiTest;
