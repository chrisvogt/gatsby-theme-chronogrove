/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Card } from '@theme-ui/components'
import { Heading } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import Placeholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { useState, useRef, useEffect, useMemo } from 'react'
import Pagination from '../../pagination'
import DiscogsModal from './discogs-modal'

const VinylCollection = ({ isLoading, releases = [] }) => {
  const [currentVinylId, setCurrentVinylId] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef(null)
  const [exitingVinylId, setExitingVinylId] = useState(null)
  const leaveTimeoutRef = useRef(null)

  // Modal state
  const [selectedRelease, setSelectedRelease] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate items per page and pagination
  // Always maintain 3 rows per page across all breakpoints
  // Breakpoints: [3, 4, 4, 5, 6] columns → [9, 12, 12, 15, 18] items per page
  const columnsPerBreakpoint = [3, 4, 4, 5, 6]
  const [currentBreakpointIndex, setCurrentBreakpointIndex] = useState(4) // Default to largest breakpoint

  // Calculate pagination to ensure each page fills exactly 3 rows
  const paginationData = useMemo(() => {
    const currentColumns = columnsPerBreakpoint[currentBreakpointIndex]
    const itemsPerRow = currentColumns
    const itemsPerPage = itemsPerRow * 3 // Always 3 rows per page

    // Calculate total pages - always show all items, even if last page is partial
    const totalPages = Math.ceil(releases.length / itemsPerPage)

    // Check if the last page would have items that don't fill a complete row
    const itemsOnLastPage = releases.length % itemsPerPage
    const hasPartialLastPage = itemsOnLastPage > 0 && itemsOnLastPage < itemsPerRow

    return {
      currentColumns,
      itemsPerRow,
      itemsPerPage,
      totalPages,
      hasPartialLastPage,
      itemsOnLastPage: itemsOnLastPage || itemsPerPage // Use itemsPerPage if no remainder
    }
  }, [currentBreakpointIndex, releases.length])

  const { itemsPerPage, totalPages } = paginationData

  // Detect current breakpoint based on window width
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      let breakpointIndex = 4 // Default to largest breakpoint

      if (width < 640) {
        breakpointIndex = 0 // Mobile: 3 columns
      } else if (width < 768) {
        breakpointIndex = 1 // Small: 4 columns
      } else if (width < 1024) {
        breakpointIndex = 2 // Medium: 4 columns
      } else if (width < 1280) {
        breakpointIndex = 3 // Large: 5 columns
      } else {
        breakpointIndex = 4 // XL: 6 columns
      }

      setCurrentBreakpointIndex(breakpointIndex)
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  // Adjust current page if it becomes invalid after breakpoint change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Reset to page 1 when breakpoint changes to ensure consistent pagination
  useEffect(() => {
    setCurrentPage(1)
  }, [currentBreakpointIndex])

  // Create responsive placeholders based on current breakpoint
  const placeholders = Array(itemsPerPage)
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

  // Modal handlers
  const handleVinylClick = release => {
    if (isDragging || isTransitioning) return
    setSelectedRelease(release)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRelease(null)
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

  // Split items into pages using total pages (ensures all items are displayed)
  const pages = []
  for (let i = 0; i < totalPages; i++) {
    const start = i * itemsPerPage
    const end = Math.min(start + itemsPerPage, vinylItems.length)
    pages.push(vinylItems.slice(start, end))
  }

  // Calculate transform for carousel
  const getTransform = () => {
    const pageWidth = 100 / totalPages
    const baseTransform = -((currentPage - 1) * pageWidth)
    const dragOffset = isDragging ? (dragDistance / window.innerWidth) * pageWidth : 0
    return `translateX(${baseTransform + dragOffset}%)`
  }

  return (
    <div sx={{ mb: 4, maxWidth: '100%', overflow: 'hidden' }}>
      <div sx={{ display: 'flex', alignItems: 'center' }}>
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
          width: '100%',
          maxWidth: '100%'
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
                key={`grid-${currentBreakpointIndex}-${pageIndex}`}
                className={`vinyl-collection_grid ${currentVinylId ? 'vinyl-collection_grid--interacting' : null}`}
                sx={{
                  display: 'grid',
                  gridGap: [1, 2, 2, 3],
                  gridTemplateColumns: [
                    'repeat(3, 1fr)',
                    'repeat(4, 1fr)',
                    'repeat(4, 1fr)',
                    'repeat(5, 1fr)',
                    'repeat(6, 1fr)'
                  ],
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  minHeight: 'auto',
                  height: 'auto'
                }}
              >
                <Placeholder ready={!isLoading} customPlaceholder={placeholders}>
                  {pageItems.map(({ id, title, year, artistName, cdnThumbUrl, details }) => {
                    const release = releases.find(r => r.id === id)
                    return (
                      <Card
                        key={id}
                        variant='actionCard'
                        sx={{
                          p: [0.5, 1, 2, 3],
                          minWidth: 0,
                          boxSizing: 'border-box',
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
                          className={`vinyl-record${currentVinylId === id ? ' vinyl-record--focused' : ''}${
                            exitingVinylId === id ? ' vinyl-record--exiting' : ''
                          }`}
                          onMouseEnter={() => {
                            if (leaveTimeoutRef.current) {
                              clearTimeout(leaveTimeoutRef.current)
                              leaveTimeoutRef.current = null
                            }
                            setExitingVinylId(null)
                            if (!isDragging) setCurrentVinylId(id)
                          }}
                          onMouseLeave={() => {
                            if (leaveTimeoutRef.current) {
                              clearTimeout(leaveTimeoutRef.current)
                            }
                            // Delay clearing focus to allow overlay fade-out without flashing center text
                            const delay = process.env.NODE_ENV === 'test' ? 0 : 220
                            if (delay === 0) {
                              // Synchronous for tests to avoid timing assertions
                              setCurrentVinylId(false)
                              setExitingVinylId(null)
                              return
                            }
                            setExitingVinylId(id)
                            leaveTimeoutRef.current = setTimeout(() => {
                              setCurrentVinylId(false)
                              setExitingVinylId(null)
                              leaveTimeoutRef.current = null
                            }, delay)
                          }}
                          onClick={() => handleVinylClick(release)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleVinylClick(release)
                            }
                          }}
                          title={details}
                          aria-label={`${details}. Click to view details.`}
                          tabIndex={0}
                          role='button'
                          sx={{
                            display: 'block',
                            position: 'relative',
                            height: '100%',
                            width: '100%',
                            transition: 'all 300ms ease-in-out',
                            transform: 'translateY(0) scale(1)',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: isDragging ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(1.05)',
                              boxShadow: isDragging ? 'none' : 'xl',
                              // Reduce hover effects on mobile to prevent overflow
                              '@media (max-width: 639px)': {
                                transform: isDragging ? 'translateY(0) scale(1)' : 'translateY(-2px) scale(1.02)',
                                boxShadow: isDragging ? 'none' : 'md'
                              },
                              // Further reduce hover effects on very small screens to prevent overflow
                              '@media (max-width: 515px)': {
                                transform: isDragging ? 'translateY(0) scale(1)' : 'translateY(-1px) scale(1.01)',
                                boxShadow: isDragging ? 'none' : 'sm'
                              }
                            },
                            '&:focus': {
                              outline: '2px solid',
                              outlineColor: 'primary',
                              outlineOffset: '2px',
                              // Reduce focus outline on mobile to prevent overflow
                              '@media (max-width: 639px)': {
                                outlineOffset: '1px'
                              },
                              // Further reduce focus outline on very small screens
                              '@media (max-width: 515px)': {
                                outline: '1px solid',
                                outlineOffset: '1px'
                              }
                            },
                            borderRadius: '50%',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
                            '&.vinyl-record--focused .vinyl-record_caption': {
                              opacity: isDragging ? 0 : 1
                            },
                            '&.vinyl-record--focused .vinyl-record_orbit': {
                              opacity: isDragging ? 0 : 1
                            },
                            '&.vinyl-record--exiting .vinyl-record_orbit': {
                              opacity: 0,
                              transition: 'opacity 0.2s ease-in-out'
                            },
                            '&.vinyl-record--exiting .vinyl-record_album-art': {
                              // Keep spinning during exit fade so orbit and record feel synchronized
                              animation: 'recordSpin 16s linear infinite',
                              animationPlayState: isDragging ? 'paused' : 'running'
                            },
                            '&.vinyl-record--focused .vinyl-record_caption span': {
                              display: 'none'
                            },
                            '&.vinyl-record--focused .vinyl-record_album-art': {
                              animation: 'recordSpin 16s linear infinite',
                              animationPlayState: isDragging ? 'paused' : 'running'
                            },
                            '@keyframes recordSpin': {
                              '0%': { transform: 'rotate(0deg)' },
                              '100%': { transform: 'rotate(360deg)' }
                            },
                            '@media (prefers-reduced-motion: reduce)': {
                              '&.vinyl-record--focused .vinyl-record_album-art': {
                                animation: 'none !important'
                              }
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
                              border: '2px solid #333',
                              // Reduce border on mobile to prevent overflow
                              '@media (max-width: 639px)': {
                                border: '1px solid #333'
                              }
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
                                  className='vinyl-record_album-art'
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

                            {/* Hover caption (ring overlay) */}
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
                                background: 'rgba(0, 0, 0, 0.75)',
                                borderRadius: '50%',
                                // Create a ring by masking out the center so the vinyl image shows through
                                maskImage: 'radial-gradient(circle at center, transparent 0 52%, black 56% 100%)',
                                WebkitMaskImage: 'radial-gradient(circle at center, transparent 0 52%, black 56% 100%)',
                                zIndex: 4
                              }}
                            >
                              {/* Visually hidden caption for screen readers */}
                              <span
                                sx={{
                                  position: 'absolute',
                                  width: '1px',
                                  height: '1px',
                                  padding: 0,
                                  margin: '-1px',
                                  overflow: 'hidden',
                                  clip: 'rect(0, 0, 0, 0)',
                                  whiteSpace: 'nowrap',
                                  border: 0
                                }}
                              >
                                {details}
                              </span>

                              {/* Orbiting text is always rendered; visibility controlled via focus class */}
                              <Themed.div
                                className='vinyl-record_orbit'
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  borderRadius: '50%',
                                  pointerEvents: 'none',
                                  color: 'white',
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease-in-out',
                                  zIndex: 5,
                                  '@keyframes orbitSpin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                  },
                                  '@media (prefers-reduced-motion: reduce)': {
                                    '& svg g': {
                                      animation: 'none !important'
                                    }
                                  }
                                }}
                              >
                                <svg
                                  viewBox='0 0 100 100'
                                  width='100%'
                                  height='100%'
                                  role='presentation'
                                  aria-hidden='true'
                                  style={{ display: 'block' }}
                                >
                                  <defs>
                                    <path
                                      id={`textCircle-${id}`}
                                      d='M50,50 m0,-44 a44,44 0 1,1 0,88 a44,44 0 1,1 0,-88'
                                    />
                                  </defs>
                                  <g
                                    sx={{
                                      transformOrigin: '50% 50%',
                                      animation: 'orbitSpin 16s linear infinite',
                                      animationPlayState: isDragging ? 'paused' : 'running'
                                    }}
                                  >
                                    <text
                                      fill='currentColor'
                                      sx={{
                                        fontFamily: 'heading',
                                        fontSize: '4px',
                                        letterSpacing: '0.6px',
                                        textTransform: 'uppercase'
                                      }}
                                    >
                                      <textPath
                                        href={`#textCircle-${id}`}
                                        startOffset='0%'
                                        method='align'
                                        spacing='auto'
                                      >
                                        {`${title || 'Unknown'} • ${artistName || 'Unknown Artist'} • ${year || 'Unknown Year'} • ${title || 'Unknown'} • ${artistName || 'Unknown Artist'} • ${year || 'Unknown Year'} • `}
                                      </textPath>
                                    </text>
                                  </g>
                                </svg>
                              </Themed.div>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant='primary'
          size='medium'
        />
      )}

      {/* Modal */}
      <DiscogsModal isOpen={isModalOpen} onClose={handleCloseModal} release={selectedRelease} />
    </div>
  )
}

export default VinylCollection
