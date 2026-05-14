import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogHead from './blog-head'

// Mock the Seo component
jest.mock('../../../../../packages/theme/src/components/seo', () => ({ title, description, children }) => (
  <div data-testid='seo' data-title={title} data-description={description}>
    {children}
  </div>
))

describe('BlogHead (chronogrove.com shadow)', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<BlogHead />)
    expect(getByTestId('seo')).toBeInTheDocument()
  })

  it('passes correct title and description to Seo component', () => {
    const { getByTestId } = render(<BlogHead />)
    const seoElement = getByTestId('seo')

    expect(seoElement).toHaveAttribute('data-title', 'Blog - Chronogrove')
    expect(seoElement).toHaveAttribute(
      'data-description',
      'Latest blog posts and articles from Chronogrove. Discover insights on technology, development, and more.'
    )
  })

  it('renders Open Graph meta tags for chronogrove.com', () => {
    const { container } = render(<BlogHead />)

    const urlMeta = container.querySelector('meta[property="og:url"]')
    const typeMeta = container.querySelector('meta[property="og:type"]')

    expect(urlMeta).toHaveAttribute('content', 'https://www.chronogrove.com/blog/')
    expect(typeMeta).toHaveAttribute('content', 'website')
  })
})
