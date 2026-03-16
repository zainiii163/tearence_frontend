// Test script to verify Jobs Marketplace API integration
// Run this script in the browser console to test API connections

// Test Jobs API endpoints
const testJobsApi = async () => {
  console.log('🧪 Testing Jobs Marketplace API Integration...');
  
  try {
    // Test 1: Get categories
    console.log('📂 Test 1: Getting job categories...');
    const categories = await jobService.getCategories();
    console.log('✅ Categories loaded:', categories);
    
    // Test 2: Get jobs
    console.log('📂 Test 2: Getting jobs...');
    const jobs = await jobService.getJobs({
      page: 1,
      per_page: 10
    });
    console.log('✅ Jobs loaded:', jobs);
    
    // Test 3: Get job statistics
    console.log('📂 Test 3: Getting job statistics...');
    const stats = await jobService.getStats();
    console.log('✅ Statistics loaded:', stats);
    
    // Test 4: Search jobs
    console.log('📂 Test 4: Searching jobs...');
    const searchResults = await jobService.searchJobs({
      search: 'developer',
      country: 'United States'
    });
    console.log('✅ Search results loaded:', searchResults);
    
    // Test 5: Get job seekers
    console.log('📂 Test 5: Getting job seekers...');
    const seekers = await jobService.getJobSeekers({
      per_page: 5
    });
    console.log('✅ Job seekers loaded:', seekers);
    
    // Test 6: Create job (mock data)
    console.log('📂 Test 6: Creating test job...');
    try {
      const testJob = {
        title: 'Test React Developer',
        company_name: 'Test Company',
        description: 'We are looking for a skilled React developer...',
        responsibilities: 'Develop React applications, write clean code',
        requirements: '3+ years React experience, JavaScript proficiency',
        country: 'United States',
        city: 'New York',
        work_type: 'full_time',
        salary_range: '$70,000 - $90,000',
        currency: 'USD',
        application_method: 'platform',
        terms_accepted: true,
        accurate_info: true
      };
      
      const createdJob = await jobService.createJob(testJob);
      console.log('✅ Test job created:', createdJob);
    } catch (error) {
      console.error('❌ Error creating test job:', error);
    }
    
    // Test 7: Create seeker profile (mock data)
    console.log('📂 Test 7: Creating test seeker profile...');
    try {
      const testSeeker = {
        full_name: 'John Doe',
        profession: 'Full Stack Developer',
        country: 'United States',
        city: 'San Francisco',
        remote_availability: true,
        years_of_experience: 5,
        key_skills: 'React, Node.js, JavaScript, Python',
        education_level: 'bachelor',
        desired_role: 'Senior Developer',
        salary_expectation: '$90,000 - $120,000',
        work_type: 'full_time',
        bio: 'Experienced full stack developer with 5+ years experience...'
      };
      
      const createdSeeker = await jobService.createSeekerProfile(testSeeker);
      console.log('✅ Test seeker profile created:', createdSeeker);
    } catch (error) {
      console.error('❌ Error creating test seeker profile:', error);
    }
    
    console.log('🎉 All Jobs API tests completed!');
    
  } catch (error) {
    console.error('❌ Jobs API Test Error:', error);
  }
};

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  testJobsApi();
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testJobsApi };
}
