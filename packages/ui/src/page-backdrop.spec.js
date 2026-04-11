/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import chronogroveTheme from './theme.js'
import { ChronogrovePageBackdrop } from './page-backdrop.js'

describe('ChronogrovePageBackdrop', () => {
  it('renders a fixed backdrop layer', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ChronogrovePageBackdrop />
      </ThemeUIProvider>
    )
    const layer = container.querySelector('[aria-hidden="true"]')
    expect(layer).toBeTruthy()
  })
})
