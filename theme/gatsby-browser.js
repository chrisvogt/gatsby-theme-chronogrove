import React from 'react'
import { CacheProvider } from '@emotion/react'

import './src/styles/global.css'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'

import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import WrapRootElement from './wrapRootElement'
import { onRouteUpdateThemeUiColorMode } from '@chronogrove/ui/gatsby'
import { getChronogroveEmotionCache } from '@chronogrove/ui/emotion-cache'

export const wrapRootElement = ({ element }) => (
  <CacheProvider value={getChronogroveEmotionCache()}>
    <WrapRootElement element={element} />
  </CacheProvider>
)

export const shouldUpdateScroll = ({ routerProps, prevRouterProps }) => {
  const currentPath = routerProps?.location?.pathname
  const prevPath = prevRouterProps?.location?.pathname

  if (prevPath && currentPath === prevPath) {
    return false
  }

  return false
}

/** Scroll-to-top and skip-link focus after pathname changes (used with {@link onRouteUpdateThemeUiColorMode} on consumer sites). */
export const onRouteUpdateChronogroveNavigation = ({ location, prevLocation }) => {
  if (prevLocation !== null) {
    const currentPath = location?.pathname
    const prevPath = prevLocation?.pathname
    if (currentPath === prevPath) return
    const performScrollToTop = () => {
      /* istanbul ignore next -- gatsby-browser always runs in a browser */
      if (typeof window === 'undefined') return
      const pathname = window.location?.pathname
      const hash = window.location?.hash
      if (pathname === '/' && hash) return
      window.scrollTo(0, 0)
      const skipContent = document.getElementById('skip-nav-content')
      if (skipContent) skipContent.focus({ preventScroll: true })
    }
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(performScrollToTop)
    } else {
      performScrollToTop()
    }
  }
}

export const onRouteUpdate = ({ location, prevLocation }) => {
  onRouteUpdateThemeUiColorMode()
  onRouteUpdateChronogroveNavigation({ location, prevLocation })
}
