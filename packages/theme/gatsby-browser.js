import React from 'react'
import { CacheProvider } from '@emotion/react'

import './src/styles/global.css'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'

import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import WrapRootElement from './wrap-root-element'
import { onRouteUpdateThemeUiColorMode } from '@chronogrove/ui/gatsby'
import { setChronogroveCrossDomainColorModeClientConfig } from '@chronogrove/ui/color-mode'
import { getChronogroveEmotionCache } from '@chronogrove/ui/emotion-cache'
import { onRouteUpdateChronogroveNavigation } from './src/helpers/on-route-update-chronogrove-navigation'

export const onClientEntry = () => {
  const registrableDomain = process.env.GATSBY_COLOR_MODE_REGISTRABLE_DOMAIN?.trim()
  setChronogroveCrossDomainColorModeClientConfig(registrableDomain ? { registrableDomain } : null)
}

export const wrapRootElement = ({ element }) => (
  <CacheProvider value={getChronogroveEmotionCache()}>
    <WrapRootElement element={element} />
  </CacheProvider>
)

// Always false so `gatsby-react-router-scroll` does not restore a saved scroll position
// (that caused navigations to open mid-page). Scroll-to-top and skip-nav focus run in
// `onRouteUpdateChronogroveNavigation` from `onRouteUpdate`. See CHANGELOG 0.72.6.
export const shouldUpdateScroll = () => false

export const onRouteUpdate = ({ location, prevLocation }) => {
  onRouteUpdateThemeUiColorMode()
  onRouteUpdateChronogroveNavigation({ location, prevLocation })
}
