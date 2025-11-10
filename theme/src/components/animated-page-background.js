/** @jsx jsx */
import React, { useMemo, useEffect, useState } from 'react'
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import PrismaticBurst from './home-backgrounds/prismatic-burst'
import ColorBends from './home-backgrounds/color-bends'

// Constants to prevent recreating props on every render
const PRISMATIC_COLORS = ['#9B4F96', '#7B68EE', '#48C9B0', '#F39C12', '#9B4F96']
// Based on Starry Banner SVG colors: purple #800080 and gold #FFD700
const COLOR_BENDS_COLORS = ['#800080', '#6B2F6B', '#FFD700', '#A855A8']
const COLOR_BENDS_STYLE = { width: '100%', height: '100%' }

/**
 * AnimatedPageBackground
 *
 * Renders an animated background that changes based on the current color mode.
 * - Light mode: Prismatic Burst animation with theme accent colors
 * - Dark mode: Color Bends animation with cosmic theme colors
 *
 * The background is fixed to the viewport and includes a gradient overlay
 * to protect header content from being obscured by the animation.
 * The overlay fades out as the user scrolls down.
 *
 * Props:
 * @param {number} overlayHeight - Height of the gradient overlay (default: 'min(112.5vh, 1500px)')
 * @param {number} lightOpacity - Opacity for light mode animation (default: 0.7)
 * @param {number} darkOpacity - Opacity for dark mode animation (default: 0.12)
 * @param {number} fadeDistance - Distance in pixels over which overlay fades out (default: 600)
 */
const AnimatedPageBackground = ({
  overlayHeight = 'min(112.5vh, 1500px)',
  lightOpacity = 0.7,
  darkOpacity = 0.12,
  fadeDistance = 700
}) => {
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const isDark = colorMode === 'dark'
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [mounted, setMounted] = useState(false)

  // Ensure we're client-side before rendering color-specific content
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll to fade out overlay as user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Calculate opacity: 1 at top, 0 after fadeDistance pixels
      const opacity = Math.max(0, 1 - scrollY / fadeDistance)
      setOverlayOpacity(opacity)
    }

    // Set initial opacity
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fadeDistance])

  // Memoize the background component so it only changes when color mode changes
  const backgroundAnimation = useMemo(
    () =>
      isDark ? (
        <ColorBends
          colors={COLOR_BENDS_COLORS}
          rotation={30}
          speed={0.1}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={1}
          noise={0.1}
          transparent
          style={COLOR_BENDS_STYLE}
        />
      ) : (
        <PrismaticBurst colors={PRISMATIC_COLORS} speed={0.3} blur={100} />
      ),
    [isDark, colorMode]
  )

  // Don't render anything until client-side to avoid SSR mismatch
  if (!mounted) {
    return null
  }

  // Get background colors from theme - use raw color values to avoid CSS variable issues
  // Theme UI wraps colors in CSS variables, but we need the actual hex values for rgba conversion
  const bgColorRaw = isDark
    ? theme?.rawColors?.modes?.dark?.background || theme?.colors?.modes?.dark?.background || '#14141F'
    : theme?.rawColors?.background || theme?.colors?.background || '#fdf8f5'

  // Convert hex color to rgba for gradient stops
  const hexToRgba = (hex, alpha) => {
    // Handle CSS variables by returning a fallback
    if (typeof hex === 'string' && hex.startsWith('var(')) {
      // Return the CSS variable as-is for solid colors, but we can't do alpha on CSS vars easily
      // So return a sensible fallback based on mode
      const fallbackHex = isDark ? '#14141F' : '#fdf8f5'
      const h = fallbackHex.replace('#', '')
      const r = parseInt(h.substring(0, 2), 16)
      const g = parseInt(h.substring(2, 4), 16)
      const b = parseInt(h.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Build gradient using theme background color
  const gradientOverlay = `linear-gradient(to bottom, ${bgColorRaw} 0%, ${bgColorRaw} 30%, ${hexToRgba(bgColorRaw, 0.6)} 65%, ${hexToRgba(bgColorRaw, 0.2)} 85%, transparent 100%)`

  return (
    <>
      {/* Fixed background animation */}
      <div
        key={`bg-${colorMode}`}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          zIndex: 0,
          overflow: 'hidden',
          opacity: isDark ? darkOpacity : lightOpacity,
          pointerEvents: 'none',
          backgroundColor: bgColorRaw
        }}
        aria-hidden='true'
      >
        {backgroundAnimation}
      </div>

      {/* Gradient overlay to protect header content - fades out on scroll */}
      <div
        key={`overlay-${colorMode}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: overlayHeight,
          zIndex: 0.5,
          pointerEvents: 'none',
          opacity: overlayOpacity,
          transition: 'opacity 0.1s ease-out',
          background: gradientOverlay
        }}
        aria-hidden='true'
      />
    </>
  )
}

export default AnimatedPageBackground
