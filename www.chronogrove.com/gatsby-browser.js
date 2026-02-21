/**
 * Re-export the theme's browser APIs so color-mode sync and route reconciliation
 * run on this site. When the theme is used as a workspace dependency, the
 * theme's gatsby-browser.js may not be applied; this ensures the same
 * behavior as www.chrisvogt.me (theme toggle and navigation keep dark/light
 * mode in sync). We re-export wrapRootElement so the theme's root (and thus
 * RootWrapper + color-mode sync) is guaranteed to run from the site entry point.
 */
const themeBrowser = require('gatsby-theme-chronogrove/gatsby-browser')

exports.wrapRootElement = themeBrowser.wrapRootElement
exports.onRouteUpdate = themeBrowser.onRouteUpdate
exports.shouldUpdateScroll = themeBrowser.shouldUpdateScroll
