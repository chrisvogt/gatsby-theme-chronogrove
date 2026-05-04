import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChronogroveThemeProvider } from './provider.js'
import chronogroveTheme from './theme.js'

import {
  HomeDashboardGrid,
  homeDashboardAsideSx,
  homeDashboardGridColumns,
  homeDashboardGridGap,
  homeDashboardMainInnerMaxWidthSx,
  homeDashboardMainShellSx,
  homeDashboardPageOuterSx
} from './home-dashboard-layout.js'

describe('home dashboard layout tokens', () => {
  it('exports grid columns and gap used by the Gatsby home template', () => {
    expect(homeDashboardGridColumns[2]).toContain('minmax(200px')
    expect(homeDashboardGridGap).toEqual([null, 4])
    expect(homeDashboardAsideSx).toEqual({ mb: [4, null] })
    expect(homeDashboardMainShellSx.borderTopRightRadius).toBe('3em')
    expect(homeDashboardMainInnerMaxWidthSx.maxWidth).toBe('1200px')
    expect(homeDashboardPageOuterSx.minHeight).toBe('500px')
  })
})

describe('HomeDashboardGrid', () => {
  it('renders aside and main slots', () => {
    render(
      <ChronogroveThemeProvider theme={chronogroveTheme}>
        <HomeDashboardGrid aside={<span>nav</span>} main={<div data-testid='main'>content</div>} />
      </ChronogroveThemeProvider>
    )
    expect(screen.getByText('nav')).toBeInTheDocument()
    expect(screen.getByTestId('main')).toHaveTextContent('content')
  })

  it('merges asideSx onto the aside', () => {
    const { container } = render(
      <ChronogroveThemeProvider theme={chronogroveTheme}>
        <HomeDashboardGrid aside={<span>a</span>} main={<span>b</span>} asideSx={{ position: 'sticky' }} />
      </ChronogroveThemeProvider>
    )
    const aside = container.querySelector('aside')
    expect(aside).toBeTruthy()
  })

  it('forwards gridProps to Grid', () => {
    const { container } = render(
      <ChronogroveThemeProvider theme={chronogroveTheme}>
        <HomeDashboardGrid
          aside={<span>l</span>}
          main={<span>r</span>}
          gridProps={{ 'data-testid': 'hdg', id: 'home-dash-grid' }}
        />
      </ChronogroveThemeProvider>
    )
    expect(container.querySelector('#home-dash-grid')).toBeTruthy()
  })
})
