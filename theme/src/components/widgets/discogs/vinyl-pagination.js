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
            gap: 2
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
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid',
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

          {/* Page Numbers */}
          <div
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mx: 2
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '32px',
                  height: '32px',
                  px: 2,
                  borderRadius: '16px',
                  border: '2px solid',
                  borderColor: page === currentPage ? 'primary' : 'primary',
                  backgroundColor: page === currentPage ? 'primary' : 'transparent',
                  color: page === currentPage ? 'white' : 'primary',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  fontSize: 0,
                  fontWeight: page === currentPage ? 'bold' : 'normal',
                  '&:hover': {
                    borderColor: 'primary',
                    transform: 'scale(1.05)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  }
                }}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid',
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

      {/* Page Info */}
      {totalPages > 1 && (
        <div
          sx={{
            textAlign: 'center',
            mt: 2,
            fontSize: 0,
            color: 'primary'
          }}
        >
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  )
}

export default VinylPagination
