import apiInstance from '../services/api';

/**
 * API Testing Utilities
 * Provides comprehensive testing functions for API connectivity, CORS, and authentication
 */

// Test CORS preflight and basic connectivity
export const testCORS = async () => {
  const results = {
    preflight: false,
    get: false,
    errors: [],
    timing: {},
    headers: {}
  };

  try {
    console.log('🔍 Testing CORS preflight (OPTIONS)...');
    const preflightStart = Date.now();
    
    const preflightResponse = await apiInstance.options('/cors-test', {
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    results.preflight = true;
    results.timing.preflight = Date.now() - preflightStart;
    results.headers.preflight = preflightResponse.headers;
    
    console.log('✅ CORS preflight successful:', preflightResponse.status);
  } catch (error) {
    results.errors.push({
      type: 'preflight',
      message: error.message,
      code: error.code,
      response: error.response?.data
    });
    console.error('❌ CORS preflight failed:', error.message);
  }

  try {
    console.log('🔍 Testing CORS GET request...');
    const getStart = Date.now();
    
    const getResponse = await apiInstance.get('/cors-test');
    results.get = true;
    results.timing.get = Date.now() - getStart;
    results.headers.get = getResponse.headers;
    
    console.log('✅ CORS GET successful:', getResponse.status);
  } catch (error) {
    results.errors.push({
      type: 'get',
      message: error.message,
      code: error.code,
      response: error.response?.data
    });
    console.error('❌ CORS GET failed:', error.message);
  }

  return results;
};

// Test authentication endpoints
export const testAuth = async () => {
  const results = {
    login: false,
    register: false,
    refresh: false,
    profile: false,
    errors: [],
    timing: {}
  };

  try {
    console.log('🔍 Testing login endpoint...');
    const start = Date.now();
    
    await apiInstance.post('/v1/auth/login', {
      email: 'test@example.com',
      password: 'testpassword'
    }, {
      validateStatus: (status) => status < 500 // Accept 4xx as valid for testing
    });
    
    results.login = true;
    results.timing.login = Date.now() - start;
    console.log('✅ Login endpoint reachable');
  } catch (error) {
    results.errors.push({
      type: 'login',
      message: error.message,
      status: error.response?.status,
      code: error.code
    });
    console.error('❌ Login endpoint failed:', error.message);
  }

  try {
    console.log('🔍 Testing register endpoint...');
    const start = Date.now();
    
    await apiInstance.post('/v1/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword'
    }, {
      validateStatus: (status) => status < 500
    });
    
    results.register = true;
    results.timing.register = Date.now() - start;
    console.log('✅ Register endpoint reachable');
  } catch (error) {
    results.errors.push({
      type: 'register',
      message: error.message,
      status: error.response?.status,
      code: error.code
    });
    console.error('❌ Register endpoint failed:', error.message);
  }

  try {
    console.log('🔍 Testing refresh endpoint...');
    const start = Date.now();
    
    await apiInstance.post('/v1/auth/refresh', {}, {
      validateStatus: (status) => status < 500
    });
    
    results.refresh = true;
    results.timing.refresh = Date.now() - start;
    console.log('✅ Refresh endpoint reachable');
  } catch (error) {
    results.errors.push({
      type: 'refresh',
      message: error.message,
      status: error.response?.status,
      code: error.code
    });
    console.error('❌ Refresh endpoint failed:', error.message);
  }

  try {
    console.log('🔍 Testing profile endpoint...');
    const start = Date.now();
    
    await apiInstance.get('/v1/auth/profile', {
      validateStatus: (status) => status < 500
    });
    
    results.profile = true;
    results.timing.profile = Date.now() - start;
    console.log('✅ Profile endpoint reachable');
  } catch (error) {
    results.errors.push({
      type: 'profile',
      message: error.message,
      status: error.response?.status,
      code: error.code
    });
    console.error('❌ Profile endpoint failed:', error.message);
  }

  return results;
};

// Check API health
export const checkApiHealth = async () => {
  const results = {
    healthy: false,
    responseTime: 0,
    status: null,
    errors: [],
    serverInfo: null
  };

  try {
    console.log('🔍 Checking API health...');
    const start = Date.now();

    const response = await apiInstance.get('/v1/auth/web-check', {
      timeout: 10000 // 10 second timeout
    });
    
    results.responseTime = Date.now() - start;
    results.status = response.status;
    results.healthy = response.status >= 200 && response.status < 300;
    results.serverInfo = response.data;
    
    console.log(`✅ API health check: ${response.status} (${results.responseTime}ms)`);
  } catch (error) {
    results.errors.push({
      message: error.message,
      code: error.code,
      timeout: error.code === 'ECONNABORTED'
    });
    console.error('❌ API health check failed:', error.message);
  }

  return results;
};

// Get comprehensive diagnostics
export const getDiagnostics = async () => {
  console.log('🔍 Running comprehensive API diagnostics...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    apiURL: process.env.REACT_APP_API_URL,
    browserInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      onLine: navigator.onLine
    },
    storage: {
      localStorage: !!localStorage,
      sessionStorage: !!sessionStorage,
      cookies: navigator.cookieEnabled
    },
    cors: null,
    auth: null,
    health: null,
    summary: {
      overall: 'unknown',
      issues: [],
      recommendations: []
    }
  };

  try {
    // Run all tests in parallel for efficiency
    const [corsResults, authResults, healthResults] = await Promise.allSettled([
      testCORS(),
      testAuth(),
      checkApiHealth()
    ]);

    diagnostics.cors = corsResults.status === 'fulfilled' ? corsResults.value : { errors: [corsResults.reason] };
    diagnostics.auth = authResults.status === 'fulfilled' ? authResults.value : { errors: [authResults.reason] };
    diagnostics.health = healthResults.status === 'fulfilled' ? healthResults.value : { errors: [healthResults.reason] };

    // Analyze results and provide recommendations
    const issues = [];
    const recommendations = [];

    // CORS analysis
    if (diagnostics.cors.errors.length > 0) {
      issues.push('CORS configuration issues detected');
      recommendations.push('Configure backend to allow requests from your domain');
      recommendations.push('Check Access-Control-Allow-Origin headers');
    }

    // Auth analysis
    if (diagnostics.auth.errors.length > 0) {
      issues.push('Authentication endpoint issues');
      recommendations.push('Verify auth endpoints are deployed and accessible');
    }

    // Health analysis
    if (!diagnostics.health.healthy) {
      issues.push('API health check failed');
      recommendations.push('Check if API server is running');
      recommendations.push('Verify network connectivity');
    }

    // Overall status
    const totalErrors = diagnostics.cors.errors.length + diagnostics.auth.errors.length + (diagnostics.health.errors?.length || 0);
    
    if (totalErrors === 0) {
      diagnostics.summary.overall = 'healthy';
    } else if (totalErrors <= 2) {
      diagnostics.summary.overall = 'degraded';
    } else {
      diagnostics.summary.overall = 'unhealthy';
    }

    diagnostics.summary.issues = issues;
    diagnostics.summary.recommendations = recommendations;

  } catch (error) {
    diagnostics.summary.overall = 'error';
    diagnostics.summary.issues.push(['Diagnostics failed to run:', error.message]);
  }

  console.log('📊 API Diagnostics Complete:', diagnostics);
  return diagnostics;
};

