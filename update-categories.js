import api from './src/api.js';

/**
 * Script to update categories according to WWA platform requirements
 * 
 * Changes required:
 * 1. Change "For sale" category to "Buy and Sell" 
 * 2. Combine "Resorts/Travel" with hotel accommodations and rename to "Hotel, Resorts & Travel"
 * 3. Update the combined category to support B&B, hotels, transport services for tourists
 */

// Category updates configuration
const categoryUpdates = [
  {
    id: 10, // "For sale" category ID
    updates: {
      name: "Buy and Sell",
      slug: "buy-and-sell",
      description: "Post anything you are selling or looking to buy"
    }
  },
  {
    id: 5, // "Resorts/Travel" category ID  
    updates: {
      name: "Hotel, Resorts & Travel",
      slug: "hotel-resorts-travel", 
      description: "Find B&B, hotels, transport services and other tourist accommodations"
    }
  }
];

/**
 * Update a single category
 */
async function updateCategory(categoryId, updates) {
  try {
    console.log(`Updating category ${categoryId}...`);
    
    const response = await api.put(`v1/category/${categoryId}`, updates);
    console.log(`✅ Successfully updated category ${categoryId}:`, response.data);
    return true;
  } catch (error) {
    console.error(`❌ Error updating category ${categoryId}:`, error.message);
    return false;
  }
}

/**
 * Get current category details to verify updates
 */
async function getCategoryDetails(categoryId) {
  try {
    const response = await api.get(`v1/category/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error getting category ${categoryId} details:`, error.message);
    return null;
  }
}

/**
 * Verify category updates were successful
 */
async function verifyUpdates() {
  console.log('\n🔍 Verifying category updates...');
  
  for (const category of categoryUpdates) {
    const details = await getCategoryDetails(category.id);
    if (details) {
      console.log(`\nCategory ${category.id}:`);
      console.log(`- Name: ${details.name}`);
      console.log(`- Slug: ${details.slug}`);
      console.log(`- Description: ${details.description || 'No description'}`);
      
      // Check if updates match
      const expected = category.updates;
      const nameMatches = details.name === expected.name;
      const slugMatches = details.slug === expected.slug;
      
      if (nameMatches && slugMatches) {
        console.log(`✅ Category ${category.id} updated successfully`);
      } else {
        console.log(`❌ Category ${category.id} updates may not have been applied correctly`);
      }
    }
  }
}

/**
 * Main execution function
 */
async function updateCategories() {
  console.log('🚀 Starting category updates for WWA platform...\n');
  
  let successCount = 0;
  
  // Update each category
  for (const category of categoryUpdates) {
    console.log(`\n--- Updating Category ${category.id} ---`);
    console.log(`From: Current category details`);
    console.log(`To: ${category.updates.name}`);
    
    const success = await updateCategory(category.id, category.updates);
    if (success) {
      successCount++;
    }
  }
  
  // Verify updates
  await verifyUpdates();
  
  console.log('\n📊 Summary:');
  console.log(`- Categories updated: ${successCount}/${categoryUpdates.length}`);
  
  if (successCount === categoryUpdates.length) {
    console.log('\n🎉 All category updates completed successfully!');
    console.log('\nChanges made:');
    console.log('1. ✅ "For sale" → "Buy and Sell"');
    console.log('2. ✅ "Resorts/Travel" → "Hotel, Resorts & Travel"');
    console.log('\nThe platform now supports:');
    console.log('- Buy and Sell category for user sales posts');
    console.log('- Combined Hotel, Resorts & Travel category with B&B, hotels, and transport services');
  } else {
    console.log('\n⚠️ Some category updates may have failed. Please check the errors above.');
  }
}

// Run the script
if (require.main === module) {
  updateCategories().catch(console.error);
}

export {
  updateCategories,
  updateCategory,
  getCategoryDetails,
  verifyUpdates
};
