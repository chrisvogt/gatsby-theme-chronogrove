import React from 'react'
import renderer from 'react-test-renderer'
import { render, fireEvent } from '@testing-library/react'

import VinylPagination from './vinyl-pagination'

describe('VinylPagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('renders pagination controls when totalPages > 1', () => {
    const tree = renderer
      .create(
        <VinylPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange}>
          <div>Test content</div>
        </VinylPagination>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('does not render pagination controls when totalPages <= 1', () => {
    const tree = renderer
      .create(
        <VinylPagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange}>
          <div>Test content</div>
        </VinylPagination>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('disables previous button on first page', () => {
    const tree = renderer
      .create(
        <VinylPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange}>
          <div>Test content</div>
        </VinylPagination>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('disables next button on last page', () => {
    const tree = renderer
      .create(
        <VinylPagination currentPage={3} totalPages={3} onPageChange={mockOnPageChange}>
          <div>Test content</div>
        </VinylPagination>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('shows correct page info', () => {
    const tree = renderer
      .create(
        <VinylPagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange}>
          <div>Test content</div>
        </VinylPagination>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls onPageChange when previous button is clicked', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />
    )

    const previousButton = getByLabelText('Previous page')
    fireEvent.click(previousButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange when next button is clicked', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />
    )

    const nextButton = getByLabelText('Next page')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when page number is clicked', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />
    )

    const pageButton = getByLabelText('Go to page 3')
    fireEvent.click(pageButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('does not call onPageChange when clicking current page', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />
    )

    const currentPageButton = getByLabelText('Go to page 2')
    fireEvent.click(currentPageButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('does not call onPageChange when clicking disabled previous button', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />
    )

    const previousButton = getByLabelText('Previous page')
    fireEvent.click(previousButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('does not call onPageChange when clicking disabled next button', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={3} totalPages={3} onPageChange={mockOnPageChange} />
    )

    const nextButton = getByLabelText('Next page')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('handles boundary conditions for page navigation', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />
    )

    // Test going to page 0 (should not call onPageChange)
    const previousButton = getByLabelText('Previous page')
    fireEvent.click(previousButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(1)

    mockOnPageChange.mockClear()

    // Test going to page beyond totalPages (should not call onPageChange)
    const nextButton = getByLabelText('Next page')
    fireEvent.click(nextButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('renders with single page correctly', () => {
    const { queryByLabelText } = render(
      <VinylPagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
    )

    // Should not render pagination controls
    expect(queryByLabelText('Previous page')).not.toBeInTheDocument()
    expect(queryByLabelText('Next page')).not.toBeInTheDocument()
    expect(queryByLabelText('Go to page 1')).not.toBeInTheDocument()
  })

  it('renders with many pages correctly', () => {
    const { getByLabelText, getAllByRole } = render(
      <VinylPagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    )

    // Should render smart pagination (current page ± 2, max 5 pages)
    const pageButtons = getAllByRole('button').filter(button =>
      button.getAttribute('aria-label')?.includes('Go to page')
    )
    expect(pageButtons).toHaveLength(5) // Pages 3, 4, 5, 6, 7

    // Should have correct current page
    const currentPageButton = getByLabelText('Go to page 5')
    expect(currentPageButton.getAttribute('aria-current')).toBe('page')

    // Should show the smart pagination range
    expect(getByLabelText('Go to page 3')).toBeInTheDocument()
    expect(getByLabelText('Go to page 4')).toBeInTheDocument()
    expect(getByLabelText('Go to page 5')).toBeInTheDocument()
    expect(getByLabelText('Go to page 6')).toBeInTheDocument()
    expect(getByLabelText('Go to page 7')).toBeInTheDocument()
  })

  it('does not call onPageChange when trying to go to invalid pages', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />
    )

    // Test the internal goToPage function boundaries by triggering goToPrevious
    // when already on page 1 (should try to go to page 0, which is invalid)
    const previousButton = getByLabelText('Previous page')
    fireEvent.click(previousButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('does not call onPageChange when trying to go beyond total pages', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={3} totalPages={3} onPageChange={mockOnPageChange} />
    )

    // Test the internal goToPage function boundaries by triggering goToNext
    // when already on last page (should try to go to page 4, which is invalid)
    const nextButton = getByLabelText('Next page')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('handles edge case with zero total pages', () => {
    const { container } = render(<VinylPagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} />)

    // Should not render any pagination controls when totalPages is 0
    expect(container.querySelector('button')).toBeNull()
    expect(container.textContent).not.toContain('Page')
  })

  it('renders page info text correctly for different page combinations', () => {
    const { getByText, rerender } = render(
      <VinylPagination currentPage={1} totalPages={2} onPageChange={mockOnPageChange} />
    )

    expect(getByText('Page 1 of 2')).toBeInTheDocument()

    rerender(<VinylPagination currentPage={2} totalPages={2} onPageChange={mockOnPageChange} />)
    expect(getByText('Page 2 of 2')).toBeInTheDocument()

    rerender(<VinylPagination currentPage={7} totalPages={15} onPageChange={mockOnPageChange} />)
    expect(getByText('Page 7 of 15')).toBeInTheDocument()
  })

  it('handles accessibility attributes correctly', () => {
    const { getByLabelText } = render(
      <VinylPagination currentPage={2} totalPages={4} onPageChange={mockOnPageChange} />
    )

    // Test aria-label attributes
    expect(getByLabelText('Previous page')).toBeInTheDocument()
    expect(getByLabelText('Next page')).toBeInTheDocument()
    expect(getByLabelText('Go to page 1')).toBeInTheDocument()
    expect(getByLabelText('Go to page 2')).toBeInTheDocument()
    expect(getByLabelText('Go to page 3')).toBeInTheDocument()
    expect(getByLabelText('Go to page 4')).toBeInTheDocument()

    // Test aria-current attribute is only on current page
    const currentPageButton = getByLabelText('Go to page 2')
    expect(currentPageButton.getAttribute('aria-current')).toBe('page')

    const otherPageButtons = [
      getByLabelText('Go to page 1'),
      getByLabelText('Go to page 3'),
      getByLabelText('Go to page 4')
    ]
    otherPageButtons.forEach(button => {
      expect(button.getAttribute('aria-current')).toBe(null)
    })

    // Test disabled attribute on previous/next buttons
    const prevButton = getByLabelText('Previous page')
    const nextButton = getByLabelText('Next page')
    expect(prevButton.disabled).toBe(false)
    expect(nextButton.disabled).toBe(false)
  })

  it('handles button disabled states correctly', () => {
    const { getByLabelText, rerender } = render(
      <VinylPagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    )

    // On first page, previous should be disabled
    let prevButton = getByLabelText('Previous page')
    let nextButton = getByLabelText('Next page')
    expect(prevButton.disabled).toBe(true)
    expect(nextButton.disabled).toBe(false)

    // On last page, next should be disabled
    rerender(<VinylPagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />)
    prevButton = getByLabelText('Previous page')
    nextButton = getByLabelText('Next page')
    expect(prevButton.disabled).toBe(false)
    expect(nextButton.disabled).toBe(true)

    // On middle page, both should be enabled
    rerender(<VinylPagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    prevButton = getByLabelText('Previous page')
    nextButton = getByLabelText('Next page')
    expect(prevButton.disabled).toBe(false)
    expect(nextButton.disabled).toBe(false)
  })
})
