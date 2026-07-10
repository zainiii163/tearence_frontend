// 🚨 FORCE CLEAR ALL CACHE AND RESET
// Run this in browser console to completely clear cache

console.log('🧹 FORCE CLEARING ALL CACHE...');

// 1. Clear Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('✅ Service Worker unregistered:', registration.scope);
    }
  });
}

// 2. Clear Local Storage
localStorage.clear();
console.log('✅ Local Storage cleared');

// 3. Clear Session Storage
sessionStorage.clear();
console.log('✅ Session Storage cleared');

// 4. Clear IndexedDB
if ('indexedDB' in window) {
  indexedDB.databases().then(databases => {
    databases.forEach(db => {
      indexedDB.deleteDatabase(db.name);
      console.log('✅ IndexedDB cleared:', db.name);
    });
  });
}

// 5. Force reload page
setTimeout(() => {
  console.log('🔄 Reloading page...');
  window.location.reload(true);
}, 1000);

console.log('🎯 Cache clearing complete! Page will reload in 1 second.');
