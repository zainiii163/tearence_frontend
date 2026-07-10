// Cache buster for development - force reload to clear cached JavaScript
console.log('🔄 Cache Buster: Forcing clear cache...');

// Clear any cached modules
if (typeof window !== 'undefined' && window.__webpack_require__) {
  console.log('🔄 Clearing webpack cache...');
  delete window.__webpack_require__.cache;
}

// Force reload with cache busting
const timestamp = new Date().getTime();
const currentUrl = window.location.href;
const separator = currentUrl.includes('?') ? '&' : '?';
const cacheBustedUrl = `${currentUrl}${separator}t=${timestamp}`;

console.log('🔄 Cache busted URL:', cacheBustedUrl);

// Uncomment the line below to automatically reload with cache busting
// window.location.href = cacheBustedUrl;

console.log('🔄 Cache buster loaded. Manually reload the page or uncomment the reload line above.');
