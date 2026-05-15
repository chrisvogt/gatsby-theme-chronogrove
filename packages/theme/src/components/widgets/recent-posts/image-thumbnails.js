import React from 'react'
import PropTypes from 'prop-types'
import ImageThumbnailsUI from '@chronogrove/ui/image-thumbnails'
import { thumbnailSrcItem } from '@chronogrove/ui/prop-types-helpers'
import { optimizeCloudinaryThumbnailSrc } from '../../../helpers/cloudinaryThumbnailUrl'

/** Post-card thumbnails row with Cloudinary-optimized retina sizes. */

const ImageThumbnails = props => <ImageThumbnailsUI {...props} optimizeSrc={optimizeCloudinaryThumbnailSrc} />

ImageThumbnails.propTypes = {
  images: PropTypes.arrayOf(thumbnailSrcItem),
  maxImages: PropTypes.number
}

export default ImageThumbnails
