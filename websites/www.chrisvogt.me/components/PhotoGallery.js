import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Box } from 'theme-ui'
import PropTypes from 'prop-types'
import { useInView } from 'react-intersection-observer'

import Gallery from 'react-photo-gallery'

const LightGalleryComponent = ({ lightGalleryRef, pendingIndexRef, photos }) => {
  // Dynamic imports for lightgallery - only loaded when component mounts
  const [lightGalleryModules, setLightGalleryModules] = useState(null)

  // Load lightgallery modules when component mounts
  useEffect(() => {
    const loadModules = async () => {
      const [{ default: LightGallery }, { default: lgThumbnail }, { default: lgZoom }] = await Promise.all([
        import('lightgallery/react'),
        import('lightgallery/plugins/thumbnail'),
        import('lightgallery/plugins/zoom'),
        import('lightgallery/css/lg-thumbnail.css'),
        import('lightgallery/css/lg-zoom.css'),
        import('lightgallery/css/lightgallery.css')
      ])

      setLightGalleryModules({ LightGallery, lgThumbnail, lgZoom })
    }

    loadModules()
  }, [])

  if (!lightGalleryModules) {
    return null // Return nothing while loading
  }

  const { LightGallery, lgThumbnail, lgZoom } = lightGalleryModules

  return (
    <LightGallery
      onInit={ref => {
        if (ref?.instance) {
          lightGalleryRef.current = ref.instance
          if (pendingIndexRef.current !== null) {
            const idx = pendingIndexRef.current
            pendingIndexRef.current = null
            ref.instance.openGallery(idx)
          }
        }
      }}
      plugins={[lgThumbnail, lgZoom]}
      licenseKey={process.env.GATSBY_LIGHT_GALLERY_LICENSE_KEY}
      download={false}
      dynamic
      dynamicEl={photos.map(photo => ({
        src: photo.src,
        thumb: photo.src,
        subHtml: photo.title || ''
      }))}
      speed={1000}
    />
  )
}

LightGalleryComponent.propTypes = {
  lightGalleryRef: PropTypes.shape({ current: PropTypes.object }),
  pendingIndexRef: PropTypes.shape({ current: PropTypes.number }),
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      title: PropTypes.string
    })
  ).isRequired
}

export const PhotoGallery = ({ photos }) => {
  const lightGalleryRef = useRef(null)
  const pendingIndexRef = useRef(null)
  const [shouldLoadLightGallery, setShouldLoadLightGallery] = useState(false)

  const { ref } = useInView({
    rootMargin: '300px',
    triggerOnce: true,
    onChange: inView => {
      if (inView) {
        setShouldLoadLightGallery(true)
      }
    }
  })

  const openLightbox = useCallback((event, { index }) => {
    const instance = lightGalleryRef.current
    if (instance) {
      instance.openGallery(index)
    } else {
      pendingIndexRef.current = index
    }
  }, [])

  return (
    <Box ref={ref} sx={{ mb: 4 }}>
      <Gallery photos={photos} onClick={openLightbox} />

      {shouldLoadLightGallery && (
        <LightGalleryComponent lightGalleryRef={lightGalleryRef} pendingIndexRef={pendingIndexRef} photos={photos} />
      )}
    </Box>
  )
}
