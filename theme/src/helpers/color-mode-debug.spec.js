import { isColorModeDebugEnabled, logColorModeState, logColorModeDebugBanner } from './color-mode-debug'

describe('color-mode-debug', () => {
  beforeEach(() => {
    jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    console.groupCollapsed.mockRestore()
    console.log.mockRestore()
    console.groupEnd.mockRestore()
    console.warn.mockRestore()
    if (global.window) {
      delete global.window.__THEME_UI_COLOR_MODE_DEBUG__
    }
  })

  describe('isColorModeDebugEnabled', () => {
    it('returns true when window.__THEME_UI_COLOR_MODE_DEBUG__ is true', () => {
      global.window.__THEME_UI_COLOR_MODE_DEBUG__ = true
      expect(isColorModeDebugEnabled()).toBe(true)
    })

    it('returns true when localStorage theme-ui-color-mode-debug is "1"', () => {
      delete global.window.__THEME_UI_COLOR_MODE_DEBUG__
      try {
        localStorage.setItem('theme-ui-color-mode-debug', '1')
        expect(isColorModeDebugEnabled()).toBe(true)
      } finally {
        localStorage.removeItem('theme-ui-color-mode-debug')
      }
    })

    it('returns true when localStorage theme-ui-color-mode-debug is "true"', () => {
      delete global.window.__THEME_UI_COLOR_MODE_DEBUG__
      try {
        localStorage.setItem('theme-ui-color-mode-debug', 'true')
        expect(isColorModeDebugEnabled()).toBe(true)
      } finally {
        localStorage.removeItem('theme-ui-color-mode-debug')
      }
    })

    it('returns false when debug flag is not set', () => {
      delete global.window.__THEME_UI_COLOR_MODE_DEBUG__
      localStorage.removeItem('theme-ui-color-mode-debug')
      expect(isColorModeDebugEnabled()).toBe(false)
    })

    it('returns true when URL has ?theme-ui-color-mode-debug', () => {
      delete global.window.__THEME_UI_COLOR_MODE_DEBUG__
      localStorage.removeItem('theme-ui-color-mode-debug')
      const OriginalURLSearchParams = window.URLSearchParams
      window.URLSearchParams = class MockURLSearchParams {
        constructor() {}
        get(key) {
          return key === 'theme-ui-color-mode-debug' ? '' : null
        }
      }
      expect(isColorModeDebugEnabled()).toBe(true)
      window.URLSearchParams = OriginalURLSearchParams
    })

    it('returns false when localStorage.getItem throws', () => {
      delete global.window.__THEME_UI_COLOR_MODE_DEBUG__
      const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage unavailable')
      })
      expect(isColorModeDebugEnabled()).toBe(false)
      getItem.mockRestore()
    })
  })

  describe('logColorModeDebugBanner', () => {
    it('does not throw', () => {
      expect(() => logColorModeDebugBanner()).not.toThrow()
    })

    it('logs banner when URL has ?theme-ui-color-mode-debug', () => {
      const OriginalURLSearchParams = window.URLSearchParams
      window.URLSearchParams = class MockURLSearchParams {
        constructor() {}
        get(key) {
          return key === 'theme-ui-color-mode-debug' ? '' : null
        }
      }
      logColorModeDebugBanner()
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[theme-ui] Color mode debug enabled via ?theme-ui-color-mode-debug')
      )
      window.URLSearchParams = OriginalURLSearchParams
    })

    it('does not throw when URLSearchParams throws', () => {
      const OriginalURLSearchParams = window.URLSearchParams
      window.URLSearchParams = class {
        constructor() {
          throw new Error('URLSearchParams unavailable')
        }
      }
      expect(() => logColorModeDebugBanner()).not.toThrow()
      window.URLSearchParams = OriginalURLSearchParams
    })
  })

  describe('logColorModeState', () => {
    it('does not log when debug is disabled', () => {
      global.localStorage.getItem = jest.fn(() => null)
      logColorModeState('default', { colors: { text: '#111' } }, 'Test')
      expect(console.groupCollapsed).not.toHaveBeenCalled()
    })

    it('logs when debug is enabled', () => {
      global.window.__THEME_UI_COLOR_MODE_DEBUG__ = true
      document.documentElement.setAttribute('data-theme-ui-color-mode', 'default')

      logColorModeState('default', { colors: { text: '#111', background: '#fdf8f5' } }, 'Test')

      expect(console.groupCollapsed).toHaveBeenCalled()
      expect(console.log).toHaveBeenCalled()
      expect(console.groupEnd).toHaveBeenCalled()
    })

    it('calls console.warn when debug log throws', () => {
      global.window.__THEME_UI_COLOR_MODE_DEBUG__ = true
      const getComputedStyle = jest.spyOn(window, 'getComputedStyle').mockImplementation(() => {
        throw new Error('getComputedStyle failed')
      })

      logColorModeState('default', {}, 'Test')

      expect(console.warn).toHaveBeenCalledWith('[theme-ui color-mode] debug log failed', expect.any(Error))
      getComputedStyle.mockRestore()
    })
  })
})
