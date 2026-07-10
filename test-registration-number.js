// Test Registration Number Field (formerly VIN)
// Run this in browser console to verify the field change

function testRegistrationNumberField() {
  console.log('🧪 Testing Registration Number Field...');
  
  // Find the registration number field (was VIN)
  const regNumberField = document.querySelector('input[placeholder*="ABC 123"]');
  
  if (regNumberField) {
    console.log('✅ Registration Number field found');
    console.log(`- Label: ${regNumberField.previousElementSibling?.textContent}`);
    console.log(`- Placeholder: "${regNumberField.placeholder}"`);
    console.log(`- Max length: ${regNumberField.maxLength}`);
    console.log(`- Current value: "${regNumberField.value}"`);
    console.log(`- Type: ${regNumberField.type}`);
    
    // Test typing in the field
    console.log('\n🔤 Testing field input:');
    
    // Focus the field
    regNumberField.focus();
    
    // Clear and type test registration numbers
    const testValues = ['ABC 123', 'XYZ 999', 'AB12 CD34', 'TEST-123'];
    
    testValues.forEach((value, index) => {
      setTimeout(() => {
        regNumberField.value = '';
        regNumberField.value = value;
        regNumberField.dispatchEvent(new Event('input', { bubbles: true }));
        regNumberField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`- Typed: "${value}" → Field value: "${regNumberField.value}"`);
      }, index * 1000);
    });
    
    // Check if there are any duplicate registration number fields
    setTimeout(() => {
      const allRegFields = document.querySelectorAll('input[placeholder*="ABC 123"]');
      console.log(`\n📊 Found ${allRegFields.length} registration number fields`);
      
      if (allRegFields.length === 1) {
        console.log('✅ SUCCESS: Only one registration number field found');
      } else {
        console.log('❌ WARNING: Multiple registration number fields found');
        allRegFields.forEach((field, index) => {
          console.log(`  Field ${index + 1}: "${field.value}"`);
        });
      }
    }, testValues.length * 1000 + 500);
    
  } else {
    console.log('❌ Registration Number field not found');
    console.log('Looking for input with placeholder containing "ABC 123"');
    
    // Try to find any input that might be the registration field
    const allInputs = document.querySelectorAll('input[type="text"]');
    console.log(`Found ${allInputs.length} text inputs:`);
    
    allInputs.forEach((input, index) => {
      console.log(`  ${index + 1}. Placeholder: "${input.placeholder}", Value: "${input.value}"`);
    });
  }
  
  // Verify the old VIN field is gone
  setTimeout(() => {
    const vinField = document.querySelector('input[placeholder*="Vehicle Identification"]');
    const vinField2 = document.querySelector('input[placeholder*="VIN"]');
    
    console.log('\n🔍 Checking for old VIN fields:');
    console.log(`- VIN field (Vehicle Identification): ${vinField ? '❌ Still exists' : '✅ Removed'}`);
    console.log(`- VIN field (VIN): ${vinField2 ? '❌ Still exists' : '✅ Removed'}`);
    
    if (!vinField && !vinField2) {
      console.log('✅ SUCCESS: Old VIN fields have been removed');
    }
  }, 100);
  
  console.log('\n🎯 Expected Behavior:');
  console.log('✅ Field should be labeled "Registration Number *"');
  console.log('✅ Placeholder should be "e.g., ABC 123"');
  console.log('✅ Max length should be 20 characters');
  console.log('✅ Should accept alphanumeric characters and spaces');
  console.log('✅ Should have validation error handling');
  console.log('✅ No duplicate registration number fields');
  
  console.log('\n📱 Manual Testing Instructions:');
  console.log('1. Navigate to /post-vehicles');
  console.log('2. Go to Step 4 (Vehicle Specifications)');
  console.log('3. Look for "Registration Number *" field');
  console.log('4. Try typing registration numbers like:');
  console.log('   - "ABC 123"');
  console.log('   - "XYZ 999"');
  console.log('   - "AB12 CD34"');
  console.log('5. Verify there is no separate VIN field');
  console.log('6. Test validation with invalid data');
  
  console.log('\n🎉 Registration Number field test complete!');
}

// Test form submission with registration number
function testFormSubmission() {
  console.log('\n📤 Testing Form Submission...');
  
  // Find the registration number field
  const regField = document.querySelector('input[placeholder*="ABC 123"]');
  
  if (regField) {
    // Set a test value
    regField.value = 'TEST 123';
    regField.dispatchEvent(new Event('input', { bubbles: true }));
    regField.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log(`✅ Set registration number to: "${regField.value}"`);
    
    // Check if form data includes the registration number
    console.log('📋 Form data should include:');
    console.log('- vin: "TEST 123" (this field stores the registration number)');
    console.log('- registration_number: (may be empty since we removed the separate field)');
    
  } else {
    console.log('❌ Registration Number field not found for submission test');
  }
}

// Export functions
window.testRegistrationNumberField = testRegistrationNumberField;
window.testFormSubmission = testFormSubmission;

console.log('🎯 Registration Number Test Tools Loaded!');
console.log('Available commands:');
console.log('- testRegistrationNumberField() - Test the registration number field');
console.log('- testFormSubmission() - Test form submission with registration number');

// Auto-run tests
setTimeout(() => {
  testRegistrationNumberField();
  testFormSubmission();
}, 1000);
