import {
  CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_MAX_AGE_SEC,
  CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
} from './constants.js'
import { normalizeThemeUiColorMode } from './normalize.js'
import { isHostnameUnderRegistrableDomain, validateRegistrableDomain } from './registrable-domain.js'

/**
 * Read `window.location.hostname` when `location` exists (for tests, pass a stub `globalWindow`).
 * Call with **no arguments** to use the real `window`; passing `undefined` explicitly is treated as
 * “no window” (tests only).
 */
export function getHostnameForChronogroveCrossDomainCookie(globalWindow) {
  let win
  if (arguments.length === 0) {
    win = typeof window !== 'undefined' ? window : undefined
  } else {
    win = globalWindow
  }
  if (!win?.location) {
    return ''
  }
  return win.location.hostname || ''
}

/** Whether to append `Secure` to the cross-domain cookie (HTTPS only). */
export function shouldUseSecureChronogroveCrossDomainCookie(globalWindow) {
  let win
  if (arguments.length === 0) {
    win = typeof window !== 'undefined' ? window : undefined
  } else {
    win = globalWindow
  }
  return win?.location?.protocol === 'https:'
}

/**
 * Read a single cookie value from a `document.cookie`-style string (for tests and SSR-safe parsing).
 */
export function parseChronogroveColorModeCookie(
  cookieString,
  cookieName = CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
) {
  if (!cookieString) {
    return null
  }
  const parts = `; ${cookieString}`.split(`; ${cookieName}=`)
  if (parts.length < 2) {
    return null
  }
  const raw = parts.pop().split(';').shift()
  if (raw == null || raw === '') {
    return null
  }
  let decoded
  try {
    decoded = decodeURIComponent(raw.trim())
  } catch {
    decoded = raw.trim()
  }
  return normalizeThemeUiColorMode(decoded)
}

export function getChronogroveCrossDomainColorModeFromCookie(
  cookieString = typeof document !== 'undefined' ? document.cookie : ''
) {
  return parseChronogroveColorModeCookie(cookieString)
}

/**
 * Persist color mode for other subdomains of `options.registrableDomain`. No-op without `document`,
 * without a valid `registrableDomain`, or when the current host is not under that domain.
 *
 * @param {string} mode
 * @param {{ registrableDomain: string, cookieName?: string } | null | undefined} [options]
 */
export function setChronogroveCrossDomainColorModeCookie(mode, options) {
  if (typeof document === 'undefined') {
    return
  }
  const normalized = normalizeThemeUiColorMode(mode)
  if (!normalized) {
    return
  }
  const registrableDomain = options && validateRegistrableDomain(options.registrableDomain)
  if (!registrableDomain) {
    return
  }
  const hostname = getHostnameForChronogroveCrossDomainCookie()
  if (!isHostnameUnderRegistrableDomain(hostname, registrableDomain)) {
    return
  }

  const cookieName = options.cookieName ?? CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
  const value = encodeURIComponent(normalized)
  let cookie = `${cookieName}=${value}; Path=/; Max-Age=${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_MAX_AGE_SEC}; SameSite=Lax; Domain=.${registrableDomain}`
  if (shouldUseSecureChronogroveCrossDomainCookie()) {
    cookie += '; Secure'
  }
  document.cookie = cookie
}
