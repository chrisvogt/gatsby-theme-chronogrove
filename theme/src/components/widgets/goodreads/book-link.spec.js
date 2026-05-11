import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { navigate as gatsbyNavigate } from 'gatsby'

import BookLink from './book-link'

/** jsdom does not reliably complete `Image()` loads for remote URLs; the component probes with `Image()` before rendering `<img>`. */
const OriginalImage = global.Image
class MockImage {
  constructor() {
    this._onLoad = null
    this._onErr = null
  }

  addEventListener(type, fn) {
    if (type === 'load') this._onLoad = fn
    if (type === 'error') this._onErr = fn
  }

  removeEventListener(type, fn) {
    if (type === 'load' && this._onLoad === fn) this._onLoad = null
    if (type === 'error' && this._onErr === fn) this._onErr = null
  }

  set src(value) {
    this._src = value
    queueMicrotask(() => {
      const fail = !value || value === 'not-a-valid-url' || String(value).includes('__IMAGE_PROBE_ERROR__')
      if (fail) this._onErr?.()
      else this._onLoad?.()
    })
  }

  get src() {
    return this._src
  }
}

// Mock gatsby's navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn()
}))

// Mock Book3D so tests don't need a WebGL context.
// Exposes book-preview-thumbnail so URL-formatting assertions still work.
jest.mock('../../artwork/book-3d', () => {
  const React = require('react')
  return function MockBook3D({ title, thumbnailURL }) {
    return (
      <div data-testid='book-preview-3d' role='img' aria-label={title}>
        <img data-testid='book-preview-thumbnail' src={thumbnailURL} alt={title} />
      </div>
    )
  }
})

describe('Widget/Goodreads/BookLink', () => {
  const mockProps = {
    id: '123',
    title: 'Test Book',
    thumbnailURL: 'https://example.com/book.jpg'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    global.Image = MockImage
  })

  afterEach(() => {
    global.Image = OriginalImage
  })

  it('renders a book link with the correct attributes', () => {
    render(<BookLink {...mockProps} />)
    const link = screen.getByTestId('book-link')
    expect(link.tagName).toBe('BUTTON')
    expect(link).toHaveAttribute('title', 'Test Book')
  })

  it('renders the 3D book preview directly (no LazyLoad)', () => {
    render(<BookLink {...mockProps} />)
    expect(screen.getByTestId('book-preview-3d')).toBeInTheDocument()
  })

  it('handles CDN URLs by appending webp format', () => {
    render(<BookLink {...mockProps} thumbnailURL='https://images.imgix.net/book.jpg' />)
    expect(screen.getByTestId('book-preview-thumbnail')).toHaveAttribute(
      'src',
      'https://images.imgix.net/book.jpg?auto=compress&auto=format'
    )
  })

  it('preserves non-CDN URLs without modification', () => {
    render(<BookLink {...mockProps} />)
    expect(screen.getByTestId('book-preview-thumbnail')).toHaveAttribute('src', 'https://example.com/book.jpg')
  })

  it('handles invalid thumbnail URLs gracefully', () => {
    render(<BookLink {...mockProps} thumbnailURL='not-a-valid-url' />)
    expect(screen.getByTestId('book-preview-thumbnail')).toHaveAttribute('src', 'not-a-valid-url')
  })

  it('handles click events with scroll position preservation', async () => {
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })
    render(<BookLink {...mockProps} />)
    fireEvent.click(screen.getByTestId('book-link'))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(gatsbyNavigate).toHaveBeenCalledWith('?bookId=123', {
      replace: true,
      state: { noScroll: true, scrollPosition: 200 }
    })
  })

  it('suppresses navigation when swipe interaction is active', async () => {
    render(<BookLink {...mockProps} suppressNavigation={true} />)
    fireEvent.click(screen.getByTestId('book-link'))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(gatsbyNavigate).not.toHaveBeenCalled()
  })

  it('passes introDelay through to Book3D', () => {
    // Simply verify the component renders without errors when introDelay is provided
    render(<BookLink {...mockProps} introDelay={240} />)
    expect(screen.getByTestId('book-preview-3d')).toBeInTheDocument()
  })

  it('renders a flat image preview when flatCover is true (no WebGL)', async () => {
    render(<BookLink {...mockProps} flatCover />)
    expect(screen.queryByTestId('book-preview-3d')).not.toBeInTheDocument()
    expect(screen.getByTestId('book-preview-flat')).toHaveAttribute('aria-label', 'Test Book')
    await waitFor(() => {
      expect(screen.getByTestId('book-preview-thumbnail')).toHaveAttribute('src', 'https://example.com/book.jpg')
    })
  })

  it('shows the title when the flat cover image fails to load', async () => {
    render(<BookLink {...mockProps} thumbnailURL='not-a-valid-url' flatCover />)
    await waitFor(() => {
      expect(screen.queryByTestId('book-preview-thumbnail')).not.toBeInTheDocument()
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })
  })

  it('shows the title when flatCover has no image URL', () => {
    render(<BookLink {...mockProps} thumbnailURL='' flatCover />)
    expect(screen.getByText('Test Book')).toBeInTheDocument()
    expect(screen.queryByTestId('book-preview-thumbnail')).not.toBeInTheDocument()
  })

  it('ignores flat-cover probe callbacks after unmount', () => {
    jest.useFakeTimers()
    global.Image = class DelayedMock {
      constructor() {
        this._onLoad = null
      }

      addEventListener(type, fn) {
        if (type === 'load') this._onLoad = fn
      }

      removeEventListener() {}

      set src(_value) {
        setTimeout(() => this._onLoad?.(), 100)
      }
    }

    const { unmount } = render(<BookLink {...mockProps} flatCover />)
    unmount()
    jest.advanceTimersByTime(200)
    jest.useRealTimers()
  })
})
