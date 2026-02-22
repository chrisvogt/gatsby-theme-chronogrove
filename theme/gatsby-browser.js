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
  /* istanbul ignore next -- document is unavailable only in non-DOM runtimes */
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
  // Prefer localStorage (user's explicit choice) over DOM so route transitions
  // don't perpetuate a wrong value when React paints with stale context (e.g.
  // pages that use AnimatedPageBackground and trigger a brief wrong paint).
  let mode
  try {
    mode = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_UI_COLOR_MODE_KEY) : null
  } catch {
    mode = null
  }
  mode = normalizeThemeUiColorMode(mode)
  if (mode) {
    return mode
  }

  /* istanbul ignore next -- document guard for non-DOM runtimes */
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

  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? 'dark' : 'default'
}

const syncThemeUiColorMode = () => {
  /* istanbul ignore next -- browser global guard for non-DOM runtimes */
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

const scheduleThemeUiColorModeSync = () => {
  syncThemeUiColorMode()

  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(syncThemeUiColorMode)
  } else {
    setTimeout(syncThemeUiColorMode, 0)
  }
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
  const currentPath = location?.pathname
  const prevPath = prevLocation?.pathname
  const currentHash = location?.hash
  const isHashOnlyChange = prevPath != null && currentPath === prevPath && currentHash

  // For hash-only changes (e.g. home nav #instagram), skip scheduleThemeUiColorModeSync so we
  // don't race with gatsby-plugin-theme-ui; RootWrapper's reconcile handler will re-sync the DOM.
  if (!isHashOnlyChange) {
    scheduleThemeUiColorModeSync()
  }
  if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
    window.dispatchEvent(new window.CustomEvent('theme-ui-reconcile-color-mode'))
  }

  if (prevLocation !== null) {
    // Don't scroll to top if it's just a hash change on the same page
    if (isHashOnlyChange) {
      return
    }

    window.scrollTo(0, 0)
    const skipContent = document.getElementById('skip-nav-content')
    if (skipContent) {
      skipContent.focus({ preventScroll: true })
    }
  }
}
