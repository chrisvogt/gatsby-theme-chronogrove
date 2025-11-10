#!/usr/bin/env node

/**
 * Check MDX Excerpts Script
 *
 * Scans all MDX files in the content directory and reports:
 * - Missing excerpts
 * - Excerpts without proper ending punctuation
 * - Excerpts that are too long (> 200 chars)
 * - Excerpts that are too short (< 20 chars)
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const CONTENT_DIR = path.join(__dirname, '../www.chrisvogt.me/content')
const MAX_EXCERPT_LENGTH = 200
const MIN_EXCERPT_LENGTH = 20

// Ending punctuation that makes an excerpt feel complete
const VALID_ENDINGS = ['.', '!', '?', '…']

function getAllMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getAllMdxFiles(filePath, fileList)
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) return null

  try {
    return yaml.load(match[1])
  } catch (e) {
    return null
  }
}

function checkExcerpt(excerpt) {
  const issues = []

  if (!excerpt) {
    return ['Missing excerpt']
  }

  const trimmed = excerpt.trim()

  // Check length
  if (trimmed.length > MAX_EXCERPT_LENGTH) {
    issues.push(`Too long (${trimmed.length} chars, max ${MAX_EXCERPT_LENGTH})`)
  }

  if (trimmed.length < MIN_EXCERPT_LENGTH) {
    issues.push(`Too short (${trimmed.length} chars, min ${MIN_EXCERPT_LENGTH})`)
  }

  // Check ending punctuation
  const lastChar = trimmed[trimmed.length - 1]
  if (!VALID_ENDINGS.includes(lastChar)) {
    issues.push(`Missing ending punctuation (ends with: "${lastChar}")`)
  }

  // Check for YAML multiline artifacts
  if (trimmed.includes('\n')) {
    issues.push('Contains newline characters (YAML parsing issue?)')
  }

  return issues
}

function main() {
  console.log('🔍 Scanning MDX files for excerpt issues...\n')

  const mdxFiles = getAllMdxFiles(CONTENT_DIR)
  const results = {
    total: 0,
    withIssues: 0,
    issues: []
  }

  mdxFiles.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatter = extractFrontmatter(content)

    if (!frontmatter) {
      console.log(`⚠️  Could not parse frontmatter: ${relativePath}`)
      return
    }

    results.total++

    const issues = checkExcerpt(frontmatter.excerpt)

    if (issues.length > 0) {
      results.withIssues++
      results.issues.push({
        file: relativePath,
        title: frontmatter.title || 'Untitled',
        excerpt: frontmatter.excerpt || 'N/A',
        description: frontmatter.description || 'N/A',
        issues
      })
    }
  })

  // Print results
  if (results.issues.length === 0) {
    console.log('✅ All excerpts look good!\n')
  } else {
    console.log(`Found ${results.withIssues} files with excerpt issues:\n`)

    results.issues.forEach(({ file, title, excerpt, description, issues }) => {
      console.log(`📄 ${file}`)
      console.log(`   Title: ${title}`)
      console.log(`   Issues: ${issues.join(', ')}`)
      console.log(`   Current excerpt: "${excerpt}"`)
      if (description && description !== excerpt) {
        console.log(`   Description: "${description}"`)
      }
      console.log('')
    })
  }

  console.log(`\n📊 Summary: ${results.withIssues}/${results.total} files need attention`)
}

main()
