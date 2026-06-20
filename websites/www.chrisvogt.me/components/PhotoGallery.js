/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import Gallery from 'react-photo-gallery'

// Lazy load all lightgallery imports to avoid loading them until needed
const LightGalleryComponent = ({ dynamicEl, onInit }) => {
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

  // Memoize plugins array so LightGallery doesn't reinitialize on every render
  const plugins = useMemo(() => {
    if (!lightGalleryModules) return []
    return [lightGalleryModules.lgThumbnail, lightGalleryModules.lgZoom]
  }, [lightGalleryModules])

  if (!lightGalleryModules) {
    return null // Return nothing while loading
  }

  const { LightGallery } = lightGalleryModules

  return (
    <LightGallery
      onInit={onInit}
      plugins={plugins}
      licenseKey={process.env.GATSBY_LIGHT_GALLERY_LICENSE_KEY}
      download={false}
      dynamic
      dynamicEl={dynamicEl}
      loop={false}
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

  // Memoize dynamicEl so LightGallery doesn't reinitialize when the parent re-renders
  const dynamicEl = useMemo(
    () =>
      photos.map(photo => ({
        src: photo.src,
        thumb: photo.src,
        subHtml: photo.title || ''
      })),
    [photos]
  )

  const handleInit = useCallback(ref => {
    if (ref?.instance) {
      lightGalleryRef.current = ref.instance
    }
  }, [])

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
        {shouldLoadLightGallery && <LightGalleryComponent dynamicEl={dynamicEl} onInit={handleInit} />}
      </div>
    </div>
  )
}
