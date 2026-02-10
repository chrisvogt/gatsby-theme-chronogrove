import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CallToAction from './call-to-action'
import { trackEvent, trackExternalLink, trackNavigation } from '../../utils/analytics'

jest.mock('../../utils/analytics', () => ({
  trackEvent: jest.fn(),
  trackExternalLink: jest.fn(),
  trackNavigation: jest.fn()
}))

describe('CallToAction', () => {
  const title = 'Example Widget Title'

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock Gatsby's navigate function for Link component
    global.___navigate = jest.fn()
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <CallToAction title={title} isLoading={false}>
        Test
      </CallToAction>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  describe('loading indicator', () => {
    it("doesn't render a loading indicator by default", () => {
      const { container } = render(<CallToAction title={title}>Test</CallToAction>)
      // Bars loader has a specific SVG pattern
      const loader =
        container.querySelector('svg[data-testid="bars-loading"]') || container.querySelector('.bars-loading')
      expect(loader).not.toBeInTheDocument()
    })

    it('renders a loading indicator', () => {
      const { container } = render(
        <CallToAction title={title} isLoading>
          Test
        </CallToAction>
      )
      // Check for SVG loader - Bars from svg-loaders-react renders an SVG
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('hyperlink vs Gatsby Router links', () => {
    it('renders a hyperlink by default', () => {
      const href = 'https://fake-link.com/my-profile'
      render(
        <CallToAction title='My Profile' url={href}>
          Visit profile
        </CallToAction>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', href)
    })

    it('renders a Gatsby Router link', () => {
      const route = '/about-me'
      render(
        <CallToAction title={title} to={route}>
          Learn more about me
        </CallToAction>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', route)
    })
  })

  describe('analytics tracking', () => {
    it('tracks external link click', () => {
      const href = 'https://fake-link.com/my-profile'
      render(
        <CallToAction title='My Profile' url={href} widgetName='test'>
          Visit profile
        </CallToAction>
      )
      const link = screen.getByRole('link')
      fireEvent.click(link)

      expect(trackExternalLink).toHaveBeenCalledWith(href, 'My Profile')
      expect(trackEvent).toHaveBeenCalledWith('cta_click', {
        category: 'Widget',
        label: 'test',
        customParams: {
          widget_name: 'test',
          cta_text: 'Visit profile',
          destination: href,
          link_type: 'external'
        }
      })
    })

    it('tracks internal navigation click', () => {
      const route = '/about-me'
      render(
        <CallToAction title={title} to={route} widgetName='posts'>
          Learn more
        </CallToAction>
      )
      const link = screen.getByRole('link')
      fireEvent.click(link)

      expect(trackNavigation).toHaveBeenCalledWith(route, 'posts_widget_cta')
      expect(trackEvent).toHaveBeenCalledWith('cta_click', {
        category: 'Widget',
        label: 'posts',
        customParams: {
          widget_name: 'posts',
          cta_text: 'Learn more',
          destination: route,
          link_type: 'internal'
        }
      })
    })

    it('tracks click without widgetName', () => {
      const href = 'https://example.com'
      render(
        <CallToAction title='Test' url={href}>
          Click me
        </CallToAction>
      )
      const link = screen.getByRole('link')
      fireEvent.click(link)

      expect(trackEvent).toHaveBeenCalledWith('cta_click', {
        category: 'Widget',
        label: 'unknown',
        customParams: {
          widget_name: undefined,
          cta_text: 'Click me',
          destination: href,
          link_type: 'external'
        }
      })
    })
  })
})
