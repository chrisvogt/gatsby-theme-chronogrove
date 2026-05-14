import React, { act } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Router, LocationProvider } from '@gatsbyjs/reach-router'

import RecentlyReadBooks, { BOOKS_PER_PAGE, HEADLINE, BODY_TEXT } from './recently-read-books'
import goodreadsMock from '../../../../__mocks__/goodreads-widget.mock.json'

// Mock LazyLoad component
jest.mock('../../lazy-load', () => ({ children }) => <>{children}</>)

// Mock Book3D so tests don't need a WebGL context; expose book-preview-thumbnail
// so existing assertions continue to work
jest.mock('../../artwork/book-3d', () => {
  const { createElement } = require('react')
  return function MockBook3D({ title, thumbnailURL }) {
    return createElement(
      'div',
      { 'data-testid': 'book-preview-3d' },
      createElement('img', {
        'data-testid': 'book-preview-thumbnail',
        src: thumbnailURL,
        alt: title
      })
    )
  }
})

const mockBooks = goodreadsMock.payload.collections.recentlyReadBooks

const renderWithRouter = ui =>
  render(
    <LocationProvider
      history={{
        location: { pathname: '/' },
        listen: () => () => {},
        navigate: () => {},
        _onTransitionComplete: () => {}
      }}
    >
      <Router>
        <div default>{ui}</div>
      </Router>
    </LocationProvider>
  )

