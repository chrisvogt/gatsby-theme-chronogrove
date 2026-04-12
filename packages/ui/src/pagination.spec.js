import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import Pagination from './pagination.js'

const mockTheme = {
  colors: {
    primary: '#422EA3',
    primaryRgb: '66, 46, 163',
    modes: {
      dark: {
        text: '#ffffff',
        background: '#000000'
      }
    }
  }
}

const renderWithProviders = component => {
  return render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)
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

  it('does not call onPageChange when clicking the already active page', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={2} />)
    jest.clearAllMocks()
    fireEvent.click(screen.getByText('2'))
    expect(defaultProps.onPageChange).not.toHaveBeenCalled()
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

    const pageButton = screen.getByText('1')
    expect(pageButton).toHaveStyle({
      color: 'rgb(102, 102, 102)'
    })
  })

  it('applies custom size', () => {
    renderWithProviders(<Pagination {...defaultProps} size='large' />)

    const pageButton = screen.getByText('1')
    expect(pageButton).toHaveStyle({
      fontSize: '12px',
      minWidth: '32px',
      height: '32px'
    })
  })

  it('shows ellipsis when gap is exactly 2 pages from start', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={4} maxVisiblePages={3} />)

    const ellipsis = screen.getAllByText('...')
    expect(ellipsis.length).toBeGreaterThan(0)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows ellipsis when gap is exactly 2 pages from end', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={7} maxVisiblePages={3} />)

    const ellipsis = screen.getAllByText('...')
    expect(ellipsis.length).toBeGreaterThan(0)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('handles clicking first page button when first page is not visible', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={5} maxVisiblePages={3} />)

    const firstPageButton = screen.getByLabelText('Go to page 1')
    fireEvent.click(firstPageButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1)
  })

  it('handles clicking last page button when last page is not visible', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={5} maxVisiblePages={3} />)

    const lastPageButton = screen.getByLabelText('Go to page 10')
    fireEvent.click(lastPageButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(10)
  })

  it('uses custom prev and next icons when provided', () => {
    renderWithProviders(
      <Pagination
        {...defaultProps}
        prevIcon={<span data-testid='prev-custom'>«</span>}
        nextIcon={<span data-testid='next-custom'>»</span>}
      />
    )
    expect(screen.getByTestId('prev-custom')).toBeInTheDocument()
    expect(screen.getByTestId('next-custom')).toBeInTheDocument()
  })

  it('expands page window from the end when the range is narrower than maxVisiblePages', () => {
    renderWithProviders(<Pagination {...defaultProps} totalPages={10} currentPage={10} maxVisiblePages={5} />)
    expect(screen.getByLabelText('Go to page 10')).toBeInTheDocument()
  })

  describe('Simple mode', () => {
    it('renders only prev/next buttons in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} />)

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
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

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
      expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    })

    it('applies custom size in simple mode', () => {
      renderWithProviders(<Pagination {...defaultProps} simple={true} size='small' />)

      const prevButton = screen.getByLabelText('Previous page')
      expect(prevButton).toHaveStyle({
        fontSize: '10px',
        minWidth: '24px',
        height: '24px'
      })
    })
  })
})
