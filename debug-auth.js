// Debug script to check authentication status
// Run this in browser console to diagnose auth issues

function debugAuth() {
  console.log('=== AUTHENTICATION DEBUG ===');
  
  // Check token
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
  console.log('Token length:', token?.length || 0);
  console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'null');
  
  // Check user data
  const user = localStorage.getItem('user');
  console.log('User data exists:', !!user);
  try {
    const parsedUser = user ? JSON.parse(user) : null;
    console.log('User ID:', parsedUser?.id || parsedUser?.customer_id);
    console.log('User email:', parsedUser?.email);
  } catch (e) {
    console.log('User data parse error:', e.message);
  }
  
  // Check customer ID
  const customerId = localStorage.getItem('customer_id');
  console.log('Customer ID:', customerId);
  
  // Check Redux state (if Redux DevTools available)
  try {
    const state = window.__REDUX_DEVTOOLS_EXTENSION__?.getStore?.()?.getState();
    if (state?.auth) {
      console.log('Redux auth state:', {
        logIn: state.auth.logIn,
        hasToken: !!state.auth.token,
        hasUserDetail: !!state.auth.userDetail,
        customerId: state.auth.customerId
      });
    }
  } catch (e) {
    console.log('Redux state not accessible');
  }
  
  console.log('=== END DEBUG ===');
}

// Auto-run debug
debugAuth();

// Export for manual use
window.debugAuth = debugAuth;
