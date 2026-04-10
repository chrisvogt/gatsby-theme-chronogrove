import React from 'react'
import { CacheProvider } from '@emotion/react'

import './src/styles/global.css'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'

import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import WrapRootElement from './wrapRootElement'
import { scheduleThemeUiColorModeSync, RECONCILE_COLOR_MODE_EVENT } from '@chronogrove/ui/color-mode'
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

export const onRouteUpdate = ({ location, prevLocation }) => {
  scheduleThemeUiColorModeSync()
  if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
    window.dispatchEvent(new window.CustomEvent(RECONCILE_COLOR_MODE_EVENT))
  }

  if (prevLocation !== null) {
    const currentPath = location?.pathname
    const prevPath = prevLocation?.pathname
    if (currentPath === prevPath) return
    const performScrollToTop = () => {
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
