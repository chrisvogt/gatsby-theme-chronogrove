/**
 * Canonical string colors for page surface + frosted panels (default + dark mode).
 *
 * Imported by `theme.js` (full Theme UI merge) and `color-mode/chronogrove-head-theme.js`
 * (RSC-safe head theme) so SSR inline CSS and the client Theme UI theme stay aligned.
 *
 * This module must stay free of `theme-ui` / `@theme-ui/presets` / React so it can load in
 * Next.js Server Components.
 */
export const chronogroveThemeSurfaceColorsLight = {
  background: '#fdf8f5',
  text: '#111',
  textMuted: '#333',
  'panel-background': 'rgba(255, 255, 255, 0.45)'
}

export const chronogroveThemeSurfaceColorsDark = {
  background: '#14141F',
  text: '#fff',
  textMuted: '#d8d8d8',
  'panel-background': 'rgba(20, 20, 31, 0.45)'
}
