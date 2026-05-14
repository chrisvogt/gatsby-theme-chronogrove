/**
 * Re-export only the theme's route hooks so color-mode stays in sync on
 * navigation. We do NOT re-export wrapRootElement or add gatsby-ssr.js:
 * the theme's APIs already run when the theme is a plugin. Re-exporting
 * them caused duplicate head (two emotion-insertion-point, duplicate
 * no-flash scripts) and double-wrapping (two RootWrappers fighting over
 * the DOM), which broke theme switching in production.
 */
const themeBrowser = require('gatsby-theme-chronogrove/gatsby-browser')

exports.onRouteUpdate = themeBrowser.onRouteUpdate
exports.shouldUpdateScroll = themeBrowser.shouldUpdateScroll
