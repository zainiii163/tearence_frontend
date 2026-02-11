/**
 * Test script to verify poster name functionality
 * This tests the posterHelper utility to ensure business/store names are used correctly
 */

import { getPosterName, createListingWithPosterName } from './posterHelper.js';

// Test data
const testUser = {
  customer_id: '123',
  name: 'John Doe',
  username: 'johndoe'
};

const testBusiness = {
  id: 'biz456',
  name: 'ABC Restaurant'
};

const testStore = {
  id: 'store789',
  name: 'XYZ Electronics Store'
};

// Test cases
console.log('=== Testing Poster Name Functionality ===\n');

// Test 1: Regular user posting
const userPosterName = getPosterName(testUser, null, null, false);
console.log('Test 1 - Regular user posting:', userPosterName);
console.log('Expected: John Doe');
console.log('Pass:', userPosterName === 'John Doe');

// Test 2: Business page posting
const businessPosterName = getPosterName(testUser, testBusiness, null, false);
console.log('\nTest 2 - Business page posting:', businessPosterName);
console.log('Expected: ABC Restaurant');
console.log('Pass:', businessPosterName === 'ABC Restaurant');

// Test 3: Store page posting
const storePosterName = getPosterName(testUser, null, testStore, false);
console.log('\nTest 3 - Store page posting:', storePosterName);
console.log('Expected: XYZ Electronics Store');
console.log('Pass:', storePosterName === 'XYZ Electronics Store');

// Test 4: Admin dashboard posting with business context
const adminBusinessPosterName = getPosterName(testUser, testBusiness, null, true);
console.log('\nTest 4 - Admin dashboard posting with business:', adminBusinessPosterName);
console.log('Expected: ABC Restaurant');
console.log('Pass:', adminBusinessPosterName === 'ABC Restaurant');

// Test 5: Admin dashboard posting with store context
const adminStorePosterName = getPosterName(testUser, null, testStore, true);
console.log('\nTest 5 - Admin dashboard posting with store:', adminStorePosterName);
console.log('Expected: XYZ Electronics Store');
console.log('Pass:', adminStorePosterName === 'XYZ Electronics Store');

// Test 6: Admin dashboard posting without business/store (should use user name)
const adminUserPosterName = getPosterName(testUser, null, null, true);
console.log('\nTest 6 - Admin dashboard posting without business/store:', adminUserPosterName);
console.log('Expected: John Doe');
console.log('Pass:', adminUserPosterName === 'John Doe');

console.log('\n=== Testing createListingWithPosterName ===\n');

// Test 7: createListingWithPosterName for business context
const testListingData = {
  title: 'Test Advertisement',
  description: 'Test description',
  price: 100
};

createListingWithPosterName(testListingData, testUser, testBusiness, null, false)
  .then(enhancedData => {
    console.log('Test 7 - Enhanced listing data for business context:');
    console.log('Poster name:', enhancedData.poster_name);
    console.log('Poster type:', enhancedData.poster_type);
    console.log('Poster ID:', enhancedData.poster_id);
    console.log('Expected poster name: ABC Restaurant');
    console.log('Expected poster type: business');
    console.log('Expected poster ID: biz456');
    console.log('Pass:', enhancedData.poster_name === 'ABC Restaurant' && 
                    enhancedData.poster_type === 'business' && 
                    enhancedData.poster_id === 'biz456');
  })
  .catch(error => {
    console.error('Error in Test 7:', error);
  });

console.log('\n=== Test Summary ===');
console.log('All tests completed. Check the output above for results.');
