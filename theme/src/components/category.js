/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'

// Special category mappings for custom formatting
const categoryMappings = {
  'photography/travel': 'Travel Photography',
  'photography/events': 'Event Photography',
  'music/piano-covers': 'Piano Covers',
  'videos/bike-rides': 'Cycling Videos'
}

// Helper function to convert string to title case
const toTitleCase = str => {
  return str
    .split(/[-/]/) // Split by hyphen or forward slash
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const Category = ({ sx = {}, type }) => {
  // Use mapping if exists, otherwise convert to title case
  const category = categoryMappings[type] || toTitleCase(type)

  return (
    <Themed.div
      sx={{
        fontSize: [0],
        fontFamily: 'heading',
        color: 'primary',
        letterSpacing: '0.05em',
        ...sx
      }}
    >
      {category}
    </Themed.div>
  )
}

export default Category
