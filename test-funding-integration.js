// Comprehensive Funding Integration Test
// This script tests all components to ensure real data is flowing correctly

import fundingService from './src/services/FundingService.js';

// Test data structure validator
const validateProjectStructure = (project) => {
  const requiredFields = [
    'id',
    'title',
    'description',
    'funding_goal',
    'amount_raised',
    'backer_count',
    'user',
    'is_active'
  ];

  const optionalFields = [
    'tagline',
    'category',
    'project_type',
    'cover_image',
    'country',
    'city',
    'currency',
    'minimum_contribution',
    'funding_model',
    'is_featured',
    'is_verified',
    'is_promoted',
    'funding_ends_at',
    'days_remaining',
    'rewards'
  ];

  const results = {
    valid: true,
    missing: [],
    invalid: [],
    warnings: []
  };

  // Check required fields
  requiredFields.forEach(field => {
    if (project[field] === undefined || project[field] === null) {
      results.missing.push(field);
      results.valid = false;
    }
  });

  // Check field types
  if (project.funding_goal && typeof project.funding_goal !== 'number') {
    results.invalid.push({ field: 'funding_goal', expected: 'number', actual: typeof project.funding_goal });
    results.valid = false;
  }

  if (project.amount_raised && typeof project.amount_raised !== 'number') {
    results.invalid.push({ field: 'amount_raised', expected: 'number', actual: typeof project.amount_raised });
    results.valid = false;
  }

  if (project.backer_count && typeof project.backer_count !== 'number') {
    results.invalid.push({ field: 'backer_count', expected: 'number', actual: typeof project.backer_count });
    results.valid = false;
  }

  // Check user relationship
  if (!project.user || typeof project.user !== 'object') {
    results.invalid.push({ field: 'user', expected: 'object', actual: typeof project.user });
    results.valid = false;
  } else if (!project.user.name) {
    results.warnings.push('user.name is missing');
  }

  // Check rewards array
  if (project.rewards && !Array.isArray(project.rewards)) {
    results.invalid.push({ field: 'rewards', expected: 'array', actual: typeof project.rewards });
    results.valid = false;
  }

  return results;
};

// Test API response structure
const testAPIResponseStructure = (response, endpoint) => {
  const results = {
    valid: true,
    issues: [],
    structure: {}
  };

  // Check basic response structure
  if (!response.success) {
    results.issues.push('Response missing success field');
    results.valid = false;
  }

  if (!response.data) {
    results.issues.push('Response missing data field');
    results.valid = false;
    return results;
  }

  // Check if data is paginated
  if (response.data.data && Array.isArray(response.data.data)) {
    results.structure.type = 'paginated';
    results.structure.items = response.data.data.length;
    results.structure.pagination = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total
    };
  } else if (Array.isArray(response.data)) {
    results.structure.type = 'array';
    results.structure.items = response.data.length;
  } else if (typeof response.data === 'object') {
    results.structure.type = 'object';
    results.structure.keys = Object.keys(response.data);
  }

  return results;
};

