/** @jsx jsx */
import { jsx } from 'theme-ui'

/**
 * ImageThumbnails - Displays a row of small circular image previews
 * Used for Recap and Photography post cards as an alternative to large banners
 */
const ImageThumbnails = ({ images = [], maxImages = 4 }) => {
  if (!images || images.length === 0) {
    return null
  }

  // Limit the number of images shown
  const displayImages = images.slice(0, maxImages)

  return (
    <div
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        flexWrap: 'wrap'
      }}
    >
      {displayImages.map((src, index) => (
        <div
          key={index}
          sx={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '2px solid',
            borderColor: 'background',
            // Stagger the thumbnails slightly for visual interest
            transform: `translateY(${index % 2 === 0 ? 0 : 6}px)`
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

export default ImageThumbnails
