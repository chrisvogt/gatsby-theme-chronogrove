/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { TextBlock } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/is-dark-mode'

import 'react-placeholder/lib/reactPlaceholder.css'

/**
 * Skeleton placeholder for AI summary block. Matches the layout of AiSummary
 * so scroll-to-section doesn't drift. Uses configurable text rows (Steam ~3, Goodreads ~5).
 */
const AiSummarySkeleton = ({ skeletonRows = 4, sx: sxProp }) => {
  const [colorMode] = useColorMode()
  const darkModeActive = isDarkMode(colorMode)
  const placeholderColor = darkModeActive ? '#3a3a4a' : '#efefef'

  return (
    <div
      aria-hidden
      sx={{
        mb: [3, 4],
        ...(typeof sxProp === 'object' && sxProp !== null ? sxProp : {})
      }}
    >
      <div className='show-loading-animation' sx={{ '& p': { mb: 2, lineHeight: 1.65 } }}>
        <TextBlock color={placeholderColor} rows={skeletonRows} />
      </div>
      <div sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <div
          sx={{
            height: '48px',
            minWidth: '140px',
            maxWidth: '220px',
            width: '40%',
            borderRadius: '6px',
            bg: placeholderColor,
            opacity: 0.55
          }}
          aria-hidden
        />
      </div>
    </div>
  )
}

export default AiSummarySkeleton
