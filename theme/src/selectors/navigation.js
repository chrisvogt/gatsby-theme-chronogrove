const HTTP_SCHEME = /^https?:\/\//i

/**
 * @param {string|undefined} path
 * @returns {boolean} True if `path` is an http(s) URL (footer/source links), false for site-relative paths.
 */
export const isExternalNavigationPath = path => Boolean(path && HTTP_SCHEME.test(path))

export const getHeaderLeftItems = navigation => (Array.isArray(navigation?.header?.left) ? navigation.header.left : [])

export const getFooterLinkItems = navigation => (Array.isArray(navigation?.footer) ? navigation.footer : [])
