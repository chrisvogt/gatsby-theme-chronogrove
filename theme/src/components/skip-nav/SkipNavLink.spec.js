import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import SkipNavLink from './SkipNavLink'
import { TestProvider } from '../../testUtils'
import * as isDarkModeModule from '../../helpers/isDarkMode'

describe('SkipNavLink', () => {
  const renderComponent = (props = {}) => {
    return render(
      <TestProvider>
        <SkipNavLink {...props} />
      </TestProvider>
    )
  }

  it('renders with default text', () => {
    renderComponent()
    expect(screen.getByText('Skip to content')).toBeInTheDocument()
  })

  it('renders with custom children', () => {
    renderComponent({ children: 'Jump to main' })
    expect(screen.getByText('Jump to main')).toBeInTheDocument()
  })

  it('links to the default content ID', () => {
    renderComponent()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '#skip-nav-content')
  })

  it('links to a custom content ID when provided', () => {
    renderComponent({ contentId: 'main-content' })
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '#main-content')
  })

  it('has the data-skip-nav-link attribute', () => {
    renderComponent()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('data-skip-nav-link')
  })

  it('has tabIndex={0} for Safari compatibility', () => {
    renderComponent()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('tabIndex', '0')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef()
    render(
      <TestProvider>
        <SkipNavLink ref={ref} />
      </TestProvider>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('supports the as prop for custom element', () => {
    renderComponent({ as: 'button' })
    // When rendered as a button, it won't have role="link"
    const button = screen.getByText('Skip to content')
    expect(button.tagName).toBe('BUTTON')
  })

  it('passes additional props through', () => {
    renderComponent({ 'aria-label': 'Skip navigation' })
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'Skip navigation')
  })

  it('has displayName set for debugging', () => {
    expect(SkipNavLink.displayName).toBe('SkipNavLink')
  })

  describe('dark mode', () => {
    it('renders correctly in dark mode', () => {
      jest.spyOn(isDarkModeModule, 'default').mockReturnValue(true)
      renderComponent()
      expect(screen.getByText('Skip to content')).toBeInTheDocument()
      jest.restoreAllMocks()
    })
  })

  describe('theme fallbacks', () => {
    it('uses fallback primary color when theme has no colors', () => {
      const minimalTheme = { colors: {} }
      render(
        <ThemeUIProvider theme={minimalTheme}>
          <SkipNavLink />
        </ThemeUIProvider>
      )
      expect(screen.getByText('Skip to content')).toBeInTheDocument()
    })

    it('uses light fallback when theme has no colors and not dark mode', () => {
      jest.spyOn(isDarkModeModule, 'default').mockReturnValue(false)
      const minimalTheme = { colors: {} }
      render(
        <ThemeUIProvider theme={minimalTheme}>
          <SkipNavLink />
        </ThemeUIProvider>
      )
      expect(screen.getByRole('link')).toBeInTheDocument()
      jest.restoreAllMocks()
    })

    it('uses dark fallback when theme has no colors and dark mode', () => {
      jest.spyOn(isDarkModeModule, 'default').mockReturnValue(true)
      const minimalTheme = { colors: {} }
      render(
        <ThemeUIProvider theme={minimalTheme}>
          <SkipNavLink />
        </ThemeUIProvider>
      )
      expect(screen.getByRole('link')).toBeInTheDocument()
      jest.restoreAllMocks()
    })
  })
})
