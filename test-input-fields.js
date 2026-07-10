// Test Vehicle Form Input Fields
// Run this in browser console to test manual input functionality

function testVehicleInputFields() {
  console.log('🧪 Testing Vehicle Form Input Fields...');
  
  // Find all the input fields we fixed
  const inputFields = {
    year: document.querySelector('input[placeholder*="2020"]'),
    price: document.querySelector('input[placeholder*="25000"]'),
    mileage: document.querySelector('input[placeholder*="15000"]'),
    doors: document.querySelector('input[placeholder*="4"]'),
    seats: document.querySelector('input[placeholder*="5"]')
  };
  
  console.log('📊 Input Fields Found:', {
    year: !!inputFields.year,
    price: !!inputFields.price,
    mileage: !!inputFields.mileage,
    doors: !!inputFields.doors,
    seats: !!inputFields.seats
  });
  
  // Test each input field
  Object.entries(inputFields).forEach(([fieldName, element]) => {
    if (element) {
      console.log(`\n🔍 Testing ${fieldName} field:`);
      console.log(`- Type: ${element.type}`);
      console.log(`- Input mode: ${element.inputMode}`);
      console.log(`- Pattern: ${element.pattern}`);
      console.log(`- Max length: ${element.maxLength}`);
      console.log(`- Current value: "${element.value}"`);
      
      // Test manual input simulation
      const testValue = fieldName === 'year' ? '2023' : 
                       fieldName === 'price' ? '25000' : 
                       fieldName === 'mileage' ? '15000' : 
                       fieldName === 'doors' ? '4' : '5';
      
      console.log(`- Test value: ${testValue}`);
      
      // Focus the field
      element.focus();
      
      // Clear and set value
      element.value = '';
      
      // Simulate typing
      element.value = testValue;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log(`- After input: "${element.value}"`);
    } else {
      console.log(`❌ ${fieldName} field not found`);
    }
  });
  
  // Test numeric validation
  console.log('\n🔢 Testing Numeric Validation:');
  
  const yearField = inputFields.year;
  if (yearField) {
    console.log('Testing Year field with various inputs:');
    
    const testInputs = ['abcd', '12a3', '2023', '20235', '1899'];
    
    testInputs.forEach(testInput => {
      yearField.value = testInput;
      yearField.dispatchEvent(new Event('input', { bubbles: true }));
      console.log(`- Input: "${testInput}" → Result: "${yearField.value}"`);
    });
  }
  
  console.log('\n🎯 Manual Testing Instructions:');
  console.log('1. Navigate to /post-vehicles');
  console.log('2. Go to Step 2 (Basic Information)');
  console.log('3. Try typing in these fields:');
  console.log('   - Year: Type "2023" (should allow 4 digits only)');
  console.log('   - Price: Type "25000" (should allow numbers only)');
  console.log('   - Mileage: Type "15000" (should allow numbers only)');
  console.log('   - Doors: Type "4" (should allow 1-2 digits only)');
  console.log('   - Seats: Type "5" (should allow 1-2 digits only)');
  console.log('4. Try typing letters - they should be automatically removed');
  console.log('5. Try typing more than max length - extra digits should be cut off');
  
  console.log('\n✅ Input field test complete!');
  console.log('All numeric fields should now accept manual input properly.');
}

// Test price type dropdown
function testPriceTypeDropdown() {
  console.log('\n💰 Testing Price Type Dropdown...');
  
  const priceTypeSelect = document.querySelector('select');
  
  if (priceTypeSelect) {
    console.log('✅ Price Type dropdown found');
    console.log(`- Current value: "${priceTypeSelect.value}"`);
    console.log(`- Options count: ${priceTypeSelect.options.length}`);
    
    // List all options
    for (let i = 0; i < priceTypeSelect.options.length; i++) {
      const option = priceTypeSelect.options[i];
      console.log(`- Option ${i}: "${option.text}" (value: "${option.value}")`);
    }
    
    // Test selecting different options
    console.log('\n🔄 Testing option selection:');
    const testValues = ['fixed', 'negotiable', 'auction', 'swap'];
    
    testValues.forEach(value => {
      priceTypeSelect.value = value;
      priceTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`- Selected "${value}" → Current value: "${priceTypeSelect.value}"`);
    });
  } else {
    console.log('❌ Price Type dropdown not found');
  }
}

// Export functions
window.testVehicleInputFields = testVehicleInputFields;
window.testPriceTypeDropdown = testPriceTypeDropdown;

console.log('🎯 Vehicle Input Field Test Tools Loaded!');
console.log('Available commands:');
console.log('- testVehicleInputFields() - Test all numeric input fields');
console.log('- testPriceTypeDropdown() - Test price type dropdown');

// Auto-run tests
setTimeout(() => {
  testVehicleInputFields();
  testPriceTypeDropdown();
}, 1000);
