import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import SpotifyWidget from './spotify-widget'
import { TestProviderWithState } from '../../../testUtils'
import useSiteMetadata from '../../../hooks/use-site-metadata'

jest.mock('../../../hooks/use-site-metadata')

const mockSiteMetadata = {
  widgets: {
    spotify: {
      username: 'mockusername',
      widgetDataSource: 'https://fake-api.example.com/social/spotify'
    }
  }
}

describe('Spotify Widget', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the loading state snapshot', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <SpotifyWidget />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the loaded state snapshot', () => {
    const initialState = {
      widgets: {
        spotify: {
          state: 'SUCCESS',
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
            metrics: {
              Playlists: 10,
              'Top Tracks': 20
            },
            profile: {
              displayName: 'Test User',
              profileURL: 'https://spotify.com/user/test'
            },
            provider: {
              displayName: 'Spotify'
            }
          }
        }
      }
    }

    const { asFragment } = render(
      <TestProviderWithState initialState={initialState}>
        <SpotifyWidget />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the error state snapshot', () => {
    const initialState = {
      widgets: {
        spotify: {
          state: 'FAILURE',
          data: null
        }
      }
    }

    const { asFragment } = render(
      <TestProviderWithState initialState={initialState}>
        <SpotifyWidget />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
