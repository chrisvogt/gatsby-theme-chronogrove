import React from 'react'
import { Box } from '@theme-ui/components'

import PaginationButton from './pagination-button.js'
import { ChevronLeftIcon, ChevronRightIcon } from './chevron-icons.js'

/**
 * Full pagination control (prev/next + page numbers, or simple mode).
 * Default prev/next icons are inline SVGs; pass `prevIcon` / `nextIcon` to override.
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'primary',
  size = 'medium',
  showPageInfo = true,
  maxVisiblePages = 5,
  simple = false,
  prevIcon = <ChevronLeftIcon />,
  nextIcon = <ChevronRightIcon />
}) => {
  const goToPage = page => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const goToPrevious = () => goToPage(currentPage - 1)
  const goToNext = () => goToPage(currentPage + 1)

  const getVisiblePages = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages()

  if (simple) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box
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
            icon={prevIcon}
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
            icon={nextIcon}
            aria-label='Next page'
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
          gap: [1, 2]
        }}
      >
        <PaginationButton
          onClick={goToPrevious}
          disabled={currentPage === 1}
          variant={variant}
          size={size}
          icon={prevIcon}
          aria-label='Previous page'
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mx: 2
          }}
        >
          {visiblePages[0] > 1 && (
            <>
              <PaginationButton onClick={() => goToPage(1)} variant={variant} size={size} aria-label='Go to page 1'>
                1
              </PaginationButton>
              {visiblePages[0] > 2 && (
                <Box as='span' sx={{ color: 'textMuted', fontSize: '12px', px: 1 }}>
                  ...
                </Box>
              )}
            </>
          )}

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

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <Box as='span' sx={{ color: 'textMuted', fontSize: '12px', px: 1 }}>
                  ...
                </Box>
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
        </Box>

        <PaginationButton
          onClick={goToNext}
          disabled={currentPage === totalPages}
          variant={variant}
          size={size}
          icon={nextIcon}
          aria-label='Next page'
        />
      </Box>

      {showPageInfo && (
        <Box
          sx={{
            textAlign: 'center',
            mt: 2,
            fontSize: 0,
            color: 'textMuted',
            display: 'block'
          }}
        >
          Page {currentPage} of {totalPages}
        </Box>
      )}
    </Box>
  )
}

export default Pagination
