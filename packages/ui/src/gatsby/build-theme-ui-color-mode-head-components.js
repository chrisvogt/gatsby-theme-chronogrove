import React from 'react'

import { resolveChronogroveSurfaceColors } from '../color-mode/resolve-theme-colors.js'
import {
  buildThemeUiNoFlashInlineScript,
  buildHtmlBackgroundInlineScript,
  buildThemeUiColorModeFallbackCss
} from '../color-mode/head-inline.js'

/**
 * React head elements for Theme UI color mode: no-flash script, HTML background script, fallback CSS.
 * Compose with your own meta tags (e.g. Emotion insertion point) in `onRenderBody`.
 *
 * @param {{ theme: object, crossDomainColorMode?: { registrableDomain?: string, cookieName?: string } | null }} options — Theme UI theme object (same as `ThemeUIProvider`). Optional `crossDomainColorMode` enables subdomain cookie sync (must match the same object passed to `setChronogroveCrossDomainColorModeClientConfig` in the browser).
 * @returns {import('react').ReactElement[]}
 */
export function buildThemeUiColorModeHeadComponents({ theme, crossDomainColorMode = null }) {
  const surface = resolveChronogroveSurfaceColors(theme)
  const colorModeScript = buildThemeUiNoFlashInlineScript({ crossDomainColorMode })
  const htmlBackgroundScript = buildHtmlBackgroundInlineScript({
    defaultBackgroundHex: surface.defaultBackgroundHex,
    darkBackgroundHex: surface.darkBackgroundHex,
    crossDomainColorMode
  })
  const colorModeFallbackCSS = buildThemeUiColorModeFallbackCss({
    defaultBackgroundHex: surface.defaultBackgroundHex,
    darkBackgroundHex: surface.darkBackgroundHex,
    defaultTextHex: surface.defaultTextHex,
    defaultTextMutedHex: surface.defaultTextMutedHex,
    darkTextHex: surface.darkTextHex,
    darkTextMutedHex: surface.darkTextMutedHex,
    defaultPanelBackground: surface.defaultPanelBackground,
    darkPanelBackground: surface.darkPanelBackground,
    defaultPanelText: surface.defaultPanelText,
    darkPanelText: surface.darkPanelText
  })

  return [
    <script key='theme-ui-no-flash' dangerouslySetInnerHTML={{ __html: colorModeScript }} />,
    <script key='html-bg-color' dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />,
    <style key='theme-ui-color-mode-fallback' dangerouslySetInnerHTML={{ __html: colorModeFallbackCSS }} />
  ]
}
