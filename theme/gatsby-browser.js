import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import './src/styles/global.css'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'prismjs/themes/prism-solarizedlight.css'

export { default as wrapRootElement } from './wrapRootElement'

// Prevent scroll restoration when only query parameters change
export const shouldUpdateScroll = ({ routerProps, prevRouterProps }) => {
  const currentPath = routerProps?.location?.pathname
  const prevPath = prevRouterProps?.location?.pathname

  // If only the query parameters changed (same pathname), don't update scroll
  if (prevPath && currentPath === prevPath) {
    return false
  }

  // For actual page changes, scroll to top
  return [0, 0]
}

// Focus the main content area after route changes for accessibility
// See https://webaim.org/techniques/skipnav/
export const onRouteUpdate = ({ prevLocation }) => {
  if (prevLocation !== null) {
    const skipContent = document.getElementById('skip-nav-content')
    if (skipContent) {
      // Focus without scrolling to prevent interference with shouldUpdateScroll
      skipContent.focus({ preventScroll: true })
    }
  }
}
