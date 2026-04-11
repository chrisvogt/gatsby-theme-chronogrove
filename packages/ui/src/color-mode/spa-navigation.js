import { RECONCILE_COLOR_MODE_EVENT } from './constants.js'
import { scheduleThemeUiColorModeSync } from './browser-sync.js'

/**
 * Run after client-side navigations (e.g. Next.js App Router) so Theme UI color mode stays aligned
 * with `localStorage` and the document. Dispatches {@link RECONCILE_COLOR_MODE_EVENT} for listeners.
 * Same behavior as {@link onRouteUpdateThemeUiColorMode} in `@chronogrove/ui/gatsby`.
 */
export function reconcileThemeUiColorModeOnNavigation() {
  scheduleThemeUiColorModeSync()
  if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
    window.dispatchEvent(new window.CustomEvent(RECONCILE_COLOR_MODE_EVENT))
  }
}
