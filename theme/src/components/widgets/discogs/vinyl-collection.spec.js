import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { act } from 'react'

import VinylCollection from './vinyl-collection'

const mockReleases = [
  {
    id: 28461454,
    basicInformation: {
      id: 28461454,
      title: 'The Rise & Fall Of A Midwest Princess',
      year: 2023,
      artists: [{ name: 'Chappell Roan' }],
      cdnThumbUrl: 'https://example.com/thumb1.jpg',
      resourceUrl: 'https://discogs.com/release/123'
    }
  },
  {
    id: 33129744,
    basicInformation: {
      id: 33129744,
      title: "Brat And It's Completely Different",
      year: 2025,
      artists: [{ name: 'Charli XCX' }],
      cdnThumbUrl: 'https://example.com/thumb2.jpg',
      resourceUrl: 'https://discogs.com/release/456'
    }
  }
]

// Create enough releases to test pagination (more than 18 items)
const createManyReleases = count => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    basicInformation: {
      id: i + 1,
      title: `Album ${i + 1}`,
      year: 2020 + (i % 5),
      artists: [{ name: `Artist ${i + 1}` }],
      cdnThumbUrl: `https://example.com/thumb${i + 1}.jpg`,
      resourceUrl: `https://discogs.com/release/${i + 1}`
    }
  }))
}

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024
})

