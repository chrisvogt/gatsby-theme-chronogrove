/** @jsx jsx */
import { jsx } from 'theme-ui'

const THUMBNAIL_SIZE = 64
const THUMBNAIL_SIZE_2X = THUMBNAIL_SIZE * 2 // 128px for retina displays

/**
 * Transform Cloudinary URL to include resize parameters
 * Optimizes images for thumbnail display size with retina support
 */
const getOptimizedImageUrl = src => {
  if (!src) return src

  // Check if it's a Cloudinary URL
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    // Insert transformation parameters after /upload/
    // w_128,h_128 = size for 2x retina, c_fill = crop to fill, f_auto = auto format, q_auto = auto quality
    return src.replace('/upload/', `/upload/w_${THUMBNAIL_SIZE_2X},h_${THUMBNAIL_SIZE_2X},c_fill,f_auto,q_auto/`)
  }

  // Return original URL for non-Cloudinary images
  return src
}

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
            width: `${THUMBNAIL_SIZE}px`,
            height: `${THUMBNAIL_SIZE}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '2px solid',
            borderColor: 'background',
            // Stagger the thumbnails slightly for visual interest
            transform: `translateY(${index % 2 === 0 ? 0 : 5}px)`
          }}
        >
          <div
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${getOptimizedImageUrl(src)})`,
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
