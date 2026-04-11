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
 * @param {{ theme: object }} options — Theme UI theme object (same as `ThemeUIProvider`)
 * @returns {import('react').ReactElement[]}
 */
export function buildThemeUiColorModeHeadComponents({ theme }) {
  const surface = resolveChronogroveSurfaceColors(theme)
  const colorModeScript = buildThemeUiNoFlashInlineScript()
  const htmlBackgroundScript = buildHtmlBackgroundInlineScript({
    defaultBackgroundHex: surface.defaultBackgroundHex,
    darkBackgroundHex: surface.darkBackgroundHex
  })
  const colorModeFallbackCSS = buildThemeUiColorModeFallbackCss({
    defaultTextHex: surface.defaultTextHex,
    defaultTextMutedHex: surface.defaultTextMutedHex,
    darkTextHex: surface.darkTextHex,
    darkTextMutedHex: surface.darkTextMutedHex
  })

  return [
    <script key='theme-ui-no-flash' dangerouslySetInnerHTML={{ __html: colorModeScript }} />,
    <script key='html-bg-color' dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />,
    <style key='theme-ui-color-mode-fallback' dangerouslySetInnerHTML={{ __html: colorModeFallbackCSS }} />
  ]
}
