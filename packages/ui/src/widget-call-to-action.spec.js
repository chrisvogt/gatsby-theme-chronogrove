import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import WidgetCallToAction, { WidgetCtaLoadingIndicator } from './widget-call-to-action.js'

const LinkMock = ({ to, href, children, ...rest }) => (
  <a href={href ?? to} data-testid='router-link' {...rest}>
    {children}
  </a>
)

const theme = { links: { widgetCta: { color: 'text' } } }

const wrap = ui => render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)

describe('WidgetCtaLoadingIndicator', () => {
  it('renders svg', () => {
    const { container } = wrap(<WidgetCtaLoadingIndicator />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})

describe('WidgetCallToAction', () => {
  it('renders external link with url', () => {
    wrap(
      <WidgetCallToAction title='t' url='https://example.com'>
        Go
      </WidgetCallToAction>
    )
    const a = screen.getByRole('link')
    expect(a).toHaveAttribute('href', 'https://example.com')
  })

  it('prefers href over url', () => {
    wrap(
      <WidgetCallToAction href='https://a.test' url='https://b.test'>
        Go
      </WidgetCallToAction>
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://a.test')
  })

  it('uses linkComponent with to (Gatsby-style)', () => {
    wrap(
      <WidgetCallToAction linkComponent={LinkMock} to='/blog'>
        Posts
      </WidgetCallToAction>
    )
    expect(screen.getByTestId('router-link')).toHaveAttribute('href', '/blog')
  })

  it('uses linkComponent with href (Next.js-style)', () => {
    wrap(
      <WidgetCallToAction linkComponent={LinkMock} href='/dashboard'>
        Dash
      </WidgetCallToAction>
    )
    expect(screen.getByTestId('router-link')).toHaveAttribute('href', '/dashboard')
  })

  it('uses linkComponent with to when href is empty', () => {
    wrap(
      <WidgetCallToAction linkComponent={LinkMock} href='' to='/blog'>
        Posts
      </WidgetCallToAction>
    )
    expect(screen.getByTestId('router-link')).toHaveAttribute('href', '/blog')
  })

  it('ignores linkComponent for external url when no href or to', () => {
    wrap(
      <WidgetCallToAction linkComponent={LinkMock} url='https://example.com/out'>
        Out
      </WidgetCallToAction>
    )
    expect(screen.queryByTestId('router-link')).not.toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/out')
  })

  it('uses plain anchor when to without linkComponent', () => {
    wrap(
      <WidgetCallToAction to='/path' linkComponent={undefined}>
        P
      </WidgetCallToAction>
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/path')
  })

  it('shows loading indicator', () => {
    const { container } = wrap(
      <WidgetCallToAction isLoading title='t'>
        X
      </WidgetCallToAction>
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('uses custom loadingSlot', () => {
    wrap(
      <WidgetCallToAction isLoading loadingSlot={<span data-testid='ld'>wait</span>}>
        X
      </WidgetCallToAction>
    )
    expect(screen.getByTestId('ld')).toBeInTheDocument()
  })

  it('merges sx', () => {
    wrap(
      <WidgetCallToAction href='https://x.test' sx={{ m: 2 }}>
        L
      </WidgetCallToAction>
    )
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
