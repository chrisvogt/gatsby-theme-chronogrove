import React from 'react'
import { render, screen } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import HCard from './h-card'
import '@testing-library/jest-dom'

const mockSiteMetadata = {
  site: {
    siteMetadata: {
      headline: 'Test User',
      baseURL: 'https://test.com',
      description: 'Test description',
      hCard: {
        email: 'test@example.com',
        givenName: 'Test',
        familyName: 'User',
        locality: 'Test City',
        region: 'CA',
        countryName: 'USA',
        category: 'Developer',
        photoURL: 'https://example.com/photo.jpg'
      }
    }
  }
}

jest.mock('gatsby')

describe('HCard', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders h-card with all fields', () => {
    render(<HCard />)

    const hCard = screen.getByText('Test User').closest('.h-card')
    expect(hCard).toBeInTheDocument()
    expect(hCard).toHaveStyle({ display: 'none' })

    // Check main link
    const nameLink = screen.getByText('Test User')
    expect(nameLink).toHaveClass('p-name', 'u-url', 'u-uid')
    expect(nameLink).toHaveAttribute('href', 'https://test.com')
    expect(nameLink).toHaveAttribute('rel', 'me')

    // Check photo
    const photo = screen.getByAltText('Test User')
    expect(photo).toHaveClass('u-photo')
    expect(photo).toHaveAttribute('src', 'https://example.com/photo.jpg')
    expect(photo).toHaveAttribute('width', '1440')
    expect(photo).toHaveAttribute('height', '810')

    // Check description
    expect(screen.getByText('Test description')).toHaveClass('p-note')

    // Check email
    const emailLink = screen.getByText('test@example.com')
    expect(emailLink).toHaveClass('u-email')
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com')

    // Check name fields
    expect(screen.getByText('Test')).toHaveClass('p-given-name')
    expect(screen.getByText('User')).toHaveClass('p-family-name')

    // Check location fields
    expect(screen.getByText('Test City')).toHaveClass('p-locality')
    expect(screen.getByText('CA')).toHaveClass('p-region')
    expect(screen.getByText('USA')).toHaveClass('p-country-name')

    // Check category
    expect(screen.getByText('Developer')).toHaveClass('p-category')
  })

  it('renders h-card without optional fields', () => {
    const minimalMetadata = {
      site: {
        siteMetadata: {
          headline: 'Test User',
          baseURL: 'https://test.com',
          description: 'Test description',
          hCard: {}
        }
      }
    }
    useStaticQuery.mockImplementation(() => minimalMetadata)

    render(<HCard />)

    // Check required fields are present
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()

    // Check optional fields are not present
    expect(screen.queryByAltText('Test User')).not.toBeInTheDocument()
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
    expect(screen.queryByText('User')).not.toBeInTheDocument()
    expect(screen.queryByText('Test City')).not.toBeInTheDocument()
    expect(screen.queryByText('CA')).not.toBeInTheDocument()
    expect(screen.queryByText('USA')).not.toBeInTheDocument()
    expect(screen.queryByText('Developer')).not.toBeInTheDocument()
  })

  it('renders h-card with some optional fields', () => {
    const partialMetadata = {
      site: {
        siteMetadata: {
          headline: 'Test User',
          baseURL: 'https://test.com',
          description: 'Test description',
          hCard: {
            email: 'test@example.com',
            region: 'CA',
            photoURL: 'https://example.com/photo.jpg'
          }
        }
      }
    }
    useStaticQuery.mockImplementation(() => partialMetadata)

    render(<HCard />)

    // Check present optional fields
    expect(screen.getByAltText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('CA')).toBeInTheDocument()

    // Check missing optional fields
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
    expect(screen.queryByText('User')).not.toBeInTheDocument()
    expect(screen.queryByText('Test City')).not.toBeInTheDocument()
    expect(screen.queryByText('USA')).not.toBeInTheDocument()
    expect(screen.queryByText('Developer')).not.toBeInTheDocument()
  })

  it('handles missing hCard object', () => {
    const noHCardMetadata = {
      site: {
        siteMetadata: {
          headline: 'Test User',
          baseURL: 'https://test.com',
          description: 'Test description'
        }
      }
    }
    useStaticQuery.mockImplementation(() => noHCardMetadata)

    render(<HCard />)

    // Check required fields are present
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()

    // Check no optional fields are present
    expect(screen.queryByAltText('Test User')).not.toBeInTheDocument()
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
  })
})
