/** Theme UI localStorage key (aligned with theme-ui/color-mode). */
export const THEME_UI_COLOR_MODE_STORAGE_KEY = 'theme-ui-color-mode'

/** Default cookie name when `cookieName` is omitted from cross-domain color mode options. */
export const CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME = 'chronogrove-theme-ui-color-mode'

/** ~400 days; browser cookie eviction policies may apply earlier. */
export const CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 400

/** Dispatched on route changes so hosts can reconcile React color-mode context with `localStorage`. */
export const RECONCILE_COLOR_MODE_EVENT = 'theme-ui-reconcile-color-mode'

/** `key` props for Gatsby `onPreRenderHTML` head ordering (color-mode first). */
export const CHRONOGROVE_COLOR_MODE_HEAD_PRIORITY_KEYS = [
  'theme-ui-no-flash',
  'html-bg-color',
  'theme-ui-color-mode-fallback'
]
