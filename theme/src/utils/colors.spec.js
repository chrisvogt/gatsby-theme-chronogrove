import { hexToRgb, hexToRgba, BUTTON_PRIMARY_COLORS } from './colors'

describe('hexToRgb', () => {
  it('converts hex with hash to RGB', () => {
    expect(hexToRgb('#422EA3')).toBe('66, 46, 163')
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
