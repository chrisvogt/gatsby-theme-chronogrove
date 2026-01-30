/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRef, useCallback, useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import Gallery from 'react-photo-gallery'

// Lazy load all lightgallery imports to avoid loading them until needed
const LightGalleryComponent = ({ lightGalleryRef, photos }) => {
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
        }
      }}
      plugins={[lgThumbnail, lgZoom]}
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

export const PhotoGallery = ({ photos }) => {
  const lightGalleryRef = useRef(null)
  const [shouldLoadLightGallery, setShouldLoadLightGallery] = useState(false)

  // Load LightGallery 300px before it comes into view
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
      console.error('LightGallery instance is not initialized')
    }
  }, [])

  return (
    <div sx={{ mb: 4 }}>
      {/* Render photo gallery - always visible */}
      <Gallery photos={photos} onClick={openLightbox} />

      {/* Sentinel element to trigger loading LightGallery 300px before view */}
      <div ref={ref} style={{ minHeight: '1px' }}>
        {shouldLoadLightGallery && <LightGalleryComponent lightGalleryRef={lightGalleryRef} photos={photos} />}
      </div>
    </div>
  )
}
