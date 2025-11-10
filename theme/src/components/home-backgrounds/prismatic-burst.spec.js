import React from 'react'
import { render, cleanup } from '@testing-library/react'
import PrismaticBurst from './prismatic-burst'

// Mock canvas context
const mockContext = {
  clearRect: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  fillRect: jest.fn(),
  fillStyle: null,
  globalCompositeOperation: 'source-over'
}

// Mock requestAnimationFrame to control animation loop
let animationCallback = null
global.requestAnimationFrame = jest.fn(cb => {
  animationCallback = cb
  return 1
})
global.cancelAnimationFrame = jest.fn()

describe('PrismaticBurst', () => {
  let getContextSpy
  let offsetWidthSpy
  let offsetHeightSpy
  let addEventListenerSpy
  let removeEventListenerSpy

  beforeEach(() => {
    // Mock canvas ref
    getContextSpy = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext)
    offsetWidthSpy = jest.spyOn(HTMLCanvasElement.prototype, 'offsetWidth', 'get').mockReturnValue(800)
    offsetHeightSpy = jest.spyOn(HTMLCanvasElement.prototype, 'offsetHeight', 'get').mockReturnValue(600)
    addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    // Reset mocks
    mockContext.clearRect.mockClear()
    mockContext.createRadialGradient.mockClear()
    mockContext.fillRect.mockClear()
    global.requestAnimationFrame.mockClear()
    global.cancelAnimationFrame.mockClear()
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
    getContextSpy.mockRestore()
    offsetWidthSpy.mockRestore()
    offsetHeightSpy.mockRestore()
    animationCallback = null
  })

  it('renders without crashing', () => {
    render(<PrismaticBurst />)
    expect(getContextSpy).toHaveBeenCalledWith('2d')
  })

  it('applies custom blur prop', () => {
    const { container } = render(<PrismaticBurst blur={50} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveStyle('filter: blur(50px)')
  })

  it('uses default blur when not provided', () => {
    const { container } = render(<PrismaticBurst />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveStyle('filter: blur(100px)')
  })

  it('accepts custom colors array', () => {
    render(<PrismaticBurst colors={['#FF0000', '#00FF00', '#0000FF']} />)
    expect(getContextSpy).toHaveBeenCalled()
  })

  it('accepts custom speed', () => {
    render(<PrismaticBurst speed={2.0} />)
    expect(getContextSpy).toHaveBeenCalled()
  })

  it('sets up resize event listener', () => {
    render(<PrismaticBurst />)
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('initializes canvas dimensions on mount', () => {
    const { container } = render(<PrismaticBurst />)
    const canvas = container.querySelector('canvas')
    expect(canvas.width).toBe(800)
    expect(canvas.height).toBe(600)
  })

  it('starts animation loop', () => {
    render(<PrismaticBurst />)
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('runs animation frame and calls canvas methods', () => {
    render(<PrismaticBurst />)

    // Trigger animation callback
    if (animationCallback) {
      animationCallback()
    }

    expect(mockContext.clearRect).toHaveBeenCalled()
    expect(mockContext.createRadialGradient).toHaveBeenCalled()
    expect(mockContext.fillRect).toHaveBeenCalled()
  })

  it('creates multiple gradient circles', () => {
    render(<PrismaticBurst />)

    // Clear mocks after initial render
    mockContext.createRadialGradient.mockClear()
    mockContext.fillRect.mockClear()

    // Trigger animation callback
    if (animationCallback) {
      animationCallback()
    }

    // Should create 3 gradient circles per frame
    expect(mockContext.createRadialGradient).toHaveBeenCalledTimes(3)
    expect(mockContext.fillRect).toHaveBeenCalledTimes(3)
  })

  it('cleans up on unmount', () => {
    const { unmount } = render(<PrismaticBurst />)
    unmount()
    expect(global.cancelAnimationFrame).toHaveBeenCalled()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('handles missing canvas gracefully', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null })
    expect(() => render(<PrismaticBurst />)).not.toThrow()
  })

  it('re-initializes when props change', () => {
    const { rerender } = render(<PrismaticBurst speed={1.0} />)
    const initialCalls = global.requestAnimationFrame.mock.calls.length

    rerender(<PrismaticBurst speed={2.0} />)

    // Should reinitialize animation with new speed
    expect(global.requestAnimationFrame.mock.calls.length).toBeGreaterThan(initialCalls)
  })

  it('handles different color array lengths', () => {
    const { rerender } = render(<PrismaticBurst colors={['#FF0000']} />)
    expect(getContextSpy).toHaveBeenCalled()

    rerender(<PrismaticBurst colors={['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']} />)
    expect(getContextSpy).toHaveBeenCalled()
  })

  it('applies composite operations correctly', () => {
    render(<PrismaticBurst />)

    if (animationCallback) {
      animationCallback()
    }

    // First circle should use 'source-over', others 'screen'
    expect(mockContext.globalCompositeOperation).toBe('screen') // Last value set
  })

  it('calculates gradient positions based on canvas size', () => {
    render(<PrismaticBurst />)

    if (animationCallback) {
      animationCallback()
    }

    // Verify gradient creation with proper center calculations
    const calls = mockContext.createRadialGradient.mock.calls
    expect(calls.length).toBeGreaterThan(0)

    // Each call should have 6 parameters (x0, y0, r0, x1, y1, r1)
    calls.forEach(call => {
      expect(call).toHaveLength(6)
      expect(typeof call[0]).toBe('number')
      expect(typeof call[1]).toBe('number')
    })
  })

  it('handles zero speed', () => {
    render(<PrismaticBurst speed={0} />)

    if (animationCallback) {
      animationCallback()
    }

    expect(mockContext.clearRect).toHaveBeenCalled()
  })

  it('handles extreme blur values', () => {
    const { container, rerender } = render(<PrismaticBurst blur={0} />)
    let canvas = container.querySelector('canvas')
    expect(canvas).toHaveStyle('filter: blur(0px)')

    rerender(<PrismaticBurst blur={500} />)
    canvas = container.querySelector('canvas')
    expect(canvas).toHaveStyle('filter: blur(500px)')
  })
})
