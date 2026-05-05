/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const BOOK_W = 0.65
const BOOK_H = 1.0
const BOOK_D = 0.13

const REST_Y = -0.35
const REST_X = 0.05

const INTRO_DURATION = 480
const RETURN_DURATION = 320

// Back face becomes visible at ±π/2 ≈ 1.57 rad; clamp well before that
const MAX_HOVER_Y = 1.35

const easeOutCubic = t => 1 - Math.pow(1 - t, 3)

// ── Spine texture ────────────────────────────────────────────────────────────
function buildSpineTexture(title) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#1a202c'
  ctx.fillRect(0, 0, 64, 512)

  const maxChars = 32
  const label = title.length > maxChars ? title.slice(0, maxChars - 1) + '\u2026' : title

  ctx.save()
  ctx.translate(32, 22)
  ctx.rotate(Math.PI / 2)
  ctx.fillStyle = '#cbd5e0'
  ctx.font = 'bold 18px Arial, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 0, 0)
  ctx.restore()

  return new THREE.CanvasTexture(canvas)
}

// ── Cover fallback texture ───────────────────────────────────────────────────
// Used when thumbnailURL is missing or fails to load.
function buildCoverFallbackTexture(title) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 384
  const ctx = canvas.getContext('2d')

  // Dark gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, 384)
  grad.addColorStop(0, '#2a4365')
  grad.addColorStop(1, '#1a202c')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 384)

  // Subtle horizontal rule near top
  ctx.strokeStyle = 'rgba(203,213,224,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(24, 56)
  ctx.lineTo(232, 56)
  ctx.stroke()

  // Title — word-wrapped, max ~14 chars per line, up to 5 lines
  ctx.fillStyle = '#e2e8f0'
  ctx.textAlign = 'center'
  ctx.font = 'bold 20px Arial, sans-serif'

  const words = title.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > 14 && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
    if (lines.length >= 4) break
  }
  if (line && lines.length < 5) lines.push(line)

  const lineHeight = 28
  const totalHeight = lines.length * lineHeight
  const startY = (384 - totalHeight) / 2 + 14

  lines.forEach((l, i) => {
    ctx.fillText(l, 128, startY + i * lineHeight)
  })

  // Subtle horizontal rule near bottom
  ctx.strokeStyle = 'rgba(203,213,224,0.3)'
  ctx.beginPath()
  ctx.moveTo(24, 328)
  ctx.lineTo(232, 328)
  ctx.stroke()

  return new THREE.CanvasTexture(canvas)
}

// ── Component ────────────────────────────────────────────────────────────────
//
// Animation phases:
// PENDING  — waiting for introDelay; book faces camera at y=0
// INTRO    — easing from y=0 to REST_Y
// IDLE     — gentle sine oscillation around REST_Y
// RETURN   — easing back to REST_Y after hover ends
// HOVERED  — following the cursor

