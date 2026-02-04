/** @jsx jsx */
import { jsx } from 'theme-ui'

/**
 * ThumbnailStrip - A compact vertical strip of thumbnail images
 * Designed for side placement in cards, with staggered/offset positions
 */
const ThumbnailStrip = ({ images = [], maxImages = 4, size = 36 }) => {
  if (!images || images.length === 0) {
    return null
  }

  const displayImages = images.slice(0, maxImages)
  const overlap = size * 0.35 // 35% overlap for compact stacking

  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: size + 8, // Add some padding for offset effect
        height: displayImages.length * (size - overlap) + overlap,
        flexShrink: 0
      }}
    >
      {displayImages.map((src, index) => (
        <div
          key={index}
          sx={{
            position: 'absolute',
            top: index * (size - overlap),
            // Zigzag offset: even indexes left, odd indexes right
            left: index % 2 === 0 ? 0 : 8,
            width: size,
            height: size,
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
            border: '2px solid',
            borderColor: 'background',
            transition: 'transform 0.2s ease',
            zIndex: displayImages.length - index, // Stack order: first image on top
            '&:hover': {
              transform: 'scale(1.08)',
              zIndex: displayImages.length + 1
            }
          }}
        >
          <div
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default ThumbnailStrip
