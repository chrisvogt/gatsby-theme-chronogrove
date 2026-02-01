/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'

import { Grid } from '@theme-ui/components'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import isDarkMode from '../../../helpers/isDarkMode'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import ReactPlaceholder from 'react-placeholder'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-video.css'
import 'lightgallery/css/lg-autoplay.css'

import { getInstagramWidgetDataSource } from '../../../selectors/metadata'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

import ActionButton from '../../action-button'
import CallToAction from '../call-to-action'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'
import WidgetItem from './instagram-widget-item'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

const MAX_IMAGES = {
  default: 8,
  showMore: 16
}

export default () => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const metadata = useSiteMetadata()
  const instagramDataSource = getInstagramWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('instagram', instagramDataSource)

  // Extract data from the query result
  const media = data?.collections?.media
  const metrics = data?.metrics
  const profileDisplayName = data?.profile?.displayName
  const profileURL = data?.profile?.profileURL

  const [isShowingMore, setIsShowingMore] = useState(false)
  const [ambientActiveIndex, setAmbientActiveIndex] = useState(null)
  const [ambientTrigger, setAmbientTrigger] = useState(0) // Increments to trigger single image advance
  const [isInView, setIsInView] = useState(false)
  const isGalleryOpenRef = useRef(false) // Use ref to avoid re-renders when gallery opens/closes
  const lightGalleryRef = useRef(null)
  const ambientIntervalRef = useRef(null)
  const widgetRef = useRef(null)
  const carouselQueueRef = useRef([]) // Shuffled queue of carousel indices
  const carouselProgressRef = useRef({}) // Track {idx: imagesShownCount}
  const carouselDataRef = useRef([]) // Store carousel metadata {idx, totalImages}

  // Fisher-Yates shuffle for true randomness without repeats
  const shuffleArray = array => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Track widget visibility with Intersection Observer
  useEffect(() => {
    // Guard for SSR - IntersectionObserver is browser-only
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsInView(true) // Fallback to always visible
      return
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 } // At least 10% visible
    )

    const currentRef = widgetRef.current
    if (currentRef) {
      observer.observe(currentRef)
      // Check initial visibility state immediately
      const rect = currentRef.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      setIsInView(isVisible)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [])

  // Ambient rotation - cycle through carousel items to draw attention
  useEffect(() => {
    // Don't run if loading, no media, or widget not in view
    // Note: Cleanup function handles clearing interval when effect re-runs
    if (isLoading || !media?.length || !isInView) {
      setAmbientActiveIndex(null)
      return
    }

    // Build carousel data: {idx, totalImages}
    const carousels = media
      .slice(0, isShowingMore ? MAX_IMAGES.showMore : MAX_IMAGES.default)
      .map((post, idx) => {
        if (post.mediaType === 'CAROUSEL_ALBUM' && post.children?.length > 1) {
          return { idx, totalImages: post.children.length }
        }
        return null
      })
      .filter(Boolean)

    // If no carousel items, don't start ambient rotation
    if (carousels.length === 0) return

    // Store carousel data for reference
    carouselDataRef.current = carousels

    // Initialize progress tracking (how many images each carousel has shown)
    const progressMap = {}
    carousels.forEach(c => {
      progressMap[c.idx] = 0
    })
    carouselProgressRef.current = progressMap

    // Create initial shuffled queue
    carouselQueueRef.current = shuffleArray(carousels.map(c => c.idx))

    // Get next carousel from queue, handling completion logic
    const getNextCarousel = () => {
      const carousels = carouselDataRef.current
      const progress = carouselProgressRef.current

      // If queue is empty, rebuild it
      if (carouselQueueRef.current.length === 0) {
        // Find carousels that haven't completed their full cycle
        const incompleteCarousels = carousels.filter(c => progress[c.idx] < c.totalImages)

        if (incompleteCarousels.length === 0) {
          // All carousels completed their full cycle - reset and start fresh
          carousels.forEach(c => {
            progress[c.idx] = 0
          })
          carouselQueueRef.current = shuffleArray(carousels.map(c => c.idx))
        } else {
          // Reshuffle only the incomplete carousels
          carouselQueueRef.current = shuffleArray(incompleteCarousels.map(c => c.idx))
        }
      }

      // Pop the next index from the queue
      const nextIdx = carouselQueueRef.current.shift()
      progress[nextIdx]++

      return nextIdx
    }

    // Start ambient rotation after a short delay (let user settle on page)
    const startDelay = setTimeout(() => {
      // Check ref - don't start if gallery is open
      if (isGalleryOpenRef.current) return

      const firstIdx = getNextCarousel()
      setAmbientActiveIndex(firstIdx)
      setAmbientTrigger(prev => prev + 1)

      // Rotate to a new carousel every 3.5 seconds
      ambientIntervalRef.current = setInterval(() => {
        // Skip rotation if gallery is open (check ref, not state)
        if (isGalleryOpenRef.current) return

        const nextIdx = getNextCarousel()
        setAmbientActiveIndex(nextIdx)
        setAmbientTrigger(prev => prev + 1)
      }, 3500)
    }, 2000)

    return () => {
      clearTimeout(startDelay)
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current)
        ambientIntervalRef.current = null
      }
    }
  }, [isLoading, media, isShowingMore, isInView])

  const openLightbox = useCallback(
    (widgetItemIndex, currentImageIndex = 0) => {
      const instance = lightGalleryRef.current
      if (instance) {
        // Map widget item index to the correct LightGallery slide index
        // Then add the current image index to open at the exact image being shown
        const baseSlideIndex = indexMapRef.current[widgetItemIndex] ?? widgetItemIndex
        const slideIndex = baseSlideIndex + currentImageIndex
        instance.openGallery(slideIndex)
      } else {
        console.error('LightGallery instance is not initialized')
      }
    },
    [lightGalleryRef]
  )

  const callToAction = (
    <CallToAction
      title={`${profileDisplayName || 'Instagram'} on Instagram`}
      url={profileURL || `https://www.instagram.com/${metadata?.widgets?.instagram?.username || 'instagram'}`}
      isLoading={isLoading}
    >
      Visit Profile
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  const countItemsToRender = isShowingMore ? MAX_IMAGES.showMore : MAX_IMAGES.default

  // Memoize LightGallery props to prevent reinitializing on every render
  const lightGalleryPlugins = useMemo(() => [lgThumbnail, lgZoom, lgVideo, lgAutoplay], [])

  // Build flattened gallery elements with all carousel images expanded
  // Also creates a mapping from widget item index to LightGallery slide index
  const { dynamicEl, itemIndexToSlideIndex } = useMemo(() => {
    if (!media?.length) return { dynamicEl: [], itemIndexToSlideIndex: {} }

    const slides = []
    const indexMap = {} // Maps widget item index to first LightGallery slide index for that post
    let slideIndex = 0

    media.forEach((post, postIndex) => {
      // Store the starting slide index for this post
      indexMap[postIndex] = slideIndex

      const caption = post.caption || ''
      const isCarousel = post.mediaType === 'CAROUSEL_ALBUM' && post.children?.length > 0
      const isVideo = post.mediaType === 'VIDEO'

      if (isCarousel) {
        // Expand carousel: each child becomes a separate slide
        const children = post.children.filter(child => child.cdnMediaURL)
        const totalImages = children.length

        children.forEach((child, childIndex) => {
          // FontAwesome images icon (faImages) as inline SVG
          const imagesIcon =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="14" height="14" fill="currentColor" style="margin-right: 6px; vertical-align: middle;"><path d="M160 32c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L160 32zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320l-144 0-48 0-80 0c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120L0 344c0 75.1 60.9 136 136 136l320 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-320 0c-48.6 0-88-39.4-88-88l0-224z"/></svg>'
          const positionLabel = `<span class="lg-post-position">${imagesIcon}${childIndex + 1} / ${totalImages}</span>`
          const captionHtml = caption ? `<p class="lg-caption">${caption}</p>` : ''

          slides.push({
            src: `${child.cdnMediaURL}?auto=compress&auto=enhance&auto=format`,
            thumb: `${child.cdnMediaURL}?auto=compress&auto=enhance&auto=format&fit=clip&w=100&h=100`,
            // Caption first, then position indicator below
            subHtml: `<div class="lg-sub-html-inner">${captionHtml}${positionLabel}</div>`,
            // Custom data for potential thumbnail styling
            albumIndex: postIndex,
            imageIndex: childIndex,
            totalInAlbum: totalImages,
            isAlbumStart: childIndex === 0,
            isAlbumEnd: childIndex === totalImages - 1
          })
          slideIndex++
        })
      } else if (isVideo && post.mediaURL) {
        // Video slide
        slides.push({
          thumb: `${post.cdnMediaURL}?auto=compress&auto=enhance&auto=format&fit=clip&w=100&h=100`,
          subHtml: caption ? `<div class="lg-sub-html-inner"><p class="lg-caption">${caption}</p></div>` : '',
          video: {
            source: [{ src: post.mediaURL, type: 'video/mp4' }],
            attributes: { controls: true }
          },
          albumIndex: postIndex,
          imageIndex: 0,
          totalInAlbum: 1,
          isAlbumStart: true,
          isAlbumEnd: true
        })
        slideIndex++
      } else {
        // Single image slide
        slides.push({
          src: `${post.cdnMediaURL}?auto=compress&auto=enhance&auto=format`,
          thumb: `${post.cdnMediaURL}?auto=compress&auto=enhance&auto=format&fit=clip&w=100&h=100`,
          subHtml: caption ? `<div class="lg-sub-html-inner"><p class="lg-caption">${caption}</p></div>` : '',
          albumIndex: postIndex,
          imageIndex: 0,
          totalInAlbum: 1,
          isAlbumStart: true,
          isAlbumEnd: true
        })
        slideIndex++
      }
    })

    return { dynamicEl: slides, itemIndexToSlideIndex: indexMap }
  }, [media])

  // Create ref to store the index mapping for use in openLightbox callback
  const indexMapRef = useRef(itemIndexToSlideIndex)
  indexMapRef.current = itemIndexToSlideIndex

  const handleLightGalleryInit = useCallback(ref => {
    lightGalleryRef.current = ref.instance
  }, [])

  const handleGalleryOpen = useCallback(() => {
    isGalleryOpenRef.current = true
  }, [])

  const handleGalleryClose = useCallback(() => {
    isGalleryOpenRef.current = false
  }, [])

  // Apply album boundary data attributes to thumbnails for CSS styling
  const handleAfterAppendSlide = useCallback(
    ({ index }) => {
      // Get the slide data to check album boundaries
      const slide = dynamicEl[index]
      if (!slide) return

      // Find the thumbnail element for this slide
      // LightGallery uses .lg-thumb-item elements inside .lg-thumb-outer
      const thumbOuter = document.querySelector('.lg-thumb-outer')
      if (!thumbOuter) return

      const thumbItems = thumbOuter.querySelectorAll('.lg-thumb-item')
      const thumbItem = thumbItems[index]
      if (!thumbItem) return

      // Apply data attributes for CSS styling
      if (slide.isAlbumStart) {
        thumbItem.setAttribute('data-album-start', 'true')
      }
      if (slide.isAlbumEnd) {
        thumbItem.setAttribute('data-album-end', 'true')
      }
      thumbItem.setAttribute('data-album-index', slide.albumIndex)
    },
    [dynamicEl]
  )

  return (
    <Widget id='instagram' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faInstagram}>
        Instagram
      </WidgetHeader>

      <ProfileMetricsBadge metrics={metrics} isLoading={isLoading} />

      <div className='gallery' ref={widgetRef}>
        <Grid
          sx={{
            gridGap: [3, 3, 3, 4],
            gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(3, 1fr)', '', 'repeat(4, 1fr)']
          }}
        >
          {(isLoading ? Array(countItemsToRender).fill({}) : media || [])
            .slice(0, countItemsToRender)
            .map((post, idx) => (
              <ReactPlaceholder
                customPlaceholder={
                  <div className='image-placeholder'>
                    <RectShape
                      color={darkModeActive ? '#3a3a4a' : '#efefef'}
                      sx={{
                        borderRadius: '8px',
                        boxShadow: 'md',
                        width: '100%',
                        paddingBottom: '100%'
                      }}
                    />
                  </div>
                }
                key={isLoading ? idx : post.id}
                ready={!isLoading}
                showLoadingAnimation
                type='rect'
              >
                <WidgetItem
                  handleClick={(event, { currentImageIndex }) => openLightbox(idx, currentImageIndex)}
                  index={idx}
                  post={post}
                  isAmbientActive={ambientActiveIndex === idx}
                  ambientTrigger={ambientActiveIndex === idx ? ambientTrigger : 0}
                />
              </ReactPlaceholder>
            ))}
        </Grid>
      </div>

      {!isLoading && media?.length > MAX_IMAGES.default && (
        <div sx={{ my: 4, textAlign: 'center' }}>
          <ActionButton size='large' onClick={() => setIsShowingMore(!isShowingMore)}>
            {isShowingMore ? 'Show Less' : 'Show More'}
          </ActionButton>
        </div>
      )}

      {dynamicEl.length > 0 && (
        <LightGallery
          onInit={handleLightGalleryInit}
          onAfterOpen={handleGalleryOpen}
          onAfterClose={handleGalleryClose}
          onAfterAppendSlide={handleAfterAppendSlide}
          plugins={lightGalleryPlugins}
          licenseKey={process.env.GATSBY_LIGHT_GALLERY_LICENSE_KEY}
          download={false}
          dynamic
          dynamicEl={dynamicEl}
          autoplayVideoOnSlide={true}
          speed={500}
        />
      )}
    </Widget>
  )
}
