/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { Box, Heading } from '@theme-ui/components'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { Themed } from '@theme-ui/mdx'
import { useLocation, navigate } from '@gatsbyjs/reach-router'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import isDarkMode from '../../../helpers/isDarkMode'
import Pagination from '../../pagination'
import useSwipePagination from '../../../hooks/use-swipe-pagination'

import BookExplorer from './book-explorer'
import BookLink from './book-link'

export const HEADLINE = 'Books'
export const BODY_TEXT = 'Recently read and finished books from Goodreads.'

const BOOKS_PER_PAGE = 10
const RECENTLY_READ_SKELETON_KEYS = 'abcdefghij'.split('')

const RecentlyReadBooks = ({ books = [], isLoading }) => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  /**
   * After a page change, React unmounts the old slide's Book3D and mounts the new slide's in the
   * same commit. That overlaps WebGL create/dispose and can briefly hold ~2× book contexts plus
   * ColorBends, exceeding the browser cap and revoking the background. We show flat covers on the
   * active slide for two animation frames so previous renderers can finish disposing first.
   */
  const [activeSlideWebglReady, setActiveSlideWebglReady] = useState(true)
  const skipInitialWebglDefer = useRef(true)
  const params = new URLSearchParams(location.search)
  const bookId = params.get('bookId')
  const selectedBook = bookId ? books.find(book => book.id === bookId) : null
  const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE))
  const pages = useMemo(() => {
    if (!books.length) {
      return [[]]
    }

    return Array.from({ length: totalPages }, (_, pageIndex) => {
      const start = pageIndex * BOOKS_PER_PAGE
      return books.slice(start, start + BOOKS_PER_PAGE)
    })
  }, [books, totalPages])
  const {
    getTransform,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    handlePageChange,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
    isTransitioning
  } = useSwipePagination({
    currentPage,
    totalPages,
    onPageChange: setCurrentPage
  })

  const handleCarouselKeyDown = useCallback(
    event => {
      if (totalPages <= 1) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        handlePageChange(currentPage + 1)
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        handlePageChange(currentPage - 1)
      }
    },
    [currentPage, handlePageChange, totalPages]
  )

  // Handle scroll position restoration and prevention
  useEffect(() => {
    // Store the current scroll position when the component mounts
    const scrollPosition = window.scrollY

    // If we have a bookId in the URL on initial render, scroll to the goodreads element
    if (bookId && !location.state?.scrollPosition && !location.state?.noScroll) {
      // Use a small delay to ensure the element is ready, especially in Chrome
      setTimeout(() => {
        const goodreadsElement = document.getElementById('goodreads')
        if (goodreadsElement) {
          goodreadsElement.scrollIntoView?.({ block: 'nearest' })
          window.location.hash = 'goodreads'
        }
      }, 100)
    }
    // If we have a scroll position in state, restore it
    else if (location.state?.scrollPosition) {
      // Use requestAnimationFrame to ensure smooth restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          top: location.state.scrollPosition,
          behavior: 'instant' // Use instant to prevent animation
        })
      })
    } else if (location.state?.noScroll) {
      // If noScroll is true, maintain the current position
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'instant'
        })
      })
    }

    // Cleanup function to handle component unmount
    return () => {
      // Store the current scroll position when unmounting
      if (window.scrollY !== scrollPosition) {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'instant'
        })
      }
    }
  }, [location.state, location.search, bookId]) // Add bookId to dependencies

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const booksIdentityKey = books.map(b => b.id).join(',')
  useEffect(() => {
    setCurrentPage(1)
  }, [booksIdentityKey])

  useEffect(() => {
    if (skipInitialWebglDefer.current) {
      skipInitialWebglDefer.current = false
      return
    }
    setActiveSlideWebglReady(false)
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setActiveSlideWebglReady(true)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [currentPage])

  const handleClose = e => {
    if (e) {
      e.preventDefault()
    }
    const currentScroll = window.scrollY
    // Use replace to avoid adding to history stack
    navigate(location.pathname, {
      replace: true,
      state: {
        scrollPosition: currentScroll,
        noScroll: true
      }
    })
  }

  let carouselCursor = 'default'
  if (totalPages > 1) {
    carouselCursor = isDragging ? 'grabbing' : 'grab'
  }

  return (
    <div className='gallery'>
      <Box sx={{ mb: 4 }}>
        <Heading
          as='h3'
          sx={{
            mb: 3,
            fontSize: [3, 4]
          }}
        >
          {HEADLINE}
        </Heading>

        <Themed.p>{BODY_TEXT}</Themed.p>

        {selectedBook ? (
          <BookExplorer book={selectedBook} onClose={handleClose} />
        ) : (
          <Box
            sx={{
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              pb: 4,
              mb: -4
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: 'grid',
                  gridGap: [3, 1, 2],
                  gridTemplateColumns: ['repeat(3, 1fr)', 'repeat(4, 1fr)', 'repeat(4, 1fr)', 'repeat(6, 1fr)']
                }}
              >
                {RECENTLY_READ_SKELETON_KEYS.map(slotKey => (
                  <RectShape
                    color={darkModeActive ? '#3a3a4a' : '#efefef'}
                    key={`recently-read-skeleton-${slotKey}`}
                    sx={{
                      boxShadow: 'md',
                      minHeight: '140px',
                      width: '100%'
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Box
                data-testid='goodreads-carousel'
                role='region'
                aria-label='Recently read books'
                tabIndex={0}
                onKeyDown={handleCarouselKeyDown}
                sx={{
                  display: 'flex',
                  width: `${totalPages * 100}%`,
                  transform: getTransform(),
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: carouselCursor,
                  userSelect: 'none',
                  touchAction: 'pan-y'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
              >
                {pages.map((pageBooks, pageIndex) => (
                  <Box
                    key={`goodreads-page-${pageIndex + 1}`}
                    aria-hidden={pageIndex !== currentPage - 1}
                    data-testid={`goodreads-page-${pageIndex + 1}`}
                    sx={{
                      width: `${100 / totalPages}%`,
                      flexShrink: 0,
                      minWidth: 0,
                      boxSizing: 'border-box',
                      overflowX: 'clip',
                      overflowY: 'visible',
                      pr: 3,
                      pb: 1
                    }}
                  >
                    <Box
                      sx={t => ({
                        display: 'grid',
                        gridGap: [3, 1, 2],
                        gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)', 'repeat(5, 1fr)'],
                        // Fill slide width including pr shadow gutter (negative mr does not widen 1fr tracks).
                        width: `calc(100% + ${t.space[3]})`,
                        maxWidth: 'none',
                        boxSizing: 'border-box'
                      })}
                    >
                      {pageBooks.map((book, bookIndex) => (
                        <BookLink
                          id={book.id}
                          key={book.id}
                          flatCover={pageIndex !== currentPage - 1 || !activeSlideWebglReady}
                          introDelay={bookIndex * 80}
                          suppressNavigation={isDragging || isTransitioning}
                          thumbnailURL={book.cdnMediaURL || book.thumbnail}
                          title={book.title}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {!selectedBook && !isLoading && (
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
        )}
      </Box>
    </div>
  )
}

export default RecentlyReadBooks
