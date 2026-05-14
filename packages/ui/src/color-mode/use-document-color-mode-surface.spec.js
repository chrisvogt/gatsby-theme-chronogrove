/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, act } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import { resolveChronogroveSurfaceColors } from './resolve-theme-colors.js'
import { applyDocumentColorModeSurface, useDocumentColorModeSurface } from './use-document-color-mode-surface.js'

function SurfaceHarness() {
  useDocumentColorModeSurface()
  return null
}

const baseTheme = {
  config: { useLocalStorage: true, useColorSchemeMediaQuery: false },
  colors: {
    background: '#fdf8f5',
    modes: {
      dark: { background: '#14141F' }
    }
  }
}

function expectHtmlDatasetThemeUiColorMode(mode) {
  expect(document.documentElement.dataset.themeUiColorMode).toBe(mode)
}

describe('useDocumentColorModeSurface', () => {
  beforeEach(() => {
    document.documentElement.className = 'theme-ui-stale'
    delete document.documentElement.dataset.themeUiColorMode
    document.documentElement.style.backgroundColor = ''
    window.localStorage.removeItem('theme-ui-color-mode')
  })

  it('syncs documentElement class, data attribute, and background from resolved theme', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'default')

    act(() => {
      render(
        <ThemeUIProvider theme={baseTheme}>
          <SurfaceHarness />
        </ThemeUIProvider>
      )
    })

    expect(document.documentElement.classList.contains('theme-ui-stale')).toBe(false)
    expect(document.documentElement.classList.contains('theme-ui-default')).toBe(true)
    expectHtmlDatasetThemeUiColorMode('default')
    expect(document.documentElement.style.backgroundColor).toBeTruthy()
  })

  it('maps light color mode to theme-ui-default', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'light')

    act(() => {
      render(
        <ThemeUIProvider theme={baseTheme}>
          <SurfaceHarness />
        </ThemeUIProvider>
      )
    })

    expect(document.documentElement.classList.contains('theme-ui-default')).toBe(true)
    expectHtmlDatasetThemeUiColorMode('default')
  })

  it('applies dark surface when color mode is dark', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'dark')

    act(() => {
      render(
        <ThemeUIProvider theme={baseTheme}>
          <SurfaceHarness />
        </ThemeUIProvider>
      )
    })

    expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
    expectHtmlDatasetThemeUiColorMode('dark')
  })

  it('prefers rawColors.background when set', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'default')
    const theme = {
      config: { useLocalStorage: true, useColorSchemeMediaQuery: false },
      rawColors: { background: '#abcdef' },
      colors: {
        modes: {
          dark: { background: '#14141F' }
        }
      }
    }

    act(() => {
      render(
        <ThemeUIProvider theme={theme}>
          <SurfaceHarness />
        </ThemeUIProvider>
      )
    })

    expect(document.documentElement.style.backgroundColor).toBe('rgb(171, 205, 239)')
  })

  it('normalizes light and missing color modes when applying to the document', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'default')
    document.documentElement.className = ''
    act(() => {
      applyDocumentColorModeSurface('light', baseTheme, resolveChronogroveSurfaceColors(baseTheme))
    })
    expectHtmlDatasetThemeUiColorMode('default')

    delete document.documentElement.dataset.themeUiColorMode
    act(() => {
      applyDocumentColorModeSurface(undefined, baseTheme, resolveChronogroveSurfaceColors(baseTheme))
    })
    expectHtmlDatasetThemeUiColorMode('default')
  })

  it('prefers rawColors.background over colors.background', () => {
    act(() => {
      applyDocumentColorModeSurface(
        'default',
        { rawColors: { background: '#112233' }, colors: { background: '#eeeeee' } },
        resolveChronogroveSurfaceColors({})
      )
    })
    expect(document.documentElement.style.backgroundColor).toBe('rgb(17, 34, 51)')
  })

  it('uses colors.background when raw background is absent', () => {
    act(() => {
      applyDocumentColorModeSurface(
        'default',
        { colors: { background: '#00ff00' } },
        resolveChronogroveSurfaceColors({})
      )
    })
    expect(document.documentElement.style.backgroundColor).toBe('rgb(0, 255, 0)')
  })

  it('uses surface fallbacks when theme omits background colors', () => {
    const surface = resolveChronogroveSurfaceColors(null)
    act(() => {
      applyDocumentColorModeSurface('default', null, surface)
    })
    expect(document.documentElement.style.backgroundColor).toBe('rgb(253, 248, 245)')

    act(() => {
      applyDocumentColorModeSurface('dark', null, surface)
    })
    expect(document.documentElement.style.backgroundColor).toBe('rgb(20, 20, 31)')
  })
})
