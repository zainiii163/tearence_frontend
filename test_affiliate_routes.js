// Test different affiliate route patterns
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

console.log('=== Testing Affiliate Route Patterns ===\n');

async function testRoute(url, description) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        
        console.log(`${description}:`);
        console.log(`  Status: ${response.status}`);
        console.log(`  Content length: ${text.length}`);
        
        if (response.ok && text.includes('Affiliates')) {
            console.log(`  ✓ ${description} working`);
        } else {
            console.log(`  ✗ ${description} failed`);
            if (text.length > 0) {
                console.log(`  First 200 chars: ${text.substring(0, 200)}...`);
            }
        }
        console.log('');
        return response.ok;
    } catch (error) {
        console.log(`${description}:`);
        console.log(`  ✗ Error: ${error.message}`);
        console.log('');
        return false;
    }
}

async function testAllRoutes() {
    const routes = [
        { url: `${BASE_URL}/affiliate`, desc: '/affiliate' },
        { url: `${BASE_URL}/affiliates`, desc: '/affiliates' },
        { url: `${BASE_URL}/affiliate-hub`, desc: '/affiliate-hub' },
        { url: `${BASE_URL}/Affiliate`, desc: '/Affiliate (capitalized)' },
        { url: `${BASE_URL}/Affiliates`, desc: '/Affiliates (capitalized)' },
    ];

    for (const route of routes) {
        await testRoute(route.url, route.desc);
    }
}

testAllRoutes().catch(console.error);
