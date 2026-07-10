// Comprehensive test for events integration
import eventsApi from './services/eventsApi';

const EventsIntegrationTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runIntegrationTest = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Get all events
      console.log('🧪 Testing getEvents()...');
      const eventsResponse = await eventsApi.getEvents();
      results.events = {
        success: true,
        data: eventsResponse,
        count: eventsResponse.data?.length || 0,
        sampleEvent: eventsResponse.data?.[0] || null
      };
      console.log('✅ getEvents() success:', results.events);

      // Test 2: Get featured events
      console.log('🧪 Testing getFeaturedEvents()...');
      const featuredResponse = await eventsApi.getFeaturedEvents();
      results.featured = {
        success: true,
        data: featuredResponse,
        count: featuredResponse.data?.length || 0,
        sampleEvent: featuredResponse.data?.[0] || null
      };
      console.log('✅ getFeaturedEvents() success:', results.featured);

      // Test 3: Get categories
      console.log('🧪 Testing getEventCategories()...');
      const categoriesResponse = await eventsApi.getEventCategories();
      results.categories = {
        success: true,
        data: categoriesResponse,
        count: Object.keys(categoriesResponse.data || {}).length,
        categories: categoriesResponse.data || {}
      };
      console.log('✅ getEventCategories() success:', results.categories);

      // Test 4: Test data validation
      console.log('🧪 Testing data validation...');
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
      results.validation = {
        success: validation.isValid,
        errors: validation.errors,
        data: testData
      };
      console.log('✅ Validation test:', results.validation);

      // Test 5: Test data formatting
      console.log('🧪 Testing data formatting...');
      const formattedData = eventsApi.formatEventData(testData);
      results.formatting = {
        success: true,
        original: testData,
        formatted: formattedData
      };
      console.log('✅ Formatting test:', results.formatting);

      // Test 6: Test with filters
      console.log('🧪 Testing filtered events...');
      const filteredResponse = await eventsApi.getEvents({ category: 'concert' });
      results.filtered = {
        success: true,
        data: filteredResponse,
        count: filteredResponse.data?.length || 0,
        filter: 'concert'
      };
      console.log('✅ Filtered events test:', results.filtered);

    } catch (error) {
      console.error('❌ Integration test failed:', error);
      results.error = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const displayResults = () => {
    if (isRunning) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #9333ea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h3>Running Integration Tests...</h3>
        </div>
      );
    }

    if (Object.keys(testResults).length === 0) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Events API Integration Test</h3>
          <p>Click the button below to test all API endpoints and data flow</p>
          <button 
            onClick={runIntegrationTest}
            style={{
              backgroundColor: '#9333ea',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Run Integration Test
          </button>
        </div>
      );
    }

    return (
      <div style={{ padding: '20px' }}>
        <h3>Integration Test Results</h3>
        
        {testResults.error && (
          <div style={{ 
            backgroundColor: '#fee', 
            border: '1px solid #fcc', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4>❌ Error</h4>
            <pre>{JSON.stringify(testResults.error, null, 2)}</pre>
          </div>
        )}

        {testResults.events && (
          <div style={{ 
            backgroundColor: '#efe', 
            border: '1px solid #cfc', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4>✅ Events API</h4>
            <p><strong>Status:</strong> {testResults.events.success ? 'Success' : 'Failed'}</p>
            <p><strong>Count:</strong> {testResults.events.count} events</p>
            {testResults.events.sampleEvent && (
              <details>
                <summary>Sample Event Data</summary>
                <pre>{JSON.stringify(testResults.events.sampleEvent, null, 2)}</pre>
              </details>
            )}
          </div>
        )}

        {testResults.featured && (
          <div style={{ 
            backgroundColor: '#efe', 
            border: '1px solid #cfc', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4>✅ Featured Events API</h4>
            <p><strong>Status:</strong> {testResults.featured.success ? 'Success' : 'Failed'}</p>
            <p><strong>Count:</strong> {testResults.featured.count} featured events</p>
            {testResults.featured.sampleEvent && (
              <details>
                <summary>Sample Featured Event</summary>
                <pre>{JSON.stringify(testResults.featured.sampleEvent, null, 2)}</pre>
              </details>
            )}
          </div>
        )}

        {testResults.categories && (
          <div style={{ 
            backgroundColor: '#efe', 
            border: '1px solid #cfc', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4>✅ Categories API</h4>
            <p><strong>Status:</strong> {testResults.categories.success ? 'Success' : 'Failed'}</p>
            <p><strong>Count:</strong> {testResults.categories.count} categories</p>
            <details>
              <summary>Categories Data</summary>
              <pre>{JSON.stringify(testResults.categories.categories, null, 2)}</pre>
            </details>
          </div>
        )}

        {testResults.validation && (
          <div style={{ 
            backgroundColor: testResults.validation.success ? '#efe' : '#fee', 
            border: `1px solid ${testResults.validation.success ? '#cfc' : '#fcc'}`, 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4>{testResults.validation.success ? '✅' : '❌'} Data Validation</h4>
            <p><strong>Status:</strong> {testResults.validation.success ? 'Valid' : 'Invalid'}</p>
            {!testResults.validation.success && (
              <details>
                <summary>Validation Errors</summary>
                <pre>{JSON.stringify(testResults.validation.errors, null, 2)}</pre>
              </details>
            )}
          </div>
        )}

        {testResults.formatting && (
          <div style={{ 
            backgroundColor: '#efe', 
            border: '1px solid #cfc', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4>✅ Data Formatting</h4>
            <details>
              <summary>Original vs Formatted</summary>
              <pre>{JSON.stringify({
                original: testResults.formatting.original,
                formatted: testResults.formatting.formatted
              }, null, 2)}</pre>
            </details>
          </div>
        )}

        {testResults.filtered && (
          <div style={{ 
            backgroundColor: '#efe', 
            border: '1px solid #cfc', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4>✅ Filtered Events</h4>
            <p><strong>Status:</strong> {testResults.filtered.success ? 'Success' : 'Failed'}</p>
            <p><strong>Filter:</strong> {testResults.filtered.filter}</p>
            <p><strong>Count:</strong> {testResults.filtered.count} events</p>
          </div>
        )}

        <button 
          onClick={runIntegrationTest}
          style={{
            backgroundColor: '#9333ea',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Run Test Again
        </button>
      </div>
    );
  };

  return displayResults();
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventsIntegrationTest;
} else {
  window.EventsIntegrationTest = EventsIntegrationTest;
}

// Add CSS for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
