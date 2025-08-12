import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'theme-ui'
import theme from '../../gatsby-plugin-theme-ui/theme'
import WidgetCarousel from './widget-carousel'

const renderWithTheme = component => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

// Mock the pagination component
jest.mock('./widget-pagination', () => {
  return function MockWidgetPagination({ currentPage, totalPages, onPageChange }) {
    return (
      <div data-testid='widget-pagination'>
        <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      </div>
    )
  }
})

describe('WidgetCarousel', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    { id: '4', name: 'Item 4' },
    { id: '5', name: 'Item 5' },
    { id: '6', name: 'Item 6' },
    { id: '7', name: 'Item 7' },
    { id: '8', name: 'Item 8' },
    { id: '9', name: 'Item 9' }
  ]

  const mockRenderItem = (item, index) => (
    <div key={item.id} data-testid={`item-${index}`}>
      {item.name}
    </div>
  )

  it('renders single page without carousel when items fit on one page', () => {
    renderWithTheme(
      <WidgetCarousel items={mockItems.slice(0, 4)} isLoading={false} itemsPerPage={8} renderItem={mockRenderItem} />
    )

    expect(screen.getByTestId('item-0')).toBeInTheDocument()
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
    expect(screen.getByTestId('item-3')).toBeInTheDocument()
    expect(screen.queryByTestId('widget-pagination')).not.toBeInTheDocument()
  })

  it('renders carousel with pagination when items span multiple pages', () => {
    renderWithTheme(<WidgetCarousel items={mockItems} isLoading={false} itemsPerPage={4} renderItem={mockRenderItem} />)

    expect(screen.getByTestId('widget-pagination')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('renders loading placeholders when isLoading is true', () => {
    renderWithTheme(<WidgetCarousel items={mockItems} isLoading={true} itemsPerPage={4} renderItem={mockRenderItem} />)

    // Should show loading placeholders instead of actual items
    expect(screen.queryByTestId('item-0')).not.toBeInTheDocument()
  })

  it('handles page changes correctly', () => {
    renderWithTheme(<WidgetCarousel items={mockItems} isLoading={false} itemsPerPage={4} renderItem={mockRenderItem} />)

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
  })

  it('handles previous page correctly', () => {
    renderWithTheme(<WidgetCarousel items={mockItems} isLoading={false} itemsPerPage={4} renderItem={mockRenderItem} />)

    // Go to page 2 first
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    // Then go back to page 1
    const prevButton = screen.getByText('Previous')
    fireEvent.click(prevButton)

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('renders correct number of items per page', () => {
    renderWithTheme(<WidgetCarousel items={mockItems} isLoading={false} itemsPerPage={3} renderItem={mockRenderItem} />)

    // Should show 3 items on first page
    expect(screen.getByTestId('item-0')).toBeInTheDocument()
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument()
  })

  it('applies custom grid template columns', () => {
    const customColumns = ['repeat(2, 1fr)', 'repeat(4, 1fr)']

    renderWithTheme(
      <WidgetCarousel
        items={mockItems}
        isLoading={false}
        itemsPerPage={4}
        renderItem={mockRenderItem}
        gridTemplateColumns={customColumns}
      />
    )

    // The grid styling should be applied (we can't easily test CSS values, but we can verify the component renders)
    expect(screen.getByTestId('widget-pagination')).toBeInTheDocument()
  })

  it('handles empty items array', () => {
    renderWithTheme(<WidgetCarousel items={[]} isLoading={false} itemsPerPage={4} renderItem={mockRenderItem} />)

    expect(screen.queryByTestId('widget-pagination')).not.toBeInTheDocument()
  })

  it('handles undefined items gracefully', () => {
    renderWithTheme(<WidgetCarousel items={undefined} isLoading={false} itemsPerPage={4} renderItem={mockRenderItem} />)

    expect(screen.queryByTestId('widget-pagination')).not.toBeInTheDocument()
  })
})
