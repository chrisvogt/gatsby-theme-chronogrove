/** @jsx jsx */
import React, { useMemo, useEffect, useState } from 'react'
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import ColorBends from './home-backgrounds/color-bends'

// Based on Starry Banner SVG colors: purple #800080 and gold #FFD700
const COLOR_BENDS_COLORS = ['#800080', '#6B2F6B', '#FFD700', '#A855A8']
const COLOR_BENDS_STYLE = { width: '100%', height: '100%' }

/**
 * AnimatedPageBackground
 *
 * Renders an animated background that changes based on the current color mode.
 * - Light mode: Solid background color (no animation)
 * - Dark mode: Color Bends animation with cosmic theme colors
 *
 * The background is fixed to the viewport and includes a gradient overlay
 * to protect header content from being obscured. The overlay fades out as
 * the user scrolls down.
 *
 * A subtle parallax effect moves the background opposite to scroll direction,
 * creating depth. The canvas extends beyond the viewport to accommodate
 * this movement without exposing empty space. The parallax effect is spread
 * across the entire page height, working smoothly on pages of any length.
 *
 * Props:
 * @param {string} overlayHeight - Height of the gradient overlay (default: 'min(112.5vh, 1500px)')
 * @param {number} darkOpacity - Opacity for dark mode animation (default: 0.12)
 * @param {number} fadeDistance - Distance in pixels over which overlay fades out (default: 700)
 * @param {number} maxParallaxOffset - Total parallax movement in pixels from top to bottom of page (default: 150)
 */
const AnimatedPageBackground = ({
  overlayHeight = 'min(112.5vh, 1500px)',
  darkOpacity = 0.12,
  fadeDistance = 700,
  maxParallaxOffset = 150
}) => {
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const isDark = colorMode === 'dark'
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [maxScrollDistance, setMaxScrollDistance] = useState(1)
  const [mounted, setMounted] = useState(false)

  // Get background colors from theme for gradient overlay
  const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? '#14141F' : '#fdf8f5')

  // Ensure we're client-side before rendering color-specific content
  useEffect(() => {
    setMounted(true)
  }, [])

  // Note: HTML background color is now managed globally in RootWrapper
  // to prevent white flash during page transitions

  // Calculate max scroll distance on mount and resize
  useEffect(() => {
    const updateMaxScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      setMaxScrollDistance(maxScroll)
    }

    updateMaxScroll()

    window.addEventListener('resize', updateMaxScroll, { passive: true })
    return () => window.removeEventListener('resize', updateMaxScroll)
  }, [])

  // Handle scroll to fade out overlay and apply parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Calculate opacity: 1 at top, 0 after fadeDistance pixels
      const opacity = Math.max(0, 1 - scrollY / fadeDistance)
      setOverlayOpacity(opacity)

      // Calculate parallax offset based on scroll progress through the page
      // This spreads the parallax effect across the entire page height
      // scrollProgress goes from 0 (top) to 1 (bottom)
      const scrollProgress = Math.min(scrollY / maxScrollDistance, 1)
      const offset = scrollProgress * maxParallaxOffset
      setParallaxOffset(offset)
    }

    // Set initial values
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fadeDistance, maxParallaxOffset, maxScrollDistance])

  // Memoize the background component so it only changes when color mode changes
  // Only render animation in dark mode; light mode uses solid background color
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
      ) : null,
    [isDark, colorMode]
  )

  // Don't render anything until client-side to avoid SSR mismatch
  if (!mounted) {
    return null
  }

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
      {/* Fixed background - animation only in dark mode, solid color in light mode */}
      {/* Canvas extends beyond viewport to accommodate parallax movement */}
      <div
        key={`bg-${colorMode}`}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100vw',
          height: `calc(100vh + ${maxParallaxOffset}px)`,
          zIndex: 0,
          overflow: 'hidden',
          opacity: isDark ? darkOpacity : 1,
          pointerEvents: 'none',
          backgroundColor: bgColorRaw,
          // Parallax: translate up as user scrolls down
          transform: `translateY(-${parallaxOffset}px)`,
          willChange: 'transform'
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
