/** @jsx jsx */
import { jsx } from 'theme-ui'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeUIProvider } from 'theme-ui'

import ActionButton from './action-button'
import { BUTTON_PRIMARY_COLORS } from '../utils/colors'

// Mock useThemeUI for fallback tests - mutable mock like root-wrapper.spec.js
const mockUseThemeUI = jest.fn(() => ({
  colorMode: 'default',
  theme: {
    colors: {
      primary: BUTTON_PRIMARY_COLORS.light,
      primaryRgb: '66, 46, 163'
    }
  }
}))

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useThemeUI: () => mockUseThemeUI()
}))

// Mock theme (primary/primaryRgb so components use theme colors)
const mockTheme = {
  colors: {
    primary: BUTTON_PRIMARY_COLORS.light,
    primaryRgb: '66, 46, 163',
    modes: {
      dark: {
        text: '#ffffff',
        background: '#000000'
      }
    }
  }
}

// Mock store
const mockStore = configureStore({
  reducer: {
    theme: (state = { colorMode: 'light' }) => state
  }
})

const renderWithProviders = (component, customTheme = null) => {
  const themeToUse = customTheme ?? mockTheme
  return render(
    <Provider store={mockStore}>
      <ThemeUIProvider theme={themeToUse}>{component}</ThemeUIProvider>
    </Provider>
  )
}

describe('ActionButton', () => {
  it('renders as a button by default', () => {
    renderWithProviders(<ActionButton>Test Button</ActionButton>)

    const button = screen.getByRole('button', { name: /test button/i })
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders as a link when href is provided', () => {
    renderWithProviders(<ActionButton href='/test'>Test Link</ActionButton>)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    renderWithProviders(<ActionButton onClick={handleClick}>Click Me</ActionButton>)

    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant styles by default', () => {
    renderWithProviders(<ActionButton>Primary Button</ActionButton>)

    const button = screen.getByRole('button', { name: /primary button/i })
    expect(button).toHaveStyle({ fontWeight: 'medium' })
    // Primary uses theme color (may be hex or CSS var in Theme UI)
    expect(button).toBeInTheDocument()
  })

  it('applies secondary variant styles', () => {
    renderWithProviders(<ActionButton variant='secondary'>Secondary Button</ActionButton>)

    const button = screen.getByRole('button', { name: /secondary button/i })
    expect(button).toHaveStyle({
      color: '#666'
    })
  })

  it('applies small size styles', () => {
    renderWithProviders(<ActionButton size='small'>Small Button</ActionButton>)

    const button = screen.getByRole('button', { name: /small button/i })
    expect(button).toHaveStyle({
      fontSize: '11px',
      padding: '6px 10px'
    })
  })

  it('applies large size styles', () => {
    renderWithProviders(<ActionButton size='large'>Large Button</ActionButton>)

    const button = screen.getByRole('button', { name: /large button/i })
    expect(button).toHaveStyle({
      fontSize: '13px',
      padding: '10px 16px'
    })
  })

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid='test-icon'>→</span>
    renderWithProviders(<ActionButton icon={<TestIcon />}>Button with Icon</ActionButton>)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /button with icon/i })).toBeInTheDocument()
  })

  it('passes through additional props', () => {
    renderWithProviders(
      <ActionButton data-testid='custom-button' aria-label='Custom label'>
        Custom Button
      </ActionButton>
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('has proper accessibility attributes', () => {
    renderWithProviders(<ActionButton>Accessible Button</ActionButton>)

    const button = screen.getByRole('button', { name: /accessible button/i })
    expect(button).toHaveAttribute('type', 'button')
  })

  it('falls back to primary variant when invalid variant is provided', () => {
    renderWithProviders(<ActionButton variant='invalid'>Invalid Variant</ActionButton>)

    const button = screen.getByRole('button', { name: /invalid variant/i })
    // Invalid variant falls back to primary (theme colors)
    expect(button).toBeInTheDocument()
    expect(button).toHaveStyle({ fontWeight: 'medium' })
  })

  it('falls back to medium size when invalid size is provided', () => {
    renderWithProviders(<ActionButton size='invalid'>Invalid Size</ActionButton>)

    const button = screen.getByRole('button', { name: /invalid size/i })
    // Should use medium size since invalid size falls back to medium
    expect(button).toHaveStyle({
      fontSize: '12px',
      padding: '8px 12px'
    })
  })

  describe('theme fallbacks', () => {
    beforeEach(() => {
      // Reset to default mock
      mockUseThemeUI.mockReturnValue({
        colorMode: 'default',
        theme: {
          colors: {
            primary: BUTTON_PRIMARY_COLORS.light,
            primaryRgb: '66, 46, 163'
          }
        }
      })
    })

    it('uses fallback primary color when theme.colors.primary is undefined', () => {
      // Mock useThemeUI to return theme without primary to hit fallback branch (line 20)
      mockUseThemeUI.mockReturnValueOnce({
        colorMode: 'default',
        theme: { colors: {} } // No primary property - triggers fallback '#422EA3'
      })

      renderWithProviders(<ActionButton>Fallback Test</ActionButton>)

      const button = screen.getByRole('button', { name: /fallback test/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveStyle({ fontWeight: 'medium' })
    })

    it('uses fallback primaryRgb when theme.colors.primaryRgb is undefined', () => {
      // Mock useThemeUI to return theme with primary but no primaryRgb (line 24)
      mockUseThemeUI.mockReturnValueOnce({
        colorMode: 'default',
        theme: { colors: { primary: '#422EA3' } } // Has primary, no primaryRgb - triggers fallback '66, 46, 163'
      })

      renderWithProviders(<ActionButton>Fallback RGB Test</ActionButton>)

      const button = screen.getByRole('button', { name: /fallback rgb test/i })
      expect(button).toBeInTheDocument()
    })

    it('uses fallback when theme itself is undefined', () => {
      // Mock useThemeUI to return undefined theme (line 20)
      mockUseThemeUI.mockReturnValueOnce({
        colorMode: 'default',
        theme: undefined // theme is undefined - triggers fallback '#422EA3'
      })

      renderWithProviders(<ActionButton>Undefined Theme Test</ActionButton>)

      const button = screen.getByRole('button', { name: /undefined theme test/i })
      expect(button).toBeInTheDocument()
    })
  })
})
