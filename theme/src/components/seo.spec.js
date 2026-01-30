import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { TestProvider } from '../testUtils'
import Seo from './seo'
import useSiteMetadata from '../hooks/use-site-metadata'

jest.mock('../hooks/use-site-metadata')

const mockSiteMetadata = {
  title: 'Test Site',
  titleTemplate: '%s | Test Site',
  twitterUsername: '@testuser',
  webmentionUrl: 'https://webmention.io/test.com/webmention'
}

describe('Seo', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the snapshot with basic props', () => {
    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' description='Test description' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with all optional props', () => {
    const { asFragment } = render(
      <TestProvider>
        <Seo
          title='Test Page'
          description='Test description'
          image='https://example.com/image.jpg'
          keywords='test, keywords'
          article={true}
        />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without description', () => {
    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without image', () => {
    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' description='Test description' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without keywords', () => {
    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' description='Test description' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without article prop', () => {
    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' description='Test description' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without twitter username', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      twitterUsername: null
    }))

    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' description='Test description' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with twitter username', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      twitterUsername: '@testuser'
    }))

    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' description='Test description' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without webmention URL', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      webmentionUrl: null
    }))

    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page' description='Test description' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with children', () => {
    const { asFragment } = render(
      <TestProvider>
        <Seo title='Test Page'>
          <meta name='custom' content='value' />
        </Seo>
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles title template replacement', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      titleTemplate: 'Custom %s Template'
    }))

    const { asFragment } = render(
      <TestProvider>
        <Seo title='Page Title' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles missing title template', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      titleTemplate: null
    }))

    const { asFragment } = render(
      <TestProvider>
        <Seo title='Page Title' />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
