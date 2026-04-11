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
  return {
    defaultBackgroundHex: pickColor(colors.background) || '#fdf8f5',
    darkBackgroundHex: pickColor(dark.background) || '#14141F',
    defaultTextHex: pickColor(colors.text) || '#111',
    defaultTextMutedHex: pickColor(colors.textMuted) || '#333',
    darkTextHex: pickColor(dark.text) || '#fff',
    darkTextMutedHex: pickColor(dark.textMuted) || '#d8d8d8',
    defaultPanelBackground: pickColor(colors['panel-background']) || 'rgba(255, 255, 255, 0.45)',
    darkPanelBackground: pickColor(dark['panel-background']) || 'rgba(20, 20, 31, 0.45)',
    /** Head fallback only; panel copy usually uses `color: 'text'` — no separate `panel-text` token required. */
    defaultPanelText: pickColor(colors['panel-text']) || pickColor(colors.text) || '#111',
    darkPanelText: pickColor(dark['panel-text']) || pickColor(dark.text) || '#fff'
  }
}
