// Debug authentication persistence issue
console.log('=== Authentication Persistence Debug ===');

// Check what's in localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userDetail = localStorage.getItem('userDetail'); // Should be null now

console.log('Token:', token ? 'EXISTS' : 'MISSING');
console.log('User:', user ? 'EXISTS' : 'MISSING');
console.log('UserDetail (old key):', userDetail ? 'EXISTS (should be null)' : 'MISSING (good)');

// Parse user data if it exists
if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('User data parsed successfully:', userData);
    console.log('User ID:', userData.id);
    console.log('User email:', userData.email);
    console.log('Customer ID:', userData.customer_id);
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }
}

// Check Redux store state
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  const store = window.__REDUX_DEVTOOLS_EXTENSION__.getStore();
  if (store) {
    const authState = store.getState()?.auth;
    console.log('Redux auth state:', authState);
    console.log('Redux logIn:', authState?.logIn);
    console.log('Redux token:', authState?.token ? 'EXISTS' : 'MISSING');
    console.log('Redux userDetail:', authState?.userDetail ? 'EXISTS' : 'MISSING');
  }
}

console.log('\n=== Expected Behavior ===');
console.log('1. Token should exist in localStorage');
console.log('2. User should exist in localStorage');
console.log('3. UserDetail should be null (old key)');
console.log('4. Redux logIn should be true');
console.log('5. Redux token should exist');
console.log('6. Redux userDetail should exist');

console.log('\n=== If issues persist ===');
console.log('1. Check if AuthService is storing data correctly');
console.log('2. Check if Redux is properly initialized on page load');
console.log('3. Check if there are any errors in console');
console.log('4. Try logging out and logging back in');
