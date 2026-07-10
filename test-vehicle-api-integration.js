// Vehicle API Integration Test Script
// This script tests all vehicle API endpoints to verify real data integration

const API_BASE = 'http://localhost:8000/api';

// Test helper function
async function testEndpoint(name, url, options = {}) {
    console.log(`\n🚗 Testing ${name}...`);
    try {
        const response = await fetch(`${API_BASE}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        console.log(`✅ ${name} - Status: ${response.status}`);
        
        if (response.ok) {
            if (Array.isArray(data)) {
                console.log(`📊 Found ${data.length} items`);
                if (data.length > 0) {
                    console.log(`📝 Sample item keys:`, Object.keys(data[0]));
                }
            } else if (data.data) {
                console.log(`📊 Found ${Array.isArray(data.data) ? data.data.length : 'object'} items`);
                if (Array.isArray(data.data) && data.data.length > 0) {
                    console.log(`📝 Sample item keys:`, Object.keys(data.data[0]));
                }
            } else {
                console.log(`📊 Response keys:`, Object.keys(data));
            }
            return { success: true, data };
        } else {
            console.log(`❌ Error:`, data);
            return { success: false, error: data };
        }
    } catch (error) {
        console.log(`❌ Network Error:`, error.message);
        return { success: false, error: error.message };
    }
}

// Test all vehicle endpoints
async function runVehicleApiTests() {
    console.log('🔍 Starting Vehicle API Integration Tests...\n');
    
    const results = {};
    
    // Test 1: Vehicle Categories
    results.categories = await testEndpoint('Vehicle Categories', '/vehicles/categories');
    
    // Test 2: Vehicle Makes  
    results.makes = await testEndpoint('Vehicle Makes', '/vehicles/makes');
    
    // Test 3: Vehicle Models (if we have makes)
    if (results.makes.success && results.makes.data && results.makes.data.length > 0) {
        const firstMake = Array.isArray(results.makes.data) ? results.makes.data[0] : results.makes.data.data?.[0];
        if (firstMake) {
            results.models = await testEndpoint(`Vehicle Models for ${firstMake.name}`, `/vehicles/makes/${firstMake.id}/models`);
        }
    }
    
    // Test 4: All Vehicles
    results.vehicles = await testEndpoint('All Vehicles', '/vehicles');
    
    // Test 5: Featured Vehicles
    results.featured = await testEndpoint('Featured Vehicles', '/vehicles/featured');
    
    // Test 6: Recent Vehicles
    results.recent = await testEndpoint('Recent Vehicles', '/vehicles/recent');
    
    // Test 7: Vehicle Statistics
    results.stats = await testEndpoint('Vehicle Statistics', '/vehicles/stats');
    
    // Test 8: Popular Makes
    results.popularMakes = await testEndpoint('Popular Makes', '/vehicles/popular-makes');
    
    // Test 9: Search Vehicles
    results.search = await testEndpoint('Search Vehicles', '/vehicles?search=BMW');
    
    // Test 10: Filter by Category (if categories exist)
    if (results.categories.success && results.categories.data && results.categories.data.length > 0) {
        const firstCategory = Array.isArray(results.categories.data) ? results.categories.data[0] : results.categories.data.data?.[0];
        if (firstCategory) {
            results.categoryFilter = await testEndpoint(`Vehicles in ${firstCategory.name}`, `/vehicles?category=${firstCategory.id}`);
        }
    }
    
    // Test 11: Filter by Make (if makes exist)
    if (results.makes.success && results.makes.data && results.makes.data.length > 0) {
        const firstMake = Array.isArray(results.makes.data) ? results.makes.data[0] : results.makes.data.data?.[0];
        if (firstMake) {
            results.makeFilter = await testEndpoint(`Vehicles by ${firstMake.name}`, `/vehicles?make=${firstMake.id}`);
        }
    }
    
    // Test 12: Price Range Filter
    results.priceFilter = await testEndpoint('Vehicles by Price Range', '/vehicles?min_price=1000&max_price=50000');
    
    // Test 13: Sort by Price
    results.sortByPrice = await testEndpoint('Vehicles Sorted by Price', '/vehicles?sort_by=price&sort_order=asc');
    
    // Summary
    console.log('\n📋 TEST SUMMARY');
    console.log('================');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${failedTests}/${totalTests}`);
    
    if (failedTests > 0) {
        console.log('\n❌ FAILED TESTS:');
        Object.entries(results).forEach(([name, result]) => {
            if (!result.success) {
                console.log(`  - ${name}: ${result.error?.message || result.error}`);
            }
        });
    }
    
    // Data Structure Analysis
    console.log('\n🔍 DATA STRUCTURE ANALYSIS');
    console.log('==========================');
    
    if (results.vehicles.success) {
        const vehicles = results.vehicles.data;
        if (Array.isArray(vehicles) && vehicles.length > 0) {
            console.log('📝 Vehicle object structure:');
            console.log('   Keys:', Object.keys(vehicles[0]));
            
            // Check for key fields
            const keyFields = ['id', 'title', 'price', 'year', 'make', 'model', 'category', 'main_image'];
            const missingFields = keyFields.filter(field => !(field in vehicles[0]));
            
            if (missingFields.length === 0) {
                console.log('✅ All key fields present');
            } else {
                console.log('⚠️  Missing key fields:', missingFields);
            }
            
            // Check for relationships
            const relationships = ['make', 'model', 'category', 'user'];
            const loadedRelationships = relationships.filter(rel => vehicles[0][rel] && typeof vehicles[0][rel] === 'object');
            console.log('🔗 Loaded relationships:', loadedRelationships);
        }
    }
    
    return results;
}

// Test form data structure
function testFormDataStructure() {
    console.log('\n📝 FORM DATA STRUCTURE TEST');
    console.log('==========================');
    
    const sampleFormData = {
        title: '2020 BMW 3 Series 330i M Sport',
        tagline: 'Immaculate condition, one owner',
        category_id: 1,
        make_id: 1,
        model_id: 1,
        year: 2020,
        mileage: 15000,
        fuel_type: 'petrol',
        transmission: 'automatic',
        condition: 'excellent',
        advert_type: 'sale',
        price: 25000,
        price_type: 'fixed',
        negotiable: false,
        description: 'Beautiful BMW 3 Series in excellent condition',
        features: ['Leather seats', 'Sunroof', 'Navigation'],
        country: 'United Kingdom',
        city: 'London',
        contact_name: 'John Doe',
        contact_phone: '+447700900123',
        contact_email: 'john@example.com'
    };
    
    console.log('📋 Sample form data:');
    console.log(JSON.stringify(sampleFormData, null, 2));
    
    // Convert to FormData (simulating frontend)
    const formData = new FormData();
    
    Object.keys(sampleFormData).forEach(key => {
        if (key === 'features' && Array.isArray(sampleFormData[key])) {
            sampleFormData[key].forEach((feature, index) => {
                formData.append(`features[${index}]`, feature);
            });
        } else if (typeof sampleFormData[key] === 'boolean') {
            formData.append(key, sampleFormData[key] ? '1' : '0');
        } else if (sampleFormData[key] !== null && sampleFormData[key] !== undefined) {
            formData.append(key, sampleFormData[key]);
        }
    });
    
    const formDataObj = {};
    for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }
    
    console.log('\n🔄 FormData structure (what backend receives):');
    console.log(JSON.stringify(formDataObj, null, 2));
    
    console.log('\n✅ Form data structure test completed');
}

// Run all tests
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { runVehicleApiTests, testFormDataStructure };
} else {
    // Browser environment
    console.log('🌐 Running in browser environment');
    runVehicleApiTests().then(results => {
        testFormDataStructure();
        console.log('\n🎉 All tests completed!');
    }).catch(error => {
        console.error('❌ Test runner error:', error);
    });
}
