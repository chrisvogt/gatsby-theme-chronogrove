import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import { useStaticQuery } from 'gatsby'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Media, { Head } from './media'
import * as useSiteMetadataModule from '../hooks/use-site-metadata'

// Mocked Data
const data = {
  mdx: {
    id: 'mock-media-id',
    fields: {
      category: 'Mock Category',
      path: '/music/mock-media'
    },
    frontmatter: {
      title: 'A Mock Blog Post',
      date: 'Mon, 17 Jun 2024 03:30:26 GMT',
      soundcloudId: null,
      youtubeSrc: null,
      banner: 'mock-banner.jpg',
      description: 'Mock Description',
      keywords: ['mock', 'test', 'music']
    }
  }
}

// Mock theme object
const mockTheme = {
  colors: {
    'panel-background': '#f0f0f0'
  }
}

// Create mock store
const mockStore = configureStore([])
const store = mockStore({
  audioPlayer: {
    isVisible: false,
    soundcloudId: null
  }
})

jest.mock('gatsby')
jest.mock('../components/layout', () => {
  return ({ children }) => <div className='layoutMock'>{children}</div>
})

jest.mock('../components/seo', () => {
  return ({ children }) => <div className='seoMock'>{children}</div>
})

jest.mock('../shortcodes/soundcloud', () => {
  return ({ soundcloudId }) => <div className='soundcloudMock'>{soundcloudId}</div>
})

jest.mock('../shortcodes/youtube', () => {
  return ({ url }) => <div className='youtubeMock'>{url}</div>
})

const MediaPostContent = <div>Lorum ipsum dolor sit amet.</div>

describe('Media Post', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => data)
    jest
      .spyOn(useSiteMetadataModule, 'default')
      .mockReturnValue({ siteUrl: 'https://example.com', baseURL: 'https://example.com' })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  // Helper function to wrap components in the ThemeUIProvider and Redux Provider
  const renderWithTheme = component =>
    render(
      <Provider store={store}>
        <ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>
      </Provider>
    )

  // Test with no media sources
  it('renders correctly with no media sources', () => {
    const { asFragment } = renderWithTheme(<Media data={data} children={MediaPostContent} />)
    expect(asFragment()).toMatchSnapshot()
  })

  // Test with YouTube source
  it('renders correctly with a YouTube source', () => {
    const youtubeData = {
      ...data,
      mdx: {
        ...data.mdx,
        frontmatter: { ...data.mdx.frontmatter, youtubeSrc: 'mockYoutubeSrc' }
      }
    }
    const { asFragment } = renderWithTheme(<Media data={youtubeData} children={MediaPostContent} />)
    expect(asFragment()).toMatchSnapshot()
  })

  // Test with SoundCloud source
  it('renders correctly with a SoundCloud source', () => {
    const soundcloudData = {
      ...data,
      mdx: {
        ...data.mdx,
        frontmatter: { ...data.mdx.frontmatter, soundcloudId: 'mockSoundCloudId' }
      }
    }
    const { asFragment } = renderWithTheme(<Media data={soundcloudData} children={MediaPostContent} />)
    expect(asFragment()).toMatchSnapshot()
  })

  // Test the SEO Head component
  it('renders the Head component with SEO data', () => {
    const { asFragment } = renderWithTheme(<Head data={data} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