describe('Widget/Goodreads/RecentlyReadBooks', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  describe('loading state', () => {
    it('renders a placeholder for each book expected to render', () => {
      const { container } = renderWithRouter(<RecentlyReadBooks books={[]} isLoading={true} default />)
      expect(container.querySelectorAll('.rect-shape')).toHaveLength(BOOKS_PER_PAGE)
    })
  })

  describe('success sate', () => {
    it('renders without crashing when the books prop is omitted (default empty array)', () => {
      renderWithRouter(<RecentlyReadBooks isLoading={false} default />)
      expect(screen.getByText(HEADLINE)).toBeInTheDocument()
    })

    it('renders a headline and paragraph text for the widget', () => {
      renderWithRouter(<RecentlyReadBooks books={mockBooks} isLoading={false} default />)
      expect(screen.getByText(HEADLINE)).toBeInTheDocument()
      expect(screen.getByText(HEADLINE)).toHaveTextContent(HEADLINE)
      expect(screen.getByText(BODY_TEXT)).toBeInTheDocument()
      expect(screen.getByText(BODY_TEXT)).toHaveTextContent(BODY_TEXT)
    })

    it('renders the first page of thumbnails using the image cdn urls', () => {
      const paginatedBooks = Array.from({ length: 24 }, (_, idx) => ({
        ...mockBooks[idx % mockBooks.length],
        id: `book-${idx + 1}`,
        title: `Book ${idx + 1}`,
        cdnMediaURL: `https://images.imgix.net/book-${idx + 1}.jpg`
      }))

      renderWithRouter(<RecentlyReadBooks books={paginatedBooks} isLoading={false} default />)
      const currentPage = screen.getByTestId('goodreads-page-1')
      const images = within(currentPage).getAllByTestId('book-preview-thumbnail')
      expect(images).toHaveLength(10)
      images.forEach((image, idx) => {
        expect(image).toHaveAttribute('src', `https://images.imgix.net/book-${idx + 1}.jpg?auto=compress&auto=format`)
      })
    })

    it('renders pagination and navigates to the second page', () => {
      const paginatedBooks = Array.from({ length: 20 }, (_, idx) => ({
        ...mockBooks[idx % mockBooks.length],
        id: `book-${idx + 1}`,
        title: `Book ${idx + 1}`,
        thumbnail: `https://example.com/book-${idx + 1}.jpg`
      }))

      renderWithRouter(<RecentlyReadBooks books={paginatedBooks} isLoading={false} default />)

      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
      expect(within(screen.getByTestId('goodreads-page-1')).getAllByTestId('book-link')).toHaveLength(10)
      expect(within(screen.getByTestId('goodreads-page-1')).getAllByTestId('book-link')[0]).toHaveAttribute(
        'title',
        'Book 1'
      )

      fireEvent.click(screen.getByLabelText('Go to page 2'))

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
      expect(within(screen.getByTestId('goodreads-page-2')).getAllByTestId('book-link')).toHaveLength(10)
      expect(within(screen.getByTestId('goodreads-page-2')).getAllByTestId('book-link')[0]).toHaveAttribute(
        'title',
        'Book 11'
      )
    })

    it('supports drag pagination using the shared carousel behavior', () => {
      jest.useFakeTimers()

      const paginatedBooks = Array.from({ length: 20 }, (_, idx) => ({
        ...mockBooks[idx % mockBooks.length],
        id: `book-${idx + 1}`,
        title: `Book ${idx + 1}`,
        thumbnail: `https://example.com/book-${idx + 1}.jpg`
      }))

      renderWithRouter(<RecentlyReadBooks books={paginatedBooks} isLoading={false} default />)

      const carousel = screen.getByTestId('goodreads-carousel')
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()

      fireEvent.mouseDown(carousel, { clientX: 200 })
      fireEvent.mouseMove(carousel, { clientX: 100 })
      fireEvent.mouseUp(carousel)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
      expect(within(screen.getByTestId('goodreads-page-2')).getAllByTestId('book-link')[0]).toHaveAttribute(
        'title',
        'Book 11'
      )
    })

    it('navigates the carousel with arrow keys when there is more than one page', () => {
      jest.useFakeTimers()

      const paginatedBooks = Array.from({ length: 20 }, (_, idx) => ({
        ...mockBooks[idx % mockBooks.length],
        id: `book-${idx + 1}`,
        title: `Book ${idx + 1}`,
        thumbnail: `https://example.com/book-${idx + 1}.jpg`
      }))

      renderWithRouter(<RecentlyReadBooks books={paginatedBooks} isLoading={false} default />)

      const carousel = screen.getByTestId('goodreads-carousel')
      carousel.focus()

      fireEvent.keyDown(carousel, { key: 'ArrowRight' })
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(300)
      })

      fireEvent.keyDown(carousel, { key: 'ArrowDown' })
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(300)
      })

      fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(300)
      })

      fireEvent.click(screen.getByLabelText('Go to page 2'))
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(300)
      })

      fireEvent.keyDown(carousel, { key: 'ArrowUp' })
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    it('ignores arrow keys on the carousel when there is only one page', () => {
      const paginatedBooks = Array.from({ length: 5 }, (_, idx) => ({
        ...mockBooks[idx % mockBooks.length],
        id: `book-${idx + 1}`,
        title: `Book ${idx + 1}`,
        thumbnail: `https://example.com/book-${idx + 1}.jpg`
      }))

      renderWithRouter(<RecentlyReadBooks books={paginatedBooks} isLoading={false} default />)

      const carousel = screen.getByTestId('goodreads-carousel')
      carousel.focus()
      fireEvent.keyDown(carousel, { key: 'ArrowRight' })

      expect(within(screen.getByTestId('goodreads-page-1')).getAllByTestId('book-link')).toHaveLength(5)
      expect(screen.queryByTestId('goodreads-page-2')).not.toBeInTheDocument()
    })

    it('returns to the first page when the books list shrinks', () => {
      const paginatedBooks = Array.from({ length: 20 }, (_, idx) => ({
        ...mockBooks[idx % mockBooks.length],
        id: `book-${idx + 1}`,
        title: `Book ${idx + 1}`,
        thumbnail: `https://example.com/book-${idx + 1}.jpg`
      }))

      const { rerender } = renderWithRouter(<RecentlyReadBooks books={paginatedBooks} isLoading={false} default />)

      fireEvent.click(screen.getByLabelText('Go to page 2'))
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      rerender(
        <LocationProvider
          history={{
            location: { pathname: '/' },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div default>
              <RecentlyReadBooks books={paginatedBooks.slice(0, 10)} isLoading={false} default />
            </div>
          </Router>
        </LocationProvider>
      )

      expect(screen.queryByText('Page 2 of 2')).not.toBeInTheDocument()
      expect(within(screen.getByTestId('goodreads-page-1')).getAllByTestId('book-link')[0]).toHaveAttribute(
        'title',
        'Book 1'
      )
    })

    it('preserves the current page when the books prop gets a new array reference with identical ids', () => {
      const paginatedBooks = Array.from({ length: 20 }, (_, idx) => ({
        ...mockBooks[idx % mockBooks.length],
        id: `book-${idx + 1}`,
        title: `Book ${idx + 1}`,
        thumbnail: `https://example.com/book-${idx + 1}.jpg`
      }))

      const { rerender } = renderWithRouter(<RecentlyReadBooks books={paginatedBooks} isLoading={false} default />)

      fireEvent.click(screen.getByLabelText('Go to page 2'))
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      // Simulate a parent re-render producing a new array reference with the same books
      const sameBooksNewReference = [...paginatedBooks]

      rerender(
        <LocationProvider
          history={{
            location: { pathname: '/' },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div default>
              <RecentlyReadBooks books={sameBooksNewReference} isLoading={false} default />
            </div>
          </Router>
        </LocationProvider>
      )

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
      expect(within(screen.getByTestId('goodreads-page-2')).getAllByTestId('book-link')[0]).toHaveAttribute(
        'title',
        'Book 11'
      )
    })
  })

  describe('navigation and scroll behavior', () => {
    const mockNavigate = jest.fn()
    const mockScrollTo = jest.fn()
    const mockGetElementById = jest.fn()

    beforeEach(() => {
      window.scrollTo = mockScrollTo
      window.document.getElementById = mockGetElementById
      mockNavigate.mockClear()
      mockScrollTo.mockClear()
      mockGetElementById.mockClear()
      // Mock navigate function
      jest.spyOn(require('@gatsbyjs/reach-router'), 'navigate').mockImplementation(mockNavigate)
    })

    it('restores scroll position when location state contains scrollPosition', async () => {
      const scrollPosition = 500
      // Mock requestAnimationFrame
      const originalRAF = window.requestAnimationFrame
      window.requestAnimationFrame = callback => {
        callback()
        return 1
      }
      // Render with location state to trigger useEffect
      render(
        <LocationProvider
          history={{
            location: { pathname: '/', state: { scrollPosition } },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div default>
              <RecentlyReadBooks books={mockBooks} isLoading={false} default />
            </div>
          </Router>
        </LocationProvider>
      )
      // Wait for the next tick to ensure useEffect has run
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: scrollPosition,
        behavior: 'instant'
      })
      // Restore original requestAnimationFrame
      window.requestAnimationFrame = originalRAF
    })

    it('handles close button click with scroll position preservation', () => {
      // Ensure mockBooks contains a book with id '123'
      const testBook = { ...mockBooks[0], id: '123' }
      const books = [testBook, ...mockBooks.slice(1)]
      render(
        <LocationProvider
          history={{
            location: { pathname: '/test', search: '?bookId=123' },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div default>
              <RecentlyReadBooks books={books} isLoading={false} default />
            </div>
          </Router>
        </LocationProvider>
      )
      // Mock window.scrollY
      Object.defineProperty(window, 'scrollY', { value: 300 })
      const closeButton = screen.getByTestId('close-book-explorer')
      fireEvent.click(closeButton)
      expect(mockNavigate).toHaveBeenCalledWith('/test', {
        replace: true,
        state: {
          scrollPosition: 300,
          noScroll: true // Add the noScroll property to match component behavior
        }
      })
    })

    it('scrolls to goodreads element when bookId is present and no scroll state', async () => {
      const mockElement = { offsetHeight: 100 }
      mockGetElementById.mockReturnValue(mockElement)
      // No need to mock window.location properties; use JSDOM defaults
      render(
        <LocationProvider
          history={{
            location: { pathname: '/', search: '?bookId=123' },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div id='goodreads' default />
            <RecentlyReadBooks books={mockBooks} isLoading={false} default />
          </Router>
        </LocationProvider>
      )

      // Wait for setTimeout
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(mockGetElementById).toHaveBeenCalledWith('goodreads')
      expect(window.location.hash).toBe('#goodreads')
    })

    it('handles cleanup on unmount with different scroll position', () => {
      const initialScroll = 100
      const newScroll = 500
      Object.defineProperty(window, 'scrollY', { value: initialScroll })
      const { unmount } = render(
        <LocationProvider
          history={{
            location: { pathname: '/' },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div default>
              <RecentlyReadBooks books={mockBooks} isLoading={false} default />
            </div>
          </Router>
        </LocationProvider>
      )

      // Change scroll position
      Object.defineProperty(window, 'scrollY', { value: newScroll })
      // Unmount component
      unmount()
      // Should restore initial scroll position
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: initialScroll,
        behavior: 'instant'
      })
    })

    it('maintains the current scroll position when location state sets noScroll', async () => {
      const originalRAF = window.requestAnimationFrame
      window.requestAnimationFrame = callback => {
        callback()
        return 1
      }
      Object.defineProperty(window, 'scrollY', { value: 275, configurable: true })

      render(
        <LocationProvider
          history={{
            location: { pathname: '/', state: { noScroll: true } },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div default>
              <RecentlyReadBooks books={mockBooks} isLoading={false} default />
            </div>
          </Router>
        </LocationProvider>
      )

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 275,
        behavior: 'instant'
      })

      window.requestAnimationFrame = originalRAF
    })

    it('does not restore scroll position on unmount if unchanged', () => {
      const scrollPosition = 100
      Object.defineProperty(window, 'scrollY', { value: scrollPosition })
      const { unmount } = render(
        <LocationProvider
          history={{
            location: { pathname: '/' },
            listen: () => () => {},
            navigate: () => {},
            _onTransitionComplete: () => {}
          }}
        >
          <Router>
            <div default>
              <RecentlyReadBooks books={mockBooks} isLoading={false} default />
            </div>
          </Router>
        </LocationProvider>
      )

      // Unmount component without changing scroll position
      unmount()
      // Should not call scrollTo since position hasn't changed
      expect(mockScrollTo).not.toHaveBeenCalled()
    })
  })

  describe('book rendering', () => {
    it('handles both cdnMediaURL and thumbnail fallback', () => {
      const booksWithMixedUrls = [
        { id: 'cdn', title: 'CDN Book', cdnMediaURL: 'https://images.imgix.net/book1.jpg' },
        { id: 'plain', title: 'Plain Book', thumbnail: 'https://example.com/book2.jpg' } // no cdnMediaURL
      ]
      renderWithRouter(<RecentlyReadBooks books={booksWithMixedUrls} isLoading={false} default />)
      const images = screen.getAllByTestId('book-preview-thumbnail')
      expect(images[0]).toHaveAttribute('src', 'https://images.imgix.net/book1.jpg?auto=compress&auto=format')
      expect(images[1]).toHaveAttribute('src', 'https://example.com/book2.jpg')
    })
  })
})
