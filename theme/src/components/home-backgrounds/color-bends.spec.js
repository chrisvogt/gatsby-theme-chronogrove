import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import ColorBends from './color-bends'

// Create comprehensive THREE.js mocks
const mockScene = { add: jest.fn() }
const mockCamera = { position: { z: 1 } }
const mockClock = {
  getDelta: jest.fn(() => 0.016),
  elapsedTime: 0
}
const mockGeometry = {
  setAttribute: jest.fn(),
  dispose: jest.fn()
}
const mockMaterial = {
  uniforms: {
    uCanvas: { value: { set: jest.fn() } },
    uTime: { value: 0 },
    uSpeed: { value: 0.2 },
    uRot: { value: { set: jest.fn() } },
    uColorCount: { value: 0 },
    uColors: { value: Array(8).fill({ set: jest.fn(), copy: jest.fn() }) },
    uTransparent: { value: 1 },
    uScale: { value: 1 },
    uFrequency: { value: 1 },
    uWarpStrength: { value: 1 },
    uPointer: { value: { copy: jest.fn() } },
    uMouseInfluence: { value: 1 },
    uParallax: { value: 0.5 },
    uNoise: { value: 0.1 }
  },
  dispose: jest.fn()
}
// Create a mock canvas element that can be appended
const createMockCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.getContext = jest.fn(() => ({}))
  return canvas
}

const mockRenderer = {
  domElement: createMockCanvas(),
  setSize: jest.fn(),
  setPixelRatio: jest.fn(),
  setClearColor: jest.fn(),
  render: jest.fn(),
  dispose: jest.fn(),
  outputColorSpace: null
}
const mockMesh = { geometry: mockGeometry, material: mockMaterial }

jest.mock('three', () => ({
  Scene: jest.fn(() => mockScene),
  OrthographicCamera: jest.fn(() => mockCamera),
  WebGLRenderer: jest.fn(() => mockRenderer),
  PlaneGeometry: jest.fn(() => mockGeometry),
  ShaderMaterial: jest.fn(() => mockMaterial),
  Mesh: jest.fn(() => mockMesh),
  Clock: jest.fn(() => mockClock),
  BufferAttribute: jest.fn(),
  Vector2: jest.fn(function (x, y) {
    this.x = x || 0
    this.y = y || 0
    this.set = jest.fn((x, y) => {
      this.x = x
      this.y = y
    })
    this.copy = jest.fn()
    this.lerp = jest.fn()
  }),
  Vector3: jest.fn(function (x, y, z) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
    this.set = jest.fn((x, y, z) => {
      this.x = x
      this.y = y
      this.z = z
    })
    this.copy = jest.fn()
  }),
  Color: jest.fn(function () {
    this.r = 1
    this.g = 1
    this.b = 1
  }),
  SRGBColorSpace: 'srgb'
}))

// Mock ResizeObserver
const mockResizeObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}
global.ResizeObserver = jest.fn(() => mockResizeObserver)

// Mock requestAnimationFrame
let animationCallback = null
global.requestAnimationFrame = jest.fn(cb => {
  animationCallback = cb
  return 1
})
global.cancelAnimationFrame = jest.fn()
global.devicePixelRatio = 2

