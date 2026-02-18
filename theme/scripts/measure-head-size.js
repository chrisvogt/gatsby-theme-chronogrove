#!/usr/bin/env node

/**
 * Script to measure the size of the <head> tag in built HTML files
 *
 * Usage:
 *   node scripts/measure-head-size.js [path-to-html-file]
 *
 * Example:
 *   node scripts/measure-head-size.js public/index.html
 */

const fs = require('fs')
const path = require('path')

const htmlPath = process.argv[2] || path.join(__dirname, '../../public/index.html')

if (!fs.existsSync(htmlPath)) {
  console.error(`❌ HTML file not found: ${htmlPath}`)
  console.error('   Make sure to build the site first: pnpm build')
  process.exit(1)
}

const html = fs.readFileSync(htmlPath, 'utf8')

// Extract <head> content
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)

if (!headMatch) {
  console.error('❌ Could not find <head> tag in HTML')
  process.exit(1)
}

const headContent = headMatch[1]
const headSize = Buffer.byteLength(headContent, 'utf8')
const headSizeKB = (headSize / 1024).toFixed(2)
const headSizeMB = (headSize / (1024 * 1024)).toFixed(2)

// Count style tags
const styleTagMatches = headContent.match(/<style[^>]*>/gi) || []
const styleTagCount = styleTagMatches.length

// Extract style tag contents
const styleMatches = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
let totalStyleSize = 0
styleMatches.forEach(styleTag => {
  const contentMatch = styleTag.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  if (contentMatch) {
    totalStyleSize += Buffer.byteLength(contentMatch[1], 'utf8')
  }
})

const totalStyleSizeKB = (totalStyleSize / 1024).toFixed(2)
const totalStyleSizeMB = (totalStyleSize / (1024 * 1024)).toFixed(2)

// Count other head elements
const linkTags = (headContent.match(/<link[^>]*>/gi) || []).length
const scriptTags = (headContent.match(/<script[^>]*>/gi) || []).length
const metaTags = (headContent.match(/<meta[^>]*>/gi) || []).length

console.log('\n📊 <head> Tag Analysis\n')
console.log(`File: ${htmlPath}\n`)
console.log('─'.repeat(60))
console.log(`Total <head> size:     ${headSizeKB} KB (${headSizeMB} MB)`)
console.log(`Style tags:            ${styleTagCount}`)
console.log(`Total inline CSS:      ${totalStyleSizeKB} KB (${totalStyleSizeMB} MB)`)
console.log(`  (${((totalStyleSize / headSize) * 100).toFixed(1)}% of <head> size)`)
console.log('─'.repeat(60))
console.log('Other elements:')
console.log(`  <link> tags:         ${linkTags}`)
console.log(`  <script> tags:      ${scriptTags}`)
console.log(`  <meta> tags:        ${metaTags}`)
console.log('─'.repeat(60))

// Recommendations
console.log('\n💡 Recommendations:\n')

if (headSize > 50 * 1024) {
  console.log('⚠️  <head> is larger than 50KB - consider optimizing')
}

if (totalStyleSize > 30 * 1024) {
  console.log('⚠️  Inline CSS is larger than 30KB - consider:')
  console.log('   - Moving static styles to external CSS files')
  console.log('   - Using CSS extraction for Emotion styles')
  console.log('   - Reducing sx prop usage in components')
}

if (styleTagCount > 5) {
  console.log(`⚠️  Found ${styleTagCount} style tags - consider consolidating`)
}

if (headSize < 20 * 1024 && totalStyleSize < 15 * 1024) {
  console.log('✅ <head> size looks reasonable')
}

console.log('')
