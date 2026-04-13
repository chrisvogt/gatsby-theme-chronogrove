/**
 * @jest-environment jsdom
 */

import { CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME } from './constants.js'
import {
  getChronogroveCrossDomainColorModeClientConfig,
  setChronogroveCrossDomainColorModeClientConfig
} from './cross-domain-color-mode-client-config.js'

describe('cross-domain-color-mode-client-config', () => {
  afterEach(() => {
    setChronogroveCrossDomainColorModeClientConfig(null)
  })

  it('stores registrableDomain and optional cookieName', () => {
    setChronogroveCrossDomainColorModeClientConfig({
      registrableDomain: 'example.com',
      cookieName: 'my-mode'
    })
    expect(getChronogroveCrossDomainColorModeClientConfig()).toEqual({
      registrableDomain: 'example.com',
      cookieName: 'my-mode'
    })
  })

  it('uses default cookie name when cookieName is omitted', () => {
    setChronogroveCrossDomainColorModeClientConfig({ registrableDomain: 'example.com' })
    expect(getChronogroveCrossDomainColorModeClientConfig()?.cookieName).toBe(
      CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
    )
  })

  it('clears config for null, invalid, or empty registrableDomain', () => {
    setChronogroveCrossDomainColorModeClientConfig({ registrableDomain: 'example.com' })
    setChronogroveCrossDomainColorModeClientConfig(null)
    expect(getChronogroveCrossDomainColorModeClientConfig()).toBe(null)

    setChronogroveCrossDomainColorModeClientConfig({ registrableDomain: '  ' })
    expect(getChronogroveCrossDomainColorModeClientConfig()).toBe(null)

    setChronogroveCrossDomainColorModeClientConfig('oops')
    expect(getChronogroveCrossDomainColorModeClientConfig()).toBe(null)
  })
})
