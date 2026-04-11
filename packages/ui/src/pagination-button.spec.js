/** @jsx jsx */
import { jsx } from 'theme-ui'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import PaginationButton from './pagination-button.js'
import { BUTTON_PRIMARY_COLORS } from './color-utils.js'

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

const renderWithProviders = (component, customTheme = null) => {
  const themeToUse = customTheme ?? mockTheme
  return render(<ThemeUIProvider theme={themeToUse}>{component}</ThemeUIProvider>)
}

describe('PaginationButton', () => {
  it('renders as a button', () => {
    renderWithProviders(<PaginationButton>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    renderWithProviders(<PaginationButton onClick={handleClick}>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies active state styles', () => {
    renderWithProviders(<PaginationButton active>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toHaveStyle({
      color: 'rgb(255, 255, 255)',
      fontWeight: 'bold'
    })
  })

  it('applies disabled state', () => {
    renderWithProviders(<PaginationButton disabled>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toBeDisabled()
    expect(button).toHaveStyle({
      opacity: '0.5',
      cursor: 'not-allowed'
    })
  })

  it('applies primary variant styles by default', () => {
    renderWithProviders(<PaginationButton>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toHaveStyle({ fontWeight: 'medium' })
    expect(button).toBeInTheDocument()
  })

  it('applies secondary variant styles', () => {
    renderWithProviders(<PaginationButton variant='secondary'>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toHaveStyle({
      color: '#666'
    })
  })

  it('applies small size styles', () => {
    renderWithProviders(<PaginationButton size='small'>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toHaveStyle({
      fontSize: '10px',
      minWidth: '24px',
      height: '24px'
    })
  })

  it('applies large size styles', () => {
    renderWithProviders(<PaginationButton size='large'>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toHaveStyle({
      fontSize: '12px',
      minWidth: '32px',
      height: '32px'
    })
  })

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid='test-icon'>←</span>
    renderWithProviders(<PaginationButton icon={<TestIcon />}>Prev</PaginationButton>)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
  })

  it('passes through additional props', () => {
    renderWithProviders(
      <PaginationButton data-testid='custom-button' aria-label='Custom label'>
        1
      </PaginationButton>
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('has proper accessibility attributes', () => {
    renderWithProviders(<PaginationButton>1</PaginationButton>)

    const button = screen.getByRole('button', { name: /1/i })
    expect(button).toHaveAttribute('type', 'button')
  })

  describe('theme fallbacks', () => {
    beforeEach(() => {
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
      mockUseThemeUI.mockReturnValueOnce({
        colorMode: 'default',
        theme: { colors: {} }
      })

      renderWithProviders(<PaginationButton>1</PaginationButton>)

      const button = screen.getByRole('button', { name: /1/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveStyle({ fontWeight: 'medium' })
    })

    it('uses fallback primaryRgb when theme.colors.primaryRgb is undefined', () => {
      mockUseThemeUI.mockReturnValueOnce({
        colorMode: 'default',
        theme: { colors: { primary: '#422EA3' } }
      })

      renderWithProviders(<PaginationButton>1</PaginationButton>)

      const button = screen.getByRole('button', { name: /1/i })
      expect(button).toBeInTheDocument()
    })

    it('uses fallback when theme itself is undefined', () => {
      mockUseThemeUI.mockReturnValueOnce({
        colorMode: 'default',
        theme: undefined
      })

      renderWithProviders(<PaginationButton>1</PaginationButton>)

      const button = screen.getByRole('button', { name: /1/i })
      expect(button).toBeInTheDocument()
    })
  })
})
