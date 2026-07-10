// Test script to debug image upload issue
const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testImageUpload() {
  // Create a mock image file for testing
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  
  const formData = new FormData();
  formData.append('images[]', mockFile);
  
  // Log FormData contents for debugging
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/promoted-adverts/upload-images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
      },
      body: formData,
    });
    
    const result = await response.json();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test with different field names
async function testDifferentFieldNames() {
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  
  // Test 1: images[]
  console.log('=== Testing with images[] ===');
  const formData1 = new FormData();
  formData1.append('images[]', mockFile);
  console.log('FormData1 entries:');
  for (let [key, value] of formData1.entries()) {
    console.log(key, value);
  }
  
  // Test 2: images (multiple)
  console.log('\n=== Testing with images (multiple) ===');
  const formData2 = new FormData();
  formData2.append('images', mockFile);
  formData2.append('images', mockFile);
  console.log('FormData2 entries:');
  for (let [key, value] of formData2.entries()) {
    console.log(key, value);
  }
}

testDifferentFieldNames();
