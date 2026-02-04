import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spotify from './spotify'

// Mock fetch globally
global.fetch = jest.fn()

describe('Spotify', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders loading state initially', () => {
    // Don't wait for fetch to complete - just check initial render
    fetch.mockImplementation(() => new Promise(() => {})) // Never resolves
    const { asFragment } = render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders error state when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)

    // Wait for the error state to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load Spotify embed/i)).toBeInTheDocument()
    })
  })

  it('renders error state when HTTP response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)

    // Wait for the error state to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load Spotify embed/i)).toBeInTheDocument()
    })
  })

  it('renders embed when fetch succeeds', async () => {
    const mockResponse = {
      html: '<iframe src="https://open.spotify.com/embed/track/123" title="Spotify Embed"></iframe>'
    }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const { container } = render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)

    // Wait for the iframe to appear in the HTML
    await waitFor(() => {
      expect(container.innerHTML).toContain('iframe')
    })
  })

  it('removes deprecated allowfullscreen attribute from embed HTML', async () => {
    const mockResponse = {
      html: '<iframe src="https://open.spotify.com/embed/track/123" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>'
    }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const { container } = render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)

    await waitFor(() => {
      expect(container.innerHTML).toContain('iframe')
    })

    // Verify allowfullscreen attribute was removed
    expect(container.innerHTML).not.toContain('allowfullscreen')
    // Verify the allow attribute is still present
    expect(container.innerHTML).toContain('allow=')
  })

  it('handles case-insensitive allowFullScreen attribute removal', async () => {
    const mockResponse = {
      html: '<iframe src="https://open.spotify.com/embed/track/123" allowFullScreen allow="fullscreen"></iframe>'
    }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const { container } = render(<Spotify spotifyURL='https://open.spotify.com/track/123' />)

    await waitFor(() => {
      expect(container.innerHTML).toContain('iframe')
    })

    // Verify allowFullScreen (camelCase) was also removed
    expect(container.innerHTML.toLowerCase()).not.toContain('allowfullscreen')
  })

  it('does not render when no spotifyURL is provided', () => {
    const { container } = render(<Spotify />)
    expect(container.firstChild).toBeNull()
  })
})
