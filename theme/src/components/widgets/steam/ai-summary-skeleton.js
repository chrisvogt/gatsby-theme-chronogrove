/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { TextBlock } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/isDarkMode'

import 'react-placeholder/lib/reactPlaceholder.css'

/**
 * Skeleton placeholder for AI summary block. Matches the layout of AiSummary
 * so scroll-to-section doesn't drift. Uses configurable text rows (Steam ~3, Goodreads ~5).
 * Show More is shown as a disabled placeholder so height matches loaded state.
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
      <div
        sx={{
          display: 'flex',
          flexDirection: ['column', 'row'],
          alignItems: ['stretch', 'center'],
          gap: [3, 4],
          mb: 0
        }}
      >
        <div sx={{ flex: 1, minWidth: 0 }}>
          <div className='show-loading-animation' sx={{ '& p': { mb: 2, lineHeight: 1.65 } }}>
            <TextBlock color={placeholderColor} rows={skeletonRows} />
          </div>
        </div>

        {/* Disabled Show More placeholder — keeps layout height consistent with loaded state */}
        <div
          sx={{
            display: 'flex',
            justifyContent: ['center', 'flex-end'],
            flexShrink: 0,
            opacity: 0.5
          }}
        >
          <div
            sx={{
              height: '44px',
              minWidth: '140px',
              borderRadius: '8px',
              bg: placeholderColor
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

export default AiSummarySkeleton