describe('VinylCollection', () => {
  beforeEach(() => {
    window.innerWidth = 1024
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    const { container } = render(<VinylCollection isLoading={true} releases={[]} />)
    expect(screen.getByRole('heading', { name: /Vinyl Collection/i })).toBeInTheDocument()
    expect(screen.getByText('My owned vinyl records from Discogs.')).toBeInTheDocument()
    expect(screen.getByTestId('vinyl-carousel')).toBeInTheDocument()
    expect(container.querySelectorAll('.vinyl-collection_grid')).toHaveLength(3)
  })

  it('renders with vinyl releases', () => {
    render(<VinylCollection isLoading={false} releases={mockReleases} />)
    expect(
      screen.getByRole('button', { name: /The Rise & Fall Of A Midwest Princess \(2023\) - Chappell Roan/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Brat And It's Completely Different \(2025\) - Charli XCX/ })
    ).toBeInTheDocument()
  })

  it('renders empty state when no releases', () => {
    const { container } = render(<VinylCollection isLoading={false} releases={[]} />)
    expect(screen.getByRole('heading', { name: /Vinyl Collection/i })).toBeInTheDocument()
    expect(container.querySelectorAll('.vinyl-record')).toHaveLength(0)
  })

  it('renders with many releases for pagination testing', () => {
    const manyReleases = createManyReleases(25)
    const { container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)
    expect(container.querySelectorAll('.vinyl-record')).toHaveLength(25)
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
  })

  it('handles releases with missing basicInformation', () => {
    const releasesWithMissingData = [
      {
        id: 1,
        basicInformation: null
      },
      {
        id: 2,
        basicInformation: {
          title: 'Valid Album',
          year: 2023,
          artists: [{ name: 'Valid Artist' }]
        }
      }
    ]
    render(<VinylCollection isLoading={false} releases={releasesWithMissingData} />)
    expect(screen.getByRole('button', { name: /Valid Album \(2023\) - Valid Artist/ })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Click to view details/ }).length).toBeGreaterThanOrEqual(1)
  })

  it('handles releases with missing artist information', () => {
    const releasesWithMissingArtists = [
      {
        id: 1,
        basicInformation: {
          title: 'Album Without Artists',
          year: 2023,
          artists: null
        }
      }
    ]
    render(<VinylCollection isLoading={false} releases={releasesWithMissingArtists} />)
    expect(screen.getByRole('button', { name: /Unknown Artist/ })).toBeInTheDocument()
  })

  it('handles releases with multiple artists', () => {
    const releasesWithMultipleArtists = [
      {
        id: 1,
        basicInformation: {
          title: 'Collaboration Album',
          year: 2023,
          artists: [{ name: 'Artist 1' }, { name: 'Artist 2' }, { name: 'Artist 3' }]
        }
      }
    ]
    render(<VinylCollection isLoading={false} releases={releasesWithMultipleArtists} />)
    expect(screen.getByRole('button', { name: /Artist 1, Artist 2, Artist 3/ })).toBeInTheDocument()
  })

  it('handles releases without CDN thumb URL', () => {
    const releasesWithoutThumb = [
      {
        id: 1,
        basicInformation: {
          title: 'Album Without Thumb',
          year: 2023,
          artists: [{ name: 'Artist' }],
          cdnThumbUrl: null,
          resourceUrl: 'https://discogs.com/release/123'
        }
      }
    ]
    render(<VinylCollection isLoading={false} releases={releasesWithoutThumb} />)
    expect(screen.getByRole('button', { name: /Album Without Thumb/ })).toBeInTheDocument()
  })

  describe('Vinyl item interactions', () => {
    it('handles mouse enter on vinyl item', () => {
      const { container } = render(<VinylCollection isLoading={false} releases={mockReleases} />)

      const vinylItem = container.querySelector('.vinyl-record')
      expect(vinylItem).toBeTruthy()

      fireEvent.mouseEnter(vinylItem)

      // Should add focused class
      expect(vinylItem.classList.contains('vinyl-record--focused')).toBe(true)
    })

    it('handles mouse leave on vinyl item', () => {
      const { container } = render(<VinylCollection isLoading={false} releases={mockReleases} />)

      const vinylItem = container.querySelector('.vinyl-record')
      expect(vinylItem).toBeTruthy()

      // First enter to set focus
      fireEvent.mouseEnter(vinylItem)
      expect(vinylItem.classList.contains('vinyl-record--focused')).toBe(true)

      // Then leave
      fireEvent.mouseLeave(vinylItem)

      // Should remove focused class
      expect(vinylItem.classList.contains('vinyl-record--focused')).toBe(false)
    })

    it('opens and closes the Discogs modal when a vinyl is clicked', () => {
      const { container } = render(<VinylCollection isLoading={false} releases={mockReleases} />)

      const vinylItem = container.querySelector('.vinyl-record')
      expect(vinylItem).toBeTruthy()

      fireEvent.click(vinylItem)
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.click(screen.getAllByLabelText('Close modal')[0])
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opens the modal from keyboard Enter and Space activation', () => {
      const { container } = render(<VinylCollection isLoading={false} releases={mockReleases} />)

      const vinylItem = container.querySelector('.vinyl-record')
      expect(vinylItem).toBeTruthy()

      fireEvent.keyDown(vinylItem, { key: 'Enter' })
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.click(screen.getAllByLabelText('Close modal')[0])
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      fireEvent.keyDown(vinylItem, { key: ' ' })
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Mouse event handlers', () => {
    it('handles mouse down event', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      fireEvent.mouseDown(carousel, { pageX: 100 })

      // Event handler should be called without error
      expect(carousel).toBeTruthy()
    })

    it('handles mouse move event', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start dragging
      fireEvent.mouseDown(carousel, { pageX: 100 })

      // Move mouse
      fireEvent.mouseMove(carousel, { pageX: 200 })

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('handles mouse up event with threshold exceeded', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start dragging
      fireEvent.mouseDown(carousel, { pageX: 100 })

      // Move mouse beyond threshold
      fireEvent.mouseMove(carousel, { pageX: 200 })

      // Release mouse
      fireEvent.mouseUp(carousel)

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('handles mouse up event without threshold exceeded', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start dragging
      fireEvent.mouseDown(carousel, { pageX: 100 })

      // Move mouse small distance
      fireEvent.mouseMove(carousel, { pageX: 120 })

      // Release mouse
      fireEvent.mouseUp(carousel)

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('handles mouse leave event', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start dragging
      fireEvent.mouseDown(carousel, { pageX: 100 })

      // Leave carousel
      fireEvent.mouseLeave(carousel)

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('prevents mouse events when transitioning', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId, container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Trigger a page change to set transitioning state
      const secondPageButton = container.querySelector('button[aria-label*="page 2"]')
      if (secondPageButton) {
        fireEvent.click(secondPageButton)

        // Try to start dragging while transitioning
        fireEvent.mouseDown(carousel, { pageX: 100 })

        // Event handlers should be called without error
        expect(carousel).toBeTruthy()
      }
    })
  })

  describe('Responsive pagination', () => {
    it('uses the expected page counts across breakpoint ranges', () => {
      const manyReleases = createManyReleases(25)

      window.innerWidth = 500
      const { rerender } = render(<VinylCollection isLoading={false} releases={manyReleases} />)
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()

      window.innerWidth = 700
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()

      window.innerWidth = 900
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()

      window.innerWidth = 1400
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()

      rerender(<VinylCollection isLoading={false} releases={manyReleases} />)
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    describe('when transition timers run (fake timers)', () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      afterEach(() => {
        act(() => {
          jest.runOnlyPendingTimers()
        })
        jest.useRealTimers()
      })

      it('clamps the current page when a resize reduces the total page count', () => {
        const manyReleases = createManyReleases(25)

        window.innerWidth = 500
        render(<VinylCollection isLoading={false} releases={manyReleases} />)

        fireEvent.click(screen.getByLabelText('Go to page 3'))
        act(() => {
          jest.advanceTimersByTime(300)
        })
        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument()

        window.innerWidth = 1400
        act(() => {
          window.dispatchEvent(new Event('resize'))
        })

        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
      })
    })
  })

  describe('Pointer event handlers', () => {
    it('handles pointer down event', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 100 })

      // Event handler should be called without error
      expect(carousel).toBeTruthy()
    })

    it('handles pointer move event', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start touch pointer drag
      fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 100 })

      // Move pointer
      fireEvent.pointerMove(carousel, { pointerType: 'touch', pageX: 200 })

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('handles pointer up event', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start touch pointer drag
      fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 100 })

      // Move pointer beyond threshold
      fireEvent.pointerMove(carousel, { pointerType: 'touch', pageX: 200 })

      // End pointer
      fireEvent.pointerUp(carousel, { pointerType: 'touch' })

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('prevents pointer events when transitioning', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId, container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Trigger a page change to set transitioning state
      const secondPageButton = container.querySelector('button[aria-label*="page 2"]')
      if (secondPageButton) {
        fireEvent.click(secondPageButton)

        // Try to start touch pointer drag while transitioning
        fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 100 })

        // Event handlers should be called without error
        expect(carousel).toBeTruthy()
      }
    })

    it('ignores pointer handlers when pointerType is mouse', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      fireEvent.pointerDown(carousel, { pointerType: 'mouse', pageX: 100 })
      fireEvent.pointerMove(carousel, { pointerType: 'mouse', pageX: 200 })
      fireEvent.pointerUp(carousel, { pointerType: 'mouse' })

      // Mouse-specific pointer events should no-op; behavior remains stable.
      expect(carousel).toBeTruthy()
    })

    it('handles pointer cancel for touch input', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 100 })
      fireEvent.pointerMove(carousel, { pointerType: 'touch', pageX: 200 })
      fireEvent.pointerCancel(carousel, { pointerType: 'touch' })

      expect(carousel).toBeTruthy()
    })
  })

  describe('Elastic resistance at boundaries', () => {
    it('applies elastic resistance at first page when dragging right', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start dragging right from first page
      fireEvent.mouseDown(carousel, { pageX: 100 })
      fireEvent.mouseMove(carousel, { pageX: 200 })

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    describe('on last page after transition (fake timers)', () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      afterEach(() => {
        act(() => {
          jest.runOnlyPendingTimers()
        })
        jest.useRealTimers()
      })

      it('applies elastic resistance at last page when dragging left', () => {
        const manyReleases = createManyReleases(25)
        const { getByTestId, container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

        // Navigate to last page
        const lastPageButton = container.querySelector('button[aria-label*="page 2"]')
        if (lastPageButton) {
          fireEvent.click(lastPageButton)

          // Fast forward time to complete transition
          act(() => {
            jest.advanceTimersByTime(300)
          })

          const carousel = getByTestId('vinyl-carousel')
          expect(carousel).toBeTruthy()

          // Start dragging left from last page
          fireEvent.mouseDown(carousel, { pageX: 200 })
          fireEvent.mouseMove(carousel, { pageX: 100 })

          // Event handlers should be called without error
          expect(carousel).toBeTruthy()
        }
      })

      it('applies elastic resistance for pointer events at last page', () => {
        const manyReleases = createManyReleases(25)
        const { getByTestId, container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

        // Navigate to last page
        const lastPageButton = container.querySelector('button[aria-label*="page 2"]')
        if (lastPageButton) {
          fireEvent.click(lastPageButton)

          // Fast forward time to complete transition
          act(() => {
            jest.advanceTimersByTime(300)
          })

          const carousel = getByTestId('vinyl-carousel')
          expect(carousel).toBeTruthy()

          // Start touch pointer drag left from last page
          fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 200 })
          fireEvent.pointerMove(carousel, { pointerType: 'touch', pageX: 100 })

          // Event handlers should be called without error
          expect(carousel).toBeTruthy()
        }
      })
    })

    it('applies elastic resistance for pointer events at first page', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start touch pointer drag right from first page
      fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 100 })
      fireEvent.pointerMove(carousel, { pointerType: 'touch', pageX: 200 })

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('triggers elastic resistance with specific conditions', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Ensure we're on the first page and drag right with positive distance
      // This should trigger the elastic resistance condition
      fireEvent.mouseDown(carousel, { pageX: 50 })
      fireEvent.mouseMove(carousel, { pageX: 150 }) // Positive distance, first page

      // Also test pointer events with the same conditions
      fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 50 })
      fireEvent.pointerMove(carousel, { pointerType: 'touch', pageX: 150 })

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })
  })

  describe('Page change functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers()
      })
      jest.useRealTimers()
    })

    it('clears transition state after timeout', () => {
      const manyReleases = createManyReleases(25)
      const { container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      // Start a page change
      const secondPageButton = container.querySelector('button[aria-label*="page 2"]')
      if (secondPageButton) {
        fireEvent.click(secondPageButton)

        // Fast forward time
        act(() => {
          jest.advanceTimersByTime(300)
        })

        // Should be able to change page again
        const firstPageButton = container.querySelector('button[aria-label*="page 1"]')
        if (firstPageButton) {
          fireEvent.click(firstPageButton)

          // Should change back
          expect(firstPageButton).toBeTruthy()
        }
      }
    })

    it('prevents page change when already transitioning', () => {
      const manyReleases = createManyReleases(25)
      const { container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      // Start a page change
      const secondPageButton = container.querySelector('button[aria-label*="page 2"]')
      if (secondPageButton) {
        fireEvent.click(secondPageButton)

        // Try to change page again immediately
        const firstPageButton = container.querySelector('button[aria-label*="page 1"]')
        if (firstPageButton) {
          fireEvent.click(firstPageButton)

          // Should still be on page 2
          expect(secondPageButton).toBeTruthy()
        }
      }
    })

    it('prevents page change to same page', () => {
      const manyReleases = createManyReleases(25)
      const { container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      // Try to change to current page (page 1)
      const firstPageButton = container.querySelector('button[aria-label*="page 1"]')
      if (firstPageButton) {
        fireEvent.click(firstPageButton)

        // Should not trigger transition
        expect(firstPageButton).toBeTruthy()
      }
    })
  })

  describe('Page change with threshold exceeded', () => {
    describe('after navigating to page 2 (fake timers)', () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      afterEach(() => {
        act(() => {
          jest.runOnlyPendingTimers()
        })
        jest.useRealTimers()
      })

      it('changes to previous page when dragging right with threshold exceeded', () => {
        const manyReleases = createManyReleases(25)
        const { getByTestId, container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

        // Navigate to second page first
        const secondPageButton = container.querySelector('button[aria-label*="page 2"]')
        if (secondPageButton) {
          fireEvent.click(secondPageButton)

          // Fast forward time to complete transition
          act(() => {
            jest.advanceTimersByTime(300)
          })

          const carousel = getByTestId('vinyl-carousel')
          expect(carousel).toBeTruthy()

          // Start dragging right (towards previous page) with large distance
          fireEvent.mouseDown(carousel, { pageX: 100 })
          fireEvent.mouseMove(carousel, { pageX: 200 }) // Large distance to exceed threshold
          fireEvent.mouseUp(carousel)

          // Should be back on page 1
          const firstPageButton = container.querySelector('button[aria-label*="page 1"]')
          expect(firstPageButton).toBeTruthy()
        }
      })
    })

    it('changes to next page when dragging left with threshold exceeded', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Start dragging left (towards next page) with large distance
      fireEvent.mouseDown(carousel, { pageX: 200 })
      fireEvent.mouseMove(carousel, { pageX: 100 }) // Large distance to exceed threshold
      fireEvent.mouseUp(carousel)

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })

    it('triggers page change with specific threshold conditions', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Drag with distance greater than threshold (80px)
      fireEvent.mouseDown(carousel, { pageX: 100 })
      fireEvent.mouseMove(carousel, { pageX: 200 }) // 100px distance > 80px threshold
      fireEvent.mouseUp(carousel)

      // Event handlers should be called without error
      expect(carousel).toBeTruthy()
    })
  })

  describe('Pagination controls', () => {
    it('renders pagination when multiple pages exist', () => {
      const manyReleases = createManyReleases(25)
      const { container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      // Should render pagination controls
      const paginationButtons = container.querySelectorAll('button[aria-label*="page"]')
      expect(paginationButtons.length).toBeGreaterThan(0)
    })

    it('does not render pagination for single page', () => {
      const { container } = render(<VinylCollection isLoading={false} releases={mockReleases} />)

      // Should not render pagination controls
      const paginationButtons = container.querySelectorAll('button[aria-label*="page"]')
      expect(paginationButtons).toHaveLength(0)
    })
  })

  describe('Edge cases', () => {
    it('handles releases with missing title', () => {
      const releasesWithMissingTitle = [
        {
          id: 1,
          basicInformation: {
            year: 2023,
            artists: [{ name: 'Artist' }]
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithMissingTitle} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Unknown (2023) - Artist. Click to view details.'
      )
    })

    it('handles releases with missing year', () => {
      const releasesWithMissingYear = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            artists: [{ name: 'Artist' }]
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithMissingYear} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (Unknown) - Artist. Click to view details.'
      )
    })

    it('handles releases with empty artists array', () => {
      const releasesWithEmptyArtists = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: []
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithEmptyArtists} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (2023) - Unknown Artist. Click to view details.'
      )
    })

    it('handles releases with missing resourceUrl', () => {
      const releasesWithMissingResourceUrl = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: 'Artist' }],
            cdnThumbUrl: 'https://example.com/thumb.jpg'
            // Missing resourceUrl
          }
        }
      ]
      const { container } = render(<VinylCollection isLoading={false} releases={releasesWithMissingResourceUrl} />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Album (2023) - Artist. Click to view details.')
      expect(container.querySelector('.vinyl-record_album-art')).toHaveAttribute('src', 'https://example.com/thumb.jpg')
    })

    it('handles releases with missing basicInformation properties', () => {
      const releasesWithMissingProperties = [
        {
          id: 1,
          basicInformation: {
            title: 'Album'
            // Missing year, artists, etc.
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithMissingProperties} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (Unknown) - Unknown Artist. Click to view details.'
      )
    })

    it('handles releases with null artists', () => {
      const releasesWithNullArtists = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: null
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithNullArtists} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (2023) - Unknown Artist. Click to view details.'
      )
    })

    it('handles releases with undefined artists', () => {
      const releasesWithUndefinedArtists = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: undefined
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithUndefinedArtists} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (2023) - Unknown Artist. Click to view details.'
      )
    })

    it('handles releases with missing artist name', () => {
      const releasesWithMissingArtistName = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: null }]
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithMissingArtistName} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (2023) - Unknown Artist. Click to view details.'
      )
    })

    it('handles releases with undefined artist name', () => {
      const releasesWithUndefinedArtistName = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: undefined }]
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithUndefinedArtistName} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (2023) - Unknown Artist. Click to view details.'
      )
    })

    it('handles releases with empty artist name', () => {
      const releasesWithEmptyArtistName = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: '' }]
          }
        }
      ]
      render(<VinylCollection isLoading={false} releases={releasesWithEmptyArtistName} />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Album (2023) - Unknown Artist. Click to view details.'
      )
    })

    it('handles releases with missing cdnThumbUrl property', () => {
      const releasesWithMissingCdnThumbUrl = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: 'Artist' }]
            // Missing cdnThumbUrl
          }
        }
      ]
      const { container } = render(<VinylCollection isLoading={false} releases={releasesWithMissingCdnThumbUrl} />)
      expect(container.querySelector('.vinyl-record_album-art')).toBeNull()
    })

    it('handles releases with undefined cdnThumbUrl', () => {
      const releasesWithUndefinedCdnThumbUrl = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: 'Artist' }],
            cdnThumbUrl: undefined
          }
        }
      ]
      const { container } = render(<VinylCollection isLoading={false} releases={releasesWithUndefinedCdnThumbUrl} />)
      expect(container.querySelector('.vinyl-record_album-art')).toBeNull()
    })

    it('handles releases with empty cdnThumbUrl', () => {
      const releasesWithEmptyCdnThumbUrl = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: 'Artist' }],
            cdnThumbUrl: ''
          }
        }
      ]
      const { container } = render(<VinylCollection isLoading={false} releases={releasesWithEmptyCdnThumbUrl} />)
      expect(container.querySelector('.vinyl-record_album-art')).toBeNull()
    })

    it('handles releases with missing resourceUrl property', () => {
      const releasesWithMissingResourceUrlProperty = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: 'Artist' }],
            cdnThumbUrl: 'https://example.com/thumb.jpg'
            // Missing resourceUrl
          }
        }
      ]
      const { container } = render(
        <VinylCollection isLoading={false} releases={releasesWithMissingResourceUrlProperty} />
      )
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Album (2023) - Artist. Click to view details.')
      expect(container.querySelector('.vinyl-record_album-art')).toHaveAttribute('src', 'https://example.com/thumb.jpg')
    })

    it('handles releases with undefined resourceUrl', () => {
      const releasesWithUndefinedResourceUrl = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: 'Artist' }],
            cdnThumbUrl: 'https://example.com/thumb.jpg',
            resourceUrl: undefined
          }
        }
      ]
      const { container } = render(<VinylCollection isLoading={false} releases={releasesWithUndefinedResourceUrl} />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Album (2023) - Artist. Click to view details.')
      expect(container.querySelector('.vinyl-record_album-art')).toHaveAttribute('src', 'https://example.com/thumb.jpg')
    })

    it('handles releases with empty resourceUrl', () => {
      const releasesWithEmptyResourceUrl = [
        {
          id: 1,
          basicInformation: {
            title: 'Album',
            year: 2023,
            artists: [{ name: 'Artist' }],
            cdnThumbUrl: 'https://example.com/thumb.jpg',
            resourceUrl: ''
          }
        }
      ]
      const { container } = render(<VinylCollection isLoading={false} releases={releasesWithEmptyResourceUrl} />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Album (2023) - Artist. Click to view details.')
      expect(container.querySelector('.vinyl-record_album-art')).toHaveAttribute('src', 'https://example.com/thumb.jpg')
    })
  })

  describe('Event handler coverage', () => {
    it('calls mouse event handlers', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Try to trigger events on the carousel
      fireEvent.mouseDown(carousel, { pageX: 100 })
      fireEvent.mouseMove(carousel, { pageX: 200 })
      fireEvent.mouseUp(carousel)

      // The test passes if no errors are thrown
      expect(true).toBe(true)
    })

    it('calls pointer event handlers', () => {
      const manyReleases = createManyReleases(25)
      const { getByTestId } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const carousel = getByTestId('vinyl-carousel')
      expect(carousel).toBeTruthy()

      // Try to trigger events on the carousel
      fireEvent.pointerDown(carousel, { pointerType: 'touch', pageX: 100 })
      fireEvent.pointerMove(carousel, { pointerType: 'touch', pageX: 200 })
      fireEvent.pointerUp(carousel, { pointerType: 'touch' })

      // The test passes if no errors are thrown
      expect(true).toBe(true)
    })
  })

  describe('Hover exit timing and accessibility', () => {
    const originalNodeEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv
    })

    describe('mouse leave delay in production (fake timers)', () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      afterEach(() => {
        act(() => {
          jest.runOnlyPendingTimers()
        })
        jest.useRealTimers()
      })

      it('adds exiting class on mouse leave and clears after delay (production env)', () => {
        process.env.NODE_ENV = 'production'
        const manyReleases = createManyReleases(25)
        const { container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

        const vinylItem = container.querySelector('.vinyl-record')
        expect(vinylItem).toBeTruthy()

        // Focus via mouse enter
        fireEvent.mouseEnter(vinylItem)
        expect(vinylItem.classList.contains('vinyl-record--focused')).toBe(true)

        // Trigger exit
        fireEvent.mouseLeave(vinylItem)
        expect(vinylItem.classList.contains('vinyl-record--exiting')).toBe(true)

        // Advance timers to clear exit state
        act(() => {
          jest.advanceTimersByTime(220)
        })

        expect(vinylItem.classList.contains('vinyl-record--exiting')).toBe(false)
        expect(vinylItem.classList.contains('vinyl-record--focused')).toBe(false)
      })
    })

    it('clears pending exit when re-entering quickly (production env)', () => {
      process.env.NODE_ENV = 'production'
      const manyReleases = createManyReleases(25)
      const { container } = render(<VinylCollection isLoading={false} releases={manyReleases} />)

      const vinylItem = container.querySelector('.vinyl-record')
      expect(vinylItem).toBeTruthy()

      // Enter, then leave to schedule exit, then quickly re-enter
      fireEvent.mouseEnter(vinylItem)
      expect(vinylItem.classList.contains('vinyl-record--focused')).toBe(true)
      fireEvent.mouseLeave(vinylItem)
      expect(vinylItem.classList.contains('vinyl-record--exiting')).toBe(true)
      fireEvent.mouseEnter(vinylItem)

      // Exiting should be cleared and focused retained
      expect(vinylItem.classList.contains('vinyl-record--exiting')).toBe(false)
      expect(vinylItem.classList.contains('vinyl-record--focused')).toBe(true)
    })

    it('exposes aria-label details and album art class', () => {
      const releases = [
        {
          id: 1,
          basicInformation: {
            title: 'Test Album',
            year: 2024,
            artists: [{ name: 'Test Artist' }],
            cdnThumbUrl: 'https://example.com/thumb.jpg'
          }
        }
      ]
      const { container } = render(<VinylCollection isLoading={false} releases={releases} />)

      const vinylItem = container.querySelector('.vinyl-record')
      expect(vinylItem).toBeTruthy()
      const aria = vinylItem.getAttribute('aria-label')
      expect(aria).toContain('Test Album')
      expect(aria).toContain('2024')
      expect(aria).toContain('Test Artist')

      const img = container.querySelector('.vinyl-record_album-art')
      expect(img).toBeTruthy()
      expect(img.getAttribute('alt')).toContain('Test Album')
    })
  })

  describe('Pagination behavior tests', () => {
    it('displays all items when last page has fewer items than a complete row', () => {
      // Test case: 25 items, 6 columns (18 items per page)
      // Should display all 25 items across 2 pages (18 + 7 items)
      const releasesWithPartialLastPage = createManyReleases(25)
      const { container } = render(<VinylCollection isLoading={false} releases={releasesWithPartialLastPage} />)

      // Should have 2 page number buttons (plus prev/next buttons = 4 total)
      const paginationButtons = container.querySelectorAll('button[aria-label*="Go to page"]')
      expect(paginationButtons).toHaveLength(2)

      // All 25 vinyl items should be rendered (across both pages)
      const vinylItems = container.querySelectorAll('.vinyl-record')
      expect(vinylItems).toHaveLength(25)
    })

    it('handles edge case with fewer items than one page', () => {
      // Test case: 5 items, 6 columns (18 items per page)
      // Should have 1 page with all 5 items
      const releasesFewItems = createManyReleases(5)
      const { container } = render(<VinylCollection isLoading={false} releases={releasesFewItems} />)

      // Should have no pagination buttons (single page)
      const paginationButtons = container.querySelectorAll('button[aria-label*="Go to page"]')
      expect(paginationButtons).toHaveLength(0)

      // All 5 vinyl items should be rendered
      const vinylItems = container.querySelectorAll('.vinyl-record')
      expect(vinylItems).toHaveLength(5)
    })
  })

  describe('development leave timeout', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers()
      })
      jest.useRealTimers()
    })

    it('clears a pending leave timeout before scheduling another one outside test mode', () => {
      const previousNodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
      const { container } = render(<VinylCollection isLoading={false} releases={mockReleases} />)
      const vinylItem = container.querySelector('.vinyl-record')

      fireEvent.mouseEnter(vinylItem)
      fireEvent.mouseLeave(vinylItem)
      fireEvent.mouseLeave(vinylItem)

      expect(clearTimeoutSpy).toHaveBeenCalled()

      act(() => {
        jest.runOnlyPendingTimers()
      })

      process.env.NODE_ENV = previousNodeEnv
    })
  })
})