// Test specific endpoint manually
export const testEndpoint = async (method, url, data = null) => {
  const results = {
    success: false,
    status: null,
    responseTime: 0,
    error: null,
    headers: {},
    data: null
  };

  try {
    console.log(`🔍 Testing ${method.toUpperCase()} ${url}...`);
    const start = Date.now();
    
    let response;
    switch (method.toLowerCase()) {
      case 'get':
        response = await apiInstance.get(url);
        break;
      case 'post':
        response = await apiInstance.post(url, data);
        break;
      case 'put':
        response = await apiInstance.put(url, data);
        break;
      case 'delete':
        response = await apiInstance.delete(url);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    results.success = true;
    results.status = response.status;
    results.responseTime = Date.now() - start;
    results.headers = response.headers;
    results.data = response.data;
    
    console.log(`✅ ${method.toUpperCase()} ${url}: ${response.status} (${results.responseTime}ms)`);
  } catch (error) {
    results.error = {
      message: error.message,
      status: error.response?.status,
      code: error.code,
      data: error.response?.data
    };
    console.error(`❌ ${method.toUpperCase()} ${url} failed:`, error.message);
  }

  return results;
};

// Export all functions for easy access
export default {
  testCORS,
  testAuth,
  checkApiHealth,
  getDiagnostics,
  testEndpoint
};
