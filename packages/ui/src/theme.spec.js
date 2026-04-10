import theme from './theme.js'
import { tailwind } from '@theme-ui/presets'
import { merge } from 'theme-ui'

jest.mock('theme-ui', () => ({
  merge: jest.fn((...args) => Object.assign({}, ...args))
}))

describe('Theme Configuration', () => {
  describe('a snapshot of the configuration', () => {
    it('matches the snapshot', () => {
      expect(theme).toMatchSnapshot()
    })
  })

  describe('general configurations', () => {
    it('merges with Tailwind preset', () => {
      const mergedTheme = merge(tailwind, theme)
      expect(mergedTheme).toBeTruthy()
    })

    it('configures color mode with localStorage and no media-query override', () => {
      expect(theme.config.initialColorModeName).toBe('default')
      expect(theme.config.useColorSchemeMediaQuery).toBe(false)
      expect(theme.config.useCustomProperties).toBe(true)
      expect(theme.config.useLocalStorage).toBe(true)
    })
  })

  describe('font definitions', () => {
    it('defines sans-serif fonts correctly', () => {
      expect(theme.fonts.sans).toContain('sans-serif')
    })

    it('defines serif fonts correctly', () => {
      expect(theme.fonts.serif).toContain('Iowan Old Style')
    })

    it('defines monospace fonts correctly', () => {
      expect(theme.fonts.monospace).toContain('Menlo')
    })
  })

  describe('color mode configurations', () => {
    it('defines light mode background colors', () => {
      expect(theme.colors.background).toBe('#fdf8f5')
      expect(theme.colors['panel-background']).toContain('rgba(255, 255, 255, 0.45)')
    })

    it('defines dark mode background colors', () => {
      const darkMode = theme.colors.modes.dark
      expect(darkMode).toHaveProperty('background', '#14141F')
      expect(darkMode).toHaveProperty('primary', '#4a9eff')
    })
  })
})
