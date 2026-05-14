const HTTP_SCHEME = /^https?:\/\//i

// Feeds, manifests, and other build outputs are not Gatsby pages — gatsby-link prefetch/page-data can 404 or hang.
const STATIC_OUTPUT_EXT = /\.(?:atom|ico|pdf|rss|txt|webmanifest|xml|zip)$/i

const pathWithoutQueryOrHash = path => (typeof path === 'string' ? path.replace(/[?#].*/, '') : '')

/**
 * @param {string|undefined} path
 * @returns {boolean} True if `path` is an http(s) URL (footer/source links), false for site-relative paths.
 */
export const isExternalNavigationPath = path => Boolean(path && HTTP_SCHEME.test(path))

/**
 * @param {string|undefined} path
 * @returns {boolean} True if `path` is site-relative and looks like a static file (e.g. `/rss.xml`).
 */
export const isStaticOutputNavigationPath = path =>
  Boolean(path && !isExternalNavigationPath(path) && STATIC_OUTPUT_EXT.test(pathWithoutQueryOrHash(path)))

/**
 * Prefer a native `<a href>` (Theme UI link) instead of Gatsby `Link` when client routing / prefetch is unsafe.
 *
 * @param {string|undefined} path
 * @param {{ nativeAnchor?: boolean }} [item]
 */
export const shouldUseNativeNavigationLink = (path, item) =>
  Boolean(isExternalNavigationPath(path) || isStaticOutputNavigationPath(path) || (item && item.nativeAnchor === true))

export const getHeaderLeftItems = navigation => (Array.isArray(navigation?.header?.left) ? navigation.header.left : [])

export const getFooterLinkItems = navigation => (Array.isArray(navigation?.footer) ? navigation.footer : [])
