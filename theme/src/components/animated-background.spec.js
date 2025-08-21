import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
let AnimatedBackground
let hexToRgba

// Mock theme-ui hooks to avoid real context requirements
const actualThemeUI = jest.requireActual('theme-ui')
jest.mock('theme-ui', () => {
  const actual = jest.requireActual('theme-ui')
  return {
    ...actual,
    useColorMode: jest.fn(() => ['light']),
    useThemeUI: jest.fn(() => ({ theme: {} }))
  }
})

const { useColorMode, useThemeUI } = require('theme-ui')

const darkTheme = {
  colors: { background: '#1e1e2f', primary: '#422EA3', secondary: '#711E9B', accent: '#FF7AB6' },
  rawColors: { background: '#1e1e2f' }
}

const lightTheme = {
  colors: { background: '#fdf8f5', primary: '#422EA3', secondary: '#711E9B', accent: '#FF7AB6' },
  rawColors: { background: '#fdf8f5' }
}

const renderWithTheme = ui => render(ui)

describe('AnimatedBackground (CSS blobs)', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('renders three gradient blobs and a blurred veil in dark mode', () => {
    useColorMode.mockReturnValue(['dark'])
    useThemeUI.mockReturnValue({ theme: actualThemeUI.merge(darkTheme, {}) })
    jest.isolateModules(() => {
      const mod = require('./animated-background')
      AnimatedBackground = mod.default
    })
    const { container } = renderWithTheme(<AnimatedBackground />)

    const blobs = container.querySelectorAll('.abg-blob')
    expect(blobs).toHaveLength(3)

    const veil = container.querySelector('[data-testid="abg-veil"]')
    expect(veil).toBeInTheDocument()
    expect(veil.style.backdropFilter).toContain('blur(80px)')

    // Background veil color is derived from theme background with alpha
    expect(veil.style.backgroundColor).toBe('rgba(30, 30, 47, 0.28)')
  })

  it('renders with light mode palette and veil', () => {
    useColorMode.mockReturnValue(['light'])
    useThemeUI.mockReturnValue({ theme: actualThemeUI.merge(lightTheme, {}) })
    jest.isolateModules(() => {
      const mod = require('./animated-background')
      AnimatedBackground = mod.default
    })
    const { container } = renderWithTheme(<AnimatedBackground />)

    const blobs = container.querySelectorAll('.abg-blob')
    expect(blobs).toHaveLength(3)

    const veil = container.querySelector('[data-testid="abg-veil"]')
    expect(veil).toBeInTheDocument()
    expect(veil.style.backgroundColor).toBe('rgba(253, 248, 245, 0.2)')
  })

  it('hexToRgba converts hex and applies default alpha', () => {
    jest.isolateModules(() => {
      const mod = require('./animated-background')
      hexToRgba = mod.hexToRgba
    })
    expect(hexToRgba('#ff0000')).toBe('rgba(255, 0, 0, 1)')
  })

  it('hexToRgba guards invalid inputs with fallback', () => {
    jest.isolateModules(() => {
      const mod = require('./animated-background')
      hexToRgba = mod.hexToRgba
    })
    expect(hexToRgba('not-a-hex', 0.5)).toBe('rgba(30, 30, 47, 0.5)')
  })
})
