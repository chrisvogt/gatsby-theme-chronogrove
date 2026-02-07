import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { navigate as gatsbyNavigate } from 'gatsby'

import BookLink from './book-link'
import { useThemeUI } from 'theme-ui'

// Mock gatsby's navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn()
}))

// Mock theme-ui so useThemeUI returns a value (for isDarkMode/placeholder coverage)
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useThemeUI: jest.fn(() => ({ colorMode: 'light' }))
}))

// Mock LazyLoad component
jest.mock('../../lazy-load', () => ({ children }) => <>{children}</>)

describe('Widget/Goodreads/BookLink', () => {
  const mockProps = {
    id: '123',
    title: 'Test Book',
    thumbnailURL: 'https://example.com/book.jpg'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useThemeUI.mockReturnValue({ colorMode: 'light' })
    // Mock console.log to keep test output clean
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('renders a book link with the correct attributes', () => {
    render(<BookLink {...mockProps} />)
    const link = screen.getByTestId('book-link')
    expect(link).toHaveAttribute('href', '?bookId=123')
    expect(link).toHaveAttribute('title', 'Test Book')
  })

  it('handles CDN URLs by appending webp format', () => {
    const cdnProps = {
      ...mockProps,
      thumbnailURL: 'https://images.imgix.net/book.jpg'
    }
    render(<BookLink {...cdnProps} />)
    const image = screen.getByTestId('book-preview-thumbnail')
    expect(image).toHaveAttribute('xlink:href', 'https://images.imgix.net/book.jpg?auto=compress&auto=format')
  })

  it('preserves non-CDN URLs without modification', () => {
    render(<BookLink {...mockProps} />)
    const image = screen.getByTestId('book-preview-thumbnail')
    expect(image).toHaveAttribute('xlink:href', 'https://example.com/book.jpg')
  })

  it('handles click events with scroll position preservation', async () => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 200 })
    render(<BookLink {...mockProps} />)
    const link = screen.getByTestId('book-link')
    fireEvent.click(link)
    // Wait for the setTimeout to complete
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(gatsbyNavigate).toHaveBeenCalledWith('?bookId=123', {
      replace: true,
      state: {
        noScroll: true,
        scrollPosition: 200
      }
    })
  })

  it('renders in dark mode (placeholder color branch)', () => {
    useThemeUI.mockReturnValue({ colorMode: 'dark' })
    render(<BookLink {...mockProps} />)
    expect(screen.getByTestId('book-link')).toBeInTheDocument()
  })

  it('handles invalid thumbnail URLs gracefully', () => {
    const invalidUrlProps = {
      ...mockProps,
      thumbnailURL: 'not-a-valid-url'
    }
    render(<BookLink {...invalidUrlProps} />)
    const image = screen.getByTestId('book-preview-thumbnail')
    // Should use the original invalid URL as fallback
    expect(image).toHaveAttribute('xlink:href', 'not-a-valid-url')
  })

  it('applies tilt on mouse move over the book link', () => {
    render(<BookLink {...mockProps} />)
    const link = screen.getByTestId('book-link')
    const tiltContainer = screen.getByTestId('book-link-tilt-container')
    const tiltInner = screen.getByTestId('book-link-tilt-inner')

    // Mock getBoundingClientRect: width 200, center at 100; clientX 150 -> normalized 0.5 -> tilt 9deg
    tiltContainer.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))

    fireEvent.mouseMove(link, { clientX: 150 })
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(9deg)' })
  })

  it('resets tilt on mouse leave', () => {
    render(<BookLink {...mockProps} />)
    const link = screen.getByTestId('book-link')
    const tiltContainer = screen.getByTestId('book-link-tilt-container')
    const tiltInner = screen.getByTestId('book-link-tilt-inner')

    tiltContainer.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))

    fireEvent.mouseMove(link, { clientX: 150 })
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(9deg)' })
    fireEvent.mouseLeave(link)
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(0deg)' })
  })

  it('does not apply tilt when container has zero width', () => {
    render(<BookLink {...mockProps} />)
    const link = screen.getByTestId('book-link')
    const tiltContainer = screen.getByTestId('book-link-tilt-container')
    const tiltInner = screen.getByTestId('book-link-tilt-inner')

    tiltContainer.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))

    fireEvent.mouseMove(link, { clientX: 50 })
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(0deg)' })
  })

  it('clamps tilt to max angle at edges', () => {
    render(<BookLink {...mockProps} />)
    const link = screen.getByTestId('book-link')
    const tiltContainer = screen.getByTestId('book-link-tilt-container')
    const tiltInner = screen.getByTestId('book-link-tilt-inner')

    tiltContainer.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))

    // Far right: x=100, center=50 -> normalized 1 -> tilt 18deg
    fireEvent.mouseMove(link, { clientX: 100 })
    expect(tiltInner).toHaveStyle({ transform: 'rotateY(18deg)' })
  })
})
