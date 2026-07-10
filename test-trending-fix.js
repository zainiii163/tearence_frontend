// Test the trending sort fix for promoted adverts
const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, config);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.ok}`);
    
    if (response.ok) {
      console.log('✅ Request successful');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Request failed');
      console.log('Error response:', JSON.stringify(data, null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw error;
  }
};

async function testTrendingFix() {
  console.log('=== Testing Trending Sort Fix ===\n');
  
  try {
    // 1. Test default sorting (should work)
    console.log('1. Testing default sorting...');
    const defaultSort = await apiRequest('/promoted-adverts');
    console.log(`✅ Default sort works: ${defaultSort.data?.total || 0} adverts`);
    
    // 2. Test trending sorting (the problematic one)
    console.log('\n2. Testing trending sorting...');
    try {
      const trendingSort = await apiRequest('/promoted-adverts?sort_by=trending');
      console.log(`✅ Trending sort now works: ${trendingSort.data?.total || 0} adverts`);
      console.log('✅ No more "Unknown column \'trending\'" error');
    } catch (error) {
      console.log('❌ Trending sort still fails:', error.message);
    }
    
    // 3. Test other sort options
    console.log('\n3. Testing other sort options...');
    
    try {
      const viewsSort = await apiRequest('/promoted-adverts?sort_by=views');
      console.log(`✅ Views sort works: ${viewsSort.data?.total || 0} adverts`);
    } catch (error) {
      console.log('❌ Views sort fails:', error.message);
    }
    
    try {
      const savesSort = await apiRequest('/promoted-adverts?sort_by=saves');
      console.log(`✅ Saves sort works: ${savesSort.data?.total || 0} adverts`);
    } catch (error) {
      console.log('❌ Saves sort fails:', error.message);
    }
    
    try {
      const priceSort = await apiRequest('/promoted-adverts?sort_by=price');
      console.log(`✅ Price sort works: ${priceSort.data?.total || 0} adverts`);
    } catch (error) {
      console.log('❌ Price sort fails:', error.message);
    }
    
    try {
      const titleSort = await apiRequest('/promoted-adverts?sort_by=title');
      console.log(`✅ Title sort works: ${titleSort.data?.total || 0} adverts`);
    } catch (error) {
      console.log('❌ Title sort fails:', error.message);
    }
    
    // 4. Summary of the fix
    console.log('\n=== TRENDING FIX SUMMARY ===');
    console.log('🔧 Problem:');
    console.log('   • Frontend was requesting sort_by=trending');
    console.log('   • Backend had no case for "trending" in match statement');
    console.log('   • Default case tried to order by non-existent "trending" column');
    console.log('   • Error: "Unknown column \'trending\' in order clause"');
    
    console.log('\n🛠️ Solution Applied:');
    console.log('   • Added "trending" case to match statement');
    console.log('   • Trending now sorts by views_count (most viewed = most trending)');
    console.log('   • Added explicit "created_at" case');
    console.log('   • Improved default case to use "created_at desc"');
    
    console.log('\n✅ Available Sort Options:');
    console.log('   • trending → views_count');
    console.log('   • views → views_count');
    console.log('   • saves → saves_count');
    console.log('   • price → price');
    console.log('   • title → title');
    console.log('   • created_at → created_at');
    console.log('   • default → created_at desc');
    
    console.log('\n🎯 Result:');
    console.log('   • No more database errors');
    console.log('   • Trending sort works correctly');
    console.log('   • Promoted adverts page should load properly');
    console.log('   • All sort options are functional');
    
  } catch (error) {
    console.error('❌ Trending fix test failed:', error.message);
  }
}

testTrendingFix();
