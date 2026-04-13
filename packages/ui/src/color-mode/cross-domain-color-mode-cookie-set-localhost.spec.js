/**
 * @jest-environment jsdom
 * @jest-environment-options {"url":"http://localhost:3000/"}
 */

import { setChronogroveCrossDomainColorModeCookie } from './cross-domain-color-mode-cookie.js'

describe('setChronogroveCrossDomainColorModeCookie (localhost)', () => {
  it('does not set when hostname is not under the registrable domain', () => {
    expect(window.location.hostname).toBe('localhost')
    document.cookie = ''
    setChronogroveCrossDomainColorModeCookie('dark', { registrableDomain: 'example.com' })
    expect(document.cookie).toBe('')
  })
})
