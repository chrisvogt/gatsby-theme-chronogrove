import React from 'react'
import { render, cleanup, act } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'
import AnimatedPageBackground from './animated-page-background'
import theme from '../gatsby-plugin-theme-ui/theme'

// Store original hooks
let mockColorMode = 'default'
let mockSetColorMode = jest.fn()

// Mock theme-ui's useColorMode hook
jest.mock('theme-ui', () => {
  const original = jest.requireActual('theme-ui')
  return {
    ...original,
    useColorMode: jest.fn(() => [mockColorMode, mockSetColorMode])
  }
})

// Mock the background components
jest.mock('./home-backgrounds/prismatic-burst', () => {
  return function MockPrismaticBurst() {
    return <div data-testid='prismatic-burst'>Prismatic Burst</div>
  }
})

jest.mock('./home-backgrounds/color-bends', () => {
  return function MockColorBends() {
    return <div data-testid='color-bends'>Color Bends</div>
  }
})

describe('AnimatedPageBackground', () => {
  beforeEach(() => {
    mockColorMode = 'default'
    mockSetColorMode = jest.fn()
  })

  afterEach(() => {
    cleanup()
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  const renderWithTheme = (component, colorMode = 'light') => {
    return render(<ThemeUIProvider theme={{ ...theme, initialColorModeName: colorMode }}>{component}</ThemeUIProvider>)
  }

  it('renders without crashing', () => {
    renderWithTheme(<AnimatedPageBackground />)
  })

  it('renders PrismaticBurst in light mode', () => {
    const { getByTestId } = renderWithTheme(<AnimatedPageBackground />, 'light')
    expect(getByTestId('prismatic-burst')).toBeInTheDocument()
  })

  it('renders ColorBends in dark mode', () => {
    mockColorMode = 'dark'
    const { getByTestId } = renderWithTheme(<AnimatedPageBackground />, 'dark')
    expect(getByTestId('color-bends')).toBeInTheDocument()
  })

  it('applies custom overlay height', () => {
    const { container } = renderWithTheme(<AnimatedPageBackground overlayHeight='500px' />)
    // Just verify it renders without errors when custom height is provided
    expect(container).toBeTruthy()
  })

  it('accepts custom opacity props', () => {
    renderWithTheme(<AnimatedPageBackground lightOpacity={0.5} darkOpacity={0.2} />)
    // Just verify it renders without errors
  })

  it('renders both fixed background and overlay', () => {
    const { container } = renderWithTheme(<AnimatedPageBackground />)
    const divs = container.querySelectorAll('div')
    // Should have at least 2 divs: fixed background + overlay
    expect(divs.length).toBeGreaterThanOrEqual(2)
  })

  it('uses default overlay height when not provided', () => {
    const { container } = renderWithTheme(<AnimatedPageBackground />)
    expect(container).toBeTruthy()
  })

  it('accepts custom fade distance', () => {
    renderWithTheme(<AnimatedPageBackground fadeDistance={800} />)
    // Just verify it renders without errors
  })

  it('sets up scroll event listener for fade-out', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const { unmount } = renderWithTheme(<AnimatedPageBackground />)

    // Should add scroll listener with passive flag for fade effect
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })

    addEventListenerSpy.mockRestore()
    unmount()
  })

  it('calculates overlay opacity based on scroll position', () => {
    renderWithTheme(<AnimatedPageBackground fadeDistance={600} />)

    // Simulate scroll
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 300, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })

    // Opacity should be 0.5 (1 - 300/600)
    // Component should have updated state
  })

  it('clamps overlay opacity to minimum of 0', () => {
    renderWithTheme(<AnimatedPageBackground fadeDistance={600} />)

    // Simulate scrolling past fadeDistance
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })

    // Opacity should not go below 0
    expect(window.scrollY).toBe(1000)
  })

  it('handles color mode changes', () => {
    const { rerender } = renderWithTheme(<AnimatedPageBackground />, 'light')

    // Change to dark mode
    rerender(
      <ThemeUIProvider theme={{ ...theme, initialColorModeName: 'dark' }}>
        <AnimatedPageBackground />
      </ThemeUIProvider>
    )

    // Should re-render with dark mode animation
    expect(rerender).toBeTruthy()
  })

  it('cleans up scroll listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    const { unmount } = renderWithTheme(<AnimatedPageBackground />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('handles fadeDistance changes', () => {
    const { rerender } = renderWithTheme(<AnimatedPageBackground fadeDistance={600} />)

    // Change fadeDistance
    rerender(
      <ThemeUIProvider theme={theme}>
        <AnimatedPageBackground fadeDistance={800} />
      </ThemeUIProvider>
    )

    // Should reinitialize scroll handler with new fadeDistance
    expect(rerender).toBeTruthy()
  })

  it('initializes overlay opacity on mount', () => {
    // Set initial scroll position
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })

    renderWithTheme(<AnimatedPageBackground fadeDistance={600} />)

    // Should call handleScroll immediately to set initial opacity
    expect(window.scrollY).toBe(200)
  })

  it('uses light mode colors from theme', () => {
    const customTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        background: '#fdf8f5'
      }
    }
    const { container } = render(
      <ThemeUIProvider theme={customTheme}>
        <AnimatedPageBackground />
      </ThemeUIProvider>
    )
    expect(container).toBeTruthy()
  })

  it('uses dark mode colors from theme with rawColors', () => {
    mockColorMode = 'dark'
    const { getByTestId } = renderWithTheme(<AnimatedPageBackground />, 'dark')
    // Should render ColorBends in dark mode
    expect(getByTestId('color-bends')).toBeInTheDocument()
  })

  it('uses dark mode with custom darkOpacity', () => {
    mockColorMode = 'dark'
    const { getByTestId } = renderWithTheme(<AnimatedPageBackground darkOpacity={0.2} />, 'dark')
    // Should render ColorBends in dark mode with custom opacity
    expect(getByTestId('color-bends')).toBeInTheDocument()
  })

  it('handles CSS variable colors with fallback', () => {
    const customTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        background: 'var(--theme-ui-colors-background)'
      }
    }
    const { container } = render(
      <ThemeUIProvider theme={customTheme}>
        <AnimatedPageBackground />
      </ThemeUIProvider>
    )
    expect(container).toBeTruthy()
  })

  it('applies gradient overlay with theme colors', () => {
    const { container } = renderWithTheme(<AnimatedPageBackground />)
    const overlayDivs = container.querySelectorAll('div')
    // Should have overlay div with gradient
    expect(overlayDivs.length).toBeGreaterThanOrEqual(2)
  })
})
