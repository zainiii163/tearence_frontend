// Debug authentication state
console.log('=== Authentication Debug ===');

// Check all possible auth storage locations
const token = localStorage.getItem('token');
const userDetail = localStorage.getItem('userDetail');
const user = localStorage.getItem('user');
const customerId = localStorage.getItem('customer_id');
const persistAuth = localStorage.getItem('persist:auth');

console.log('Token:', token);
console.log('UserDetail:', userDetail);
console.log('User:', user);
console.log('Customer ID:', customerId);
console.log('Persist Auth:', persistAuth);

// Try to parse userDetail
if (userDetail) {
  try {
    const userData = JSON.parse(userDetail);
    console.log('Parsed UserDetail:', userData);
    console.log('UserDetail token:', userData.token);
    console.log('UserDetail user:', userData.user);
  } catch (e) {
    console.error('Failed to parse userDetail:', e);
  }
}

// Try to parse persist:auth
if (persistAuth) {
  try {
    const authData = JSON.parse(persistAuth);
    console.log('Parsed persist:auth:', authData);
  } catch (e) {
    console.error('Failed to parse persist:auth:', e);
  }
}

// Check Redux store
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  const store = window.__REDUX_DEVTOOLS_EXTENSION__.getStore();
  if (store) {
    console.log('Redux auth state:', store.getState()?.auth);
  }
}

console.log('=== Possible Solutions ===');
console.log('1. Check if token is stored under different key');
console.log('2. Check if userDetail contains token');
console.log('3. Check Redux persist state');
console.log('4. May need to re-login to get fresh token');
