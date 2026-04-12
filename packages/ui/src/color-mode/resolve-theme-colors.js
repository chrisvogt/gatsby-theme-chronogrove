import {
  chronogroveThemeSurfaceColorsDark,
  chronogroveThemeSurfaceColorsLight
} from '../chronogrove-theme-surface-colors.js'

function pickColor(value) {
  if (typeof value === 'string') {
    return value
  }
  return null
}

/**
 * Surface colors used by inline SSR/CSR scripts and fallbacks.
 * Pass the same Theme UI theme object as `ThemeUIProvider`.
 */
export function resolveChronogroveSurfaceColors(theme) {
  const colors = theme?.colors || {}
  const dark = colors.modes?.dark || {}
  const light = chronogroveThemeSurfaceColorsLight
  const darkSurface = chronogroveThemeSurfaceColorsDark
  return {
    defaultBackgroundHex: pickColor(colors.background) || light.background,
    darkBackgroundHex: pickColor(dark.background) || darkSurface.background,
    defaultTextHex: pickColor(colors.text) || light.text,
    defaultTextMutedHex: pickColor(colors.textMuted) || light.textMuted,
    darkTextHex: pickColor(dark.text) || darkSurface.text,
    darkTextMutedHex: pickColor(dark.textMuted) || darkSurface.textMuted,
    defaultPanelBackground: pickColor(colors['panel-background']) || light['panel-background'],
    darkPanelBackground: pickColor(dark['panel-background']) || darkSurface['panel-background'],
    /** Head fallback only; panel copy usually uses `color: 'text'` — no separate `panel-text` token required. */
    defaultPanelText: pickColor(colors['panel-text']) || pickColor(colors.text) || light.text,
    darkPanelText: pickColor(dark['panel-text']) || pickColor(dark.text) || darkSurface.text
  }
}
