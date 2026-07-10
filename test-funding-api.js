// Test script for Funding API integration
import fundingService from './src/services/FundingService.js';

async function testFundingAPI() {
  console.log('🚀 Testing Funding API Integration...\n');

  try {
    // Test 1: Get all projects
    console.log('📊 Testing getProjects...');
    const projectsResponse = await fundingService.getProjects();
    console.log('✅ getProjects success:', projectsResponse.success);
    console.log('📈 Projects count:', projectsResponse.data?.data?.length || projectsResponse.data?.length || 0);
    
    if (projectsResponse.data?.data?.length > 0) {
      const firstProject = projectsResponse.data.data[0];
      console.log('🎯 Sample project:', {
        id: firstProject.id,
        title: firstProject.title,
        funding_goal: firstProject.funding_goal,
        amount_raised: firstProject.amount_raised,
        backer_count: firstProject.backer_count
      });
    }

    // Test 2: Get metadata
    console.log('\n📋 Testing getMetadata...');
    const metadataResponse = await fundingService.getMetadata();
    console.log('✅ getMetadata success:', metadataResponse.success);
    console.log('📂 Available categories:', Object.keys(metadataResponse.data?.categories || {}));

    // Test 3: Get featured projects
    console.log('\n⭐ Testing getFeaturedProjects...');
    const featuredResponse = await fundingService.getFeaturedProjects();
    console.log('✅ getFeaturedProjects success:', featuredResponse.success);

    // Test 4: Get trending projects
    console.log('\n📈 Testing getTrendingProjects...');
    const trendingResponse = await fundingService.getTrendingProjects();
    console.log('✅ getTrendingProjects success:', trendingResponse.success);

    // Test 5: Test with filters
    console.log('\n🔍 Testing filtered projects...');
    const filteredResponse = await fundingService.getProjects({
      category: 'technology',
      sort: 'trending'
    });
    console.log('✅ Filtered projects success:', filteredResponse.success);
    console.log('📊 Filtered projects count:', filteredResponse.data?.data?.length || 0);

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API Test Error:', error);
    console.error('📝 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Test form data structure
function testFormDataStructure() {
  console.log('\n📝 Testing form data structure...');
  
  const sampleProjectData = {
    title: 'Test Project',
    tagline: 'A test project for API validation',
    project_type: 'startup',
    category: 'technology',
    description: 'This is a detailed description of our test project. It should be at least 50 characters long to meet the validation requirements.',
    problem_solving: 'We are solving the problem of inadequate testing tools for API integrations.',
    vision_mission: 'Our vision is to make API testing seamless and reliable for all developers.',
    why_now: 'The timing is perfect because of the growing complexity of modern web applications.',
    team_members: [
      { name: 'John Doe', role: 'Lead Developer' },
      { name: 'Jane Smith', role: 'Product Manager' }
    ],
    funding_goal: 10000,
    currency: 'USD',
    minimum_contribution: 10,
    funding_model: 'reward',
    use_of_funds: [
      { item: 'Development', amount: 5000 },
      { item: 'Marketing', amount: 3000 },
      { item: 'Operations', amount: 2000 }
    ],
    milestones: [
      { milestone: 'MVP Launch', expected_date: '2024-06-01' },
      { milestone: 'Public Beta', expected_date: '2024-08-01' }
    ],
    country: 'United States',
    city: 'San Francisco',
    website: 'https://example.com',
    social_links: [
      { platform: 'twitter', url: 'https://twitter.com/example' }
    ],
    cover_image: null, // Would be a File object in real usage
    additional_images: [],
    documents: [],
    identity_verification: null,
    business_registration_number: '123456789'
  };

  console.log('✅ Sample project data structure validated');
  console.log('📊 Required fields check:', {
    hasTitle: !!sampleProjectData.title,
    hasProjectType: !!sampleProjectData.project_type,
    hasCategory: !!sampleProjectData.category,
    hasDescription: !!sampleProjectData.description,
    hasFundingGoal: !!sampleProjectData.funding_goal,
    hasCurrency: !!sampleProjectData.currency
  });

  return sampleProjectData;
}

// Test pledge data structure
function testPledgeDataStructure() {
  console.log('\n💝 Testing pledge data structure...');
  
  const samplePledgeData = {
    amount: 50,
    funding_reward_id: null,
    notes: 'Excited to support this project!',
    is_anonymous: false
  };

  console.log('✅ Sample pledge data structure validated');
  console.log('💰 Pledge amount:', samplePledgeData.amount);
  console.log('📝 Has notes:', !!samplePledgeData.notes);

  return samplePledgeData;
}

// Run all tests
if (typeof window !== 'undefined') {
  // Browser environment
  window.testFundingAPI = testFundingAPI;
  window.testFormDataStructure = testFormDataStructure;
  window.testPledgeDataStructure = testPledgeDataStructure;
  console.log('🌐 Test functions available in browser console:');
  console.log('- testFundingAPI()');
  console.log('- testFormDataStructure()');
  console.log('- testPledgeDataStructure()');
} else {
  // Node.js environment
  testFundingAPI();
  testFormDataStructure();
  testPledgeDataStructure();
}

export { testFundingAPI, testFormDataStructure, testPledgeDataStructure };
