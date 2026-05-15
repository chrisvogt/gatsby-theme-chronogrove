/** @jsx jsx */
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { jsx, ThemeUIProvider } from 'theme-ui'
import TopTracks from './top-tracks'
import { TestProviderWithState } from '../../../test-utils'
import { useAudioPlayerStore, resetAudioPlayerStore } from '../../../stores/audio-player-store'
import theme from '@chronogrove/ui/theme'

jest.mock('./media-item-grid', () => jest.fn(() => <div data-testid='media-item-grid' />))
import MediaItemGrid from './media-item-grid'

describe('TopTracks Component', () => {
  beforeEach(() => {
    resetAudioPlayerStore()
    jest.clearAllMocks()
  })

  const buildTracks = (count, idPrefix = '') =>
    Array.from({ length: count }, (_, index) => ({
      id: idPrefix ? `${idPrefix}-${index}` : String(index + 1),
      name: `Song ${index + 1}`,
      artists: ['Artist'],
      albumImages: [{ url: `http://example.com/m-${index + 1}.jpg`, width: 300 }],
      spotifyURL: `http://spotify.com/track${index + 1}`
    }))

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

  it('splits more than 12 tracks into carousel pages and shows pagination', () => {
    const manyTracks = buildTracks(13)

    const { getByLabelText, getByTestId } = render(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={manyTracks} />
      </TestProviderWithState>
    )

    expect(getByTestId('spotify-top-tracks-carousel')).toBeInTheDocument()
    expect(getByTestId('spotify-top-tracks-page-1')).toBeInTheDocument()
    expect(getByTestId('spotify-top-tracks-page-2')).toBeInTheDocument()
    expect(getByLabelText('Next page')).toBeInTheDocument()

    const itemsLengths = MediaItemGrid.mock.calls.map(([props]) => props.items?.length ?? 0)
    expect(itemsLengths.filter(length => length === 12)).toHaveLength(1)
    expect(itemsLengths.filter(length => length === 1)).toHaveLength(1)
  })

  it('clamps the current page when the track list shrinks to fewer pages', async () => {
    const thirteenTracks = buildTracks(13)
    const twelveTracks = thirteenTracks.slice(0, 12)

    const { getByLabelText, getByTestId, queryByLabelText, queryByTestId, rerender } = render(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={thirteenTracks} />
      </TestProviderWithState>
    )

    fireEvent.click(getByLabelText('Go to page 2'))

    rerender(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={twelveTracks} />
      </TestProviderWithState>
    )

    await waitFor(() => {
      expect(queryByLabelText('Next page')).not.toBeInTheDocument()
    })

    expect(getByTestId('spotify-top-tracks-page-1')).toHaveAttribute('aria-hidden', 'false')
    expect(queryByTestId('spotify-top-tracks-page-2')).not.toBeInTheDocument()
  })

  it('resets to page 1 when track identities change', () => {
    const tracksV1 = buildTracks(13, 'a')
    const tracksV2 = buildTracks(13, 'b')

    const { getByLabelText, rerender } = render(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={tracksV1} />
      </TestProviderWithState>
    )

    fireEvent.click(getByLabelText('Go to page 2'))

    rerender(
      <TestProviderWithState>
        <TopTracks isLoading={false} tracks={tracksV2} />
      </TestProviderWithState>
    )

    expect(getByLabelText('Go to page 1')).toHaveAttribute('aria-current', 'page')
  })
})
