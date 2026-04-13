/**
 * @jest-environment jsdom
 */

import { CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME } from './constants.js'
import {
  getChronogroveCrossDomainColorModeFromCookie,
  getHostnameForChronogroveCrossDomainCookie,
  parseChronogroveColorModeCookie,
  setChronogroveCrossDomainColorModeCookie,
  shouldUseSecureChronogroveCrossDomainCookie
} from './cross-domain-color-mode-cookie.js'

describe('getHostnameForChronogroveCrossDomainCookie', () => {
  it('returns empty string when window is missing or has no location', () => {
    expect(getHostnameForChronogroveCrossDomainCookie(undefined)).toBe('')
    expect(getHostnameForChronogroveCrossDomainCookie(null)).toBe('')
    expect(getHostnameForChronogroveCrossDomainCookie({})).toBe('')
    expect(getHostnameForChronogroveCrossDomainCookie({ location: null })).toBe('')
  })

  it('returns hostname or empty when location exists', () => {
    expect(getHostnameForChronogroveCrossDomainCookie({ location: { hostname: 'www.example.com' } })).toBe(
      'www.example.com'
    )
    expect(getHostnameForChronogroveCrossDomainCookie({ location: { hostname: '' } })).toBe('')
  })
})

describe('shouldUseSecureChronogroveCrossDomainCookie', () => {
  it('is true only for https:', () => {
    expect(shouldUseSecureChronogroveCrossDomainCookie(undefined)).toBe(false)
    expect(shouldUseSecureChronogroveCrossDomainCookie({})).toBe(false)
    expect(shouldUseSecureChronogroveCrossDomainCookie({ location: { protocol: 'http:' } })).toBe(false)
    expect(shouldUseSecureChronogroveCrossDomainCookie({ location: { protocol: 'https:' } })).toBe(true)
    expect(shouldUseSecureChronogroveCrossDomainCookie({ location: {} })).toBe(false)
  })
})

describe('setChronogroveCrossDomainColorModeCookie', () => {
  it('no-ops without options.registrableDomain', () => {
    document.cookie = ''
    setChronogroveCrossDomainColorModeCookie('dark')
    setChronogroveCrossDomainColorModeCookie('dark', {})
    setChronogroveCrossDomainColorModeCookie('dark', { registrableDomain: '  ' })
    expect(document.cookie).toBe('')
  })
})

describe('parseChronogroveColorModeCookie', () => {
  it('returns normalized mode when cookie is present', () => {
    expect(
      parseChronogroveColorModeCookie(
        `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=dark`,
        CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
      )
    ).toBe('dark')
    expect(
      parseChronogroveColorModeCookie(
        `other=1; ${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=default`,
        CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
      )
    ).toBe('default')
  })

  it('maps light to default', () => {
    expect(
      parseChronogroveColorModeCookie(
        `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=light`,
        CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
      )
    ).toBe('default')
  })

  it('returns null for missing or invalid values', () => {
    expect(parseChronogroveColorModeCookie('', CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME)).toBe(null)
    expect(parseChronogroveColorModeCookie('other=1', CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME)).toBe(null)
    expect(
      parseChronogroveColorModeCookie(
        `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=`,
        CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
      )
    ).toBe(null)
    expect(
      parseChronogroveColorModeCookie(
        `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=nope`,
        CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
      )
    ).toBe(null)
  })

  it('falls back to raw when decodeURIComponent throws', () => {
    expect(
      parseChronogroveColorModeCookie(
        `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=%`,
        CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
      )
    ).toBe(null)
  })

  it('decodes URI-encoded values', () => {
    expect(
      parseChronogroveColorModeCookie(
        `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=dark`,
        CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
      )
    ).toBe('dark')
  })
})

describe('getChronogroveCrossDomainColorModeFromCookie', () => {
  beforeEach(() => {
    document.cookie = `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=; Path=/; Max-Age=0`
  })

  it('reads from document.cookie when called with no arguments', () => {
    document.cookie = `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=dark`
    expect(getChronogroveCrossDomainColorModeFromCookie()).toBe('dark')
  })
})
