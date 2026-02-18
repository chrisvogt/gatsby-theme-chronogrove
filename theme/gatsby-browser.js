import React from 'react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

import './src/styles/global.css'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'

import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import WrapRootElement from './wrapRootElement'

let emotionCache
const THEME_UI_COLOR_MODE_KEY = 'theme-ui-color-mode'

const normalizeThemeUiColorMode = mode => {
  if (mode === 'light') {
    return 'default'
  }

  if (mode === 'dark' || mode === 'default') {
    return mode
  }

  return null
}

const createEmotionCache = () => {
  const insertionPoint =
    typeof document !== 'undefined' ? document.querySelector('meta[name="emotion-insertion-point"]') : undefined

  return createCache({
    key: 'css',
    insertionPoint: insertionPoint || undefined
  })
}

const getEmotionCache = () => {
  if (!emotionCache) {
    emotionCache = createEmotionCache()
  }

  return emotionCache
}

const resolveThemeUiColorMode = () => {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement

    const domAttributeMode = normalizeThemeUiColorMode(htmlElement?.getAttribute('data-theme-ui-color-mode'))
    if (domAttributeMode) {
      return domAttributeMode
    }

    if (htmlElement?.classList?.contains('theme-ui-dark')) {
      return 'dark'
    }

    if (htmlElement?.classList?.contains('theme-ui-default') || htmlElement?.classList?.contains('theme-ui-light')) {
      return 'default'
    }
  }

  let mode

  try {
    mode = window.localStorage.getItem(THEME_UI_COLOR_MODE_KEY)
  } catch {
    mode = null
  }

  mode = normalizeThemeUiColorMode(mode)

  if (!mode) {
    const prefersDark =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    mode = prefersDark ? 'dark' : 'default'
  }

  return mode
}

const syncThemeUiColorMode = () => {
  if (typeof document === 'undefined') {
    return
  }

  const htmlElement = document.documentElement
  if (!htmlElement) {
    return
  }

  const mode = resolveThemeUiColorMode()

  Array.from(htmlElement.classList)
    .filter(className => className.startsWith('theme-ui-'))
    .forEach(className => htmlElement.classList.remove(className))

  htmlElement.classList.add(`theme-ui-${mode}`)
  htmlElement.setAttribute('data-theme-ui-color-mode', mode)
}

export const wrapRootElement = ({ element }) => (
  <CacheProvider value={getEmotionCache()}>
    <WrapRootElement element={element} />
  </CacheProvider>
)

// Prevent scroll restoration when only query parameters change.
// Returning false prevents gatsby-react-router-scroll from restoring a previously
// saved scroll position (e.g. bottom of About). We scroll to top in onRouteUpdate instead.
export const shouldUpdateScroll = ({ routerProps, prevRouterProps }) => {
  const currentPath = routerProps?.location?.pathname
  const prevPath = prevRouterProps?.location?.pathname

  // If only the query parameters changed (same pathname), don't update scroll
  if (prevPath && currentPath === prevPath) {
    return false
  }

  // For pathname changes: don't let the scroll handler restore saved position.
  // It only uses our return as a boolean; the Y position comes from session storage,
  // so returning [0,0] would still restore the saved Y. We scroll to top in onRouteUpdate.
  return false
}

// Scroll to top and focus main content after route changes (accessibility).
// See https://webaim.org/techniques/skipnav/
export const onRouteUpdate = ({ location, prevLocation }) => {
  syncThemeUiColorMode()

  if (prevLocation !== null) {
    // Don't scroll to top if it's just a hash change on the same page
    const currentPath = location?.pathname
    const prevPath = prevLocation?.pathname
    const currentHash = location?.hash

    // If we're on the same page and there's a hash, let the browser handle it
    if (currentPath === prevPath && currentHash) {
      return
    }

    window.scrollTo(0, 0)
    const skipContent = document.getElementById('skip-nav-content')
    if (skipContent) {
      skipContent.focus({ preventScroll: true })
    }
  }
}
