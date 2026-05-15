import React from 'react'
import PropTypes from 'prop-types'
import ImageThumbnailsUI from '@chronogrove/ui/image-thumbnails'
import { optimizeCloudinaryThumbnailSrc } from '../../../helpers/cloudinaryThumbnailUrl'

/** Post-card thumbnails row with Cloudinary-optimized retina sizes. */
const thumbnailSrcItem = PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])])

const ImageThumbnails = props => <ImageThumbnailsUI {...props} optimizeSrc={optimizeCloudinaryThumbnailSrc} />

ImageThumbnails.propTypes = {
  images: PropTypes.arrayOf(thumbnailSrcItem),
  maxImages: PropTypes.number
}

export default ImageThumbnails
