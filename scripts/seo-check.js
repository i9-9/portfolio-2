// SEO Check Script
// Run with: node scripts/seo-check.js

const fs = require('fs');
const path = require('path');

// Define paths to check
const robotsTxtPath = path.join(process.cwd(), 'public', 'robots.txt');
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');

// Check if files exist
const checkFileExists = (filePath, fileName) => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${fileName} exists.`);
    return true;
  } else {
    console.log(`❌ ${fileName} does not exist.`);
    return false;
  }
};

// Check robots.txt content
const checkRobotsTxt = () => {
  if (checkFileExists(robotsTxtPath, 'robots.txt')) {
    const content = fs.readFileSync(robotsTxtPath, 'utf8');
    if (content.includes('Sitemap:')) {
      console.log('✅ robots.txt includes sitemap reference.');
    } else {
      console.log('❌ robots.txt is missing sitemap reference.');
    }
  }
};

// Check sitemap.xml content
const checkSitemap = () => {
  if (checkFileExists(sitemapPath, 'sitemap.xml')) {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    if (content.includes('<urlset') && content.includes('<url>')) {
      console.log('✅ sitemap.xml has proper format and contains URLs.');
    } else {
      console.log('❌ sitemap.xml seems to be missing proper format or URLs.');
    }
  }
};

// Check if layout contains proper metadata
const checkMetadata = () => {
  if (checkFileExists(layoutPath, 'layout.tsx')) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    // Check for title
    if (content.includes('title:')) {
      console.log('✅ Layout has meta title defined.');
    } else {
      console.log('❌ Layout is missing meta title.');
    }
    
    // Check for description
    if (content.includes('description:')) {
      console.log('✅ Layout has meta description defined.');
    } else {
      console.log('❌ Layout is missing meta description.');
    }
    
    // Check for OpenGraph
    if (content.includes('openGraph:')) {
      console.log('✅ Layout has OpenGraph metadata defined.');
    } else {
      console.log('❌ Layout is missing OpenGraph metadata.');
    }
    
    // Check for TwitterCard
    if (content.includes('twitter:')) {
      console.log('✅ Layout has Twitter Card metadata defined.');
    } else {
      console.log('❌ Layout is missing Twitter Card metadata.');
    }

    // Check for JSON-LD
    if (content.includes('JsonLd')) {
      console.log('✅ Layout includes structured data (JSON-LD).');
    } else {
      console.log('❌ Layout is missing structured data (JSON-LD).');
    }
  }
};

console.log('\n===== SEO CHECKER =====\n');

// Run all checks
checkRobotsTxt();
checkSitemap();
checkMetadata();

console.log('\n=======================\n');
console.log('SEO checking complete. This is a basic check - some elements may require manual verification.');
console.log('For a more comprehensive check, consider using online tools like Lighthouse or SEMrush.'); 