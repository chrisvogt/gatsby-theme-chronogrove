/**
 * @jest-environment jsdom
 */

import { resolveThemeUiColorMode, scheduleThemeUiColorModeSync, syncThemeUiColorMode } from './browser-sync'

describe('resolveThemeUiColorMode', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    delete document.documentElement.dataset.themeUiColorMode
    window.localStorage.clear()
    window.matchMedia = jest.fn(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      onchange: null
    }))
  })

  it('reads normalized mode from localStorage', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'dark')
    expect(resolveThemeUiColorMode()).toBe('dark')
  })

  it('reads from data-theme-ui-color-mode on documentElement', () => {
    document.documentElement.dataset.themeUiColorMode = 'dark'
    expect(resolveThemeUiColorMode()).toBe('dark')
  })

  it('reads mode when set via documentElement.dataset.themeUiColorMode', () => {
    document.documentElement.dataset.themeUiColorMode = 'dark'
    expect(resolveThemeUiColorMode()).toBe('dark')
  })

  it('infers default from theme-ui-light class', () => {
    document.documentElement.classList.add('theme-ui-light')
    expect(resolveThemeUiColorMode()).toBe('default')
  })

  it('infers dark from theme-ui-dark class when storage is empty', () => {
    document.documentElement.classList.add('theme-ui-dark')
    expect(resolveThemeUiColorMode()).toBe('dark')
  })

  it('treats unreadable localStorage as empty', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(resolveThemeUiColorMode()).toBe('default')
    Storage.prototype.getItem.mockRestore()
  })

  it('falls back to prefers-color-scheme: dark', () => {
    window.matchMedia = jest.fn(() => ({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      onchange: null
    }))
    expect(resolveThemeUiColorMode()).toBe('dark')
  })
})

describe('syncThemeUiColorMode', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    delete document.documentElement.dataset.themeUiColorMode
    window.localStorage.clear()
    window.matchMedia = jest.fn(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      onchange: null
    }))
  })

  it('applies theme-ui class and data attribute from resolved mode', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'dark')
    syncThemeUiColorMode()
    expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
    expect(document.documentElement.dataset.themeUiColorMode).toBe('dark')
    expect(document.documentElement.style.backgroundColor).toBe('rgb(20, 20, 31)')
  })

  it('sets html inline background for default mode', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'default')
    syncThemeUiColorMode()
    expect(document.documentElement.style.backgroundColor).toBe('rgb(253, 248, 245)')
  })

  it('strips prior theme-ui-* classes before applying', () => {
    document.documentElement.classList.add('theme-ui-light', 'theme-ui-other')
    window.localStorage.setItem('theme-ui-color-mode', 'dark')
    syncThemeUiColorMode()
    expect(document.documentElement.classList.contains('theme-ui-light')).toBe(false)
    expect(document.documentElement.classList.contains('theme-ui-other')).toBe(false)
    expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
  })

  it('returns early when documentElement is missing', () => {
    const spy = jest.spyOn(document, 'documentElement', 'get').mockReturnValue(null)
    expect(() => syncThemeUiColorMode()).not.toThrow()
    spy.mockRestore()
  })
})

describe('scheduleThemeUiColorModeSync', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    document.documentElement.className = ''
    window.localStorage.setItem('theme-ui-color-mode', 'light')
    window.requestAnimationFrame = jest.fn(cb => {
      cb()
      return 1
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('runs sync immediately and again on requestAnimationFrame when available', () => {
    const spy = jest.spyOn(window, 'requestAnimationFrame')
    scheduleThemeUiColorModeSync()
    expect(document.documentElement.classList.contains('theme-ui-default')).toBe(true)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('uses setTimeout when requestAnimationFrame is missing', () => {
    delete window.requestAnimationFrame
    scheduleThemeUiColorModeSync()
    jest.runAllTimers()
    expect(document.documentElement.classList.contains('theme-ui-default')).toBe(true)
  })
})
