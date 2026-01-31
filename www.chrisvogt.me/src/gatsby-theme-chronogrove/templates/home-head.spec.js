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

describe('HomeHead (chrisvogt.me shadow)', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<HomeHead />)
    expect(getByTestId('seo')).toBeInTheDocument()
  })

  it('passes correct Chris Vogt-specific metadata to Seo component', () => {
    const { getByTestId } = render(<HomeHead />)
    const seoElement = getByTestId('seo')

    expect(seoElement).toHaveAttribute('data-title', 'Home')
    expect(seoElement).toHaveAttribute(
      'data-description',
      "Explore Chris Vogt's digital garden. A Software Engineer in San Francisco, Chris shares his interest in photography, piano, and travel."
    )
    expect(seoElement).toHaveAttribute(
      'data-keywords',
      'Chris Vogt, Software Engineer in San Francisco, GoDaddy engineer blog, photography blog, piano recordings, travel blog, personal blog, digital garden'
    )
  })

  it('renders Open Graph meta tags for chrisvogt.me', () => {
    const { container } = render(<HomeHead />)

    const urlMeta = container.querySelector('meta[property="og:url"]')
    const typeMeta = container.querySelector('meta[property="og:type"]')

    expect(urlMeta).toHaveAttribute('content', 'https://www.chrisvogt.me')
    expect(typeMeta).toHaveAttribute('content', 'website')
  })

  it('renders structured data with @graph containing WebSite and Person schemas', () => {
    const { container } = render(<HomeHead />)
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script).toBeInTheDocument()
    const structuredData = JSON.parse(script.textContent)

    expect(structuredData['@context']).toBe('https://schema.org')
    expect(structuredData['@graph']).toBeDefined()
    expect(structuredData['@graph']).toHaveLength(2)
  })

  it('includes WebSite schema with correct information', () => {
    const { container } = render(<HomeHead />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const structuredData = JSON.parse(script.textContent)

    const websiteSchema = structuredData['@graph'].find(item => item['@type'] === 'WebSite')

    expect(websiteSchema).toBeDefined()
    expect(websiteSchema['@id']).toBe('https://www.chrisvogt.me/#website')
    expect(websiteSchema.url).toBe('https://www.chrisvogt.me')
    expect(websiteSchema.name).toBe('Chris Vogt')
    expect(websiteSchema.inLanguage).toBe('en-US')
    expect(websiteSchema.publisher['@id']).toBe('https://www.chrisvogt.me/#person')
  })

  it('includes Person schema with Chris Vogt-specific information', () => {
    const { container } = render(<HomeHead />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const structuredData = JSON.parse(script.textContent)

    const personSchema = structuredData['@graph'].find(item => item['@type'] === 'Person')

    expect(personSchema).toBeDefined()
    expect(personSchema['@id']).toBe('https://www.chrisvogt.me/#person')
    expect(personSchema.name).toBe('Chris Vogt')
    expect(personSchema.url).toBe('https://www.chrisvogt.me')
    expect(personSchema.jobTitle).toBe('Principal Software Engineer')
    expect(personSchema.worksFor.name).toBe('GoDaddy')
  })

  it('includes social media profiles in Person schema', () => {
    const { container } = render(<HomeHead />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const structuredData = JSON.parse(script.textContent)
    const personSchema = structuredData['@graph'].find(item => item['@type'] === 'Person')

    const expectedProfiles = [
      'https://linkedin.com/in/cjvogt',
      'https://github.com/chrisvogt',
      'https://x.com/c1v0',
      'https://twitter.com/c1v0',
      'https://www.instagram.com/c1v0',
      'https://stackoverflow.com/users/1391826/chris-vogt',
      'https://bsky.app/profile/chrisvogt.me',
      'https://hachyderm.io/@chrisvogt'
    ]

    expectedProfiles.forEach(profile => {
      expect(personSchema.sameAs).toContain(profile)
    })
  })
})
