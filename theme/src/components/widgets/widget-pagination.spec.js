import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'theme-ui'
import theme from '../../gatsby-plugin-theme-ui/theme'
import WidgetPagination from './widget-pagination'

const renderWithTheme = component => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe('WidgetPagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('renders nothing when totalPages is 1', () => {
    renderWithTheme(<WidgetPagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />)

    expect(screen.queryByText('Page 1 of 1')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument()
  })

  it('renders pagination controls when totalPages > 1', () => {
    renderWithTheme(<WidgetPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />)

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to page 3')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    renderWithTheme(<WidgetPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />)

    const prevButton = screen.getByLabelText('Previous page')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    renderWithTheme(<WidgetPagination currentPage={3} totalPages={3} onPageChange={mockOnPageChange} />)

    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when clicking page numbers', () => {
    renderWithTheme(<WidgetPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />)

    const page2Button = screen.getByLabelText('Go to page 2')
    fireEvent.click(page2Button)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when clicking previous button', () => {
    renderWithTheme(<WidgetPagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />)

    const prevButton = screen.getByLabelText('Previous page')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange when clicking next button', () => {
    renderWithTheme(<WidgetPagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />)

    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('does not call onPageChange when clicking current page', () => {
    renderWithTheme(<WidgetPagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />)

    const currentPageButton = screen.getByLabelText('Go to page 2')
    fireEvent.click(currentPageButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('does not call onPageChange when clicking disabled buttons', () => {
    renderWithTheme(<WidgetPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />)

    const prevButton = screen.getByLabelText('Previous page')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('highlights current page correctly', () => {
    renderWithTheme(<WidgetPagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />)

    const currentPageButton = screen.getByLabelText('Go to page 2')
    const otherPageButton = screen.getByLabelText('Go to page 1')

    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    expect(otherPageButton).not.toHaveAttribute('aria-current')
  })
})
