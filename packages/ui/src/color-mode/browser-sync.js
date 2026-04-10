import { THEME_UI_COLOR_MODE_STORAGE_KEY } from './constants.js'
import { normalizeThemeUiColorMode } from './normalize.js'

export function resolveThemeUiColorMode(storageKey = THEME_UI_COLOR_MODE_STORAGE_KEY) {
  let mode
  try {
    mode = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
  } catch {
    mode = null
  }
  mode = normalizeThemeUiColorMode(mode)
  if (mode) {
    return mode
  }

  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement
    const domAttributeMode = normalizeThemeUiColorMode(htmlElement?.getAttribute('data-theme-ui-color-mode'))
    if (domAttributeMode) {
      return domAttributeMode
    }
    if (htmlElement?.classList?.contains('theme-ui-dark')) {
      return 'dark'
    }
    if (htmlElement?.classList?.contains('theme-ui-default') || htmlElement?.classList?.contains('theme-ui-light')) {
      return 'default'
    }
  }

  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? 'dark' : 'default'
}

export function syncThemeUiColorMode(storageKey = THEME_UI_COLOR_MODE_STORAGE_KEY) {
  if (typeof document === 'undefined') {
    return
  }
  const htmlElement = document.documentElement
  if (!htmlElement) {
    return
  }
  const mode = resolveThemeUiColorMode(storageKey)
  Array.from(htmlElement.classList)
    .filter(className => className.startsWith('theme-ui-'))
    .forEach(className => htmlElement.classList.remove(className))
  htmlElement.classList.add(`theme-ui-${mode}`)
  htmlElement.setAttribute('data-theme-ui-color-mode', mode)
}

export function scheduleThemeUiColorModeSync(storageKey = THEME_UI_COLOR_MODE_STORAGE_KEY) {
  syncThemeUiColorMode(storageKey)
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => syncThemeUiColorMode(storageKey))
  } else {
    setTimeout(() => syncThemeUiColorMode(storageKey), 0)
  }
}
