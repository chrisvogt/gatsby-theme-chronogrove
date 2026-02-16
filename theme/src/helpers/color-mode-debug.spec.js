import { isColorModeDebugEnabled, logColorModeState } from './color-mode-debug'

describe('color-mode-debug', () => {
  beforeEach(() => {
    jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {})
  })

  afterEach(() => {
    console.groupCollapsed.mockRestore()
    console.log.mockRestore()
    console.groupEnd.mockRestore()
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
  })
})
