'use client'

import { useLayoutEffect } from 'react'
import { useColorMode, useThemeUI } from 'theme-ui'

import { resolveChronogroveSurfaceColors } from './resolve-theme-colors.js'

/**
 * Applies Theme UI color mode + page background to `document.documentElement`. Exposed for tests;
 * prefer {@link useDocumentColorModeSurface} in app code.
 */
export function applyDocumentColorModeSurface(colorMode, theme, surface) {
  if (typeof document === 'undefined') {
    return
  }
  const normalizedColorMode = colorMode === 'light' ? 'default' : colorMode || 'default'
  const isDark = normalizedColorMode === 'dark'
  const bgColorRaw =
    theme?.rawColors?.background ||
    theme?.colors?.background ||
    (isDark ? surface.darkBackgroundHex : surface.defaultBackgroundHex)
  const htmlElement = document.documentElement
  Array.from(htmlElement.classList)
    .filter(className => className.startsWith('theme-ui-'))
    .forEach(className => htmlElement.classList.remove(className))
  htmlElement.classList.add(`theme-ui-${normalizedColorMode}`)
  htmlElement.dataset.themeUiColorMode = normalizedColorMode
  htmlElement.style.backgroundColor = bgColorRaw
}

/**
 * Keeps `document.documentElement` aligned with Theme UI color mode — same responsibility as
 * `RootWrapper`’s layout effect in the Gatsby theme (`packages/theme/src/components/root-wrapper.js`):
 * `theme-ui-*` class, `data-theme-ui-color-mode`, and inline page background from the **resolved**
 * theme (including `rawColors` / `colors.background` for the active mode).
 *
 * Without this on App Router, head fallback CSS and inline scripts can disagree with React
 * hydration, and Emotion-injected `--theme-ui-colors-*` can win the cascade so panel surfaces
 * (`bg: 'panel-background'`) never pick up dark tokens.
 *
 * Call once inside `ChronogroveThemeProvider` (client boundary). Optional on Gatsby if you
 * already use the same hook from `RootWrapper`.
 */
export function useDocumentColorModeSurface() {
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const surface = resolveChronogroveSurfaceColors(theme)

  useLayoutEffect(() => {
    applyDocumentColorModeSurface(colorMode, theme, surface)
  }, [colorMode, theme, surface.darkBackgroundHex, surface.defaultBackgroundHex])
}
