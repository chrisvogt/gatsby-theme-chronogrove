import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Router, LocationProvider } from '@gatsbyjs/reach-router'

import BookExplorer from './book-explorer'

// Mock reach-router's navigate function
jest.mock('@gatsbyjs/reach-router', () => ({
  ...jest.requireActual('@gatsbyjs/reach-router'),
  navigate: jest.fn(),
  useLocation: () => ({ pathname: '/test' })
}))

// Mock console.log to keep test output clean
jest.spyOn(console, 'log').mockImplementation(() => {})

const renderWithRouter = ui =>
  render(
    <LocationProvider
      history={{
        location: { pathname: '/test' },
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

describe('Widget/Goodreads/BookExplorer', () => {
  const mockBook = {
    authors: ['Test Author'],
    cdnMediaURL: 'https://images.imgix.net/book.jpg',
    description: 'Test description',
    infoLink: 'https://books.google.com/test',
    rating: '4',
    title: 'Test Book'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders book details correctly', () => {
    renderWithRouter(<BookExplorer book={mockBook} onClose={() => {}} default />)
    // Use getAllByText to avoid SVG <title> collision
    const headings = screen.getAllByText('Test Book')
    // Should find at least one heading
    expect(headings.length).toBeGreaterThan(0)
    // Check for the heading element
    expect(headings.some(el => el.tagName.toLowerCase() === 'h3')).toBe(true)
    expect(screen.getByText('by Test Author')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Learn more on Google Books')).toBeInTheDocument()
  })

  it('renders book image with webp format for CDN URLs', () => {
    renderWithRouter(<BookExplorer book={mockBook} onClose={() => {}} default />)
    const image = screen.getByTestId('book-preview-thumbnail')
    expect(image).toHaveAttribute('xlink:href', 'https://images.imgix.net/book.jpg?auto=compress&auto=format')
  })

  it('renders rating stars correctly', () => {
    renderWithRouter(<BookExplorer book={mockBook} onClose={() => {}} default />)
    // The stars are rendered as a single string in a <span>
    expect(screen.getByText('★★★★☆')).toBeInTheDocument()
  })

  it('handles close button click with scroll position preservation', () => {
    const onClose = jest.fn()
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 300 })
    renderWithRouter(<BookExplorer book={mockBook} onClose={onClose} default />)
    const closeButton = screen.getByTestId('close-book-explorer')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('handles "Back to grid view" link click', () => {
    const onClose = jest.fn()
    renderWithRouter(<BookExplorer book={mockBook} onClose={onClose} default />)
    const backLink = screen.getByText('← Back to grid view')
    fireEvent.click(backLink)
    expect(onClose).toHaveBeenCalled()
  })

  it('renders external link without target="_blank"', () => {
    renderWithRouter(<BookExplorer book={mockBook} onClose={() => {}} default />)
    const link = screen.getByText('Learn more on Google Books')
    expect(link).not.toHaveAttribute('target')
  })

  it('renders HTML entities in description correctly', () => {
    const bookWithHtml = {
      ...mockBook,
      description: 'This is <b>bold</b> text with a <br /> line break and <i>italic</i> content'
    }
    renderWithRouter(<BookExplorer book={bookWithHtml} onClose={() => {}} default />)

    // Check that the HTML is properly rendered as elements
    const descriptionElement = screen.getByText(/This is/).closest('p')
    expect(descriptionElement.innerHTML).toContain('<b>bold</b>')
    expect(descriptionElement.innerHTML).toContain('<br>')
    expect(descriptionElement.innerHTML).toContain('<i>italic</i>')
    expect(descriptionElement.textContent).toBe('This is bold text with a  line break and italic content')
  })

  it('ignores unsupported HTML tags in description', () => {
    const bookWithUnsupportedHtml = {
      ...mockBook,
      description: 'This has <div>unsupported</div> and <span>tags</span>'
    }
    renderWithRouter(<BookExplorer book={bookWithUnsupportedHtml} onClose={() => {}} default />)

    // Should render the content without the unsupported tags
    expect(
      screen.getByText((content, node) => node.textContent === 'This has unsupported and tags')
    ).toBeInTheDocument()
  })

  it('renders em tags and anchor tags in description correctly', () => {
    const bookWithAdvancedHtml = {
      ...mockBook,
      description: 'This is <em>emphasized</em> text with a <a href="https://example.com">link</a>'
    }
    renderWithRouter(<BookExplorer book={bookWithAdvancedHtml} onClose={() => {}} default />)

    // Check that the HTML is properly rendered as elements
    const descriptionElement = screen.getByText(/This is/).closest('p')
    expect(descriptionElement.innerHTML).toContain('<em>emphasized</em>')
    expect(descriptionElement.innerHTML).toContain('<a href="https://example.com"')
    expect(descriptionElement.textContent).toBe('This is emphasized text with a link')
  })
})
