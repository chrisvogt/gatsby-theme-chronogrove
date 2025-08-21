import React from 'react'
import { useColorMode, useThemeUI } from 'theme-ui'

// Convert a hex color to rgba with the provided alpha
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string' || !/^#?[0-9a-fA-F]{6}$/.test(hex)) {
    return `rgba(30, 30, 47, ${alpha})`
  }
  const safe = hex.startsWith('#') ? hex.slice(1) : hex
  const r = parseInt(safe.slice(0, 2), 16)
  const g = parseInt(safe.slice(2, 4), 16)
  const b = parseInt(safe.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const AnimatedBackground = () => {
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()

  const isDark = colorMode === 'dark'

  // Choose a soft, modern palette. Prefer theme tokens; fall back to tasteful defaults.
  const primary = theme?.colors?.primary || '#422EA3'
  const accent = theme?.colors?.accent || '#FF7AB6'

  const paletteLight = [accent, primary, '#30A8FF']
  const paletteDark = [primary, '#B95DD7', '#00D7B9']
  const [c1, c2, c3] = isDark ? paletteDark : paletteLight

  const baseBgHex = theme?.rawColors?.background || theme?.colors?.background || (isDark ? '#1e1e2f' : '#fdf8f5')
  const veil = hexToRgba(baseBgHex, isDark ? 0.28 : 0.2)

  return (
    <div
      aria-hidden='true'
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <style>{`
        /* Modern blurred gradient blobs. CSS-only for excellent performance. */
        .abg-blob {
          position: absolute;
          width: 48vmax;
          height: 48vmax;
          filter: blur(60px);
          opacity: ${isDark ? 0.85 : 0.75};
          will-change: transform, opacity;
          transform: translate3d(0,0,0);
          border-radius: 50%;
          mix-blend-mode: ${isDark ? 'screen' : 'multiply'};
          transition: opacity 300ms ease;
        }

        .abg-blob--1 { left: -10vmax; top: -8vmax; background: radial-gradient(closest-side, var(--abg-c1), transparent 65%); animation: abg-float-1 26s ease-in-out infinite alternate; }
        .abg-blob--2 { right: -12vmax; top: -6vmax; background: radial-gradient(closest-side, var(--abg-c2), transparent 65%); animation: abg-float-2 32s ease-in-out infinite alternate; }
        .abg-blob--3 { left: 10vmax; bottom: -14vmax; background: radial-gradient(closest-side, var(--abg-c3), transparent 65%); animation: abg-float-3 38s ease-in-out infinite alternate; }

        @keyframes abg-float-1 { 0% { transform: translate3d(0,0,0) scale(1); } 100% { transform: translate3d(6vmax, 3vmax, 0) scale(1.05); } }
        @keyframes abg-float-2 { 0% { transform: translate3d(0,0,0) scale(1.05); } 100% { transform: translate3d(-5vmax, 4vmax, 0) scale(0.95); } }
        @keyframes abg-float-3 { 0% { transform: translate3d(0,0,0) scale(1); } 100% { transform: translate3d(2vmax, -5vmax, 0) scale(1.08); } }

        /* Respect user preference for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .abg-blob { animation: none !important; }
        }
      `}</style>

      {/* Color variables for current theme */}
      <div style={{ position: 'absolute', inset: 0, '--abg-c1': c1, '--abg-c2': c2, '--abg-c3': c3 }}>
        <div className='abg-blob abg-blob--1' />
        <div className='abg-blob abg-blob--2' />
        <div className='abg-blob abg-blob--3' />
      </div>

      {/* Soft veil for that frosted look */}
      <div
        data-testid='abg-veil'
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: veil,
          backdropFilter: 'blur(80px) saturate(140%)',
          WebkitBackdropFilter: 'blur(80px) saturate(140%)'
        }}
      />
    </div>
  )
}

export default AnimatedBackground
export { hexToRgba }