const Book3D = ({ thumbnailURL, title, introDelay = 0 }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Prevents recreated WebGL contexts after teardown: observers may still deliver
    // `isIntersecting` after dispose() clears `renderer`; without this, createScene()
    // can fire again before disconnect() runs and leaks contexts (revoking older
    // canvases like ColorBends).
    let active = true

    // ── All Three.js state lives here so createScene/destroyScene can own it ──
    let renderer = null
    let scene = null
    let camera = null
    let book = null
    let coverMat = null
    let spineTexture = null

    let rafId = null
    let phase = 'PENDING'
    let hovered = false
    let coverLoaded = false
    let targetRotY = 0
    let introStartMs = null
    let returnStartY = 0
    let returnStartMs = null
    let introTimer = null
    /** Tracks viewport visibility; kept in sync with IntersectionObserver (or true when IO is unavailable). */
    let inViewport = false

    // ── Helpers defined up front so createScene/destroyScene can reference them
    const doRender = () => {
      if (renderer && scene && camera) renderer.render(scene, camera)
    }

    const startAnim = () => {
      if (!active || rafId !== null) return
      const tick = () => {
        if (!active) {
          rafId = null
          return
        }
        if (!inViewport) {
          rafId = null
          return
        }

        const now = performance.now()

        if (phase === 'INTRO') {
          const t = Math.min((now - introStartMs) / INTRO_DURATION, 1)
          const e = easeOutCubic(t)
          book.rotation.y = e * REST_Y
          book.rotation.x = e * REST_X
          if (t >= 1) {
            book.rotation.y = REST_Y
            book.rotation.x = REST_X
            phase = 'IDLE'
            // Stop RAF — book rests statically; hover will restart it
            stopAnim()
            doRender()
            return
          }
        } else if (phase === 'RETURN') {
          const t = Math.min((now - returnStartMs) / RETURN_DURATION, 1)
          const e = easeOutCubic(t)
          book.rotation.y = returnStartY + (REST_Y - returnStartY) * e
          book.rotation.x = REST_X
          if (t >= 1) {
            book.rotation.y = REST_Y
            book.rotation.x = REST_X
            phase = 'IDLE'
            // Stop RAF — book rests statically; hover will restart it
            stopAnim()
            doRender()
            return
          }
        } else if (phase === 'HOVERED') {
          book.rotation.y += (targetRotY - book.rotation.y) * 0.12
        }

        // Loading pulse: gently glow the cover face while texture is loading
        if (coverMat && phase !== 'PENDING' && !coverLoaded) {
          coverMat.emissiveIntensity = 0.35 + Math.sin(now * 0.003) * 0.25
          coverMat.needsUpdate = true
        }

        doRender()
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    const stopAnim = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const startIntroTimer = () => {
      clearTimeout(introTimer)
      introTimer = setTimeout(() => {
        if (!active) return
        if (!inViewport) {
          if (book) {
            book.rotation.y = REST_Y
            book.rotation.x = REST_X
          }
          phase = 'IDLE'
          doRender()
          return
        }
        if (hovered) {
          phase = 'IDLE'
          book.rotation.y = REST_Y
          book.rotation.x = REST_X
          return
        }
        phase = 'INTRO'
        introStartMs = performance.now()
        startAnim()
      }, introDelay)
    }

    // ── Scene creation ─────────────────────────────────────────────────────
    const createScene = () => {
      if (!active || renderer) return

      const w = container.clientWidth || 200
      const h = container.clientHeight || 200

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100)
      camera.position.set(0, 0, 1.9)

      const ambient = new THREE.AmbientLight(0xffffff, 0.55)
      scene.add(ambient)

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
      keyLight.position.set(1.5, 2, 3)
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
      fillLight.position.set(-2, 0, 1)
      scene.add(fillLight)

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power'
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(w, h)
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'
      container.appendChild(renderer.domElement)

      spineTexture = buildSpineTexture(title)

      // Cover material: emissive colour used for the loading pulse
      coverMat = new THREE.MeshStandardMaterial({
        color: 0x2d3748,
        emissive: new THREE.Color(0x1a365d),
        emissiveIntensity: 0,
        roughness: 0.4,
        metalness: 0.1
      })
      const spineMat = new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.6 })
      const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf0ede8, roughness: 0.9 })
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.5 })

      // Face order for BoxGeometry: [+x, -x, +y, -y, +z (front/cover), -z (back)]
      const materials = [pagesMat, spineMat, darkMat, darkMat, coverMat, darkMat]

      const geometry = new THREE.BoxGeometry(BOOK_W, BOOK_H, BOOK_D)
      book = new THREE.Mesh(geometry, materials)
      book.rotation.y = 0
      book.rotation.x = 0
      scene.add(book)

      // Track geometry/materials for disposal
      // (geometry and non-cover materials stored inline for dispose)
      book._customGeometry = geometry
      book._materials = materials

      // Reset animation state for fresh scene
      phase = 'PENDING'
      coverLoaded = false
      hovered = false

      // Load cover texture (or fall back immediately if no URL)
      const applyFallback = () => {
        if (!active || !coverMat) return
        const fallbackTex = buildCoverFallbackTexture(title)
        coverMat.map = fallbackTex
        coverMat.color.set(0xffffff)
        coverMat.emissiveIntensity = 0
        coverMat.needsUpdate = true
        coverLoaded = true
        doRender()
      }

      if (thumbnailURL) {
        const loader = new THREE.TextureLoader()
        loader.setCrossOrigin('anonymous')
        loader.load(
          thumbnailURL,
          tex => {
            if (!active || !coverMat) return
            tex.colorSpace = THREE.SRGBColorSpace
            coverMat.map = tex
            coverMat.color.set(0xffffff)
            coverMat.emissiveIntensity = 0
            coverMat.needsUpdate = true
            coverLoaded = true
            doRender()
          },
          undefined,
          applyFallback
        )
      } else {
        applyFallback()
      }

      startIntroTimer()

      doRender()
    }

    // ── Scene destruction ──────────────────────────────────────────────────
    const destroyScene = () => {
      if (!renderer) return

      stopAnim()
      clearTimeout(introTimer)
      introTimer = null

      if (book) {
        book._customGeometry.dispose()
        book._materials.forEach(m => {
          if (m.map) m.map.dispose()
          m.dispose()
        })
        book = null
      }
      if (spineTexture) {
        spineTexture.dispose()
        spineTexture = null
      }
      coverMat = null

      const domEl = renderer.domElement
      const gl = renderer.getContext()
      renderer.dispose()
      try {
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      } catch {
        // Context may already be torn down during dispose().
      }

      if (domEl.parentElement === container) {
        container.removeChild(domEl)
      }
      renderer = null
      scene = null
      camera = null
    }

    // ── IntersectionObserver: defer WebGL creation until visible, but do NOT dispose the
    // renderer when off-screen. Disposing many book renderers at once and recreating them
    // on scroll-back can exceed the browser WebGL context limit and revoke other canvases
    // (e.g. the fixed ColorBends home background).
    let observer
    if ('IntersectionObserver' in window) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          if (!active) return
          if (entry.isIntersecting) {
            inViewport = true
            if (!renderer) {
              createScene()
            } else {
              renderer.domElement.style.visibility = 'visible'
              if (phase === 'PENDING' && !introTimer) {
                startIntroTimer()
              }
              doRender()
            }
          } else {
            inViewport = false
            hovered = false
            stopAnim()
            clearTimeout(introTimer)
            introTimer = null
            if (book && (phase === 'INTRO' || phase === 'RETURN' || phase === 'HOVERED')) {
              book.rotation.y = REST_Y
              book.rotation.x = REST_X
              phase = 'IDLE'
            }
            if (renderer) {
              renderer.domElement.style.visibility = 'hidden'
              doRender()
            }
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(container)
    } else {
      // No IntersectionObserver support — create immediately
      inViewport = true
      if (active) {
        createScene()
      }
    }

    // ── ResizeObserver ─────────────────────────────────────────────────────
    let ro
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => {
        if (!active || !renderer || !camera) return
        const nw = container.clientWidth || 200
        const nh = container.clientHeight || 200
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh)
        doRender()
      })
      ro.observe(container)
    }

    // ── Mouse handlers ─────────────────────────────────────────────────────
    const onMouseEnter = () => {
      if (!renderer) return
      hovered = true
      targetRotY = book.rotation.y
      phase = 'HOVERED'
      startAnim()
    }

    const onMouseMove = e => {
      if (!hovered || !renderer) return
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      targetRotY = Math.max(-MAX_HOVER_Y, Math.min(MAX_HOVER_Y, x * 0.9))
      book.rotation.x = -y * 0.2 + REST_X
    }

    const onMouseLeave = () => {
      if (!renderer) return
      hovered = false
      returnStartY = book.rotation.y
      returnStartMs = performance.now()
      book.rotation.x = REST_X
      phase = 'RETURN'
    }

    container.addEventListener('mouseenter', onMouseEnter)
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      active = false
      if (observer) observer.disconnect()
      if (ro) ro.disconnect()
      container.removeEventListener('mouseenter', onMouseEnter)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      destroyScene()
    }
  }, [thumbnailURL, title, introDelay])

  return (
    <div sx={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
      <div
        ref={containerRef}
        data-testid='book-preview-3d'
        role='img'
        aria-label={title}
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default Book3D
