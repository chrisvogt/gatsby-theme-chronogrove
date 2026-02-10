import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spotify, { buildEmbedURL } from './spotify'

describe('buildEmbedURL', () => {
  it('returns embed URL for track share URL', () => {
    expect(buildEmbedURL('https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp')).toBe(
      'https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp'
    )
  })

  it('returns embed URL for album, playlist, artist, show, episode', () => {
    expect(buildEmbedURL('https://open.spotify.com/album/abc')).toBe('https://open.spotify.com/embed/album/abc')
    expect(buildEmbedURL('https://open.spotify.com/playlist/xyz')).toBe('https://open.spotify.com/embed/playlist/xyz')
    expect(buildEmbedURL('https://open.spotify.com/artist/123')).toBe('https://open.spotify.com/embed/artist/123')
    expect(buildEmbedURL('https://open.spotify.com/show/def')).toBe('https://open.spotify.com/embed/show/def')
    expect(buildEmbedURL('https://open.spotify.com/episode/ghi')).toBe('https://open.spotify.com/embed/episode/ghi')
  })

  it('returns null for invalid or unsupported URLs', () => {
    expect(buildEmbedURL('https://open.spotify.com/other/abc')).toBeNull()
    expect(buildEmbedURL('https://example.com/track/123')).toBeNull()
    expect(buildEmbedURL('')).toBeNull()
    expect(buildEmbedURL(null)).toBeNull()
    expect(buildEmbedURL(undefined)).toBeNull()
  })

  it('trims whitespace from URL', () => {
    expect(buildEmbedURL('  https://open.spotify.com/track/123  ')).toBe('https://open.spotify.com/embed/track/123')
  })
})

describe('Spotify', () => {
  it('renders iframe with correct embed URL for track', () => {
    const { container } = render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://open.spotify.com/embed/track/123')
    expect(iframe).toHaveAttribute('title', 'Spotify Embed')
  })

  it('renders iframe with allow attribute for playback', () => {
    const { container } = render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute(
      'allow',
      'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
    )
  })

  it('returns null when no spotifyURL is provided', () => {
    const { container } = render(<Spotify />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null for invalid spotifyURL', () => {
    const { container } = render(<Spotify spotifyURL='https://example.com/not-spotify' />)
    expect(container.firstChild).toBeNull()
  })

  it('matches snapshot when valid URL is provided', () => {
    const { asFragment } = render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)
    expect(asFragment()).toMatchSnapshot()
  })
})
