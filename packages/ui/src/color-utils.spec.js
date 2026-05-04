import { hexToRgb, hexToRgba, normalizeHexToRrggbb, BUTTON_PRIMARY_COLORS } from './color-utils'

describe('normalizeHexToRrggbb', () => {
  it('expands 3-digit shorthand', () => {
    expect(normalizeHexToRrggbb('#111')).toBe('#111111')
    expect(normalizeHexToRrggbb('#fff')).toBe('#ffffff')
    expect(normalizeHexToRrggbb('abc')).toBe('#aabbcc')
  })

  it('expands 4-digit shorthand to RGB only', () => {
    expect(normalizeHexToRrggbb('#f0f8')).toBe('#ff00ff')
  })

  it('passes through 6-digit and strips alpha from 8-digit', () => {
    expect(normalizeHexToRrggbb('#112233')).toBe('#112233')
    expect(normalizeHexToRrggbb('#11223344')).toBe('#112233')
  })

  it('returns null for invalid input', () => {
    expect(normalizeHexToRrggbb('')).toBeNull()
    expect(normalizeHexToRrggbb('not-hex')).toBeNull()
    expect(normalizeHexToRrggbb('#12')).toBeNull()
    expect(normalizeHexToRrggbb(null)).toBeNull()
  })
})

describe('hexToRgb', () => {
  it('converts hex with hash to RGB', () => {
    expect(hexToRgb('#422EA3')).toBe('66, 46, 163')
  })

  it('converts 3-digit shorthand (theme text colors)', () => {
    expect(hexToRgb('#111')).toBe('17, 17, 17')
    expect(hexToRgb('#fff')).toBe('255, 255, 255')
  })

  it('converts hex without hash to RGB', () => {
    expect(hexToRgb('4a9eff')).toBe('74, 158, 255')
  })

  it('returns fallback for invalid hex', () => {
    expect(hexToRgb('invalid')).toBe('74, 158, 255')
  })

  it('returns fallback for empty string', () => {
    expect(hexToRgb('')).toBe('74, 158, 255')
  })
})

describe('hexToRgba', () => {
  it('converts hex to rgba string', () => {
    expect(hexToRgba('#422EA3', 0.5)).toBe('rgba(66, 46, 163, 0.5)')
  })

  it('supports 3-digit shorthand with fractional alpha', () => {
    expect(hexToRgba('#111', 34 / 255)).toBe('rgba(17, 17, 17, 0.13333333333333333)')
  })

  it('accepts hex without hash', () => {
    expect(hexToRgba('4a9eff', 1)).toBe('rgba(74, 158, 255, 1)')
  })

  it('uses fallback RGB for invalid hex', () => {
    expect(hexToRgba('invalid', 0.2)).toBe('rgba(74, 158, 255, 0.2)')
  })
})

describe('BUTTON_PRIMARY_COLORS', () => {
  it('exports light mode color', () => {
    expect(BUTTON_PRIMARY_COLORS.light).toBe('#422EA3')
  })

  it('exports dark mode color', () => {
    expect(BUTTON_PRIMARY_COLORS.dark).toBe('#4a9eff')
  })
})
