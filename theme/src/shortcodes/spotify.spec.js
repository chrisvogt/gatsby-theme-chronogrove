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

  it('does not render when no spotifyURL is provided', () => {
    const { container } = render(<Spotify />)
    expect(container.firstChild).toBeNull()
  })
})
