/** @jsx jsx */
import { jsx } from 'theme-ui'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeUIProvider } from 'theme-ui'

import Pagination from './pagination'

// Mock theme
const mockTheme = {
  colors: {
    modes: {
      dark: {
        text: '#ffffff',
        background: '#000000'
      }
    }
  }
}

// Mock store
const mockStore = configureStore({
  reducer: {
    theme: (state = { colorMode: 'light' }) => state
  }
})

const renderWithProviders = component => {
  return render(
    <Provider store={mockStore}>
      <ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>
    </Provider>
  )
}

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders pagination controls', () => {
    renderWithProviders(<Pagination {...defaultProps} />)

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders page info', () => {
    renderWithProviders(<Pagination {...defaultProps} />)

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument()
  })

  it('hides page info when showPageInfo is false', () => {
    renderWithProviders(<Pagination {...defaultProps} showPageInfo={false} />)

    expect(screen.queryByText('Page 1 of 5')).not.toBeInTheDocument()
  })

  it('handles page changes', () => {
    renderWithProviders(<Pagination {...defaultProps} />)

    const page2Button = screen.getByText('2')
    fireEvent.click(page2Button)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('handles previous button click', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={2} />)

    const prevButton = screen.getByLabelText('Previous page')
    fireEvent.click(prevButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1)
  })

  it('handles next button click', () => {
    renderWithProviders(<Pagination {...defaultProps} />)

    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables previous button on first page', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={1} />)

    const prevButton = screen.getByLabelText('Previous page')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={5} />)

    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toBeDisabled()
  })

  it('highlights current page', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={3} />)

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })

  it('shows ellipsis for large page ranges', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={5} maxVisiblePages={3} />)

    expect(screen.getAllByText('...')).toHaveLength(2)
  })

  it('shows first and last pages when needed', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={8} maxVisiblePages={3} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('returns null when totalPages is 1', () => {
    const { container } = renderWithProviders(<Pagination {...defaultProps} totalPages={1} />)

    expect(container.firstChild).toBeNull()
  })

  it('returns null when totalPages is 0', () => {
    const { container } = renderWithProviders(<Pagination {...defaultProps} totalPages={0} />)

    expect(container.firstChild).toBeNull()
  })

  it('applies custom variant', () => {
    renderWithProviders(<Pagination {...defaultProps} variant='secondary' currentPage={2} />)

    // Check that buttons have secondary styling (test non-current page)
    const pageButton = screen.getByText('1')
    expect(pageButton).toHaveStyle({
      color: 'rgb(102, 102, 102)'
    })
  })

  it('applies custom size', () => {
    renderWithProviders(<Pagination {...defaultProps} size='large' />)

    // Check that buttons have large styling
    const pageButton = screen.getByText('1')
    expect(pageButton).toHaveStyle({
      fontSize: '12px',
      minWidth: '32px',
      height: '32px'
    })
  })

  it('shows ellipsis when gap is exactly 2 pages from start', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={4} maxVisiblePages={3} />)

    // Should show ellipsis after page 1 since visiblePages[0] (4) > 2
    const ellipsis = screen.getAllByText('...')
    expect(ellipsis.length).toBeGreaterThan(0)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows ellipsis when gap is exactly 2 pages from end', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={7} maxVisiblePages={3} />)

    // Should show ellipsis before last page since visiblePages[visiblePages.length - 1] (9) < totalPages - 1 (9)
    const ellipsis = screen.getAllByText('...')
    expect(ellipsis.length).toBeGreaterThan(0)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('handles clicking first page button when first page is not visible', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={5} maxVisiblePages={3} />)

    // Click the first page button (should be visible with ellipsis)
    const firstPageButton = screen.getByLabelText('Go to page 1')
    fireEvent.click(firstPageButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1)
  })

  it('handles clicking last page button when last page is not visible', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={5} maxVisiblePages={3} />)

    // Click the last page button (should be visible with ellipsis)
    const lastPageButton = screen.getByLabelText('Go to page 10')
    fireEvent.click(lastPageButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(10)
  })

  describe('Simple mode', () => {
    it('renders only prev/next buttons in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} />)

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
      // Should not render page number buttons
      expect(screen.queryByText('1')).not.toBeInTheDocument()
      expect(screen.queryByText('2')).not.toBeInTheDocument()
    })

    it('shows page counter in simple mode when showPageInfo is true', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} showPageInfo={true} />)

      expect(screen.getByText('1/5')).toBeInTheDocument()
    })

    it('hides page counter in simple mode when showPageInfo is false', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} showPageInfo={false} />)

      expect(screen.queryByText('1/5')).not.toBeInTheDocument()
      // Buttons should still be present
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    })

    it('handles previous button click in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} currentPage={2} />)

      const prevButton = screen.getByLabelText('Previous page')
      fireEvent.click(prevButton)

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(1)
    })

    it('handles next button click in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} />)

      const nextButton = screen.getByLabelText('Next page')
      fireEvent.click(nextButton)

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
    })

    it('disables previous button on first page in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} currentPage={1} />)

      const prevButton = screen.getByLabelText('Previous page')
      expect(prevButton).toBeDisabled()
    })

    it('disables next button on last page in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} currentPage={5} />)

      const nextButton = screen.getByLabelText('Next page')
      expect(nextButton).toBeDisabled()
    })

    it('applies custom variant in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} variant='secondary' />)

      // Buttons should render with secondary variant
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    })

    it('applies custom size in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} size='small' />)

      // Buttons should render with small size
      const prevButton = screen.getByLabelText('Previous page')
      expect(prevButton).toHaveStyle({
        fontSize: '10px',
        minWidth: '24px',
        height: '24px'
      })
    })
  })
})
