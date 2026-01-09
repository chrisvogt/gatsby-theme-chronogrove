/** @jsx jsx */
import { jsx } from 'theme-ui'
import { keyframes } from '@emotion/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { faImages, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CAROUSEL_INTERVAL_MS = 5000

// Ken Burns effect - slow cinematic pan and zoom
const kenBurnsAnimation = keyframes`
  0% {
    transform: scale(1.0) translate(0, 0);
  }
  100% {
    transform: scale(1.12) translate(-2%, -1%);
  }
`

const InstagramWidgetItem = ({ handleClick, index, post: { caption, cdnMediaURL, children, id, mediaType } = {} }) => {
  const isCarousel = mediaType === 'CAROUSEL_ALBUM'
  const isVideo = mediaType === 'VIDEO'
  const hasCarouselImages = isCarousel && children?.length > 0

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)

  // Get all carousel image URLs, fallback to main image if no children
  const carouselImages = hasCarouselImages ? children.map(child => child.cdnMediaURL).filter(Boolean) : [cdnMediaURL]

  // Get current image URL based on hover state
  const currentImageURL =
    hasCarouselImages && isHovering ? carouselImages[currentImageIndex] || cdnMediaURL : cdnMediaURL

  const startCarouselRotation = useCallback(() => {
    if (!hasCarouselImages || intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex(prev => (prev + 1) % carouselImages.length)
        setIsTransitioning(false)
      }, 400) // Crossfade duration
    }, CAROUSEL_INTERVAL_MS)
  }, [hasCarouselImages, carouselImages.length])

  const stopCarouselRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setCurrentImageIndex(0)
    setIsTransitioning(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    startCarouselRotation()
  }, [startCarouselRotation])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    stopCarouselRotation()
  }, [stopCarouselRotation])

  const handleFocus = useCallback(() => {
    setIsHovering(true)
    startCarouselRotation()
  }, [startCarouselRotation])

  const handleBlur = useCallback(() => {
    setIsHovering(false)
    stopCarouselRotation()
  }, [stopCarouselRotation])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <button
      key={id}
      onClick={event => handleClick(event, { index, photo: { caption, id, src: cdnMediaURL } })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className='instagram-item-button'
      sx={{
        variant: 'styles.InstagramItem',
        overflow: 'hidden' // Clip Ken Burns zoom effect
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
            zIndex: 1
          }}
        >
          <FontAwesomeIcon icon={isVideo ? faVideo : faImages} />
        </div>
      )}

      {/* Carousel indicator dots */}
      {hasCarouselImages && isHovering && (
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
        key={hasCarouselImages && isHovering ? `carousel-${currentImageIndex}` : 'static'}
        crossOrigin='anonymous'
        className='instagram-item-image'
        loading='lazy'
        src={`${currentImageURL}?h=234&w=234&fit=crop&crop=faces,focalpoint&auto=compress&auto=enhance&auto=format`}
        height='280'
        width='280'
        alt={caption ? `Instagram post: ${caption}` : 'Instagram post thumbnail'}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          // Apply Ken Burns effect only when hovering over carousel
          ...(hasCarouselImages &&
            isHovering && {
              animation: `${kenBurnsAnimation} ${CAROUSEL_INTERVAL_MS}ms ease-out forwards`
            })
        }}
      />
    </button>
  )
}

export default InstagramWidgetItem
