import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CallToAction from './call-to-action'

describe('CallToAction', () => {
  const title = 'Example Widget Title'

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
      expect(link).not.toHaveAttribute('onClick')
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
})