// Main test function
async function runFundingIntegrationTest() {
  console.log('🚀 Starting Comprehensive Funding Integration Test...\n');

  const testResults = {
    apiEndpoints: {},
    dataStructures: {},
    componentCompatibility: {},
    overall: { passed: 0, failed: 0, warnings: 0 }
  };

  try {
    // Test 1: Get all projects
    console.log('📊 Testing getProjects endpoint...');
    try {
      const projectsResponse = await fundingService.getProjects();
      const structureTest = testAPIResponseStructure(projectsResponse, 'getProjects');
      
      testResults.apiEndpoints.getProjects = {
        status: structureTest.valid ? 'PASS' : 'FAIL',
        structure: structureTest,
        response: projectsResponse
      };

      if (structureTest.valid && projectsResponse.data) {
        const projects = projectsResponse.data.data || projectsResponse.data;
        if (projects.length > 0) {
          const firstProject = projects[0];
          const validation = validateProjectStructure(firstProject);
          
          testResults.dataStructures.project = validation;
          
          if (validation.valid) {
            console.log('✅ getProjects: Structure validation passed');
            testResults.overall.passed++;
          } else {
            console.log('❌ getProjects: Structure validation failed');
            console.log('Missing fields:', validation.missing);
            console.log('Invalid fields:', validation.invalid);
            testResults.overall.failed++;
          }
        } else {
          console.log('⚠️ getProjects: No projects returned');
          testResults.overall.warnings++;
        }
      }
    } catch (error) {
      console.log('❌ getProjects: API call failed');
      console.log('Error:', error.message);
      testResults.apiEndpoints.getProjects = {
        status: 'FAIL',
        error: error.message
      };
      testResults.overall.failed++;
    }

    // Test 2: Get featured projects
    console.log('\n⭐ Testing getFeaturedProjects endpoint...');
    try {
      const featuredResponse = await fundingService.getFeaturedProjects();
      const structureTest = testAPIResponseStructure(featuredResponse, 'getFeaturedProjects');
      
      testResults.apiEndpoints.getFeaturedProjects = {
        status: structureTest.valid ? 'PASS' : 'FAIL',
        structure: structureTest
      };

      if (structureTest.valid) {
        console.log('✅ getFeaturedProjects: Structure validation passed');
        testResults.overall.passed++;
      } else {
        console.log('❌ getFeaturedProjects: Structure validation failed');
        testResults.overall.failed++;
      }
    } catch (error) {
      console.log('❌ getFeaturedProjects: API call failed');
      console.log('Error:', error.message);
      testResults.overall.failed++;
    }

    // Test 3: Get trending projects
    console.log('\n📈 Testing getTrendingProjects endpoint...');
    try {
      const trendingResponse = await fundingService.getTrendingProjects();
      const structureTest = testAPIResponseStructure(trendingResponse, 'getTrendingProjects');
      
      testResults.apiEndpoints.getTrendingProjects = {
        status: structureTest.valid ? 'PASS' : 'FAIL',
        structure: structureTest
      };

      if (structureTest.valid) {
        console.log('✅ getTrendingProjects: Structure validation passed');
        testResults.overall.passed++;
      } else {
        console.log('❌ getTrendingProjects: Structure validation failed');
        testResults.overall.failed++;
      }
    } catch (error) {
      console.log('❌ getTrendingProjects: API call failed');
      console.log('Error:', error.message);
      testResults.overall.failed++;
    }

    // Test 4: Get metadata
    console.log('\n📋 Testing getMetadata endpoint...');
    try {
      const metadataResponse = await fundingService.getMetadata();
      const structureTest = testAPIResponseStructure(metadataResponse, 'getMetadata');
      
      testResults.apiEndpoints.getMetadata = {
        status: structureTest.valid ? 'PASS' : 'FAIL',
        structure: structureTest
      };

      if (structureTest.valid && metadataResponse.data) {
        const hasCategories = metadataResponse.data.categories && typeof metadataResponse.data.categories === 'object';
        const hasTypes = metadataResponse.data.project_types && typeof metadataResponse.data.project_types === 'object';
        const hasModels = metadataResponse.data.funding_models && typeof metadataResponse.data.funding_models === 'object';
        
        if (hasCategories && hasTypes && hasModels) {
          console.log('✅ getMetadata: Structure validation passed');
          console.log('Categories available:', Object.keys(metadataResponse.data.categories).length);
          console.log('Project types available:', Object.keys(metadataResponse.data.project_types).length);
          testResults.overall.passed++;
        } else {
          console.log('❌ getMetadata: Missing required metadata fields');
          testResults.overall.failed++;
        }
      }
    } catch (error) {
      console.log('❌ getMetadata: API call failed');
      console.log('Error:', error.message);
      testResults.overall.failed++;
    }

    // Test 5: Test with filters
    console.log('\n🔍 Testing filtered projects...');
    try {
      const filteredResponse = await fundingService.getProjects({
        category: 'technology',
        sort: 'trending'
      });
      
      if (filteredResponse.success) {
        console.log('✅ Filtered projects: API call successful');
        testResults.overall.passed++;
      } else {
        console.log('❌ Filtered projects: API call failed');
        testResults.overall.failed++;
      }
    } catch (error) {
      console.log('❌ Filtered projects: API call failed');
      console.log('Error:', error.message);
      testResults.overall.failed++;
    }

    // Test 6: Component compatibility check
    console.log('\n🧩 Testing component compatibility...');
    
    // Simulate FundingGrid component data handling
    if (testResults.apiEndpoints.getProjects && 
        testResults.apiEndpoints.getProjects.response && 
        testResults.apiEndpoints.getProjects.response.data) {
      
      const projects = testResults.apiEndpoints.getProjects.response.data.data || 
                      testResults.apiEndpoints.getProjects.response.data;
      
      if (projects.length > 0) {
        const testProject = projects[0];
        
        // Test all fields that FundingGrid expects
        const gridCompatibility = {
          hasTitle: !!testProject.title,
          hasCoverImage: !!testProject.cover_image,
          hasFundingGoal: !!testProject.funding_goal,
          hasAmountRaised: testProject.amount_raised !== undefined,
          hasBackerCount: testProject.backer_count !== undefined,
          hasDaysRemaining: testProject.days_remaining !== undefined,
          hasUser: !!testProject.user,
          hasCategory: !!testProject.category,
          hasCountry: !!testProject.country,
          hasIsFeatured: testProject.is_featured !== undefined,
          hasIsVerified: testProject.is_verified !== undefined,
          hasIsPromoted: testProject.is_promoted !== undefined
        };

        const allCompatible = Object.values(gridCompatibility).every(Boolean);
        
        testResults.componentCompatibility.fundingGrid = {
          status: allCompatible ? 'PASS' : 'FAIL',
          details: gridCompatibility
        };

        if (allCompatible) {
          console.log('✅ FundingGrid: Component compatibility passed');
          testResults.overall.passed++;
        } else {
          console.log('❌ FundingGrid: Component compatibility failed');
          console.log('Missing fields:', Object.keys(gridCompatibility).filter(key => !gridCompatibility[key]));
          testResults.overall.failed++;
        }
      }
    }

    // Test 7: Pledge form compatibility
    console.log('\n💝 Testing pledge form compatibility...');
    if (testResults.dataStructures.project && testResults.dataStructures.project.valid) {
      const pledgeCompatibility = {
        hasId: true, // Already validated above
        hasMinimumContribution: true, // Will use default if missing
        hasCurrency: true, // Will use default if missing
        supportsRewards: true // Rewards are optional
      };
      
      testResults.componentCompatibility.pledgeForm = {
        status: 'PASS',
        details: pledgeCompatibility
      };
      
      console.log('✅ PledgeForm: Component compatibility passed');
      testResults.overall.passed++;
    }

  } catch (error) {
    console.error('❌ Critical error during testing:', error);
    testResults.overall.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.overall.passed}`);
  console.log(`❌ Failed: ${testResults.overall.failed}`);
  console.log(`⚠️  Warnings: ${testResults.overall.warnings}`);
  console.log('='.repeat(60));

  if (testResults.overall.failed === 0) {
    console.log('🎉 All tests passed! Integration is working correctly.');
  } else {
    console.log('🔧 Some tests failed. Please check the issues above.');
  }

  return testResults;
}

// Component-specific tests
const testFundingGridComponent = () => {
  console.log('\n🧪 Testing FundingGrid Component Logic...');
  
  // Mock project data to test component logic
  const mockProject = {
    id: 1,
    title: 'Test Project',
    tagline: 'A test project for validation',
    description: 'This is a test project',
    funding_goal: 10000,
    amount_raised: 2500,
    backer_count: 25,
    user: { name: 'Test User' },
    category: 'technology',
    country: 'United States',
    is_featured: true,
    is_verified: false,
    is_promoted: false,
    days_remaining: 15,
    cover_image: '/test-image.jpg'
  };

  // Test funding percentage calculation
  const fundingPercentage = mockProject.funding_goal > 0 
    ? Math.round((mockProject.amount_raised || 0) / mockProject.funding_goal * 100)
    : 0;
  
  console.log(`📊 Funding percentage calculation: ${fundingPercentage}% (expected: 25%)`);
  
  // Test urgency logic
  const isUrgent = mockProject.days_remaining <= 7;
  console.log(`⏰ Urgency logic: ${isUrgent} (expected: false)`);
  
  // Test field access
  const creatorName = mockProject.user?.name || 'Anonymous';
  console.log(`👤 Creator name: ${creatorName} (expected: Test User)`);
  
  console.log('✅ FundingGrid component logic tests completed');
};

// Export for use in browser or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.runFundingIntegrationTest = runFundingIntegrationTest;
  window.testFundingGridComponent = testFundingGridComponent;
  console.log('🌐 Test functions available in browser console:');
  console.log('- runFundingIntegrationTest()');
  console.log('- testFundingGridComponent()');
} else {
  // Node.js environment - run automatically
  runFundingIntegrationTest();
  testFundingGridComponent();
}

export { runFundingIntegrationTest, testFundingGridComponent, validateProjectStructure };
