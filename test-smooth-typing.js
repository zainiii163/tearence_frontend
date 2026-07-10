// Test Smooth Typing Experience
// Run this in browser console to test that input fields accept natural typing

function testSmoothTyping() {
  console.log('🧪 Testing Smooth Typing Experience...');
  
  // Find all numeric input fields
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
  
  // Test smooth typing simulation
  Object.entries(inputFields).forEach(([fieldName, element]) => {
    if (element) {
      console.log(`\n🔍 Testing ${fieldName} field smooth typing:`);
      
      // Focus the field
      element.focus();
      
      // Test typing speed simulation
      const testText = fieldName === 'year' ? '2023' : 
                       fieldName === 'price' ? '25000' : 
                       fieldName === 'mileage' ? '15000' : 
                       fieldName === 'doors' ? '4' : '5';
      
      console.log(`- Simulating typing: "${testText}"`);
      
      // Clear field first
      element.value = '';
      element.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Simulate rapid typing (character by character)
      let currentValue = '';
      const typingInterval = setInterval(() => {
        if (currentValue.length < testText.length) {
          currentValue += testText[currentValue.length];
          element.value = currentValue;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          console.log(`  Typed: "${currentValue}"`);
        } else {
          clearInterval(typingInterval);
          console.log(`  Final value while typing: "${element.value}"`);
        }
      }, 50); // 50ms between characters = fast typing
      
      // Test blur event (when user leaves field)
      setTimeout(() => {
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        console.log(`  Value after blur: "${element.value}"`);
      }, testText.length * 50 + 100);
      
    } else {
      console.log(`❌ ${fieldName} field not found`);
    }
  });
  
  // Test typing letters (should be cleaned on blur)
  setTimeout(() => {
    console.log('\n🔤 Testing letter input (should be cleaned on blur):');
    
    const yearField = inputFields.year;
    if (yearField) {
      yearField.focus();
      yearField.value = '20a2b3c';
      yearField.dispatchEvent(new Event('input', { bubbles: true }));
      console.log(`- Typed letters: "20a2b3c" → Value: "${yearField.value}"`);
      
      // Trigger blur to clean up
      setTimeout(() => {
        yearField.dispatchEvent(new Event('blur', { bubbles: true }));
        console.log(`- After blur: "${yearField.value}" (should be "2023")`);
      }, 100);
    }
  }, 2000);
  
  console.log('\n🎯 Manual Testing Instructions:');
  console.log('1. Navigate to /post-vehicles');
  console.log('2. Go to Step 2 (Basic Information)');
  console.log('3. Try typing naturally in these fields:');
  console.log('   - Year: Type "2023" quickly (should accept all characters)');
  console.log('   - Price: Type "25000" quickly (should accept all characters)');
  console.log('   - Mileage: Type "15000" quickly (should accept all characters)');
  console.log('   - Doors: Type "4" (should accept single character)');
  console.log('   - Seats: Type "5" (should accept single character)');
  console.log('4. Try typing letters: "abc123" (should show letters while typing)');
  console.log('5. Click outside the field (blur) - letters should be removed');
  console.log('6. Values should be cleaned automatically when you leave the field');
  
  console.log('\n✅ Expected Behavior:');
  console.log('- ✅ Smooth, natural typing without character-by-character filtering');
  console.log('- ✅ Letters allowed while typing (for better UX)');
  console.log('- ✅ Automatic cleanup when user leaves the field');
  console.log('- ✅ Max length enforced (no extra characters)');
  console.log('- ✅ Numeric keypad on mobile devices');
  
  console.log('\n🎉 Smooth typing test complete!');
}

// Test mobile keyboard behavior
function testMobileKeyboard() {
  console.log('\n📱 Testing Mobile Keyboard Behavior...');
  
  const numericFields = document.querySelectorAll('input[inputMode="numeric"]');
  
  console.log(`Found ${numericFields.length} numeric input fields`);
  
  numericFields.forEach((field, index) => {
    console.log(`Field ${index + 1}:`);
    console.log(`- Input mode: ${field.inputMode}`);
    console.log(`- Max length: ${field.maxLength}`);
    console.log(`- Type: ${field.type}`);
    console.log(`- Placeholder: ${field.placeholder}`);
  });
  
  console.log('\n📱 Mobile Testing:');
  console.log('On mobile devices, these fields should show the numeric keyboard');
  console.log('instead of the full alphabetic keyboard for better user experience.');
}

// Export functions
window.testSmoothTyping = testSmoothTyping;
window.testMobileKeyboard = testMobileKeyboard;

console.log('🎯 Smooth Typing Test Tools Loaded!');
console.log('Available commands:');
console.log('- testSmoothTyping() - Test natural typing experience');
console.log('- testMobileKeyboard() - Test mobile keyboard behavior');

// Auto-run tests
setTimeout(() => {
  testSmoothTyping();
  testMobileKeyboard();
}, 1000);
