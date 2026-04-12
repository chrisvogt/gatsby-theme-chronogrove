'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { Box } from '@theme-ui/components'
import { useColorMode, useThemeUI } from 'theme-ui'

import ColorBends from './ColorBends.js'
import { hexToRgba } from '../color-utils.js'

// Based on Starry Banner SVG colors: purple #800080 and gold #FFD700
const COLOR_BENDS_COLORS = ['#800080', '#6B2F6B', '#FFD700', '#A855A8']
const COLOR_BENDS_STYLE = { width: '100%', height: '100%' }

/**
 * Fixed viewport background: solid in light mode, Color Bends (three.js) in dark mode,
 * plus scroll-linked gradient overlay and parallax — same behavior as the Gatsby home.
 */
export default function ChronogroveAnimatedPageBackground({
  overlayHeight = 'min(112.5vh, 1500px)',
  darkOpacity = 0.12,
  fadeDistance = 700,
  maxParallaxOffset = 150
}) {
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const isDark = colorMode === 'dark'
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [maxScrollDistance, setMaxScrollDistance] = useState(1)
  const [mounted, setMounted] = useState(false)

  const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? '#14141F' : '#fdf8f5')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updateMaxScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      setMaxScrollDistance(maxScroll)
    }

    updateMaxScroll()

    window.addEventListener('resize', updateMaxScroll, { passive: true })
    return () => window.removeEventListener('resize', updateMaxScroll)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const opacity = Math.max(0, 1 - scrollY / fadeDistance)
      setOverlayOpacity(opacity)

      const scrollProgress = Math.min(scrollY / maxScrollDistance, 1)
      const offset = scrollProgress * maxParallaxOffset
      setParallaxOffset(offset)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fadeDistance, maxParallaxOffset, maxScrollDistance])

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

  if (!mounted) {
    return null
  }

  const toRgba = (color, alpha) => {
    if (typeof color === 'string' && color.startsWith('var(')) {
      const fallbackHex = isDark ? '#14141F' : '#fdf8f5'
      return hexToRgba(fallbackHex, alpha)
    }
    return hexToRgba(color, alpha)
  }

  const gradientOverlay = `linear-gradient(to bottom, ${bgColorRaw} 0%, ${bgColorRaw} 30%, ${toRgba(bgColorRaw, 0.6)} 65%, ${toRgba(bgColorRaw, 0.2)} 85%, transparent 100%)`

  return (
    <>
      <Box
        key={`bg-${colorMode}`}
        aria-hidden='true'
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
          transform: `translateY(-${parallaxOffset}px)`,
          willChange: 'transform'
        }}
      >
        {backgroundAnimation}
      </Box>

      <Box
        key={`overlay-${colorMode}`}
        aria-hidden='true'
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: overlayHeight,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: overlayOpacity,
          transition: 'opacity 0.1s ease-out',
          background: gradientOverlay
        }}
      />
    </>
  )
}
