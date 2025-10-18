/** @jsx jsx */
import { jsx } from 'theme-ui'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeUIProvider } from 'theme-ui'

import ActionButton from './action-button'

// Mock theme
const mockTheme = {
  colors: {
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

const renderWithProviders = component => {
  return render(
    <Provider store={mockStore}>
      <ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>
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
    expect(button).toHaveStyle({
      color: '#422EA3',
      fontWeight: 'medium'
    })
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
})
