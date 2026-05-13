import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChronogroveThemeProvider } from './provider.js'
import chronogroveTheme from './theme.js'

import { ChronogrovePageShell } from './page-shell-layout.js'

function shellRender(ui) {
  return render(<ChronogroveThemeProvider theme={chronogroveTheme}>{ui}</ChronogroveThemeProvider>)
}

describe('ChronogrovePageShell', () => {
  it('renders skip link, header, main with skip target, children, and footer', () => {
    shellRender(
      <ChronogrovePageShell header={<span>hdr</span>} footer={<span>ftr</span>} paddingBottom='12px'>
        <span>inner</span>
      </ChronogrovePageShell>
    )
    expect(screen.getByText('inner')).toBeInTheDocument()
    expect(screen.getByText('hdr')).toBeInTheDocument()
    expect(screen.getByText('ftr')).toBeInTheDocument()
    expect(document.querySelector('main')).toBeTruthy()
  })

  it('omits header when hideHeader', () => {
    shellRender(
      <ChronogrovePageShell hideHeader header={<span>no</span>} footer={null}>
        <span>x</span>
      </ChronogrovePageShell>
    )
    expect(screen.queryByText('no')).not.toBeInTheDocument()
  })

  it('omits footer when hideFooter', () => {
    shellRender(
      <ChronogrovePageShell hideFooter footer={<span>no</span>}>
        <span>x</span>
      </ChronogrovePageShell>
    )
    expect(screen.queryByText('no')).not.toBeInTheDocument()
  })

  it('renders children without main wrapper when disableMainWrapper', () => {
    shellRender(
      <ChronogrovePageShell disableMainWrapper>
        <span data-testid='bare'>bare</span>
      </ChronogrovePageShell>
    )
    expect(screen.getByTestId('bare')).toBeInTheDocument()
    expect(document.querySelector('main')).toBeFalsy()
  })

  it('uses transparent background when requested', () => {
    const { container } = shellRender(
      <ChronogrovePageShell transparentBackground>
        <span>t</span>
      </ChronogrovePageShell>
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('does not render a banner when header is null', () => {
    shellRender(
      <ChronogrovePageShell header={null}>
        <span>no-banner</span>
      </ChronogrovePageShell>
    )
    expect(screen.getByText('no-banner')).toBeInTheDocument()
    expect(document.querySelector('header[role="banner"]')).toBeFalsy()
  })
})
