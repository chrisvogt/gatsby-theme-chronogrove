import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import SoundCloud from './soundcloud'

// Mock theme object
const mockTheme = {
  colors: {
    background: '#fdf8f5',
    modes: {
      dark: {
        background: '#1e1e2f'
      }
    }
  }
}

// Helper function to render with theme
const renderWithTheme = (ui, colorMode = 'default') => {
  return render(<ThemeUIProvider theme={{ ...mockTheme, initialColorMode: colorMode }}>{ui}</ThemeUIProvider>)
}

// Mock the useColorMode hook
jest.mock('theme-ui', () => {
  const original = jest.requireActual('theme-ui')
  return {
    ...original,
    useColorMode: jest.fn().mockReturnValue(['default', () => {}])
  }
})

describe('SoundCloud Shortcode', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  it('matches the snapshot in light mode', () => {
    const { asFragment } = renderWithTheme(<SoundCloud soundcloudId='880888540' />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the snapshot in dark mode', () => {
    require('theme-ui').useColorMode.mockReturnValue(['dark', () => {}])
    const { asFragment } = renderWithTheme(<SoundCloud soundcloudId='880888540' />, 'dark')
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders a default title if one is not provided', () => {
    const { container } = renderWithTheme(<SoundCloud soundcloudId='880888540' />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute('title', 'Song on SoundCloud')
  })

  it('includes the correct accent color in light mode', () => {
    require('theme-ui').useColorMode.mockReturnValue(['default', () => {}])
    const { container } = renderWithTheme(<SoundCloud soundcloudId='880888540' />)
    const iframe = container.querySelector('iframe')
    expect(iframe.src).toContain('color=%23ff5500') // orange for light mode
  })

  it('includes the correct accent color in dark mode', () => {
    require('theme-ui').useColorMode.mockReturnValue(['dark', () => {}])
    const { container } = renderWithTheme(<SoundCloud soundcloudId='880888540' />, 'dark')
    const iframe = container.querySelector('iframe')
    expect(iframe.src).toContain('color=%23800080') // purple for dark mode
  })

  it('includes the correct track ID in the URL', () => {
    const { container } = renderWithTheme(<SoundCloud soundcloudId='880888540' />)
    const iframe = container.querySelector('iframe')
    expect(iframe.src).toContain('tracks/880888540')
  })
})
