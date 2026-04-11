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

| Import path                                | Contents                                                                                                                                                                                                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@chronogrove/ui`                          | `ChronogroveThemeProvider`                                                                                                                                                                                                                            |
| `@chronogrove/ui/theme`                    | Default Theme UI theme object + named exports                                                                                                                                                                                                         |
| `@chronogrove/ui/provider`                 | `ChronogroveThemeProvider`                                                                                                                                                                                                                            |
| `@chronogrove/ui/color-mode`               | Storage key, reconcile event, SSR inline builders, `chronogroveHeadTheme` (RSC-safe), `resolveChronogroveSurfaceColors`, `useDocumentColorModeSurface`, browser sync, `reconcileThemeUiColorModeOnNavigation`                                         |
| `@chronogrove/ui/animated-page-background` | **`ChronogroveAnimatedPageBackground`** — same stack as the Gatsby home: fixed `z-index: 0`, light = solid theme background, dark = **three.js** Color Bends + scroll-linked gradient overlay and parallax (`three` is a dependency of this package). |
| `@chronogrove/ui/page-backdrop`            | **`ChronogrovePageBackdrop`** — lightweight alternative: fixed `z-index: 0` fill without WebGL (CSS gradients in dark mode). Use when you cannot ship `three`.                                                                                        |
| `@chronogrove/ui/action-card-layout`       | **`actionCardPinnedLayoutSx`** — layout `sx` for `Card variant="actionCard"` (matches GitHub pinned cards).                                                                                                                                           |
| `@chronogrove/ui/emotion-cache`            | `createChronogroveEmotionCache`, `getChronogroveEmotionCache`                                                                                                                                                                                         |
| `@chronogrove/ui/button`                   | Theme UI `components` button                                                                                                                                                                                                                          |
| `@chronogrove/ui/color-toggle`             | Theme UI + `@theme-toggles/react` `Expand`                                                                                                                                                                                                            |
| `@chronogrove/ui/color-toggle-styles`      | CSS for the toggle (`Expand.css` + sizing); `@import` once in global CSS (see `examples/chronogrove-next/app/globals.css`)                                                                                                                            |
| `@chronogrove/ui/skip-nav`                 | `SkipNavLink`, `SkipNavContent`                                                                                                                                                                                                                       |
| `@chronogrove/ui/is-dark-mode`             | `colorMode === 'dark'` helper                                                                                                                                                                                                                         |
| `@chronogrove/ui/color-utils`              | `hexToRgb`, `hexToRgba`, `BUTTON_PRIMARY_COLORS`                                                                                                                                                                                                      |
| `@chronogrove/ui/action-button`            | Outline CTA as `<button>` or `<a>`                                                                                                                                                                                                                    |
| `@chronogrove/ui/pagination-button`        | Compact paginator control                                                                                                                                                                                                                             |
| `@chronogrove/ui/lazy-load`                | Defer children until in viewport (`react-intersection-observer`)                                                                                                                                                                                      |
| `@chronogrove/ui/header`                   | Masthead shell (`variant: styles.Header`)                                                                                                                                                                                                             |
| `@chronogrove/ui/page-header`              | Blog-style `h1` heading (`p-name`)                                                                                                                                                                                                                    |
| `@chronogrove/ui/gatsby`                   | Color-mode Gatsby SSR/browser helpers                                                                                                                                                                                                                 |

## Next.js (App Router)

**Reference app:** [`examples/chronogrove-next`](../../examples/chronogrove-next) (`chronogrove-next`). Run `pnpm --filter chronogrove-next dev` from the repo root.

**Server vs client**

- **Server `layout`:** Keep the root layout a Server Component. **Do not** import `@chronogrove/ui/theme` here—it loads `theme-ui`’s `merge` and triggers React `createContext`, which Next.js disallows in RSC. For `<head>` surface hex values, pass **`chronogroveHeadTheme`** from `@chronogrove/ui/color-mode` to `resolveChronogroveSurfaceColors` (same colors as the full theme; keep them in sync when you change defaults). In `<head>`, emit **in order**: `<meta name="emotion-insertion-point" content="" />`, then the Theme UI no-flash script, HTML background script, and fallback CSS via `buildThemeUiNoFlashInlineScript`, `buildHtmlBackgroundInlineScript`, and `buildThemeUiColorModeFallbackCss` (same composition as [`buildThemeUiColorModeHeadComponents`](./src/gatsby/build-theme-ui-color-mode-head-components.js) in `@chronogrove/ui/gatsby`).
- **Client Emotion registry + theme:** Wrap the app in Emotion’s `CacheProvider` using a **per-request** cache with `key: 'css'` and Next’s `useServerInsertedHTML` so styles flush during SSR/streaming ([Next.js: CSS-in-JS](https://nextjs.org/docs/app/building-your-application/styling/css-in-js)). **Do not** rely on `getChronogroveEmotionCache()` for SSR—it is a browser-oriented singleton. Import the **full** theme from `@chronogrove/ui/theme` only inside client components. Anything using `useColorMode`, `useThemeUI`, or `ChronogroveThemeProvider` must be `'use client'`. **Order:** `CacheProvider` (registry) **outside** `ChronogroveThemeProvider` **inside** `<body>`.
- **Document surface (match Gatsby `RootWrapper`):** Inside `ChronogroveThemeProvider`, call **`useDocumentColorModeSurface`** from `@chronogrove/ui/color-mode` once (see `examples/chronogrove-next/app/providers.jsx`). It syncs `document.documentElement`’s `theme-ui-*` class, `data-theme-ui-color-mode`, and inline page background from the **resolved** Theme UI theme (`rawColors` / `colors.background`). Without it, Emotion can win the cascade over head fallback CSS and panel tokens (`bg: 'panel-background'`) may not update in dark mode after hydration.
- **Animated page background (match Gatsby home):** Render **`ChronogroveAnimatedPageBackground`** from `@chronogrove/ui/animated-page-background` inside the provider **before** your main layout (see `examples/chronogrove-next/app/providers.jsx`). For a **CSS-only** backdrop without `three`, use **`ChronogrovePageBackdrop`** from `@chronogrove/ui/page-backdrop` instead. Content should sit in a **`position: relative; z-index: 1`** wrapper.
- **Soft navigations:** After client-side route **changes** (not on the initial mount), call `reconcileThemeUiColorModeOnNavigation` from `@chronogrove/ui/color-mode` (e.g. Next `usePathname` + `useEffect` that skips the first run). Running it on mount can fight `useColorMode` toggles: reconcile reads `localStorage` and forces the DOM, while Theme UI writes `localStorage` in an effect after `setColorMode`, so a premature reconcile can leave you stuck in the previous mode. Gatsby’s equivalent is `onRouteUpdateThemeUiColorMode` (no initial `onRouteUpdate`). See `examples/chronogrove-next/app/theme-ui-color-mode-route-sync.jsx`.
- **Hydration:** Set `suppressHydrationWarning` on `<html>` and `<body>`. The inline no-flash / background scripts run before React hydrates and update `<html>` (`theme-ui-*` classes, `data-theme-ui-color-mode`, background), so the DOM no longer matches the server-rendered markup—React would warn without this flag (similar to [next-themes](https://github.com/pacocoursey/next-themes) on Next.js App Router).

**Imports:** Prefer `@chronogrove/ui/color-mode` for head builders and SPA reconcile. Reserve `@chronogrove/ui/gatsby` for Gatsby hooks (`onPreRenderHTML`, `onRenderBody` helpers).

**JSX + bundlers:** Primitives such as [`button`](./src/button.js) use [`Box`](https://theme-ui.com/components/box) from `@theme-ui/components` with an `as` prop for native elements, so `sx` works with Gatsby’s classic JSX runtime and Next’s SWC without a Theme UI file pragma. Jest uses [`babel.config.cjs`](./babel.config.cjs) (automatic JSX).

## Changelog

Releases are recorded in the repository root [`CHANGELOG.md`](../../CHANGELOG.md).

## License

MIT (same as the parent repository).
