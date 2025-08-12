/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Card } from '@theme-ui/components'
import { Heading } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import Placeholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { useState, useRef } from 'react'
import WidgetPagination from '../widget-pagination'

const placeholders = Array(18)
  .fill()
  .map((item, idx) => (
    <div className='show-loading-animation' key={idx}>
      <RectShape
        color='#efefef'
        sx={{
          borderRadius: '50%',
          boxShadow: 'md',
          paddingBottom: '100%',
          width: '100%'
        }}
        showLoadingAnimation
      />
    </div>
  ))

const VinylCollection = ({ isLoading, releases = [] }) => {
  const [currentVinylId, setCurrentVinylId] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef(null)

  // Calculate items per page and pagination
  const itemsPerPage = 18 // 3 rows × 6 columns on desktop
  const totalPages = Math.ceil(releases.length / itemsPerPage)

  // Swipe/drag handlers
  const handleMouseDown = e => {
    if (isTransitioning) return
    setIsDragging(true)
    setStartX(e.pageX)
    setDragDistance(0)
  }

  const handleMouseMove = e => {
    if (!isDragging || isTransitioning) return
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
    if (!isDragging || isTransitioning) return

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
    if (isTransitioning) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX)
    setDragDistance(0)
  }

  const handleTouchMove = e => {
    if (!isDragging || isTransitioning) return
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

  // Create all vinyl items
  const vinylItems = releases.map(release => {
    const { id, basicInformation = {} } = release
    const { title, year, artists = [], cdnThumbUrl, resourceUrl } = basicInformation || {}
    const artistName = (artists || []).map(artist => artist.name).join(', ')
    const details = `${title || 'Unknown'} (${year || 'Unknown'}) - ${artistName || 'Unknown Artist'}`

    return {
      id,
      title,
      year,
      artistName,
      cdnThumbUrl,
      resourceUrl,
      details
    }
  })

  // Split items into pages
  const pages = []
  for (let i = 0; i < vinylItems.length; i += itemsPerPage) {
    pages.push(vinylItems.slice(i, i + itemsPerPage))
  }

  // Calculate transform for carousel
  const getTransform = () => {
    const pageWidth = 100 / totalPages
    const baseTransform = -((currentPage - 1) * pageWidth)
    const dragOffset = isDragging ? (dragDistance / window.innerWidth) * pageWidth : 0
    return `translateX(${baseTransform + dragOffset}%)`
  }

  return (
    <div sx={{ mb: 4 }}>
      <div sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <Heading as='h3' sx={{ fontSize: [3, 4] }}>
          Vinyl Collection
        </Heading>
      </div>

      <Themed.p>My owned vinyl records from Discogs.</Themed.p>

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
          data-testid='vinyl-carousel'
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
              <div
                className={`vinyl-collection_grid ${currentVinylId ? 'vinyl-collection_grid--interacting' : null}`}
                sx={{
                  display: 'grid',
                  gridGap: [3, 2, 2, 3],
                  gridTemplateColumns: [
                    'repeat(3, 1fr)',
                    'repeat(4, 1fr)',
                    'repeat(4, 1fr)',
                    'repeat(5, 1fr)',
                    'repeat(6, 1fr)'
                  ]
                }}
              >
                <Placeholder ready={!isLoading} customPlaceholder={placeholders}>
                  {pageItems.map(({ id, title, year, artistName, cdnThumbUrl, details }) => {
                    return (
                      <Card
                        key={id}
                        variant='actionCard'
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: isDragging ? 'none' : 'translateY(-4px)'
                          }
                        }}
                      >
                        <Themed.div
                          className={`vinyl-record${currentVinylId === id ? ' vinyl-record--focused' : ''}`}
                          onMouseEnter={() => !isDragging && setCurrentVinylId(id)}
                          onMouseLeave={() => setCurrentVinylId(false)}
                          title={details}
                          sx={{
                            display: 'block',
                            position: 'relative',
                            height: '100%',
                            width: '100%',
                            transition: 'all 300ms ease-in-out',
                            transform: 'translateY(0) scale(1)',
                            '&:hover': {
                              transform: isDragging ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(1.05)',
                              boxShadow: isDragging ? 'none' : 'xl'
                            },
                            borderRadius: '50%',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
                            '&:hover .vinyl-record_caption': {
                              opacity: isDragging ? 0 : 1
                            },
                            '&:hover .vinyl-record_image': {
                              transform: isDragging ? 'none' : 'rotate(180deg)'
                            }
                          }}
                        >
                          <div
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              height: '100%',
                              width: '100%',
                              position: 'relative',
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
                              border: '2px solid #333'
                            }}
                          >
                            {/* Vinyl record with album art */}
                            <div
                              className='vinyl-record_image'
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: '50%',
                                transition: 'transform 0.5s ease-in-out',
                                background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: '20%',
                                  height: '20%',
                                  borderRadius: '50%',
                                  background: '#000',
                                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
                                  zIndex: 3
                                },
                                '&::after': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  borderRadius: '50%',
                                  background: `repeating-conic-gradient(
                                  from 0deg,
                                  transparent 0deg,
                                  transparent 2deg,
                                  rgba(255, 255, 255, 0.05) 2deg,
                                  rgba(255, 255, 255, 0.05) 4deg
                                )`,
                                  zIndex: 1
                                }
                              }}
                            >
                              {cdnThumbUrl && (
                                <Themed.img
                                  alt={`${title} album cover`}
                                  crossOrigin='anonymous'
                                  loading='lazy'
                                  src={cdnThumbUrl}
                                  sx={{
                                    width: '70%',
                                    height: '70%',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    position: 'relative',
                                    zIndex: 2,
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                  }}
                                />
                              )}
                            </div>

                            {/* Hover caption */}
                            <Themed.div
                              className='vinyl-record_caption'
                              sx={{
                                color: 'white',
                                fontSize: [0, 1, 1, 1],
                                fontWeight: 'bold',
                                opacity: 0,
                                transition: 'opacity 0.3s ease-in-out',
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                position: 'absolute',
                                textAlign: 'center',
                                padding: 2,
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                background: 'rgba(0, 0, 0, 0.85)',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                borderRadius: '50%',
                                zIndex: 4
                              }}
                            >
                              <span sx={{ mb: 1, fontSize: [0, 1], lineHeight: 1.2 }}>{title}</span>
                              <span sx={{ fontSize: [0, 0, 1], opacity: 0.8, lineHeight: 1.1 }}>{artistName}</span>
                              <span sx={{ fontSize: [0, 0, 0], opacity: 0.6, mt: 1 }}>{year}</span>
                            </Themed.div>
                          </div>
                        </Themed.div>
                      </Card>
                    )
                  })}
                </Placeholder>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <WidgetPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default VinylCollection
