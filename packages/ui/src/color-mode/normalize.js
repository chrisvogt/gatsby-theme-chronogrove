export function normalizeThemeUiColorMode(mode) {
  if (mode === 'light') {
    return 'default'
  }
  if (mode === 'dark' || mode === 'default') {
    return mode
  }
  return null
}
