# `@chronogrove/ui`

Shared **Theme UI** theme, color-mode (light/dark) helpers, **Emotion** cache utilities, and small **Gatsby-independent** components used by [`gatsby-theme-chronogrove`](../../theme/README.md).

## Install

In this monorepo the theme uses `workspace:*`. In another project (after publish):

```bash
pnpm add @chronogrove/ui
```

Use **`pnpm publish`** for releases so `workspace:` dependencies in dependents are rewritten; see [pnpm workspaces — publishing](https://pnpm.io/workspaces#publishing-workspace-packages).

**Shared dependencies with `gatsby-theme-chronogrove`:** both packages depend on Theme UI, Emotion, and related libraries, with versions driven by the root [pnpm catalog](../../pnpm-workspace.yaml). When you bump those catalog entries, update **`packages/ui`** and **`theme`** in the **same change** so the theme and `@chronogrove/ui` stay aligned and you avoid duplicate or mismatched installs.

## Subpath exports

Prefer deep imports so bundles stay lean:

| Import path                         | Contents                                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `@chronogrove/ui`                   | `ChronogroveThemeProvider`                                                                         |
| `@chronogrove/ui/theme`             | Default Theme UI theme object + named exports                                                      |
| `@chronogrove/ui/provider`          | `ChronogroveThemeProvider`                                                                         |
| `@chronogrove/ui/color-mode`        | Storage key, reconcile event, SSR inline builders, `resolveChronogroveSurfaceColors`, browser sync |
| `@chronogrove/ui/emotion-cache`     | `createChronogroveEmotionCache`, `getChronogroveEmotionCache`                                      |
| `@chronogrove/ui/button`            | Theme UI `components` button                                                                       |
| `@chronogrove/ui/color-toggle`      | Theme UI + `@theme-toggles/react` toggle                                                           |
| `@chronogrove/ui/skip-nav`          | `SkipNavLink`, `SkipNavContent`                                                                    |
| `@chronogrove/ui/is-dark-mode`      | `colorMode === 'dark'` helper                                                                      |
| `@chronogrove/ui/color-utils`       | `hexToRgb`, `hexToRgba`, `BUTTON_PRIMARY_COLORS`                                                   |
| `@chronogrove/ui/action-button`     | Outline CTA as `<button>` or `<a>`                                                                 |
| `@chronogrove/ui/pagination-button` | Compact paginator control                                                                          |
| `@chronogrove/ui/lazy-load`         | Defer children until in viewport (`react-intersection-observer`)                                   |
| `@chronogrove/ui/header`            | Masthead shell (`variant: styles.Header`)                                                          |
| `@chronogrove/ui/page-header`       | Blog-style `h1` heading (`p-name`)                                                                 |
| `@chronogrove/ui/gatsby`            | Color-mode Gatsby SSR/browser helpers                                                              |

## Next.js (App Router)

Anything using `useColorMode`, `useThemeUI`, or the provider must run in a **client** component (`'use client'`). Stack **Emotion** `CacheProvider` (with the `meta[name="emotion-insertion-point"]` pattern) **outside** `ChronogroveThemeProvider`. Detailed integration is tracked as follow-up work in the repo roadmap.

## Changelog

Releases are recorded in the repository root [`CHANGELOG.md`](../../CHANGELOG.md).

## License

MIT (same as the parent repository).
