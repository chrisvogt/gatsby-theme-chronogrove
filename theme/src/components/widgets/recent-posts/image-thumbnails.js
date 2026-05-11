import React from 'react'
import ImageThumbnailsUI from '@chronogrove/ui/image-thumbnails'
import { optimizeCloudinaryThumbnailSrc } from '../../../helpers/cloudinaryThumbnailUrl'

/** Post-card thumbnails row with Cloudinary-optimized retina sizes. */
const ImageThumbnails = props => <ImageThumbnailsUI {...props} optimizeSrc={optimizeCloudinaryThumbnailSrc} />

export default ImageThumbnails
