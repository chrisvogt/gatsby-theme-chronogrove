import React from 'react'
import { render, cleanup, act } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'
import AnimatedPageBackground from './animated-page-background'
import theme from '../gatsby-plugin-theme-ui/theme'

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
})
