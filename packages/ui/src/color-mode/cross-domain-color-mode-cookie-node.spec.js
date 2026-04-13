/**
 * @jest-environment node
 */

import {
  getChronogroveCrossDomainColorModeFromCookie,
  getHostnameForChronogroveCrossDomainCookie,
  setChronogroveCrossDomainColorModeCookie,
  shouldUseSecureChronogroveCrossDomainCookie
} from './cross-domain-color-mode-cookie.js'

describe('cross-domain color mode cookie (Node / SSR)', () => {
  it('setChronogroveCrossDomainColorModeCookie returns without throwing when document is undefined', () => {
    expect(() => setChronogroveCrossDomainColorModeCookie('dark')).not.toThrow()
  })

  it('getChronogroveCrossDomainColorModeFromCookie uses empty string when document is undefined', () => {
    expect(getChronogroveCrossDomainColorModeFromCookie()).toBe(null)
  })

  it('getHostnameForChronogroveCrossDomainCookie() returns empty when global window is absent', () => {
    expect(getHostnameForChronogroveCrossDomainCookie()).toBe('')
  })

  it('shouldUseSecureChronogroveCrossDomainCookie() is false when global window is absent', () => {
    expect(shouldUseSecureChronogroveCrossDomainCookie()).toBe(false)
  })
})
