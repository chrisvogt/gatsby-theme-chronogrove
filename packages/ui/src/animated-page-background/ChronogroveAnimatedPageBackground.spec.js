/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { ThemeUIProvider, useColorMode, useThemeUI } from 'theme-ui'

import * as colorUtils from '../color-utils.js'

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: jest.fn(),
  useThemeUI: jest.fn()
}))

import chronogroveTheme from '../theme.js'
import ChronogroveAnimatedPageBackground from './ChronogroveAnimatedPageBackground.js'

jest.mock('./ColorBends.js', () => {
  return function MockColorBends() {
    return <div data-testid='mock-color-bends' />
  }
})

const realHexToRgba = jest.requireActual('../color-utils.js').hexToRgba

function setScrollY(y) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y, writable: true })
}

describe('ChronogroveAnimatedPageBackground', () => {
  let hexToRgbaSpy

  beforeEach(() => {
    window.localStorage.removeItem('theme-ui-color-mode')
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000
    })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
    setScrollY(0)
    hexToRgbaSpy = jest.spyOn(colorUtils, 'hexToRgba').mockImplementation((hex, alpha) => realHexToRgba(hex, alpha))
    useColorMode.mockReturnValue(['default'])
    useThemeUI.mockReturnValue({ theme: chronogroveTheme })
  })

  afterEach(() => {
    hexToRgbaSpy.mockRestore()
  })

  function renderBackground(ui, theme = chronogroveTheme) {
    useThemeUI.mockReturnValue({ theme })
    return render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)
  }

  it('renders fixed backdrop and overlay layers', async () => {
    const { container, rerender } = renderBackground(<ChronogroveAnimatedPageBackground />)

    await waitFor(() => {
      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
    })

    rerender(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ChronogroveAnimatedPageBackground
          overlayHeight='200px'
          darkOpacity={0.2}
          fadeDistance={500}
          maxParallaxOffset={80}
        />
      </ThemeUIProvider>
    )

    await waitFor(() => {
      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
    })
  })

  it('shows ColorBends in dark mode', async () => {
    useColorMode.mockReturnValue(['dark'])
    const { getByTestId } = renderBackground(<ChronogroveAnimatedPageBackground />)

    await waitFor(() => {
      expect(getByTestId('mock-color-bends')).toBeInTheDocument()
    })
  })

  it('uses dark fallback hex when gradient resolves a CSS var in dark mode', async () => {
    useColorMode.mockReturnValue(['dark'])
    const varTheme = {
      rawColors: { background: 'var(--page-bg)' },
      colors: { background: '#ffffff' }
    }
    renderBackground(<ChronogroveAnimatedPageBackground />, varTheme)

    await waitFor(() => {
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#14141F', 0.6)
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#14141F', 0.2)
    })
  })

  it('uses light fallback hex when gradient resolves a CSS var in light mode', async () => {
    useColorMode.mockReturnValue(['default'])
    const varTheme = {
      rawColors: { background: 'var(--page-bg)' },
      colors: { background: '#ffffff' }
    }
    renderBackground(<ChronogroveAnimatedPageBackground />, varTheme)

    await waitFor(() => {
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#fdf8f5', 0.6)
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#fdf8f5', 0.2)
    })
  })

  it('falls back to surface hex when theme omits background tokens', async () => {
    useColorMode.mockReturnValue(['dark'])
    renderBackground(<ChronogroveAnimatedPageBackground />, {})

    await waitFor(() => {
      expect(hexToRgbaSpy).toHaveBeenCalled()
    })
  })

  it('prefers colors.background when rawColors are absent', async () => {
    useColorMode.mockReturnValue(['default'])
    renderBackground(<ChronogroveAnimatedPageBackground />, {
      colors: { background: '#aabbcc' }
    })

    await waitFor(() => {
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#aabbcc', 0.6)
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#aabbcc', 0.2)
    })
  })

  it('prefers rawColors.background over colors.background', async () => {
    useColorMode.mockReturnValue(['default'])
    renderBackground(<ChronogroveAnimatedPageBackground />, {
      rawColors: { background: '#112233' },
      colors: { background: '#eeeeee' }
    })

    await waitFor(() => {
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#112233', 0.6)
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#112233', 0.2)
    })
  })

  it('falls through to colors.background when raw background is null', async () => {
    useColorMode.mockReturnValue(['default'])
    renderBackground(<ChronogroveAnimatedPageBackground />, {
      rawColors: { background: null },
      colors: { background: '#ccddee' }
    })

    await waitFor(() => {
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#ccddee', 0.6)
      expect(hexToRgbaSpy).toHaveBeenCalledWith('#ccddee', 0.2)
    })
  })

  it('uses built-in fallbacks when theme is undefined', async () => {
    useColorMode.mockReturnValue(['default'])
    useThemeUI.mockReturnValue({ theme: undefined })
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ChronogroveAnimatedPageBackground />
      </ThemeUIProvider>
    )

    await waitFor(() => {
      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
      expect(hexToRgbaSpy).toHaveBeenCalled()
    })
  })

  it('updates overlay on scroll', async () => {
    const { container } = renderBackground(<ChronogroveAnimatedPageBackground fadeDistance={100} />)

    await waitFor(() => {
      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
    })

    setScrollY(50)
    fireEvent.scroll(window)
  })
})
