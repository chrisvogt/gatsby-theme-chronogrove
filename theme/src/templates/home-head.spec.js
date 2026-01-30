import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useStaticQuery } from 'gatsby'
import HomeHead from './home-head'

// Capture the children passed to Seo for meta tag verification
let capturedChildren = null

// Mock the Seo component
jest.mock('../components/seo', () => ({ title, description, children }) => {
  capturedChildren = children
  return (
    <div data-testid='seo' data-title={title} data-description={description}>
      {children}
    </div>
  )
})

// Mock gatsby useStaticQuery
jest.mock('gatsby')

const mockSiteMetadata = {
  description: 'Test description',
  siteUrl: 'https://test.com',
  social: {
    twitterUsername: 'testuser'
  },
  hCard: {
    givenName: 'Test Person',
    category: 'Person'
  }
}

// Helper to find child element by props
const findChildByProps = (children, matcher) => {
  const childArray = React.Children.toArray(children)
  return childArray.find(child => child.props && matcher(child.props))
}

describe('HomeHead', () => {
  beforeEach(() => {
    capturedChildren = null
    useStaticQuery.mockReturnValue({
      site: {
        siteMetadata: mockSiteMetadata
      }
    })
  })

  it('renders the component', () => {
    const { getByTestId } = render(<HomeHead />)
    expect(getByTestId('seo')).toBeInTheDocument()
  })

  it('passes correct site metadata to Seo component', () => {
    const { getByTestId } = render(<HomeHead />)
    const seoElement = getByTestId('seo')

    expect(seoElement).toHaveAttribute('data-title', 'Home')
    expect(seoElement).toHaveAttribute('data-description', 'Test description')
  })

  it('renders Open Graph meta tags', () => {
    render(<HomeHead />)

    const urlMeta = findChildByProps(capturedChildren, p => p.property === 'og:url')
    const typeMeta = findChildByProps(capturedChildren, p => p.property === 'og:type')

    expect(urlMeta.props.content).toBe('https://test.com')
    expect(typeMeta.props.content).toBe('website')
  })

  it('renders structured data with person schema', () => {
    render(<HomeHead />)

    const script = findChildByProps(capturedChildren, p => p.type === 'application/ld+json')
    expect(script).toBeDefined()

    // The script uses children, not dangerouslySetInnerHTML
    const structuredData = JSON.parse(script.props.children)

    expect(structuredData['@type']).toBe('Person')
    expect(structuredData.name).toBe('Test Person')
    expect(structuredData.url).toBe('https://test.com')
    expect(structuredData.sameAs).toEqual(['https://twitter.com/testuser', 'https://x.com/testuser'])
  })

  it('uses baseURL when available instead of siteUrl', () => {
    useStaticQuery.mockReturnValue({
      site: {
        siteMetadata: {
          ...mockSiteMetadata,
          baseURL: 'https://base.com'
        }
      }
    })

    render(<HomeHead />)
    const urlMeta = findChildByProps(capturedChildren, p => p.property === 'og:url')

    expect(urlMeta.props.content).toBe('https://base.com')
  })

  it('handles missing social data gracefully', () => {
    useStaticQuery.mockReturnValue({
      site: {
        siteMetadata: {
          ...mockSiteMetadata,
          social: {}
        }
      }
    })

    render(<HomeHead />)
    const script = findChildByProps(capturedChildren, p => p.type === 'application/ld+json')
    const structuredData = JSON.parse(script.props.children)

    expect(structuredData.sameAs).toBeUndefined()
  })

  it('sets organization schema type when hCard category is Organization', () => {
    useStaticQuery.mockReturnValue({
      site: {
        siteMetadata: {
          ...mockSiteMetadata,
          hCard: {
            givenName: 'Test Org',
            category: 'Organization'
          }
        }
      }
    })

    render(<HomeHead />)
    const script = findChildByProps(capturedChildren, p => p.type === 'application/ld+json')
    const structuredData = JSON.parse(script.props.children)

    expect(structuredData['@type']).toBe('Organization')
  })

  it('uses fallback values when metadata is missing', () => {
    useStaticQuery.mockReturnValue({
      site: {
        siteMetadata: {}
      }
    })

    const { getByTestId } = render(<HomeHead />)
    const seoElement = getByTestId('seo')

    expect(seoElement).toHaveAttribute('data-title', 'Home')
    expect(seoElement).toHaveAttribute('data-description', 'A personal website and digital garden built with Gatsby.')

    const script = findChildByProps(capturedChildren, p => p.type === 'application/ld+json')
    const structuredData = JSON.parse(script.props.children)
    expect(structuredData.name).toBe('Person')
  })
})
