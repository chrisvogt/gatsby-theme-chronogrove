import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'

import { thumbnailSrcItem } from './prop-types-helpers.js'

/** Default cap on thumbnails shown when `images` exceeds this count. */
export const IMAGE_THUMBNAILS_DEFAULT_MAX = 4

/** Thumbnail box size (px); retina-friendly optimizers typically use ~2× for width/height. */
export const IMAGE_THUMBNAILS_SIZE_PX = 64

/**
 * Pass-through optimizer (CDN-agnostic default).
 *
 * @param {string | null | undefined} src
 * @returns {string | null | undefined}
 */
export const IMAGE_THUMBNAILS_DEFAULT_OPTIMIZE_SRC = src => src

/**
 * Horizontal row of small circular image previews — e.g. post cards (`Recap`).
 * Supply `optimizeSrc` for CDN-specific resizing (Gatsby theme uses a Cloudinary helper).
 *
 * @param {object} props
 * @param {Array<string | null | undefined>} [props.images]
 * @param {number} [props.maxImages]
 * @param {(src: string) => string | null | undefined} [props.optimizeSrc]
 */
const ImageThumbnails = ({
  images = [],
  maxImages = IMAGE_THUMBNAILS_DEFAULT_MAX,
  optimizeSrc = IMAGE_THUMBNAILS_DEFAULT_OPTIMIZE_SRC
}) => {
  if (!images || images.length === 0) {
    return null
  }

  const displayImages = images.slice(0, maxImages)
  const size = IMAGE_THUMBNAILS_SIZE_PX

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        flexWrap: 'wrap'
      }}
    >
      {displayImages.map((src, index) => {
        const input = typeof src === 'string' ? src : ''
        const optimized = optimizeSrc(input)
        const url = optimized !== null && optimized !== undefined ? String(optimized) : ''
        const thumbKey = url || input || `thumb-empty-${size}-${index}`

        return (
          <Box
            key={thumbKey}
            sx={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '2px solid',
              borderColor: 'background',
              transform: `translateY(${index % 2 === 0 ? 0 : 5}px)`
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                ...(url
                  ? {
                      backgroundImage: `url(${url})`,
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

ImageThumbnails.propTypes = {
  images: PropTypes.arrayOf(thumbnailSrcItem),
  maxImages: PropTypes.number,
  optimizeSrc: PropTypes.func
}

export default ImageThumbnails
