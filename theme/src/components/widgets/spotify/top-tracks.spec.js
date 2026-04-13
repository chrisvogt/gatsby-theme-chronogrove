/** @jsx jsx */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { jsx } from 'theme-ui'
import TopTracks from './top-tracks'
import { TestProviderWithState } from '../../../testUtils'
import { useAudioPlayerStore, resetAudioPlayerStore } from '../../../stores/audio-player-store'
import { ThemeUIProvider } from 'theme-ui'
import theme from '../../../gatsby-plugin-theme-ui/theme'

jest.mock('./media-item-grid', () => jest.fn(() => <div data-testid='media-item-grid' />))
import MediaItemGrid from './media-item-grid'

describe('TopTracks Component', () => {
  beforeEach(() => {
    resetAudioPlayerStore()
    jest.clearAllMocks()
  })

  const mockTracks = [
    {
      id: '1',
      name: 'Song One',
      artists: ['Artist One', 'Artist Two'],
      albumImages: [
        { url: 'http://example.com/large.jpg', width: 640 },
        { url: 'http://example.com/medium.jpg', width: 300 },
        { url: 'http://example.com/small.jpg', width: 64 }
      ],
      spotifyURL: 'http://spotify.com/track1'
    },
    {
      id: '2',
      name: 'Song Two',
      artists: ['Artist Three'],
      albumImages: [
        { url: 'http://example.com/medium2.jpg', width: 300 },
        { url: 'http://example.com/small2.jpg', width: 64 }
      ],
      spotifyURL: 'http://spotify.com/track2'
    }
  ]

  it('renders correctly with tracks', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={mockTracks} />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders correctly when loading', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <TopTracks isLoading={true} />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles tracks without a 300px image gracefully', () => {
    const incompleteTracks = [
      {
        id: '3',
        name: 'Song Three',
        artists: ['Artist Four'],
        albumImages: [{ url: 'http://example.com/small3.jpg', width: 64 }],
        spotifyURL: 'http://spotify.com/track3'
      }
    ]
    const { asFragment } = render(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={incompleteTracks} />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders correctly with no tracks', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={[]} />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('updates audio player store when track is clicked', () => {
    render(
      <ThemeUIProvider theme={theme}>
        <TopTracks isLoading={false} tracks={mockTracks} />
      </ThemeUIProvider>
    )

    const onTrackClick = MediaItemGrid.mock.calls[0][0].onTrackClick
    onTrackClick('http://spotify.com/track1')

    expect(useAudioPlayerStore.getState()).toMatchObject({
      spotifyURL: 'http://spotify.com/track1',
      isVisible: true,
      provider: 'spotify'
    })
  })
})
