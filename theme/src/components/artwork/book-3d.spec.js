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

const mockGl = {
  getExtension: jest.fn(() => ({
    loseContext: jest.fn()
  }))
}

const mockRenderer = {
  domElement: createMockCanvas(),
  getContext: jest.fn(() => mockGl),
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
    onLoad?.(mockTexture)
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

let resizeCallback = null
global.ResizeObserver = jest.fn(cb => {
  resizeCallback = cb
  return mockResizeObserver
})

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
    intersectionCallback?.([{ isIntersecting: true }])
  }

  const leaveViewport = () => {
    intersectionCallback?.([{ isIntersecting: false }])
  }

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    jest.clearAllMocks()
    animationCallback = null
    intersectionCallback = null
    resizeCallback = null
    mockRenderer.domElement = createMockCanvas()
    mockLoader.load.mockImplementation((url, onLoad) => {
      onLoad?.(mockTexture)
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

  it('exposes an accessible cover image with alt text', () => {
    const { getByRole } = render(<Book3D {...defaultProps} />)
    expect(getByRole('img', { name: 'A Test Book' })).toHaveAttribute('src', defaultProps.thumbnailURL)
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

  it('ignores IntersectionObserver intersect notifications after unmount (avoids stray WebGL recreation)', () => {
    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    expect(mockRenderer.setSize).toHaveBeenCalled()
    jest.clearAllMocks()
    unmount()
    intersectionCallback([{ isIntersecting: true }])
    expect(mockRenderer.setSize).not.toHaveBeenCalled()
  })

  it('pauses WebGL when the book leaves the viewport without disposing the renderer', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport()
    expect(mockRenderer.dispose).not.toHaveBeenCalled()
    expect(mockGeometry.dispose).not.toHaveBeenCalled()
    expect(mockRenderer.domElement.style.visibility).toBe('hidden')
  })

  it('reuses the existing WebGL scene when the book re-enters after leaving', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport()
    jest.clearAllMocks()
    enterViewport()
    expect(mockRenderer.dispose).not.toHaveBeenCalled()
    expect(mockRenderer.setSize).not.toHaveBeenCalled()
    expect(mockRenderer.domElement.style.visibility).toBe('visible')
  })

  it('sets up an IntersectionObserver on mount', () => {
    render(<Book3D {...defaultProps} />)
    expect(global.IntersectionObserver).toHaveBeenCalled()
    expect(mockIntersectionObserver.observe).toHaveBeenCalled()
  })

  it('does not recreate the scene on rapid viewport re-entry when the scene already exists', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport() // createScene — renderer set
    const setSizeCount = mockRenderer.setSize.mock.calls.length
    enterViewport() // renderer already exists — no-op (line 358 false branch)
    expect(mockRenderer.setSize.mock.calls).toHaveLength(setSizeCount)
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

  it('exits stale RAF tick when teardown already ran (!active)', () => {
    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers()
    const tick = animationCallback
    expect(tick).toEqual(expect.any(Function))
    jest.clearAllMocks()
    unmount()
    tick()
    expect(mockRenderer.render).not.toHaveBeenCalled()
  })

  it('exits stale RAF tick when the viewport already marked off-screen (!inViewport)', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers()
    const tick = animationCallback
    leaveViewport()
    jest.clearAllMocks()
    tick()
    expect(mockRenderer.render).not.toHaveBeenCalled()
  })

  it('runs a tick after the intro fires', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers()
    animationCallback?.()
    expect(mockRenderer.render).toHaveBeenCalled()
  })

  it('skips the intro animation and goes to IDLE if the book is already hovered when introDelay fires', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} introDelay={500} />)
    const container = getByTestId('book-preview-3d')

    enterViewport()

    // Hover BEFORE the intro timer fires — sets hovered = true
    fireEvent.mouseEnter(container)

    // Fire the timer — hovered is true, takes the if(hovered) branch (lines 308-311)
    jest.advanceTimersByTime(500)

    expect(container).toBeInTheDocument()
  })

  // ── Animation phases ───────────────────────────────────────────────────────

  it('completes the INTRO animation and transitions to IDLE when t reaches 1', () => {
    let nowValue = 0
    const mockNow = jest.spyOn(performance, 'now').mockImplementation(() => nowValue)

    render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers() // introStartMs = 0, RAF starts

    // Advance past INTRO_DURATION (480ms) so t >= 1
    nowValue = 500
    animationCallback?.()

    // INTRO completed → stopAnim() called → RAF cancelled
    expect(global.cancelAnimationFrame).toHaveBeenCalled()
    mockNow.mockRestore()
  })

  it('pulses the emissive intensity while the cover texture is still loading', () => {
    // Defer the texture callback so coverLoaded stays false during the tick
    mockLoader.load.mockImplementation(() => {
      // intentionally not calling onLoad
    })

    let nowValue = 0
    const mockNow = jest.spyOn(performance, 'now').mockImplementation(() => nowValue)

    render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.runAllTimers() // phase = INTRO, coverLoaded = false

    // Run tick mid-intro (t < 1) — loading pulse body (lines 185-186) executes
    nowValue = 100
    animationCallback?.()

    expect(mockRenderer.render).toHaveBeenCalled()
    mockNow.mockRestore()
  })

  it('interpolates book rotation toward targetRotY during the HOVERED phase', () => {
    let nowValue = 0
    const mockNow = jest.spyOn(performance, 'now').mockImplementation(() => nowValue)

    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')

    enterViewport()
    jest.runAllTimers()

    // Complete INTRO first
    nowValue = 500
    animationCallback?.()

    // Hover → HOVERED phase, new RAF starts
    fireEvent.mouseEnter(container)

    // Tick in HOVERED phase (line 180)
    animationCallback?.()

    expect(mockRenderer.render).toHaveBeenCalled()
    mockNow.mockRestore()
  })

  it('executes the RETURN animation tick while the easing is still in progress (t < 1)', () => {
    let nowValue = 0
    const mockNow = jest.spyOn(performance, 'now').mockImplementation(() => nowValue)

    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')

    enterViewport()
    jest.runAllTimers()

    // Complete INTRO
    nowValue = 500
    animationCallback?.()

    fireEvent.mouseEnter(container)

    // Leave → RETURN, returnStartMs = 1000
    nowValue = 1000
    fireEvent.mouseLeave(container)

    // Run tick mid-RETURN (t ≈ 0.3, < 1) — covers the false path of the t >= 1 check
    nowValue = 1100
    animationCallback?.()

    expect(mockRenderer.render).toHaveBeenCalled()
    mockNow.mockRestore()
  })

  it('completes the RETURN animation and transitions back to IDLE', () => {
    let nowValue = 0
    const mockNow = jest.spyOn(performance, 'now').mockImplementation(() => nowValue)

    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')

    enterViewport()
    jest.runAllTimers()

    // Complete INTRO
    nowValue = 500
    animationCallback?.()

    // Hover → HOVERED phase
    fireEvent.mouseEnter(container)

    // Leave → RETURN phase, returnStartMs = 1000
    nowValue = 1000
    fireEvent.mouseLeave(container)

    // Advance past RETURN_DURATION (320ms) so t >= 1
    nowValue = 1400
    animationCallback?.()

    expect(global.cancelAnimationFrame).toHaveBeenCalled()
    mockNow.mockRestore()
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
      onError?.(new Error('404'))
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

  it('word-wraps the fallback cover text when a line would exceed 14 characters', () => {
    const { CanvasTexture } = require('three')
    // 'aa bbbbbbbbbbbbb' = 16 chars > 14 — triggers the push-and-wrap branch
    render(<Book3D thumbnailURL='' title='The Quick Brown Fox Jumps' />)
    enterViewport()
    expect(CanvasTexture.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('breaks the word-wrap loop early when the line buffer reaches 4 lines', () => {
    const { CanvasTexture } = require('three')
    // Each adjacent word pair exceeds 14 chars, filling 4 lines before all words
    // are processed — triggers the `if (lines.length >= 4) break` path
    render(<Book3D thumbnailURL='' title='aa bbbbbbbbbbbbb cc ddddddddddddd ee' />)
    enterViewport()
    expect(CanvasTexture.mock.calls.length).toBeGreaterThanOrEqual(2)
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

    expect(() => storedOnLoad?.(mockTexture)).not.toThrow()
  })

  it('does not throw when onError (fallback) fires after the scene is destroyed by leaving the viewport', () => {
    let storedOnError = null
    mockLoader.load.mockImplementation((url, _onLoad, _onProgress, onError) => {
      storedOnError = onError
    })

    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport()

    expect(() => storedOnError?.(new Error('network error'))).not.toThrow()
  })

  it('does not throw when onLoad fires after unmount', () => {
    let storedOnLoad = null
    mockLoader.load.mockImplementation((url, onLoad) => {
      storedOnLoad = onLoad
    })

    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    unmount()

    expect(() => storedOnLoad?.(mockTexture)).not.toThrow()
  })

  it('does not throw when onError (fallback) fires after unmount', () => {
    let storedOnError = null
    mockLoader.load.mockImplementation((url, _onLoad, _onProgress, onError) => {
      storedOnError = onError
    })

    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    unmount()

    expect(() => storedOnError?.(new Error('network error'))).not.toThrow()
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

  it('does not start a second RAF loop when startAnim is called while already running', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')
    enterViewport()
    fireEvent.mouseEnter(container) // rafId = 1, RAF starts
    const countAfterFirst = global.requestAnimationFrame.mock.calls.length
    fireEvent.mouseEnter(container) // rafId !== null → early return (line 147)
    expect(global.requestAnimationFrame.mock.calls).toHaveLength(countAfterFirst)
  })

  it('ignores mousemove events when the book is not being hovered', () => {
    const { getByTestId } = render(<Book3D {...defaultProps} />)
    const container = getByTestId('book-preview-3d')
    enterViewport()
    container.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200
    }))
    // mousemove without mouseenter — hovered = false, early return (line 398)
    fireEvent.mouseMove(container, { clientX: 100, clientY: 100 })
    expect(container).toBeInTheDocument()
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

  it('updates the camera and renderer dimensions when the container is resized', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()

    // Fire the ResizeObserver callback while the scene is active (lines 377-383)
    resizeCallback?.([])

    expect(mockCamera.updateProjectionMatrix).toHaveBeenCalled()
    // setSize called once in createScene, once in the resize callback
    expect(mockRenderer.setSize).toHaveBeenCalledTimes(2)
  })

  it('still applies resize when the book is off-screen (renderer kept alive)', () => {
    render(<Book3D {...defaultProps} />)
    enterViewport()
    leaveViewport()

    resizeCallback?.([])

    expect(mockCamera.updateProjectionMatrix).toHaveBeenCalled()
    expect(mockRenderer.setSize).toHaveBeenCalled()
  })

  it('ignores ResizeObserver resize callbacks after unmount (active guard)', () => {
    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    jest.clearAllMocks()
    unmount()
    resizeCallback?.([])
    expect(mockRenderer.setSize).not.toHaveBeenCalled()
    expect(mockCamera.updateProjectionMatrix).not.toHaveBeenCalled()
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

  it('swallows WEBGL_lose_context errors during dispose when getExtension throws', () => {
    mockGl.getExtension.mockImplementationOnce(() => {
      throw new Error('context already invalidated')
    })
    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport()
    expect(() => unmount()).not.toThrow()
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

  it('cleans up without errors when ResizeObserver was unavailable', () => {
    const originalRO = global.ResizeObserver
    delete global.ResizeObserver

    const { unmount } = render(<Book3D {...defaultProps} />)
    enterViewport() // createScene without ResizeObserver (ro = undefined)
    // cleanup: if (ro) = false branch (line 423)
    expect(() => unmount()).not.toThrow()

    global.ResizeObserver = originalRO
  })
})
