import { normalizeThemeUiColorMode } from './normalize'

describe('normalizeThemeUiColorMode', () => {
  it('maps light to default', () => {
    expect(normalizeThemeUiColorMode('light')).toBe('default')
  })

  it('passes through dark and default', () => {
    expect(normalizeThemeUiColorMode('dark')).toBe('dark')
    expect(normalizeThemeUiColorMode('default')).toBe('default')
  })

  it('returns null for unknown values', () => {
    expect(normalizeThemeUiColorMode('sepia')).toBe(null)
    expect(normalizeThemeUiColorMode(null)).toBe(null)
  })
})
