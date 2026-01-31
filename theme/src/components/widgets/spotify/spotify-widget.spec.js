import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import SpotifyWidget from './spotify-widget'
import { TestProviderWithQuery } from '../../../testUtils'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

jest.mock('../../../hooks/use-site-metadata')
jest.mock('../../../hooks/use-widget-data')

const mockSiteMetadata = {
  widgets: {
    spotify: {
      username: 'mockusername',
      widgetDataSource: 'https://fake-api.example.com/social/spotify'
    }
  }
}

const mockLoadingState = {
  data: undefined,
  isLoading: true,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockSuccessState = {
  data: {
    collections: {
      playlists: [
        {
          id: 'playlist1',
          name: 'Test Playlist',
          description: 'Test description',
          images: [{ url: 'https://example.com/image.jpg' }],
          external_urls: { spotify: 'https://spotify.com/playlist1' }
        }
      ],
      topTracks: [
        {
          id: 'track1',
          name: 'Test Track',
          artists: [{ name: 'Test Artist' }],
          album: { name: 'Test Album' },
          external_urls: { spotify: 'https://spotify.com/track1' }
        }
      ]
    },
    metrics: [
      { displayName: 'Playlists', value: 10 },
      { displayName: 'Top Tracks', value: 20 }
    ],
    profile: {
      displayName: 'Test User',
      profileURL: 'https://spotify.com/user/test'
    },
    provider: {
      displayName: 'Spotify'
    }
  },
  isLoading: false,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockErrorState = {
  data: undefined,
  isLoading: false,
  hasFatalError: true,
  isError: true,
  error: new Error('Failed to fetch')
}

describe('Spotify Widget', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the loading state snapshot', () => {
    useWidgetData.mockReturnValue(mockLoadingState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SpotifyWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the loaded state snapshot', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SpotifyWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the error state snapshot', () => {
    useWidgetData.mockReturnValue(mockErrorState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SpotifyWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
