import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'

const mockSetColorMode = jest.fn()
const mockUseColorMode = jest.fn()

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => mockUseColorMode()
}))

// Hoisted `jest.mock('theme-ui')` does not reliably patch the copy `packages/ui` binds when ColorToggle is loaded via
// `import`. Require the shim after mocks so `@chronogrove/ui/color-toggle` resolves `useColorMode` from the mock.
const ColorToggle = require('./color-toggle').default

describe('ColorToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseColorMode.mockReturnValue(['default', mockSetColorMode])
  })

  it('renders the dark mode toggle component', () => {
    render(
      <ThemeUIProvider theme={{}}>
        <ColorToggle />
      </ThemeUIProvider>
    )

    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument()
  })

  it('calls setColorMode with dark when toggling from light mode', () => {
    mockUseColorMode.mockReturnValue(['default', mockSetColorMode])

    render(
      <ThemeUIProvider theme={{}}>
        <ColorToggle />
      </ThemeUIProvider>
    )

    fireEvent.click(screen.getByTestId('dark-mode-toggle'))

    expect(mockSetColorMode).toHaveBeenCalledWith('dark')
  })

  it('calls setColorMode with default when toggling from dark mode', () => {
    mockUseColorMode.mockReturnValue(['dark', mockSetColorMode])

    render(
      <ThemeUIProvider theme={{}}>
        <ColorToggle />
      </ThemeUIProvider>
    )

    fireEvent.click(screen.getByTestId('dark-mode-toggle'))

    expect(mockSetColorMode).toHaveBeenCalledWith('default')
  })
})
