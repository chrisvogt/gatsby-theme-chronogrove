/**
 * Minimal Theme UI–shaped theme object (only `colors`) for RSC / SSR `<head>` scripts.
 * No imports from `theme-ui` or the full `@chronogrove/ui/theme` module — those pull in React
 * `createContext` and cannot load in Next.js Server Components.
 *
 * Keep `colors` aligned with the default export in `packages/ui/src/theme.js`.
 */
export const chronogroveHeadTheme = {
  colors: {
    background: '#fdf8f5',
    text: '#111',
    textMuted: '#333',
    'panel-background': 'rgba(255, 255, 255, 0.45)',
    modes: {
      dark: {
        background: '#14141F',
        text: '#fff',
        textMuted: '#d8d8d8',
        'panel-background': 'rgba(20, 20, 31, 0.45)'
      }
    }
  }
}
