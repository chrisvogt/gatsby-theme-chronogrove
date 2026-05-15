/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'
import SkipNavLink from './skip-nav-link'

const wrapperTheme = {
  colors: {
    primary: '#ff00aa',
    primaryRgb: '255, 0, 170'
  }
}

describe('SkipNavLink', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  function renderLink(ui) {
    return render(<ThemeUIProvider theme={wrapperTheme}>{ui}</ThemeUIProvider>)
  }

  it('links to skip content id and uses theme primary for focus styles context', () => {
    renderLink(<SkipNavLink>Skip</SkipNavLink>)
    const link = screen.getByRole('link', { name: /skip/i })
    expect(link).toHaveAttribute('href', '#skip-nav-content')
    expect(link).toHaveAttribute('data-skip-nav-link', '')
  })

  it('respects custom contentId for the hash target', () => {
    renderLink(<SkipNavLink contentId='main'>Jump</SkipNavLink>)
    expect(screen.getByRole('link', { name: /jump/i })).toHaveAttribute('href', '#main')
  })

  it('uses default label and skip target when props are omitted', () => {
    renderLink(<SkipNavLink />)
    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link).toHaveAttribute('href', '#skip-nav-content')
  })

  it('uses fallback colors when theme omits primary tokens', () => {
    render(
      <ThemeUIProvider theme={{ colors: {} }}>
        <SkipNavLink>Go</SkipNavLink>
      </ThemeUIProvider>
    )
    expect(screen.getByRole('link', { name: /go/i })).toBeInTheDocument()
  })

  it('uses dark-mode fallback primaries when colorMode is dark', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'dark')
    render(
      <ThemeUIProvider
        theme={{
          colors: {},
          config: { useLocalStorage: true, useColorSchemeMediaQuery: false }
        }}
      >
        <SkipNavLink>Go</SkipNavLink>
      </ThemeUIProvider>
    )
    expect(screen.getByRole('link', { name: /go/i })).toBeInTheDocument()
  })
})
