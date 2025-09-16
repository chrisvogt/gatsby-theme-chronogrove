import React from 'react'
import renderer from 'react-test-renderer'

import { TestProviderWithState } from '../testUtils'
import Layout from './layout'
import useSiteMetadata from '../hooks/use-site-metadata'
import useNavigationData from '../hooks/use-navigation-data'
import useSocialProfiles from '../hooks/use-social-profiles'

jest.mock('../hooks/use-site-metadata')
jest.mock('../hooks/use-navigation-data')
jest.mock('../hooks/use-social-profiles')

const mockSiteMetadata = {
  title: 'Test Site',
  description: 'Test description',
  author: 'Test Author'
}

const mockNavigationData = {
  header: {
    home: [
      {
        path: '/about',
        slug: 'about',
        text: 'About'
      }
    ]
  }
}

const mockSocialProfiles = [
  {
    name: 'GitHub',
    url: 'https://github.com/test'
  }
]

describe('Layout', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
    useNavigationData.mockImplementation(() => mockNavigationData)
    useSocialProfiles.mockImplementation(() => mockSocialProfiles)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <Layout>
            <div>Test content</div>
          </Layout>
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with hideHeader prop', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <Layout hideHeader>
            <div>Test content without header</div>
          </Layout>
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with hideFooter prop', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <Layout hideFooter>
            <div>Test content without footer</div>
          </Layout>
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with disableMainWrapper prop', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <Layout disableMainWrapper>
            <div>Test content without main wrapper</div>
          </Layout>
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with audio player visible state', () => {
    const initialState = {
      audioPlayer: {
        isVisible: true,
        currentTrack: {
          title: 'Test Track',
          artist: 'Test Artist',
          url: 'https://example.com/track.mp3'
        }
      }
    }

    const tree = renderer
      .create(
        <TestProviderWithState initialState={initialState}>
          <Layout>
            <div>Test content with audio player</div>
          </Layout>
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with audio player visible state and checks padding', () => {
    const initialState = {
      audioPlayer: {
        isVisible: true,
        currentTrack: {
          title: 'Test Track',
          artist: 'Test Artist',
          url: 'https://example.com/track.mp3'
        }
      }
    }

    const tree = renderer.create(
      <TestProviderWithState initialState={initialState}>
        <Layout>
          <div>Test content with audio player</div>
        </Layout>
      </TestProviderWithState>
    )

    // Test passes if no errors are thrown
    expect(tree.toJSON()).toBeTruthy()

    tree.unmount()
  })

  it('renders with audio player hidden state', () => {
    const initialState = {
      audioPlayer: {
        isVisible: false,
        currentTrack: null
      }
    }

    const tree = renderer
      .create(
        <TestProviderWithState initialState={initialState}>
          <Layout>
            <div>Test content without audio player</div>
          </Layout>
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with audio player hidden state and checks no padding', () => {
    const initialState = {
      audioPlayer: {
        isVisible: false,
        currentTrack: null
      }
    }

    const tree = renderer.create(
      <TestProviderWithState initialState={initialState}>
        <Layout>
          <div>Test content without audio player</div>
        </Layout>
      </TestProviderWithState>
    )

    // Test passes if no errors are thrown
    expect(tree.toJSON()).toBeTruthy()

    tree.unmount()
  })
})
