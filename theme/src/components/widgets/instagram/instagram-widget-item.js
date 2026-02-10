/** @jsx jsx */
import { jsx } from 'theme-ui'
import { keyframes } from '@emotion/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { faImages, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CAROUSEL_INTERVAL_MS = 3000

// Ken Burns effect - fast start, slow finish with visible movement throughout
const kenBurnsAnimation = keyframes`
  0% {
    transform: scale(1) translate3d(0, 0, 0);
  }
  33% {
    transform: scale(1.05) translate3d(-0.9%, -0.6%, 0);
  }
  66% {
    transform: scale(1.08) translate3d(-1.2%, -0.8%, 0);
  }
  100% {
    transform: scale(1.10) translate3d(-1.5%, -1%, 0);
  }
`

// Subtle border pulse animation for ambient active items
const ambientPulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(225, 48, 108, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(225, 48, 108, 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(225, 48, 108, 0);
  }
`

// Helper to build image URL with CDN params
const buildImageURL = url =>
  url ? `${url}?h=234&w=234&fit=crop&crop=faces,focalpoint&auto=compress&auto=enhance&auto=format` : ''

// Preload an image by creating a hidden Image object
// Note: Called with URLs from carouselImages which is already filtered with .filter(Boolean)
const preloadImage = url => {
  const img = new window.Image()
  img.src = buildImageURL(url)
}

const InstagramWidgetItem = ({
  handleClick,
  index,
  post: { caption, cdnMediaURL, children, id, mediaType } = {},
  isAmbientActive = false,
  ambientTrigger = 0
}) => {
  const isCarousel = mediaType === 'CAROUSEL_ALBUM'
  const isVideo = mediaType === 'VIDEO'
  const hasCarouselImages = isCarousel && children?.length > 0

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const carouselImagesLengthRef = useRef(0)

  // Carousel is active when hovering, focused, OR ambient active (attention grabber)
  const isActive = isMouseOver || isFocused || isAmbientActive

  // Get all carousel image URLs, fallback to main image if no children
  const carouselImages = hasCarouselImages ? children.map(child => child.cdnMediaURL).filter(Boolean) : [cdnMediaURL]

  // Keep ref in sync with current carousel images length to avoid stale closures in setInterval
  carouselImagesLengthRef.current = carouselImages.length

  // Get current image URL - carousel posts show current slide even when not hovering (pauses at last shown)
  const currentImageURL = hasCarouselImages ? carouselImages[currentImageIndex] || cdnMediaURL : cdnMediaURL

  // Preload the next image whenever current image changes
  useEffect(() => {
    if (hasCarouselImages && isActive && carouselImages.length > 1) {
      const nextIndex = (currentImageIndex + 1) % carouselImages.length
      preloadImage(carouselImages[nextIndex])
    }
  }, [currentImageIndex, hasCarouselImages, isActive, carouselImages])

  // Preload all carousel images when hover/focus starts
  useEffect(() => {
    if (hasCarouselImages && isActive) {
      carouselImages.forEach(preloadImage)
    }
  }, [hasCarouselImages, isActive, carouselImages])

  const startCarouselRotation = useCallback(() => {
    // Guard against empty carouselImages array (all children have falsy cdnMediaURL)
    // and single-image carousels (no point rotating)
    if (!hasCarouselImages || carouselImages.length < 2 || intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setIsTransitioning(true)
      timeoutRef.current = setTimeout(() => {
        // Use ref to get current length, avoiding stale closure if children prop changes mid-rotation
        const currentLength = carouselImagesLengthRef.current
        setCurrentImageIndex(prev => (currentLength > 0 ? (prev + 1) % currentLength : 0))
        setIsTransitioning(false)
        timeoutRef.current = null
      }, 300) // Crossfade duration
    }, CAROUSEL_INTERVAL_MS)
  }, [hasCarouselImages, carouselImages.length])

  const stopCarouselRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    // Keep currentImageIndex as-is so carousel pauses at last shown image
    setIsTransitioning(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsMouseOver(true)
    startCarouselRotation()
  }, [startCarouselRotation])

  const handleMouseLeave = useCallback(() => {
    setIsMouseOver(false)
    // Only stop carousel if not focused (accessibility: focus should keep carousel running)
    if (!isFocused) {
      stopCarouselRotation()
    }
  }, [isFocused, stopCarouselRotation])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    startCarouselRotation()
  }, [startCarouselRotation])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    // Only stop carousel if not hovering
    if (!isMouseOver) {
      stopCarouselRotation()
    }
  }, [isMouseOver, stopCarouselRotation])

  // Handle ambient trigger - advance by 1 image when triggered (attention grabber feature)
  useEffect(() => {
    // Only advance if this item is ambient active and has carousel images
    if (ambientTrigger > 0 && isAmbientActive && hasCarouselImages && carouselImages.length > 1) {
      // Preload the next image
      const nextIndex = (currentImageIndex + 1) % carouselImages.length
      preloadImage(carouselImages[nextIndex])

      // Advance by 1 with transition
      setIsTransitioning(true)
      const timeout = setTimeout(() => {
        setCurrentImageIndex(prev => (prev + 1) % carouselImages.length)
        setIsTransitioning(false)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [ambientTrigger]) // Only trigger on ambientTrigger change

  // Cleanup interval and timeout on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <button
      key={id}
      onClick={event => handleClick(event, { index, currentImageIndex, photo: { caption, id, src: cdnMediaURL } })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className='instagram-item-button'
      sx={{
        variant: 'styles.InstagramItem',
        position: 'relative', // Required for absolutely positioned children (icon, indicators)
        overflow: 'hidden', // Clip Ken Burns zoom effect
        // Subtle pulse animation when ambient active (attention grabber)
        ...(isAmbientActive &&
          hasCarouselImages && {
            animation: `${ambientPulseAnimation} 1.5s ease-in-out infinite`,
            borderRadius: '8px'
          })
      }}
    >
      {(isCarousel || isVideo) && (
        <div
          data-testid={isVideo ? 'video-icon' : 'carousel-icon'}
          sx={{
            color: 'white',
            position: 'absolute',
            top: 2,
            right: 2,
            zIndex: 1,
            backgroundColor: 'rgba(20, 20, 31, 0.7)',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}
        >
          <FontAwesomeIcon icon={isVideo ? faVideo : faImages} />
        </div>
      )}

      {/* Carousel indicator dots */}
      {hasCarouselImages && isActive && (
        <div
          data-testid='carousel-indicators'
          sx={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px',
            zIndex: 1
          }}
        >
          {carouselImages.slice(0, 5).map((_, idx) => (
            <span
              key={idx}
              sx={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor:
                  idx === currentImageIndex % Math.min(5, carouselImages.length) ? 'white' : 'rgba(255, 255, 255, 0.5)',
                transition: 'background-color 0.2s ease'
              }}
            />
          ))}
          {carouselImages.length > 5 && (
            <span sx={{ color: 'white', fontSize: '10px', lineHeight: '6px' }}>+{carouselImages.length - 5}</span>
          )}
        </div>
      )}

      <img
        key={currentImageIndex}
        className='instagram-item-image'
        loading='lazy'
        src={buildImageURL(currentImageURL)}
        height='280'
        width='280'
        alt={caption ? `Instagram post: ${caption}` : 'Instagram post thumbnail'}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          // Apply Ken Burns effect only when active (hovering or focused)
          ...(hasCarouselImages &&
            isActive && {
              animation: `${kenBurnsAnimation} ${CAROUSEL_INTERVAL_MS + 800}ms linear forwards`,
              willChange: 'transform'
            })
        }}
      />
    </button>
  )
}

export default InstagramWidgetItem
