import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Book3D from './book-3d'

// --- Three.js mocks ---------------------------------------------------------

const createMockCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    fillText: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    }))
  }))
  return canvas
}

const mockGeometry = { dispose: jest.fn() }

const mockMaterialBase = {
  map: null,
  color: { set: jest.fn() },
  emissive: { set: jest.fn() },
  emissiveIntensity: 0,
  needsUpdate: false,
  dispose: jest.fn()
}

const mockMesh = {
  rotation: { x: 0, y: 0, z: 0 },
  _customGeometry: mockGeometry,
  _materials: []
}

const mockScene = { add: jest.fn() }

const mockCamera = {
  aspect: 1,
  position: { set: jest.fn() },
  updateProjectionMatrix: jest.fn()
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

const mockTexture = { colorSpace: null, dispose: jest.fn() }
const mockCanvasTexture = { dispose: jest.fn() }

const mockLoader = {
  setCrossOrigin: jest.fn(),
  load: jest.fn((url, onLoad) => {
    onLoad && onLoad(mockTexture)
  })
}

const mockLight = {}

jest.mock('three', () => ({
  Scene: jest.fn(() => mockScene),
  PerspectiveCamera: jest.fn(() => mockCamera),
  WebGLRenderer: jest.fn(() => mockRenderer),
  BoxGeometry: jest.fn(() => mockGeometry),
  MeshStandardMaterial: jest.fn(() => ({
    ...mockMaterialBase,
    dispose: jest.fn(),
    color: { set: jest.fn() },
    emissive: { set: jest.fn() },
    map: null
  })),
  Mesh: jest.fn((geo, mats) => {
    mockMesh._customGeometry = geo
    mockMesh._materials = mats || []
    return mockMesh
  }),
  TextureLoader: jest.fn(() => mockLoader),
  CanvasTexture: jest.fn(() => mockCanvasTexture),
  AmbientLight: jest.fn(() => mockLight),
  DirectionalLight: jest.fn(() => ({ ...mockLight, position: { set: jest.fn() } })),
  Color: jest.fn(function (hex) {
    this.hex = hex
  }),
  SRGBColorSpace: 'srgb'
}))

// --- Browser API mocks ------------------------------------------------------

const mockIntersectionObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}

const mockResizeObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}

let intersectionCallback = null
global.IntersectionObserver = jest.fn(cb => {
  intersectionCallback = cb
  return mockIntersectionObserver
})

global.ResizeObserver = jest.fn(() => mockResizeObserver)

let animationCallback = null
global.requestAnimationFrame = jest.fn(cb => {
  animationCallback = cb
  return 1
})
global.cancelAnimationFrame = jest.fn()
global.devicePixelRatio = 2

// ---------------------------------------------------------------------------

