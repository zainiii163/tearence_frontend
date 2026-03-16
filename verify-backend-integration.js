// Verification script to ensure all components use integrated backend
import fs from 'fs';
import path from 'path';

const verifyBackendIntegration = () => {
  console.log('🔍 Verifying Affiliates Hub Backend Integration...\n');

  const results = {
    apiService: { passed: 0, failed: 0, issues: [] },
    components: { passed: 0, failed: 0, issues: [] },
    configuration: { passed: 0, failed: 0, issues: [] }
  };

  // Check 1: API Service Integration
  console.log('📋 Checking API Service Integration...');
  
  try {
    const affiliateServicePath = path.join(__dirname, 'src/services/AffiliateService.js');
    const affiliateService = fs.readFileSync(affiliateServicePath, 'utf8');
    
    // Check for required endpoints
    const requiredEndpoints = [
      'getCategories',
      'getBusinessOffers',
      'createBusinessOffer',
      'getUserPosts',
      'createUserPost',
      'searchAffiliateContent',
      'trackClick',
      'uploadImage',
      'getAnalytics',
      'getPlatformStats'
    ];

    requiredEndpoints.forEach(endpoint => {
      if (affiliateService.includes(`${endpoint}:`)) {
        console.log(`  ✅ ${endpoint} found`);
        results.apiService.passed++;
      } else {
        console.log(`  ❌ ${endpoint} missing`);
        results.apiService.failed++;
        results.apiService.issues.push(`Missing endpoint: ${endpoint}`);
      }
    });

    // Check for new advanced endpoints
    const advancedEndpoints = [
      'uploadAsset',
      'getFeaturedContent',
      'getTrendingContent',
      'getContentByLocation',
      'getAnalyticsSummary',
      'exportAnalytics',
      'bulkUpdateStatus',
      'getNotifications'
    ];

    let advancedFound = 0;
    advancedEndpoints.forEach(endpoint => {
      if (affiliateService.includes(`${endpoint}:`)) {
        advancedFound++;
      }
    });

    if (advancedFound >= advancedEndpoints.length * 0.8) {
      console.log(`  ✅ Advanced endpoints integrated (${advancedFound}/${advancedEndpoints.length})`);
      results.apiService.passed++;
    } else {
      console.log(`  ⚠️  Advanced endpoints partially integrated (${advancedFound}/${advancedEndpoints.length})`);
      results.apiService.issues.push('Some advanced endpoints missing');
    }

  } catch (error) {
    console.log(`  ❌ API Service check failed: ${error.message}`);
    results.apiService.failed++;
    results.apiService.issues.push(`API Service check error: ${error.message}`);
  }

  // Check 2: API Configuration
  console.log('\n📋 Checking API Configuration...');
  
  try {
    const apiConfigPath = path.join(__dirname, 'src/api/index.js');
    const apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
    
    const requiredFeatures = [
      { name: 'Enhanced Error Handling', pattern: /case 503:/ },
      { name: 'Request Tracking', pattern: /X-Request-ID/ },
      { name: 'Caching System', pattern: /api_cache_/ },
      { name: 'File Upload Progress', pattern: /onUploadProgress/ },
      { name: 'Retry Logic', pattern: /retryRequest/ },
      { name: 'Download Functionality', pattern: /downloadFile/ },
      { name: 'Enhanced Timeout', pattern: /timeout: 30000/ }
    ];

    requiredFeatures.forEach(feature => {
      if (apiConfig.match(feature.pattern)) {
        console.log(`  ✅ ${feature.name}`);
        results.configuration.passed++;
      } else {
        console.log(`  ❌ ${feature.name} missing`);
        results.configuration.failed++;
        results.configuration.issues.push(`Missing feature: ${feature.name}`);
      }
    });

  } catch (error) {
    console.log(`  ❌ API Configuration check failed: ${error.message}`);
    results.configuration.failed++;
    results.configuration.issues.push(`API Configuration check error: ${error.message}`);
  }

  // Check 3: Component Integration
  console.log('\n📋 Checking Component Integration...');
  
  try {
    const componentsDir = path.join(__dirname, 'src/Component/affiliates');
    const components = fs.readdirSync(componentsDir);
    
    const keyComponents = [
      'AffiliatePostForm.jsx',
      'forms/BusinessAffiliateForm.jsx',
      'forms/PromoterAffiliateForm.jsx',
      'AffiliateGrid.jsx',
      'AffiliateFilters.jsx'
    ];

    keyComponents.forEach(component => {
      const componentPath = path.join(componentsDir, component);
      if (fs.existsSync(componentPath)) {
        const componentContent = fs.readFileSync(componentPath, 'utf8');
        
        // Check if component uses affiliateService
        if (componentContent.includes('affiliateService') || componentContent.includes('apiUtils')) {
          console.log(`  ✅ ${component} integrated with backend`);
          results.components.passed++;
        } else {
          console.log(`  ❌ ${component} not using backend service`);
          results.components.failed++;
          results.components.issues.push(`${component} not integrated with backend`);
        }
      } else {
        console.log(`  ⚠️  ${component} not found`);
        results.components.issues.push(`${component} missing`);
      }
    });

  } catch (error) {
    console.log(`  ❌ Component Integration check failed: ${error.message}`);
    results.components.failed++;
    results.components.issues.push(`Component Integration check error: ${error.message}`);
  }

  // Check 4: Documentation Integration
  console.log('\n📋 Checking Documentation Integration...');
  
  try {
    const docsPath = path.join(__dirname, 'AFFILIATES_HUB_BACKEND_IMPLEMENTATION.md');
    if (fs.existsSync(docsPath)) {
      console.log('  ✅ Backend implementation documentation exists');
      results.configuration.passed++;
    } else {
      console.log('  ❌ Backend implementation documentation missing');
      results.configuration.failed++;
      results.configuration.issues.push('Backend documentation missing');
    }

    const integrationGuidePath = path.join(__dirname, 'AFFILIATES_HUB_INTEGRATION_GUIDE.md');
    if (fs.existsSync(integrationGuidePath)) {
      console.log('  ✅ Integration guide exists');
      results.configuration.passed++;
    } else {
      console.log('  ❌ Integration guide missing');
      results.configuration.failed++;
      results.configuration.issues.push('Integration guide missing');
    }

  } catch (error) {
    console.log(`  ❌ Documentation check failed: ${error.message}`);
    results.configuration.failed++;
    results.configuration.issues.push(`Documentation check error: ${error.message}`);
  }

  // Summary
  console.log('\n📊 Verification Results Summary:');
  
  const totalPassed = results.apiService.passed + results.components.passed + results.configuration.passed;
  const totalFailed = results.apiService.failed + results.components.failed + results.configuration.failed;
  const totalChecks = totalPassed + totalFailed;
  
  console.log(`✅ Total Passed: ${totalPassed}`);
  console.log(`❌ Total Failed: ${totalFailed}`);
  console.log(`📈 Success Rate: ${((totalPassed / totalChecks) * 100).toFixed(1)}%`);

  if (totalFailed > 0) {
    console.log('\n❌ Issues Found:');
    console.log('API Service Issues:', results.apiService.issues);
    console.log('Component Issues:', results.components.issues);
    console.log('Configuration Issues:', results.configuration.issues);
  }

  if (totalPassed === totalChecks) {
    console.log('\n🎉 All backend integration verification passed!');
    console.log('✅ Affiliates Hub is fully integrated with backend');
    console.log('✅ Ready for production deployment');
  } else {
    console.log('\n⚠️  Some verification checks failed.');
    console.log('Please address the issues above before deployment.');
  }

  return {
    total: totalChecks,
    passed: totalPassed,
    failed: totalFailed,
    successRate: ((totalPassed / totalChecks) * 100).toFixed(1),
    details: results
  };
};

// Run verification if called directly
if (require.main === module) {
  verifyBackendIntegration();
}

export default verifyBackendIntegration;
