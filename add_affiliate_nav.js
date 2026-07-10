// Add affiliate navigation to UnifiedNavbar.jsx
const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'src/Component/UnifiedNavbar.jsx');

try {
    // Read the current navbar file
    let content = fs.readFileSync(navbarPath, 'utf8');
    
    // Find the line with Featured Adverts and add affiliate navigation after it
    const featuredLine = "{ name: 'Featured Adverts', href: '/featured' }";
    const affiliateLine = "{ name: 'Affiliates Hub', href: '/affiliates' }";
    
    if (content.includes(featuredLine)) {
        // Replace the featured line with featured + affiliate
        const newContent = content.replace(
            featuredLine,
            `${featuredLine},\n      ${affiliateLine}`
        );
        
        // Write the updated content back to the file
        fs.writeFileSync(navbarPath, newContent);
        console.log('✅ Successfully added affiliate navigation to UnifiedNavbar.jsx');
    } else {
        console.log('❌ Could not find Featured Adverts line in UnifiedNavbar.jsx');
    }
} catch (error) {
    console.error('❌ Error updating UnifiedNavbar.jsx:', error.message);
}
