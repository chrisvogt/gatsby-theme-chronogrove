/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'
import { Grid } from '@theme-ui/components'
import { RectShape } from 'react-placeholder/lib/placeholders'
import ReactPlaceholder from 'react-placeholder'
import WidgetPagination from './widget-pagination'

const WidgetCarousel = ({
  items = [],
  isLoading = false,
  itemsPerPage = 8,
  renderItem,
  placeholderComponent,
  gridTemplateColumns = ['repeat(2, 1fr)', 'repeat(3, 1fr)', '', 'repeat(4, 1fr)'],
  gridGap = [3, 3, 3, 4]
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [velocity, setVelocity] = useState(0)
  const [lastTouchTime, setLastTouchTime] = useState(0)
  const didDragRef = useRef(false)
  const activePointerIdRef = useRef(null)
  const carouselRef = useRef(null)

  // Thresholds
  const DRAG_ACTIVATION_PX = 8
  const MOUSE_PAGE_THRESHOLD_PX = 80
  const TOUCH_DISTANCE_THRESHOLD_PX = 60
  const TOUCH_VELOCITY_THRESHOLD = 0.5

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage)

  // Pointer events (works for mouse, touch, pen)
  const handlePointerDown = e => {
    if (isTransitioning || totalPages <= 1) return
    if (e.pointerType === 'mouse' && e.button !== 0) return

    const x = e.clientX

    // Don't set isDragging immediately - wait for actual movement
    setStartX(x)
    setDragDistance(0)
    setVelocity(0)
    didDragRef.current = false

    // Store the pointer ID for tracking, but don't capture yet
    activePointerIdRef.current = e.pointerId

    // Do not preventDefault here; we only do so once a drag is confirmed
  }

  const handlePointerMove = e => {
    if (isTransitioning || totalPages <= 1) return
    if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return

    // Only process if we have a start position (pointer was pressed)
    if (startX === 0) return

    const x = e.clientX
    const distance = x - startX

    // Start dragging once movement exceeds threshold
    if (!isDragging && Math.abs(distance) > DRAG_ACTIVATION_PX) {
      setIsDragging(true)
      didDragRef.current = true

      // Capture the pointer now that we're dragging
      if (carouselRef.current && carouselRef.current.setPointerCapture) {
        try {
          carouselRef.current.setPointerCapture(e.pointerId)
        } catch (err) {
          // Ignore errors from unsupported pointer capture
          void err
        }
      }

      // Prevent default behavior once drag is confirmed
      e.preventDefault()
    }

    // Only continue if we're in drag mode
    if (!isDragging) return

    // Prevent native scrolling for touch pointers
    if (e.pointerType === 'touch') {
      e.preventDefault()
    }

    // Add elastic resistance at boundaries
    let elasticDistance = distance
    if (distance > 0 && currentPage === 1) {
      elasticDistance = distance * 0.3
    } else if (distance < 0 && currentPage === totalPages) {
      elasticDistance = distance * 0.3
    }

    setDragDistance(elasticDistance)

    // Approximate velocity for touch pointers
    if (e.pointerType === 'touch') {
      const now = Date.now()
      const dt = now - lastTouchTime
      if (dt > 0) {
        setVelocity(distance / dt)
      }
      setLastTouchTime(now)
    }
  }

  const finishDragByDistance = () => {
    const threshold = MOUSE_PAGE_THRESHOLD_PX
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && currentPage > 1) {
        handlePageChange(currentPage - 1)
        return true
      } else if (dragDistance < 0 && currentPage < totalPages) {
        handlePageChange(currentPage + 1)
        return true
      }
    }
    return false
  }

  const handlePointerUp = e => {
    // Release capture only if we were dragging (and thus had captured)
    if (isDragging && carouselRef.current && activePointerIdRef.current !== null) {
      try {
        carouselRef.current.releasePointerCapture(activePointerIdRef.current)
      } catch (err) {
        // Ignore errors from unsupported pointer capture
        void err
      }
    }

    activePointerIdRef.current = null

    // Reset start position
    setStartX(0)

    // If we never started dragging, this was just a click - let it through
    if (!isDragging) {
      didDragRef.current = false
      return
    }

    if (isTransitioning || totalPages <= 1) return

    if (e.pointerType === 'touch') {
      // For touch, consider both distance and velocity
      const threshold = TOUCH_DISTANCE_THRESHOLD_PX
      const velocityThreshold = TOUCH_VELOCITY_THRESHOLD

      let shouldChange = false
      let target = currentPage

      if (Math.abs(dragDistance) > threshold) {
        shouldChange = true
        target = dragDistance > 0 ? currentPage - 1 : currentPage + 1
      } else if (Math.abs(velocity) > velocityThreshold) {
        shouldChange = true
        target = velocity > 0 ? currentPage - 1 : currentPage + 1
      }

      if (shouldChange) {
        if (target < 1) target = 1
        if (target > totalPages) target = totalPages
        handlePageChange(target)
      }
    } else {
      // Mouse/pen: change page only if threshold exceeded
      finishDragByDistance()
    }

    setIsDragging(false)
    setDragDistance(0)
    setVelocity(0)
    didDragRef.current = false
  }

  const handlePointerCancel = () => {
    setIsDragging(false)
    setDragDistance(0)
    setVelocity(0)
    setStartX(0)
    activePointerIdRef.current = null
    didDragRef.current = false
  }

  // Add passive event listeners for better performance
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    // Handle trackpad gestures (two-finger horizontal scrolling)
    const handleWheel = e => {
      if (isTransitioning || totalPages <= 1) return

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault()

        const threshold = 50
        if (e.deltaX > threshold && currentPage > 1) {
          handlePageChange(currentPage - 1)
        } else if (e.deltaX < -threshold && currentPage < totalPages) {
          handlePageChange(currentPage + 1)
        }
      }
    }

    carousel.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      carousel.removeEventListener('wheel', handleWheel)
    }
  }, [isDragging, isTransitioning, totalPages, currentPage, startX, dragDistance, velocity, lastTouchTime])

  const handlePageChange = page => {
    if (page === currentPage || isTransitioning) return

    setIsTransitioning(true)
    setCurrentPage(page)
    setDragDistance(0)
    setVelocity(0)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const pages = []
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage))
  }

  const getTransform = () => {
    if (totalPages <= 1) return 'translateX(0%)'
    const pageWidth = 100 / totalPages
    const baseTransform = -((currentPage - 1) * pageWidth)
    const dragOffset = isDragging ? (dragDistance / window.innerWidth) * pageWidth : 0
    return `translateX(${baseTransform + dragOffset}%)`
  }

  const placeholders = Array(itemsPerPage)
    .fill()
    .map((item, idx) => (
      <div className='show-loading-animation' key={idx}>
        {placeholderComponent || (
          <RectShape
            color='#efefef'
            sx={{
              borderRadius: '8px',
              boxShadow: 'md',
              paddingBottom: '100%',
              width: '100%'
            }}
            showLoadingAnimation
          />
        )}
      </div>
    ))

  if (totalPages <= 1) {
    return (
      <div>
        <Grid
          sx={{
            gridGap,
            gridTemplateColumns: gridTemplateColumns
          }}
        >
          <ReactPlaceholder customPlaceholder={placeholders} ready={!isLoading} showLoadingAnimation type='rect'>
            {items.map((item, idx) => renderItem(item, idx))}
          </ReactPlaceholder>
        </Grid>
      </div>
    )
  }

  return (
    <div>
      {/* Carousel Container */}
      <div
        sx={{
          overflow: 'hidden',
          position: 'relative',
          width: '100%'
        }}
      >
        <div
          ref={carouselRef}
          data-testid='widget-carousel'
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onDragStart={e => e.preventDefault()}
          sx={{
            display: 'flex',
            width: `${totalPages * 100}%`,
            transform: getTransform(),
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'pan-y pinch-zoom',
            WebkitUserDrag: 'none'
          }}
        >
          {pages.map((pageItems, pageIndex) => (
            <div
              key={pageIndex}
              sx={{
                width: `${100 / totalPages}%`,
                flexShrink: 0
              }}
            >
              <Grid
                sx={{
                  gridGap,
                  gridTemplateColumns: gridTemplateColumns
                }}
              >
                <ReactPlaceholder customPlaceholder={placeholders} ready={!isLoading} showLoadingAnimation type='rect'>
                  {pageItems.map((item, idx) => renderItem(item, pageIndex * itemsPerPage + idx))}
                </ReactPlaceholder>
              </Grid>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <WidgetPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}

export default WidgetCarousel
