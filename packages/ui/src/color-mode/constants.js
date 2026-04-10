/** Theme UI localStorage key (aligned with theme-ui/color-mode). */
export const THEME_UI_COLOR_MODE_STORAGE_KEY = 'theme-ui-color-mode'

/** Dispatched on route changes so hosts can reconcile React color-mode context with `localStorage`. */
export const RECONCILE_COLOR_MODE_EVENT = 'theme-ui-reconcile-color-mode'

/** `key` props for Gatsby `onPreRenderHTML` head ordering (color-mode first). */
export const CHRONOGROVE_COLOR_MODE_HEAD_PRIORITY_KEYS = [
  'theme-ui-no-flash',
  'html-bg-color',
  'theme-ui-color-mode-fallback'
]
