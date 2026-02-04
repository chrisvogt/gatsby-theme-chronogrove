/** @jsx jsx */
import { jsx } from 'theme-ui'

const THUMBNAIL_SIZE = 64
const THUMBNAIL_SIZE_2X = THUMBNAIL_SIZE * 2 // 128px for retina displays

/**
 * Check if URL is a valid Cloudinary URL by parsing the hostname
 * This prevents substring attacks like "https://evil.com/?url=res.cloudinary.com"
 */
const isCloudinaryUrl = src => {
  try {
    const url = new URL(src)
    return url.hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}

/**
 * Transform Cloudinary URL to include resize parameters
 * Optimizes images for thumbnail display size with retina support
 *
 * Handles URLs with existing transformations by replacing them:
 * - /upload/f_auto/v123/... → /upload/w_128,h_128,.../v123/...
 * - /upload/c_scale,h_900,f_auto/v123/... → /upload/w_128,h_128,.../v123/...
 * - /upload/v123/... → /upload/w_128,h_128,.../v123/...
 */
const getOptimizedImageUrl = src => {
  if (!src) return src

  // Check if it's a valid Cloudinary URL (hostname must be res.cloudinary.com)
  if (isCloudinaryUrl(src) && src.includes('/upload/')) {
    // Transformation string for small thumbnails with retina support
    const transforms = `w_${THUMBNAIL_SIZE_2X},h_${THUMBNAIL_SIZE_2X},c_fill,f_auto,q_auto`

    // Replace /upload/{optional-transforms}/v{version} with /upload/{our-transforms}/v{version}
    // This handles URLs with or without existing transformations
    return src.replace(/\/upload\/(?:[^/]+\/)?v(\d+)/, `/upload/${transforms}/v$1`)
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
