import React from 'react'
import renderer from 'react-test-renderer'

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
    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' description='Test description' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with all optional props', () => {
    const tree = renderer
      .create(
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
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without description', () => {
    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without image', () => {
    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' description='Test description' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without keywords', () => {
    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' description='Test description' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without article prop', () => {
    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' description='Test description' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without twitter username', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      twitterUsername: null
    }))

    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' description='Test description' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with twitter username', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      twitterUsername: '@testuser'
    }))

    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' description='Test description' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without webmention URL', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      webmentionUrl: null
    }))

    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page' description='Test description' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with children', () => {
    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Test Page'>
            <meta name='custom' content='value' />
          </Seo>
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles title template replacement', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      titleTemplate: 'Custom %s Template'
    }))

    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Page Title' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles missing title template', () => {
    useSiteMetadata.mockImplementation(() => ({
      ...mockSiteMetadata,
      titleTemplate: null
    }))

    const tree = renderer
      .create(
        <TestProvider>
          <Seo title='Page Title' />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
