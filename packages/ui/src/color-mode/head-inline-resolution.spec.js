/**
 * @jest-environment jsdom
 */

import { CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME, THEME_UI_COLOR_MODE_STORAGE_KEY } from './constants.js'
import { buildInitialThemeUiColorModeResolutionInlineFragment } from './head-inline.js'

function expireCrossDomainColorModeCookie() {
  document.cookie = `${CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME}=; Path=/; Max-Age=0`
}

/**
 * Executes the same inline fragment used in no-flash / HTML background scripts to verify
 * cookie-vs-localStorage precedence without a full browser.
 */
function runResolutionFragment({ cookie, localStorageMap, prefersDark, crossDomainColorMode = null }) {
  expireCrossDomainColorModeCookie()
  document.cookie = cookie || ''
  window.localStorage.clear()
  if (localStorageMap) {
    for (const [k, v] of Object.entries(localStorageMap)) {
      window.localStorage.setItem(k, v)
    }
  }
  window.matchMedia = jest.fn(() => ({
    matches: Boolean(prefersDark),
    media: '(prefers-color-scheme: dark)',
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onchange: null
  }))

  const fragment = buildInitialThemeUiColorModeResolutionInlineFragment(
    THEME_UI_COLOR_MODE_STORAGE_KEY,
    crossDomainColorMode
  )

  // Run the real inline fragment like a browser would (no `Function` / eval: Sonar S1523).
  const exportKey = '__cgHeadInlineResolutionTestExport'
  const script = document.createElement('script')
  script.textContent = `${fragment}\nwindow['${exportKey}'] = mode;`
  document.documentElement.appendChild(script)
  script.remove()
  const mode = window[exportKey]
  delete window[exportKey]
  return mode
}

describe('buildInitialThemeUiColorModeResolutionInlineFragment', () => {
  beforeEach(() => {
    expireCrossDomainColorModeCookie()
    window.localStorage.clear()
  })

  it('prefers cookie over localStorage when both differ', () => {
    const mode = runResolutionFragment({
      cookie: 'chronogrove-theme-ui-color-mode=default',
      localStorageMap: { [THEME_UI_COLOR_MODE_STORAGE_KEY]: 'dark' },
      prefersDark: true,
      crossDomainColorMode: { registrableDomain: 'example.com' }
    })
    expect(mode).toBe('default')
    expect(window.localStorage.getItem(THEME_UI_COLOR_MODE_STORAGE_KEY)).toBe('default')
  })

  it('ignores cookie when registrableDomain is invalid (falls back to local-only logic)', () => {
    const mode = runResolutionFragment({
      cookie: 'chronogrove-theme-ui-color-mode=default',
      localStorageMap: { [THEME_UI_COLOR_MODE_STORAGE_KEY]: 'dark' },
      prefersDark: true,
      crossDomainColorMode: { registrableDomain: 'bad..tld' }
    })
    expect(mode).toBe('dark')
  })

  it('uses localStorage when cookie is absent', () => {
    const mode = runResolutionFragment({
      cookie: '',
      localStorageMap: { [THEME_UI_COLOR_MODE_STORAGE_KEY]: 'dark' },
      prefersDark: false
    })
    expect(mode).toBe('dark')
  })

  it('falls back to prefers-color-scheme when cookie and storage are empty', () => {
    const dark = runResolutionFragment({ cookie: '', localStorageMap: null, prefersDark: true })
    expect(dark).toBe('dark')
    expect(window.localStorage.getItem(THEME_UI_COLOR_MODE_STORAGE_KEY)).toBe('dark')

    window.localStorage.clear()
    const light = runResolutionFragment({ cookie: '', localStorageMap: null, prefersDark: false })
    expect(light).toBe('default')
  })

  it('normalizes light in localStorage to default', () => {
    const mode = runResolutionFragment({
      cookie: '',
      localStorageMap: { [THEME_UI_COLOR_MODE_STORAGE_KEY]: 'light' },
      prefersDark: false
    })
    expect(mode).toBe('default')
  })

  it('handles localStorage getItem throwing in legacy fragment', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const mode = runResolutionFragment({ cookie: '', localStorageMap: null, prefersDark: false })
    expect(mode).toBe('default')
    spy.mockRestore()
  })
})
