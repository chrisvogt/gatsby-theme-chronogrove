import React from 'react'
import { version as themeVersion } from './package.json'
import chronogroveTheme from '@chronogrove/ui/theme'
import {
  resolveChronogroveSurfaceColors,
  buildThemeUiNoFlashInlineScript,
  buildHtmlBackgroundInlineScript,
  buildThemeUiColorModeFallbackCss,
  CHRONOGROVE_COLOR_MODE_HEAD_PRIORITY_KEYS
} from '@chronogrove/ui/color-mode'

export { default as wrapRootElement } from './wrapRootElement'

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'en' })

  const surface = resolveChronogroveSurfaceColors(chronogroveTheme)
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

  setHeadComponents([
    <meta key='emotion-insertion-point' name='emotion-insertion-point' content='' />,
    <meta key='gatsby-theme-chronogrove-version' name='gatsby-theme-chronogrove-version' content={themeVersion} />,
    <script key='theme-ui-no-flash' dangerouslySetInnerHTML={{ __html: colorModeScript }} />,
    <script key='html-bg-color' dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />,
    <style key='theme-ui-color-mode-fallback' dangerouslySetInnerHTML={{ __html: colorModeFallbackCSS }} />
  ])
}

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents()
  const sorted = [...headComponents].sort((a, b) => {
    const aKey = a?.key ?? ''
    const bKey = b?.key ?? ''
    const aFirst = CHRONOGROVE_COLOR_MODE_HEAD_PRIORITY_KEYS.includes(aKey) ? -1 : 0
    const bFirst = CHRONOGROVE_COLOR_MODE_HEAD_PRIORITY_KEYS.includes(bKey) ? -1 : 0
    if (aFirst !== bFirst) return aFirst - bFirst
    return 0
  })
  replaceHeadComponents(sorted)
}
