'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { reconcileThemeUiColorModeOnNavigation } from '../color-mode/index.js'

/**
 * Keeps Theme UI color mode aligned after Next.js **client-side navigations** (same role as Gatsby
 * `onRouteUpdate`). Do **not** run on initial mount: `reconcileThemeUiColorModeOnNavigation` syncs the
 * DOM from `localStorage`, while Theme UI applies a toggle by updating React state first and writing
 * `localStorage` in a `useEffect` — an eager reconcile can re-read stale `localStorage` and force
 * the page back to the previous mode (e.g. stuck in dark).
 */
export function ChronogroveNextThemeUiColorModeRouteSync() {
  const pathname = usePathname()
  const previousPathname = useRef(null)

  useEffect(() => {
    if (previousPathname.current === null) {
      previousPathname.current = pathname
      return
    }
    if (previousPathname.current === pathname) {
      return
    }
    previousPathname.current = pathname
    reconcileThemeUiColorModeOnNavigation()
  }, [pathname])

  return null
}
