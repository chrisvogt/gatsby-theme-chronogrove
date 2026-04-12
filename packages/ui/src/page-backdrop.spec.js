/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import chronogroveTheme from './theme.js'
import { ChronogrovePageBackdrop } from './page-backdrop.js'

describe('ChronogrovePageBackdrop', () => {
  beforeEach(() => {
    window.localStorage.removeItem('theme-ui-color-mode')
  })

  it('renders a fixed backdrop layer', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ChronogrovePageBackdrop />
      </ThemeUIProvider>
    )
    const layer = container.querySelector('[aria-hidden="true"]')
    expect(layer).toBeTruthy()
  })

  it('adds gradient overlays in dark mode', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'dark')
    const { container } = render(
      <ThemeUIProvider
        theme={{
          ...chronogroveTheme,
          config: { useLocalStorage: true, useColorSchemeMediaQuery: false }
        }}
      >
        <ChronogrovePageBackdrop />
      </ThemeUIProvider>
    )
    const layer = container.querySelector('[aria-hidden="true"]')
    expect(window.getComputedStyle(layer).backgroundImage).toMatch(/radial-gradient/)
  })
})
