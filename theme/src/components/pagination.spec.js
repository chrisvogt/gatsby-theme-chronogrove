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
})
