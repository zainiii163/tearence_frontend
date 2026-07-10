// Test to identify which route is causing the "No query results for model" error
const API_BASE_URL = 'http://localhost:8000/api/v1';

const testRouteBinding = async () => {
  console.log('=== TESTING ROUTE BINDING ISSUES ===\n');
  
  try {
    // Test various promoted adverts endpoints to identify the problematic route
    console.log('1. Testing basic promoted adverts endpoint...');
    
    const basicResponse = await fetch(`${API_BASE_URL}/promoted-adverts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log(`Basic endpoint status: ${basicResponse.status}`);
    
    if (basicResponse.ok) {
      const data = await basicResponse.json();
      console.log('✅ Basic endpoint works');
    } else {
      const errorData = await basicResponse.json();
      console.log('❌ Basic endpoint failed:', errorData);
    }
    
    // Test specific slug routes that might cause binding issues
    console.log('\n2. Testing slug-based routes...');
    
    const testSlugs = ['test', 'nonexistent', '123', 'special-chars'];
    
    for (const slug of testSlugs) {
      try {
        console.log(`Testing slug: ${slug}`);
        
        const slugResponse = await fetch(`${API_BASE_URL}/promoted-adverts/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        console.log(`  Status: ${slugResponse.status}`);
        
        if (slugResponse.status === 404) {
          console.log('  ✅ Expected 404 for non-existent slug');
        } else if (slugResponse.ok) {
          console.log('  ✅ Slug route works');
        } else {
          const errorData = await slugResponse.json();
          console.log('  ❌ Unexpected error:', errorData.message || errorData);
        }
      } catch (error) {
        console.log(`  ❌ Request failed: ${error.message}`);
      }
    }
    
    // Test track-click routes
    console.log('\n3. Testing track-click routes...');
    
    for (const slug of testSlugs) {
      try {
        console.log(`Testing track-click for slug: ${slug}`);
        
        const trackResponse = await fetch(`${API_BASE_URL}/promoted-adverts/${slug}/track-click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        console.log(`  Status: ${trackResponse.status}`);
        
        if (trackResponse.status === 404) {
          console.log('  ✅ Expected 404 for non-existent slug');
        } else if (trackResponse.ok) {
          console.log('  ✅ Track-click route works');
        } else {
          const errorData = await trackResponse.json();
          console.log('  ❌ Unexpected error:', errorData.message || errorData);
        }
      } catch (error) {
        console.log(`  ❌ Request failed: ${error.message}`);
      }
    }
    
    // Test ID-based routes
    console.log('\n4. Testing ID-based routes...');
    
    const testIds = ['1', '999', 'abc', 'special'];
    
    for (const id of testIds) {
      try {
        console.log(`Testing ID: ${id}`);
        
        const idResponse = await fetch(`${API_BASE_URL}/promoted-adverts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer fake-token', // This will fail but shouldn't cause binding error
          },
          body: JSON.stringify({ title: 'Test' }),
        });
        
        console.log(`  Status: ${idResponse.status}`);
        
        if (idResponse.status === 401) {
          console.log('  ✅ Expected 401 for unauthorized (no binding error)');
        } else if (idResponse.status === 404) {
          console.log('  ✅ Expected 404 for non-existent ID');
        } else {
          const errorData = await idResponse.json();
          console.log('  ❌ Unexpected error:', errorData.message || errorData);
        }
      } catch (error) {
        console.log(`  ❌ Request failed: ${error.message}`);
      }
    }
    
    console.log('\n=== ROUTE BINDING TEST COMPLETE ===');
    console.log('If any test shows "No query results for model" error, that route is the problem');
    
  } catch (error) {
    console.error('❌ Route binding test failed:', error.message);
  }
};

testRouteBinding();
