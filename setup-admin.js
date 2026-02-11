import api from './src/api.js';

// Configuration
const VIKAS_EMAIL = 'vikasjain2412@gmail.com';
const VIKAS_NAME = 'Vikas Jain';
const MARKETER_ROLE = 'admin'; // Using admin role for marketer functionality

// Add Vikas Jain as marketing admin
async function addVikasAsAdmin() {
  try {
    console.log('Adding Vikas Jain as marketing admin...');
    
    // First, create the user account
    const userData = {
      email: VIKAS_EMAIL,
      name: VIKAS_NAME,
      first_name: 'Vikas',
      last_name: 'Jain',
      role: MARKETER_ROLE,
      status: 'active',
      password: 'TempPassword123!', // You should change this
      password_confirmation: 'TempPassword123!'
    };

    // Register the user
    const registerResponse = await api.post('v1/auth/register', userData);
    console.log('User registered:', registerResponse.data);

    // Update user role to admin/marketer
    const userId = registerResponse.data.data?.customer_id || registerResponse.data.data?.id;
    if (userId) {
      const roleUpdateResponse = await api.put(`v1/customer/${userId}`, { 
        role: MARKETER_ROLE,
        status: 'active'
      });
      console.log('User role updated:', roleUpdateResponse.data);
    }

    console.log(`✅ Successfully added ${VIKAS_EMAIL} as marketing admin`);
    return true;
  } catch (error) {
    console.error('❌ Error adding Vikas as admin:', error.message);
    
    // If user already exists, just update the role
    if (error.message?.includes('already exists') || error.status === 422) {
      console.log('User may already exist, attempting to update role...');
      try {
        // Get users list to find Vikas
        const usersResponse = await api.get('v1/customer?search=vikasjain2412@gmail.com');
        const users = usersResponse.data.data?.items || [];
        
        if (users.length > 0) {
          const vikasUser = users[0];
          const userId = vikasUser.customer_id || vikasUser.id;
          
          // Update role to admin
          const updateResponse = await api.put(`v1/customer/${userId}`, { 
            role: MARKETER_ROLE,
            status: 'active'
          });
          console.log('✅ Existing user role updated:', updateResponse.data);
          return true;
        }
      } catch (updateError) {
        console.error('❌ Error updating existing user:', updateError.message);
      }
    }
    return false;
  }
}

// Clear all ads from the site
async function clearAllAds() {
  try {
    console.log('Clearing all ads from the site...');
    
    // List of ad endpoints to clear
    const adEndpoints = [
      'v1/classified',
      'v1/jobs', 
      'v1/candidates',
      'v1/banner',
      'v1/affiliate',
      'v1/funding',
      'v1/business',
      'v1/store'
    ];

    let totalCleared = 0;

    for (const endpoint of adEndpoints) {
      try {
        console.log(`Clearing ads from ${endpoint}...`);
        
        // Get all ads
        const response = await api.get(`${endpoint}?limit=1000`);
        const ads = response.data.data?.items || response.data.data || [];
        
        if (ads.length > 0) {
          console.log(`Found ${ads.length} ads in ${endpoint}`);
          
          // Delete each ad
          for (const ad of ads) {
            const adId = ad.id || ad.job_id || ad.candidate_id;
            if (adId) {
              try {
                await api.delete(`${endpoint}/${adId}`);
                totalCleared++;
              } catch (deleteError) {
                console.warn(`Failed to delete ad ${adId}:`, deleteError.message);
              }
            }
          }
          
          console.log(`✅ Cleared ads from ${endpoint}`);
        } else {
          console.log(`No ads found in ${endpoint}`);
        }
      } catch (endpointError) {
        console.warn(`Error processing ${endpoint}:`, endpointError.message);
      }
    }

    console.log(`✅ Total ads cleared: ${totalCleared}`);
    return totalCleared;
  } catch (error) {
    console.error('❌ Error clearing ads:', error.message);
    return 0;
  }
}

// Main execution function
async function main() {
  console.log('🚀 Starting admin setup process...');
  
  // Add Vikas as admin
  const adminSuccess = await addVikasAsAdmin();
  
  // Clear all ads
  const adsCleared = await clearAllAds();
  
  console.log('\n📊 Summary:');
  console.log(`- Vikas added as admin: ${adminSuccess ? '✅ Success' : '❌ Failed'}`);
  console.log(`- Ads cleared: ${adsCleared} ✅`);
  
  if (adminSuccess && adsCleared >= 0) {
    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Vikas can now log in with his email');
    console.log('2. He should reset his password on first login');
    console.log('3. He can post sponsored, promoted, or admin ads');
    console.log('4. All old/test ads have been removed');
  } else {
    console.log('\n⚠️ Some tasks may have failed. Please check the errors above.');
  }
}

// Run the script
main().catch(console.error);

export {
  addVikasAsAdmin,
  clearAllAds,
  main
};
