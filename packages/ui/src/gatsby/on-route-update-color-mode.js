import { RECONCILE_COLOR_MODE_EVENT } from '../color-mode/constants.js'
import { scheduleThemeUiColorModeSync } from '../color-mode/browser-sync.js'

/**
 * Call from Gatsby `onRouteUpdate` so Theme UI color mode stays aligned with `localStorage` and the
 * document after client-side navigations. Dispatches {@link RECONCILE_COLOR_MODE_EVENT} for app code
 * that listens (e.g. React context reconciliation).
 */
export function onRouteUpdateThemeUiColorMode() {
  scheduleThemeUiColorModeSync()
  if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
    window.dispatchEvent(new window.CustomEvent(RECONCILE_COLOR_MODE_EVENT))
  }
}
