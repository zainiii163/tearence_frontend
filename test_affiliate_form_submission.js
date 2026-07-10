// Test Affiliate Form Submission - Verify API + Database Flow
const fetch = require('node-fetch');

const API_BASE = 'http://127.0.0.1:8000/api/v1';

console.log('=== AFFILIATE FORM SUBMISSION TEST ===\n');

async function testImageUpload() {
  console.log('1. Testing Image Upload Endpoint...\n');
  try {
    // Create a mock file (in real scenario, this would be a real file)
    // For testing, we'll use a simple text file to test the endpoint exists
    const formData = new FormData();
    formData.append('file', Buffer.from('test'), { filename: 'test.jpg', contentType: 'image/jpeg' });

    const response = await fetch(`${API_BASE}/affiliates/upload-image`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Image Upload Response:', JSON.stringify(data, null, 2));
    return response.ok && data.success;
  } catch (error) {
    console.log('❌ Image Upload failed:', error.message);
    return false;
  }
}

async function testBusinessOfferCreation() {
  console.log('\n2. Testing Business Offer Creation...\n');
  try {
    const businessData = {
      business_name: 'Test Business Company',
      product_service_title: 'Test Product',
      tagline: 'Test tagline for affiliate program',
      affiliate_category_id: 1, // Assuming category 1 exists
      country: 'United States',
      region: 'North America',
      description: 'This is a test description for the affiliate program.',
      commission_type: 'percentage',
      commission_rate: 25,
      cookie_duration: 30,
      allowed_traffic_types: ['social_media', 'email'],
      restrictions: 'No restrictions',
      tracking_link: 'https://example.com/track',
      promotional_assets: ['https://example.com/banner.jpg'],
      business_email: 'test@example.com',
      website_url: 'https://example.com',
      verification_document: null
    };

    const response = await fetch(`${API_BASE}/affiliates/business-offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(businessData)
    });

    const data = await response.json();
    console.log('Business Offer Response:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ Business Offer Created Successfully');
      console.log('   Offer ID:', data.data?.id);
      return data.data?.id;
    } else {
      console.log('❌ Business Offer Creation Failed');
      if (data.errors) {
        console.log('   Validation Errors:', JSON.stringify(data.errors, null, 2));
      }
      return null;
    }
  } catch (error) {
    console.log('❌ Business Offer Creation Error:', error.message);
    return null;
  }
}

async function testUserPostCreation() {
  console.log('\n3. Testing User Post Creation...\n');
  try {
    const userData = {
      title: 'Test Affiliate Post',
      description: 'This is a test affiliate post description.',
      affiliate_category_id: 1,
      country: 'United Kingdom',
      region: 'Europe',
      affiliate_link: 'https://affiliate-link.com',
      image: 'https://example.com/promo-image.jpg',
      hashtags: ['affiliate', 'deals', 'shopping'],
      target_audience: 'Young professionals'
    };

    const response = await fetch(`${API_BASE}/affiliates/user-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    console.log('User Post Response:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ User Post Created Successfully');
      console.log('   Post ID:', data.data?.id);
      return data.data?.id;
    } else {
      console.log('❌ User Post Creation Failed');
      if (data.errors) {
        console.log('   Validation Errors:', JSON.stringify(data.errors, null, 2));
      }
      return null;
    }
  } catch (error) {
    console.log('❌ User Post Creation Error:', error.message);
    return null;
  }
}

async function testDataRetrieval() {
  console.log('\n4. Testing Data Retrieval from Database...\n');
  try {
    // Get business offers
    const businessResponse = await fetch(`${API_BASE}/affiliates/business-offers`);
    const businessData = await businessResponse.json();
    console.log('Business Offers Retrieved:', businessData.data?.total || 0, 'items');
    
    // Get user posts
    const userResponse = await fetch(`${API_BASE}/affiliates/user-posts`);
    const userData = await userResponse.json();
    console.log('User Posts Retrieved:', userData.data?.total || 0, 'items');

    if (businessData.data?.data?.length > 0) {
      console.log('\n   Sample Business Offer:', JSON.stringify(businessData.data.data[0], null, 2));
    }
    
    if (userData.data?.data?.length > 0) {
      console.log('\n   Sample User Post:', JSON.stringify(userData.data.data[0], null, 2));
    }

    return businessResponse.ok && userResponse.ok;
  } catch (error) {
    console.log('❌ Data Retrieval Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('STARTING FORM SUBMISSION TESTS\n');
  console.log('='.repeat(50) + '\n');

  const imageUploadTest = await testImageUpload();
  const businessOfferId = await testBusinessOfferCreation();
  const userPostId = await testUserPostCreation();
  const dataRetrievalTest = await testDataRetrieval();

  console.log('\n' + '='.repeat(50));
  console.log('\n=== FINAL TEST RESULTS ===\n');
  console.log('Image Upload:', imageUploadTest ? '✅ PASS' : '❌ FAIL');
  console.log('Business Offer Creation:', businessOfferId ? '✅ PASS (ID: ' + businessOfferId + ')' : '❌ FAIL');
  console.log('User Post Creation:', userPostId ? '✅ PASS (ID: ' + userPostId + ')' : '❌ FAIL');
  console.log('Data Retrieval:', dataRetrievalTest ? '✅ PASS' : '❌ FAIL');

  const allPassed = imageUploadTest && businessOfferId && userPostId && dataRetrievalTest;
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - FORMS ARE WORKING CORRECTLY!');
    console.log('✅ Forms submit to real API');
    console.log('✅ Data saves to database');
    console.log('✅ Data can be retrieved from database');
  } else {
    console.log('⚠️  SOME TESTS FAILED - CHECK ERRORS ABOVE');
  }
  console.log('='.repeat(50) + '\n');
}

runAllTests();
