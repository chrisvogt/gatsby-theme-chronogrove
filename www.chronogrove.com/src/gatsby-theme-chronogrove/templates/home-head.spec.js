import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomeHead from './home-head'

// Mock the Seo component
jest.mock('../../../../theme/src/components/seo', () => ({ title, description, keywords, children }) => (
  <div data-testid='seo' data-title={title} data-description={description} data-keywords={keywords}>
    {children}
  </div>
))

describe('HomeHead (chronogrove.com shadow)', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<HomeHead />)
    expect(getByTestId('seo')).toBeInTheDocument()
  })

  it('passes correct Chronogrove-specific metadata to Seo component', () => {
    const { getByTestId } = render(<HomeHead />)
    const seoElement = getByTestId('seo')

    expect(seoElement).toHaveAttribute('data-title', 'Home')
    expect(seoElement).toHaveAttribute(
      'data-description',
      'Official demo site for gatsby-theme-chronogrove - A beautiful Gatsby theme for personal websites and blogs with social media widgets and modern design.'
    )
    expect(seoElement).toHaveAttribute(
      'data-keywords',
      'gatsby theme, personal website, blog theme, gatsby, react, chronogrove, theme ui, social media widgets'
    )
  })

  it('renders Open Graph meta tags for chronogrove.com', () => {
    const { container } = render(<HomeHead />)

    const urlMeta = container.querySelector('meta[property="og:url"]')
    const typeMeta = container.querySelector('meta[property="og:type"]')

    expect(urlMeta).toHaveAttribute('content', 'https://www.chronogrove.com')
    expect(typeMeta).toHaveAttribute('content', 'website')
  })

  it('renders structured data with SoftwareApplication schema', () => {
    const { container } = render(<HomeHead />)
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script).toBeInTheDocument()
    const structuredData = JSON.parse(script.textContent)

    expect(structuredData['@context']).toBe('https://schema.org')
    expect(structuredData['@type']).toBe('SoftwareApplication')
    expect(structuredData.name).toBe('Chronogrove')
    expect(structuredData.applicationCategory).toBe('WebApplication')
    expect(structuredData.operatingSystem).toBe('Web')
    expect(structuredData.url).toBe('https://www.chronogrove.com')
  })

  it('includes author information in structured data', () => {
    const { container } = render(<HomeHead />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const structuredData = JSON.parse(script.textContent)

    expect(structuredData.author).toEqual({
      '@type': 'Person',
      name: 'Theme User'
    })
  })

  it('includes free offer information in structured data', () => {
    const { container } = render(<HomeHead />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const structuredData = JSON.parse(script.textContent)

    expect(structuredData.offers).toEqual({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    })
  })

  it('uses theme-specific SEO metadata', () => {
    const { getByTestId } = render(<HomeHead />)
    const seoElement = getByTestId('seo')

    // Verify theme-specific title
    expect(seoElement.getAttribute('data-title')).toContain('Chronogrove')

    // Verify theme-specific description mentions gatsby theme
    const description = seoElement.getAttribute('data-description')
    expect(description).toContain('gatsby-theme-chronogrove')
    expect(description).toContain('theme')

    // Verify theme-specific keywords
    const keywords = seoElement.getAttribute('data-keywords')
    expect(keywords).toContain('gatsby theme')
    expect(keywords).toContain('chronogrove')
  })
})
