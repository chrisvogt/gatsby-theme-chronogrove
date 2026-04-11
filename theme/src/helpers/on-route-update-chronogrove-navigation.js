/**
 * Scroll-to-top and skip-link focus after pathname changes.
 * Used by the theme's `onRouteUpdate` in `gatsby-browser.js`.
 *
 * Sites that define their own `onRouteUpdate` can import this helper and call it
 * alongside `@chronogrove/ui/gatsby`'s `onRouteUpdateThemeUiColorMode` — do not
 * re-export it from `gatsby-browser.js` (Gatsby only allows known API names there).
 *
 * @param {{ location?: { pathname?: string, hash?: string }, prevLocation?: { pathname?: string, hash?: string } | null }}} args
 */
export function onRouteUpdateChronogroveNavigation({ location, prevLocation }) {
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
