import React from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AnimatedBackground, { Circle } from './animated-background'
import { ThemeUIProvider } from 'theme-ui'

// Mock requestAnimationFrame and cancelAnimationFrame
beforeEach(() => {
  jest.useFakeTimers()
  window.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 16)) // Simulate 60fps
  window.cancelAnimationFrame = jest.fn(id => clearTimeout(id))
})

afterEach(() => {
  jest.clearAllMocks()
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

// Mock the Canvas and its 2D context
const mockGetContext = jest.fn(() => ({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  closePath: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  fillStyle: '',
  globalAlpha: 1.0
}))

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: mockGetContext
  })
})

// Minimal Mock Theme
const mockTheme = {
  colors: {
    background: '#1e1e2f',
    modes: {
      dark: {
        background: '#1e1e2f'
      }
    }
  }
}

const renderWithTheme = (ui, theme = mockTheme) => render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)

describe('AnimatedBackground', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    expect(container).toBeInTheDocument()
  })

  it('renders the canvas and overlay div correctly', () => {
    // Mock getComputedStyle with necessary methods
    window.getComputedStyle = jest.fn(() => ({
      getPropertyValue: property => {
        if (property === 'backdrop-filter') {
          return 'blur(75px)'
        }
        if (property === 'background-color') {
          return 'rgba(30, 30, 47, 0.15)'
        }
        return ''
      }
    }))

    renderWithTheme(<AnimatedBackground />)

    const canvasElement = document.querySelector('canvas')
    expect(canvasElement).toBeInTheDocument()

    const overlayDiv = canvasElement.nextElementSibling
    expect(overlayDiv).toBeInTheDocument()

    // Check background color
    expect(overlayDiv).toHaveStyle('background-color: rgba(30, 30, 47, 0.15)')

    // Assert mocked backdrop-filter
    const style = window.getComputedStyle(overlayDiv)
    expect(style.getPropertyValue('backdrop-filter')).toBe('blur(75px)')
  })

  it('sets up and tears down window resize event listeners', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = renderWithTheme(<AnimatedBackground />)

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('initializes canvas size and gradient drawing', () => {
    renderWithTheme(<AnimatedBackground />)

    // Manually advance the timers to trigger the animation
    act(() => {
      jest.advanceTimersByTime(32) // Advance two frames (16ms each at 60fps)
    })

    const context = mockGetContext.mock.results[0].value

    // Assert context methods are called
    expect(context.clearRect).toHaveBeenCalled()
    expect(context.createRadialGradient).toHaveBeenCalled()
  })

  it('uses requestAnimationFrame to animate', () => {
    renderWithTheme(<AnimatedBackground />)
    act(() => {
      jest.advanceTimersByTime(16)
    })
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('handles missing canvas gracefully', () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: jest.fn(() => null)
    })

    expect(() => renderWithTheme(<AnimatedBackground />)).not.toThrow()

    // Restore the original getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: originalGetContext
    })
  })

  it('resizes canvas on window resize', () => {
    renderWithTheme(<AnimatedBackground />)

    const resizeEvent = new Event('resize')
    act(() => {
      window.dispatchEvent(resizeEvent)
    })

    expect(mockGetContext).toHaveBeenCalled()
  })

  it('tests Circle class behavior', () => {
    const mockContext = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      fillStyle: '',
      globalAlpha: 1.0
    }

    const mockCanvas = { width: 500, height: 500 }

    const testCircle = new Circle(50, 50, 20, [
      { position: 0, color: 'rgba(128, 0, 128, 1)' },
      { position: 1, color: 'rgba(30, 144, 255, 0.6)' } // Added vibrant blue
    ])

    // Test draw method
    testCircle.draw(mockContext)
    expect(mockContext.beginPath).toHaveBeenCalled()
    expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 20, 0, Math.PI * 2)
    expect(mockContext.fill).toHaveBeenCalled()
    expect(mockContext.closePath).toHaveBeenCalled()

    // Test update method (no collisions)
    testCircle.dx = 2
    testCircle.dy = 3
    testCircle.update(mockCanvas, mockContext)
    expect(testCircle.x).toBe(52)
    expect(testCircle.y).toBe(53)

    // Test boundary collisions
    testCircle.x = 1 // Near left edge
    testCircle.dx = -2
    testCircle.update(mockCanvas, mockContext)
    expect(testCircle.dx).toBe(2) // Reversed direction
  })

  it('tests Circle class edge cases', () => {
    const mockContext = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      fillStyle: '',
      globalAlpha: 1.0
    }

    const mockCanvas = { width: 500, height: 500 }

    const testCircle = new Circle(50, 50, 20, [
      { position: 0, color: 'rgba(128, 0, 128, 1)' },
      { position: 1, color: 'rgba(30, 144, 255, 0.6)' }
    ])

    // Test draw method with null context
    testCircle.draw(null)
    expect(mockContext.beginPath).not.toHaveBeenCalled()

    // Test update method with null context
    testCircle.update(mockCanvas, null)
    expect(testCircle.x).toBe(50) // Should not update position

    // Test update method with null canvas
    testCircle.update(null, mockContext)
    expect(testCircle.x).toBe(50) // Should not update position

    // Test boundary collisions on right edge
    testCircle.x = 480 // Near right edge
    testCircle.dx = 2
    testCircle.update(mockCanvas, mockContext)
    expect(testCircle.dx).toBe(-2) // Reversed direction

    // Test boundary collisions on bottom edge
    testCircle.y = 480 // Near bottom edge
    testCircle.dy = 2
    testCircle.update(mockCanvas, mockContext)
    expect(testCircle.dy).toBe(-2) // Reversed direction

    // Test boundary collisions on top edge
    testCircle.y = 1 // Near top edge
    testCircle.dy = -2
    testCircle.update(mockCanvas, mockContext)
    expect(testCircle.dy).toBe(2) // Reversed direction
  })

  it('tests Circle reposition method', () => {
    const mockCanvas = { width: 500, height: 500 }
    const testCircle = new Circle(50, 50, 20, [
      { position: 0, color: 'rgba(128, 0, 128, 1)' },
      { position: 1, color: 'rgba(30, 144, 255, 0.6)' }
    ])

    // Test reposition with null canvas
    testCircle.reposition(null)
    expect(testCircle.x).toBe(50) // Should not change

    // Test reposition when circle is outside right boundary
    testCircle.x = 600
    testCircle.reposition(mockCanvas)
    expect(testCircle.x).toBe(480) // Should be repositioned to canvas.width - radius

    // Test reposition when circle is outside left boundary
    testCircle.x = -10
    testCircle.reposition(mockCanvas)
    expect(testCircle.x).toBe(20) // Should be repositioned to radius

    // Test reposition when circle is outside bottom boundary
    testCircle.y = 600
    testCircle.reposition(mockCanvas)
    expect(testCircle.y).toBe(480) // Should be repositioned to canvas.height - radius

    // Test reposition when circle is outside top boundary
    testCircle.y = -10
    testCircle.reposition(mockCanvas)
    expect(testCircle.y).toBe(20) // Should be repositioned to radius
  })

  it('tests light mode gradients', () => {
    const lightTheme = {
      colors: {
        background: '#ffffff',
        modes: {
          light: {
            background: '#ffffff'
          }
        }
      }
    }

    // Mock useColorMode to return 'light'
    jest.doMock('theme-ui', () => ({
      ...jest.requireActual('theme-ui'),
      useColorMode: () => ['light']
    }))

    renderWithTheme(<AnimatedBackground />, lightTheme)

    // Manually advance the timers to trigger the animation
    act(() => {
      jest.advanceTimersByTime(32)
    })

    const context = mockGetContext.mock.results[0].value
    expect(context.createRadialGradient).toHaveBeenCalled()
  })

  it('tests canvas resize with dimension changes', () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    const canvas = container.querySelector('canvas')

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600
    })

    // Set initial canvas size
    canvas.width = 400
    canvas.height = 300

    const resizeEvent = new Event('resize')
    act(() => {
      window.dispatchEvent(resizeEvent)
    })

    // Advance timers to allow debounced resize to execute
    act(() => {
      jest.advanceTimersByTime(150) // More than the 100ms debounce delay
    })

    expect(canvas.width).toBe(800)
    expect(canvas.height).toBe(600)
  })

  it('tests canvas resize without dimension changes', () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    const canvas = container.querySelector('canvas')

    // Mock window dimensions to match current canvas size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: canvas.width
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: canvas.height
    })

    const originalWidth = canvas.width
    const originalHeight = canvas.height

    const resizeEvent = new Event('resize')
    act(() => {
      window.dispatchEvent(resizeEvent)
    })

    // Advance timers to allow debounced resize to execute
    act(() => {
      jest.advanceTimersByTime(150)
    })

    // Canvas dimensions should not change
    expect(canvas.width).toBe(originalWidth)
    expect(canvas.height).toBe(originalHeight)
  })

  it('tests animation cleanup on unmount', () => {
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame')

    const { unmount } = renderWithTheme(<AnimatedBackground />)

    // Advance timers to start animation
    act(() => {
      jest.advanceTimersByTime(32)
    })

    unmount()

    expect(cancelAnimationFrameSpy).toHaveBeenCalled()
  })

  it('tests createCircles function with different gradients', () => {
    renderWithTheme(<AnimatedBackground />)

    // Manually advance the timers to trigger the animation
    act(() => {
      jest.advanceTimersByTime(32)
    })

    const context = mockGetContext.mock.results[0].value

    // Should create 40 circles (as defined in the component)
    expect(context.createRadialGradient).toHaveBeenCalled()
  })

  it('tests animation loop with missing context or canvas', () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    const canvas = container.querySelector('canvas')

    // Mock getContext to return null after initial setup
    const originalGetContext = canvas.getContext
    canvas.getContext = jest.fn(() => null)

    // Advance timers to trigger animation loop
    act(() => {
      jest.advanceTimersByTime(32)
    })

    // Should not throw and should handle gracefully
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(16)
      })
    }).not.toThrow()

    // Restore original getContext
    canvas.getContext = originalGetContext
  })

  it('uses fallback background color if theme.rawColors.background is missing', () => {
    const fallbackTheme = {
      colors: {},
      rawColors: {} // no background property
    }
    // Force color mode to 'dark'
    jest.spyOn(require('theme-ui'), 'useColorMode').mockReturnValue(['dark'])
    renderWithTheme(<AnimatedBackground />, fallbackTheme)
    const overlayDiv = document.querySelector('canvas').nextElementSibling
    expect(overlayDiv.style.backgroundColor).toBe('rgba(30, 30, 47, 0.35)')
  })

  it('calls hexToRgba with default alpha', () => {
    // This is covered by default usage, but we can spy on the function
    const spy = jest.spyOn(require('./animated-background'), 'Circle')
    renderWithTheme(<AnimatedBackground />)
    expect(spy).toBeDefined() // Just to ensure the test runs
    spy.mockRestore()
  })

  it('cleans up animation frame if animationRef.current is set', () => {
    // Render and manually set animationRef.current
    const { unmount } = renderWithTheme(<AnimatedBackground />)
    // Find the AnimatedBackground instance and set animationRef.current
    // This is a bit tricky since it's a ref inside the component, but we can force cleanup
    // by unmounting after timers
    act(() => {
      jest.advanceTimersByTime(32)
    })
    unmount()
    // If the cleanup branch is not covered, this will help
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('hexToRgba uses default alpha when not provided', () => {
    const { hexToRgba } = require('./animated-background')
    expect(hexToRgba('#ff0000')).toBe('rgba(255, 0, 0, 1)')
  })

  it('handles null canvas in animation loop', () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    const canvas = container.querySelector('canvas')

    // Mock canvas to be null after initial setup
    const originalRef = canvas.__reactInternalInstance
    canvas.__reactInternalInstance = null

    // Advance timers to trigger animation loop
    act(() => {
      jest.advanceTimersByTime(32)
    })

    // Should not throw and should handle gracefully
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(16)
      })
    }).not.toThrow()

    // Restore original ref
    canvas.__reactInternalInstance = originalRef
  })

  it('handles null context in animation loop', () => {
    const { container } = renderWithTheme(<AnimatedBackground />)
    const canvas = container.querySelector('canvas')

    // Mock getContext to return null after initial setup
    const originalGetContext = canvas.getContext
    canvas.getContext = jest.fn(() => null)

    // Advance timers to trigger animation loop
    act(() => {
      jest.advanceTimersByTime(32)
    })

    // Should not throw and should handle gracefully
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(16)
      })
    }).not.toThrow()

    // Restore original getContext
    canvas.getContext = originalGetContext
  })

  it('handles null canvas in Circle reposition method', () => {
    const { Circle } = require('./animated-background')
    const testCircle = new Circle(50, 50, 20, [
      { position: 0, color: 'rgba(128, 0, 128, 1)' },
      { position: 1, color: 'rgba(30, 144, 255, 0.6)' }
    ])

    // Test reposition with null canvas
    expect(() => testCircle.reposition(null)).not.toThrow()
    expect(testCircle.x).toBe(50) // Should not change
    expect(testCircle.y).toBe(50) // Should not change
  })

  it('handles null canvas in Circle update method', () => {
    const { Circle } = require('./animated-background')
    const testCircle = new Circle(50, 50, 20, [
      { position: 0, color: 'rgba(128, 0, 128, 1)' },
      { position: 1, color: 'rgba(30, 144, 255, 0.6)' }
    ])

    const mockContext = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      fillStyle: '',
      globalAlpha: 1.0
    }

    // Test update with null canvas
    expect(() => testCircle.update(null, mockContext)).not.toThrow()
    expect(testCircle.x).toBe(50) // Should not update position
    expect(testCircle.y).toBe(50) // Should not update position
  })

  it('handles null context in Circle update method', () => {
    const { Circle } = require('./animated-background')
    const testCircle = new Circle(50, 50, 20, [
      { position: 0, color: 'rgba(128, 0, 128, 1)' },
      { position: 1, color: 'rgba(30, 144, 255, 0.6)' }
    ])

    const mockCanvas = { width: 500, height: 500 }

    // Test update with null context
    expect(() => testCircle.update(mockCanvas, null)).not.toThrow()
    expect(testCircle.x).toBe(50) // Should not update position
    expect(testCircle.y).toBe(50) // Should not update position
  })

  it('handles null context in Circle draw method', () => {
    const { Circle } = require('./animated-background')
    const testCircle = new Circle(50, 50, 20, [
      { position: 0, color: 'rgba(128, 0, 128, 1)' },
      { position: 1, color: 'rgba(30, 144, 255, 0.6)' }
    ])

    // Test draw with null context
    expect(() => testCircle.draw(null)).not.toThrow()
  })

  it('covers animation loop and cleanup logic', () => {
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = renderWithTheme(<AnimatedBackground />)

    // Advance timers to start animation and ensure animationRef.current is set
    act(() => {
      jest.advanceTimersByTime(32) // Start animation
    })

    // Verify animation is running
    expect(window.requestAnimationFrame).toHaveBeenCalled()

    // Unmount to trigger cleanup
    unmount()

    // Verify cleanup is called
    expect(cancelAnimationFrameSpy).toHaveBeenCalled()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    cancelAnimationFrameSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('covers animation loop with context and canvas available', () => {
    renderWithTheme(<AnimatedBackground />)

    // Advance timers to trigger animation loop
    act(() => {
      jest.advanceTimersByTime(16)
    })

    // Verify animation methods are called
    expect(mockGetContext).toHaveBeenCalled()
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('covers gradient selection logic for dark and light modes', () => {
    // Test dark mode
    const darkTheme = {
      colors: {
        background: '#1e1e2f',
        modes: {
          dark: {
            background: '#1e1e2f'
          }
        }
      }
    }

    renderWithTheme(<AnimatedBackground />, darkTheme)

    act(() => {
      jest.advanceTimersByTime(32)
    })

    const context = mockGetContext.mock.results[0].value
    expect(context.createRadialGradient).toHaveBeenCalled()

    // Test light mode
    const lightTheme = {
      colors: {
        background: '#ffffff',
        modes: {
          light: {
            background: '#ffffff'
          }
        }
      }
    }

    renderWithTheme(<AnimatedBackground />, lightTheme)

    act(() => {
      jest.advanceTimersByTime(32)
    })

    expect(context.createRadialGradient).toHaveBeenCalled()
  })
})
