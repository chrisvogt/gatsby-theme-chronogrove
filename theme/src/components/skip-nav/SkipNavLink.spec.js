import React from 'react'
import { render, screen } from '@testing-library/react'

import SkipNavLink, { hexToRgb, COLORS } from './SkipNavLink'
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
})

describe('hexToRgb', () => {
  it('converts hex with hash to RGB', () => {
    expect(hexToRgb('#422EA3')).toBe('66, 46, 163')
  })

  it('converts hex without hash to RGB', () => {
    expect(hexToRgb('4a9eff')).toBe('74, 158, 255')
  })

  it('returns fallback for invalid hex', () => {
    expect(hexToRgb('invalid')).toBe('74, 158, 255')
  })

  it('returns fallback for empty string', () => {
    expect(hexToRgb('')).toBe('74, 158, 255')
  })
})

describe('COLORS', () => {
  it('exports light mode color', () => {
    expect(COLORS.light).toBe('#422EA3')
  })

  it('exports dark mode color', () => {
    expect(COLORS.dark).toBe('#4a9eff')
  })
})
