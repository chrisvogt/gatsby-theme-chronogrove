import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import './src/styles/global.css'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'prismjs/themes/prism-solarizedlight.css'
import '@reach/skip-nav/styles.css' //this will show/hide the link on focus

export { default as wrapRootElement } from './wrapRootElement'

// Prevent scroll restoration when only query parameters change
export const shouldUpdateScroll = ({ routerProps }) => {
  // If routerProps is undefined, we're likely in a development environment
  // or the router hasn't initialized yet
  if (!routerProps) {
    return [0, 0]
  }

  const { location, prevLocation } = routerProps
  // If only the query parameters changed, don't update scroll
  if (prevLocation && location.pathname === prevLocation.pathname) {
    return false
  }
  // For actual page changes, scroll to top
  return [0, 0]
}

// See https://fossies.org/linux/gatsby/examples/using-reach-skip-nav/README.md
export const onRouteUpdate = ({ prevLocation }) => {
  if (prevLocation !== null) {
    const skipContent = document.querySelector('[data-reach-skip-nav-content]') // Comes with the <SkipNavContent> component.
    if (skipContent) {
      // Focus without scrolling to prevent interference with shouldUpdateScroll
      skipContent.focus({ preventScroll: true })
    }
  }
}
