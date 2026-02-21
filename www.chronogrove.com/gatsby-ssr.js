/**
 * Re-export the theme's SSR APIs so the color-mode no-flash script and fallback
 * CSS are injected into the head. When the theme is used as a workspace
 * dependency, this ensures the same initial theme state as www.chrisvogt.me.
 */
const themeSSR = require('gatsby-theme-chronogrove/gatsby-ssr')

exports.wrapRootElement = themeSSR.wrapRootElement
exports.onRenderBody = themeSSR.onRenderBody
exports.onPreRenderHTML = themeSSR.onPreRenderHTML
