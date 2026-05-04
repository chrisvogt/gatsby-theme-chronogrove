/**
 * Shared color utilities and constants for consistent button and UI styling.
 * Single source of truth for primary button colors and hex conversion.
 */

/** Fallback RGB string when hex is invalid (blue) */
const HEX_TO_RGB_FALLBACK = '74, 158, 255'

/**
 * Normalizes #rgb / #rgba shorthand, #rrggbb, or #rrggbbaa to #rrggbb for RGB extraction.
 * Appending two hex digits to 3-digit theme colors (e.g. `#111` + `22`) is not valid CSS.
 *
 * @param {string} hex
 * @returns {string|null} `#rrggbb` or null if not parseable as hex
 */
export const normalizeHexToRrggbb = hex => {
  if (typeof hex !== 'string') return null
  const raw = hex.trim().replace(/^#/, '')
  if (!raw || !/^[a-f\d]+$/i.test(raw)) return null
  if (raw.length === 3) {
    return `#${[...raw].map(c => c + c).join('')}`
  }
  if (raw.length === 4) {
    const [r, g, b] = raw
    return `#${r}${r}${g}${g}${b}${b}`
  }
  if (raw.length === 6) return `#${raw}`
  if (raw.length === 8) return `#${raw.slice(0, 6)}`
  return null
}

/**
 * Converts hex color to RGB string for use in rgba()
 * @param {string} hex - Hex color code (with or without #); 3- and 4-digit shorthand supported
 * @returns {string} RGB values as comma-separated string (e.g. "66, 46, 163")
 */
export const hexToRgb = hex => {
  const rrggbb = normalizeHexToRrggbb(hex)
  if (!rrggbb) return HEX_TO_RGB_FALLBACK
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rrggbb)
  if (!result) return HEX_TO_RGB_FALLBACK
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

/**
 * Converts hex color to rgba string
 * @param {string} hex - Hex color code (with or without #)
 * @param {number} alpha - Alpha value 0–1
 * @returns {string} rgba() CSS value
 */
export const hexToRgba = (hex, alpha) => {
  return `rgba(${hexToRgb(hex)}, ${alpha})`
}

/**
 * Primary button/CTA colors for light and dark mode.
 * Aligns with theme colors.primary and theme.colors.primaryRgb.
 */
export const BUTTON_PRIMARY_COLORS = {
  light: '#422EA3',
  dark: '#4a9eff'
}
