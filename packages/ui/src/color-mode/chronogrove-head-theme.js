import {
  chronogroveThemeSurfaceColorsDark,
  chronogroveThemeSurfaceColorsLight
} from '../chronogrove-theme-surface-colors.js'

/**
 * Minimal Theme UI–shaped theme object (only `colors`) for RSC / SSR `<head>` scripts.
 * No imports from `theme-ui` or the full `@chronogrove/ui/theme` module — those pull in React
 * `createContext` and cannot load in Next.js Server Components.
 *
 * Surface literals come from `chronogrove-theme-surface-colors.js`, same as `theme.js`.
 */
export const chronogroveHeadTheme = {
  colors: {
    ...chronogroveThemeSurfaceColorsLight,
    modes: {
      dark: {
        ...chronogroveThemeSurfaceColorsDark
      }
    }
  }
}
