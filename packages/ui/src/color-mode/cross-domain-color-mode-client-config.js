import { CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME } from './constants.js'

/**
 * Browser-only config for {@link setChronogroveCrossDomainColorModeCookie} (must match the
 * `crossDomainColorMode` passed into head inline scripts at build time). Set via
 * {@link setChronogroveCrossDomainColorModeClientConfig} from Gatsby `onClientEntry`, Next
 * `ChronogroveNextAppShell`, or your own bootstrap.
 */

let clientConfig = /** @type {{ registrableDomain?: string, cookieName?: string } | null} */ (null)

export function setChronogroveCrossDomainColorModeClientConfig(next) {
  if (next == null) {
    clientConfig = null
    return
  }
  if (typeof next !== 'object') {
    return
  }
  const { registrableDomain, cookieName } = next
  if (!registrableDomain || typeof registrableDomain !== 'string' || !registrableDomain.trim()) {
    clientConfig = null
    return
  }
  clientConfig = {
    registrableDomain: registrableDomain.trim(),
    cookieName: cookieName ?? CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
  }
}

export function getChronogroveCrossDomainColorModeClientConfig() {
  return clientConfig
}
