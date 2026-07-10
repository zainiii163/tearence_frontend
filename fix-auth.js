// Quick Authentication Fix Script
// Run this in browser console when experiencing auth issues

function fixAuthentication() {
  console.log('🔧 Starting Authentication Fix...');
  
  // 1. Clear potentially corrupted data
  console.log('🧹 Cleaning up corrupted auth data...');
  const keysToRemove = [];
  Object.keys(localStorage).forEach(key => {
    if (key.includes('token') || key.includes('user') || key.includes('auth') || key.startsWith('api_cache_')) {
      keysToRemove.push(key);
    }
  });
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`✅ Removed ${keysToRemove.length} potentially corrupted items`);
  
  // 2. Check current page and redirect if needed
  const currentPath = window.location.pathname;
  const isAuthPage = ['/login', '/register'].includes(currentPath);
  
  if (!isAuthPage) {
    console.log('🔄 Redirecting to login page...');
    window.location.href = '/login';
  } else {
    console.log('📱 Already on auth page, reload to ensure clean state');
    window.location.reload();
  }
  
  console.log('🎉 Authentication fix completed!');
}

// Enhanced version with more options
function fixAuthenticationAdvanced() {
  console.log('🔧 Advanced Authentication Fix...');
  
  // Show current state
  const currentState = {
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user'),
    customerId: localStorage.getItem('customer_id'),
    path: window.location.pathname,
    timestamp: new Date().toISOString()
  };
  
  console.log('📊 Current State:', currentState);
  
  // Ask user what to do
  const action = prompt(
    'Choose an action:\n' +
    '1. Clear all auth data and redirect to login\n' +
    '2. Clear only cache (keep login)\n' +
    '3. Just analyze current state\n' +
    '4. Test current token\n' +
    '\nEnter number (1-4):'
  );
  
  switch(action) {
    case '1':
      fixAuthentication();
      break;
    case '2':
      console.log('🧹 Clearing cache only...');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('api_cache_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('✅ Cache cleared');
      break;
    case '3':
      console.log('📊 Analysis complete - see current state above');
      break;
    case '4':
      testCurrentToken();
      break;
    default:
      console.log('❌ Invalid action selected');
  }
}

function testCurrentToken() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No token found to test');
    return;
  }
  
  console.log('🧪 Testing current token...');
  
  fetch('https://api.worldwideadverts.info/api/v1/auth/web-check', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    console.log('📡 Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ API Response:', data);
  })
  .catch(error => {
    console.error('❌ API Error:', error);
  });
}

// Auto-detect and fix common issues
function autoFixAuth() {
  console.log('🤖 Auto-fixing authentication issues...');
  
  // Check for common issues
  const issues = [];
  
  // Check token format
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        issues.push('Invalid token format');
      } else {
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          issues.push('Token expired');
        }
      }
    } catch (e) {
      issues.push('Cannot parse token');
    }
  } else {
    issues.push('No token found');
  }
  
  // Check user data
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      JSON.parse(userData);
    } catch (e) {
      issues.push('Corrupted user data');
    }
  } else if (token) {
    issues.push('Token exists but no user data');
  }
  
  console.log('🔍 Detected Issues:', issues);
  
  if (issues.length > 0) {
    console.log('🔧 Applying fixes...');
    fixAuthentication();
  } else {
    console.log('✅ No issues detected');
  }
}

// Export functions
window.fixAuthentication = fixAuthentication;
window.fixAuthenticationAdvanced = fixAuthenticationAdvanced;
window.testCurrentToken = testCurrentToken;
window.autoFixAuth = autoFixAuth;

console.log('🎯 Auth fix tools loaded! Available commands:');
console.log('- fixAuthentication() - Quick fix');
console.log('- fixAuthenticationAdvanced() - Advanced options');
console.log('- testCurrentToken() - Test token');
console.log('- autoFixAuth() - Auto-detect and fix');

// Auto-run detection
setTimeout(autoFixAuth, 1000);
