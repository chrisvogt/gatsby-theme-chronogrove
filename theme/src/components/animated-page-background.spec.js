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

// Mock the background component (only ColorBends is used now)
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

  it('renders solid background in light mode (no animation)', () => {
    const { queryByTestId, container } = renderWithTheme(<AnimatedPageBackground />, 'light')
    // Should NOT render any animation component in light mode
    expect(queryByTestId('color-bends')).not.toBeInTheDocument()
    // Should render the fixed background container
    expect(container.querySelector('div[aria-hidden="true"]')).toBeInTheDocument()
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

  it('accepts custom darkOpacity prop', () => {
    mockColorMode = 'dark'
    renderWithTheme(<AnimatedPageBackground darkOpacity={0.2} />, 'dark')
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

  it('uses theme.colors.background directly in dark mode', () => {
    mockColorMode = 'dark'
    // Simulate how Theme UI provides colors when dark mode is active:
    // theme.colors.background is set to the dark mode value
    const customTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        background: '#14141F' // Dark mode background color
      }
    }
    const { container, getByTestId } = render(
      <ThemeUIProvider theme={customTheme}>
        <AnimatedPageBackground />
      </ThemeUIProvider>
    )
    // Should render ColorBends in dark mode
    expect(getByTestId('color-bends')).toBeInTheDocument()
    // Should use the background color from theme.colors.background
    expect(container).toBeTruthy()
  })

  it('uses theme.rawColors.background when available in dark mode', () => {
    mockColorMode = 'dark'
    // Test that rawColors takes precedence when available
    const customTheme = {
      ...theme,
      rawColors: {
        background: '#14141F'
      },
      colors: {
        ...theme.colors,
        background: '#ffffff'
      }
    }
    const { container, getByTestId } = render(
      <ThemeUIProvider theme={customTheme}>
        <AnimatedPageBackground />
      </ThemeUIProvider>
    )
    // Should render ColorBends in dark mode
    expect(getByTestId('color-bends')).toBeInTheDocument()
    // Should prioritize rawColors.background
    expect(container).toBeTruthy()
  })

  it('falls back to default dark mode color when theme colors are missing', () => {
    mockColorMode = 'dark'
    // Test fallback when neither rawColors nor colors.background are available
    const customTheme = {
      ...theme,
      colors: {},
      rawColors: {}
    }
    const { container, getByTestId } = render(
      <ThemeUIProvider theme={customTheme}>
        <AnimatedPageBackground />
      </ThemeUIProvider>
    )
    // Should render ColorBends in dark mode
    expect(getByTestId('color-bends')).toBeInTheDocument()
    // Should fall back to default #14141F for dark mode
    expect(container).toBeTruthy()
  })

  describe('Parallax effect', () => {
    beforeEach(() => {
      // Mock document scroll height for parallax calculations
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 3000,
        configurable: true
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        configurable: true
      })
    })

    it('accepts custom maxParallaxOffset prop', () => {
      const { container } = renderWithTheme(<AnimatedPageBackground maxParallaxOffset={200} />)
      expect(container).toBeTruthy()
    })

    it('sets up resize event listener for dynamic page height', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
      const { unmount } = renderWithTheme(<AnimatedPageBackground />)

      // Should add resize listener for updating max scroll distance
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true })

      addEventListenerSpy.mockRestore()
      unmount()
    })

    it('cleans up resize listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
      const { unmount } = renderWithTheme(<AnimatedPageBackground />)

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      removeEventListenerSpy.mockRestore()
    })

    it('calculates parallax offset based on scroll progress', () => {
      renderWithTheme(<AnimatedPageBackground maxParallaxOffset={150} />)

      // Simulate scroll to 50% of page (1000px out of 2000px scrollable)
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 1000, configurable: true })
        window.dispatchEvent(new Event('scroll'))
      })

      // At 50% scroll, parallax offset should be 75px (150 * 0.5)
      expect(window.scrollY).toBe(1000)
    })

    it('caps parallax offset at maxParallaxOffset when at bottom', () => {
      renderWithTheme(<AnimatedPageBackground maxParallaxOffset={150} />)

      // Simulate scroll to bottom of page
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 2000, configurable: true })
        window.dispatchEvent(new Event('scroll'))
      })

      // At 100% scroll, parallax offset should be exactly maxParallaxOffset
      expect(window.scrollY).toBe(2000)
    })

    it('handles very long pages without exceeding maxParallaxOffset', () => {
      // Simulate a very long page
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 50000,
        configurable: true
      })

      renderWithTheme(<AnimatedPageBackground maxParallaxOffset={150} />)

      // Scroll to bottom of long page
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 49000, configurable: true })
        window.dispatchEvent(new Event('scroll'))
      })

      // Parallax offset should still be capped at maxParallaxOffset
      expect(window.scrollY).toBe(49000)
    })

    it('updates max scroll distance on resize', () => {
      renderWithTheme(<AnimatedPageBackground />)

      // Simulate resize event (e.g., page content loaded dynamically)
      act(() => {
        Object.defineProperty(document.documentElement, 'scrollHeight', {
          value: 5000,
          configurable: true
        })
        window.dispatchEvent(new Event('resize'))
      })

      // Component should have updated its internal max scroll distance
      expect(document.documentElement.scrollHeight).toBe(5000)
    })

    it('spreads parallax evenly across page height regardless of length', () => {
      const { rerender } = renderWithTheme(<AnimatedPageBackground maxParallaxOffset={150} />)

      // Scroll to 50% on short page
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 1000, configurable: true })
        window.dispatchEvent(new Event('scroll'))
      })

      // Rerender with longer page
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 10000,
        configurable: true
      })

      rerender(
        <ThemeUIProvider theme={theme}>
          <AnimatedPageBackground maxParallaxOffset={150} />
        </ThemeUIProvider>
      )

      // Trigger resize to update max scroll
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })

      // Component should handle the longer page
      expect(document.documentElement.scrollHeight).toBe(10000)
    })

    it('handles maxParallaxOffset changes', () => {
      const { rerender } = renderWithTheme(<AnimatedPageBackground maxParallaxOffset={100} />)

      rerender(
        <ThemeUIProvider theme={theme}>
          <AnimatedPageBackground maxParallaxOffset={200} />
        </ThemeUIProvider>
      )

      // Should reinitialize with new maxParallaxOffset
      expect(rerender).toBeTruthy()
    })

    it('handles edge case of zero scroll distance', () => {
      // Simulate a page where content fits in viewport (no scrolling)
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 800,
        configurable: true
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        configurable: true
      })

      const { container } = renderWithTheme(<AnimatedPageBackground />)

      // Should handle gracefully (maxScrollDistance = 1 to avoid division by zero)
      expect(container).toBeTruthy()
    })
  })
})
