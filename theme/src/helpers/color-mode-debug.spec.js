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
      delete global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__
    }
  })

  describe('isColorModeDebugEnabled', () => {
    it('returns true when window.__CHRONOGROVE_DEBUG_COLOR_MODE__ is true', () => {
      global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__ = true
      expect(isColorModeDebugEnabled()).toBe(true)
    })

    it('returns true when localStorage chronogrove-debug-color-mode is "1"', () => {
      delete global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__
      try {
        localStorage.setItem('chronogrove-debug-color-mode', '1')
        expect(isColorModeDebugEnabled()).toBe(true)
      } finally {
        localStorage.removeItem('chronogrove-debug-color-mode')
      }
    })

    it('returns true when localStorage chronogrove-debug-color-mode is "true"', () => {
      delete global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__
      try {
        localStorage.setItem('chronogrove-debug-color-mode', 'true')
        expect(isColorModeDebugEnabled()).toBe(true)
      } finally {
        localStorage.removeItem('chronogrove-debug-color-mode')
      }
    })

    it('returns false when debug flag is not set', () => {
      delete global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__
      localStorage.removeItem('chronogrove-debug-color-mode')
      expect(isColorModeDebugEnabled()).toBe(false)
    })

    it('returns true when URL has ?chronogrove-color-debug', () => {
      delete global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__
      localStorage.removeItem('chronogrove-debug-color-mode')
      const OriginalURLSearchParams = window.URLSearchParams
      window.URLSearchParams = class MockURLSearchParams {
        constructor() {}
        get(key) {
          return key === 'chronogrove-color-debug' ? '' : null
        }
      }
      expect(isColorModeDebugEnabled()).toBe(true)
      window.URLSearchParams = OriginalURLSearchParams
    })

    it('returns false when localStorage.getItem throws', () => {
      delete global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__
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

    it('logs banner when URL has ?chronogrove-color-debug', () => {
      const OriginalURLSearchParams = window.URLSearchParams
      window.URLSearchParams = class MockURLSearchParams {
        constructor() {}
        get(key) {
          return key === 'chronogrove-color-debug' ? '' : null
        }
      }
      logColorModeDebugBanner()
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[chronogrove] Color mode debug enabled via ?chronogrove-color-debug')
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
      global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__ = true
      document.documentElement.setAttribute('data-theme-ui-color-mode', 'default')

      logColorModeState('default', { colors: { text: '#111', background: '#fdf8f5' } }, 'Test')

      expect(console.groupCollapsed).toHaveBeenCalled()
      expect(console.log).toHaveBeenCalled()
      expect(console.groupEnd).toHaveBeenCalled()
    })

    it('calls console.warn when debug log throws', () => {
      global.window.__CHRONOGROVE_DEBUG_COLOR_MODE__ = true
      const getComputedStyle = jest.spyOn(window, 'getComputedStyle').mockImplementation(() => {
        throw new Error('getComputedStyle failed')
      })

      logColorModeState('default', {}, 'Test')

      expect(console.warn).toHaveBeenCalledWith('[chronogrove color-mode] debug log failed', expect.any(Error))
      getComputedStyle.mockRestore()
    })
  })
})
