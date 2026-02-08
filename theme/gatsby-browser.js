import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import './src/styles/global.css'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'prismjs/themes/prism-solarizedlight.css'

export { default as wrapRootElement } from './wrapRootElement'

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
export const onRouteUpdate = ({ prevLocation }) => {
  if (prevLocation !== null) {
    window.scrollTo(0, 0)
    const skipContent = document.getElementById('skip-nav-content')
    if (skipContent) {
      skipContent.focus({ preventScroll: true })
    }
  }
}
