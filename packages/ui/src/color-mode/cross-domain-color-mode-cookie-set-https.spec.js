/**
 * @jest-environment jsdom
 * @jest-environment-options {"url":"https://www.example.com/path"}
 */

import { CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME } from './constants.js'
import { setChronogroveCrossDomainColorModeCookie } from './cross-domain-color-mode-cookie.js'

const exampleDomain = { registrableDomain: 'example.com' }

describe('setChronogroveCrossDomainColorModeCookie (https, cross-domain enabled)', () => {
  let lastAssignment = ''
  let originalDescriptor

  beforeEach(() => {
    lastAssignment = ''
    originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get() {
        if (!lastAssignment) return ''
        return lastAssignment.split(';')[0].trim()
      },
      set(value) {
        lastAssignment = value
      }
    })
  })

  afterEach(() => {
    if (originalDescriptor) {
      Object.defineProperty(Document.prototype, 'cookie', originalDescriptor)
    }
  })

  it('sets Domain, SameSite, Max-Age, and Secure on HTTPS (assignment string)', () => {
    expect(window.location.hostname).toBe('www.example.com')
    setChronogroveCrossDomainColorModeCookie('dark', exampleDomain)
    expect(lastAssignment).toContain(`${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=dark`)
    expect(lastAssignment).toContain('Domain=.example.com')
    expect(lastAssignment).toContain('SameSite=Lax')
    expect(lastAssignment).toContain('Max-Age=')
    expect(lastAssignment).toContain('Secure')
  })

  it('ignores invalid mode values', () => {
    setChronogroveCrossDomainColorModeCookie('not-a-mode', exampleDomain)
    expect(lastAssignment).toBe('')
  })
})