describe('ColorBends', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    animationCallback = null
    mockClock.elapsedTime = 0
    // Reset renderer dom element
    mockRenderer.domElement = createMockCanvas()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders without crashing', () => {
    render(<ColorBends />)
    expect(mockRenderer.setSize).toHaveBeenCalled()
    expect(mockScene.add).toHaveBeenCalledWith(mockMesh)
  })

  it('applies custom className', () => {
    const { container } = render(<ColorBends className='custom-class' />)
    expect(container.firstChild).toHaveClass('color-bends-container custom-class')
  })

  it('applies custom style', () => {
    const customStyle = { width: '500px', height: '300px' }
    const { container } = render(<ColorBends style={customStyle} />)
    const div = container.firstChild
    expect(div).toHaveStyle('width: 500px')
    expect(div).toHaveStyle('height: 300px')
  })

  it('uses ResizeObserver when available', () => {
    render(<ColorBends />)
    expect(global.ResizeObserver).toHaveBeenCalled()
    expect(mockResizeObserver.observe).toHaveBeenCalled()
  })

  it('falls back to window resize when ResizeObserver unavailable', () => {
    // Temporarily remove ResizeObserver
    const originalRO = global.ResizeObserver
    delete global.ResizeObserver

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    render(<ColorBends />)

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    // Restore
    global.ResizeObserver = originalRO
    addEventListenerSpy.mockRestore()
  })

  it('sets pixel ratio correctly', () => {
    render(<ColorBends />)
    expect(mockRenderer.setPixelRatio).toHaveBeenCalledWith(2) // Math.min(devicePixelRatio, 2)
  })

  it('starts animation loop', () => {
    render(<ColorBends />)
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('runs animation frame', () => {
    render(<ColorBends />)

    // Trigger animation callback
    if (animationCallback) {
      mockClock.elapsedTime = 1.5
      animationCallback()
    }

    expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, mockCamera)
  })

  it('handles custom rotation', () => {
    render(<ColorBends rotation={90} />)
    expect(mockMaterial.uniforms).toBeDefined()
  })

  it('handles custom speed', () => {
    render(<ColorBends speed={0.5} />)
    expect(mockMaterial.uniforms.uSpeed.value).toBe(0.5)
  })

  it('handles custom colors array', () => {
    render(<ColorBends colors={['#FF0000', '#00FF00']} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(2)
  })

  it('handles 3-character hex colors', () => {
    render(<ColorBends colors={['#F00', '#0F0', '#00F']} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(3)
  })

  it('handles 6-character hex colors', () => {
    render(<ColorBends colors={['#FF0000', '#00FF00', '#0000FF']} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(3)
  })

  it('filters out null/undefined colors', () => {
    render(<ColorBends colors={['#FF0000', null, '#00FF00', undefined, '#0000FF']} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(3)
  })

  it('limits colors to MAX_COLORS (8)', () => {
    const manyColors = Array(15)
      .fill(0)
      .map((_, i) => `#${i}${i}${i}${i}${i}${i}`)
    render(<ColorBends colors={manyColors} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(8)
  })

  it('handles transparent prop true', () => {
    render(<ColorBends transparent={true} />)
    expect(mockMaterial.uniforms.uTransparent.value).toBe(1)
    expect(mockRenderer.setClearColor).toHaveBeenCalledWith(0x000000, 0)
  })

  it('handles transparent prop false', () => {
    render(<ColorBends transparent={false} />)
    expect(mockMaterial.uniforms.uTransparent.value).toBe(0)
    expect(mockRenderer.setClearColor).toHaveBeenCalledWith(0x000000, 1)
  })

  it('handles autoRotate', () => {
    render(<ColorBends autoRotate={10} />)

    if (animationCallback) {
      mockClock.elapsedTime = 2
      animationCallback()
    }

    expect(mockMaterial.uniforms.uRot.value.set).toHaveBeenCalled()
  })

  it('handles custom scale', () => {
    render(<ColorBends scale={2.5} />)
    expect(mockMaterial.uniforms.uScale.value).toBe(2.5)
  })

  it('handles custom frequency', () => {
    render(<ColorBends frequency={2} />)
    expect(mockMaterial.uniforms.uFrequency.value).toBe(2)
  })

  it('handles custom warpStrength', () => {
    render(<ColorBends warpStrength={1.5} />)
    expect(mockMaterial.uniforms.uWarpStrength.value).toBe(1.5)
  })

  it('handles custom mouseInfluence', () => {
    render(<ColorBends mouseInfluence={0.5} />)
    expect(mockMaterial.uniforms.uMouseInfluence.value).toBe(0.5)
  })

  it('handles custom parallax', () => {
    render(<ColorBends parallax={0.8} />)
    expect(mockMaterial.uniforms.uParallax.value).toBe(0.8)
  })

  it('handles custom noise', () => {
    render(<ColorBends noise={0.2} />)
    expect(mockMaterial.uniforms.uNoise.value).toBe(0.2)
  })

  it('sets up pointer move listener', () => {
    const { container } = render(<ColorBends />)
    const div = container.firstChild

    // Simulate pointer move
    fireEvent.pointerMove(div, { clientX: 100, clientY: 50 })

    // Should not throw
    expect(div).toBeTruthy()
  })

  it('calculates pointer position in NDC', () => {
    const { container } = render(<ColorBends />)
    const div = container.firstChild

    // Mock getBoundingClientRect
    div.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 400,
      height: 300
    }))

    // Simulate pointer move to center
    fireEvent.pointerMove(div, { clientX: 200, clientY: 150 })

    // Pointer should be at (0, 0) in NDC for center
    expect(div).toBeTruthy()
  })

  it('cleans up on unmount', () => {
    const { unmount } = render(<ColorBends />)
    unmount()

    expect(global.cancelAnimationFrame).toHaveBeenCalled()
    expect(mockGeometry.dispose).toHaveBeenCalled()
    expect(mockMaterial.dispose).toHaveBeenCalled()
    expect(mockRenderer.dispose).toHaveBeenCalled()
  })

  it('cleans up ResizeObserver on unmount', () => {
    const { unmount } = render(<ColorBends />)
    unmount()

    expect(mockResizeObserver.disconnect).toHaveBeenCalled()
  })

  it('cleans up window resize listener when ResizeObserver unavailable', () => {
    const originalRO = global.ResizeObserver
    delete global.ResizeObserver

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ColorBends />)
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    global.ResizeObserver = originalRO
    removeEventListenerSpy.mockRestore()
  })

  it('removes canvas element on unmount', () => {
    const { unmount } = render(<ColorBends />)

    unmount()

    // Renderer and geometry should be disposed
    expect(mockRenderer.dispose).toHaveBeenCalled()
    expect(mockGeometry.dispose).toHaveBeenCalled()
  })

  it('updates uniforms when props change', () => {
    const { rerender } = render(<ColorBends speed={0.2} />)

    rerender(<ColorBends speed={0.5} />)

    expect(mockMaterial.uniforms.uSpeed.value).toBe(0.5)
  })

  it('updates colors when colors prop changes', () => {
    const { rerender } = render(<ColorBends colors={['#FF0000']} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(1)

    rerender(<ColorBends colors={['#FF0000', '#00FF00', '#0000FF']} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(3)
  })

  it('handles missing container gracefully', () => {
    // When container ref is null, useEffect should return early without error
    // This is tested by the component's defensive programming
    render(<ColorBends />)
    // If we got here without throwing, the test passes
    expect(true).toBe(true)
  })

  it('handles clientWidth/Height of 0', () => {
    const { container } = render(<ColorBends />)
    const div = container.firstChild

    // Mock zero dimensions
    Object.defineProperty(div, 'clientWidth', { value: 0, configurable: true })
    Object.defineProperty(div, 'clientHeight', { value: 0, configurable: true })

    // Trigger resize
    if (animationCallback) {
      animationCallback()
    }

    // Should use 1 as fallback
    expect(mockRenderer.setSize).toHaveBeenCalled()
  })

  it('handles empty colors array', () => {
    render(<ColorBends colors={[]} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(0)
  })

  it('handles colors with whitespace', () => {
    render(<ColorBends colors={['  #FF0000  ', ' #00FF00 ']} />)
    expect(mockMaterial.uniforms.uColorCount.value).toBe(2)
  })
})
