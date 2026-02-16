/**
 * Color mode debug logging. Enable by:
 *   - URL: add ?chronogrove-color-debug (works after load; no localStorage needed)
 *   - localStorage: setItem('chronogrove-debug-color-mode', '1')
 *   - window: __CHRONOGROVE_DEBUG_COLOR_MODE__ = true
 *
 * Logs color mode, theme colors, and computed CSS variables to help troubleshoot
 * stuck text (e.g. white text on light background when switching to light mode).
 */

const DEBUG_KEY = 'chronogrove-debug-color-mode'
const DEBUG_URL_PARAM = 'chronogrove-color-debug'

export function isColorModeDebugEnabled() {
  if (typeof window === 'undefined') return false
  try {
    if (window.__CHRONOGROVE_DEBUG_COLOR_MODE__ === true) return true
    const params = new URLSearchParams(window.location.search)
    if (params.get(DEBUG_URL_PARAM) !== null) return true
    return localStorage.getItem(DEBUG_KEY) === '1' || localStorage.getItem(DEBUG_KEY) === 'true'
  } catch {
    return false
  }
}

/** Call once on load when URL param is present so user sees debug is active. */
export function logColorModeDebugBanner() {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get(DEBUG_URL_PARAM) !== null) {
      console.log(
        '[chronogrove] Color mode debug enabled via ?chronogrove-color-debug. Toggle theme and check console for [chronogrove color-mode] logs.'
      )
    }
  } catch {
    return void 0
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

/**
 * Log where --theme-ui-colors-text is coming from (documentElement vs body vs first child).
 * Helps determine if Theme UI sets vars on a wrapper and our fallback targets the wrong element.
 */
export function logWhereTextVarIsSet() {
  if (!isColorModeDebugEnabled() || typeof document === 'undefined') return
  try {
    const getText = el => {
      if (!el || typeof window.getComputedStyle !== 'function') return null
      return window.getComputedStyle(el).getPropertyValue('--theme-ui-colors-text')?.trim() || null
    }
    const html = getText(document.documentElement)
    const body = getText(document.body)
    const first = document.body?.firstElementChild ? getText(document.body.firstElementChild) : null
    console.log(
      '[chronogrove color-mode] --theme-ui-colors-text: documentElement=%s body=%s firstChild=%s',
      html ?? '(unset)',
      body ?? '(unset)',
      first ?? '(unset)'
    )
  } catch (e) {
    console.warn('[chronogrove color-mode] logWhereTextVarIsSet failed', e)
  }
}

/**
 * Log when we detect a mismatch and are applying the fallback (so we can see it in console when debug is on).
 */
export function logColorModeMismatch(reason, colorMode, computedTextValue) {
  if (!isColorModeDebugEnabled()) return
  try {
    console.warn(
      '[chronogrove color-mode] MISMATCH:',
      reason,
      '| colorMode=%s | computed --theme-ui-colors-text=%s',
      colorMode,
      computedTextValue ?? '(unset)'
    )
  } catch {
    // ignore
  }
}
