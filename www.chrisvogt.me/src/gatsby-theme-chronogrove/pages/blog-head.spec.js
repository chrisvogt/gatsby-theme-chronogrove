import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogHead from './blog-head'

// Mock the Seo component
jest.mock('../../../../theme/src/components/seo', () => ({ title, description, children }) => (
  <div data-testid='seo' data-title={title} data-description={description}>
    {children}
  </div>
))

describe('BlogHead (chrisvogt.me shadow)', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<BlogHead />)
    expect(getByTestId('seo')).toBeInTheDocument()
  })

  it('passes correct title and description to Seo component', () => {
    const { getByTestId } = render(<BlogHead />)
    const seoElement = getByTestId('seo')

    expect(seoElement).toHaveAttribute('data-title', 'Blog - Latest Posts')
    expect(seoElement).toHaveAttribute(
      'data-description',
      'Read the latest blog posts and insights from the blog. Explore articles on technology, photography, music, and personal growth on chrisvogt.me.'
    )
  })

  it('renders Open Graph meta tags for chrisvogt.me', () => {
    const { container } = render(<BlogHead />)

    const urlMeta = container.querySelector('meta[property="og:url"]')
    const typeMeta = container.querySelector('meta[property="og:type"]')

    expect(urlMeta).toHaveAttribute('content', 'https://www.chrisvogt.me/blog/')
    expect(typeMeta).toHaveAttribute('content', 'website')
  })

  it('uses site-specific SEO metadata', () => {
    const { getByTestId } = render(<BlogHead />)
    const seoElement = getByTestId('seo')

    // Verify site-specific title
    expect(seoElement.getAttribute('data-title')).toBe('Blog - Latest Posts')

    // Verify site-specific description mentions chrisvogt.me
    const description = seoElement.getAttribute('data-description')
    expect(description).toContain('chrisvogt.me')
    expect(description).toContain('technology, photography, music, and personal growth')
  })
})
