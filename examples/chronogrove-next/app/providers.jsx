'use client'

import { Box } from '@theme-ui/components'
import { ChronogroveThemeProvider } from '@chronogrove/ui'
import chronogroveTheme from '@chronogrove/ui/theme'
import { useDocumentColorModeSurface } from '@chronogrove/ui/color-mode'
import { ChronogroveAnimatedPageBackground } from '@chronogrove/ui/animated-page-background'

import ThemeUiColorModeRouteSync from './theme-ui-color-mode-route-sync'

/** Mirrors Gatsby `RootWrapper`: sync html class, data attribute, and surface bg from the live theme. */
function DocumentColorModeSurface() {
  useDocumentColorModeSurface()
  return null
}

export default function Providers({ children }) {
  return (
    <ChronogroveThemeProvider theme={chronogroveTheme}>
      {/*
        Same stack as Gatsby home: Color Bends + overlay (see @chronogrove/ui/animated-page-background), then z-index 1 content.
      */}
      <ChronogroveAnimatedPageBackground />
      <DocumentColorModeSurface />
      <Box sx={{ position: 'relative', zIndex: 1, bg: 'transparent', color: 'text' }}>
        <ThemeUiColorModeRouteSync />
        {children}
      </Box>
    </ChronogroveThemeProvider>
  )
}