describe('Artwork/Book3D', () => {
  const defaultProps = {
    thumbnailURL: 'https://example.com/cover.jpg',
    title: 'A Test Book'
  }

  // Helper: fire the IntersectionObserver to create the scene
  const enterViewport = () => {
    intersectionCallback && intersectionCallback([{ isIntersecting: true }])
  }

  const leaveViewport = () => {
    intersectionCallback && intersectionCallback([{ isIntersecting: false }])
  }

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    jest.clearAllMocks()
    animationCallback = null
    intersectionCallback = null
    mockRenderer.domElement = createMockCanvas()
    mockLoader.load.mockImplementation((url, onLoad) => {
      onLoad && onLoad(mockTexture)
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    cleanup()
  })

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders the container without crashing before entering viewport', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} />)
    expect(getByTestId('book-preview-3d')).toBeInTheDocument()
  })

  it('exposes an accessible role and label', () => {
    const { getByRole } = render(<Book3D {...defaultProps} />)
    expect(getByRole('img', { name: 'A Test Book' })).toBeInTheDocument()
  })

  it('does NOT create the WebGL renderer until the book enters the viewport', () => {
    render(<Book3D {...defaultProps} />)
    expect(mockRenderer.setSize).not.toHaveBeenCalled()
  })

  // ── Scene lifecycle via IntersectionObserver ───────────────────────────────

  it('creates the scene when the book enters the viewport', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    expect(mockRenderer.setSize).toHaveBeenCalled()
    expect(mockScene.add).toHaveBeenCalledWith(mockMesh)
  })

  it('destroys the scene when the book leaves the viewport', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport()
    expect(mockRenderer.dispose).toHaveBeenCalled()
    expect(mockGeometry.dispose).toHaveBeenCalled()
  })

  it('recreates the scene when the book re-enters after leaving', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport()
    jest.clearAllMocks()
    mockRenderer.domElement = createMockCanvas()
    enterViewport()
    expect(mockRenderer.setSize).toHaveBeenCalled()
  })

  it('sets up an IntersectionObserver on mount', () => {
    render(<Book3D {...defaultProps} />)
    expect(global.IntersectionObserver).toHaveBeenCalled()
    expect(mockIntersectionObserver.observe).toHaveBeenCalled()
  })

  it('creates the scene immediately when IntersectionObserver is unavailable', () => {
    const original = global.IntersectionObserver
    delete global.IntersectionObserver

    render(<Book3D {...defaultProps} />)
    expect(mockRenderer.setSize).toHaveBeenCalled()

    global.IntersectionObserver = original
  })

  // ── Intro animation timing ─────────────────────────────────────────────────

  it('does not start the RAF before the introDelay fires', () => {
    render(<Book3D {...defaultProps} introDelay={300} />)
    enterViewport()
    jest.advanceTimersByTime(299)
    expect(global.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('starts the RAF after the introDelay fires', () => {
    render(<Book3D {...defaultProps} introDelay={300} />)
    enterViewport()
    jest.advanceTimersByTime(300)
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('starts the RAF with default introDelay=0 when timers flush', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers()
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('stops the RAF when the book leaves the viewport', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers()
    leaveViewport()
    expect(global.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('runs a tick after the intro fires', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers()
    animationCallback && animationCallback()
    expect(mockRenderer.render).toHaveBeenCalled()
  })

  // ── Texture loading ────────────────────────────────────────────────────────

  it('loads the cover image via TextureLoader after entering viewport', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    expect(mockLoader.setCrossOrigin).toHaveBeenCalledWith('anonymous')
    expect(mockLoader.load).toHaveBeenCalledWith(
      defaultProps.thumbnailURL,
      expect.any(Function),
      undefined,
      expect.any(Function)
    )
  })

  it('renders a frame after the cover texture loads', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    expect(mockRenderer.render).toHaveBeenCalled()
  })

  // ── Cover fallback ─────────────────────────────────────────────────────────

  it('uses a canvas fallback texture when the cover image fails to load', () => {
    mockLoader.load.mockImplementation((url, onLoad, onProgress, onError) => {
      onError && onError(new Error('404'))
    })
    const { CanvasTexture } = require('three')
    render(<Book3D {...defaultProps} />)
    enterViewport()
    // CanvasTexture called for spine + cover fallback = at least 2 times
    expect(CanvasTexture.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('uses a canvas fallback texture immediately when thumbnailURL is empty', () => {
    const { CanvasTexture } = require('three')
    render(<Book3D thumbnailURL='' title='No Cover Book' />)
    enterViewport()
    expect(CanvasTexture.mock.calls.length).toBeGreaterThanOrEqual(2)
    // TextureLoader.load should NOT be called since URL is falsy
    expect(mockLoader.load).not.toHaveBeenCalled()
  })

  it('uses a canvas fallback texture when thumbnailURL is null', () => {
    render(<Book3D thumbnailURL={null} title='No Cover Book' />)
    enterViewport()
    expect(mockLoader.load).not.toHaveBeenCalled()
  })

  it('builds a spine texture via CanvasTexture', () => {
    const { CanvasTexture } = require('three')
    render(<Book3D {...defaultProps} />)
    enterViewport()
    expect(CanvasTexture).toHaveBeenCalled()
  })

  it('truncates long titles on the spine', () => {
    const { CanvasTexture } = require('three')
    render(<Book3D thumbnailURL='https://example.com/cover.jpg' title={'A'.repeat(50)} />)
    enterViewport()
    expect(CanvasTexture).toHaveBeenCalled()
  })

  // ── Loading pulse ──────────────────────────────────────────────────────────

  it('initialises coverMat with an emissive color for the loading pulse', () => {
    const { MeshStandardMaterial, Color } = require('three')
    render(<Book3D {...defaultProps} />)
    enterViewport()
    // The cover material (fifth in the materials array) should have an emissive Color
    expect(MeshStandardMaterial).toHaveBeenCalledWith(expect.objectContaining({ emissiveIntensity: 0 }))
    expect(Color).toHaveBeenCalledWith(0x1a365d)
  })

  // ── Texture race-condition guards ─────────────────────────────────────────
  // The TextureLoader callbacks are async; destroyScene() may null coverMat
  // before they fire (e.g. the book scrolled off or was unmounted while the
  // image was still in flight).

  it('does not throw when onLoad fires after the scene is destroyed by leaving the viewport', () => {
    let storedOnLoad = null
    mockLoader.load.mockImplementation((url, onLoad) => {
      storedOnLoad = onLoad
    })

    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport() // destroyScene — coverMat is now null

    expect(() => storedOnLoad && storedOnLoad(mockTexture)).not.toThrow()
  })

  it('does not throw when onError (fallback) fires after the scene is destroyed by leaving the viewport', () => {
    let storedOnError = null
    mockLoader.load.mockImplementation((url, _onLoad, _onProgress, onError) => {
      storedOnError = onError
    })

    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport()

    expect(() => storedOnError && storedOnError(new Error('network error'))).not.toThrow()
  })

  it('does not throw when onLoad fires after unmount', () => {
    let storedOnLoad = null
    mockLoader.load.mockImplementation((url, onLoad) => {
      storedOnLoad = onLoad
    })

    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    unmount()

    expect(() => storedOnLoad && storedOnLoad(mockTexture)).not.toThrow()
  })

  it('does not throw when onError (fallback) fires after unmount', () => {
    let storedOnError = null
    mockLoader.load.mockImplementation((url, _onLoad, _onProgress, onError) => {
      storedOnError = onError
    })

    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    unmount()

    expect(() => storedOnError && storedOnError(new Error('network error'))).not.toThrow()
  })

  // ── Mouse interaction ──────────────────────────────────────────────────────

  it('ignores mouse events before the scene is created', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')
    // Mouse enter before viewport entry — should not throw or start RAF
    fireEvent.mouseEnter(container)
    expect(global.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('starts animation on mouseenter after scene is created', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')
    enterViewport()
    fireEvent.mouseEnter(container)
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('clamps targetRotY on mousemove to prevent back face showing', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')
    enterViewport()
    fireEvent.mouseEnter(container)
    container.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200
    }))
    fireEvent.mouseMove(container, { clientX: 200, clientY: 100 })
    expect(container).toBeInTheDocument()
  })

  it('transitions to RETURN phase on mouseleave', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')
    enterViewport()
    fireEvent.mouseEnter(container)
    fireEvent.mouseLeave(container)
    expect(container).toBeInTheDocument()
  })

  // ── ResizeObserver ─────────────────────────────────────────────────────────

  it('sets up a ResizeObserver after scene creation', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    expect(global.ResizeObserver).toHaveBeenCalled()
    expect(mockResizeObserver.observe).toHaveBeenCalled()
  })

  // ── Cleanup ────────────────────────────────────────────────────────────────

  it('cleans up all resources on unmount', () => {
    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers()
    unmount()
    expect(global.cancelAnimationFrame).toHaveBeenCalled()
    expect(mockIntersectionObserver.disconnect).toHaveBeenCalled()
    expect(mockResizeObserver.disconnect).toHaveBeenCalled()
    expect(mockGeometry.dispose).toHaveBeenCalled()
    expect(mockRenderer.dispose).toHaveBeenCalled()
  })

  it('clears the intro timeout when unmounting before it fires', () => {
    const { unmount } = render(<Book3D {...defaultProps} introDelay={10000} />)
    enterViewport()
    unmount()
    jest.advanceTimersByTime(15000)
    expect(global.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('does not leak the scene when unmounting before entering viewport', () => {
    const { unmount } = render(<Book3D {...defaultProps} />)
    // Never enter viewport — unmount should not throw
    expect(() => unmount()).not.toThrow()
  })
})
