'use client'

import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { nullableCrossDomainColorMode } from '../prop-types-helpers.js'

import { Box } from '@theme-ui/components'

import { ChronogroveAnimatedPageBackground } from '../animated-page-background/index.js'
import { setChronogroveCrossDomainColorModeClientConfig, useDocumentColorModeSurface } from '../color-mode/index.js'
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
 *
 * Pass the same `crossDomainColorMode` as {@link ChronogroveNextRootLayoutHead} so toggles write the
 * shared cookie (optional).
 */
export function ChronogroveNextAppShell({ children, theme = chronogroveTheme, crossDomainColorMode = null }) {
  useEffect(() => {
    setChronogroveCrossDomainColorModeClientConfig(crossDomainColorMode)
    return () => setChronogroveCrossDomainColorModeClientConfig(null)
  }, [crossDomainColorMode?.cookieName, crossDomainColorMode?.registrableDomain])

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

ChronogroveNextAppShell.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.object,
  crossDomainColorMode: nullableCrossDomainColorMode
}
