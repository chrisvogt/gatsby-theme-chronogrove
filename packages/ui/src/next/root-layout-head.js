import { nullableCrossDomainColorMode } from '../prop-types-helpers.js'

import {
  chronogroveHeadTheme,
  resolveChronogroveSurfaceColors,
  buildThemeUiNoFlashInlineScript,
  buildHtmlBackgroundInlineScript,
  buildThemeUiColorModeFallbackCss
} from '../color-mode/index.js'

/**
 * Server Component fragment for the root `<head>`: Emotion insertion point, Theme UI no-flash
 * script, HTML background script, and fallback CSS (same composition as
 * `buildThemeUiColorModeHeadComponents` for Gatsby).
 *
 * @param {{ crossDomainColorMode?: { registrableDomain?: string, cookieName?: string } | null }} [props]
 */
export function ChronogroveNextRootLayoutHead({ crossDomainColorMode = null } = {}) {
  const surface = resolveChronogroveSurfaceColors(chronogroveHeadTheme)
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

  return (
    <>
      <meta name='emotion-insertion-point' content='' />
      <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
      <script dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />
      <style dangerouslySetInnerHTML={{ __html: colorModeFallbackCSS }} />
    </>
  )
}

ChronogroveNextRootLayoutHead.propTypes = {
  crossDomainColorMode: nullableCrossDomainColorMode
}
