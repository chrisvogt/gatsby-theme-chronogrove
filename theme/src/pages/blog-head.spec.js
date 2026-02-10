import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogHead from './blog-head'

// Mock the useSiteMetadata hook
jest.mock('../hooks/use-site-metadata', () => ({
  useSiteMetadata: () => ({
    title: 'Test Site',
    description: 'Test site description',
    siteUrl: 'https://test.example.com'
  })
}))

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

describe('BlogHead', () => {
  beforeEach(() => {
    capturedChildren = null
  })

  it('renders the component', () => {
    const { getByTestId } = render(<BlogHead />)
    expect(getByTestId('seo')).toBeInTheDocument()
  })

  it('passes correct title and description to Seo component', () => {
    const { getByTestId } = render(<BlogHead />)
    const seoElement = getByTestId('seo')

    expect(seoElement).toHaveAttribute('data-title', 'Blog - Test Site')
    expect(seoElement).toHaveAttribute('data-description', 'Test site description')
  })

  it('renders Open Graph meta tags', () => {
    render(<BlogHead />)

    // Verify meta tags are passed as children to Seo
    expect(capturedChildren).toBeDefined()

    // Convert children to array and check meta tags
    const childArray = React.Children.toArray(capturedChildren)
    const urlMeta = childArray.find(child => child.props?.property === 'og:url')
    const typeMeta = childArray.find(child => child.props?.property === 'og:type')

    expect(urlMeta.props.content).toBe('https://test.example.com/blog/')
    expect(typeMeta.props.content).toBe('website')
  })

  it('uses site metadata correctly', () => {
    // Test that the component calls useSiteMetadata and uses the returned values
    const { getByTestId } = render(<BlogHead />)
    const seoElement = getByTestId('seo')

    // Verify that the title includes the site title
    expect(seoElement.getAttribute('data-title')).toBe('Blog - Test Site')

    // Verify that the description is passed through
    expect(seoElement.getAttribute('data-description')).toBe('Test site description')
  })
})
