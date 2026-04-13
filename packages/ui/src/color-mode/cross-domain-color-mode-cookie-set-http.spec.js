/**
 * @jest-environment jsdom
 * @jest-environment-options {"url":"http://app.example.com/"}
 */

import { CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME } from './constants.js'
import { setChronogroveCrossDomainColorModeCookie } from './cross-domain-color-mode-cookie.js'

const exampleDomain = { registrableDomain: 'example.com' }

describe('setChronogroveCrossDomainColorModeCookie (http, cross-domain enabled)', () => {
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

  it('omits Secure when not on HTTPS', () => {
    expect(window.location.protocol).toBe('http:')
    setChronogroveCrossDomainColorModeCookie('default', exampleDomain)
    expect(lastAssignment).toContain(`${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=default`)
    expect(lastAssignment).not.toContain('Secure')
  })
})
