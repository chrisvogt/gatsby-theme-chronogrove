/** @jsx jsx */
import React from 'react'
import { jsx, Box } from 'theme-ui'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PaginationButton from './pagination-button'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'primary',
  size = 'medium',
  showPageInfo = true,
  maxVisiblePages = 5,
  simple = false
}) => {
  const goToPage = page => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const goToPrevious = () => goToPage(currentPage - 1)
  const goToNext = () => goToPage(currentPage + 1)

  // Smart pagination: show current page and neighbors
  const getVisiblePages = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    // Calculate start and end pages
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
    }

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages()

  // Simple mode: just prev/next buttons with optional page counter
  if (simple) {
    return (
      <div sx={{ width: '100%' }}>
        <div
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <PaginationButton
            onClick={goToPrevious}
            disabled={currentPage === 1}
            variant={variant}
            size={size}
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
            aria-label='Previous page'
          />
          {showPageInfo && (
            <Box as='span' sx={{ fontSize: 0, color: 'textMuted' }}>
              {currentPage}/{totalPages}
            </Box>
          )}
          <PaginationButton
            onClick={goToNext}
            disabled={currentPage === totalPages}
            variant={variant}
            size={size}
            icon={<FontAwesomeIcon icon={faChevronRight} />}
            aria-label='Next page'
          />
        </div>
      </div>
    )
  }

  return (
    <div sx={{ width: '100%' }}>
      {/* Pagination Controls */}
      <div
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
          gap: [1, 2]
        }}
      >
        {/* Previous Button */}
        <PaginationButton
          onClick={goToPrevious}
          disabled={currentPage === 1}
          variant={variant}
          size={size}
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
          aria-label='Previous page'
        />

        {/* Page Numbers */}
        <div
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mx: 2
          }}
        >
          {/* Show first page if not visible */}
          {visiblePages[0] > 1 && (
            <>
              <PaginationButton onClick={() => goToPage(1)} variant={variant} size={size} aria-label='Go to page 1'>
                1
              </PaginationButton>
              {visiblePages[0] > 2 && <span sx={{ color: 'textMuted', fontSize: '12px', px: 1 }}>...</span>}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map(page => (
            <PaginationButton
              key={page}
              onClick={() => goToPage(page)}
              active={page === currentPage}
              variant={variant}
              size={size}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PaginationButton>
          ))}

          {/* Show last page if not visible */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span sx={{ color: 'textMuted', fontSize: '12px', px: 1 }}>...</span>
              )}
              <PaginationButton
                onClick={() => goToPage(totalPages)}
                variant={variant}
                size={size}
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </PaginationButton>
            </>
          )}
        </div>

        {/* Next Button */}
        <PaginationButton
          onClick={goToNext}
          disabled={currentPage === totalPages}
          variant={variant}
          size={size}
          icon={<FontAwesomeIcon icon={faChevronRight} />}
          aria-label='Next page'
        />
      </div>

      {/* Page Info */}
      {showPageInfo && (
        <div
          sx={{
            textAlign: 'center',
            mt: 2,
            fontSize: 0,
            color: 'textMuted',
            display: 'block'
          }}
        >
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  )
}

export default Pagination
