/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef } from 'react'
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
  const carouselRef = useRef(null)

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage)

  // Swipe/drag handlers
  const handleMouseDown = e => {
    if (isTransitioning || totalPages <= 1) return
    setIsDragging(true)
    setStartX(e.pageX)
    setDragDistance(0)
  }

  const handleMouseMove = e => {
    if (!isDragging || isTransitioning || totalPages <= 1) return
    const distance = e.pageX - startX

    // Add elastic resistance at boundaries
    let elasticDistance = distance
    if (distance > 0 && currentPage === 1) {
      elasticDistance = distance * 0.3
    } else if (distance < 0 && currentPage === totalPages) {
      elasticDistance = distance * 0.3
    }

    setDragDistance(elasticDistance)
  }

  const handleMouseUp = () => {
    if (!isDragging || isTransitioning || totalPages <= 1) return

    const threshold = 80
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && currentPage > 1) {
        handlePageChange(currentPage - 1)
      } else if (dragDistance < 0 && currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      }
    }

    setIsDragging(false)
    setDragDistance(0)
  }

  const handleTouchStart = e => {
    if (isTransitioning || totalPages <= 1) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX)
    setDragDistance(0)
  }

  const handleTouchMove = e => {
    if (!isDragging || isTransitioning || totalPages <= 1) return
    const distance = e.touches[0].pageX - startX

    let elasticDistance = distance
    if (distance > 0 && currentPage === 1) {
      elasticDistance = distance * 0.3
    } else if (distance < 0 && currentPage === totalPages) {
      elasticDistance = distance * 0.3
    }

    setDragDistance(elasticDistance)
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  const handlePageChange = page => {
    if (page === currentPage || isTransitioning) return

    setIsTransitioning(true)
    setCurrentPage(page)
    setDragDistance(0)

    // Clear transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  // Split items into pages
  const pages = []
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage))
  }

  // Calculate transform for carousel
  const getTransform = () => {
    if (totalPages <= 1) return 'translateX(0%)'
    const pageWidth = 100 / totalPages
    const baseTransform = -((currentPage - 1) * pageWidth)
    const dragOffset = isDragging ? (dragDistance / window.innerWidth) * pageWidth : 0
    return `translateX(${baseTransform + dragOffset}%)`
  }

  // Create placeholders for loading state
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
    // Single page - render without carousel
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
          sx={{
            display: 'flex',
            width: `${totalPages * 100}%`,
            transform: getTransform(),
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
