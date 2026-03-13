/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Card } from '@theme-ui/components'

import 'react-placeholder/lib/reactPlaceholder.css'

/**
 * Skeleton for a single vinyl record card. Matches the exact shape, position, and
 * layering of the real vinyl element (gradient disc, border, center hole, grooves)
 * so scroll-to-section and layout stay stable. Only the "album art" (center 70%)
 * is an animated placeholder until data is ready — same pattern as Steam game cards.
 */
const VinylRecordSkeleton = ({ darkModeActive }) => {
  const placeholderColor = darkModeActive ? '#3a3a4a' : '#efefef'

  return (
    <Card
      variant='actionCard'
      sx={{
        p: [0.5, 1, 2, 3],
        minWidth: 0,
        boxSizing: 'border-box',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        aria-hidden
        sx={{
          display: 'block',
          position: 'relative',
          height: '100%',
          width: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          aspectRatio: '1/1'
        }}
      >
        <div
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            position: 'relative',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
            border: '2px solid #333',
            '@media (max-width: 639px)': {
              border: '1px solid #333'
            }
          }}
        >
          {/* Vinyl record shape: same structure as real card (center hole, grooves) */}
          <div
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20%',
                height: '20%',
                borderRadius: '50%',
                background: '#000',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
                zIndex: 3
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                background: `repeating-conic-gradient(
                  from 0deg,
                  transparent 0deg,
                  transparent 2deg,
                  rgba(255, 255, 255, 0.05) 2deg,
                  rgba(255, 255, 255, 0.05) 4deg
                )`,
                zIndex: 1
              }
            }}
          >
            {/* Album art placeholder: same size/position as real album art (70% circle) */}
            <div
              className='show-loading-animation'
              sx={{
                width: '70%',
                height: '70%',
                borderRadius: '50%',
                backgroundColor: placeholderColor,
                position: 'relative',
                zIndex: 2,
                flexShrink: 0
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default VinylRecordSkeleton
