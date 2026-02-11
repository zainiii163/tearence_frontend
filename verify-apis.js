/**
 * API Verification Script
 * 
 * This script helps verify that all required backend APIs are responding correctly.
 * 
 * Usage:
 *   node verify-apis.js
 * 
 * Environment Variables:
 *   API_BASE_URL - Base URL for the API (default: http://localhost:8000/api)
 *   API_TOKEN - Bearer token for authentication (optional)
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';
const API_TOKEN = process.env.API_TOKEN || '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[1;31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results storage
const results = {
  passed: [],
  failed: [],
  skipped: [],
};

/**
 * Make HTTP request
 */
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
      },
    };

    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsedBody,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Test an API endpoint
 */
async function testEndpoint(name, config) {
  const { method = 'GET', path, expectedStatus = 200, skip = false, description } = config;

  if (skip) {
    console.log(`${colors.yellow}⏭ SKIP${colors.reset}: ${name}`);
    results.skipped.push({ name, reason: 'Skipped' });
    return;
  }

  try {
    const url = `${API_BASE_URL}${path}`;
    console.log(`${colors.cyan}Testing${colors.reset}: ${name} (${method} ${path})`);
    
    const response = await makeRequest(url, method);
    
    if (response.status === expectedStatus) {
      console.log(`${colors.green}✓ PASS${colors.reset}: ${name} - Status: ${response.status}`);
      if (description) {
        console.log(`  ${colors.blue}→${colors.reset} ${description}`);
      }
      results.passed.push({ name, status: response.status });
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${name} - Expected ${expectedStatus}, got ${response.status}`);
      results.failed.push({ name, expected: expectedStatus, actual: response.status });
    }
  } catch (error) {
    console.log(`${colors.red}✗ ERROR${colors.reset}: ${name} - ${error.message}`);
    results.failed.push({ name, error: error.message });
  }
}

/**
 * Run all API tests
 */
async function runTests() {
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  API Verification Script${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  // Job APIs
  console.log(`${colors.cyan}Job APIs${colors.reset}`);
  console.log('─────────────────────────────────────\n');

  await testEndpoint(
    'GET /v1/listing - List jobs',
    {
      path: '/v1/listing?page=1&per_page=10',
      expectedStatus: 200,
      description: 'Returns paginated list of jobs',
    }
  );

  await testEndpoint(
    'GET /v1/listing with filters',
    {
      path: '/v1/listing?page=1&per_page=10&job_type=full-time',
      expectedStatus: 200,
      description: 'Returns filtered jobs',
    }
  );

  await testEndpoint(
    'GET /v1/listing/:id - Get job detail',
    {
      path: '/v1/listing/1',
      expectedStatus: [200, 404], // 404 is OK if no data exists
      description: 'Returns single job or 404 if not found',
    }
  );

  await testEndpoint(
    'GET /v1/listing/my-listing - Get user jobs',
    {
      path: '/v1/listing/my-listing',
      expectedStatus: [200, 401], // 401 if not authenticated
      description: 'Returns user\'s jobs or 401 if not authenticated',
    }
  );

  // Candidate Profile APIs
  console.log(`\n${colors.cyan}Candidate Profile APIs${colors.reset}`);
  console.log('─────────────────────────────────────\n');

  await testEndpoint(
    'GET /v1/candidate-profile - List profiles',
    {
      path: '/v1/candidate-profile?page=1&per_page=10',
      expectedStatus: 200,
      description: 'Returns public candidate profiles',
    }
  );

  await testEndpoint(
    'GET /v1/candidate-profile/:id - Get profile',
    {
      path: '/v1/candidate-profile/1',
      expectedStatus: [200, 404],
      description: 'Returns profile or 404 if not found',
    }
  );

  // Upsell APIs
  console.log(`\n${colors.cyan}Upsell APIs${colors.reset}`);
  console.log('─────────────────────────────────────\n');

  await testEndpoint(
    'GET /v1/job-upsell - Get user job upsells',
    {
      path: '/v1/job-upsell',
      expectedStatus: [200, 401],
      description: 'Returns user\'s job upsells or 401 if not authenticated',
    }
  );

  await testEndpoint(
    'GET /v1/candidate-upsell - Get user candidate upsells',
    {
      path: '/v1/candidate-upsell',
      expectedStatus: [200, 401],
      description: 'Returns user\'s candidate upsells or 401 if not authenticated',
    }
  );

  // Dashboard APIs
  console.log(`\n${colors.cyan}Dashboard APIs${colors.reset}`);
  console.log('─────────────────────────────────────\n');

  await testEndpoint(
    'GET /v1/dashboard/user - User dashboard',
    {
      path: '/v1/dashboard/user',
      expectedStatus: [200, 401],
      description: 'Returns user dashboard data or 401 if not authenticated',
    }
  );

  await testEndpoint(
    'GET /v1/dashboard/admin - Admin dashboard',
    {
      path: '/v1/dashboard/admin',
      expectedStatus: [200, 401, 403],
      description: 'Returns admin dashboard or 401/403 if not authorized',
    }
  );

  // Analytics APIs
  console.log(`\n${colors.cyan}Analytics APIs${colors.reset}`);
  console.log('─────────────────────────────────────\n');

  await testEndpoint(
    'GET /v1/analytics/revenue - Revenue analytics',
    {
      path: '/v1/analytics/revenue?period=30d',
      expectedStatus: [200, 401, 403],
      description: 'Returns revenue analytics or 401/403 if not authorized',
    }
  );

  await testEndpoint(
    'GET /v1/analytics/jobs - Job analytics',
    {
      path: '/v1/analytics/jobs',
      expectedStatus: [200, 401, 403],
      description: 'Returns job analytics or 401/403 if not authorized',
    }
  );

  await testEndpoint(
    'GET /v1/analytics/candidates - Candidate analytics',
    {
      path: '/v1/analytics/candidates',
      expectedStatus: [200, 401, 403],
      description: 'Returns candidate analytics or 401/403 if not authorized',
    }
  );

  await testEndpoint(
    'GET /v1/analytics/upsells - Upsell analytics',
    {
      path: '/v1/analytics/upsells',
      expectedStatus: [200, 401, 403],
      description: 'Returns upsell analytics or 401/403 if not authorized',
    }
  );

  await testEndpoint(
    'GET /v1/analytics/overview - Overview analytics',
    {
      path: '/v1/analytics/overview',
      expectedStatus: [200, 401, 403],
      description: 'Returns overview analytics or 401/403 if not authorized',
    }
  );

  // Print summary
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Test Summary${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}Passed:${colors.reset} ${results.passed.length}`);
  console.log(`${colors.red}Failed:${colors.reset} ${results.failed.length}`);
  console.log(`${colors.yellow}Skipped:${colors.reset} ${results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
    results.failed.forEach((test) => {
      console.log(`  - ${test.name}`);
      if (test.expected && test.actual) {
        console.log(`    Expected: ${test.expected}, Got: ${test.actual}`);
      }
      if (test.error) {
        console.log(`    Error: ${test.error}`);
      }
    });
  }

  // Exit with error code if any tests failed
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Handle expectedStatus as array
function checkStatus(actual, expected) {
  if (Array.isArray(expected)) {
    return expected.includes(actual);
  }
  return actual === expected;
}

// Update testEndpoint to handle array of expected statuses
const originalTestEndpoint = testEndpoint;
testEndpoint = async function(name, config) {
  const { method = 'GET', path, expectedStatus = 200, skip = false, description } = config;

  if (skip) {
    console.log(`${colors.yellow}⏭ SKIP${colors.reset}: ${name}`);
    results.skipped.push({ name, reason: 'Skipped' });
    return;
  }

  try {
    const url = `${API_BASE_URL}${path}`;
    console.log(`${colors.cyan}Testing${colors.reset}: ${name} (${method} ${path})`);
    
    const response = await makeRequest(url, method);
    
    const expectedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    
    if (expectedStatuses.includes(response.status)) {
      console.log(`${colors.green}✓ PASS${colors.reset}: ${name} - Status: ${response.status}`);
      if (description) {
        console.log(`  ${colors.blue}→${colors.reset} ${description}`);
      }
      results.passed.push({ name, status: response.status });
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${name} - Expected one of ${expectedStatuses.join(', ')}, got ${response.status}`);
      results.failed.push({ name, expected: expectedStatuses, actual: response.status });
    }
  } catch (error) {
    console.log(`${colors.red}✗ ERROR${colors.reset}: ${name} - ${error.message}`);
    results.failed.push({ name, error: error.message });
  }
};

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
