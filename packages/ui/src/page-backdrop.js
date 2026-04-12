'use client'

import { Box } from '@theme-ui/components'
import { useColorMode } from 'theme-ui'

import isDarkMode from './helpers/isDarkMode.js'

/**
 * Fixed viewport layer behind page content (`z-index: 0`), matching the role of
 * `AnimatedPageBackground` on the Gatsby home: a real surface under `z-index: 1` UI so
 * frosted panels (`backdrop-filter` + `panel-background`) have something to blur and tint
 * against. The full site uses WebGL Color Bends there; this package ships a **lightweight**
 * CSS gradient treatment only (no three.js).
 */
export function ChronogrovePageBackdrop() {
  const [colorMode] = useColorMode()
  const dark = isDarkMode(colorMode)

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        minHeight: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        bg: 'background',
        // Dark: subtle primary/secondary glows — same intent as Color Bends, fraction of the cost.
        backgroundImage: dark
          ? `
            radial-gradient(ellipse 120% 85% at 50% -15%, rgba(74, 158, 255, 0.16) 0%, transparent 52%),
            radial-gradient(ellipse 90% 70% at 95% 85%, rgba(113, 30, 155, 0.12) 0%, transparent 48%),
            radial-gradient(ellipse 70% 50% at 10% 60%, rgba(128, 0, 128, 0.08) 0%, transparent 45%)
          `
          : 'none',
        transition: 'background-image 0.3s ease'
      }}
    />
  )
}
