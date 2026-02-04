// Special category mappings for custom formatting
export const categoryMappings = {
  'photography/travel': 'Travel Photography',
  'photography/events': 'Event Photography',
  'music/piano-covers': 'Piano Covers',
  'videos/bike-rides': 'Cycling Videos'
}

// Helper function to convert string to title case
export const toTitleCase = str => {
  return str
    .split(/[-/]/) // Split by hyphen or forward slash
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Get display name for a category
export const getCategoryDisplayName = type => {
  if (!type) return ''
  return categoryMappings[type] || toTitleCase(type)
}

// Check if a post is a recap based on title
export const isRecapPost = (postTitle = '') => {
  return postTitle?.toLowerCase().includes('recap') || false
}

// Determine the main category group for a post
export const getCategoryGroup = (category, postTitle = '') => {
  if (!category && !postTitle) return 'other'

  const cat = category || 'other'

  // Check for recaps first (separate from personal)
  if (isRecapPost(postTitle)) {
    return 'recaps'
  } else if (cat === 'personal') {
    return 'personal'
  } else if (cat.startsWith('music')) {
    return 'music'
  } else if (cat.startsWith('photography')) {
    return 'photography'
  } else if (cat.startsWith('technology') || cat.includes('tech')) {
    return 'technology'
  }

  return 'other'
}
