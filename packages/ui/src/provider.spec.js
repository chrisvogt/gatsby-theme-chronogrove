/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChronogroveThemeProvider } from './provider'

const baseTheme = {
  config: {},
  fonts: { body: 'system-ui' },
  colors: { text: '#111', background: '#fff' },
  global: {}
}

describe('ChronogroveThemeProvider', () => {
  it('renders children', () => {
    render(
      <ChronogroveThemeProvider theme={baseTheme}>
        <span>hello</span>
      </ChronogroveThemeProvider>
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})
