import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'

/**
 * Compact vertical strip of thumbnail images — staggered/offset for card side rails.
 */
const ThumbnailStrip = ({ images = [], maxImages = 4, size = 36 }) => {
  if (!images || images.length === 0) {
    return null
  }

  const displayImages = images.slice(0, maxImages)
  const overlap = size * 0.35 // 35% overlap for compact stacking
  const stripW = size + 8
  const stripH = displayImages.length * (size - overlap) + overlap

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        // Theme UI maps bare numbers in `sx` to theme scales — use explicit px for layout math.
        width: `${stripW}px`,
        height: `${stripH}px`,
        flexShrink: 0
      }}
    >
      {displayImages.map((src, index) => {
        const srcKey = typeof src === 'string' && src ? src : `thumb-empty-${size}-${index}`
        return (
          <Box
            key={srcKey}
            sx={{
              position: 'absolute',
              top: `${index * (size - overlap)}px`,
              left: index % 2 === 0 ? 0 : '8px',
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              border: '2px solid',
              borderColor: 'background',
              transition: 'transform 0.2s ease',
              zIndex: displayImages.length - index,
              '&:hover': {
                transform: 'scale(1.08)',
                zIndex: displayImages.length + 1
              }
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                ...(typeof src === 'string' && src
                  ? {
                      backgroundImage: `url(${src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }
                  : {})
              }}
            />
          </Box>
        )
      })}
    </Box>
  )
}

ThumbnailStrip.propTypes = {
  images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null, undefined])])),
  maxImages: PropTypes.number,
  size: PropTypes.number
}

export default ThumbnailStrip
