import React from 'react'
import { version as themeVersion } from './package.json'
import chronogroveTheme from '@chronogrove/ui/theme'
import { buildThemeUiColorModeHeadComponents, onPreRenderHTMLSortThemeUiColorModeFirst } from '@chronogrove/ui/gatsby'

export { default as wrapRootElement } from './wrap-root-element'

const colorModeCrossDomain = process.env.GATSBY_COLOR_MODE_REGISTRABLE_DOMAIN?.trim()
  ? { registrableDomain: process.env.GATSBY_COLOR_MODE_REGISTRABLE_DOMAIN.trim() }
  : undefined

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'en' })

  setHeadComponents([
    <meta key='emotion-insertion-point' name='emotion-insertion-point' content='' />,
    <meta key='gatsby-theme-chronogrove-version' name='gatsby-theme-chronogrove-version' content={themeVersion} />,
    ...buildThemeUiColorModeHeadComponents({ theme: chronogroveTheme, crossDomainColorMode: colorModeCrossDomain })
  ])
}

export const onPreRenderHTML = onPreRenderHTMLSortThemeUiColorModeFirst
