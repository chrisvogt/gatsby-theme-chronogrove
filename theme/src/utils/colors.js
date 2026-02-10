/**
 * Shared color utilities and constants for consistent button and UI styling.
 * Single source of truth for primary button colors and hex conversion.
 */

/** Fallback RGB string when hex is invalid (blue) */
const HEX_TO_RGB_FALLBACK = '74, 158, 255'

/**
 * Converts hex color to RGB string for use in rgba()
 * @param {string} hex - Hex color code (with or without #)
 * @returns {string} RGB values as comma-separated string (e.g. "66, 46, 163")
 */
export const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
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
