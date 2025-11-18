import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { navigate as gatsbyNavigate } from 'gatsby'

import BookLink from './book-link'

// Mock gatsby's navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn()
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
})
