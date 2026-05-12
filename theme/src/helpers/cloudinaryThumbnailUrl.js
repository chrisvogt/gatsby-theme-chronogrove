import { IMAGE_THUMBNAILS_SIZE_PX } from '@chronogrove/ui/image-thumbnails'

const THUMBNAIL_SIZE_2X = IMAGE_THUMBNAILS_SIZE_PX * 2

/** ~380px portrait column at 3:4, scaled for ~2x DPR — featured travel hero and similar heroes */
export const CLOUDINARY_FEATURED_PORTRAIT_2X = { height: Math.round((780 * 4) / 3), width: 780 }

/**
 * Check if URL is a valid Cloudinary URL by parsing the hostname
 * (prevents substring attacks like "https://evil.com/?url=res.cloudinary.com").
 */
export const isCloudinaryUrl = src => {
  try {
    const url = new URL(src)
    return url.hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}

/**
 * Transform Cloudinary delivery URLs for small thumbnails with retina widths.
 *
 * Handles `/upload/` paths with optional existing transforms by replacing through the version segment.
 */
export function optimizeCloudinaryThumbnailSrc(src) {
  if (!src) return src

  if (isCloudinaryUrl(src) && src.includes('/upload/')) {
    const transforms = `w_${THUMBNAIL_SIZE_2X},h_${THUMBNAIL_SIZE_2X},c_fill,f_auto,q_auto`

    return src.replace(/\/upload\/(?:[^/]+\/)?v(\d+)/, `/upload/${transforms}/v$1`)
  }

  return src
}

/**
 * Cloudinary resize with crop fill — for heroes / featured cards that need dimensions larger than thumbnails.
 *
 * @param {string | null | undefined} src
 * @param {number} widthPx
 * @param {number} heightPx
 */
export function optimizeCloudinaryFillDimensionsSrc(src, widthPx, heightPx) {
  if (!src) return src

  if (isCloudinaryUrl(src) && src.includes('/upload/') && Number.isFinite(widthPx) && Number.isFinite(heightPx)) {
    const transforms = `w_${Math.round(widthPx)},h_${Math.round(heightPx)},c_fill,f_auto,q_auto`
    return src.replace(/\/upload\/(?:[^/]+\/)?v(\d+)/, `/upload/${transforms}/v$1`)
  }

  return src
}
