'use client'

import { Box } from '@theme-ui/components'

import { ChronogroveAnimatedPageBackground } from '../animated-page-background/index.js'
import { useDocumentColorModeSurface } from '../color-mode/index.js'
import { ChronogroveThemeProvider } from '../provider.js'
import chronogroveTheme from '../theme.js'

import { ChronogroveNextThemeUiColorModeRouteSync } from './theme-ui-color-mode-route-sync.js'

/** Mirrors Gatsby `RootWrapper`: sync html class, data attribute, and surface bg from the live theme. */
function DocumentColorModeSurface() {
  useDocumentColorModeSurface()
  return null
}

/**
 * Default Next.js App Router shell: Theme UI provider, three.js Color Bends background (same as
 * Gatsby home), document surface sync, and soft-navigation color-mode reconcile. Wrap with
 * {@link ChronogroveNextEmotionRegistry} in `layout.jsx` outside this component.
 */
export function ChronogroveNextAppShell({ children, theme = chronogroveTheme }) {
  return (
    <ChronogroveThemeProvider theme={theme}>
      <ChronogroveAnimatedPageBackground />
      <DocumentColorModeSurface />
      <Box sx={{ position: 'relative', zIndex: 1, bg: 'transparent', color: 'text' }}>
        <ChronogroveNextThemeUiColorModeRouteSync />
        {children}
      </Box>
    </ChronogroveThemeProvider>
  )
}
