// Test Affiliate System Frontend Integration
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';
const API_BASE = 'http://127.0.0.1:8000/api/v1';

console.log('=== Testing Affiliate System Frontend Integration ===\n');

// Test 1: Check if frontend is accessible
async function testFrontendAccess() {
    try {
        const response = await fetch(BASE_URL);
        const text = await response.text();
        console.log('✓ Frontend server is accessible');
        console.log(`  Status: ${response.status}`);
        console.log(`  Content length: ${text.length} characters\n`);
        return true;
    } catch (error) {
        console.log('✗ Frontend server not accessible');
        console.log(`  Error: ${error.message}\n`);
        return false;
    }
}

// Test 2: Test affiliate page directly
async function testAffiliatePage() {
    try {
        const response = await fetch(`${BASE_URL}/affiliate`);
        const text = await response.text();
        
        if (response.ok && text.includes('Affiliates')) {
            console.log('✓ Affiliate page is accessible');
            console.log(`  Status: ${response.status}`);
            
            // Check for key components
            const hasHero = text.includes('AffiliateHero') || text.includes('Post an Affiliate Offer');
            const hasCategories = text.includes('categories') || text.includes('Category');
            const hasForms = text.includes('AffiliatePostForm') || text.includes('Post Form');
            
            console.log(`  ✓ Has Hero section: ${hasHero}`);
            console.log(`  ✓ Has Categories: ${hasCategories}`);
            console.log(`  ✓ Has Forms: ${hasForms}`);
        } else {
            console.log('✗ Affiliate page not accessible or missing content');
            console.log(`  Status: ${response.status}`);
        }
        console.log('');
        return response.ok;
    } catch (error) {
        console.log('✗ Failed to access affiliate page');
        console.log(`  Error: ${error.message}\n`);
        return false;
    }
}

// Test 3: Test backend API endpoints (from frontend perspective)
async function testBackendAPI() {
    const endpoints = [
        '/affiliates/categories',
        '/affiliates/business-offers',
        '/affiliates/user-posts',
        '/affiliates/upsell-plans'
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log(`✓ ${endpoint} - Working`);
                if (endpoint === '/affiliates/categories') {
                    console.log(`  Categories found: ${data.data?.length || 0}`);
                } else if (endpoint.includes('business-offers') || endpoint.includes('user-posts')) {
                    console.log(`  Total items: ${data.data?.total || 0}`);
                }
            } else {
                console.log(`✗ ${endpoint} - Failed`);
                console.log(`  Status: ${response.status}`);
                console.log(`  Response: ${JSON.stringify(data).substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`✗ ${endpoint} - Error`);
            console.log(`  Error: ${error.message}`);
        }
    }
    console.log('');
}

// Test 4: Test affiliate service file integration
async function testAffiliateService() {
    try {
        // Check if the affiliate service file exists and has correct endpoints
        const fs = require('fs');
        const path = require('path');
        
        const servicePath = path.join(__dirname, 'src/services/AffiliateService.js');
        
        if (fs.existsSync(servicePath)) {
            const content = fs.readFileSync(servicePath, 'utf8');
            
            // Check for correct API endpoints with v1 prefix
            const hasV1Prefix = content.includes('/api/v1/affiliates/');
            const hasCategories = content.includes('getCategories');
            const hasBusinessOffers = content.includes('getBusinessOffers');
            const hasUserPosts = content.includes('getUserPosts');
            
            console.log('✓ AffiliateService.js exists');
            console.log(`  ✓ Uses v1 prefix: ${hasV1Prefix}`);
            console.log(`  ✓ Has getCategories: ${hasCategories}`);
            console.log(`  ✓ Has getBusinessOffers: ${hasBusinessOffers}`);
            console.log(`  ✓ Has getUserPosts: ${hasUserPosts}`);
        } else {
            console.log('✗ AffiliateService.js not found');
        }
    } catch (error) {
        console.log('✗ Error checking AffiliateService.js');
        console.log(`  Error: ${error.message}`);
    }
    console.log('');
}

// Test 5: Check affiliate page components
async function testAffiliateComponents() {
    try {
        const fs = require('fs');
        const path = require('path');
        
        const components = [
            'src/Pages/affiliates.jsx',
            'src/Component/affiliates/AffiliateHero.jsx',
            'src/Component/affiliates/AffiliatePostForm.jsx',
            'src/Component/affiliates/AffiliateCategoryGrid.jsx',
            'src/Component/affiliates/AffiliateGrid.jsx'
        ];
        
        for (const component of components) {
            const componentPath = path.join(__dirname, component);
            if (fs.existsSync(componentPath)) {
                console.log(`✓ ${component} exists`);
            } else {
                console.log(`✗ ${component} missing`);
            }
        }
    } catch (error) {
        console.log('✗ Error checking components');
        console.log(`  Error: ${error.message}`);
    }
    console.log('');
}

// Run all tests
async function runAllTests() {
    console.log('1. Testing Frontend Access...\n');
    await testFrontendAccess();
    
    console.log('2. Testing Affiliate Page...\n');
    await testAffiliatePage();
    
    console.log('3. Testing Backend API...\n');
    await testBackendAPI();
    
    console.log('4. Testing Affiliate Service...\n');
    await testAffiliateService();
    
    console.log('5. Testing Components...\n');
    await testAffiliateComponents();
    
    console.log('=== Frontend Testing Complete ===');
}

runAllTests().catch(console.error);
