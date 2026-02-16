/**
 * Color mode debug logging. Enable by setting localStorage or window flag:
 *   localStorage.setItem('chronogrove-debug-color-mode', '1')
 *   window.__CHRONOGROVE_DEBUG_COLOR_MODE__ = true
 * Disable by removing the key or setting the flag to false.
 *
 * Logs color mode, theme colors, and computed CSS variables to help troubleshoot
 * stuck text (e.g. white text on light background when switching to light mode).
 */

const DEBUG_KEY = 'chronogrove-debug-color-mode'

export function isColorModeDebugEnabled() {
  if (typeof window === 'undefined') return false
  try {
    if (window.__CHRONOGROVE_DEBUG_COLOR_MODE__ === true) return true
    return localStorage.getItem(DEBUG_KEY) === '1' || localStorage.getItem(DEBUG_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Log current color mode state and computed styles for troubleshooting.
 * No-op when debug is disabled.
 *
 * @param {string} colorMode - Current Theme UI color mode ('default' | 'dark')
 * @param {object} theme - Theme object from useThemeUI()
 * @param {string} source - Call site label (e.g. 'RootWrapper')
 */
export function logColorModeState(colorMode, theme, source = '') {
  if (!isColorModeDebugEnabled()) return
  try {
    const root = document.documentElement
    const computed = root && typeof window.getComputedStyle === 'function' ? window.getComputedStyle(root) : null
    const textVar = computed?.getPropertyValue('--theme-ui-colors-text')?.trim()
    const bgVar = computed?.getPropertyValue('--theme-ui-colors-background')?.trim()
    const dataAttr = root?.getAttribute('data-theme-ui-color-mode')

    console.groupCollapsed(`[chronogrove color-mode] ${source} | mode=${colorMode} | data-attr=${dataAttr ?? 'none'}`)
    console.log('colorMode', colorMode)
    console.log('theme.colors.text', theme?.colors?.text)
    console.log('theme.colors.background', theme?.colors?.background)
    console.log('theme.rawColors?.background', theme?.rawColors?.background)
    console.log('Computed --theme-ui-colors-text', textVar || '(not set)')
    console.log('Computed --theme-ui-colors-background', bgVar || '(not set)')
    console.log('documentElement.style.backgroundColor', root?.style?.backgroundColor || '(not set)')
    console.groupEnd()
  } catch (e) {
    console.warn('[chronogrove color-mode] debug log failed', e)
  }
}
