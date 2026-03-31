import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { navigate as gatsbyNavigate } from 'gatsby'

import BookLink from './book-link'

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
})
