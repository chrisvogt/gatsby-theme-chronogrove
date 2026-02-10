/** @jsx jsx */
import { jsx } from 'theme-ui'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const VinylPagination = ({ currentPage, totalPages, onPageChange }) => {
  const goToPage = page => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const goToPrevious = () => goToPage(currentPage - 1)
  const goToNext = () => goToPage(currentPage + 1)

  // Smart pagination: responsive page display
  const getVisiblePages = () => {
    const pages = []

    // Always show current page
    pages.push(currentPage)

    // On mobile: show ±1, on desktop: show ±2
    const maxBefore = 2 // Maximum pages before current
    const maxAfter = 2 // Maximum pages after current

    // Add previous pages
    for (let i = 1; i <= maxBefore; i++) {
      if (currentPage - i >= 1) {
        pages.unshift(currentPage - i)
      }
    }

    // Add next pages
    for (let i = 1; i <= maxAfter; i++) {
      if (currentPage + i <= totalPages) {
        pages.push(currentPage + i)
      }
    }

    return pages
  }

  return (
    <div sx={{ width: '100%' }}>
      {/* Pagination Controls */}
      {totalPages > 1 && (
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
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: ['32px', '40px'],
              height: ['32px', '40px'],
              borderRadius: '50%',
              border: ['1px solid', '2px solid'],
              borderColor: 'primary',
              backgroundColor: 'transparent',
              color: 'primary',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover:not(:disabled)': {
                borderColor: 'primary',
                color: 'primary',
                transform: 'scale(1.05)'
              },
              '&:active:not(:disabled)': {
                transform: 'scale(0.95)'
              }
            }}
            aria-label='Previous page'
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Page Numbers - Responsive */}
          <div
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mx: 2
            }}
          >
            {/* Smart pagination: show current page ± 1 neighbors */}
            <div
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {getVisiblePages().map((page, index) => {
                const isCurrentPage = page === currentPage
                const totalPages = getVisiblePages().length
                const isOuterPage = index === 0 || index === totalPages - 1
                const isMobileHidden = isOuterPage && !isCurrentPage

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: ['28px', '32px'],
                      height: ['28px', '32px'],
                      px: [1, 2],
                      borderRadius: ['14px', '16px'],
                      border: ['1px solid', '2px solid'],
                      borderColor: isCurrentPage ? 'primary' : 'primary',
                      backgroundColor: isCurrentPage ? 'primary' : 'transparent',
                      color: isCurrentPage ? 'white' : 'primary',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      fontSize: 0,
                      fontWeight: isCurrentPage ? 'bold' : 'normal',
                      // Hide outer pages on mobile (except current page)
                      '@media (max-width: 640px)': {
                        display: isMobileHidden ? 'none' : 'flex'
                      },
                      '&:hover': {
                        borderColor: 'primary',
                        transform: 'scale(1.05)'
                      },
                      '&:active': {
                        transform: 'scale(0.95)'
                      }
                    }}
                    aria-label={`Go to page ${page}`}
                    aria-current={isCurrentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: ['32px', '40px'],
              height: ['32px', '40px'],
              borderRadius: '50%',
              border: ['1px solid', '2px solid'],
              borderColor: 'primary',
              backgroundColor: 'transparent',
              color: 'primary',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover:not(:disabled)': {
                borderColor: 'primary',
                color: 'primary',
                transform: 'scale(1.05)'
              },
              '&:active:not(:disabled)': {
                transform: 'scale(0.95)'
              }
            }}
            aria-label='Next page'
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* Page Info - Responsive */}
      {totalPages > 1 && (
        <div
          sx={{
            textAlign: 'center',
            mt: 2,
            fontSize: 0,
            color: 'primary',
            // Show on all screen sizes since smart pagination is compact
            display: 'block'
          }}
        >
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  )
}

export default VinylPagination
