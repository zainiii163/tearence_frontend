// Test Price Type Dropdown Fix
// Run this in browser console to verify dropdown shows default selection

function testPriceTypeDropdown() {
  console.log('🧪 Testing Price Type Dropdown Fix...');
  
  // Find the price type dropdown
  const priceTypeSelect = document.querySelector('select');
  
  if (priceTypeSelect) {
    console.log('✅ Price Type dropdown found');
    console.log(`- Current value: "${priceTypeSelect.value}"`);
    console.log(`- Selected text: "${priceTypeSelect.options[priceTypeSelect.selectedIndex]?.text}"`);
    console.log(`- Options count: ${priceTypeSelect.options.length}`);
    
    // List all options
    console.log('\n📋 Available Options:');
    for (let i = 0; i < priceTypeSelect.options.length; i++) {
      const option = priceTypeSelect.options[i];
      const isSelected = option.selected ? '✓' : ' ';
      console.log(`${isSelected} ${i}. "${option.text}" (value: "${option.value}")`);
    }
    
    // Verify default selection
    if (priceTypeSelect.value === 'fixed') {
      console.log('\n✅ SUCCESS: Default value is "fixed"');
      console.log('✅ "Fixed Price" should be selected by default');
    } else {
      console.log('\n❌ ISSUE: Default value is not "fixed"');
      console.log(`❌ Current value: "${priceTypeSelect.value}"`);
    }
    
    // Test changing selection
    console.log('\n🔄 Testing option changes:');
    const testValues = ['negotiable', 'auction', 'swap', 'fixed'];
    
    testValues.forEach((value, index) => {
      setTimeout(() => {
        priceTypeSelect.value = value;
        priceTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const selectedText = priceTypeSelect.options[priceTypeSelect.selectedIndex]?.text;
        console.log(`- Changed to "${selectedText}" (value: "${value}")`);
      }, index * 500);
    });
    
  } else {
    console.log('❌ Price Type dropdown not found');
    console.log('Make sure you are on Step 2 of the vehicle posting form');
  }
  
  console.log('\n🎯 Expected Behavior:');
  console.log('✅ "Fixed Price" should be selected by default (not "Select price type")');
  console.log('✅ No empty option should be visible');
  console.log('✅ User can change to other options: Negotiable, Auction, Swap/Trade');
  console.log('✅ Form validation should pass since price_type has a valid value');
  
  console.log('\n📱 Manual Testing Instructions:');
  console.log('1. Navigate to /post-vehicles');
  console.log('2. Go to Step 2 (Basic Information)');
  console.log('3. Look at the Price Type dropdown:');
  console.log('   - Should show "Fixed Price" (not "Select price type")');
  console.log('   - Should not have an empty option');
  console.log('4. Try changing to other options - they should work');
  console.log('5. Submit form - should not show "Price type is required" error');
  
  console.log('\n🎉 Dropdown fix test complete!');
}

// Test form state
function testFormState() {
  console.log('\n🔍 Testing Form State...');
  
  // Check if we can access the React component state
  const formElement = document.querySelector('[data-testid="vehicle-post-form"]') || 
                      document.querySelector('.vehicle-post-form') ||
                      document.querySelector('form');
  
  if (formElement) {
    console.log('✅ Form element found');
    
    // Try to find the price type input in the form
    const priceTypeInputs = formElement.querySelectorAll('select');
    console.log(`Found ${priceTypeInputs.length} select elements in form`);
    
    priceTypeInputs.forEach((select, index) => {
      console.log(`Select ${index + 1}: value="${select.value}", placeholder="${select.placeholder}"`);
    });
  } else {
    console.log('❌ Form element not found');
  }
}

// Export functions
window.testPriceTypeDropdown = testPriceTypeDropdown;
window.testFormState = testFormState;

console.log('🎯 Dropdown Fix Test Tools Loaded!');
console.log('Available commands:');
console.log('- testPriceTypeDropdown() - Test dropdown default selection');
console.log('- testFormState() - Test form state');

// Auto-run tests
setTimeout(() => {
  testPriceTypeDropdown();
  testFormState();
}, 1000);
