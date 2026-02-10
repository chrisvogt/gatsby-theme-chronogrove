import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ColorToggle from './color-toggle'
import { ThemeUIProvider } from 'theme-ui'

// Mock the useColorMode hook
const mockSetColorMode = jest.fn()
const mockUseColorMode = jest.fn()

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => mockUseColorMode()
}))

// Mock the loadable component
jest.mock('@loadable/component', () => {
  const MockDarkModeToggle = jest.fn()
  return {
    __esModule: true,
    default: jest.fn(() => MockDarkModeToggle)
  }
})

// Mock the isDarkMode helper
jest.mock('../helpers/isDarkMode', () => jest.fn())

describe('ColorToggle', () => {
  const mockIsDarkMode = require('../helpers/isDarkMode')
  const MockDarkModeToggle = require('@loadable/component').default()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseColorMode.mockReturnValue(['default', mockSetColorMode])
    mockIsDarkMode.mockReturnValue(false)
    MockDarkModeToggle.mockImplementation(({ ...props }) => (
      <button
        data-testid='dark-mode-toggle'
        onClick={props.onChange}
        aria-label={props.attributes['aria-label']}
        {...props}
      >
        Toggle
      </button>
    ))
  })

  it('renders the dark mode toggle component', () => {
    render(
      <ThemeUIProvider theme={{}}>
        <ColorToggle />
      </ThemeUIProvider>
    )

    const toggle = screen.getByTestId('dark-mode-toggle')
    expect(toggle).toBeInTheDocument()
  })

  // TODO: These tests are skipped due to the current Expand mock, which is a temporary workaround for Jest module resolution issues.
  // They should be revisited once the mock is removed or replaced with a more accurate one.
  // See theme/__mocks__/theme-toggles-react-mock.js for details.
  //
  // it('passes correct props to DarkModeToggle when in light mode', () => {
  //   mockUseColorMode.mockReturnValue(['default', mockSetColorMode])
  //   mockIsDarkMode.mockReturnValue(false)
  //
  //   render(
  //     <ThemeUIProvider theme={{}}>
  //       <ColorToggle />
  //     </ThemeUIProvider>
  //   )
  //
  //   expect(MockDarkModeToggle).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       id: 'color-mode-toggle',
  //       attributes: {
  //         'aria-label': 'Set color mode to dark'
  //       },
  //       checked: false,
  //       size: 70
  //     }),
  //     expect.any(Object)
  //   )
  // })

  // it('passes correct props to DarkModeToggle when in dark mode', () => {
  //   mockUseColorMode.mockReturnValue(['dark', mockSetColorMode])
  //   mockIsDarkMode.mockReturnValue(true)
  //
  //   render(
  //     <ThemeUIProvider theme={{}}>
  //       <ColorToggle />
  //     </ThemeUIProvider>
  //   )
  //
  //   expect(MockDarkModeToggle).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       id: 'color-mode-toggle',
  //       attributes: {
  //         'aria-label': 'Set color mode to light'
  //       },
  //       checked: true,
  //       size: 70
  //     }),
  //     expect.any(Object)
  //   )
  // })

  it('calls setColorMode with dark when toggling from light mode', () => {
    mockUseColorMode.mockReturnValue(['default', mockSetColorMode])

    render(
      <ThemeUIProvider theme={{}}>
        <ColorToggle />
      </ThemeUIProvider>
    )

    const toggle = screen.getByTestId('dark-mode-toggle')
    fireEvent.click(toggle)

    expect(mockSetColorMode).toHaveBeenCalledWith('dark')
  })

  it('calls setColorMode with default when toggling from dark mode', () => {
    mockUseColorMode.mockReturnValue(['dark', mockSetColorMode])

    render(
      <ThemeUIProvider theme={{}}>
        <ColorToggle />
      </ThemeUIProvider>
    )

    const toggle = screen.getByTestId('dark-mode-toggle')
    fireEvent.click(toggle)

    expect(mockSetColorMode).toHaveBeenCalledWith('default')
  })

  it('calls isDarkMode helper with the current color mode', () => {
    mockUseColorMode.mockReturnValue(['default', mockSetColorMode])

    render(
      <ThemeUIProvider theme={{}}>
        <ColorToggle />
      </ThemeUIProvider>
    )

    expect(mockIsDarkMode).toHaveBeenCalledWith('default')
  })

  // it('has correct aria-label for accessibility', () => {
  //   mockUseColorMode.mockReturnValue(['default', mockSetColorMode])
  //
  //   render(
  //     <ThemeUIProvider theme={{}}>
  //       <ColorToggle />
  //     </ThemeUIProvider>
  //   )
  //
  //   const toggle = screen.getByLabelText('Set color mode to dark')
  //   expect(toggle).toBeInTheDocument()
  // })

  // it('has correct aria-label when in dark mode', () => {
  //   mockUseColorMode.mockReturnValue(['dark', mockSetColorMode])
  //
  //   render(
  //     <ThemeUIProvider theme={{}}>
  //       <ColorToggle />
  //     </ThemeUIProvider>
  //   )
  //
  //   const toggle = screen.getByLabelText('Set color mode to light')
  //   expect(toggle).toBeInTheDocument()
  // })
})
